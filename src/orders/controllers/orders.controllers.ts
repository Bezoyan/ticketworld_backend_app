import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Order } from "../models/order";
import { OrderStatus } from "../../orders/enums/order.types";
import { Ticket } from "../../tickets/models/ticket";
import { EXPIRATION_TIME } from "../../constants";

interface JwtPayload {
    id: string
}
async function getOrders (req: Request, res: Response) {
    const jsonWebToken = req.headers.authorization?.split(' ')[1];

    const userToken = jwt.verify(jsonWebToken as any, process.env.JWT_SECRET!) as JwtPayload
    const userId = userToken.id
    const orders = await Order.find({
        userId : userId
    }).populate("ticket");

    res.send(orders);
}

async  function showOrderById (req: Request, res: Response) {
    const jsonWebToken = req.headers.authorization?.split(' ')[1];

    const userToken = jwt.verify(jsonWebToken as any, process.env.JWT_SECRET!) as JwtPayload
    const userId = userToken.id
    const order = await Order.findById(req.params.orderId).populate(
        "ticket"
    );

    if (!order) {
        return res.boom.notFound('Order was not found');
    }
    if (order.userId !== userId) {
        return res.boom.unauthorized('unauthorized');
    }

    res.send(order);
}

async function createOrder (req: Request, res: Response) {
    
    try {
        const jsonWebToken = req.headers.authorization?.split(' ')[1];
    
        const userToken = jwt.verify(jsonWebToken as any, process.env.JWT_SECRET!) as JwtPayload
        const userId = userToken.id
        const { ticketId } = req.body;
    
        if (ticketId.length % 2 !== 0) {
            throw res.boom.notAcceptable("You can order only even number tickets")
        }

        let ticket;
        let order = [];
        for (let i of ticketId) {
            ticket = await Ticket.findById(i);
            console.log(ticket, 'inside for')
            if (!ticket) {
                return res.boom.notFound();;
            }
        
            const isReserved = await ticket.isReserved();
            if (isReserved) {
                return res.boom.badRequest("Ticket is already reserved");
            }

            const expiration = new Date();
            expiration.setSeconds(
                expiration.getSeconds() + EXPIRATION_TIME
            );
        
            const orderTickets = await Order.create({
                userId: userId,
                status: OrderStatus.CREATED,
                expiresAt: expiration,
                amount: ticket.price,
                ticket: ticket,
            });
            order.push(orderTickets)
        }
        res.status(201).send(order);
    
    

    } catch (error: any) {
        throw new Error(error)
    }
}

async function removeOrder (req: Request, res: Response) {
    const { orderId } = req.params;
    const jsonWebToken = req.headers.authorization?.split(' ')[1];

    const userToken = jwt.verify(jsonWebToken as any, process.env.JWT_SECRET!) as JwtPayload
    const userId = userToken.id
    const order = await Order.findById(orderId).populate("ticket");

    if (!order) {
        return res.boom.notFound('Order was not found')
    }

    if (order.userId !== userId) {
        return res.boom.unauthorized('unauthorized');
    }

    order.status = OrderStatus.CANCELLED;
    await order.save();

    res.status(204).send(order);
}

export default {
    getOrders,
    showOrderById,
    createOrder,
    removeOrder
}