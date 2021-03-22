/* eslint-disable eqeqeq */
import { Router } from "express";
import { CallbackError } from "mongoose";
import Room from "../models/Room";

const room = Router();

// All the routes here is tested and it works

// Creating a room
room.post('/', async (req: any, res) => {

    const { name, description } = req.body;

    const window = {
        admin: [req.userId],
        name,
        description
    };

    const room = await (await Room.create(window)).save();
    // const user = await User.findById(req.userId);

    // user?.createdRooms.push(room._id);

    // user?.save();

    res.send({ room });
});

// joining a room
// room.post("/join", async (req: any, res) => {

//     const { code } = req.body;

//     const room = await Room.findOne({ code });

//     room?.members.push(req.userId);
//     await room?.save();

//     res.send({ msg: "Joined room", room });
// });

// Get all rooms you are a member of
room.get("/", async (req: any, res) => {

    // This is an array
    const rooms = await Room.find({ members: req.userId });

    // All the rooms where user is the admin
    // admin will be a array
    const admin = await Room.find({ admin: req.userId });

    res.send({ rooms, admin });

});

// Leaving a room
room.delete("/:roomId", async (req: any, res) => {

    try {
        const room = await Room.findById(req.params.roomId);

        if (!room) {
            res.send({ msg: "Invalid room", msgError: true });
        } else {
            room.members = room.members.filter(r => r != req.userId);

            room.save((err: CallbackError) => {
                if (err) {
                    res.send({ msg: "Some error occured", msgError: true });
                }
                else {
                    res.send({ room, msgError: false });
                }
            });
        }

    } catch (err) {
        res.send({ msg: "Invalid room", msgError: true });
    }

});

export default room;