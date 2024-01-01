import React, { createContext, useState, useEffect, useContext } from 'react';

import {AaveV3Rates} from "./AaveV3Rates";

import address from "../data/address.json"

import IProxy from "../abi/IProxy.json";

import { ExchangeRateContext } from '../helpers/Converter';

export const MarketDataContext = createContext();

const marketContentsTemplate = [
  {
    id: 0,
    coinName: "USDC",
    wallet: "a.bc% - x.yz%",
    topBg: "#2774CA",
    bottomCoin: "AAVE V3",
    value: "0000.000000000",
    proxy_name: 'usdc_aave_proxy',
    pool_index: [0, 1, 2]
  },
  {
    id: 1,
    coinName: "DAI",
    wallet: "a.bc% - x.yz%",
    topBg: "#F4B731",
    bottomCoin: "AAVE V3",
    value: "0000.000000000",
    proxy_name: 'dai_aave_proxy',
    pool_index: [3, 4, 5]
  },
  {
    id: 2,
    coinName: "USDT",
    wallet: "a.bc% - x.yz%",
    topBg: "#26A17B",
    bottomCoin: "AAVE V3",
    value: "0000.000000000",
    proxy_name: 'usdt_aave_proxy',
    pool_index: [6, 7, 8]
  },
  {
    id: 3,
    coinName: "wBTC",
    wallet: "a.bc% - x.yz%",
    topBg: "#F09242",
    bottomCoin: "AAVE V3",
    value: "0000.000000000",
    proxy_name: 'wbtc_aave_proxy',
    pool_index: [9, 10, 11]
  },
  {
    id: 4,
    coinName: "wETH",
    wallet: "a.bc% - x.yz%",
    topBg: "#48CBD9",
    bottomCoin: "AAVE V3",
    value: "0000.000000000",
    proxy_name: 'weth_aave_proxy',
    pool_index: [12, 13, 14]
  },
];

export const MarketDataProvider = ({ children }) => {
  const [marketContents, setMarketContents] = useState(marketContentsTemplate);

  const { publicClient, to10DecUSD } = useContext(ExchangeRateContext);

  const getProxyTVL = async (proxyAddress) => {
    if (publicClient) {
        const ProxyBalance = await publicClient.readContract({
            address: proxyAddress,
            abi: IProxy.abi,
            functionName: "balance",
            args: [],
        });
        return ProxyBalance;
    }

    return 0;
  };

  const toTVLString = (value) => {
    let strValue = value.toString();

    strValue = strValue.padStart(7, '0');

    strValue = strValue.slice(0, -6) + '.' + strValue.slice(-6);

    return strValue;
  };

  const getTVLs = async () => {
    let newValues = marketContentsTemplate.map((item) => {
      const rateObj = AaveV3Rates.find(rate => rate.TOKEN === item.coinName);

      if (!rateObj) {
        return item;
      }
  
      const rates = [rateObj.ONE_MONTH, rateObj.THREE_MONTH, rateObj.SIX_MONTH];
      const minRate = Math.min(...rates.map(Number));
      const maxRate = Math.max(...rates.map(Number));
  
      return {
        ...item,
        wallet: `${minRate.toFixed(2)}% - ${maxRate.toFixed(2)}%`,
        rates,
      };
    });
    
    let newMarketContents = newValues;
    
    for(let item in newMarketContents){
      let proxy_name = newMarketContents[item].proxy_name;
      let proxy_address = address.proxies[proxy_name];
      let value = await getProxyTVL(proxy_address);
      
      let sumTVL = await to10DecUSD(value, newMarketContents[item].coinName.toLowerCase())/BigInt(10000);
      newMarketContents[item].value = toTVLString(sumTVL);
    }
    setMarketContents(newMarketContents);
  }

  useEffect(() => {
    getTVLs();

    const interval = setInterval(() => {
      getTVLs();
    }, 8000);

      return () => clearInterval(interval);
  }, []);

  const coinNameToColor = (coinName) => {
    for (const item of marketContentsTemplate) {
      if (item.coinName.toLowerCase() === coinName.toLowerCase()) {
        return item.topBg;
      }
    }
    
    return '#FFFFFF'; 
  };

  return (
    <MarketDataContext.Provider value={{ marketContents, coinNameToColor }}>
      {children}
    </MarketDataContext.Provider>
  );
};



