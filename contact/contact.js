/*
  Contact form

  By default the form opens the visitor's email app with the message
  pre-filled (sent to info@springs-tech.com). This needs no server.

  To receive messages directly without opening an email app:
  1. Create a free form at https://formspree.io
  2. Paste its URL below, e.g. "https://formspree.io/f/xxxxxxxx"
*/

const FORM_ENDPOINT = "";
const CONTACT_EMAIL = "info@springs-tech.com";

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("contactForm");
    const status = document.getElementById("formStatus");

    if (!form) return;

    const setStatus = (text, type) => {
        status.textContent = text;
        status.className = "form-status " + (type || "");
    };

    form.addEventListener("submit", async (event) => {

        event.preventDefault();
        setStatus("", "");

        const data = new FormData(form);

        // Spam trap
        if (data.get("website")) return;

        // Validation
        const required = ["name", "email", "message"];
        let firstInvalid = null;

        form.querySelectorAll(".invalid").forEach(el => el.classList.remove("invalid"));

        required.forEach(id => {
            const field = form.elements[id];
            const value = field.value.trim();
            const bad = !value ||
                (id === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));

            if (bad) {
                field.classList.add("invalid");
                if (!firstInvalid) firstInvalid = field;
            }
        });

        if (firstInvalid) {
            setStatus("Please fill in your name, a valid email, and a message.", "error");
            firstInvalid.focus();
            return;
        }

        const button = form.querySelector(".submit-button");

        // Option 1: send to a form service
        if (FORM_ENDPOINT) {

            button.disabled = true;

            try {
                const response = await fetch(FORM_ENDPOINT, {
                    method: "POST",
                    body: data,
                    headers: { Accept: "application/json" }
                });

                if (!response.ok) throw new Error("Request failed");

                form.reset();
                setStatus("Message sent. We'll get back to you soon.", "success");

            } catch (error) {
                setStatus("Message not sent. Please try again or email " + CONTACT_EMAIL + ".", "error");
            } finally {
                button.disabled = false;
            }

            return;
        }

        // Option 2: open the visitor's email app
        const subject = "Website inquiry: " + data.get("topic");

        const body =
            "Name: " + data.get("name") + "\n" +
            "Company: " + (data.get("company") || "-") + "\n" +
            "Email: " + data.get("email") + "\n" +
            "Phone: " + (data.get("phone") || "-") + "\n\n" +
            data.get("message");

        window.location.href =
            "mailto:" + CONTACT_EMAIL +
            "?subject=" + encodeURIComponent(subject) +
            "&body=" + encodeURIComponent(body);

        setStatus("Your email app should open with the message ready to send.", "success");
    });

});
