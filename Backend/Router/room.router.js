const express = require("express");
const roomModel = require("../Schema/room.model");
const { default: mongoose } = require("mongoose");
const roomRouter = express.Router();
roomRouter.get("/viewroom/:roomId", async (req, res) => {
    try {
        let room = await roomModel.findById(req.params.roomId);
        if (!room) {
            return res.status(404).json({
                message: "Room not found",
                success: false,
            });
        }
        return res.status(200).json({
            message: "Room found",
            success: true,
            room,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
})
roomRouter.get("/getallrooms", async (req, res) => {
    try {
        let allRooms = await roomModel.find({});
        return res.status(200).json({
            message: "Rooms fetched successfully",
            success: true,
            rooms: allRooms,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
});
roomRouter.post("/createroom", async (req, res) => {
    try {
        let { rooms, email } = req.body;
        if (email != process.env.EMAIL) {
            return res.status(401).json({
                message: "Only admin can create new rooms",
                success: false,
            });
        }
        let insertRooms = await roomModel.create(rooms);
        return res.status(200).json({
            message: "Rooms created successfully",
            success: true,
        });
    } catch (error) {
        console.log(error);
        if (error instanceof mongoose.Error.ValidationError) {
            let messages = Object.values(error.errors).map((err) => err.message);
            return res.status(500).json({
                message: messages[0],
                success: false,
            });
        }
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
})
module.exports = roomRouter;