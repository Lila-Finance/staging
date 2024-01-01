import React, { createContext, useState, useEffect } from 'react';
import { usePublicClient, useAccount } from "wagmi";

export const ExchangeRateContext = createContext();

export const ExchangeRateProvider = ({children}) => {
    const publicClient = usePublicClient();
    const { address: userAddress } = useAccount();

    const to10DecUSD = async (value, token) => {
        
        let sumTVL = BigInt(0);
        if(token == "usdc"){
            sumTVL+= (BigInt(value))*(BigInt("10000")); // 6 decimal places -> 10
        }
        else if(token == "dai"){
            sumTVL+= (BigInt(value))/(BigInt("100000000")); // 18 decimal places -> 10
        }
        else if(token == "usdt"){
            sumTVL+= (BigInt(value))*(BigInt("10000")); // 6 decimal places -> 10
        }
        else if(token == "weth"){
            const ethResponse = await fetch('https://production.api.coindesk.com/v2/tb/price/ticker?assets=ETH');
            const ethData = await ethResponse.json();
            const ethExchangeRate = ethData.data.ETH.ohlc.c;

            if(ethExchangeRate != 0) { 
                sumTVL+= (BigInt(value)*BigInt((ethExchangeRate*100).toFixed(0)))/(BigInt("10000000000"));
            }
        }
        else if(token == "wbtc"){
            const btcResponse = await fetch('https://api.coindesk.com/v1/bpi/currentprice/usd.json');
            const btcData = await btcResponse.json();
            const btcExchangeRate = btcData.bpi.USD.rate_float;

            if(btcExchangeRate != 0) {
                sumTVL+= (BigInt(value) * BigInt((btcExchangeRate*100).toFixed(0)));
            }
        }
        
        return sumTVL
    }

    const to5DecValue = (value, token) => {
        let sumTVL = BigInt(0);
        if(token == "usdc"){
            sumTVL+= (BigInt(value))/(BigInt("10")); // 6 decimal places -> 5
        }
        else if(token == "dai"){
            sumTVL+= (BigInt(value))/(BigInt("10000000000000")); // 18 decimal places -> 5
        }
        else if(token == "usdt"){
            sumTVL+= (BigInt(value))/(BigInt("10")); // 6 decimal places -> 5
        }
        else if(token == "weth"){
            sumTVL+= (BigInt(value))/(BigInt("10000000000000")); // 18 decimal places -> 5
        }
        else if(token == "wbtc"){
            sumTVL+= (BigInt(value))/(BigInt("1000")); // 8 decimal places -> 5
        }
        return sumTVL
    }

    const FivDecBigIntToFull = (value, token) => {
        //Bigint value
        let sumTVL = BigInt(0);
        if(token == "usdc"){
            sumTVL+= BigInt(value)*(BigInt("10")); // 5 decimal places -> 6
        }
        else if(token == "dai"){
            sumTVL+= value*(BigInt("10000000000000")); // 5 decimal places -> 18
        }
        else if(token == "usdt"){
            sumTVL+= BigInt(value)*(BigInt("10")); // 5 decimal places -> 6
        }
        else if(token == "weth"){
            sumTVL+= value*(BigInt("10000000000000")); // 5 decimal places -> 18
        }
        else if(token == "wbtc"){
            sumTVL+= value*(BigInt("1000")); // 5 decimal places -> 8
        }
        return sumTVL
    }


    return (
        <ExchangeRateContext.Provider value={{publicClient, to10DecUSD, userAddress, to5DecValue, FivDecBigIntToFull }}>
            {children}
        </ExchangeRateContext.Provider>
    );
}
