// Dynamically remove the related articles section if there are no related articles
export function handleRelatedArticles(relatedPostsSelector = '.related-posts-section', relatedGridSelector = '.related-posts-grid') {
    document.addEventListener('DOMContentLoaded', () => {
        const relatedSection = document.querySelector(relatedPostsSelector);
        const relatedGrid = document.querySelector(relatedGridSelector);
        if (relatedSection && relatedGrid) {
            // If there are no related articles (no children in grid), remove the section
            if (!relatedGrid.children.length) {
                relatedSection.remove();
            }
        }
    });
}
