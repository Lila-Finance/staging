import Card from "../components/Card";
import Navbar from "../components/Navbar";
import addresj from "../addresses/addresj.json";
import ILilaPoolAddressProvider from "../abi/ILilaPoolAddressProvider.json";
import IProxy from "../abi/IProxy.json";
import ILilaPool from "../abi/ILilaPool.json";
import { useContractRead } from "wagmi";
import { useState, useEffect } from "react";
import { useAccount, usePublicClient, useContractWrite, useContractEvent } from "wagmi";
import { ethers } from "ethers";
import IERC20 from "../abi/IERC20.json";
import BlackOverlay from "../components/popups/BlackOverlay";
import DepositSuccessPopup from "../components/popups/DepositSuccessPopup";


const Market = () => {
    const { address } = useAccount();
    const publicClient = usePublicClient();
    const addrprov = addresj.addrprov;
    const [pools, setPools] = useState(() => {
        // Try to load pools from local storage immediately
        const cachedPools = localStorage.getItem('pools');
        return cachedPools ? JSON.parse(cachedPools) : [];
    });
    const [successDepo, setSuccessDepo] = useState(false);
    const [successAmount, setSuccessAmount] = useState("0");
    const [tvl, setTVL] = useState("0");
    const getPoolInfo = async (addre) => {

        if (publicClient) {
            const fixedLimit = await publicClient.readContract({
                address: addre,
                abi: ILilaPool.abi,
                functionName: "fixedLimit",
                args: [],
            });
            const fixedDepo = await publicClient.readContract({
                address: addre,
                abi: ILilaPool.abi,
                functionName: "totalFixedDeposits",
                args: [],
            });
            const varLimit = await publicClient.readContract({
                address: addre,
                abi: ILilaPool.abi,
                functionName: "variableLimit",
                args: [],
            });
            const varDepo = await publicClient.readContract({
                address: addre,
                abi: ILilaPool.abi,
                functionName: "totalVariableDeposits",
                args: [],
            });
            const payouts = await publicClient.readContract({
                address: addre,
                abi: ILilaPool.abi,
                functionName: "payoutCount",
                args: [],
            });
            const duration = await publicClient.readContract({
                address: addre,
                abi: ILilaPool.abi,
                functionName: "timeLength",
                args: [],
            });
            const fixedLimitForm = ethers.formatEther(fixedLimit);
            const fixedDepoForm = ethers.formatEther(fixedDepo);
            const varLimitForm = ethers.formatEther(varLimit);
            const varDepoForm = ethers.formatEther(varDepo);
            const time = Number(BigInt("31536000")/duration); // 105120
            const APY = Number(1+varLimitForm/fixedLimitForm); // 1.5
            const value = ((APY ** time) - 1)*100;

            return [addre, value.toFixed(2)+"%", fixedDepoForm, fixedLimitForm, varDepoForm, varLimitForm, Number(payouts), (Number(duration)/60/60/24), "15"]
        }

        return null;
    };
    const getAddressBalance = async () => {
        if (publicClient) {
            let walletAddress = address;
            const BALANCE = await publicClient.readContract({
                address: "0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357",
                abi: IERC20.abi,
                functionName: "balanceOf",
                args: [walletAddress],
            });
            return ethers.formatEther(BALANCE);
        }
    
        return ethers.formatEther(0);
      };
    const updateTVL = async () => {
        const aToken = await publicClient.readContract({
            address: addresj.proxy,
            abi: IProxy.abi,
            functionName: "aToken",
            args: [],
            });
            // console.log("Atoken "+aToken);
        const aTokenBal = await publicClient.readContract({
            address: aToken,
            abi: IERC20.abi,
            functionName: "balanceOf",
            args: [addresj.proxy],
            });
        
        function formatMoney(number) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2
            }).format(number);
        }

        setTVL(formatMoney(Number(ethers.formatEther(aTokenBal))));
    }
    const getListOfPools = async () => {
    const poolsCount = await publicClient.readContract({
        address: addrprov,
        abi: ILilaPoolAddressProvider.abi,
        functionName: "openPoolsLength",
        args: [],
        });

        // console.log(poolsCount);
        let final_pools = [];
    for(let i = 0; i < poolsCount; i++){
        const ithpools = await publicClient.readContract({
            address: addrprov,
            abi: ILilaPoolAddressProvider.abi,
            functionName: "openPools",
            args: [i],
            });
        
        // console.log(ithpools);
        const pool = await getPoolInfo(ithpools);
        final_pools.push(pool)
        updateTVL();
    }
    setPools(final_pools);
    localStorage.setItem('pools', JSON.stringify(final_pools));
    };

      useEffect(() => {
        getListOfPools();
        
        const interval = setInterval(getListOfPools, 100000);
        
        return () => clearInterval(interval);
      }, []);

      const clo = () => {
        setSuccessDepo(false);
        getListOfPools();
      }
  return (
    <div>
      <div className="container mx-auto w-11/12 md:w-[85%] 3xl:w-[70%]">
        <Navbar homepage={false}/>
        {/* <a href="https://sepoliafaucet.com/" target="_blank">Sepolia ETH Faucet</a>
        <br />
        <a href="https://staging.aave.com/faucet/" target="_blank">Token Faucets</a> */}
        <div className="flex items-center justify-between">
            <h1 className="text-3xl lg:text-4xl 2xl:text-5xl mt-4">
                Single Asset Protocols
            </h1>
            <h1 className="text-3xl lg:text-4xl 2xl:text-5xl mt-4 pr-10">
                {tvl} TVL
            </h1>
        </div>
        {/* Cards */}
        <div className="mt-12 mb-[8vh] lg:mb-[16vh] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 2xl:gap-19.2">
            {pools && pools.length > 0 ? (
                pools.map((pool, index) => <Card homepage={false} 
                key={index} pool={pool} 
                getAddressBalance={getAddressBalance} 
                setSuccessAmount={setSuccessAmount}
                setSuccessDepo={setSuccessDepo}/>))
             : (
                <div className="text-center text-2xl font-bold">
                    No Pools available
                </div>
            )}
        </div>
        {successDepo === true ? (
            <>
              <BlackOverlay clo={clo} />
              <DepositSuccessPopup clo={clo} amount={successAmount}/>
            </>
          ) : null}
      </div>
    </div>
  );
};

export default Market;
