async function customizeHomepage() {
    // Check if on homepage
    if (window.location.pathname === "/") {
        // Target container holding main grid
        const primaryContent = document.querySelector("ytd-browse");

        if (primaryContent) {
            try {
                const response = await fetch(
                    chrome.runtime.getURL("src/html/home.html")
                );

                let html = await response.text();

                html = html.replace(
                    "../../icons/owlock-96.png",
                    chrome.runtime.getURL("icons/owlock-96.png")
                );

                primaryContent.innerHTML = html;
            } catch (error) {
                console.error("Failed to load home.html:", error);
            }
        }
    }
}

// Run function when page loads
customizeHomepage();

// YouTube uses dynamic loading so listen for navigation changes
window.addEventListener("yt-navigate-finish", customizeHomepage);