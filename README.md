# Autonomous Agentic Blog

A modern, dynamic blog website for exploring autonomous agents, AI systems, and intelligent automation.

## 🤖 Features

### Core Blog Features
- **Dynamic Content Loading**: Blog posts are loaded from a JSON file, making content management simple
- **Responsive Design**: Fully responsive layout that works on desktop, tablet, and mobile devices
- **Category Filtering**: Filter posts by AI, Automation, Agents, and Tutorials
- **Featured Posts**: Highlight your most important content
- **Individual Post Pages**: Each post has its own SEO-optimized HTML page
- **Pagination**: Automatically handles large numbers of posts
- **Modern UI**: Beautiful design with smooth animations and the Autonomous Agentic brand colors

### Engagement Features
- **Like & Bookmark System**: Save favorite posts and track what you've liked
- **Reading Progress Bar**: Visual indicator showing how far through an article you've read
- **Share Buttons**: Share articles on Twitter, LinkedIn, Facebook, or copy the link
- **Table of Contents**: Auto-generated TOC for easy navigation in long articles
- **Related Posts**: Dynamically suggested articles based on tags
- **Comments System**: Threaded comments with replies (requires Firebase)

### User Features
- **Google Authentication**: Sign in with Google to access personalized features
- **User Profile**: Personal dashboard showing reading stats and history
- **Reading Tracking**: Automatic tracking of articles read and time spent
- **Reading Streak**: Gamified daily reading streak counter
- **Achievement System**: Unlock 9 different badges for engagement milestones
- **Personal Stats**: Track total articles read, comments posted, and bookmarks saved
- **Preferences**: Customize font size and notification settings
- **Reading History**: View all articles you've read with timestamps

## 📁 Project Structure

```
AutonomousAgentics/
├── index.html              # Main HTML file
├── profile.html            # User profile/dashboard page
├── package.json            # Project configuration
├── firebase-config.js      # Firebase configuration
├── new-post.ps1           # PowerShell script to generate new posts
├── assets/
│   ├── css/
│   │   └── style.css      # All styles (including engagement features)
│   ├── js/
│   │   ├── blog.js        # Blog listing functionality
│   │   ├── article.js     # Article display
│   │   ├── shared.js      # Firebase utilities
│   │   ├── auth.js        # Authentication
│   │   ├── comments.js    # Comment system
│   │   ├── likes.js       # Like/bookmark/share system
│   │   ├── progress-bar.js # Reading progress
│   │   ├── toc.js         # Table of contents generator
│   │   ├── profile.js     # User stats and tracking
│   │   ├── achievements.js # Badge system
│   │   └── preferences.js  # User settings
│   └── images/
│       ├── mascot.png     # Your robot mascot (full body)
│       └── favicon.png    # Your robot favicon (head only)
├── data/
│   └── posts-index.json   # Blog posts index
├── posts/
│   ├── post-template.html # Template for new posts
│   └── *.html            # Individual blog post pages
└── README.md              # This file
```

## 🚀 Getting Started

### 1. Add Your Images

Save your mascot and favicon images to the `assets/images/` folder:
- `mascot.png` - The full robot mascot image
- `favicon.png` - The robot head for the favicon

### 2. Run the Blog Locally

**Option A: Using Node.js (Recommended)**
```powershell
npm start
```
This will start a local server at http://localhost:3000

**Option B: Using Python**
```powershell
python -m http.server 3000
```

**Option C: Using VS Code Live Server Extension**
- Install the "Live Server" extension
- Right-click on `index.html` and select "Open with Live Server"

### 3. View Your Blog

Open your browser and navigate to `http://localhost:3000`

## ✍️ Adding New Blog Posts

Blog posts are now individual HTML files for better SEO and performance! Each post has its own dedicated page that search engines can index.

### Quick Start - Using the Generator Script (Recommended)

The easiest way to create a new post is with the automated script:

```powershell
.\new-post.ps1
```

