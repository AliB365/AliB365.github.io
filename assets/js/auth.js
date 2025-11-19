// Firebase Authentication State Management
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    setPersistence,
    browserLocalPersistence
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Initialize Firebase
let auth;
let currentUser = null;

// Wait for config to load
async function initFirebase() {
    if (window.firebaseConfig) {
        const app = initializeApp(window.firebaseConfig);
        window.firebaseApp = app; // Make Firebase app available globally
        auth = getAuth(app);
        const db = getFirestore(app);
        
        // Set auth persistence for faster subsequent loads
        try {
            await setPersistence(auth, browserLocalPersistence);
        } catch (error) {
            console.log('Auth persistence error:', error);
        }
        
        // Listen for auth state changes
        onAuthStateChanged(auth, async (user) => {
            currentUser = user;
            window.currentUser = user; // Make available globally for comments
            
            let displayName = user ? (user.displayName || user.email.split('@')[0]) : null;
            
            // Update UI immediately with basic info
            if (authManagerInstance) {
                authManagerInstance.user = user ? {
                    id: user.uid,
                    email: user.email,
                    name: displayName
                } : null;
                authManagerInstance.notifyListeners();
            }
            
            // Dispatch event immediately
            window.dispatchEvent(new CustomEvent('auth-state-changed', {
                detail: { user: user }
            }));
            
            // Load custom display name from Firestore asynchronously (non-blocking)
            if (user) {
                loadCustomDisplayName(user, db);
            }
        });
    }
}

// Load custom display name without blocking UI
async function loadCustomDisplayName(user, db) {
    try {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists() && userDoc.data().displayName) {
            const displayName = userDoc.data().displayName;
            
            // Update auth manager with custom name
            if (authManagerInstance && authManagerInstance.user) {
                authManagerInstance.user.name = displayName;
                authManagerInstance.notifyListeners();
            }
        }
    } catch (error) {
        console.log('Could not load custom display name:', error);
    }
}

class AuthManager {
    constructor() {
        this.user = null;
        this.listeners = [];
    }

    // Subscribe to auth state changes
    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(cb => cb !== callback);
        };
    }

    // Notify all listeners of state change
    notifyListeners() {
        this.listeners.forEach(callback => callback(this.user));
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.user;
    }

    // Get current user
    getUser() {
        return this.user;
    }

    // Sign up
    async signup(email, password, name) {
        try {
            if (!auth) {
                throw new Error('Firebase not initialized. Please check your configuration.');
            }

            // Email validation
            if (!this.isValidEmail(email)) {
                throw new Error('Invalid email format');
            }

            // Password validation
            if (password.length < 6) {
                throw new Error('Password must be at least 6 characters');
            }

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            
            // Set display name if provided
            if (name) {
                await updateProfile(userCredential.user, {
                    displayName: name
                });
            }

            this.user = {
                id: userCredential.user.uid,
                email: userCredential.user.email,
                name: name || email.split('@')[0]
            };

            return { success: true, user: this.user };
        } catch (error) {
            console.error('Signup error:', error);
            return { success: false, error: this.getErrorMessage(error) };
        }
    }

    // Sign in
    async signin(email, password) {
        try {
            if (!auth) {
                throw new Error('Firebase not initialized. Please check your configuration.');
            }

            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            
            this.user = {
                id: userCredential.user.uid,
                email: userCredential.user.email,
                name: userCredential.user.displayName || email.split('@')[0]
            };

            return { success: true, user: this.user };
        } catch (error) {
            console.error('Signin error:', error);
            return { success: false, error: this.getErrorMessage(error) };
        }
    }

    // Sign out
    async signout() {
        try {
            if (auth) {
                await signOut(auth);
            }
            this.user = null;
            return { success: true };
        } catch (error) {
            console.error('Signout error:', error);
            return { success: false, error: error.message };
        }
    }

    // Verify session (handled by onAuthStateChanged)
    async verifySession() {
        return !!currentUser;
    }

    // Email validation helper
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Firebase error message helper
    getErrorMessage(error) {
        const errorMessages = {
            'auth/email-already-in-use': 'This email is already registered',
            'auth/invalid-email': 'Invalid email address',
            'auth/operation-not-allowed': 'Operation not allowed',
            'auth/weak-password': 'Password is too weak',
            'auth/user-disabled': 'This account has been disabled',
            'auth/user-not-found': 'Invalid email or password',
            'auth/wrong-password': 'Invalid email or password',
            'auth/invalid-credential': 'Invalid email or password',
            'auth/too-many-requests': 'Too many failed attempts. Please try again later',
            'auth/network-request-failed': 'Network error. Please check your connection'
        };

        return errorMessages[error.code] || error.message || 'An error occurred';
    }
}

// Global auth manager instance
const authManagerInstance = new AuthManager();
const authManager = authManagerInstance;

// Auth UI Manager
class AuthUI {
    constructor(authManager) {
        this.authManager = authManager;
        this.initializeModals();
        this.initializeAuthButtons();
        this.setupEventListeners();
    }

