import PortfolioBanner from "../components/portfolio/PortfolioBanner";
import ActivePosition from "../components/portfolio/ActivePosition";
import Footer from "../components/primary/Footer";
import Navbar from "../components/primary/Navbar";
import MaturedPosition from "../components/portfolio/MaturedPosition";
import { ScrollRestoration } from "react-router-dom";
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import { useState , useEffect, useContext} from "react";
import { ExchangeRateContext } from '../helpers/Converter';

import ILilaOracle from "../abi/ILilaOracle.json";
import address from "../data/address.json";

const APIURL = 'https://api.studio.thegraph.com/query/62005/lilafinancestaging/version/latest';

const Query = (address) => {return `
  query {
    deposits(first: 1000, where: { owner: "${address}"}, orderBy: tokenID, orderDirection: asc) {
     tokenID
     asset
     amount
     poolId
     blockTimestamp
   }
 }`;}
const PoolQuery = (index) => {return `
query {
  poolUpdateds(first: 1, where: {index: ${index}}, orderBy: blockTimestamp, orderDirection: asc) {
     index
     strategy
     asset
     frequency
     duration
     rateIndex
     blockTimestamp
 }
}`;}
const WithdrawQuery = (tokenId) => {return `
        query {
          withdrawals(first: 1, where: { tokenID: "${tokenId}" }) {
          blockTimestamp
        }
        }
`;}
const RewardQuery = (tokenId) => {return `
      query {
          rewardClaimeds(first: 100, where: {tokenID: ${tokenId}}) {
               tokenID
               reward
               claimedPeriod
      }
  }
`;}

const Portfolio = () => {

  const { publicClient, to10DecUSD, userAddress } = useContext(ExchangeRateContext);

  const [activePositions, setActivePositions] = useState([]);
  const [expiredPositions, setExpiredPositions] = useState([]);
  const [connected, setConnected] = useState(false);

  const client = new ApolloClient({
    uri: APIURL,
    cache: new InMemoryCache(),
  })

  const DepositToPosition = async (deposit, deposits) => {
      let new_deposit = deposits[deposit];

      const pooldata = (await client.query({ query: gql(PoolQuery(new_deposit['poolId']))}))['data'];
      const value = BigInt(new_deposit['amount']);
      const token = address['asset_addresses'][new_deposit['asset'].toLowerCase()];

      const pool = pooldata['poolUpdateds'][0];
      const strategy = pool['strategy'].toString();
      const duration = Number(pool['duration'])
      const rateIndex = Number(pool['rateIndex'])
      
      const key = (await publicClient.readContract({
        address: address.core.oracle_address,
        abi: ILilaOracle.abi,
        functionName: "getKey",
        args: [strategy, duration, rateIndex],
      }));

      const numerator = (await publicClient.readContract({
        address: address.core.oracle_address,
        abi: ILilaOracle.abi,
        functionName: "getNumerator",
        args: [key],
      }));

      const rewardsdata = (await client.query({ query: gql(RewardQuery(new_deposit['tokenID']))}))['data'];
      
      new_deposit = {
        ...new_deposit,
        amount: await to10DecUSD(value, token),
        rate: Number(numerator)/100000,
        strategy: pool['strategy'],
        duration: pool['duration'],
        blockTimestamp: pool['blockTimestamp'],
        rewardsData: rewardsdata['rewardClaimeds'],
      }
      return new_deposit;
  }

  const DataToPositions = async (data) => {
    const deposits = data['data']['deposits'];
    let active_positions = [];
    let expired_positions = [];
  
    // Create an array of promises
    const promises = Object.keys(deposits).map(async (depositKey) => {
      let new_deposit = await DepositToPosition(depositKey, deposits);
      const withdata = (await client.query({ query: gql(WithdrawQuery(deposits[depositKey]['tokenID']))}))['data'];
      
      if(withdata['withdrawals'].length == 0){
        return { type: 'active', position: new_deposit };
      } else {
        return { type: 'expired', position: new_deposit };
      }
    });
  
    // Wait for all promises to resolve
    const results = await Promise.all(promises);
  
    // Separate the results into active and expired positions
    results.forEach(result => {
      if (result.type === 'active') {
        active_positions.push(result.position);
      } else {
        expired_positions.push(result.position);
      }
    });
  
    setActivePositions(active_positions);
    setExpiredPositions(expired_positions);
  };
  
  
  useEffect(() => {
    if(userAddress){
      client.query({ query: gql(Query(userAddress))}).then((data) => DataToPositions(data))
    .catch((err) => { console.log('Error fetching data: ', err) })
      setConnected(true);
    }else{
      setConnected(false);
      setActivePositions([]);
      setExpiredPositions([]);
    }

  }, [userAddress]);

  return (
    <div className="w-full">
      <ScrollRestoration />
      <Navbar />
      <div className="w-full 2xl:max-w-7xl 3xl:max-w-[1400px] mx-auto px-4 md:px-10 lg:px-16 xl:px-24">
        <PortfolioBanner activePositions={activePositions} expiredPositions={expiredPositions} connected={connected}/>
        <ActivePosition activePositions={activePositions} connected={connected} />
        <MaturedPosition expiredPositions={expiredPositions} connected={connected} />
        <Footer />
      </div>
    </div>
  );
};

export default Portfolio;