The script will:
- ✅ Ask for post details (title, excerpt, author, tags, etc.)
- ✅ Generate a URL-friendly slug automatically
- ✅ Create the HTML file with proper structure
- ✅ Add the post to `data/posts-index.json`
- ✅ Set up all metadata and formatting
- ✅ Create starter content you can customize

**Example:**
```powershell
PS> .\new-post.ps1

Enter post title: My Awesome AI Article
Enter post excerpt: Learn about the latest AI trends
Enter author name: John Doe
Enter estimated read time: 7
Enter tags: ai,agents
Make this featured? (y/n): n

✓ Created: posts/my-awesome-ai-article.html
✓ Added to blog index
```

### Manual Method

If you prefer to create posts manually:

1. **Copy the template** from `posts/README.md`
2. **Create your HTML file** in the `posts/` directory (e.g., `posts/my-new-post.html`)
3. **Add entry to index** in `data/posts-index.json`
4. **Done!** Your post appears on the blog automatically

### Adding a Post to the Index

Edit `data/posts-index.json` and add a new entry:

```json
{
  "id": "my-new-post",
  "title": "My Awesome Blog Post",
  "excerpt": "A brief description that appears on the blog grid",
  "url": "posts/my-new-post.html",
  "image": "https://example.com/image.jpg",
  "date": "2025-11-15",
  "author": "Your Name",
  "readTime": 5,
  "tags": ["ai", "automation"],
  "featured": false
}
```

### Why Individual HTML Files?

- **SEO Optimized**: Each post has unique title, meta description, and URL
- **Fast Loading**: No JSON parsing or client-side rendering
- **Search Engine Friendly**: Pages are fully indexable
- **Scalable**: Performance stays consistent as blog grows
- **Simple**: Easy to edit, backup, and version control

See `posts/README.md` for the complete HTML template and detailed instructions.

## 🎨 Customization

### Changing Colors

Edit `assets/css/style.css` and modify the CSS variables at the top:

```css
:root {
    --primary-color: #2DD4BF;     /* Teal from mascot */
    --secondary-color: #FBB040;   /* Orange from mascot */
    --dark-bg: #1A1A1A;           /* Main background */
    /* ... more colors ... */
}
```

### Modifying Layout

- **Posts per page**: Edit `POSTS_PER_PAGE` in `assets/js/blog.js`
- **Available tags**: Add new tags to the filter buttons in `index.html` and use them in your posts

### Adding Custom Sections

The HTML structure is modular. You can add new sections by following the existing pattern in `index.html`.

## 🔥 Firebase Setup (Optional but Recommended)

To enable all engagement features (likes, bookmarks, comments, reading tracking, achievements), you'll need to set up Firebase:

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup wizard
3. Enable Google Analytics (optional)

### 2. Enable Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Google** provider
3. Add your domain to authorized domains

### 3. Create Firestore Database

1. Go to **Firestore Database** → **Create database**
2. Start in **production mode**
3. Choose a location close to your users

### 4. Set Up Security Rules

