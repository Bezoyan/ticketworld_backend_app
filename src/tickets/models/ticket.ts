import mongoose from "mongoose";
import { Order, OrderStatus } from "../../orders/models/order";
import { Event, EventDoc } from "../../events/models/events"
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface TicketAttrs {
    title: string;
    price: number;
    count: number;
    eventId: EventDoc;
    //userId: string;
}

export interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    //userId: string;
    version: number;
    orderId?: string;
    count: number;
    event: EventDoc;
    isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
    findByEvent(event: { id: string, version: number }): Promise<TicketDoc | null>;
}

const ticketSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        // userId: {
        //     type: String,
        //     required: true,
        // },
        orderId: {
            type: String,
        },
        count: {
            type: Number
        },
        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
        }
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

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.findByEvent = (event: { id: string, version: number }) => {
    return Ticket.findOne({
        _id: event.id,
        version: event.version - 1,
    });
}

ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs);
};

ticketSchema.methods.isReserved = async function () {
    const existingOrder = await Order.findOne({
        ticket: this,
        status: {
            $in: [
                OrderStatus.CREATED,
                OrderStatus.WAITING_PAYMENT,
                OrderStatus.COMPLETE,
            ],
        },
    });
    return !!existingOrder;
};
const Ticket: TicketModel = mongoose.model<TicketDoc, TicketModel>(
    "Ticket",
    ticketSchema
);

export { Ticket };





