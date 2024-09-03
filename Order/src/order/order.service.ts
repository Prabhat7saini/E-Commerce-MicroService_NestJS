import { Injectable, InternalServerErrorException, BadRequestException, Req } from '@nestjs/common';
// import { Order } from './interface/Order';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateOrderDto, CreateOrderResponce } from './dto/create-Order.dto';
import { Order, OrderDocument } from './entities/order.schema';
import { JwtPayload } from 'jsonwebtoken';
import { RabbitMQService } from 'src/rabbit-mq/rabbit-mq.service';
import { UpdateOrderDto, UpdateOrderResponse } from './dto/update-Order.dto';
interface CustomRequest extends Request {
    user?: JwtPayload
};
@Injectable()
export class OrderService {
    constructor(@InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>, private readonly RabbitMqService: RabbitMQService) { }

    async createOrder(@Req() req: CustomRequest, createOrderDto: CreateOrderDto): Promise<CreateOrderResponce> {
        try {

            const userId = req.user.userId;
            createOrderDto.userId = userId;
            // Create a new order instance
            const newOrder = new this.orderModel(createOrderDto);

            // Save the new order to the database
            const result = await newOrder.save();

            // Convert the result to a plain JavaScript object and exclude `_id`
            const orderResponse = result.toObject();
            delete orderResponse._id;
            const RMq = {
                orderResponse,
                email:req.user.email,
                type: "orderCreated"
            }
            await this.RabbitMqService.connect();
            await this.RabbitMqService.publish('mail_queue', RMq);
            // Return a response with additional metadata
            return {
                order: orderResponse,
                message: 'Order created successfully',
                success: true,
                statusCode: 201,
            };

        } catch (error) {
            // Handle different types of errors
            console.error(error.message);
            if (error.name === 'ValidationError') {
                throw new BadRequestException('Validation failed');
            } else {
                // For other errors, log the error and throw a generic internal server error
                console.error('Error creating order:', error);
                throw new InternalServerErrorException('An unexpected error occurred');
            }

        }
    }


    async updateOrder(updateorderDto: UpdateOrderDto): Promise<UpdateOrderResponse> {
        try {
            // Validate the input DTO if necessary
            if (!updateorderDto.orderId || !updateorderDto.status) {
                return {
                    message: 'Invalid input data',
                    success: false,
                    statusCode: 400,
                };
            }

            // Attempt to find and update the order
            const order = await this.orderModel.findOneAndUpdate(
                { orderId: updateorderDto.orderId },
                { status: updateorderDto.status },
                { new: true }
            );

            // If order not found, return a 404 response
            if (!order) {
                return {
                    message: 'Order not found',
                    success: false,
                    statusCode: 404,
                };
            }

            // Prepare the response object by removing unnecessary fields
            const orderResponse = order.toObject();
            delete orderResponse._id;
            console.log(orderResponse);

            // Return success response
            return {
                message: 'Order updated successfully',
                success: true,
                statusCode: 200,
            };

        } catch (error) {
            console.error('Error updating order:', error);

            // Handle different types of errors
            return {
                message: 'An error occurred while updating the order',
                success: false,
                statusCode: 500,
            };
        }
    }
}
