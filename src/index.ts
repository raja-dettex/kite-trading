import { OrderBook } from "./orderbook";
import { TradeEngine } from "./trade";
import { Logger } from "./logger";
import express from "express";
import cors  from "cors";
import { router} from './api/routes'
import { v4 as uuidv4 } from "uuid";
 
const app = express();
app.use(express.json())
app.use(cors())
app.use("/api", router)
export const orderBook = new OrderBook();
const logger = new Logger();
const engine = new TradeEngine(orderBook, logger);
async function main() { 
    const id1 = uuidv4()
    const id2 = uuidv4()
    const order1 =  { userId: id1,  orderId: uuidv4(), side : "buy", price: 4000, quantity: 5};
        const order2 =  { userId: id2,  orderId: uuidv4(), side : "sell" , price: 4000, quantity: 10};
        //orderBook.PlaceOrder(order1)
        //orderBook.PlaceOrder( order2)
        setTimeout(async () => { 
            console.log((await orderBook.FetchOrder()))
        }, 4000)
        
        orderBook.ExecuteOrder()
        const orders = await orderBook.FetchOrder()
        console.log(orders)
}


app.listen(4000, ()=> logger.INFO("APP listening to port" + 4000))

const scheduleExecution = () => {
    let timeoutId = setTimeout(() => {
        orderBook.ExecuteOrder()
        scheduleExecution()
    }, 5000)
}

scheduleExecution()
main()