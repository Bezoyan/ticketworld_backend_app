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
router.put(
    "/events/eventId",
    [
        body("title").not().isEmpty().withMessage("Title is required"),
        body("description")
            .not()
            .isEmpty()
            .withMessage("Price must be provided and must be greater than 0"),
    ], EventController.editEvent)
router.delete("/events/:eventId", EventController.removeEvent)


export { router as eventRouters };
