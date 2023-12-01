import { OrderBook } from "./orderbook";
import { TradeEngine } from "./trade";
import { Logger } from "./logger";
import express from "express";
import { router} from './api/routes'
import { v4 as uuidv4 } from "uuid";
 
const app = express();
app.use(express.json())
app.use("/api", router)
export const orderBook = new OrderBook();
const logger = new Logger();
const engine = new TradeEngine(orderBook, logger);

app.listen(4000, ()=> logger.INFO("APP listening to port" + 4000))

const scheduleExecution = () => {
    let timeoutId = setTimeout(() => {
        orderBook.ExecuteOrder()
        scheduleExecution()
    }, 5000)
}

scheduleExecution()