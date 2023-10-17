import React, { useEffect, useState } from "react";
import {
  useContractReads,
  useContractRead,
  useContractWrite,
  usePublicClient,
  useContractEvent,
  useWaitForTransaction,
  useAccount,
} from "wagmi";
import { parseEther, formatEther, formatUnits } from "viem";
import IERC20 from "../abi/IERC20.json";
import { parse } from "postcss";
import ILilaPool from "../abi/ILilaPool.json";
import {ethers} from "ethers";


const Card = ({ homepage, pool, getAddressBalance, setSuccessDepo, setSuccessAmount }) => {
    const data = undefined;
  if (homepage) {
    return (
      <div
        className={`${"w-full lg:w-[60%] 3xl:w-7/12 home-card"} border border-themeColor card`}
      >
        {/* Title */}
        <div className="px-6 py-6 border-b border-b-themeColor text-center">
          <p className="text-base leading-none">Dai AAVE 7 Days</p>
        </div>

        {/* Toggle Categories */}
        <div className="px-6 py-[10px] flex items-center justify-between cursor-pointer">
          {/* left side */}
          <div>
            <p className="text-[15px]">Pool Information</p>
          </div>

          {/* right side */}
          <div>
            <i
              className={`fa-solid fa-caret-down text-2xl text-themeColor duration-300`}
            ></i>
          </div>
        </div>

        {/* Categories */}
        <div
          className={`w-full px-6 border-b border-b-themeColor overflow-hidden duration-300 ${"h-auto pt-4"} ${"h-[209px] pt-4 border-t border-t-themeColor"}`}
        >
          {/* category heading */}
          <div className="w-full flex justify-between items-center">
            {/* left */}
            <div className="w-full">&nbsp;</div>

            {/* middle */}
            <div className="w-full text-center">
              <p className="text-[15px]">Fixed</p>
            </div>

            {/* right */}
            <div className="w-full text-end">
              <p className="text-[15px]">Variable</p>
            </div>
          </div>

          {/* Data rows */}
          <div>
            {/* Row 1 */}
            <div className="w-full flex justify-between items-center my-6">
              {/* left */}
              <div className="w-full text-start">APR</div>

              {/* middle */}
              <div className="w-full text-center">
                <p className="text-[15px]">2.50%</p>
              </div>

              {/* right */}
              <div className="w-full text-end">
                <p className="text-[15px]">3.00%</p>
              </div>
            </div>

            {/* Row 2 */}
            <div className="w-full flex justify-between items-center my-6">
              {/* left */}
              <div className="w-full text-start">Limit</div>

              {/* middle */}
              <div className="w-full text-center">
                <p className="text-[15px]">50,000</p>
              </div>

              {/* right */}
              <div className="w-full text-end">
                <p className="text-[15px]">1,250</p>
              </div>
            </div>

            {/* Row 3 */}
            <div className="w-full flex justify-between items-center my-6">
              {/* left */}
              <div className="w-full text-start">Deposits</div>

              {/* middle */}
              <div className="w-full text-center">
                <p className="text-[15px]">xx,xxx</p>
              </div>

              {/* right */}
              <div className="w-full text-end">
                <p className="text-[15px]">x,xxx</p>
              </div>
            </div>
          </div>
        </div>

        {/* validate times */}
        <div className="w-full px-6 border-b border-b-themeColor">
          {/* Row 1 */}
          <div className="w-full flex justify-between items-center my-6">
            {/* left */}
            <div className="w-full text-start">Expired</div>

            {/* right */}
            <div className="w-full text-end">
              <p className="text-[15px]">Jan. 01, 2024 </p>
            </div>
          </div>

          {/* Row 2 */}
          <div className="w-full flex justify-between items-center my-6">
            {/* left */}
            <div className="w-full text-start">Payout</div>

            {/* right */}
            <div className="w-full text-end">
              <p className="text-[15px]">X of Y</p>
            </div>
          </div>
        </div>
        {/* Input Area */}
        <div className="w-full px-6 py-4 border-b">
          {/* Buttons */}
          <div className="border border-themeColor w-max mx-auto rounded-full">
            <button
              className={`text-[15px] rounded-full py-[1px] w-28 cursor-default ${"bg-themeColor"}`}
            >
              Fixed
            </button>
            <button className={`text-[15px] rounded-full py-[1px] w-28 cursor-default`}>
              Variable
            </button>
          </div>

          {/* Amount Box */}
          <div className="w-full mx-auto border border-themeColor rounded-full py-[3px] px-4 flex items-center justify-between gap-2 my-4">
            <input
              type="number"
              placeholder="0000.00"
              className="outline-none border-none bg-transparent w-full text-sm font-light leading-none"
              disabled={homepage}
            />
            <span className="underline underline-offset-2 text-xs leading-none">
              Max
            </span>
          </div>

          {/* button */}
          <div className="text-center">
            <button className="bg-themeColor cursor-default text-[15px] w-56 py-[5px] leading-none rounded-full outline-none border-none">
              Supply
            </button>
          </div>
        </div>
      </div>
    );
  }

  const address = pool ? pool[0] : "0";
  const [input, setInput] = useState("0");
  const [text, setText] = useState("");

  const tokenAddress = "0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357";
  const [token, setToken] = useState("");
  const { address: walletAddress } = useAccount();

  const [balance, setBalance ] = useState("0");

  const setCorrectInput = (val) => {
    setText(val);
    let v = parseFloat(val);
    if(!isNaN(v) && isFinite(v)){
        let max = 0;

        if(fixedAmount){
            max = Math.min(Number(pool[3])-Number(pool[2]), Number(balance));
        }else{
            let diff = Number(pool[5])-Number(pool[4]);
            max = Math.min(diff, Number(balance));
        }

        setInput(Math.min(v, max).toString());
        if(Math.min(v, max).toString() == v){
            setText(val);
        }else{
            setText(max);
        }
    }
  }


  const publicClient = usePublicClient();

  const {
        data: dataAllow,
        isLoading: isLoadingAllow,
        isSuccess: isSuccessAllow,
        write: allow,
  } = useContractWrite({
        address: tokenAddress,
        abi: IERC20.abi,
        functionName: "approve",
        args: [pool[0], parseEther(input)],
  });

  useEffect(() => {
        let kill = true; 
        if (isSuccessAllow && allowingBool) {
            const goat = async () => {
                if (publicClient) {
                    const allowance = await publicClient.readContract({
                        address: "0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357",
                        abi: IERC20.abi,
                        functionName: "allowance",
                        args: [walletAddress, pool[0]],
                    });
                    // console.log("Allowance:"+allowance);
                    // console.log("Need:"+ethers.parseEther(input));
                    if(allowance >= ethers.parseEther(input)){
                        kill = false;
                        setSupplyBool(true);
                        setAllowingBool(false);
                    }
                }
            }
        
            let iterationCount = 0;
        
            const intervalId = setInterval(() => {
                // console.log("gg:"+allowingBool);
                if (!kill || !allowingBool || iterationCount >= 18) {
                    // console.log("kee");
                    clearInterval(intervalId);  // Stop the interval
                    return;
                }
        
                goat();
        
                iterationCount++;
            }, 10000);
        }
    }, [isSuccessAllow]);
  
    useContractEvent({
        address: pool[0],
        abi: ILilaPool.abi,
        eventName: 'Deposit',
        listener(log) {
            if(log[0].args['poolAddr'] == pool[0] && log[0].args['who'] == walletAddress){
                setSupplyingBool(false);
                setSupplyBool(true);
                setSuccessDepo(true);
                setText("");
            }
        },
    });

  const {
        data: dataVaraible,
        write: supplyVariable,
        isSuccess: isSuccessVaraible,
        isLoading: isLoadingDeposit
  } = useContractWrite({
        address: pool[0],
        abi: ILilaPool.abi,
        functionName: "deposit",
        args: [ethers.parseEther(input), false],
      });

  const {
        data: dataFixed,
        write: supplyFixed,
        isSuccess: isSuccessFixed,
  } = useContractWrite({
        address: pool[0],
        abi: ILilaPool.abi,
        functionName: "deposit",
        args: [ethers.parseEther(input), true],
  });

  const supply = async () => {
    setText(input);
    if(text == "" || input == "0" || input == "0.0"){
        return;
    }
    if (publicClient) {
      const allowance = await publicClient.readContract({
        address: tokenAddress,
        abi: IERC20.abi,
        functionName: "allowance",
        args: [walletAddress, pool[0]],
      });
      if (allowance < parseEther(input)) {
        setSupplyBool(false);
        setAllowingBool(true);
        allow();
      } else {
        setSupplyBool(false);
        setSupplyingBool(true);
        setSuccessAmount(input);
        if (fixedAmount) {
          supplyFixed();
        } else {
          supplyVariable();
        }
        // alert("Transaction processing...");
      }
    } else {
        setSupplyBool(false);
        setAllowingBool(true);
        allow();
    }
  };

  useEffect(() => {
    const fetchAndSetBalance = async () => {
        try {
          const fetchedBalance = await getAddressBalance();
          setBalance(fetchedBalance);
        } catch (error) {
          console.error("Failed to fetch balance:", error);
          setBalance("0");
        }
      };
      fetchAndSetBalance();
  }, []);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [fixedAmount, setFixedAmount] = useState(true);
  const [variableAmount, setVariableAmount] = useState(false);

  let fixed_rate = pool[1];
  let fixed_limit = pool[3];
  let fixed_deposited = pool[2];
  const [var_rate, setVarRate] = useState(() => {
    const cachedPos = localStorage.getItem('storedVarRate');
    return cachedPos ? cachedPos : "0%";
});
const fetchRate = async () => {
    // try {
    //   const response = await fetch('https://lila-finance.github.io/rates/DAI.txt');
    // //   console.log(response);
    //   const text = await response.text();
    //   console.log(text);
    //   setVarRate(text);
      
    //   // Store in local storage
    //   localStorage.setItem('storedVarRate', text);
    // } catch (error) {
    //   console.error('Error fetching data:', error);
      
    //   const storedData = localStorage.getItem('storedVarRate');
    //   if (storedData) {
    //     setVarRate(storedData);
    //   }
    // } 
  };
  useEffect(() => {
    fetchRate();
    
    const interval = setInterval(fetchRate, 100000);
    
    return () => clearInterval(interval);
  }, []);


  let var_limit = pool[5];
  let var_deposited = pool[4];
  
  
  const options = {  year: "numeric", month: "short", day: "numeric" };

  // Calculate days until next Sunday
  let daysUntilSunday = 7 - currentDate.getUTCDay();
   if (daysUntilSunday === 7) daysUntilSunday = 0; // If today is Sunday, set to 0
   // Set the date to the next Sunday
  const finalDate = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate() + daysUntilSunday));

  // Set the time to Sunday night (assuming 11:59:59 PM is your definition of night)
  finalDate.setUTCHours(23, 59, 59, 999);
  const formattedDate = finalDate.toLocaleDateString("en-US", options);
  // toggle state
  const selectFixedAmount = () => {
    setFixedAmount(true);
    setVariableAmount(false);
  };

  const selectVariableAmount = () => {
    setVariableAmount(true);
    setFixedAmount(false);
  };

  //toggle pool info
  const [showPoolInfo, setShowPoolInfo] = useState(true);
  const togglePoolInfo = () => {
    setShowPoolInfo(!showPoolInfo);
  };

  const [supplyBool, setSupplyBool] = useState(true);
  const [allowingBool, setAllowingBool] = useState(false);
  const [supplyingBool, setSupplyingBool] = useState(false);

  return (
    <div className={`w-auto card border-t-4 border-themeColor`}>
      {/* Title */}
      <div className="px-6 py-6 border-b border-b-themeColor text-center border-l-4 border-r-4 border-themeColor">
        <p className="text-base leading-none">         
        DAI AAVE {pool[7]} Day
        </p>
      </div>
      {/* Toggle Categories */}
      <div
        className="px-6 py-[10px] flex items-center justify-between cursor-pointer border-l-4 border-r-4 border-themeColor"
        onClick={togglePoolInfo}
      >
        {/* left side */}
        <div>
          <p className="text-[15px]">Pool Information</p>
        </div>

        {/* right side */}
        <div>
          <i
            className={`fa-solid fa-caret-down text-2xl text-themeColor duration-300 ${
              showPoolInfo === true ? "rotate-180" : ""
            }`}
          ></i>
        </div>
      </div>
      {/* Pool Info */}
      <div
        className={`w-auto px-6 border-b border-b-themeColor overflow-hidden duration-300 border-l-4 border-r-4 border-themeColor ${
          showPoolInfo === true
            ? "h-[209px] pt-4 border-t border-t-themeColor"
            : "h-0"
        }`}
      >
        {/* Pool Info heading */}
        <div className="w-full flex justify-between items-center ">
          {/* left */}
          <div className="w-full">&nbsp;</div>

          {/* middle */}
          <div className="w-full text-center">
            <p className="text-[15px]">Fixed</p>
          </div>

          {/* right */}
          <div className="w-full text-end">
            <p className="text-[15px]">Variable</p>
          </div>
        </div>

        {/* Data rows */}
        <div>
          {/* Row 1 */}
          <div className="w-full flex justify-between items-center my-6">
            {/* left */}
            <div className="w-full text-start">APR</div>

            {/* middle */}
            <div className="w-full text-center">
              <p className="text-[15px]">{fixed_rate}</p>
            </div>

            {/* right */}
            <div className="w-full text-end">
              <p className="text-[15px]">{var_rate}</p>
            </div>
          </div>

          {/* Row 2 */}
          <div className="w-full flex justify-between items-center my-6">
            {/* left */}
            <div className="w-full text-start">Limit</div>

            {/* middle */}
            <div className="w-full text-center">
              <p className="text-[15px]">{fixed_limit}</p>
            </div>

            {/* right */}
            <div className="w-full text-end">
              <p className="text-[15px]">{var_limit}</p>
            </div>
          </div>

          {/* Row 3 */}
          <div className="w-full flex justify-between items-center my-6">
            {/* left */}
            <div className="w-full text-start">Deposits</div>

            {/* middle */}
            <div className="w-full text-center">
              <p className="text-[15px]">{fixed_deposited}</p>
            </div>

            {/* right */}
            <div className="w-full text-end">
              <p className="text-[15px]">{var_deposited}</p>
            </div>
          </div>
        </div>
      </div>
      {/* validate times */}
      <div className="w-full px-6 border-b border-b-themeColor border-l-4 border-r-4 border-themeColor">
        {/* Row 1 */}
        <div className="w-full flex justify-between items-center pt-6 ">
          {/* left */}
          <div className="w-full text-start">Expiry</div>

          {/* right */}
          <div className="w-full text-end">
            <p className="text-[15px]">{formattedDate}</p>
          </div>
        </div>

        {/* Row 2 */}
        <div className="w-full flex justify-between items-center my-6">
          {/* left */}
          <div className="w-full text-start">Payout</div>

          {/* right */}
          <div className="w-full text-end">
            <p className="text-[15px]">0 of 1</p>
          </div>
        </div>
      </div>

      {/* Input Area */}
      {!(fixed_deposited == fixed_limit && var_deposited == var_limit) && (
      <div className="w-full px-6 py-4 border-b-4 border-themeColor border-l-4 border-r-4 border-themeColor">
        {/* Buttons */}
        <div className="border border-themeColor w-max mx-auto rounded-full">
        {/* Buttons for Fixed and Variable */}
          <button
            className={`text-[15px] rounded-full py-[1px] w-28 ${
              fixedAmount === true && "bg-themeColor"
            }`}
            onClick={!homepage ? selectFixedAmount : undefined}
          >
            Fixed
          </button>
          <button
            className={`text-[15px] rounded-full py-[1px] w-28 ${
              variableAmount === true && "bg-themeColor"
            }`}
            onClick={!homepage ? selectVariableAmount : undefined}
          >
            Variable
          </button>
        </div>

        {/* Amount Box */}
        <div className="w-full mx-auto border border-themeColor rounded-full py-[3px] px-4 flex items-center justify-between gap-2 my-4">
          <input
            type="number"
            placeholder=""
            value={text}
            onChange={(e) => setCorrectInput(e.target.value)}
            className="outline-none border-none bg-transparent w-full text-sm font-light leading-none"
            disabled={homepage}
          />
          <span
            className="underline underline-offset-2 text-xs leading-none"
            onClick={() => {
                setCorrectInput(balance);
            }}
          >
            Max
          </span>
        </div>
        {/* Supply button */}
        <div className="text-center">
          {/* <button
            onClick={supply}
            className="bg-themeColor text-[15px] w-56 py-[5px] leading-none rounded-full outline-none border-none"
          >
            Supply
          </button> */}
            {supplyBool === true ? (
                <button
                className="w-full md:w-9/12 px-4 py-2 bg-themeColor rounded-[15px] text-base lg:text-lg mt-1 font-medium"
                onClick={supply}
                >
                    Supply DAI
                </button>
              ) : null}
            {allowingBool === true ? (
                <button className="w-full md:w-9/12 px-4 py-2 bg-gray-300 rounded-[15px] text-base lg:text-lg mt-1 font-medium">
                <div className="flex items-center justify-center gap-2">
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  <p>Approving DAI</p>
                </div>
              </button>
              ) : null}
            {supplyingBool === true ? (
                <button className="w-full md:w-9/12 px-4 py-2 bg-gray-300 rounded-[15px] text-base lg:text-lg mt-1 font-medium">
                <div className="flex items-center justify-center gap-2">
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  <p>Supplying DAI</p>
                </div>
              </button>
              ) : null}
        </div>
      </div>
    )}
    </div>
  );
};

export default Card;
