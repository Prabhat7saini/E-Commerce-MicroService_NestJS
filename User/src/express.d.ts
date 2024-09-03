// src/express.d.ts
import * as express from 'express';

declare global {
    namespace Express {
        interface Request {
            user?: any; // Replace `any` with the type of your user object if known
        }
    }
}
