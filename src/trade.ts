import { OrderBook } from "./orderbook";
import { Order } from "./order";
import { Logger } from "./logger";

export class TradeEngine {
    constructor(private orderBook : OrderBook, private logger : Logger) {
        this.orderPlaced()
        this.orderExecuted()
    }
    orderPlaced() {
        this.orderBook.on("OrderPlaced", ( order: Order) => {
            const side = order.side
            this.logger.INFO(JSON.stringify({side, order}))
        })
    }

    orderExecuted() {
        this.orderBook.on("Executed", (order : Order) => {
            const side = order.side
            this.logger.INFO(JSON.stringify({side, order}))
        })
    } 
}