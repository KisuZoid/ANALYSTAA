document.addEventListener("DOMContentLoaded", () => {
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

    const logoutBtn = document.querySelector(".logout-btn"); 

    if (logoutBtn) {
        logoutBtn.addEventListener("click", (event) => {
            event.preventDefault(); 
            console.log("Logging out..."); 
            window.location.href = "login page.html";
        });
    }
});

