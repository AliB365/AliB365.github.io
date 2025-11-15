# Autonomous Agentics Blog

A modern, dynamic blog website for exploring autonomous agents, AI systems, and intelligent automation.

## 🤖 Features

- **Dynamic Content Loading**: Blog posts are loaded from a JSON file, making content management simple
- **Responsive Design**: Fully responsive layout that works on desktop, tablet, and mobile devices
- **Category Filtering**: Filter posts by AI, Automation, Agents, and Tutorials
- **Featured Posts**: Highlight your most important content
- **Modal Article View**: Read full articles in a clean, focused modal overlay
- **Pagination**: Automatically handles large numbers of posts
- **Modern UI**: Beautiful design with smooth animations and the Autonomous Agentics brand colors

## 📁 Project Structure

```
AutonomousAgentics/
├── index.html              # Main HTML file
├── package.json            # Project configuration
├── assets/
│   ├── css/
│   │   └── style.css      # All styles
│   ├── js/
│   │   └── blog.js        # Blog functionality
│   └── images/
│       ├── mascot.png     # Your robot mascot (full body)
│       └── favicon.png    # Your robot favicon (head only)
├── data/
│   └── posts.json         # Blog posts content
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

### Quick Start

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

## 🌐 Deployment

### GitHub Pages

1. Push your code to GitHub
2. Go to repository Settings → Pages
3. Select your branch and root folder
4. Your site will be available at `https://yourusername.github.io/repository-name`

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
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **Vanilla JavaScript**: No frameworks, pure JS for performance
- **Google Fonts**: Inter font family
- **JSON**: Content management

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
2. **Customize Content**: Edit the About section in `index.html`
3. **Add Social Links**: Update the social media links in the Contact section
4. **Write Your First Post**: Edit `data/posts.json` to add your own content
5. **Deploy**: Share your blog with the world!

---

**Happy Blogging! 🚀**

For questions or issues, feel free to reach out or consult the code comments for guidance.
