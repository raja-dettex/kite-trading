import { Order, SortFunc } from "./order";
import { EventEmitter } from "events";
import { sendRemoveOrderEventsToAllClient } from "./sse-events/orders.events";
import { readLog } from "./utils/logging.util";
import { Logger } from "./logger";
import { TradeEngine } from "./trade";
import { v4 as uuidv4 } from "uuid";
export class OrderBook extends EventEmitter {
    bids : Order[] = [];
    asks : Order[] = [];

    constructor() { 
        super()
        this.bootstrapOrders()
    }
    async bootstrapOrders() {
        const orders = await readLog()
        for(let o of orders) { 
            const order: Order = JSON.parse(o)
            console.log(order)
            if(order.side == "buy") {
            
                if(this.bids.length == 0) { 
                    this.bids.push(order)
                } 
                for (let bid of this.bids) { 
                    if(bid.userId != order.userId ||  bid.side != "buy") {
                        this.bids.push(order)
                    }
                }
            } else if(order.side == "sell") {
                if(this.asks.length == 0) { 
                    this.asks.push(order)
                } 
                for (let ask of this.asks) { 
                    if(ask.userId != order.userId || ask.side != "sell") {
                        this.asks.push(order)
                    }
                }     
            }
        }
        console.log("bids " + this.bids)
        console.log("asks " + this.asks)
    }
    sortOrder(sortFunc : SortFunc, side : string) { 
        if ( side == "bids" ) { 
            this.bids.sort(sortFunc)
            return
        }
        this.asks.sort(sortFunc)
        return
    }

    public async PlaceOrder(order : Order) : Promise<boolean> {
        if(order.side == "buy") {
            this.bids.push(order)
            this.sortOrder((a:Order, b: Order) => b.price - a.price, "bids")
        } else {
            this.asks.push(order)
            this.sortOrder((a:Order, b: Order) => a.price - b.price, "asks")
        }
        this.emit("OrderPlaced", order)
        return true
    }
    
    public async ExecuteOrder()  {
        if(this.bids.length < this.asks.length) { 
            for(let i = 0; i < this.bids.length; i++) {
                for(let j = 0; j < this.asks.length; j++) {
                    if(this.bids[i].price == this.asks[j].price && this.bids[i].userId != this.asks[j].userId) {
                        const bid = this.bids[i]
                        const ask = this.asks[j]
                        if(bid.quantity < ask.quantity ) {
                            this.bids = this.bids.filter(order => order.orderId != bid.orderId)
                            let newQty = ask.quantity - bid.quantity
                            this.asks[j] = { ...ask, quantity: newQty} 
                            const newAsk = this.asks[j]
                            this.emit("Executed", newAsk) 
                        } else {
                            this.asks = this.asks.filter(order => order.orderId != ask.orderId)
                            let newQty = bid.quantity - ask.quantity
                            this.bids[i] = { ...bid, quantity: newQty}
                            const newBid = this.bids[i]
                            this.emit("Executed", newBid)
                        }
                        sendRemoveOrderEventsToAllClient(bid.orderId)
                        sendRemoveOrderEventsToAllClient(ask.orderId)
                    }
                 }
            }
        }else { 
            for(let i = 0; i < this.asks.length; i++) {
                for(let j = 0; j < this.bids.length; j++) {
                    if(this.asks[i].price == this.bids[j].price && this.asks[i].userId != this.bids[j].userId) {
                        const ask = this.asks[i]
                        const bid = this.bids[j]
                        if(bid.quantity < ask.quantity ) {
                            this.bids = this.bids.filter(order => order.orderId != bid.orderId)
                            let newQty = ask.quantity - bid.quantity
                            this.asks[i] = { ...ask, quantity: newQty} 
                            const newAsk = this.asks[i]
                            this.emit("Executed", newAsk) 
                        } else {
                            this.asks = this.asks.filter(order => order.orderId != ask.orderId)
                            let newQty = bid.quantity - ask.quantity
                            this.bids[j] = { ...bid, quantity: newQty}
                            const newBid = this.bids[j]
                            this.emit("Executed", newBid)
                        }
                        sendRemoveOrderEventsToAllClient(bid.orderId)
                        sendRemoveOrderEventsToAllClient(ask.orderId)
                    }
                 }
            }
        }
    } 

    public async CancelOrder(orderId : string, side: string, userId : string) : Promise<boolean> { 
        let order:Order|undefined;
        if(side == "buy") {
            order = this.bids.find(bid => bid.orderId == orderId && bid.userId == userId)
            if (order == undefined) {
                return false
            } 
            this.bids.filter(bid => bid.orderId != orderId && bid.userId != userId)
            return true
        }
        order = this.asks.find(ask => ask.orderId == orderId)
            if (order == undefined) {
                return false
            } 
            this.asks.filter(ask => ask.orderId != orderId)
            return true
    }

    public async FetchOrderByuserId(userId : string) : Promise<any[]> {
        const bids = this.bids.filter(bid => bid.userId == userId)
        const asks = this.asks.filter(ask => ask.userId == userId)
        asks.forEach(ask => bids.push(ask))
        return bids;
    }
    public async FetchOrder() : Promise<any[]> {
        const bids = this.bids
        this.asks.forEach(ask => bids.push(ask))
        return bids;
    }


    public async FetchOrderById(orderId: string, side : string, userId : string) : Promise<Order|undefined> {
        if(side == "buy") {
            return this.bids.find(bid => bid.orderId == orderId && bid.userId == userId) 
        }
        return this.asks.find(ask => ask.orderId == orderId && ask.userId == userId)
    }
}


