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
            <span>Table of Contents</span>
            <span class="toc-toggle" style="margin-left: auto;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </span>
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
    const tocTitle = tocContainer.querySelector('.toc-title');
    const tocToggle = tocContainer.querySelector('.toc-toggle');
    
    // Add collapsible functionality
    tocTitle.addEventListener('click', () => {
        tocList.classList.toggle('collapsed');
        tocToggle.classList.toggle('collapsed');
    });
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

    // Generate TOC items with collapsible H2 sections
    let currentH2Li = null;
    let currentH2SubList = null;
    
    allElements.forEach((item, index) => {
        const element = item.element;
        
        // Add ID to element for anchor links
        const elementId = `toc-item-${index}`;
        element.id = elementId;

        // Create TOC item
        const li = document.createElement('li');
        
        let displayText = '';
        
        if (item.type === 'heading') {
            if (element.tagName === 'H2') {
                // Create H2 item with toggle
                li.className = 'toc-h2 collapsed';
                displayText = element.textContent;
                
                const toggleIcon = document.createElement('span');
                toggleIcon.className = 'toc-h2-toggle';
                toggleIcon.innerHTML = `
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                `;
                
                const link = document.createElement('a');
                link.href = `#${elementId}`;
                link.textContent = displayText;
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
                    const offset = 120;
                    window.scrollTo({ 
                        top: elementTop - offset, 
                        behavior: 'smooth' 
                    });
                    
                    document.querySelectorAll('.toc-list a').forEach(a => a.classList.remove('active'));
                    link.classList.add('active');
                });
                
                li.appendChild(toggleIcon);
                li.appendChild(link);
                
                // Create sub-list for H3s and steps
                currentH2SubList = document.createElement('ul');
                currentH2SubList.className = 'toc-sublist';
                li.appendChild(currentH2SubList);
                
                // Add toggle functionality
                toggleIcon.addEventListener('click', (e) => {
                    e.stopPropagation();
                    li.classList.toggle('collapsed');
                });
                
                tocList.appendChild(li);
                currentH2Li = li;
                
            } else if (element.tagName === 'H3') {
                // Add H3 to current H2's sublist
                li.className = 'toc-h3';
                displayText = element.textContent;
                
                const link = document.createElement('a');
                link.href = `#${elementId}`;
                link.textContent = displayText;
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
                    const offset = 120;
                    window.scrollTo({ 
                        top: elementTop - offset, 
                        behavior: 'smooth' 
                    });
                    
                    document.querySelectorAll('.toc-list a').forEach(a => a.classList.remove('active'));
                    link.classList.add('active');
                });
                
                li.appendChild(link);
                
                if (currentH2SubList) {
                    currentH2SubList.appendChild(li);
                } else {
                    tocList.appendChild(li);
                }
            }
        } else {
            // For steps, extract text from <strong> tag if available
            li.className = 'toc-step';
            const strongTag = element.querySelector('strong');
            if (strongTag) {
                displayText = strongTag.textContent;
            } else {
                const textContent = element.textContent.trim();
                displayText = textContent.split('\n')[0].substring(0, 60) + (textContent.length > 60 ? '...' : '');
            }
            
            const link = document.createElement('a');
            link.href = `#${elementId}`;
            link.textContent = displayText;
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
                const offset = 120;
                window.scrollTo({ 
                    top: elementTop - offset, 
                    behavior: 'smooth' 
                });
                
                document.querySelectorAll('.toc-list a').forEach(a => a.classList.remove('active'));
                link.classList.add('active');
            });
            
            li.appendChild(link);
            
            if (currentH2SubList) {
                currentH2SubList.appendChild(li);
            } else {
                tocList.appendChild(li);
            }
        }
    });
    
    // Remove toggle icon from H2s that have no subsections
    tocList.querySelectorAll('.toc-h2').forEach(h2Li => {
        const sublist = h2Li.querySelector('.toc-sublist');
        if (sublist && sublist.children.length === 0) {
            const toggle = h2Li.querySelector('.toc-h2-toggle');
            if (toggle) {
                toggle.style.display = 'none';
            }
            h2Li.classList.remove('collapsed');
        }
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
