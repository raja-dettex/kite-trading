
export interface Order {
    userId : string;
    orderId : string;
    side?: string;
    price : number;
    quantity : number;
}


export type SortFunc = (a :Order , b:Order) => number