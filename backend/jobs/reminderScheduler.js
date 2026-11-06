const cron = require("node-cron");
const webpush = require("web-push");

const Medicine = require("../models/Medicine");
const User = require("../models/User");

webpush.setVapidDetails(
    process.env.VAPID_SUBJECT,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

cron.schedule("* * * * *", async () => {

    try {
        const now = new Date();

        const currentTime = now.toTimeString().slice(0, 5);

        const currentDay = now.toLocaleDateString("en-US", {
            weekday: "long"
        });

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

            const notification = JSON.stringify({
                title: "Medicine Reminder 💊",
                body: `Time to take ${medicine.name}. Dosage: ${medicine.dosage || "As prescribed"}`
            });

            for (const subscription of user.pushSubscriptions) {

                try {

                    await webpush.sendNotification(
                        subscription,
                        notification
                    );

                    console.log(
                        `Reminder sent for ${medicine.name}`
                    );

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
        }

    } catch (error) {
        console.error("Reminder Scheduler Error:", error);
    }

});

console.log("Medicine Reminder Scheduler Started!");
