import axios from "axios";

const publicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;

export const enableNotifications = async () => {
  if (!("serviceWorker" in navigator)) {
    throw new Error("Service Worker not supported");
  }

  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    throw new Error("Notification permission denied");
  }

  const registration = await navigator.serviceWorker.register("/sw.js");

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey)
  });

  await axios.post(
    "/api/notifications/subscribe",
    subscription
  );

  return true;
};

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);

  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);

  return Uint8Array.from(
    [...rawData].map(char => char.charCodeAt(0))
  );
}
