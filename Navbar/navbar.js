document.addEventListener("DOMContentLoaded", async () => {

    const navbar = document.getElementById("navbar");
    const cta = document.getElementById("cta");
    const footer = document.getElementById("footer");


    if (navbar) {
        try {
            const response = await fetch("../Navbar/navbar.html");

            if (!response.ok) {
                throw new Error("Navbar could not be loaded.");
            }

            navbar.innerHTML = await response.text();

        } catch (error) {
            console.error("Navbar Error:", error);
        }
    }


    if (cta) {
        try {
            const response = await fetch("../CTA/cta.html");

            if (!response.ok) {
                throw new Error("CTA could not be loaded.");
            }

            cta.innerHTML = await response.text();

        } catch (error) {
            console.error("CTA Error:", error);
        }
    }


    if (footer) {
        try {
            const response = await fetch("../Footer/footer.html");

            if (!response.ok) {
                throw new Error("Footer could not be loaded.");
            }

            footer.innerHTML = await response.text();

        } catch (error) {
            console.error("Footer Error:", error);
        }
    }


    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.querySelector(".nav-menu");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => {
            navMenu.classList.toggle("active");
        });
    }

});