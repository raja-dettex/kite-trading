import { OrderBook } from "./orderbook";
import { Order } from "./order";
import { Logger } from "./logger";
import { sendOrderEventToAllClient } from "./sse-events/orders.events";
import { readLog, writeLog} from './utils/logging.util'

export class TradeEngine {
    constructor(private orderBook : OrderBook, private logger : Logger) {
        this.orderPlaced()
        this.orderExecuted()
    }
    orderPlaced() {
        this.orderBook.on("OrderPlaced", async ( order: Order) => {
            const side = order.side
            this.logger.INFO(JSON.stringify({side, order}))
            await writeLog(order)
        })
    }

    async orderExecuted() {
        this.orderBook.on("Executed", async (order : Order) => {
            const side = order.side
            sendOrderEventToAllClient(order)
            this.logger.INFO(JSON.stringify({side, order}))
            await writeLog(order)
        })
    } 
}