import { Response } from "express"
import { Order } from "../order";
import { fetchOrderClients } from "../api/controller";
import { AddOrderMessage, RemoveOrderMessage} from './../messages/message.type'
export interface FetchOrderClient { 
    clientId : string;
    res : Response;
}


export const sendOrderEventToAllClient = (order: Order) => {
   fetchOrderClients.forEach(client => {
        const message : AddOrderMessage = { message : "add", payload: order}
        client.res.write(`data: ${JSON.stringify(message)}\n\n`)
    })
} 

export const sendRemoveOrderEventsToAllClient = (orderId: string) => {
    fetchOrderClients.forEach(client => {
        const message : RemoveOrderMessage = { mesasge: "remove", payload: orderId}
        client.res.write(`data: ${JSON.stringify(message)}`)
    })
}