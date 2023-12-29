import React, { createContext, useState, useEffect } from 'react';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

import { useAccount } from 'wagmi';
import { formatUnits } from 'viem';

const graphqlURL = "https://api.thegraph.com/subgraphs/name/dreamey-eth/lila-info-v1";
const poolQuery = `
  query($account: String) {
    poolInfos(orderBy: strategy) {
      active
      asset
      decimals
      frequency
      duration
      id
      maxAmount
      symbol
      strategy
      amount
    }
    rewardInfos(orderBy: strategy) {
      anualReward
      decimals
      duration
      frequency
      id
      strategy
    }
    positionInfos(where: {owner: $account}) {
      claimedAmount
      claimedDuration
      id
      lastClaimed
      poolID
      owner
      startTime
    }
  }
`
export const MarketDataContext = createContext();

const topColor = {
  "USDC": "#2774CA",
  "DAI": "#F4B731",
  "USDT": "#26A17B",
  "WETH": "#48CBD9",
  "WBTC": "#F09242",
}

const client = new ApolloClient({
  uri: graphqlURL,
  cache: new InMemoryCache(),
})

export const POOL_ADDRESS = "0x35943d28b7453b513256de34E32f189b311518f1";


export const MarketDataProvider = ({ children }) => {
  const { address: account } = useAccount();
  const [marketContents, setMarketContents] = useState([]);
  const [graphData, setGraphData] = useState(null);

  function groupByKey(arr, key, sortByKey) {
    const groupedObj = arr.reduce((acc, obj) => {
      const keyValue = obj[key];
      if (!acc[keyValue]) {
        acc[keyValue] = obj;
      } else {
        if (!Array.isArray(acc[keyValue])) {
          acc[keyValue] = [acc[keyValue]];
        }
        acc[keyValue].push(obj);
      }
      return acc;
    }, {});
  
    const resultArray = Object.values(groupedObj).map((group) =>
      group.sort((a, b) => a[sortByKey].localeCompare(b[sortByKey]))
    );
    return resultArray;
  }

  function updateRateValues(data) {
    const mergedInfos = data.poolInfos.map(pool => {
      const matchingReward = data.rewardInfos.find(reward => reward.strategy === pool.strategy && reward.duration === pool.duration);
      return {
        ...pool,
        ...(matchingReward && { anualReward: matchingReward.anualReward / matchingReward.decimals }), // Include reward-specific properties if a match is found
      };
    });
    const filteredInfos = mergedInfos.filter(item => item.anualReward);
    
    const finalInfo = groupByKey(filteredInfos, "strategy", "frequency");
    console.log(finalInfo);
    return finalInfo.map((item) => {
      const rates = item.map(obj => obj.anualReward);      ;
      const minRate = Math.min(...rates.map(Number));
      const maxRate = Math.max(...rates.map(Number));
      
      const TVL = formatUnits(item.reduce((sum, obj) => sum + parseFloat(obj.amount || 0), 0), item[0].decimals);
      const symbol = item[0].symbol;

      return {
        ...item[0],
        coinName: symbol,
        topBg: topColor[symbol],
        bottomCoin: "AAVE V3",
        wallet: `${minRate.toFixed(2)}% - ${maxRate.toFixed(2)}%`,
        rates,
        value: TVL
      };
    });
  }

  useEffect(() => {
    if(graphData != null) {
      setMarketContents(updateRateValues(graphData))
    }
  }, [graphData]);

  useEffect(() => {
      client
      .query({
        query: gql(poolQuery),
        variables: {
          account: account ? account.toLowerCase() : ""
        }
      })
      .then((data) => setGraphData(data.data))
      .catch((err) => {
        console.log('Error fetching data: ', err)
      })
  }, [account]);

  return (
    <MarketDataContext.Provider value={{ marketContents }}>
      {children}
    </MarketDataContext.Provider>
  );
};



