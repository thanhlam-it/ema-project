export const detachSource = (ohlcv) => {
    let source = [];
    source["open"] = [];
    source["high"] = [];
    source["low"] = [];
    source["close"] = [];
    source["volume"] = [];
    if (ohlcv.length == 0) {
        return source;
    }
    ohlcv?.forEach((data) => {
        source["open"].push(parseFloat(data[oIndex]));
        source["high"].push(parseFloat(data[hIndex]));
        source["low"].push(parseFloat(data[lIndex]));
        source["close"].push(parseFloat(data[cIndex]));
        source["volume"].push(parseFloat(data[vIndex]));
    });
    return source;
};

export const timeIndex = 0;
export const oIndex = 1;
export const hIndex = 2;
export const lIndex = 3;
export const cIndex = 4;
export const vIndex = 5;

// 0:  Open time
// 1:  Open
// 2:  High
// 3:  Low
// 4:  Close
// 5:  Volume
// 6:  Close time
// 7:  Quote asset volume
// 8:  Number of trades
// 9:  Taker buy base asset volume
// 10:  Taker buy quote asset volume
// 11:  Ignore.

// data1, data2 is array data, demonstrating an indicator line
// this function verifies if data1 crossover data2
export const crossOver = (data1, data2) => {
    return data1[data1.length - 2] < data2[data2.length - 2] && data1[data1.length - 1] >= data2[data2.length - 1]
}

// data1, data2 is array data, demonstrating an indicator line
// this function verifies if data1 cross under data2

export const crossUnder = (data1, data2) => {
    return data1[data1.length - 2] > data2[data2.length - 2] && data1[data1.length - 1] <= data2[data2.length - 1]
}

export const USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

export const formatUSDT = (price, currency = false) => {
    let options = {};
    if (currency) {
        options = {
            style: 'currency',
            currency: 'USD',
        }
    } else {
        options = {
            style: "decimal",
            // minimumIntegerDigits: 4,
            minimumFractionDigits: 5,
        }
    }

    const USDollar = new Intl.NumberFormat('en-US', options);

    return USDollar.format(price);
}

export const convertStringToFloat = (string = "", fixed = 7) => {
    let number = parseFloat(string);
    number = Number(number.toFixed(fixed));
    return number;
    // return number.toLocaleString();
};

export const createStopLoss = (direction, entry, availableAmount, leverage = 20) => {
    let stopLoss = 0;
    // let availableAmount = parseFloat(amount * percent / 100);
    // let availableAmount = amount;
    let leverageAmount = parseFloat(availableAmount * leverage);
    let amountCoin = parseFloat(leverageAmount / entry);
    amountCoin = Number(amountCoin.toFixed(5));
    if (direction === 'SELL') {
        stopLoss = parseFloat((leverageAmount + availableAmount) / amountCoin);
    } else {
        stopLoss = parseFloat((leverageAmount - availableAmount) / amountCoin);
    }

    console.log(entry, leverageAmount, amountCoin, parseFloat(leverageAmount + availableAmount));

    return convertStringToFloat(stopLoss, 5);
}

export const createTakeProfit = (direction, entry, availableAmount, leverage = 20) => {
    let takeProfit = 0;
    // let availableAmount = parseFloat(amount * percent / 100);
    // let availableAmount = amount;
    let leverageAmount = parseFloat(availableAmount * leverage);
    let amountCoin = parseFloat(leverageAmount / entry);
    if (direction === 'SELL') {
        takeProfit = parseFloat(leverageAmount - availableAmount) / amountCoin;
    } else {
        takeProfit = parseFloat(leverageAmount + availableAmount) / amountCoin;
    }

    return convertStringToFloat(takeProfit, 5);
}