import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import assets from "../localdata/assets.json"
import { useAccount, usePublicClient} from "wagmi";
import { ethers } from "ethers";
import IERC20 from "../abi/IERC20.json";
import BigNumber from "bignumber.js";
import {useContractWrite, useContractEvent} from "wagmi";
import IFaucet from "../abi/IFaucet.json";

const Faucet = () => {
    const Faucet_address = "0xC959483DBa39aa9E78757139af0e9a2EDEb3f42D";
    const [network, setNetwork] = useState("None");
    const dataTableHeading = ["Asset", "Balance", "Supply"];
    
    const tokens = [
        {"name":"DAI", "index": 0},
        {"name":"USDC", "index": 1},
        {"name":"USDT", "index": 2},
    ]
    const [balances, setBalances] = useState(["0", "0", "0"]);
    const { address: userAddress } = useAccount();
    const publicClient = usePublicClient();

    const [FaucetArgs, setFaucetArgs] = useState([]);
    const {
        data,
        write: FaucetCall,
        isSuccess: isSuccessDeposit,
    } = useContractWrite({
        address: Faucet_address,
        abi: IFaucet.abi,
        functionName: "mint",
        args: FaucetArgs,
    });
    
    

    const getUserBalance = async (tokenAddress) => {
        if (publicClient) {
            const BALANCE = await publicClient.readContract({
                address: tokenAddress,
                abi: IERC20.abi,
                functionName: "balanceOf",
                args: [userAddress],
            });
            return ethers.formatEther(BALANCE);
        }

        return ethers.formatEther(0);
    };

    const formatBalance = (balanceStr, token) => {

    let balance = new BigNumber(balanceStr);
    if(token == "DAI"){
        balance = balance.decimalPlaces(2);
    }else{
        balance = balance.multipliedBy(new BigNumber('1000000000000')).decimalPlaces(2);
    }
    
    let balanceStrRounded = balance.toString();

    // Determine the length to decide the suffix (K, M, B, etc.)
    let len = balanceStrRounded.split('.')[0].length; // Length before decimal
    if (len > 9) { // Billion or more
        balance = balance.dividedBy(new BigNumber('1000000000')).decimalPlaces(2);
        return `${balance.toString()}B`;
    } else if (len > 6) { // Million or more
        balance = balance.dividedBy(new BigNumber('1000000')).decimalPlaces(2);
        return `${balance.toString()}M`;
    } else if (len > 3) { // Thousand or more
        balance = balance.dividedBy(new BigNumber('1000')).decimalPlaces(2);
        return `${balance.toString()}K`;
    }
    return balance.toString();
    };

    useEffect(() => {
        // console.log(selectedPool)
        const fetchBalances = async () => {

          try {
            let balances = [];
            for(let i = 0; i < tokens.length; i++){

                const balance = await getUserBalance(assets["sepolia"][tokens[i]["name"]]);

                const formattedBalance = formatBalance(balance, tokens[i]["name"]);
                // console.log(formattedBalance)
                balances.push(formattedBalance);
            }

            setBalances(balances);
          } catch (error) {
            console.error('Error fetching balance:', error);
          }
        };
    
        fetchBalances();
    }, []);

    const Faucet = async (name) => {
        let amount = "1000000000"
        if(name == "DAI"){
            amount = "1000000000000000000000";
        }
        setFaucetArgs([assets["sepolia"][name], userAddress, amount]);
    }

    // const getUserBalance = async (name) => {
    //     const bal = async () => {
    //         const tokenAddress = assets["sepolia"][name];
    //         if (publicClient) {
    //             const BALANCE = await publicClient.readContract({
    //                 address: tokenAddress,
    //                 abi: IERC20.abi,
    //                 functionName: "balanceOf",
    //                 args: [userAddress],
    //             });
    //             return ethers.formatEther(BALANCE);
    //         }
        
    //         return ethers.formatEther(0);
    //     }
    //     return await bal();
    //   };

    //   const getUserBalance = async (tokenAddress) => {
    //     if (publicClient) {
    //         const BALANCE = await publicClient.readContract({
    //             address: tokenAddress,
    //             abi: IERC20.abi,
    //             functionName: "balanceOf",
    //             args: [userAddress],
    //         });
    //         return ethers.formatEther(BALANCE);
    //     }
    
    //     return ethers.formatEther(0);
    //   };
  return (
    <div
    className="relative bg-primaryBg min-h-screen lg:pb-0 pb-20"
  >
      <Navbar setNetwork={setNetwork} />
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
                    ? "justify-center"
                    : "justify-center"
                }`}
              >
                <p className="text-lg text-white font-bold">{item}</p>
              </div>
            ))}
          </div>

          {/* data row */}
          <div className="w-full">
            {tokens?.map((item, idx) => {
              
                return (
                <div
                  key={idx}
                  className={`w-full flex items-center justify-between py-5 mb-1 ${

                      "border-t-2 border-primaryBg border-b-2 border-b-primaryColor"
                  }   `}
                >
                  <div className="min-w-[100px] lg:w-[20%] flex items-center justify-start gap-2 px-5">
                    <p className="text-lg text-white font-medium">{item["name"]}</p>
                  </div>

                  <div className="min-w-[100px] lg:w-[20%] flex items-center justify-center gap-2">
                    <p className="text-lg text-white font-medium">{balances[item["index"]]}</p>
                  </div>

                  <div className="min-w-[100px] lg:w-[20%] flex items-center justify-center gap-2 pl-5 pr-3">
                  <div className="text-center">
                    <button 
                    onClick={FaucetCall}
                    onMouseEnter={() => Faucet(item["name"])} 
                    className="bg-primaryColor text-m font-medium px-6 py-1 rounded-[30px] border-2 border-primaryColor hover:bg-primaryBg hover:border-2 hover:border-primaryColor hover:text-white">
                        Faucet
                    </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

    </div>
  );
};

export default Faucet;
