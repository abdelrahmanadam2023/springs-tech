/* Small helper used by every page to talk to the database (Supabase REST API). */
(function () {

    const cfg = window.SPRINGS_DB || {};
    const base = (cfg.url || "").replace(/\/+$/, "");
    const enabled = !!(base && cfg.key);

    function headers(extra) {
        const h = { apikey: cfg.key };
        // Old-style (JWT) keys also go in Authorization; new publishable keys do not.
        if (/^eyJ/.test(cfg.key)) h.Authorization = "Bearer " + cfg.key;
        return Object.assign(h, extra || {});
    }

    // Returns an array of rows, or null (not configured / error / empty)
    async function select(table, query) {
        if (!enabled) return null;

        try {
            const res = await fetch(base + "/rest/v1/" + table + "?" + query, { headers: headers() });
            if (!res.ok) throw new Error("HTTP " + res.status);

            const rows = await res.json();
            return Array.isArray(rows) && rows.length ? rows : null;

        } catch (error) {
            console.warn("[Springs Tech] Could not load '" + table + "'. Showing built-in content.", error);
            return null;
        }
    }

    // Adds one row. Throws on failure.
    async function insert(table, row) {
        if (!enabled) throw new Error("Database is not configured");

        const res = await fetch(base + "/rest/v1/" + table, {
            method: "POST",
            headers: headers({ "Content-Type": "application/json", Prefer: "return=minimal" }),
            body: JSON.stringify(row)
        });

        if (!res.ok) throw new Error("HTTP " + res.status);
    }

    // Escape text before putting it in HTML
    function esc(value) {
        return String(value == null ? "" : value).replace(/[&<>"']/g, function (c) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
        });
    }

    // Image tag. Paths like "Images/x.jpg" are relative to the site root.
    // If the image can't load, it is removed and the card keeps its gradient.
    function img(path) {
        if (!path) return "";
        const src = /^(https?:)?\/\//.test(path) ? path : "../" + String(path).replace(/^\/+/, "");
        return '<img class="card-img" src="' + esc(src) + '" alt="" loading="lazy" onerror="this.remove()">';
    }

    function pad(n) {
        return String(n).padStart(2, "0");
    }

    window.SpringsDB = { enabled: enabled, select: select, insert: insert, esc: esc, img: img, pad: pad };

})();
