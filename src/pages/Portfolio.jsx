import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { useAccount, usePublicClient} from "wagmi";
import addresses from "../addresses/address.json";
import ILilaPosition from "../abi/ILilaPosition.json";
import ILilaOracle from "../abi/ILilaOracle.json";
import ILilaPoolsProvider from "../abi/ILilaPoolsProvider.json";
import IProxy from "../abi/IProxy.json";
import { ethers } from "ethers";
import assets from "../localdata/assets.json";
import mapping from "../localdata/mapping.json";
import BigNumber from "bignumber.js";
import {useContractWrite, useContractEvent} from "wagmi";

const Portfolio = () => {
  const [network, setNetwork] = useState("None");
  const [positions, setPositions] = useState([]);

  const { address: userAddress } = useAccount();
  const publicClient = usePublicClient();
  useEffect(() => {
    if(network != "None" && network != undefined && userAddress != undefined){
        // const getPositions = async () => {
        //     let positionPools = [];
        //     const positionIDs = await publicClient.readContract({
        //         address: addresses.lila_position,
        //         abi: ILilaPosition.abi,
        //         functionName: "getUserNFTs",
        //         args: [userAddress],
        //     });
        //     for(let i = 0; i < positionIDs.length; i++){
        //         const positionPool = await publicClient.readContract({
        //             address: addresses.lila_position,
        //             abi: ILilaPosition.abi,
        //             functionName: "getPool",
        //             args: [positionIDs[i]],
        //         });
                
        //         const strategyName = await publicClient.readContract({
        //             address: positionPool.strategy,
        //             abi: IProxy.abi,
        //             functionName: "protocol",
        //             args: [],
        //         });
        //         //1.0161241322712127e+48
                
        //         positionPools.push([positionPool, strategyName]);
        //     }
        //     setPositions(positionPools);
        // }
        const getPositions = async () => {
            const positionIDs = await publicClient.readContract({
              address: addresses.lila_position,
              abi: ILilaPosition.abi,
              functionName: "getUserNFTs",
              args: [userAddress],
            });
          
            // Parallel requests for each positionID
            const requests = positionIDs.map(async (positionID) => {
              try {
                const positionPool = await publicClient.readContract({
                  address: addresses.lila_position,
                  abi: ILilaPosition.abi,
                  functionName: "getPool",
                  args: [positionID],
                });
                
                const strategyName = await publicClient.readContract({
                  address: positionPool.strategy,
                  abi: IProxy.abi,
                  functionName: "protocol",
                  args: [],
                });

                const assetcopy = positionPool.asset.toString().toUpperCase();
                const assetUint160 = new BigNumber(assetcopy);
                const day = new BigNumber(new BigNumber(positionPool.rate_time).div(86400).toFixed(0, 1));
                const two = new BigNumber(2);
                const freq = new BigNumber(positionPool.init_payouts); //Should normally be 1m 3 6 12 18...
                //is 3600 for testing
                const key = assetUint160.plus(day.times(two.exponentiatedBy(160))).plus(freq.times(two.exponentiatedBy(224)));
                const keyString = "0x"+key.toString(16);
                const ChainAPY = await publicClient.readContract({
                    address: addresses.apy_provider,
                    abi: ILilaOracle.abi,
                    functionName: "getNumerator",
                    args: [keyString],
                  });


                
                return [positionPool, strategyName, Number(ChainAPY), positionID];
              } catch (error) {
                console.error(`Error fetching data for positionID ${positionID}:`, error);
                return []; // Return an empty array or some default value in case of an error
              }
            });
          
            // Wait for all requests to complete
            const positionPools = await Promise.all(requests);
          
            setPositions(positionPools);
          };
          
        getPositions();

        

    }
  }, [network]);

  const dataTableHeading = ["Asset", "Protocol", "Next Yield", "Amount", "APY", "Principal", "Maturity"];
  const to3NumbersAndChar = (value) => {
    const num = parseFloat(value);
    // Define thresholds for K, M, B, etc.
    const thresholds = [
        { limit: 1_000_000_000, suffix: 'B' },
        { limit: 1_000_000, suffix: 'M' },
        { limit: 1_000, suffix: 'K' }
    ];
    // Check against each threshold
    for (const { limit, suffix } of thresholds) {
        if (num >= limit) {
            // Format the number with 3 significant figures and add the suffix
            return `${(num / limit).toFixed(2)}${suffix}`;
        }
    }
    // If number is less than 1000, format it with 3 significant figures without suffix
    return num.toFixed(2);
}

  const [balances, setBalances] = useState([0, 0, 0]);
  const [withdrawArgs, setWithdrawArgs] = useState([]);

  useEffect(() => {
    if(network != "None" && network != undefined && userAddress != undefined){
        const balancescopy = [0, 0, 0, 0];
        let current = [];
        for(let i = 0; i < positions.length; i++){
            const [{ asset, rate_time, strategy, duration_between_payments, init_payouts, deposit_amount, payouts_payed_out }, strageyname, Trueapy, positionID] = positions[i];
            console.log(positions[i])
            if(Number(payouts_payed_out) == Number(init_payouts)){
                continue;
            }
            const token = assets[asset];
            const decimal = token == "DAI" ? 18 : 6;                
            const principal = Number(ethers.formatUnits(deposit_amount, decimal));
            const apy = Trueapy == 0 ? mapping[network.toLowerCase()]["Aave"][token]["1m"]["rate"] : Trueapy/100;
            let paymentspassed = Math.floor((Math.floor(Date.now() / 1000) - (Number(rate_time))) / Number(duration_between_payments))
            let payoutamount = apy/100 * principal / init_payouts;
            let dueBalance = 0;
            if(paymentspassed >= Number(init_payouts)){
                dueBalance += principal;
                paymentspassed = Number(init_payouts);
            }
            dueBalance += paymentspassed*payoutamount

            dueBalance -= payouts_payed_out*payoutamount;
            console.log(positions[i])
            if(token == 'DAI'){
                balancescopy[0] += dueBalance
            }else if(token == 'USDC'){
                balancescopy[1] += dueBalance
            }
            if(dueBalance > 0){
                current.push(positionID);
            }

        }
        console.log(balancescopy[0])
        setBalances(balancescopy)
        setWithdrawArgs([current, current.length])
    }
  }, [positions]);
  useContractEvent({
    address: addresses.pools_provider,
    abi: ILilaPoolsProvider.abi,
    eventName: 'Withdrawal',
    listener(log) {
        console.log(log);
    },
    });

  const {
    data,
    write: batchedWidthdraw,
    isSuccess: isSuccessDeposit,
    } = useContractWrite({
        address: addresses.pools_provider,
        abi: ILilaPoolsProvider.abi,
        functionName: "batchedWithdraw",
        args: withdrawArgs,
    });

  const withdrawAll = () => {
    console.log("Withdrawing All");
    console.log(withdrawArgs);
    batchedWidthdraw();
  }
  return (
    <div className="min-h-screen bg-primaryBg relative">
      <Navbar setNetwork={setNetwork} />
      <div className="container mx-auto w-11/12" style={{ minHeight: `calc(100vh - 250px)` }}>

        {
            balances.every(balance => balance == "0.00") ? 
            
            <div className="mt-12">
                <p className="text-center text-xl md:text-3xl text-white">
                    Positions
                </p>
            </div>: 
            <div className="mt-12">
                <p className="text-center text-xl md:text-3xl text-white">
                Unclaimed Balance
                </p>
    
                <div className="flex items-center justify-center gap-10 md:gap-[70px] mt-8">
                
                {
                balances[0] != "0.00" && 
                    <p className="text-center text-lg md:text-xl lg:text-2xl text-white">
                    {to3NumbersAndChar(balances[0])} DAI
                    </p>
                }
                {
                balances[1] != "0.00" && 
                    <p className="text-center text-lg md:text-xl lg:text-2xl text-white">
                    {to3NumbersAndChar(balances[1])} USDC
                    </p>
                }
                {
                balances[2] != "0.00" && 
                    <p className="text-center text-lg md:text-xl lg:text-2xl text-white">
                    {to3NumbersAndChar(balances[2])} USDT
                    </p>
                }
                
                {/* <p className="text-center text-lg md:text-xl lg:text-2xl text-white">
                    {to3NumbersAndChar(balances[3])} ETH
                </p> */}
                </div>
    
                <div className="text-center mt-7">
                <button onClick={withdrawAll}
                className="bg-primaryColor text-lg font-medium px-12 py-2 rounded-[30px] border-2 border-primaryColor hover:bg-primaryBg hover:border-2 hover:border-primaryColor hover:text-white">
                    Claim
                </button>
                </div>
                <div className="mt-32">
                    <p className="text-center text-xl md:text-3xl text-white">
                        Positions
                    </p>
                </div>
            </div>
            
        }
        {/* heading */}
        
        
        

        {/* data table */}
        <div className="w-[95%] max-w-[900px] mx-auto mt-20 lg:mt-12 pb-36">
          {/* heading */}
          <div className="w-full flex items-center justify-between pb-4 
                        border-b-[4px] border-b-primaryColor overflow-x-auto">
          {/* <div className="sticky top-0 z-10 w-full flex items-center justify-between 
                pb-4 border-b-[4px] border-b-primaryColor bg-primaryBg"> */}

            {dataTableHeading?.map((item, idx) => (
              <div
                key={idx}
                className={`min-w-[100px] lg:w-[20%] flex items-center gap-2 px-5 ${
                  idx === 0
                    ? "justify-start"
                    : idx === dataTableHeading.length - 1
                    ? "justify-end"
                    : "justify-center"
                }`}
              >
                <p className="text-lg text-white font-bold">{item}</p>
              </div>
            ))}
          </div>

          {/* data row */}
          <div className="w-full">
            {positions?.map((item, idx) => {
              const [{ asset, rate_time, strategy, duration_between_payments, init_payouts, deposit_amount, payouts_payed_out }, strageyname, Trueapy] = item;
              
              const token = assets[asset];
                const decimal = token == "DAI" ? 18 : 6;                
                const principal = to3NumbersAndChar(ethers.formatUnits(deposit_amount, decimal));
                
                const date = new Date((Number(rate_time)+Number(duration_between_payments)*init_payouts)*1000)
                // console.log(new Date(Number(rate_time)*1000))
                // console.log(Number(duration_between_payments)*init_payouts)
                // console.log(date)
                const maturity = (date.getUTCMonth() + 1) + '/' + date.getUTCDate() + '/' + date.getFullYear();
                // console.log(init_payouts)
                const apy = Trueapy == 0 ? network.toLowerCase() == "sepolia" ? mapping[network.toLowerCase()]["Aave"][token][init_payouts.toString()+"0m"] != undefined ? mapping[network.toLowerCase()]["Aave"][token][init_payouts.toString()+"0m"]["rate"] : Trueapy/100 : 0 : 0;
                const paymentspassed = Math.floor((Math.floor(Date.now() / 1000) - (Number(rate_time))) / Number(duration_between_payments))
                let nextyeilddate = maturity;
                let nextyeildamount = 0;
                if(Number(payouts_payed_out) != Number(init_payouts)){
                    
                if(paymentspassed >= Number(init_payouts) - 1){
                    nextyeilddate = maturity;
                }else{
                    const yeilddate = new Date((Math.floor(Date.now() / 1000) + (paymentspassed+1)*Number(duration_between_payments))*1000);
                    nextyeilddate = (yeilddate.getUTCMonth() + 1) + '/' + yeilddate.getUTCDate() + '/' + yeilddate.getFullYear();
                }
                nextyeildamount += apy/100 * Number(ethers.formatUnits(deposit_amount, decimal))/init_payouts;
                if(paymentspassed == Number(init_payouts) - 1) nextyeildamount+=Number(ethers.formatUnits(deposit_amount, decimal))
                }
                nextyeildamount = to3NumbersAndChar(nextyeildamount)

              
                return (
                <div
                  key={idx}
                  className={`w-full flex items-center justify-between py-5 mb-1 ${

                      "border-t-2 border-primaryBg border-b-2 border-b-primaryColor"
                  }  cursor-pointer hover:border-2 hover:border-primaryColor duration-200`}
                >
                  <div className="min-w-[100px] lg:w-[20%] flex items-center justify-start gap-2 px-5">
                    <p className="text-lg text-white font-medium">{token}</p>
                  </div>

                  <div className="min-w-[100px] lg:w-[20%] flex items-center justify-center gap-2">
                    <p className="text-lg text-white font-medium">{strageyname}</p>
                  </div>

                  <div className="min-w-[100px] lg:w-[20%] flex items-center justify-center gap-2 px-5">
                    <p className="text-lg text-white font-medium">{nextyeilddate}</p>
                  </div>

                  <div className="min-w-[100px] lg:w-[20%] flex items-center justify-center gap-2 px-5">
                    <p className="text-lg text-white font-medium">{nextyeildamount}</p>
                  </div>

                  <div className="min-w-[100px] lg:w-[20%] flex items-center justify-center gap-2 px-5">
                    <p className="text-lg text-white font-medium">{apy}%</p>
                  </div>

                  <div className="min-w-[100px] lg:w-[20%] flex items-center justify-end gap-2 px-5">
                    <p className="text-lg text-white font-medium">
                      {principal}
                    </p>
                  </div>

                  <div className="min-w-[100px] lg:w-[20%] flex items-center justify-center gap-2 px-5">
                    <p className="text-lg text-white font-medium">{maturity}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* <div className="bottom-0 mb-[0px] w-full h-[110px] bg-primaryBg mt-10"></div> */}
      </div>
      
      {/* <div className="w-full h-[55px] bg-primaryColor mt-10"></div> */}
      <div className="bottom-0 mb-[50px] w-full h-[55px] bg-primaryColor"></div>
      <div className="bottom-0 mb-[0px] w-full h-[55px] bg-primaryBg mt-10"></div>
    </div>
  );
};

export default Portfolio;
