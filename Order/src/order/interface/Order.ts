export interface OrderItem {
    name: string;
    price: string;
    quantity: string;
}

export interface Order {
    orderId?: string;
    userId?: string;
    items: OrderItem[];
    totalAmount: string;
    status?: string;
}


export interface JwtPayload {
    userId?: string;
    email: string;
}