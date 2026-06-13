const mongoose = require("mongoose");
const limiterSchema = mongoose.Schema({
    date: {
        type: String,
        required: [true, "Date is required"]
    },
    hours: {
        type: Number,
        required: [true, "Total hours consumed is required"],
        min: [0, "Hours cannot be less than 0"],
        max: [4, "You can only book rooms for 4 hours for a particular date"],
    },
    bookedBy: {
        type: String,
        match: [
            /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim,
            "Invalid email!",
        ],
        required: [true, "Email is required"],
        lowercase: true,

    }
}, { timestamps: true, strict: true });
limiterSchema.index({ bookedBy: 1, date: 1 }, { unique: true });

const limiterModel = mongoose.model("limiter", limiterSchema);
module.exports = limiterModel;