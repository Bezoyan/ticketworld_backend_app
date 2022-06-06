import express from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
const router = express.Router();

import EventController from '../controllers/event.controller'


router.get("/events", EventController.getEvents);
router.get("/events/:eventId",EventController.getEventById);
router.post( "/events",
    [
        body("ticketId")
            .not()
            .isEmpty()
            .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
            .withMessage("TicketId must be provided"),
    ],
    EventController.creatEevent
);
router.delete("/events/:eventId", EventController.removeEvent)


export { router as eventRouters };
