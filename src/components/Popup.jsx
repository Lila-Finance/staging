import { useEffect, useState } from "react";
import { ethers } from 'ethers';
import BigNumber from "bignumber.js";
import erc20address from "../localdata/erc20address.json";
// import { signTransaction } from "viem/_types/accounts/utils/signTransaction";
import { signTypedData } from '@wagmi/core'
import address from "../addresses/address.json";
import IERC20Permit from "../abi/IERC20Permit.json";
import ILilaPoolsProvider from "../abi/ILilaPoolsProvider.json";

import {useContractWrite, useContractEvent} from "wagmi";

const Popup = ({ showPopup, getBalance, selectedPool, userAddress, publicClient }) => {
  
  const [userBalance, setUserBalance] = useState("0");
  const [formattedBalance, setFormattedBalance] = useState("0");
  
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
  const awaitsetDepositArgs = async (value) => {
    setDepositArgs(value);
  }
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

  const signTransaction = async () => {
    console.log("Signing Transaction!");
    setSignBool(false);
    setSigningBool(true);
    let allowance = 1;
    console.log("Allowance: " + allowance);
    if(allowance < 2){
        console.log("Requesting allowance: " + 2);
        const tokenAddress = "0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357";
        
        const domain = {
            name: "Dai Stablecoin",
            version: "2",
            chainId: 11155111,
            verifyingContract: tokenAddress,
          }
        
        const types = {
            Permit: [
                {
                  "name": "owner",
                  "type": "address"
                },
                {
                  "name": "spender",
                  "type": "address"
                },
                {
                  "name": "value",
                  "type": "uint256"
                },
                {
                  "name": "nonce",
                  "type": "uint256"
                },
                {
                  "name": "deadline",
                  "type": "uint256"
                }
              ]
        }
        const time = new BigNumber(((await publicClient.getBlock("latest")).timestamp));
        const expiry = BigNumber.sum(time, new BigNumber(1000));
        
        const nonce = (await publicClient.readContract({
                        address: tokenAddress,
                        abi: IERC20Permit.abi,
                        functionName: "nonces",
                        args: [userAddress],
                      })).toString();

        const message = {
            owner: userAddress,
            spender: address.pools_provider,
            value: 10,
            nonce: Number(nonce),
            deadline: expiry.toString()
          }
        
        const signature = await signTypedData({
        domain,
        message,
        primaryType: 'Permit',
        types,
        })

        console.log(signature);
        const pureSig = signature.replace("0x", "")

        const r = "0x"+pureSig.substring(0, 64);
        const s = "0x"+pureSig.substring(64, 128);
        const v = "0x"+pureSig.substring(128, 130);
        
        console.log(`r: 0x${r.toString('hex')},\ns: 0x${s.toString('hex')},\nv: ${v}`) 
        
        const amount = 10;
        let args = [amount, 0, expiry.toString(), v, r, s];
        console.log(args);
        setDepositArgs(args);
        setSigningBool(false);
        setDepositBool(true);
    }
  }

  const depositTransaction = async () => {
    if(depositArgs != []){
        deposit();
    }
  }

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        // Replace this with your actual function to get the balance
        console.log(erc20address['sepolia'][safeString(1).toString()]);
        const balance = await getBalance(erc20address['sepolia'][safeString(1).toString()]);
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
    return second ? l[0] : l;
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
        <p className="text-lg text-white font-medium">{safeString(2,true)} Month</p>
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

      </div>

      <div className="absolute bottom-5 right-5">
        <img src="./images/tooltip.svg" alt="" />
      </div>
    </div>
  );
};

export default Popup;
