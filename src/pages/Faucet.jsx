import { useState, useContext, useEffect } from "react";
import FaucetContents from "../components/faucet/FaucetContents";
import Navbar from "../components/primary/Navbar";
import { MarketDataContext } from '../constants/MarketDataProvider';
import address from '../data/address.json';
import { ExchangeRateContext } from '../helpers/Converter';
import IERC20 from "../abi/IERC20Permit.json";
import IFaucet from "../abi/IFaucet.json";
import {useContractWrite} from "wagmi";

const Faucet = () => {
  const { publicClient, to10Dec, userAddress, FivDecBigIntToFull } = useContext(ExchangeRateContext);
  const { marketContents } = useContext(MarketDataContext);
  const [cMarketContents, setCMarketContents] = useState(marketContents);
  

  const toTVLString = (value) => {
    let strValue = value.toString();

    strValue = strValue.padStart(11, '0');

    strValue = strValue.slice(0, -10) + '.' + strValue.slice(-10, -4);

    return strValue;
  };

  const [FaucetArgs, setFaucetArgs] = useState([]);
    const { write: FaucetCall } = useContractWrite({
        address: address.core.faucet_address,
        abi: IFaucet.abi,
        functionName: "mint",
        args: FaucetArgs,
    });

  const setSelectedAssetM = (ni) => {
    FaucetCall();
  };

  const Faucet = async (token) => {
      const amount = token=="wbtc" ? FivDecBigIntToFull(BigInt("50000"), token) : FivDecBigIntToFull(BigInt("100000000"), token)
      console.log([address.assets[token], userAddress, amount]);
      setFaucetArgs([address.assets[token], userAddress, amount]);
  }

  const getUserBalance = async (tokenAddress) => {
      if (publicClient && userAddress != undefined) {
          const BALANCE = await publicClient.readContract({
              address: tokenAddress,
              abi: IERC20.abi,
              functionName: "balanceOf",
              args: [userAddress],
          });
          return (BigInt(BALANCE.toString()));
      }            
  };

  const updateMarketContents = async () => {
    if (!userAddress) {
      setCMarketContents(marketContents);
      return;
    }
  
    // Assuming marketContents is an array of objects
    let promises = marketContents.map((marketItem, index) => {
      const token = marketItem.coinName.toLowerCase();
      return getUserBalance(address.assets[token])
        .then(async v => {
          const ten = await to10Dec(v, token);
          const value = toTVLString(ten);
          return { ...marketItem, value: value };
        });
    });
  
    // Wait for all promises to resolve and update the newMarket array
    const newMarket = await Promise.all(promises);
    setCMarketContents(newMarket);
  };
   

  useEffect(() => {
    updateMarketContents();
    
  }, [userAddress, marketContents]); 

  return (
    <div className="w-full pb-10">
      <Navbar />
      
      <div className="w-full 2xl:max-w-7xl 3xl:max-w-[1400px] mx-auto px-4 md:px-10 lg:px-16 xl:px-24">
        {<FaucetContents Faucet={Faucet} marketContents={cMarketContents} setSelectedAsset={setSelectedAssetM} />}
      </div>
    </div>
  );
};

export default Faucet;
