document.addEventListener("DOMContentLoaded", () => {
    // Navigation Menu Hover Effect
    const menuItems = document.querySelectorAll(".nav-menu > li");

    menuItems.forEach((menuItem) => {
        menuItem.addEventListener("mouseenter", () => {
            const submenu = menuItem.querySelector(".submenu");
            if (submenu) submenu.style.display = "block";
        });

        menuItem.addEventListener("mouseleave", () => {
            const submenu = menuItem.querySelector(".submenu");
            if (submenu) submenu.style.display = "none";
        });
    });

    // Logout Button Click Event
    const logoutBtn = document.querySelector(".logout-btn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", (event) => {
            event.preventDefault();
            console.log("Logging out...");
            window.location.href = "../html/loginPage.html";
        });
    }

    // Lazy Load Background Video with Placeholder Image
    const bgVideo = document.getElementById("bg-video");
    const videoSource = bgVideo.querySelector("source");
    const placeholder = document.getElementById("video-placeholder");

    if (bgVideo) {
        const observer = new IntersectionObserver((entries, observer) => {
            if (entries[0].isIntersecting) {
                videoSource.src = videoSource.dataset.src; // Set actual video source
                bgVideo.load(); // Start loading the video

                // Wait for the video to load and play
                bgVideo.addEventListener("canplaythrough", () => {
                    placeholder.style.display = "none"; // Hide the placeholder
                    bgVideo.style.display = "block"; // Show the video
                });

                observer.disconnect(); // Stop observing once loaded
            }
        }, { threshold: 0.5 });

        observer.observe(bgVideo);
    }
});
