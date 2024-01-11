import { useEffect, useContext, useState } from "react";
import { ExchangeRateContext } from '../../helpers/Converter';

import address from "../../data/address.json";
import LilaPoolsProvider from "../../abi/LilaPoolsProvider.json";
import {useContractWrite, useContractEvent} from "wagmi";

const PortfolioBanner = ({ activePositions, expiredPositions, connected }) => {

  const { to10DecUSD } = useContext(ExchangeRateContext);

  const [withdrawArgs, setWithdrawArgs] = useState([]);
  const [smallestPos, setSmallestPos] = useState(undefined);
  const { write: batchedWithdrawContract } = useContractWrite({
    address: address.core.poolprovider_address,
    abi: LilaPoolsProvider.abi,
    functionName: "batchWithdraw",
    args: withdrawArgs,
  });

  const toBigIntString = (value, dec) => {
    let strValue = value.toString();
    strValue = dec == 3 ? strValue.padStart(11, '0') : strValue.padStart(11, '0');
    strValue = strValue.slice(0, -10) + '.' + strValue.slice(-10);
    strValue = dec == 3 ? strValue.slice(0, 8) : strValue;
    return strValue;

  }

  const toDateString = (value) => {
    // Check if the date is Date(0) or in the past
    const now = new Date();
    if (value.getTime() === 0 || value < now) {
      return "00M 00D 00H 00S";
    }
  
    // Calculate the difference in milliseconds
    const diff = value - now;
  
    // Convert milliseconds to minutes, days, hours, and seconds
    const minutesInMs = 1000 * 60;
    const hoursInMs = minutesInMs * 60;
    const daysInMs = hoursInMs * 24;
  
    const days = Math.floor(diff / daysInMs);
    const hours = Math.floor((diff % daysInMs) / hoursInMs);
    const minutes = Math.floor((diff % hoursInMs) / minutesInMs);
    const seconds = Math.floor((diff % minutesInMs) / 1000);
  
    let timeString = '';

    if (days > 0) {
        timeString += `${String(days).padStart(2, '0')}D `;
    }
    if (days > 0 || hours > 0) {
        timeString += `${String(hours).padStart(2, '0')}H `;
    }
    timeString += `${String(minutes).padStart(2, '0')}M ${String(seconds).padStart(2, '0')}S`;
    
    return timeString;
  };

  const [netWorth, setNetWorth] = useState(BigInt(0));
  const [totalEarnings, setTotalEarnings] = useState(BigInt(0));
  const [monthlyYeild, setMonthlyYeild] = useState(BigInt(0));
  const [nextPay, setNextPay] = useState(new Date(0));
  const [unclaimedInterest, setUnclaimedInterest] = useState(BigInt(0));
  const [unclaimedTokenIDs, setUnclaimedTokenIDs] = useState([]);
  const [confirmWithdraw, setConfirmWithdraw] = useState(true);
  const [claimAmount, setClaimAmount] = useState(BigInt(0));
  const [claimable, setClaimable] = useState(false);
  
  const calculateNetWorth = async (positions) => {
    
    let sumNetWorth = BigInt(0);
    for(let position in positions){
      const pos = positions[position];
      let time_since_start = (Number(Date.now()/1000)-Number(pos.position.startTime));
      const end_time = Number(pos.pool.payoutFrequency*BigInt(pos.pool.totalPayments));
      time_since_start = Math.min(time_since_start, end_time)
      const rate = (BigInt(time_since_start.toFixed(0))*pos.rate/pos.pool.payoutFrequency);
      const val = pos.amountUSD * rate;
      const interest = val/BigInt(100000000000);
      sumNetWorth += pos.amountUSD + interest;
      
    }
    setNetWorth(sumNetWorth);
  }

  const calculateMonthlyYeild = async (positions) => {
    let sumMonthlyYeild = BigInt(0);
    const date_now = Date.now()/1000;
    for(let position in positions){
      const pos = positions[position];
      const freq = Number(pos.pool.payoutFrequency);
      const start = Number(pos.position.startTime);
      const end_date = start + freq * pos.pool.totalPayments;
      
      if(new Date(end_date) < date_now){
        continue;
      }

      const interest = (pos.amountUSD*pos.rate/BigInt(100000000000));
      sumMonthlyYeild += interest;
    }
    setMonthlyYeild(sumMonthlyYeild);

    
  }

  const calculateNextPayout = async (positions) => {
    // let sumMonthlyYeild = BigInt(0);
    const date_now = Date.now()/1000;

    let smallest = Infinity;
    let next_pay = null;

    for(let position in positions){
      
      const pos = positions[position];
      const freq = Number(pos.pool.payoutFrequency);
      const start = Number(pos.position.startTime);
      const end_date = start + freq * pos.pool.totalPayments;
      
      if(new Date(end_date) < date_now){
        continue;
      }

      const payouts_passed = (date_now-end_date)/freq;
      
      if(payouts_passed >= pos.pool.totalPayments){
        continue;
      }

      const ciel = Math.ceil(payouts_passed) - payouts_passed;
      
      if(ciel > 0 && ciel < smallest){
        smallest = ciel;
        next_pay = new Date((ciel*freq+date_now)*1000);
      }

      if(next_pay != null){
        setSmallestPos(pos);
        setNextPay(next_pay);
      }      
  
    }

    
  }

  const calculateTotalEarnings = async (active, expired) => {
    // reward
    let sumTotalEarnings = BigInt(0);
    for(let position in active){
      //TODO ADD ACTIVE INCOME
      const pos = active[position];
      const interest_per_ten = pos.amountUSD * pos.rate;
      const amount = interest_per_ten*BigInt(pos.position.claimedPayments)/BigInt(100000000000);
      sumTotalEarnings+=amount;
    }
    for(let position in expired){
      const pos = expired[position];
      const interest_per_ten = pos.amountUSD * pos.rate;
      const amount = interest_per_ten*BigInt(pos.pool.totalPayments)/BigInt(100000000000);
      sumTotalEarnings+=amount;
    }
    setTotalEarnings(sumTotalEarnings);
  }

  const calculateUnclaimedInterest = async (positions) => {
    let sumUnclaimedInterest = BigInt(0);
    let unclaimedTokenIDs = [];
    const date_now = Date.now()/1000;

    for(let position in positions){
      const pos = positions[position];
      
      const freq = Number(pos.pool.payoutFrequency)
      const start = Number(pos.position.startTime)
      
      const payouts_passed = Math.min(Math.floor((date_now-start)/freq), pos.pool.totalPayments).toFixed(0);
      const payments_due = BigInt(payouts_passed) - pos.position.claimedPayments;
      
      if(BigInt(0) < payments_due){
        unclaimedTokenIDs.push(pos);
        const interest_per_ten = pos.amountUSD * pos.rate;
        const amount = interest_per_ten*payments_due/BigInt(100000000000);
        // console.log(pos, amount, (date_now-start)/freq);
        sumUnclaimedInterest += amount;
      }
    }
    setUnclaimedInterest(sumUnclaimedInterest);
    setUnclaimedTokenIDs(unclaimedTokenIDs);
 
  }

  useEffect(() => {
    calculateNetWorth(activePositions);
    calculateMonthlyYeild(activePositions);
    calculateUnclaimedInterest(activePositions);
    calculateNextPayout(activePositions);
  }, [activePositions]);

  useEffect(() => {
    calculateNextPayout(activePositions);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if(smallestPos != undefined){
        const date_now = Date.now()/1000;
        const freq = Number(smallestPos.pool.payoutFrequency);
        const payouts_passed = (date_now-(Number(smallestPos.position.startTime) + freq * smallestPos.pool.totalPayments))/freq;        
        const ciel = Math.ceil(payouts_passed) - payouts_passed;
        setNextPay(new Date((ciel*freq+date_now)*1000));    
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [smallestPos]);

  useEffect(() => {
    calculateTotalEarnings(activePositions, expiredPositions);
  }, [activePositions, expiredPositions]);
  
  useEffect(() => {
    
    if(unclaimedTokenIDs.length == 0){
      setClaimable(false);
      setClaimAmount(BigInt(0));
      return;
    }
    const date_now = Date.now()/1000;

    const claimablePositions = unclaimedTokenIDs.slice(0, 8); //['tokenID']
    const tokenIDs = claimablePositions.map((v)=>v.tokenID);
    let sumUnclaimedInterest = BigInt(0);
    
    for(let position in claimablePositions){
      const pos = claimablePositions[position];
      
      const freq = Number(pos.pool.payoutFrequency)
      const start = Number(pos.position.startTime)
      
      const payouts_passed = Math.min((date_now-start)/freq, pos.pool.totalPayments).toFixed(0);
      const payments_due = BigInt(payouts_passed) - pos.position.claimedPayments;
      
      if(BigInt(0) < payments_due){
        const interest_per_ten = pos.amountUSD * pos.rate;
        const amount = interest_per_ten*payments_due/BigInt(100000000000);
        sumUnclaimedInterest += amount;
      }
    }
    setClaimable(true);
    setClaimAmount(sumUnclaimedInterest);
    setWithdrawArgs([tokenIDs]);
  }, [unclaimedTokenIDs])

  const claimAll = () => {
    // console.log("Called Claim");
    // console.log(withdrawArgs);
    batchedWithdrawContract();
  }

  const toBigIntString2Dec = (value) => {
    let strValue = value.toString();
    strValue = strValue.padStart(11, '0')
    strValue = strValue.slice(0, -10) + '.' + strValue.slice(-10, -8);
    return strValue
  }

  return (
    <div className="flex gap-10 md:flex-row flex-col">
      {/* left side start */}
      <div className="w-full max-w-[400px]">
        {/* Card */}
        <div>
          {/* upper part */}
          <div className="w-full bg-navButtonBg pt-4 pb-14 px-5">
            {/* heading */}
            <h2 className="text-xl lg:text-2xl mb-[22px]">Your Portfolio</h2>

            {/* Content */}
            <div>
              {/* NEt worth */}
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm lg:text-[17px]">Net Worth:</p>
                <p className="roboto text-sm lg:text-[17px]">
                  ${toBigIntString(netWorth)}
                  {/* $00000.000000000000 */}
                </p>
              </div>

              {/* Lifetime Earnings: */}
              <div className="flex items-center justify-between gap-2 mt-5">
                <p className="text-sm lg:text-[17px]">Lifetime Earnings:</p>
                <p className="roboto text-sm lg:text-[17px]">
                  {/* $00000.000000000000 */}
                  ${toBigIntString(totalEarnings)}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Part */}
          <div className="w-full bg-portfolioBottomBg px-5 pt-16 pb-[22px]">
            {/* Monthly Yield */}
            <div className="flex items-center justify-between gap-2 mt-5">
              <p className="text-sm lg:text-[17px] text-white">Ten Minute Yield</p>
              <p className="roboto text-sm lg:text-[17px] text-white">
                ${toBigIntString(monthlyYeild, 3)}
              </p>
            </div>

            {/* Next Payout */}
            <div className="flex items-center justify-between gap-2 mt-5">
              <p className="text-sm lg:text-[17px] text-white">Next Payout</p>
              <p className="roboto text-sm lg:text-[17px] text-white">
                {toDateString(nextPay)}
              </p>
            </div>

            {/* Unclaimed Interest */}
            <div className="flex items-center justify-between gap-2 mt-5">
              <p className="text-[19px] text-white">Unclaimed Interest</p>
              <p className="roboto text-[19px] text-white">${toBigIntString(unclaimedInterest, 3)}</p>
            </div>
          </div>
        </div>
      </div>
      {/* left side end */}

      {/* right side start */}
      <div className="w-full flex flex-col justify-between gap-6 md:gap-4">
        <div className="text-end">
          <p className="xl:text-lg 2xl:text-xl">
            Lila Finance Interest Rate Swaps
          </p>
          <p className="text-xl 2xl:text-2xl xl:mt-2.5 2xl:mt-3.5">
            {connected ? `Welcome Back` : `Please Connect Your Wallet`}
          </p>
        </div>

        
        {/* Claim All */}
        <button className={`w-[200px] h-[100px] ${(!claimable) ? "bg-depositBg" : "bg-navButtonBg"} px-3.5 text-end pt-7`}
                onClick={claimAll}
                disabled={!claimable}>
            <p className="text-base md:text-xl">Claim ${toBigIntString2Dec(claimAmount)}</p>
            {/* claimAmount, claimable */}
            {/*        */}
        </button>

      </div>
      {/* right side end */}
      
    </div>
  );
};

export default PortfolioBanner;
