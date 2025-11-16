// Random Mascot Loader
// Add your mascot image filenames to this array
const mascots = [
    'mascot.png',
    'mascot2.png',
    // Add more mascot filenames here as you create them:
    // 'mascot3.png',
    // 'mascot4.png',
    // 'mascot5.png',
];

// Randomly select and load a mascot on page load
document.addEventListener('DOMContentLoaded', () => {
    const mascotImg = document.querySelector('.mascot');
    
    if (mascotImg && mascots.length > 0) {
        // Get random mascot from array
        const randomMascot = mascots[Math.floor(Math.random() * mascots.length)];
        
        // Update the image source
        mascotImg.src = `assets/images/${randomMascot}`;
        
        // Optional: Add a fade-in animation
        mascotImg.style.opacity = '0';
        mascotImg.style.transition = 'opacity 0.5s ease-in';
        
        // Fade in once loaded
        mascotImg.onload = () => {
            mascotImg.style.opacity = '1';
        };
        
        // Log which mascot was loaded (you can remove this later)
        console.log(`Loaded mascot: ${randomMascot}`);
    }
});
