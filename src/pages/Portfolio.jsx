import PortfolioBanner from "../components/portfolio/PortfolioBanner";
import ActivePosition from "../components/portfolio/ActivePosition";
import Footer from "../components/primary/Footer";
import Navbar from "../components/primary/Navbar";
import MaturedPosition from "../components/portfolio/MaturedPosition";
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import { useState , useEffect, useContext} from "react";
import { ExchangeRateContext } from '../helpers/Converter';

import LilaPoolsProvider from "../abi/LilaPoolsProvider.json";
import ILilaOracle from "../abi/ILilaOracle.json";
import ILilaPosition from "../abi/ILilaPosition.json";
import address from "../data/address.json";

const Portfolio = () => {

  const { publicClient, to10DecUSD, to10Dec, userAddress, toTokenFromAddress } = useContext(ExchangeRateContext);

  const [activePositions, setActivePositions] = useState([]);
  const [expiredPositions, setExpiredPositions] = useState([]);
  const [connected, setConnected] = useState(false);


  const DataToPositions = async (user_address) => {

    let active_positions = [];
    let expired_positions = [];
    
    const positionsCount = (await publicClient.readContract({
      address: address.core.position_address,
      abi: ILilaPosition.abi,
      functionName: "balanceOf",
      args: [user_address],
    }));

    const count = Number(positionsCount);

    let list = Array.from({ length: count }, (_, i) => i);

    // Create an array of promises turning indexs to positions
    const promises = Object.keys(list).map(async (index) => {
      
      const tokenID = (await publicClient.readContract({
        address: address.core.position_address,
        abi: ILilaPosition.abi,
        functionName: "tokenOfOwnerByIndex",
        args: [user_address, index],
      }));

      const Position = (await publicClient.readContract({
        address: address.core.position_address,
        abi: ILilaPosition.abi,
        functionName: "getPosition",
        args: [tokenID],
      }));

      const Pool_ = (await publicClient.readContract({
        address: address.core.poolprovider_address,
        abi: LilaPoolsProvider.abi,
        functionName: "poolList",
        args: [Position['poolId']],
      }));

      const Pool ={
        maxAmount: Pool_[0],
        strategy: Pool_[1],
        asset: Pool_[2],
        payoutFrequency: Pool_[3],
        totalPayments: Pool_[4],
        rateIndex: Pool_[5],
      }

      const rateKey = (await publicClient.readContract({
        address: address.core.oracle_address,
        abi: ILilaOracle.abi,
        functionName: "getKey",
        args: [Pool.strategy, Pool.totalPayments, Position['rateIndex']],
      }));

      const rate = (await publicClient.readContract({
        address: address.core.oracle_address,
        abi: ILilaOracle.abi,
        functionName: "getNumerator",
        args: [rateKey],
      }));
      const amountUSD = await to10DecUSD(Position.amount, toTokenFromAddress(Pool.asset));
      const amount = await to10Dec(Position.amount, toTokenFromAddress(Pool.asset));

      const matured_ = Position['claimedPayments'] ==  Pool['totalPayments'];
      
      const result = {position: Position, 
        pool: Pool, 
        rate: rate, 
        amount: amount, 
        amountUSD: amountUSD,
        matured: matured_,
        tokenID: tokenID
      }

      return result;

    });
  
    // // Wait for all promises to resolve
    const results = await Promise.all(promises);
  
    // // Separate the results into active and expired positions
    results.forEach(result => {
      if (!result.matured) {
        active_positions.push(result);
      } else {
        expired_positions.push(result);
      }
    });
  
    setActivePositions(active_positions);
    setExpiredPositions(expired_positions);
    
  };
  
  
  useEffect(() => {
    if(userAddress){
      // client.query({ query: gql(Query(userAddress))}).then((data) => DataToPositions(data))
      DataToPositions(userAddress);
      setConnected(true);
    }else{
      setConnected(false);
      setActivePositions([]);
      setExpiredPositions([]);
    }

  }, [userAddress]);

  return (
    <div className="w-full">
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
