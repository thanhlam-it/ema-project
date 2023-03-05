import React, { useState, useEffect } from "react";

import TableListSymbols from "../TableListSymbols";
import Balance from "../Balance";

const listSymbols = [
    "BTCUSDT",
    // "ETHUSDT",
    // "XRPUSDT",
    // "MATICUSDT",
    // "LINKUSDT",
    // "XLMUSDT",
    // "FTMUSDT",
    // "ADAUSDT",
    // "DASHUSDT",
    // "BNBUSDT",
    // "ATOMUSDT",
    // "DOGEUSDT",
    // "AVAXUSDT",
    // "SANDUSDT",
    // "GALAUSDT",
    // "ANKRUSDT",
];

const Home = () => {
    const [balanceData, setBalanceData] = useState(null);

    const [allowAmount, setAllowAmount] = useState(0);

    useEffect(() => {
        const allowValue = balanceData / listSymbols.length;
        const fixedValue = balanceData * 5 / 100;
        // setAllowAmount(allowValue > fixedValue ? fixedValue : allowValue);
        setAllowAmount(5);
    }, [balanceData]);

    return (
        <div className="m-4">
            <Balance setBalanceData={setBalanceData} />
            <TableListSymbols symbols={listSymbols} allowAmount={allowAmount} />
        </div>
    );
};

export default Home;
