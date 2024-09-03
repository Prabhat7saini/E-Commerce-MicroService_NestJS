import { Injectable, Req, HttpException, HttpStatus } from '@nestjs/common';
import { paymentProcess } from 'src/utils/processPayment';
import { PaymetnDocument, Paymnet } from './entities/payment.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePaymentDto, CreatePaymentResponce } from './dto/create-Payment.dto';
import { JwtPayload } from 'jsonwebtoken';
import { api } from 'src/config/api';
import axios from 'axios';

interface CustomRequest extends Request {
    user?: JwtPayload;
}

@Injectable()
export class PaymentService {

    constructor(@InjectModel(Paymnet.name) private paymentModel: Model<PaymetnDocument>) { }

    async proccedPyamentRequetes(@Req() req: CustomRequest, createPaymentDto: CreatePaymentDto): Promise<CreatePaymentResponce> {
        try {
            // Validate request and process payment
            const email = req.user?.email;  // Optional chaining to handle cases where req.user might be undefined
            if (!email) {
                throw new HttpException({
                    status: HttpStatus.UNAUTHORIZED,
                    error: 'Unauthorized',
                    message: 'User email not found'
                }, HttpStatus.UNAUTHORIZED);
            }

            const paymentStatus = paymentProcess().value;
            createPaymentDto.status = paymentStatus;

            // Create new payment record in the database
            const newPayment = await this.paymentModel.create(createPaymentDto);

            // Log the new payment ID type
            console.log('New payment _id type:', newPayment._id);

            // Notify external service
            try {
                await axios.post(`${api.FullfillOrderApi}/${createPaymentDto.orderId}/${newPayment._id}`, { status: paymentStatus, email,totalAmount:createPaymentDto.totalAmount });
            } catch (axiosError) {
                console.error('Error while notifying external service:', axiosError.message);
                throw new HttpException({
                    status: HttpStatus.BAD_GATEWAY,
                    error: 'External Service Error',
                    message: 'Failed to notify external service'
                }, HttpStatus.BAD_GATEWAY);
            }

            // Return successful response
            return {
                payment: newPayment,
                message: `Payment Processed with status: ${paymentStatus}`,
                success: true,
                statusCode: HttpStatus.OK
            };

        } catch (error) {
            // Handle validation errors
            if (error.name === 'ValidationError') {
                console.error('Validation error:', error.message);
                throw new HttpException({
                    status: HttpStatus.BAD_REQUEST,
                    error: 'Validation Error',
                    message: error.message
                }, HttpStatus.BAD_REQUEST);
            }

            // Handle Mongoose duplicate key errors
            if (error.code === 11000) {
                console.error('Duplicate key error:', error.message);
                throw new HttpException({
                    status: HttpStatus.CONFLICT,
                    error: 'Duplicate Key Error',
                    message: 'A payment with the same details already exists'
                }, HttpStatus.CONFLICT);
            }

            // Handle other errors
            console.error('Unexpected error:', error);
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Internal Server Error',
                message: 'An unexpected error occurred'
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
