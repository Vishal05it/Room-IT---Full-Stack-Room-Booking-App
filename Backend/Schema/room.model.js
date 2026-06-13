const mongoose = require("mongoose");
const roomSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "Room title is required"],
    },
    description: {
        type: String,
        required: [true, "Room description is required"],
        minlength: [10, "Room description must be atleast 10 characters long"],
    },
    floor: {
        type: Number,
        required: [true, "Floor is required"],
    },
    capacity: {
        type: Number,
        required: [true, "Capacity is required"],
    },
    image: {
        type: String,
        required: [true, "Room image is required"],
    },
    cleanTime: {
        type: Number,
        default: 0,
    }
}, { timestamps: true, strict: true });
const roomModel = mongoose.model("room", roomSchema);
module.exports = roomModel;