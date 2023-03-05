import React, { useState, useEffect } from "react";

// note add crossOver
import { RSI, EMA, crossDown, crossUp, ATR } from "technicalindicators";

import { crossOver } from "technicalindicators/lib/Utils/CrossOver";

import { ArrowDown, ArrowUp } from "react-feather";

import {
    myAxios,
    createSignature,
    getTimeStamp,
} from "../../services/apiService";

import {
    formatUSDT,
    convertStringToFloat,
    detachSource,
    crossUnder,
    createStopLoss,
    createTakeProfit,
} from "../../lib";

const Item = ({ symbol, callbackRefresh, allowAmount, timeStamp }) => {
    const [priceData, setPriceData] = useState({ markPrice: 0 });

    const [klineData, setKlineData] = useState(null);

    const [klineDataFormat, setKlineDataFormat] = useState(null);

    const [isLoadingPriceData, setIsLoadingPriceData] = useState(true);

    const [isLoadingKlineData, setIsLoadingKlineData] = useState(true);

    const [rsiValue, setRsiValue] = useState(0);

    const [atrValue, setAtrValue] = useState(0);

    // const [timeStamp, setTimeStamp] = useState(0);

    const [entryPrice, setEntryPrice] = useState(0);

    const [stopLossPrice, setStopLossPrice] = useState(0);

    const [takeProfitPrice, setTakeProfitPrice] = useState(0);

    const [isOnTrade, setIsOnTrade] = useState(false);

    const [emaData, setEmaData] = useState({
        ema3Data: [],
        ema5Data: [],
        ema13Data: [],
        ema21Data: [],
        ema80Data: [],
    });

    const [emaValue, setEmaValue] = useState({
        ema3: 0,
        ema5: 0,
        ema13: 0,
        ema21: 0,
        ema80: 0,
    });

    const [direction, setDirection] = useState(null);

    const intervalString = "1m"; //1m, 1h, 1d

    const sourceTypeString = "close"; // open, high, low, close, volume

    const RSIperiodLength = 14;

    const ATRperiodLength = 14;

    let interValId = null;

    useEffect(() => {
        interValId = setInterval(() => {
            getData();
        }, 5000);

        return () => clearInterval(interValId);
    }, []);

    useEffect(() => {
        if (timeStamp) {
            handleGetOpenOrders();
            handleGetCurrentPositions();
        }
    }, [timeStamp]);

    useEffect(() => {
        if (direction) {
            handleSetPositionData();
        }
    }, [direction]);

    useEffect(() => {
        const { markPrice = 0 } = priceData;
        const {
            ema3 = 0,
            ema5 = 0,
            ema13 = 0,
            ema21 = 0,
            ema80 = 0,
        } = emaValue;

        const { ema3Data, ema5Data } = emaData;

        let direction = "";

        if (rsiValue > 50) {
            if (markPrice > ema80 && ema13 > ema21) {
                // if (crossOver(ema3Data, ema5Data)) {
                //     direction = "BUY";
                // }

                if (crossUp({ lineA: ema3Data, lineB: ema5Data })) {
                    direction = "BUY";
                }
            }
        } else {
            if (markPrice < ema80 && ema13 < ema21) {
                if (crossDown({ lineA: ema3Data, lineB: ema5Data })) {
                    direction = "SELL";
                }

                // if (crossUnder(ema3Data, ema5Data)) {
                //     direction = "SELL";
                // }
            }
        }

        setDirection(direction);
    }, [emaData, rsiValue]);

    const handleGetCurrentPositions = () => {
        const queryString = `recvWindow=1000&symbol=${symbol}&timestamp=${timeStamp}`;
        const signature = createSignature(queryString);
        myAxios
            .get(`/fapi/v2/positionRisk?${queryString}&signature=${signature}`)
            .then((res) => {
                // todo need check multi order
                setEntryPrice(res?.[0]?.entryPrice);
                setIsOnTrade(true);
            });
    };

    const handleGetOpenOrders = () => {
        const queryString = `recvWindow=1000&symbol=${symbol}&timestamp=${timeStamp}`;
        const signature = createSignature(queryString);
        // todo need check multi order
        myAxios
            .get(`/fapi/v1/openOrders?${queryString}&signature=${signature}`)
            .then((res) => {
                res?.map((order) => {
                    if (order?.type === "TAKE_PROFIT_MARKET") {
                        setTakeProfitPrice(order.stopPrice);
                    } else if (order?.type === "STOP_MARKET") {
                        setStopLossPrice(order.stopPrice);
                    }
                });
            });
    };

    const getData = () => {
        setIsLoadingPriceData(true);
        setIsLoadingKlineData(true);

        myAxios.get(`/fapi/v1/premiumIndex?symbol=${symbol}`).then((res) => {
            setPriceData(res);
            setIsLoadingPriceData(false);
        });

        myAxios
            .get(`/fapi/v1/klines?symbol=${symbol}&interval=${intervalString}`)
            .then((res) => {
                const source = detachSource(res);
                setKlineData(res);
                setKlineDataFormat(source);
                const rsiInput = {
                    values: source[sourceTypeString],
                    period: RSIperiodLength,
                };
                const rsi = RSI.calculate(rsiInput);
                setRsiValue(rsi[rsi.length - 1]);

                handleSetEMAData(source);

                setIsLoadingKlineData(false);
            });
    };

    const renderLoading = (isLoading) =>
        isLoading && (
            <div
                className="spinner-border spinner-border-sm m-l-2"
                style={{ width: "10", height: "10", marginLeft: 10 }}
                role="status"
            ></div>
        );

    const handleSetEMAData = (source) => {
        const emaInput3 = {
            values: source[sourceTypeString],
            period: 3,
        };
        const ema3Data = EMA.calculate(emaInput3);

        const emaInput5 = {
            values: source[sourceTypeString],
            period: 5,
        };
        const ema5Data = EMA.calculate(emaInput5);

        const emaInput13 = {
            values: source[sourceTypeString],
            period: 13,
        };
        const ema13Data = EMA.calculate(emaInput13);

        const emaInput21 = {
            values: source[sourceTypeString],
            period: 21,
        };
        const ema21Data = EMA.calculate(emaInput21);

        const emaInput80 = {
            values: source[sourceTypeString],
            period: 80,
        };
        const ema80Data = EMA.calculate(emaInput80);

        setEmaValue({
            ema3: ema3Data[ema3Data.length - 1],
            ema5: ema5Data[ema5Data.length - 1],
            ema13: ema13Data[ema13Data.length - 1],
            ema21: ema21Data[ema21Data.length - 1],
            ema80: ema80Data[ema80Data.length - 1],
        });

        setEmaData({
            ema3Data,
            ema5Data,
            ema13Data,
            ema21Data,
            ema80Data,
        });
    };

    const handleSetPositionData = () => {
        const { markPrice = 0 } = priceData;
        // const stopLoss = createStopLoss(direction, markPrice, allowAmount);
        // const takeProfit = createTakeProfit(direction, markPrice, allowAmount);

        const ATRValue = handleGetATRData();

        const orderStopLoss =
            direction === "SELL"
                ? formatUSDT(parseFloat(markPrice) + ATRValue)
                : formatUSDT(parseFloat(markPrice) - ATRValue);
        const orderTakeProfit =
            direction === "SELL"
                ? formatUSDT(parseFloat(markPrice) - ATRValue)
                : formatUSDT(parseFloat(markPrice) + ATRValue);

        let quantity = allowAmount / ATRValue;
        quantity = Number(quantity.toFixed(2));

        handleCreateTrade(quantity, markPrice, orderStopLoss, orderTakeProfit);
    };

    const handleCreateTrade = (quantity, entry, stopLoss, takeProfit) => {
        // let timeStamp = 0;
        getTimeStamp().then((newTimeStamp) => {
            const queryString = `timeInForce=GTC&symbol=${symbol}&side=${direction}&type=MARKET&quantity=${quantity}&price=${entry}&timestamp=${newTimeStamp}`;
            const signature = createSignature(queryString);
            myAxios
                .post(`/fapi/v1/order?${queryString}&signature=${signature}`, {
                    timeInForce: "GTC",
                    symbol,
                    side: direction,
                    type: "MARKET",
                    quantity,
                    price: entry,
                    timestamp: newTimeStamp,
                    signature,
                })
                .then((res) => {
                    handleGetOpenOrders();
                    handleGetCurrentPositions();
                    // handleCreateTradeStopLoss(quantity, stopLoss, timeStamp);
                    // handleCreateTradeTakeProfit(quantity, takeProfit, timeStamp);
                });
        });
    };

    const handleCreateTradeStopLoss = (quantity, price, timeStamp) => {
        const queryString = `symbol=${symbol}&side=${direction}&type=STOP&quantity=${quantity}&price=${price}&timestamp=${timeStamp}`;
        const signature = createSignature(queryString);
        myAxios
            .post(`/fapi/v1/order?${queryString}&signature=${signature}`)
            .then((res) => {
                handleGetOpenOrders();
                handleGetCurrentPositions();
            });
    };

    const handleCreateTradeTakeProfit = (quantity, price, timeStamp) => {
        const queryString = `symbol=${symbol}&side=${direction}&type=TAKE_PROFIT&quantity=${quantity}&price=${price}&timestamp=${timeStamp}`;
        const signature = createSignature(queryString);
        myAxios
            .post(`/fapi/v1/order?${queryString}&signature=${signature}`)
            .then((res) => {
                handleGetOpenOrders();
                handleGetCurrentPositions();
            });
    };

    const handleGetATRData = () => {
        const ATRInput = {
            high: klineDataFormat["high"],
            low: klineDataFormat["low"],
            close: klineDataFormat["close"],
            period: ATRperiodLength,
        };

        const ATRData = ATR.calculate(ATRInput);

        const value = parseFloat(ATRData[ATRData.length - 1]);

        setAtrValue(Number(value).toFixed(2));

        return value;
    };

    return (
        <tr>
            <th scope="row" className="border border-5 border-bottom-0">
                {symbol}
            </th>
            <td className="border border-5 border-bottom-0 border-start-0 w-100p">
                <div className="d-flex justify-content-around">
                    <div>{entryPrice ? entryPrice : "-"}</div>
                    <div>|</div>
                    <div>{takeProfitPrice ? takeProfitPrice : "-"}</div>
                    <div>|</div>
                    <div>
                        {stopLossPrice ? stopLossPrice : "-"}{" "}
                        {`(+- ${atrValue} )`}
                    </div>
                </div>
            </td>
            {/* <td className="flex">TP {renderLoading(isLoadingKlineData)}</td>
            <td className="flex">SL {renderLoading(isLoadingKlineData)}</td> */}
            {/* <td className="border border-5 border-bottom-0 border-start-0">
                {signal ? (
                    <div className="d-flex justify-content-center">
                        {signal == "SELL" ? (
                            <ArrowDown className="text-danger" />
                        ) : (
                            <ArrowUp className="text-success" />
                        )}
                        {renderLoading(isLoadingKlineData)}
                    </div>
                ) : (
                    <div className="d-flex justify-content-center">
                        {"-"}
                        {renderLoading(isLoadingKlineData)}
                    </div>
                )}
            </td> */}

            <td
                className={` fw-bold border border-5 border-bottom-0 border-start-0 opacity-75 text-white ${
                    rsiValue > 50 ? "bg-success" : "bg-danger"
                }`}
            >
                {rsiValue} {renderLoading(isLoadingKlineData)}
            </td>
            <td
                className={`border border-5 border-bottom-0 border-end-0 opacity-75 text-white ${
                    priceData?.markPrice < emaValue?.ema80
                        ? "bg-danger"
                        : "bg-success"
                }`}
            >
                {formatUSDT(priceData?.markPrice ?? 0)}
                {renderLoading(isLoadingPriceData)}
            </td>
            <td
                className={`border border-5 border-bottom-0 border-start-0 opacity-75 text-white ${
                    priceData?.markPrice < emaValue?.ema80
                        ? "bg-danger"
                        : "bg-success"
                }`}
            >
                {formatUSDT(emaValue?.ema80)}
                {renderLoading(isLoadingKlineData)}
            </td>
            <td
                className={`border border-5 border-bottom-0 border-end-0 opacity-75 text-white ${
                    emaValue?.ema13 < emaValue?.ema21
                        ? "bg-danger"
                        : "bg-success"
                }`}
            >
                {formatUSDT(emaValue?.ema13)}
                {renderLoading(isLoadingKlineData)}
            </td>
            <td
                className={`border border-5 border-bottom-0 border-start-0 opacity-75 text-white ${
                    emaValue?.ema13 < emaValue?.ema21
                        ? "bg-danger"
                        : "bg-success"
                }`}
            >
                {formatUSDT(emaValue?.ema21)}
                {renderLoading(isLoadingKlineData)}
            </td>
            <td
                className={`border border-5 border-bottom-0 border-end-0 opacity-75 text-white ${
                    emaValue?.ema3 < emaValue?.ema5 ? "bg-danger" : "bg-success"
                }`}
            >
                {formatUSDT(emaValue?.ema3)} {renderLoading(isLoadingKlineData)}
            </td>
            <td
                className={`border border-5 border-bottom-0 border-start-0 opacity-75 text-white ${
                    emaValue?.ema3 < emaValue?.ema5 ? "bg-danger" : "bg-success"
                }`}
            >
                {formatUSDT(emaValue?.ema5)} {renderLoading(isLoadingKlineData)}
            </td>
        </tr>
    );
};

export default Item;
