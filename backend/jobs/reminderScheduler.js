
const cron = require("node-cron");
const webpush = require("web-push");

const Medicine = require("../models/Medicine");
const User = require("../models/User");

webpush.setVapidDetails(
    process.env.VAPID_SUBJECT,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

// Send a notification to all registered devices for one user
async function sendToUser(user, notification) {
    if (!user || !Array.isArray(user.pushSubscriptions)) {
        return false;
    }

    let delivered = false;

    for (const subscription of [...user.pushSubscriptions]) {
        try {
            await webpush.sendNotification(
                subscription,
                JSON.stringify(notification)
            );

            delivered = true;
            console.log("Push notification sent successfully");

        } catch (error) {
            console.log("Push notification error:", error.message);

            if (error.statusCode === 404 || error.statusCode === 410) {
                user.pushSubscriptions = user.pushSubscriptions.filter(
                    sub => sub.endpoint !== subscription.endpoint
                );

                await user.save();
            }
        }
    }

    return delivered;
}

// Run every minute
cron.schedule("* * * * *", async () => {
    try {
        const now = new Date();

        // Use Indian time for reminder matching
        const timeParts = new Intl.DateTimeFormat("en-GB", {
            timeZone: "Asia/Kolkata",
            hour: "2-digit",
            minute: "2-digit",
            hourCycle: "h23"
        }).formatToParts(now);

        const hour = timeParts.find(p => p.type === "hour").value;
        const minute = timeParts.find(p => p.type === "minute").value;

        const currentTime = `${hour}:${minute}`;

        const currentDay = new Intl.DateTimeFormat("en-US", {
            timeZone: "Asia/Kolkata",
            weekday: "long"
        }).format(now);

        // --------------------------------
        // 1. NORMAL MEDICINE REMINDERS
        // --------------------------------

        const medicines = await Medicine.find({
            reminderEnabled: true,
            reminderTimes: currentTime,
            reminderDays: currentDay,
            expiryDate: { $gte: now }
        });

        for (const medicine of medicines) {
            const user = await User.findById(medicine.userId);

            if (!user || !user.pushSubscriptions.length) {
                continue;
            }

            await sendToUser(user, {
                title: "Medicine Reminder 💊",
                body: `Time to take ${medicine.name}. Dosage: ${medicine.dosage || "As prescribed"}`
            });

            console.log(`Reminder checked for ${medicine.name}`);
        }

        // --------------------------------
        // 2. RESET LOW STOCK ALERT
        // --------------------------------

        const previouslyAlerted = await Medicine.find({
            lowStockAlertSent: true
        });

        for (const medicine of previouslyAlerted) {
            const threshold = Number.isFinite(medicine.lowStockThreshold)
                ? medicine.lowStockThreshold
                : 3;

            if (medicine.quantity > threshold) {
                medicine.lowStockAlertSent = false;
                await medicine.save();

                console.log(`Low stock alert reset for ${medicine.name}`);
            }
        }

        // --------------------------------
        // 3. LOW STOCK NOTIFICATIONS
        // --------------------------------

        const lowStockMedicines = await Medicine.find({
            lowStockAlertEnabled: { $ne: false },
            lowStockAlertSent: { $ne: true }
        });

        for (const medicine of lowStockMedicines) {
            const threshold = Number.isFinite(medicine.lowStockThreshold)
                ? medicine.lowStockThreshold
                : 3;

            const quantity = Number(medicine.quantity);

            if (!Number.isFinite(quantity) || quantity > threshold) {
                continue;
            }

            const user = await User.findById(medicine.userId);

            if (!user || !user.pushSubscriptions.length) {
                continue;
            }

            const delivered = await sendToUser(user, {
                title: "Low Stock Alert ⚠️",
                body: `${medicine.name} is running low. Only ${quantity} remaining. Please check your stock.`
            });

            if (delivered) {
                medicine.lowStockAlertSent = true;
                await medicine.save();

                console.log(`Low stock alert sent for ${medicine.name}`);
            }
        }

    } catch (error) {
        console.error("Reminder Scheduler Error:", error);
    }
});

console.log("Medicine Reminder Scheduler Started!");
