import { RequestHandler } from "express";

export const generateAuthLink:RequestHandler = (req, res) => {
    console.log(req.body);
    res.json({ok:false});
};