Go to **Firestore Database** → **Rules** and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Comments collection
    match /comments/{commentId} {
      allow read: if true;
      allow create: if request.auth != null 
        && request.resource.data.userId == request.auth.uid
        && request.resource.data.postId is string
        && request.resource.data.text is string;
      allow delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    // Likes collection
    match /likes/{likeId} {
      allow read: if true;
      allow write: if request.auth != null 
        && request.resource.data.userId == request.auth.uid
        && request.resource.data.postId is string;
    }
    
    // Bookmarks collection
    match /bookmarks/{bookmarkId} {
      allow read: if true;
      allow write: if request.auth != null 
        && request.resource.data.userId == request.auth.uid
        && request.resource.data.postId is string;
    }
    
    // Reading history
    match /readingHistory/{docId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow write: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
    
    // User stats
    match /userStats/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Achievements
    match /achievements/{docId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow write: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
    
    // Preferences
    match /preferences/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 5. Create Firestore Indexes

Go to **Firestore Database** → **Indexes** → **Composite** and create these indexes:

1. **Collection**: `comments`, **Fields**: `postId` (Ascending), `createdAt` (Descending)
2. **Collection**: `likes`, **Fields**: `postId` (Ascending), `createdAt` (Descending)
3. **Collection**: `bookmarks`, **Fields**: `userId` (Ascending), `createdAt` (Descending)
4. **Collection**: `readingHistory`, **Fields**: `userId` (Ascending), `timestamp` (Descending)

### 6. Configure Your App

1. In Firebase Console, go to **Project Settings** → **Your apps**
2. Click the web icon (</>) to add a web app
3. Register your app and copy the config object
4. Create `firebase-config.js` in your project root:

```javascript
// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR-API-KEY",
  authDomain: "YOUR-PROJECT.firebaseapp.com",
  projectId: "YOUR-PROJECT-ID",
  storageBucket: "YOUR-PROJECT.appspot.com",
  messagingSenderId: "YOUR-SENDER-ID",
  appId: "YOUR-APP-ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
```

**Without Firebase**: The blog will still work, but engagement features (likes, comments, tracking) won't be functional.

## 🌐 Deployment

### GitHub Pages

1. Push your code to GitHub
2. Go to repository Settings → Pages
3. Select your branch and root folder
4. Your site will be available at `https://yourusername.github.io/repository-name`
5. **Note**: Add your GitHub Pages domain to Firebase authorized domains

### Netlify

1. Drag and drop your folder to [Netlify Drop](https://app.netlify.com/drop)
2. Or connect your GitHub repository for automatic deployments

### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in your project folder
3. Follow the prompts

## 📝 Content Tips

1. **Use High-Quality Images**: Images make your posts more engaging. Use services like [Unsplash](https://unsplash.com) for free stock photos.

2. **Write Clear Excerpts**: The excerpt is what draws readers in. Keep it concise and compelling.

3. **Tag Appropriately**: Use relevant tags to help readers find related content.

4. **Format for Readability**: Break up long paragraphs, use headings, and include lists for easier scanning.

5. **Update Regularly**: Keep your blog fresh with regular posts.

## 🔧 Troubleshooting

**Posts not loading?**
- Check that `data/posts.json` is valid JSON (use [JSONLint](https://jsonlint.com))
- Make sure your server is running
- Check browser console for errors (F12 → Console tab)

**Images not showing?**
- Verify image paths are correct
- For local images, they should be relative to the project root
- For external images, make sure URLs are complete and accessible

**Styling looks broken?**
- Clear your browser cache (Ctrl+F5)
- Check that `assets/css/style.css` exists and is linked correctly

## 📚 Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Grid, Flexbox, and CSS Variables
- **JavaScript ES6+**: Modular JavaScript with ES6 imports
- **Firebase**: Backend services (Authentication, Firestore Database)
- **Google Fonts**: Inter font family
- **JSON**: Content management and data structure

## 🤝 Contributing

This is your personal blog, but if you want to share improvements:
1. Make your changes
2. Test thoroughly
3. Document what you changed
4. Share with the community!

## 📄 License

MIT License - feel free to use and modify as needed.

## 🎯 Next Steps

1. **Add Your Images**: Save `mascot.png` and `favicon.png` to `assets/images/`
2. **Set Up Firebase**: Follow the Firebase Setup section above to enable engagement features
3. **Customize Content**: Edit the About section in `index.html`
4. **Add Social Links**: Update the social media links in the Contact section
5. **Create Your First Post**: Run `.\new-post.ps1` to generate a new blog post with all features
6. **Test Features**: Sign in with Google and try liking, bookmarking, and commenting
7. **Deploy**: Share your blog with the world!

---

**Happy Blogging! 🚀**

For questions or issues, check the detailed guides in `README.md` and `posts/README.md`.
