const webpush = require("web-push");
const User = require("../models/User");

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

exports.subscribe = async (req, res) => {
  try {
    const subscription = req.body;

    await User.findByIdAndUpdate(
      req.user.id,
      {
        $addToSet: {
          pushSubscriptions: subscription
        }
      }
    );

    res.status(200).json({
      message: "Notification subscription saved successfully"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message
    });
  }
};
