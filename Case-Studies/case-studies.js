/* Case Studies page: loads from the database (falls back to the built-in cards). */
document.addEventListener("DOMContentLoaded", async () => {

    const grid = document.querySelector(".case-grid");
    if (!grid || !window.SpringsDB) return;

    const rows = await SpringsDB.select("case_studies", "select=*&is_published=eq.true&order=sort_order.asc");
    if (!rows) return;

    const { esc, img, pad } = SpringsDB;

    grid.innerHTML = rows.map((c, i) => {

        const results = Array.isArray(c.results) ? c.results : [];
        const features = Array.isArray(c.features) ? c.features : [];

        const resultsHtml = results.length ? `
            <div class="case-results">
                ${results.map(r => `
                <div class="result">
                    <strong>${esc(r.value)}</strong>
                    <span>${esc(r.label)}</span>
                </div>`).join("")}
            </div>` : "";

        const featuresHtml = features.length ? `
            <div class="case-features">
                ${features.map(f => `<span>${esc(f)}</span>`).join("")}
            </div>` : "";

        return `
        <article class="case-card${c.is_featured ? " featured" : ""}">
            <div class="case-card-visual visual-${esc(c.slug)} has-img">
                ${img(c.image_url)}
                <span class="case-number">${pad(i + 1)}</span>
                <div class="visual-content">
                    <span>${esc(c.platform)}</span>
                    <strong>${esc(c.client)}</strong>
                </div>
            </div>
            <div class="case-card-content">
                <span class="case-tag">${esc(c.tag)}</span>
                <h3>${esc(c.title)}</h3>
                <p>${esc(c.description)}</p>
                ${resultsHtml}
                ${featuresHtml}
                <div class="case-meta">
                    <span>${esc(c.location)}</span>
                    <span>${esc(c.year)}</span>
                </div>
            </div>
        </article>`;
    }).join("");
});
