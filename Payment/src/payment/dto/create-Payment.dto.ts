import { IsString, IsEnum } from 'class-validator';

// Define the possible values for the status and paymentMethod fields
export enum PaymentStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    FAILED = 'failed',
}
export enum PaymentMethod {
    CREDIT_CARD = 'credit_card',
    PAYPAL = 'paypal',
    BANK_TRANSFER = 'bank_transfer',
    OTHER = 'other',
}

export class CreatePaymentDto {
    @IsString()
    readonly orderId: string;

    @IsString()
    readonly totalAmount: string;

    @IsEnum(PaymentStatus)
    status?: string;

    @IsEnum(PaymentMethod)
    readonly paymentMethod: string;
    @IsString()
    _id?: any;
}


export class CreatePaymentResponce {
    payment?: CreatePaymentDto
    message: string;
    success: boolean;
    statusCode: number;
}