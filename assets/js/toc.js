// Table of Contents Generator
export function initTableOfContents() {
    const articleBody = document.querySelector('.article-body');
    if (!articleBody) return;

    // Find all headings
    const headings = articleBody.querySelectorAll('h2, h3');
    if (headings.length === 0) return;

    // Create TOC container
    const tocContainer = document.createElement('div');
    tocContainer.className = 'toc-container';
    tocContainer.innerHTML = `
        <div class="toc-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
            Table of Contents
        </div>
        <ul class="toc-list" id="toc-list"></ul>
    `;

    // Insert TOC before article body
    const articleFull = document.querySelector('.article-full');
    if (articleFull) {
        const articleHeader = articleFull.querySelector('.article-header');
        if (articleHeader) {
            articleHeader.after(tocContainer);
        }
    }

    const tocList = document.getElementById('toc-list');

    // Generate TOC items
    headings.forEach((heading, index) => {
        // Add ID to heading for anchor links
        const headingId = `heading-${index}`;
        heading.id = headingId;

        // Create TOC item
        const li = document.createElement('li');
        li.className = heading.tagName === 'H3' ? 'toc-h3' : 'toc-h2';
        
        const link = document.createElement('a');
        link.href = `#${headingId}`;
        link.textContent = heading.textContent;
        link.addEventListener('click', (e) => {
            e.preventDefault();
            heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Update active state
            document.querySelectorAll('.toc-list a').forEach(a => a.classList.remove('active'));
            link.classList.add('active');
        });

        li.appendChild(link);
        tocList.appendChild(li);
    });

    // Highlight active section on scroll
    const observerOptions = {
        rootMargin: '-100px 0px -66%',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                const tocLink = tocList.querySelector(`a[href="#${id}"]`);
                if (tocLink) {
                    document.querySelectorAll('.toc-list a').forEach(a => a.classList.remove('active'));
                    tocLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    headings.forEach(heading => observer.observe(heading));
}

// Collapsible sections
export function initCollapsibleSections() {
    const collapsibleSections = document.querySelectorAll('.collapsible-section');
    
    collapsibleSections.forEach(section => {
        const header = section.querySelector('.collapsible-header');
        
        header.addEventListener('click', () => {
            section.classList.toggle('active');
        });
    });
}
