import { Router, Request, Response } from "express";
import {  placeOrder, cancelOrder, fetchAllOrdersEvent } from './controller'

const router = Router()


router.get("/hello", (req: Request, res: Response)=> {
    res.json({message: "hello"})
})

router.get("/orders", fetchAllOrdersEvent)
router.post("/orders", placeOrder)
router.post("/orders/cancel", cancelOrder)

export { router }