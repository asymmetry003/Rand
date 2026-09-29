      
    
(function() {
    // Spotlight follow
    const spotlight = document.getElementById("fpSpotlight");
    if (spotlight) {
        window.addEventListener("pointermove", function(e) {
            spotlight.style.left = e.clientX + "px";
            spotlight.style.top = e.clientY + "px";
        }, { passive: true });
    }

    // Theme toggle - more robust version
    const html = document.documentElement;
    const toggle = document.getElementById("themeToggle");

    function setTheme(theme) {
        html.setAttribute("data-theme", theme);
        try {
            localStorage.setItem("theme", theme);
        } catch (e) {
            // localStorage may be blocked in some environments
        }
    }

    function getPreferredTheme() {
        try {
            const saved = localStorage.getItem("theme");
            if (saved === "light" || saved === "dark") return saved;
        } catch (e) {}
        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
            return "light";
        }
        return "dark";
    }

    // Apply theme on load
    setTheme(getPreferredTheme());

    // Toggle on click
    if (toggle) {
        toggle.addEventListener("click", function() {
            const current = html.getAttribute("data-theme") || "dark";
            const next = current === "dark" ? "light" : "dark";
            setTheme(next);
        });
    }

    // Floating CTA — show after scrolling past .reply-text; hide when 0.5% of #contact is visible
    const floatCta = document.getElementById("floatCta");
    const floatClose = document.getElementById("floatCtaClose");
    const ctaRow = document.querySelector(".reply-text");
    const contactSection = document.getElementById("contact");
    let dismissed = false;

    function isContactMostlyVisible() {
        if (!contactSection) return false;
        const rect = contactSection.getBoundingClientRect();
        const vh = window.innerHeight || document.documentElement.clientHeight;
        // Visible height of contact within the viewport
        const visibleTop = Math.max(0, rect.top);
        const visibleBottom = Math.min(vh, rect.bottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        const sectionHeight = rect.height || 1;
        // Hide when at least 0.5% of the contact section is visible
        return (visibleHeight / sectionHeight) >= 0.005;
    }

    function updateFloatCta() {
        if (!floatCta || !ctaRow || dismissed) return;
        const rect = ctaRow.getBoundingClientRect();
        // Show when scrolled past .reply-text AND contact is not yet 0.5% visible
        if (rect.bottom < 0 && !isContactMostlyVisible()) {
            floatCta.classList.add("visible");
        } else {
            floatCta.classList.remove("visible");
        }
    }

    if (floatCta && ctaRow) {
        window.addEventListener("scroll", updateFloatCta, { passive: true });
        window.addEventListener("resize", updateFloatCta, { passive: true });
        // Initial check
        updateFloatCta();
    }

    if (floatClose) {
        floatClose.addEventListener("click", function() {
            dismissed = true;
            if (floatCta) floatCta.classList.remove("visible");
        });
    }

    // Smooth scroll for the float button (in case of older browsers)
    const floatBtn = document.getElementById("floatCtaBtn");
    if (floatBtn) {
        floatBtn.addEventListener("click", function(e) {
            const target = document.getElementById("contact");
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: "smooth" });
            }
        });
    }
})();

