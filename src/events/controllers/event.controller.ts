import { Request, Response } from "express";
//import { verifyJWT } from '../../auth/services/helper/jwtHelper';
import jwt from "jsonwebtoken";
import { Event } from "../models/events";
import { Ticket } from "../../tickets/models/ticket";
import { EXPIRATION_TIME } from "../../constants";


interface JwtPayload {
    id: string
}

async function getEvents (req: Request, res: Response) {
    try {
        const events = await Event
            .find({})
            .populate("tickets");
        res.send(events);     
    } catch (error: any) {
        throw new Error(error);
    }
}

async  function getEventById (req: Request, res: Response) {
    try {
        const event = await Event.findById(req.params.eventId)
            .populate("tickets");
    
        if (!event) {
            return res.boom.notFound('event was not found');
        }
        res.send(event);
    } catch (error: any) {
        throw new Error(error);
    }
}

// TODO: Only for admin will implement letter
async function creatEevent (req: Request, res: Response) {
    try {
        const jsonWebToken = req.headers.authorization?.split(' ')[1];
    
        const userToken = jwt.verify(jsonWebToken as any, process.env.JWT_SECRET!) as JwtPayload
        const userId = userToken.id
    
        const { title, price, count } = req.body.tickets;
            let ticket = [];
    
            for (let i = 0; i < count; ++i) {
    
            let tickets = await Ticket.create({
                    title,
                    price,
                    count
                });
            ticket.push(tickets);
            }
    
        const expiration = new Date();
        expiration.setSeconds(
            expiration.getSeconds() + EXPIRATION_TIME
        );
    
        const event = await Event.create({
            userId: userId,
            title: req.body.title,
            description: req.body.description,
            location: req.body.location,
            dateAt: expiration,
            tickets: ticket,
        });
    
        res.status(201).send(event);
    } catch (error: any) {
        throw new Error(error);
    }
}

// TODO: Only for admin will implement letter
async function removeEvent (req: Request, res: Response) {
    try {
        const { eventId } = req.params;

        const order = await Event.findById(eventId).populate("ticket");
    
        if (!order) {
            return res.boom.notFound('Event was not found')
        }
        res.status(204).send(order);
    } catch (error: any) {
        throw new Error(error);
    }
}

// TODO: Only for admin will implement letter
async function editEvent(req: Request, res: Response) {
    try {
        const event = await Ticket.findByIdAndUpdate(req.params.id);
        const jsonWebToken = req.headers.authorization?.split(' ')[1];
    
        const userToken = jwt.verify(jsonWebToken as any, process.env.JWT_SECRET!) as JwtPayload
        const userId = userToken.id
    
        if (!event) {
            throw res.boom.notFound('event not found');
        }
    
    
        // to update the event, the user must be the author of the ticket
        if (!userId) {
            throw res.boom.unauthorized('unauthorized');
        }
    
        // event.set({
        //     title: req.body.title,
        //     price: req.body.price,
        // });
    
        // await ticket.save();
    
        res.send(event);
    } catch (error: any) {
        throw new Error(error);
    }
}

export default {
    getEvents,
    getEventById,
    creatEevent,
    removeEvent,
    editEvent
}