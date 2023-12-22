import React, { createContext, useState, useEffect } from 'react';

import {AaveV3Rates} from "./AaveV3Rates";
import {AaveV3TVLs} from "./AaveV3TVLs";

export const MarketDataContext = createContext();

const marketContentsTemplate = [
  {
    id: 1,
    coinName: "USDC",
    wallet: "a.bc% - x.yz%",
    topBg: "#2774CA",
    bottomCoin: "AAVE V3",
    value: "0000.000000000",
  },
  {
    id: 3,
    coinName: "DAI",
    wallet: "a.bc% - x.yz%",
    topBg: "#F4B731",
    bottomCoin: "AAVE V3",
    value: "0000.000000000",
  },
  {
    id: 4,
    coinName: "USDT",
    wallet: "a.bc% - x.yz%",
    topBg: "#26A17B",
    bottomCoin: "AAVE V3",
    value: "0000.000000000",
  },
  {
    id: 6,
    coinName: "wETH",
    wallet: "a.bc% - x.yz%",
    topBg: "#48CBD9",
    bottomCoin: "AAVE V3",
    value: "0000.000000000",
  },
  {
    id: 7,
    coinName: "wBTC",
    wallet: "a.bc% - x.yz%",
    topBg: "#F09242",
    bottomCoin: "AAVE V3",
    value: "0000.000000000",
  },
];

export const MarketDataProvider = ({ children }) => {
  const [marketContents, setMarketContents] = useState(marketContentsTemplate);

  function updateRateValues() {
    return marketContentsTemplate.map((item) => {
      const rateObj = AaveV3Rates.find(rate => rate.TOKEN === item.coinName);
      const tvlObj = AaveV3TVLs.find(rate => rate.TOKEN === item.coinName);
      if (!rateObj || !tvlObj) {
        return item;
      }
  
      const rates = [rateObj.ONE_MONTH, rateObj.THREE_MONTH, rateObj.SIX_MONTH];
      const minRate = Math.min(...rates.map(Number));
      const maxRate = Math.max(...rates.map(Number));
  
      return {
        ...item,
        wallet: `${minRate.toFixed(2)}% - ${maxRate.toFixed(2)}%`,
        rates,
        value: tvlObj.TVL
      };
    });
  }

  useEffect(() => {
    setMarketContents(updateRateValues());
  }, []);

  return (
    <MarketDataContext.Provider value={{ marketContents }}>
      {children}
    </MarketDataContext.Provider>
  );
};



