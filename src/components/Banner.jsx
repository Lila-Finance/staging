import React from "react";
import { NavLink } from "react-router-dom";
import Card from "./Card";
import LineBreak from "./popups/LineBreak";
import { useState, useEffect } from "react";
import ILilaPoolAddressProvider from "../abi/ILilaPoolAddressProvider.json";
import IProxy from "../abi/IProxy.json";
import IERC20 from "../abi/IERC20.json";
import { usePublicClient } from "wagmi";
import addresj from "../addresses/addresj.json";
import {ethers} from "ethers";

const Banner = () => {
    const publicClient = usePublicClient();

    const [nowPools, setnPools] = useState("14");
    const [totalPools, setTPools] = useState("14");
    const [totalTVL, setTVL] = useState("");
    const [totalPayouts, setPayouts] = useState("");
  
    const updateTVL = async () => {
        
        const newPC = await publicClient.readContract({
            address: addresj.addrprov,
            abi: ILilaPoolAddressProvider.abi,
            functionName: "totalAmountPayout",
            args: [],
            });
        
        const totalPoolsFilled = await publicClient.readContract({
            address: addresj.addrprov,
            abi: ILilaPoolAddressProvider.abi,
            functionName: "totalPoolsFilled",
            args: [],
            });

        const activePoolsFilled = await publicClient.readContract({
            address: addresj.addrprov,
            abi: ILilaPoolAddressProvider.abi,
            functionName: "totalActivePools",
            args: [],
            });
        
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
        // console.log("AtokenBal "+aTokenBal);

        function formatMoney(number) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 9
            }).format(number);
        }
        // console.log(totalPoolsFilled);
        setTVL(formatMoney(Number(ethers.formatEther(aTokenBal))));
        setPayouts(formatMoney(Number(ethers.formatEther(newPC))));
        setTPools(Number(totalPoolsFilled));
        setnPools(Number(activePoolsFilled));

    }

    useEffect(() => {
        updateTVL();
        
        const interval = setInterval(updateTVL, 4000);
        
        return () => clearInterval(interval);
      }, []);


  return (
    <div className="w-full flex items-center justify-between gap-10 md:flex-row flex-col md:mt-0 mt-4">
      {/* Left Side  */}
      <div className="w-full mt-40">
        {/* title */}
        <h1 className="text-6xl lg:text-7xl font-medium md:text-start text-center">
          {totalPayouts}
        </h1>
        <h2 className="text-1xl lg:text-2xl leading-[45px] mt-8 mb-10 md:text-start text-center">
            of income payed out by Lila across 3 networks <br></br> and over {totalPools} pools. 
        </h2>

        <h1 className="text-4xl lg:text-5xl font-medium md:text-start text-center mt-16">
          {totalTVL}
        </h1>
        <h2 className="text-1xl lg:text-2xl leading-[45px] mt-8 mb-10 md:text-start text-center">
            of value locked now across 3 networks <br></br> and {nowPools} pools. 
        </h2>

        {/* buttons */}
        <div className="md:text-start text-center">
          <NavLink to="/market">
            <button className="bg-themeColor lg:text-lg md:py-[10px] py-2 px-8 md:px-12 rounded-full duration-300 hover:translate-x-3">
              Earn Now
            </button>
          </NavLink>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full flex justify-end mt-40">
        <Card homepage={true} />
      </div>
    </div>
  );
};

export default Banner;
