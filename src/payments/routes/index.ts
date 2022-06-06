import express from "express";
import { body } from "express-validator";

import paymentContraller from "../controllers/payment.contraller";

const router = express.Router();

router.post(
    "/payments",
    [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
    paymentContraller.placeOrder
);

export { router as createChargeRouter };
