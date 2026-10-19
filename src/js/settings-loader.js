
(() => {
  const defaults = {
    home: true,
    shorts: true,
    navigation: true,
    viewLayout: true
  };

  const styles = {
    home: "src/css/home.css",
    shorts: "src/css/shorts.css",
    navigation: "src/css/navigation.css",
    viewLayout: "src/css/view-layout.css"
  };

  function applyStyles(settings) {
    for (const [key, path] of Object.entries(styles)) {
      const id = `owlet-style-${key}`;
      let link = document.getElementById(id);

      if (settings[key] && !link) {
        link = document.createElement("link");
        link.id = id;
        link.rel = "stylesheet";
        link.href = browser.runtime.getURL(path);
        document.documentElement.appendChild(link);
      } else if (!settings[key] && link) {
        link.remove();
      }
    }
  }

  async function refresh() {
    const settings = await browser.storage.local.get(defaults);
    applyStyles(settings);
  }

  refresh().catch(console.error);

  browser.storage.onChanged.addListener((changes, area) => {
    if (area !== "local") return;

    if (Object.keys(styles).some(key => key in changes)) {
      refresh().catch(console.error);
    }
  });
})();
