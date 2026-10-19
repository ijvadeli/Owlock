
const defaults = {
  home: true,
  shorts: true,
  navigation: true,
  viewLayout: true
};

const controls = document.querySelectorAll("[data-setting]");
const status = document.querySelector("#status");

async function initialize() {
  const saved = await browser.storage.local.get(defaults);

  for (const control of controls) {
    control.checked = saved[control.dataset.setting];
  }
}

for (const control of controls) {
  control.addEventListener("change", async () => {
    const key = control.dataset.setting;

    try {
      await browser.storage.local.set({
        [key]: control.checked
      });

      status.textContent = "Settings saved.";
    } catch (error) {
      status.textContent = "Settings couldn't save.";
      console.error("Owlet settings error:", error);
    }
  });
}

initialize().catch(error => {
  status.textContent = "Couldn't load settings.";
  console.error("Owlet initialization error:", error);
});
