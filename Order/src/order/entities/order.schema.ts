import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {

    @Prop({
        type: String,
        default: uuidv4,
        required: true,
        unique: true,
    })
    orderId: string;

    @Prop({ type: String, required: true })
    userId: string;

    @Prop([{
        name: String,
        price: String,
        quantity: String,
    }])
    items: { name: string; price: string; quantity: string }[];

    @Prop({ type: String, required: true })
    totalAmount: string;

    @Prop({
        type: String,
        enum: ['pending', 'completed', 'shipped', 'failed'],
        default: 'pending',
    })
    status: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
