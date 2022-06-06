import express from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
const router = express.Router();

import OrderController from '../controllers/orders.controllers'


router.get("/orders", OrderController.getOrders);
router.get("/orders/:orderId",OrderController.showOrderById);
router.post( "/orders",
    [
        body("ticketId")
            .not()
            .isEmpty()
            .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
            .withMessage("TicketId must be provided"),
    ],
    OrderController.createOrder
);
router.delete("/orders/:orderId", OrderController.removeOrder)


export { router as orderRouters };
