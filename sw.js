self.addEventListener("install", function onInstall() {
    self.skipWaiting();
});

self.addEventListener("activate", async function onActivate() {
    await self.registration.unregister();

    const clients = await self.clients.matchAll({
        type: "window"
    });

    for (const client of clients) {
        client.navigate(client.url);
    }
});