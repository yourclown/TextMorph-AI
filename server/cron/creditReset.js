// cron/creditReset.js
const cron = require("node-cron");
const User = require("../models/user");

const startCreditResetJob = () => {
  cron.schedule("*/10 * * * *", async () => {
    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);

    try {
      const users = await User.find({
        credits: 0,
        lastCreditDeductedAt: { $lte: twelveHoursAgo },
      });

      for (const user of users) {
        user.credits += 1;
        user.lastCreditDeductedAt = new Date(); // reset timer to now
        await user.save();

        console.log(`✅ Credit incremented by 1 for user ${user._id}`);
        // Optional: emit socket event to notify user
      }
    } catch (err) {
      console.error("❌ Error in credit reset cron:", err.message);
    }
  });
};

module.exports = startCreditResetJob;
