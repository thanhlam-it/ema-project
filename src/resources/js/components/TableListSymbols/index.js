import React, { useState, useEffect } from "react";

import Item from "../Item";

import { myAxios, getTimeStamp } from "../../services/apiService";

const TableListSymbols = ({ symbols, allowAmount }) => {
    const [data, setData] = useState(null);
    const [timeStamp, setTimeStamp] = useState(null);

    useEffect(() => {
        // myAxios.get(`/fapi/v1/premiumIndex?symbol=${symbol}`).then((res) => {
        //     setData(res);
        //     // console.log(res);
        // });

        getTimeStamp().then((res) => {
            setTimeStamp(res);
        });
    }, []);

    const renderItems = () =>
        symbols.map((symbol) => (
            <Item
                key={symbol}
                symbol={symbol}
                allowAmount={allowAmount}
                timeStamp={timeStamp}
            />
        ));

    return (
        <table className="table table-bordered text-center">
            <thead>
                <tr>
                    <th className="border border-5" scope="col" width="5%">
                        Symbol
                    </th>
                    <th className="border border-5" scope="col" width="20%">
                        Entry | TP | SL
                    </th>
                    {/* <th  className="border border-5" scope="col" width="10%">TP</th>
                    <th  className="border border-5" scope="col" width="10%">SL</th> */}
                    {/* <th
                        className="border border-5"
                        scope="col"
                        width="5%"
                    >
                        Signal
                    </th> */}
                    <th className="border border-5" scope="col" width="6%">
                        RSI
                    </th>
                    <th className="border border-5" scope="col" width="6%">
                        Price
                    </th>
                    <th className="border border-5" scope="col" width="6%">
                        EMA 80
                    </th>
                    <th className="border border-5" scope="col" width="6%">
                        EMA 13
                    </th>
                    <th className="border border-5" scope="col" width="6%">
                        EMA 21
                    </th>
                    <th className="border border-5" scope="col" width="6%">
                        EMA 3
                    </th>
                    <th className="border border-5" scope="col" width="6%">
                        EMA 5
                    </th>
                </tr>
            </thead>
            <tbody>{renderItems()}</tbody>
        </table>
    );
};

export default TableListSymbols;