    initializeModals() {
        // Create auth modals if they don't exist
        if (!document.getElementById('auth-modal')) {
            const modalHTML = `
                <div id="auth-modal" class="modal auth-modal">
                    <div class="modal-content auth-modal-content">
                        <button class="modal-close auth-modal-close" aria-label="Close">&times;</button>
                        
                        <!-- Sign In Form -->
                        <div id="signin-form-container" class="auth-form-container">
                            <h2 class="auth-title">Sign In</h2>
                            <form id="signin-form" class="auth-form">
                                <div class="form-group">
                                    <label for="signin-email">Email</label>
                                    <input type="email" id="signin-email" name="email" required placeholder="your@email.com">
                                </div>
                                <div class="form-group">
                                    <label for="signin-password">Password</label>
                                    <input type="password" id="signin-password" name="password" required placeholder="••••••••">
                                </div>
                                <div id="signin-error" class="auth-error"></div>
                                <button type="submit" class="btn btn-primary auth-submit-btn">Sign In</button>
                                <p class="auth-switch">
                                    Don't have an account? <a href="#" id="show-signup">Sign up</a>
                                </p>
                            </form>
                        </div>

                        <!-- Sign Up Form -->
                        <div id="signup-form-container" class="auth-form-container" style="display: none;">
                            <h2 class="auth-title">Create Account</h2>
                            <form id="signup-form" class="auth-form">
                                <div class="form-group">
                                    <label for="signup-name">Name (optional)</label>
                                    <input type="text" id="signup-name" name="name" placeholder="Your Name">
                                </div>
                                <div class="form-group">
                                    <label for="signup-email">Email</label>
                                    <input type="email" id="signup-email" name="email" required placeholder="your@email.com">
                                </div>
                                <div class="form-group">
                                    <label for="signup-password">Password</label>
                                    <input type="password" id="signup-password" name="password" required placeholder="••••••••" minlength="6">
                                    <small class="form-hint">At least 6 characters</small>
                                </div>
                                <div id="signup-error" class="auth-error"></div>
                                <button type="submit" class="btn btn-primary auth-submit-btn">Create Account</button>
                                <p class="auth-switch">
                                    Already have an account? <a href="#" id="show-signin">Sign in</a>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        }
    }

    initializeAuthButtons() {
        // Add auth buttons to navbar if they don't exist
        const navLinks = document.querySelector('.nav-links');
        const existingContainer = document.getElementById('auth-nav-container');
        
        if (navLinks && !existingContainer) {
            const authNavHTML = `
                <li id="auth-nav-container">
                    <div id="auth-buttons" class="auth-buttons">
                        <button id="signin-btn" class="btn btn-secondary">Sign In</button>
                    </div>
                    <div id="user-menu" class="user-menu" style="display: none;">
                        <button id="user-menu-btn" class="user-menu-btn">
                            <span id="user-name-display"></span>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                                <path d="M6 9L1 4h10z"/>
                            </svg>
                        </button>
                        <div id="user-dropdown" class="user-dropdown">
                            <div class="user-info">
                                <div class="user-email" id="user-email-display"></div>
                            </div>
                            <button id="signout-btn" class="dropdown-item">Sign Out</button>
                        </div>
                    </div>
                </li>
            `;
            navLinks.insertAdjacentHTML('beforeend', authNavHTML);
        }
        
        // If user is already authenticated when UI initializes, update immediately
        if (this.authManager.user) {
            this.updateUI(this.authManager.user);
        }
    }

    setupEventListeners() {
        // Modal close
        const closeBtn = document.querySelector('.auth-modal-close');
        const modal = document.getElementById('auth-modal');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }
        
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }

        // Show signin modal
        const signinBtn = document.getElementById('signin-btn');
        if (signinBtn) {
            signinBtn.addEventListener('click', () => this.showSigninModal());
        }

        // Form switching
        const showSignup = document.getElementById('show-signup');
        const showSignin = document.getElementById('show-signin');
        
        if (showSignup) {
            showSignup.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchToSignup();
            });
        }
        
        if (showSignin) {
            showSignin.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchToSignin();
            });
        }

        // Form submissions
        const signinForm = document.getElementById('signin-form');
        const signupForm = document.getElementById('signup-form');
        
        if (signinForm) {
            signinForm.addEventListener('submit', (e) => this.handleSignin(e));
        }
        
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => this.handleSignup(e));
        }

        // Sign out
        const signoutBtn = document.getElementById('signout-btn');
        if (signoutBtn) {
            signoutBtn.addEventListener('click', () => this.handleSignout());
        }

        // User menu toggle
        const userMenuBtn = document.getElementById('user-menu-btn');
        const userDropdown = document.getElementById('user-dropdown');
        
        if (userMenuBtn && userDropdown) {
            userMenuBtn.addEventListener('click', () => {
                userDropdown.style.display = userDropdown.style.display === 'block' ? 'none' : 'block';
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.user-menu')) {
                    userDropdown.style.display = 'none';
                }
            });
        }

        // Subscribe to auth state changes
        this.authManager.subscribe((user) => {
            this.updateUI(user);
        });
    }

    showSigninModal() {
        const modal = document.getElementById('auth-modal');
        if (modal) {
            modal.style.display = 'flex';
            this.switchToSignin();
        }
    }

    showSignupModal() {
        const modal = document.getElementById('auth-modal');
        if (modal) {
            modal.style.display = 'flex';
            this.switchToSignup();
        }
    }

    closeModal() {
        const modal = document.getElementById('auth-modal');
        if (modal) {
            modal.style.display = 'none';
            this.clearForms();
        }
    }

    switchToSignin() {
        document.getElementById('signin-form-container').style.display = 'block';
        document.getElementById('signup-form-container').style.display = 'none';
        this.clearForms();
    }

    switchToSignup() {
        document.getElementById('signin-form-container').style.display = 'none';
        document.getElementById('signup-form-container').style.display = 'block';
        this.clearForms();
    }

    clearForms() {
        const signinForm = document.getElementById('signin-form');
        const signupForm = document.getElementById('signup-form');
        const signinError = document.getElementById('signin-error');
        const signupError = document.getElementById('signup-error');
        
        if (signinForm) signinForm.reset();
        if (signupForm) signupForm.reset();
        if (signinError) signinError.textContent = '';
        if (signupError) signupError.textContent = '';
    }

    async handleSignin(e) {
        e.preventDefault();
        
        const email = document.getElementById('signin-email').value;
        const password = document.getElementById('signin-password').value;
        const errorDiv = document.getElementById('signin-error');
        const submitBtn = e.target.querySelector('button[type="submit"]');
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Signing in...';
        errorDiv.textContent = '';
        
        const result = await this.authManager.signin(email, password);
        
        submitBtn.disabled = false;
        submitBtn.textContent = 'Sign In';
        
        if (result.success) {
            this.closeModal();
        } else {
            errorDiv.textContent = result.error;
        }
    }

    async handleSignup(e) {
        e.preventDefault();
        
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const errorDiv = document.getElementById('signup-error');
        const submitBtn = e.target.querySelector('button[type="submit"]');
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Creating account...';
        errorDiv.textContent = '';
        
        const result = await this.authManager.signup(email, password, name);
        
        submitBtn.disabled = false;
        submitBtn.textContent = 'Create Account';
        
        if (result.success) {
            this.closeModal();
        } else {
            errorDiv.textContent = result.error;
        }
    }

    async handleSignout() {
        await this.authManager.signout();
        const userDropdown = document.getElementById('user-dropdown');
        if (userDropdown) {
            userDropdown.style.display = 'none';
        }
    }

    updateUI(user) {
        const authContainer = document.getElementById('auth-nav-container');
        const authButtons = document.getElementById('auth-buttons');
        const userMenu = document.getElementById('user-menu');
        const userNameDisplay = document.getElementById('user-name-display');
        const userEmailDisplay = document.getElementById('user-email-display');
        
        // Remove loading state
        if (authButtons) {
            authButtons.classList.remove('loading');
        }
        
        if (user) {
            // Show user menu, hide auth buttons
            if (authButtons) authButtons.style.display = 'none';
            if (userMenu) userMenu.style.display = 'block';
            if (userNameDisplay) userNameDisplay.textContent = user.name;
            if (userEmailDisplay) userEmailDisplay.textContent = user.email;
        } else {
            // Show auth buttons, hide user menu
            if (authButtons) authButtons.style.display = 'flex';
            if (userMenu) userMenu.style.display = 'none';
        }
    }
}

// Initialize auth UI when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    // Add loading state to auth buttons
    const authButtons = document.getElementById('auth-buttons');
    if (authButtons) {
        authButtons.classList.add('loading');
    }
    
    // Wait for firebase-config.js to load
    const waitForConfig = () => {
        return new Promise((resolve) => {
            if (window.firebaseConfig) {
                resolve();
            } else {
                const checkInterval = setInterval(() => {
                    if (window.firebaseConfig) {
                        clearInterval(checkInterval);
                        resolve();
                    }
                }, 50);
            }
        });
    };
    
    await waitForConfig();
    
    // Initialize Firebase
    await initFirebase();
    
    // Initialize auth UI
    const authUI = new AuthUI(authManager);
    
    // Check if already authenticated (Firebase persistence will restore this)
    if (auth && auth.currentUser) {
        console.log('User already authenticated on load:', auth.currentUser.email);
        window.currentUser = auth.currentUser;
        const displayName = auth.currentUser.displayName || auth.currentUser.email.split('@')[0];
        authManager.user = {
            id: auth.currentUser.uid,
            email: auth.currentUser.email,
            name: displayName
        };
        authManager.notifyListeners();
    }
});
