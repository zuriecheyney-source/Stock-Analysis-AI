export interface StockData {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    marketCap: number;
    peRatio: number;
    dividendYield: number;
    high: number;
    low: number;
    open: number;
    previousClose: number;
    timestamp: string;
}
export declare function getStockData(symbol: string): Promise<StockData>;
//# sourceMappingURL=stockService.d.ts.map