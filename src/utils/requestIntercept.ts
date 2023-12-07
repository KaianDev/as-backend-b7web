import { RequestHandler } from "express";

export const requestIntercept: RequestHandler = (req, res, next) => {
    console.log(
        `➡️ ${req.method} ${req.originalUrl} ${JSON.stringify(req.body)}`
    );
    next();
};
