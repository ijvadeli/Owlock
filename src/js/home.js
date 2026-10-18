function customizeHomepage() {
    // Check if on homepage
    if (window.location.pathname === "/") {
        // Target container holding main grid
        const primaryContent = document.querySelector("ytd-browse");

        if (primaryContent) {
            // Clear all recommended videos
            primaryContent.innerHTML = "";

            // Create and style placeholder text
            const home = document.createElement("div");
            home.setAttribute("id", "home");
            home.textContent = "Owlock";

            // Add text to page
            primaryContent.appendChild(home)
        }
    }
}

// Run function when page loads
customizeHomepage();

// YouTube uses dynamic loading so listen for navigation changes
window.addEventListener("yt-navigate-finish", customizeHomepage);