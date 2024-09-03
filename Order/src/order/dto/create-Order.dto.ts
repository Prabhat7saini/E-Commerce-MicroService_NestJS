import { IsNotEmpty, IsString } from "class-validator";

class Item{
    name: string;
    price: string;
    quantity: string;
}
export class CreateOrderDto {
    @IsString({ message: 'Product name must be a string' })
    @IsNotEmpty({ message: 'Product name is required' })
    orderId?: string;
    @IsString({ message: 'User ID must be a string' })
    @IsNotEmpty({ message: 'User ID is required' })
    userId?: string;
    @IsNotEmpty({ message: 'Items is required' })
    items: Item[];
    @IsString({ message: 'Total amount must be a string' })
    @IsNotEmpty({ message: 'Total amount is required' })
    totalAmount: string;
    @IsNotEmpty({ message: 'Status is required' })
    status?: string;

}


export class CreateOrderResponce {
    order?:CreateOrderDto
    message:string;
    success: boolean;
    statusCode: number;
}


