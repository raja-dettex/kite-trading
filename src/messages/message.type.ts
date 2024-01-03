import { Order } from './../order'
export type AddOrderMessage = {
    message : string,
    payload : Order
}


export type RemoveOrderMessage = { 
    mesasge: string,
    payload : string,
}
