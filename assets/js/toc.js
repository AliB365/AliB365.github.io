// Table of Contents Generator
export function initTableOfContents() {
    const articleBody = document.querySelector('.article-body');
    if (!articleBody) return;

    // Find all headings and step list items
    const headings = articleBody.querySelectorAll('h2, h3');
    const stepListItems = articleBody.querySelectorAll('.steps-list > li');
    
    if (headings.length === 0 && stepListItems.length === 0) return;

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
    const allElements = [];

    // Collect all headings and steps in order
    headings.forEach(heading => {
        allElements.push({ element: heading, type: 'heading' });
    });
    
    stepListItems.forEach(step => {
        allElements.push({ element: step, type: 'step' });
    });

    // Sort by document order
    allElements.sort((a, b) => {
        return a.element.compareDocumentPosition(b.element) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
    });

    // Generate TOC items
    allElements.forEach((item, index) => {
        const element = item.element;
        
        // Add ID to element for anchor links
        const elementId = `toc-item-${index}`;
        element.id = elementId;

        // Create TOC item
        const li = document.createElement('li');
        
        let displayText = '';
        
        if (item.type === 'heading') {
            li.className = element.tagName === 'H3' ? 'toc-h3' : 'toc-h2';
            displayText = element.textContent;
        } else {
            // For steps, extract text from <strong> tag if available
            li.className = 'toc-step';
            const strongTag = element.querySelector('strong');
            if (strongTag) {
                displayText = strongTag.textContent;
            } else {
                // Fallback to first text content (up to first line break)
                const textContent = element.textContent.trim();
                displayText = textContent.split('\n')[0].substring(0, 60) + (textContent.length > 60 ? '...' : '');
            }
        }
        
        const link = document.createElement('a');
        link.href = `#${elementId}`;
        link.textContent = displayText;
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
            const offset = 120; // Scroll offset in pixels
            window.scrollTo({ 
                top: elementTop - offset, 
                behavior: 'smooth' 
            });
            
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

    allElements.forEach(item => observer.observe(item.element));
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
