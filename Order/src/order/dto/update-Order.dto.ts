import { IsNotEmpty, IsString } from "class-validator";
import { CreateOrderResponce } from "./create-Order.dto";

export class UpdateOrderDto {
    @IsString({ message: 'Product name must be a string' })
    @IsNotEmpty({ message: 'Product name is required' })
    orderId?: string;
    @IsNotEmpty({ message: 'Status is required' })
    status?: string;

}


export class UpdateOrderResponse {
    order?: CreateOrderResponce
    message: string;
    success: boolean;
    statusCode: number;
}


