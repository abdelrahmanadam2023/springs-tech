/* Projects page: loads projects from the database (falls back to the built-in cards). */
document.addEventListener("DOMContentLoaded", async () => {

    const grid = document.querySelector(".projects-grid");
    if (!grid || !window.SpringsDB) return;

    const rows = await SpringsDB.select("projects", "select=*&is_published=eq.true&order=sort_order.asc");
    if (!rows) return;

    const { esc, img, pad } = SpringsDB;

    grid.innerHTML = rows.map((p, i) => `
        <article class="project-card">
            <div class="project-image project-image-${(i % 9) + 1} has-img">
                ${img(p.image_url)}
                <span class="project-number">${pad(i + 1)}</span>
            </div>
            <div class="project-content">
                <span class="project-type">${esc(p.project_type)}</span>
                <h3>${esc(p.title)}</h3>
                <div class="project-meta">
                    <span>📍 ${esc(p.location)}</span>
                    <span>${esc(p.year)}</span>
                </div>
            </div>
        </article>`).join("");
});
