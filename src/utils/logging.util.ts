import { appendFile, readFile } from "fs/promises";
import { Order } from "../order";
import { v4 as uuidv4 } from "uuid";

export const writeLog = async (order: Order) => {
  await appendFile("./orders.log", JSON.stringify(order) + "\n");
};

export const readLog = async () => {
  try {
    const data = await readFile("./orders.log", "utf-8");
    return data.split("\n").filter((line) => line.trim() !== "");
  } catch (error) {
    console.error("Error reading log file:", error);
    return [];
  }
};

// Usage
const main = async () => {
    const id1 = uuidv4()
    const id2 = uuidv4()
    const order1 =  { userId: id1,  orderId: uuidv4(), side : "buy", price: 4000, quantity: 5};
        const order2 =  { userId: id2,  orderId: uuidv4(), side : "sell" , price: 4000, quantity: 10};
    await writeLog(order1)
    await writeLog(order2)
  const logData = await readLog();
  for(let o of logData) { 
    console.log(JSON.parse(o))
  }
};

//main();

