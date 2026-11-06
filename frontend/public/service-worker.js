self.addEventListener("push", function (event) {
    const data = event.data ? event.data.json() : {};

    const options = {
        body: data.body || "It's time to take your medicine.",
        icon: "/vite.svg",
        badge: "/vite.svg",
        vibrate: [200, 100, 200],
        data: {
            url: "/"
        }
    };

    event.waitUntil(
        self.registration.showNotification(
            data.title || "Medicine Reminder 💊",
            options
        )
    );
});

self.addEventListener("notificationclick", function (event) {
    event.notification.close();

    event.waitUntil(
        clients.openWindow("/")
    );
});