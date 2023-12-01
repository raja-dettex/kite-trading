import { Response } from "express"
import { Order } from "../order";
export interface FetchOrderClient { 
    clientId : string;
    res : Response;
}

export const fetchOrderClients: FetchOrderClient[] = [];


export const sendOrderEventToAllClient = (order: Order) => {
   fetchOrderClients.forEach(client => {
        client.res.write(`${JSON.stringify(order)}\n\n`)
    })
} 