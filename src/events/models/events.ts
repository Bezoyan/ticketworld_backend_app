import mongoose from "mongoose";
import { TicketDoc } from "../../tickets/models/ticket";


export interface EventsInt {
    userId: string;
    title: string;
    description: string;
    location: string; // TODO integrate googleAPI
    dateAt: Date;
    tickets: TicketDoc; // reference to ticket
}

export interface EventDoc extends mongoose.Document {
    userId: string;
    title: string;
    location: string;
    description: string;
    dateAt: Date;
    tickets: TicketDoc;
}

interface EventModel extends mongoose.Model<EventDoc> {
    build(attrs: EventsInt): EventDoc;
}

const eventSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        dateAt: {
            type: mongoose.Schema.Types.Date,
        },
        tickets: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ticket",
        }],
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            },
        },
    }
);


eventSchema.statics.build = (attrs: EventsInt) => {
    return new Event(attrs);
};

const Event = mongoose.model<EventDoc, EventModel>("Event", eventSchema);

export { Event };
