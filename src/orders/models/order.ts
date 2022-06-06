import mongoose from "mongoose";
import { OrderStatus } from "../enums/order.types";
import { TicketDoc } from "../../tickets/models/ticket";
import { PaymentDoc } from "../../payments/models/payment";
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'


export { OrderStatus };

export interface OrderAttrs {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    amount: number
    ticket: TicketDoc; // reference to ticket
}

export interface OrderDoc extends mongoose.Document {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: TicketDoc;
    payment: PaymentDoc;
    amount: number
    version: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: Object.values(OrderStatus),
            default: OrderStatus.CREATED,
        },
        expiresAt: {
            type: mongoose.Schema.Types.Date,
        },
        amount: {
            type: Number,
            required: true
        },
        ticket: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ticket",
        },
        payment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Payment"
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

orderSchema.set('versionKey', 'version')
orderSchema.plugin(updateIfCurrentPlugin)

orderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };
