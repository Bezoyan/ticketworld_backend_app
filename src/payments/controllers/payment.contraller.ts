import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { OrderStatus } from "../../orders/enums/order.types";
import { Order } from "../../orders/models/order";
import { Payment } from "../models/payment";
import { stripe } from "../stripe";

// Interface for fixing typescript error while decoding id from JWT token
interface JwtPayload {
    id: string
}

async function placeOrder(req: Request, res: Response) {
    try {
        // We don't have token now as it is fake payment
        const { token, orderId } = req.body;
    
        const jsonWebToken = req.headers.authorization?.split(' ')[1];
    
       const userToken = jwt.verify(jsonWebToken as any, process.env.JWT_SECRET!) as JwtPayload
       const userId = userToken.id
    
    
        const order = await Order.findById(orderId);
        if (!order) {
            return res.boom.notFound();
        }
    
        if (order.userId !== userId) {
            return res.boom.unauthorized('user not found');
        }
    
        if (order.status === OrderStatus.CANCELLED) {
            return res.boom.badRequest("Order was cancelled you can not pay");
        }
    
        const customer = await stripe.customers.create();
        
        // Letter will be replaced to stripe.charge
        const charge = await stripe.paymentIntents.create({
            currency: "gbp",
            amount: order.amount * 100, // convert to pence
            //source: tocken,
        });
    
        const payment = await Payment.create({
            orderId: orderId,
            stripeId: charge.id,
        });
    
        res.status(201).send({ id: payment.id });

    } catch (error: any) {
        throw new Error(error)
    }
}

export default { placeOrder };
