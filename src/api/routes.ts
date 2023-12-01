import { Router } from "express";
import {  placeOrder, cancelOrder, fetchAllOrdersEvent } from './controller'

const router = Router()


router.get("/orders", fetchAllOrdersEvent)
router.post("/orders", placeOrder)
router.post("/orders/cancel", cancelOrder)

export { router }