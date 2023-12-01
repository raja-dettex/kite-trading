import { OrderBook } from "../orderbook"
import { assert} from 'chai';
import { v4 as uuidv4 } from "uuid";

describe("order book", () => {
    let orderBook:OrderBook;
    beforeEach(() => {
        orderBook = new OrderBook(); 
    })

    it("shoud place order" , async () => {
        const order =  { userId: uuidv4(),  orderId: uuidv4(), side : "buy", price: 4000, quantity: 2};
        const isPlaced = await orderBook.PlaceOrder(order);
        assert.equal(isPlaced, true);
    } )
    it("shoud fetch orders", async () => {
        const order1 =  {userId: uuidv4(),   orderId: uuidv4(), side : "buy", price: 4000, quantity: 2};
        const order2 =  {userId: uuidv4(),   orderId: uuidv4(), side : "sell" , price: 5000, quantity: 3};
        orderBook.PlaceOrder(order1)
        orderBook.PlaceOrder( order2)
        const orders = await orderBook.FetchOrder()
        expect(orders).toStrictEqual([order1, order2])
    })
    // it("should fetch order by orderId" , async () => {
    //     const order1 =  { orderId: uuidv4(), side : "buy", price: 4000, quantity: 2};
    //     const order2 =  { orderId: uuidv4(), side : "sell" , price: 5000, quantity: 3};
    //     orderBook.PlaceOrder(order1)
    //     orderBook.PlaceOrder( order2)
    //     const order = await orderBook.FetchOrderById(, "buy")
    //     expect(order).toStrictEqual(order1)
    // }) 
    it("shoud executed orders" , async () =>  {
        const id = uuidv4()
        // const order1 =  { orderId: 1, side : "buy", price: 4000, quantity: 2};
        // const order2 =  { orderId: 2, side : "sell" , price: 4000, quantity: 3};
        const order1 =  { userId: id,  orderId: uuidv4(), side : "buy", price: 4000, quantity: 5};
        const order2 =  { userId: id,  orderId: uuidv4(), side : "sell" , price: 4000, quantity: 10};
        orderBook.PlaceOrder(order1)
        orderBook.PlaceOrder( order2)
        orderBook.ExecuteOrder()
        const orders = await orderBook.FetchOrder()
        console.log(orders)
    })
})