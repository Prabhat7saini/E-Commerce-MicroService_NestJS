import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";
import { Document } from "mongoose";
export type PaymetnDocument = Paymnet & Document;
@Schema({ timestamps: true })
export class Paymnet {

    @Prop({ type: String, required: true })
    orderId: string;
    @Prop({ type: String, required: true })
    totalAmount: string;

    @Prop({
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    })
    status: string;
    @Prop({
        type: String,
        enum: ["credit_card", "paypal", "bank_transfer", "other"],
        required: true,
    })
    paymentMethod: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Paymnet);