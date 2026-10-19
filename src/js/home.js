
let homeEnabled = false;
let currentContainer = null;
let originalHTML = null;
let observer = null;
let homeHTML = null;

async function loadHomeHTML() {
  if (homeHTML !== null) return homeHTML;

  const response = await fetch(
    browser.runtime.getURL("src/html/home.html")
  );

  if (!response.ok) {
    throw new Error(`Failed to load home.html: ${response.status}`);
  }

  homeHTML = await response.text();

  homeHTML = homeHTML.replaceAll(
    "../../icons/owlet-96.png",
    browser.runtime.getURL("icons/owlet-96.png")
  );

  return homeHTML;
}

async function renderHome() {
  if (!homeEnabled) return;

  const container = document.querySelector("ytd-browse");

  if (!container || container === currentContainer) return;

  // Remember the original YouTube content so it can be restored.
  currentContainer = container;
  originalHTML = container.innerHTML;

  try {
    const html = await loadHomeHTML();

    // The setting may have changed while the HTML was loading.
    if (!homeEnabled || !container.isConnected) return;

    container.innerHTML = html;
  } catch (error) {
    console.error("Owlet: Failed to render homepage:", error);
    currentContainer = null;
    originalHTML = null;
  }
}

function startHome() {
  if (observer) observer.disconnect();

  observer = new MutationObserver(() => {
    renderHome().catch(console.error);
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  renderHome().catch(console.error);

  // Keep your existing homepage customization, if defined.
  if (typeof customizeHomepage === "function") {
    customizeHomepage();
  }
}

function stopHome() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }

  if (currentContainer?.isConnected && originalHTML !== null) {
    currentContainer.innerHTML = originalHTML;
  }

  currentContainer = null;
  originalHTML = null;
}

async function updateHome() {
  const { home = true } =
    await browser.storage.local.get("home");

  if (home === homeEnabled) return;

  homeEnabled = home;

  if (homeEnabled) {
    startHome();
  } else {
    stopHome();
  }
}

browser.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.home) {
    updateHome().catch(console.error);
  }
});

updateHome().catch(console.error);

window.addEventListener("yt-navigate-finish", () => {
  if (homeEnabled) {
    currentContainer = null;
    originalHTML = null;
    renderHome().catch(console.error);
  }
});
