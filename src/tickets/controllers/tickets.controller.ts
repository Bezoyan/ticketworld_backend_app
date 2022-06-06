import { Request, Response } from "express";
import { Ticket } from "../models/ticket";
import jwt from "jsonwebtoken";

interface JwtPayload {
    id: string
}

async function getTickets(req: Request, res: Response) {
    const tickets = await Ticket.find({
        orderId: undefined,
    });
    res.send(tickets);
}

async function createTicket(req: Request, res: Response) {
    const { title, price, count } = req.body;
    let ticket = [];

    for (let i = 0; i < count; ++i) {

    let tickets = await Ticket.create({
            title,
            price,
            count
        });
    ticket.push(tickets);
    }
    res.status(201).send(ticket);
}

async function getTicketById(req: Request, res: Response) {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
        throw res.boom.notFound('Ticket not found');
    }

    res.send(ticket);
}

async function editTicket(req: Request, res: Response) {
    const ticket = await Ticket.findById(req.params.id);
    const jsonWebToken = req.headers.authorization?.split(' ')[1];

    const userToken = jwt.verify(jsonWebToken as any, process.env.JWT_SECRET!) as JwtPayload
    const userId = userToken.id

    if (!ticket) {
        throw res.boom.notFound('Ticket not found');
    }

    // if the ticket is locked (has orderId property)
    if (ticket.orderId) {
        throw res.boom.notFound('Cannot edit a reserved ticket');
    }

    // to update the ticket, the user must be the author of the ticket
    if (!userId) {
        throw res.boom.unauthorized('unauthorized');
    }

    ticket.set({
        title: req.body.title,
        price: req.body.price,
    });

    await ticket.save();

    res.send(ticket);
}

export default {
    getTickets,
    createTicket,
    getTicketById,
    editTicket
}