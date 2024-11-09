if ("serviceWorker" in navigator) {
    window.addEventListener("load", async () => {
        try {
            console.log("Registering service worker...");
            const reg = await navigator.serviceWorker.register("/hacknhfrontend/sw.js");

            console.log("Service worker registered", reg);
        } catch (err) {
            console.error("Failed to register service worker", err);
        }
    });
}