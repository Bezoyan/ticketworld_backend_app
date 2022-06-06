import express from "express";
import { body } from "express-validator";
import ticketController from "../controllers/tickets.controller";

const router = express.Router();

router.get("/tickets", ticketController.getTickets);
router.get("/tickets/:id", ticketController.getTicketById);
router.post(
    "/tickets",
    [
        body("title").not().isEmpty().withMessage("Title is required"),
        body("price")
            .isFloat({ gt: 0 })
            .withMessage("Price must be greater than 0"),
    ], ticketController.createTicket
);
router.put(
    "/tickets/:id",
    //requireAuthMiddleware,
    [
        body("title").not().isEmpty().withMessage("Title is required"),
        body("price")
            .isFloat({ gt: 0 })
            .withMessage("Price must be provided and must be greater than 0"),
    ], ticketController.editTicket)

export { router as ticketRouters };
