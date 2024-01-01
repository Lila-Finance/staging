import { useEffect, useContext, useState } from "react";
import { ExchangeRateContext } from '../../helpers/Converter';

import address from "../../data/address.json";

import ILilaPoolsProvider from "../../abi/ILilaPoolsProvider.json";

const PortfolioBanner = ({ activePositions, expiredPositions, connected }) => {

  const toBigIntString = (value, dec) => {
    let strValue = value.toString();
    strValue = dec == 3 ? strValue.padStart(11, '0') : strValue.padStart(11, '0');
    strValue = strValue.slice(0, -10) + '.' + strValue.slice(-10);
    strValue = dec == 3 ? strValue.slice(0, 6) : strValue;
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
  
    // Format the string
    return `${String(days).padStart(2, '0')}D ${String(hours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M ${String(seconds).padStart(2, '0')}S`;
  };

  const [netWorth, setNetWorth] = useState(BigInt(0));
  const [totalEarnings, setTotalEarnings] = useState(BigInt(0));
  const [monthlyYeild, setMonthlyYeild] = useState(BigInt(0));
  const [nextPay, setNextPay] = useState(new Date(0));
  const [unclaimedInterest, setUnclaimedInterest] = useState(BigInt(0));
  
  const calculateNetWorth = async (positions) => {
    let sumNetWorth = BigInt(0);
    for(let position in positions){
      const rate = BigInt((positions[position]['rate']*((Number(Date.now()/1000)-Number(positions[position]['blockTimestamp']))/6/6/24/365)*100000000).toFixed(0));
      const val = positions[position]['amount']*rate;
      const interest = val/BigInt(100000000000);
      sumNetWorth += positions[position]['amount'] + interest;
    }
    setNetWorth(sumNetWorth);
  }

  const calculateMonthlyYeild = async (positions) => {
    let sumMonthlyYeild = BigInt(0);
    for(let position in positions){
      const duration = Number(positions[position]['duration'])
      const rate = BigInt(positions[position]['rate']*1000000);
      const interest = (positions[position]['amount']*rate)/BigInt(1000000*duration);
      sumMonthlyYeild += interest;
    }
    setMonthlyYeild(sumMonthlyYeild);

    
  }

  const calculateNextPayout = async (positions) => {
    // let sumMonthlyYeild = BigInt(0);
    const date_now = Date.now();
    const date_now_days = date_now/1000/60/60/24;

    let smallest = Infinity;
    let next_pay = null;

    for(let position in positions){
      const duration = Number(positions[position]['duration']);
      const blockTimestamp = Number(positions[position]['blockTimestamp']);
      // blockTimestamp is the start time of the contract

      if(new Date((blockTimestamp+duration*(30*24*60*60)) * 1000) < date_now){
        continue;
      }

      const date = blockTimestamp/60/60/24;

      const payouts_passed = (date_now_days - date)/30;

      const ciel = Math.ceil(payouts_passed) - payouts_passed;
      if(ciel > 0 && ciel < smallest){
        smallest = ciel;
        next_pay = new Date((ciel*30+date)*60*60*24*1000);
      }

      if(next_pay != null){
        setNextPay(next_pay);
      }      
  
    }

    
  }

  const calculateTotalEarnings = async (active, expired) => {
    // reward
    let sumTotalEarnings = BigInt(0);
    for(let position in active){
      const rewardData = active[position]['rewardsData'];
      for(let reward in rewardData){
        console.log(rewardData[reward]);
      }
    }
    setTotalEarnings(sumTotalEarnings);
  }

  const calculateUnclaimedInterest = async (positions) => {
    let sumUnclaimedInterest = BigInt(0);
    const date_now = Date.now();
    const date_now_days = date_now/1000/60/60/24;

    for(let position in positions){
      const blockTimestamp = Number(positions[position]['blockTimestamp']);
      const date = blockTimestamp/60/60/24;
      const payouts_passed = Math.floor((date_now_days - date)/30);
      const payouts_done = positions[position]['rewardsData'].length;
      const par = BigInt((payouts_passed-payouts_done));
      const duration = Number(positions[position]['duration'])
      const rate = BigInt(positions[position]['rate']*1000000);
      const interest = (positions[position]['amount']*rate)/BigInt(1000000*duration);
      sumUnclaimedInterest += interest*par;
    }
    setUnclaimedInterest(sumUnclaimedInterest);
 
  }

  useEffect(() => {
    calculateNetWorth(activePositions);
    calculateMonthlyYeild(activePositions);
    calculateUnclaimedInterest(activePositions);
    calculateNextPayout(activePositions);
  }, [activePositions]);

  useEffect(() => {
    const calculateNextPayoutInter = () => {
      calculateNextPayout(activePositions);
    };
    const intervalId = setInterval(calculateNextPayoutInter, 9000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    calculateTotalEarnings(activePositions, expiredPositions);
  }, [activePositions, expiredPositions]);


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
              <p className="text-sm lg:text-[17px] text-white">Monthly Yield</p>
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
        <div className="w-[200px] h-[100px] bg-navButtonBg px-3.5 text-end pt-7">
          <p className="text-base md:text-xl">Claim All</p>
        </div>
      </div>
      {/* right side end */}
    </div>
  );
};

export default PortfolioBanner;
