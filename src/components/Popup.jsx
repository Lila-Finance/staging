import { useEffect, useState } from "react";
import { ethers } from 'ethers';
import BigNumber from "bignumber.js";
import assets from "../localdata/assets.json";
// import { signTransaction } from "viem/_types/accounts/utils/signTransaction";
import { signTypedData } from '@wagmi/core'
import address from "../addresses/address.json";
import IERC20Permit from "../abi/IERC20Permit.json";
import ILilaPoolsProvider from "../abi/ILilaPoolsProvider.json";
import ILilaPosition from "../abi/ILilaPosition.json";

import {useContractWrite, useContractEvent} from "wagmi";

const Popup = ({ showPopup, getBalance, selectedPool, userAddress, publicClient, setShowConfirmPopup, network }) => {
  
  const [betterState, setBetterState] = useState("");
  const [userBalance, setUserBalance] = useState("0");
  const [formattedBalance, setFormattedBalance] = useState("0");
  useEffect(() => {
    if(network()){
        setBetterState(network().toLowerCase());
    }
  }, [network()])
//   console.log(selectedPool);

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

  const [depositArgs, setDepositArgs] = useState([]);
  const {
    data,
    write: deposit,
    isSuccess: isSuccessDeposit,
    } = useContractWrite({
        address: address.pools_provider,
        abi: ILilaPoolsProvider.abi,
        functionName: "deposit",
        args: depositArgs,
    });

  const [depositString, setDepositString] = useState("");

  const signTransaction = async () => {
    if(!selectedPool){
        return;
    }
    
    setSignBool(false);
    setSigningBool(true);
    
    const pools = await publicClient.readContract({
        address: address.pools_provider,
        abi: ILilaPoolsProvider.abi,
        functionName: "getOpenPools",
        args: [],
      });
    if(!pools) return;
    if(!pools[selectedPool[3]]) return;
    if(depositString == "") return;
    const decimals = selectedPool[1] == "DAI" ? 18 : 6;
    const amount = ethers.parseUnits(depositString, decimals);
    // depositString

    const tokenAddress = pools[selectedPool[3]]['asset'];

    const expiry = Math.trunc((Date.now() + 300 * 1000) / 1000)
    const nonce = (await publicClient.readContract({
        address: tokenAddress,
        abi: IERC20Permit.abi,
        functionName: "nonces",
        args: [userAddress],
      })).toString();
    

    const message = {
        owner: userAddress,
        spender: address.pools_provider,
        value: amount,
        nonce: nonce,
        deadline: expiry
    };
    const types = {
        EIP712Domain: [
        {
            name: "name",
            type: "string",
        },
        {
            name: "version",
            type: "string",
        },
        {
            name: "chainId",
            type: "uint256",
        },
        {
            name: "verifyingContract",
            type: "address",
        },
        ],
        Permit: [
        { //Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline
            name: "owner",
            type: "address",
        },
        {
            name: "spender",
            type: "address",
        },
        {
            name: "value",
            type: "uint256",
        },
        {
            name: "nonce",
            type: "uint256",
        },
        {
            name: "deadline",
            type: "uint256",
        }
        ],
    };
    const domain = {
        name: selectedPool[1],
        version: "1",
        chainId: 11155111,
        verifyingContract: tokenAddress,
    };
    const signature = await signTypedData({
        domain,
        message,
        primaryType: 'Permit',
        types,
      });
    setSigningBool(false);
    setDepositBool(true);

    const r = signature.substring(0, 66);
    const s = "0x" + signature.substring(66, 130);
    const v = Number("0x" + signature.substring(130, 132));
    
    const value = [amount, selectedPool[3], expiry, v, r, s];
    
    setDepositArgs(value);
  }

  const depositTransaction = async () => {
    if(depositArgs != []){
        setDepositBool(false);
        setDepositingBool(true);
        deposit();
        
    }
  }

  useEffect(() => {
    // console.log(selectedPool)
    const fetchBalance = async () => {
      try {
        // Replace this with your actual function to get the balance
        // console.log(erc20address['sepolia'][safeString(1).toString()]);
        const balance = await getBalance(assets[network().toLowerCase()][safeString(1).toString()]);
        const formattedBalance = formatBalance(balance, safeString(1).toString());
        setFormattedBalance(formattedBalance);
        setUserBalance(balance);
      } catch (error) {
        // console.error('Error fetching balance:', error);
      }
    };

    fetchBalance();
  }, [selectedPool]);

  const safeString = (first, second) =>{
    let l = selectedPool ? (selectedPool[first])  : " "; 
    let result = l.length >= 3 ? l.substring(0, 2) : (l.length === 2 ? l.substring(0, 1) : "");
    return second ? result : l;
  }

  const [signBool, setSignBool] = useState(true);
  const [depositBool, setDepositBool] = useState(false);
  const [signingBool, setSigningBool] = useState(false);
  const [depositingBool, setDepositingBool] = useState(false);

  useContractEvent({
    address: address.pools_provider,
    abi: ILilaPoolsProvider.abi,
    eventName: 'Deposit',
    listener(log) {
        console.log(log);
        const run = async () => {
            if(!!log && !!log[0] && !!log[0].args && log[0].args["who"] == userAddress){
                const posiitonID = log[0].args["tokenID"];
                console.log(posiitonID)
                const positionPool = await publicClient.readContract({
                    address: address.lila_position,
                    abi: ILilaPosition.abi,
                    functionName: "getPool",
                    args: [posiitonID],
                });
                const assert = positionPool["asset"];
                const token = assets[assert.toString()];
                
                const decimals = token == "DAI" ? 18 : 6;
                const amount = ethers.formatUnits(log[0].args["amount"].toString(), decimals);
                
                setShowConfirmPopup(amount, token);
                setSignBool(true);
                setDepositingBool(false);
            }
        }
        run();
    },
    });
  return (
    <div
      className={`w-[95%] max-w-[35vw] bg-primaryBg px-12 py-10 rounded-[20px] fixed top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2 duration-300 ${
        showPopup === true
          ? "opacity-100 scale-100 visible"
          : "invisible opacity-0 scale-75"
      }`}
    >
      {/* heading */}
      <div className="flex items-center justify-between pb-5 border-b border-b-primaryColor">
        <p className="text-lg text-white font-medium">{safeString(1)}</p>
        <p className="text-lg text-white font-medium">{safeString(0)}</p>
        <p className="text-lg text-white font-medium">{safeString(4)}%</p>
        <p className="text-lg text-white font-medium"> {safeString(2,true)} {network().toLowerCase() == "sepolia" ? "Minutes": "Months"}</p>
      </div>

      <div className="items-center justify-between py-5 border-b border-b-primaryColor">
        <p className="text-lg text-white font-medium pb-2"> 
        Payouts Every:  
        {network().toLowerCase() == "sepolia" ? " 10 Minutes": " 1 Month"}</p>
        <p className="text-lg text-white font-medium"> 
        Payout Rate:  {Number(safeString(4))/Number(safeString(2,true)[0])}%
        </p>
      </div>

      <div className="flex items-center justify-between gap-7 pt-5 pb-6 border-b border-b-primaryColor">
        {/* left side */}
        <div className="w-full">
          <p className="text-base md:text-xl text-white font-semibold">
            Balance: {formattedBalance}
          </p>
        </div>

        {/* right side */}
        <div className="w-full">
            <input
                type="number"
                className="bg-transparent outline-none w-full p-2 text-end border-2 border-primaryColor rounded-[15px] text-white font-medium"
                onChange={(e) => setDepositString(e.target.value)}
            />
        </div>
      </div>
      {/* button */}
      <div className="pt-5 text-center">
        {signBool === true ? (
            <button onClick={signTransaction} 
            className="bg-primaryColor text-lg font-medium px-16 py-1 rounded-[30px] border-2 border-primaryColor
            hover:bg-primaryBg hover:border-2 hover:border-primaryColor hover:text-white">
                <div className="flex items-center justify-center gap-2">
                <p>Sign</p>
                </div>
            </button>
        ) : null}
        {signingBool === true ? (
            <button
            className="text-lg font-medium px-16 py-1 rounded-[30px] bg-primaryBg border-2 border-primaryColor text-white">
              <div className="flex items-center justify-center gap-2">
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  <p>Signing</p>
                </div>
            </button>
        ) : null}
        
        {depositBool === true ? (
            <button onClick={depositTransaction} 
            className="bg-primaryColor text-lg font-medium px-16 py-1 rounded-[30px] border-2 border-primaryColor
            hover:bg-primaryBg hover:border-2 hover:border-primaryColor hover:text-white">
                <div className="flex items-center justify-center gap-2">
                <p>Deposit</p>
                </div>
            </button>
        ) : null}

        {depositingBool === true ? (
            <button
            className="text-lg font-medium px-16 py-1 rounded-[30px] bg-primaryBg border-2 border-primaryColor text-white">
              <div className="flex items-center justify-center gap-2">
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  <p>Depositing</p>
                </div>
            </button>
        ) : null}

      </div>

      <div className="absolute bottom-5 right-5">
        <a href="https://lila-finance.gitbook.io/lila-documentation/how-to-use-lila-finance/the-market">
            <img src="./images/tooltip.svg" alt="Tooltip" />
        </a>
      </div>
    </div>
  );
};

export default Popup;
