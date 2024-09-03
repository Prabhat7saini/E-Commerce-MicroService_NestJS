import { Injectable } from '@nestjs/common';
import { createEmailBody } from '../email/emailTemplate'
import { createOrderConfirmationEmailBody } from '../email/emailTemplateCreateOder'
import { createWelcomeEmailBody } from '../email/emailTemplateSignUP'
import { EmailService } from 'src/email/email.service';

@Injectable()
export class EmailServices {
    constructor(private sendmail: EmailService) { }

    // Create email body based on event type
    async createEmailBody(data?: any): Promise<void> {
        const eventType = data.type;
        const orderId = data?.orderResponse?.orderId;
        const items = data?.orderResponse?.items;
        const totalAmount = data?.orderResponse?.totalAmount;
        let obj={
            orderId:data?.orderId,
            paymentId:data?.paymentId,
            status:data?.status,
            totalAmount:data?.totalAmount

        }
        
        console.log(data, eventType, `check data email`)
        switch (eventType) {
            case 'orderFulfilled':
            let htmlpayment = createEmailBody(obj);
                this.sendmail.sendMail(data.email,"YOUR PAYMENT DETAILS HERE", htmlpayment)
            return;
            case 'orderCreated':
                let htmlbody = createOrderConfirmationEmailBody({ orderId, items, totalAmount });

                await this.sendmail.sendMail(data.email, "Order created", htmlbody)

                return;
            case 'userCreate':
                let htmluser=createWelcomeEmailBody({userName:data.user.name})
                 await this.sendmail.sendMail(data.user.email, "User created", htmluser);
                 return;
            // return `Welcome ${data?.userName}! We're glad to have you.`;
            default:
            return ;
        }
    }
}