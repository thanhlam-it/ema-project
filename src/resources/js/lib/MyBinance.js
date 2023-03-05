import ccxt from "ccxt";

export const binanceGetOHLCV = (binance, ticker, interval) => {
    try {

        return binance.fetchOHLCV(ticker, interval);
    } catch (err) {
        throw "Ticker is not supported";
    }
};

export const binance = (isFuture = false, isTest = true) => {
    // if (!ccxt.exchanges.includes(ex)) {
    //     throw "Exchange is not supported";
    // }
    try {

        let option = {
            apiKey: import.meta.env.VITE_BINANCE_TEST_API_KEY,
            secret: import.meta.env.VITE_BINANCE_TEST_SECRET_API_KEY,
            enableRateLimit: true,
            adjustForTimeDifference: true,
            verbose: true,
        };

        if (isFuture) {
            option = {
                ...option,
                defaultType: "swap"
            }
        }

        const binance = new ccxt.binance({...option});

        if (isTest) {
            // test mode
            binance.set_sandbox_mode(true);
        }

        // binance.proxy = "http://127.0.0.1:8000/";
        // binance.session.verify=false       
        // binance.session.trust_env=false 

        return binance;

    } catch (err) {
        throw "Ticker is not supported";
    }
};