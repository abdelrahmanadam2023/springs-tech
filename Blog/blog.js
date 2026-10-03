/* Blog page: loads articles from the database (falls back to the built-in cards). */
document.addEventListener("DOMContentLoaded", async () => {

    if (!window.SpringsDB) return;

    const rows = await SpringsDB.select("blog_posts", "select=*&is_published=eq.true&order=sort_order.asc");
    if (!rows) return;

    const { esc, img } = SpringsDB;

    const featured = rows.find(r => r.is_featured);
    const articles = rows.filter(r => !r.is_featured);

    const featuredBox = document.querySelector(".featured-card");

    if (featured && featuredBox) {
        featuredBox.innerHTML = `
            <div class="featured-visual has-img">
                ${img(featured.image_url)}
                <span class="featured-number">01</span>
                <div class="featured-visual-content">
                    <span>SPRINGS TECH</span>
                    <strong>TECHNOLOGY<br>INSIGHTS</strong>
                </div>
            </div>
            <div class="featured-content">
                <span class="article-category">${esc(featured.category)}</span>
                <h2>${esc(featured.title)}</h2>
                <p>${esc(featured.excerpt)}</p>
                <div class="article-meta">
                    <span>${esc(featured.author)}</span>
                    <span>${esc(featured.footer_label)}</span>
                </div>
            </div>`;
    }

    const grid = document.querySelector(".articles-grid");

    if (grid && articles.length) {
        grid.innerHTML = articles.map((a, i) => `
        <article class="article-card">
            <div class="article-image article-image-${(i % 6) + 1} has-img">
                ${img(a.image_url)}
                <span>${esc(a.tag_label)}</span>
            </div>
            <div class="article-content">
                <span class="article-category">${esc(a.category)}</span>
                <h3>${esc(a.title)}</h3>
                <p>${esc(a.excerpt)}</p>
                <div class="article-bottom">
                    <span>${esc(a.footer_label)}</span>
                    <span>→</span>
                </div>
            </div>
        </article>`).join("");
    }
});
