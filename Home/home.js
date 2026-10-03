/* Home page: loads the featured projects from the database (falls back to the built-in cards). */
document.addEventListener("DOMContentLoaded", async () => {

    const grid = document.querySelector("#projects .projects-grid");
    if (!grid || !window.SpringsDB) return;

    const rows = await SpringsDB.select(
        "projects",
        "select=*&is_published=eq.true&show_on_home=eq.true&order=sort_order.asc"
    );
    if (!rows) return;

    const { esc, img, pad } = SpringsDB;

    grid.innerHTML = rows.map((p, i) => `
        <article class="project-card${p.is_highlighted ? " featured" : ""}">
            <div class="project-visual has-img">
                ${img(p.image_url)}
                <span class="project-number">PROJECT ${pad(i + 1)}</span>
            </div>
            <div class="project-content">
                <span class="project-category">${esc(p.home_category)}</span>
                <h3>${esc(p.title)}</h3>
                <p>${esc(p.description)}</p>
                <span class="project-year">${esc(p.year)}</span>
            </div>
        </article>`).join("");
});
