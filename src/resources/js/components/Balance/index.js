import React, { useState, useEffect } from "react";

import {
    myAxios,
    createSignature,
    getTimeStamp,
} from "../../services/apiService";

import { formatUSDT } from "../../lib";

const Balance = ({setBalanceData}) => {
    const [data, setData] = useState(null);
    const [timeStamp, setTimeStamp] = useState(null);

    useEffect(() => {
        getTimeStamp().then(setTimeStamp);
    }, []);

    useEffect(() => {
        timeStamp && getData();
    }, [timeStamp]);

    const getData = () => {
        const queryString = `recvWindow=1000&timestamp=${timeStamp}`;
        const signature = createSignature(queryString);

        myAxios
            .get(`/fapi/v2/account?${queryString}&signature=${signature}`)
            .then((res) => {
                setBalanceData?.(res.availableBalance)
                setData(res);
            });
    };

    const handleRefresh = () => {
        getTimeStamp().then(setTimeStamp);
    };

    return (
        <div className="d-flex justify-content-between w-50 p-2">
            <div className="d-flex flex-column">
                <div>Balance - totalWalletBalance: </div>
                <h1>{formatUSDT(data?.totalWalletBalance, true)}</h1>
                <div>Balance - availableBalance: </div>
                <h1>{formatUSDT(data?.availableBalance, true)}</h1>
            </div>
            <button
                type="button"
                className="btn btn-outline-secondary h-50"
                onClick={() => {
                    handleRefresh();
                }}
            >
                Refresh
            </button>
        </div>
    );
};

export default Balance;
