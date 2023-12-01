import { Request, Response } from "express"
import { OrderBook} from './../orderbook';
import { orderBook } from "..";
import { Order } from "../order";
import { v4 as uuidv4 } from "uuid";
import { Logger } from "../logger";
import { fetchOrderClients, FetchOrderClient, sendOrderEventToAllClient} from './../sse-events/orders.events'
const logger = new Logger();


export const fetchAllOrdersEvent = async (req: Request, res: Response) => {
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    };
    res.writeHead(200, headers);
    try { 
        const orders = await orderBook.FetchOrder()
        console.log(orders)
        console.log(JSON.stringify(orders))
        res.write(`${JSON.stringify(orders)}\n\n`)
        // orders.forEach(order => {
        //     res.write(`${JSON.stringify(orders)}\n\n`)
        // })
        const clientId = uuidv4()
        const client : FetchOrderClient = { clientId: clientId,  res: res}
        fetchOrderClients.push(client)
        req.on("close", ()=>  {
            logger.INFO("closing the connection of client ")
            fetchOrderClients.filter(client => client.clientId != clientId)
        })
    } catch(err: any) {
        logger.INFO("error : "  + err)
    }
}



export const cancelOrder = async (req: Request, res: Response) => {
    const {userId, orderId, side } = req.body
    if(userId == "" || orderId == "" || side == "") {
        res.status(400).json({message : "invalid order and user details"})
        return
    }
    try{
        const isCancelled = await orderBook.CancelOrder(orderId, side, userId)
        res.status(201).json({message : isCancelled})
        return
    }catch(err :any) {
        res.status(400).json({message: err})
        return
    }
}




export const placeOrder = async (req: Request, res: Response) => {
    const {userId, side , price, quantity } = req.body
    if(userId == "" || side == "" || price == null || quantity == null) {
        res.status(400).json({message : "invalid order details"})
        return
    }
    try{
        const order: Order = {userId: userId, orderId : uuidv4(),  side: side, price: parseInt(price), quantity:parseInt(quantity)}
        const orderCreated = await orderBook.PlaceOrder(order)
        res.status(201).json({order : order})
        return sendOrderEventToAllClient(order)
    }catch(err :any) {
        res.status(400).json({message: err})
        return
    }
}

