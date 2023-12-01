import { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
import Popup from "../components/Popup";
import ConfirmationPopup from '../components/ConfirmationPopup';
import Overlay from "../components/Overlay";
import address from "../addresses/address.json";
import mapping from "../localdata/mapping.json";

import { useAccount, usePublicClient} from "wagmi";
import { ethers } from "ethers";

import IERC20 from "../abi/IERC20.json";
import IProxy from "../abi/IProxy.json";
import ILilaPoolsProvider from "../abi/ILilaPoolsProvider.json";

const Market = ({ nextPageRef }) => {
  const { address: userAddress } = useAccount();
  const publicClient = usePublicClient();

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
  const getNetwork = () => {
    return network;
  }
  const maturityDuration = ["1", "3", "6"];
const [activeMaturities, setActiveMaturities] = useState(0);
const toggleMaturity = (index) => {
    setActiveMaturities(index);
  };

  const assetData = ["All", "USDT", "DAI", "USDC"];
  const [selectedAsset, setselectedAsset] = useState("All");

  const [showDropdown, setShowDropdown] = useState(false);

//   const pagination = ["1", "2", "3"];
  const [pagination, setPagination] = useState(["1"]);
  const [activePagination, setActivePagination] = useState(0);

  // popup
  const [showPopup, setShowPopup] = useState(false);
  const [showConfirmPopup , setShowConfirmPopup]  = useState(false);
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState("");
  const setConfirmPopup = (amount, token) => {
    setAmount(amount);
    setToken(token);
    setShowPopup(false);
    setShowConfirmPopup(true);
  }

  const openPopup = (id_shown) => {
    setShowPopup(true);
    setSelectedPool(id_shown);
  };

  const closePopup = () => {
    setShowPopup(false);
  };
  const [network, setNetwork] = useState("None");
  const [messsage, setMessage] = useState("Choose a Valid Network/Connect Wallet");
  const [pools, setPools] = useState([]);

  const [shownPools, setShownPools] = useState([]);

  const [sortAPY, setSortAPY] = useState(0); // 0 is n/a 1 is up 2 is down
  const [sortTVL, setSortTVL] = useState(0); // 0 is n/a 1 is up 2 is down
  
  

useEffect(() => {
    if(network != "None" && network != undefined){
    setMessage(network +" Markets")
    let map = mapping[network.toLowerCase()];
    // console.log(map);
    function convertMapToListOfLists(map) {
        const listOfLists = [];
        // Iterate through each top-level property (like "aave")
        for (const [topLevelKey, assets] of Object.entries(map)) {
          // Iterate through each asset (like "dai", "usdc", etc.)
          for (const [assetKey, timeframes] of Object.entries(assets)) {
            // Iterate through each timeframe (like "1m", "3m", "6m")
            for (const [timeframe, value] of Object.entries(timeframes)) {
              listOfLists.push([topLevelKey, assetKey, timeframe, value['index'], value['rate'], 0]);
            }
          }
        }
      
        return listOfLists;
      }
      const list = convertMapToListOfLists(map);  
    //   setPools(list);
    //   console.log(list);
      const getTVLS = async (new_list) => {
        const networkpools = await publicClient.readContract({
            address: address.pools_provider,
            abi: ILilaPoolsProvider.abi,
            functionName: "getOpenPools",
            args: [],
        });
        const requests = list.map(async (item, index) => {
            const pooln = networkpools[item[3]];
            if (pooln) {
              const proxy = pooln['strategy'];
              try {
                const BALANCE = await publicClient.readContract({
                  address: proxy,
                  abi: IProxy.abi,
                  functionName: "balance",
                  args: [],
                });
                const decimal = item[1] === "DAI" ? 18 : 6;
                return ethers.formatUnits(BALANCE, decimal);
              } catch (error) {
                console.error(`Error fetching data for pool at index ${index}:`, error);
                return item[5]; // return existing value in case of error
              }
            }
            return item[5]; // return existing value if pooln is undefined
          });
        
        const results = await Promise.all(requests);
        const updatedList = list.map((item, index) => {
            item[5] = results[index];
            return item;
          });
        
        setPools(updatedList);
        // for(let i = 0; i < new_list.length; i++){
        //     // const tokenAddress = pools[selectedPool[3]]['asset'];
        //     const pooln = networkpools[new_list[i][3]];
        //     if(pooln != undefined){
        //         const proxy = pooln['strategy'];
        //         // console.log(proxy);

        //         const BALANCE = await publicClient.readContract({
        //             address: proxy,
        //             abi: IProxy.abi,
        //             functionName: "balance",
        //             args: [],
        //         });
        //         const decimal = new_list[i][1] == "DAI" ? 18 : 6;
                
        //         new_list[i][5] = (ethers.formatUnits(BALANCE, decimal));
        //     }
        // }
        // console.log(new_list);
        // setPools(new_list);
    }
        setPools(list);
        getTVLS(list);
    
    }
  }, [network]);
  

  useEffect(() => {

    
    let activeMaturitiesDuration =  maturityDuration[activeMaturities] + "m";
    let filteredPools = pools.filter(pool => activeMaturitiesDuration == pool[2]);

    let asset = selectedAsset;  
    let nfilteredPools = asset == "All" ? filteredPools : filteredPools.filter(pool => pool[1] === asset);

    //filter by tvl or apy
    //sortTVL == 1
    if(sortTVL > sortAPY){
        if(sortTVL != 0) {
            nfilteredPools.sort((a, b) => {
            if (sortTVL === 1) {
            return a[5] - b[5];
            }
            else if (sortTVL === 2) {
            return b[5] - a[5];
            }
        })
        }
    }
    if(sortAPY != 0) {
        nfilteredPools.sort((a, b) => {
        if (sortAPY === 1) {
          return a[4] - b[4];
        }
        else if (sortAPY === 2) {
          return b[4] - a[4];
        }
      })
    }
    if(sortTVL <= sortAPY){
        if(sortTVL != 0) {
            nfilteredPools.sort((a, b) => {
            if (sortTVL === 1) {
            return a[5] - b[5];
            }
            else if (sortTVL === 2) {
            return b[5] - a[5];
            }
        })
        }
    }
    

    setShownPools(nfilteredPools.slice(0, 5));
    
    let page_count = Math.ceil(nfilteredPools.length / 5);
    setPagination(Array.from({ length: page_count }, (_, index) => (index + 1).toString()));

    }, [pools, selectedAsset, activeMaturities, sortAPY, sortTVL]);

    useEffect(() => {
        // console.log(pools);
        
        let activeMaturitiesDuration =  maturityDuration[activeMaturities] + "m";
        let filteredPools = pools.filter(pool => activeMaturitiesDuration == pool[2]);
    
        let asset = selectedAsset;  
        let nfilteredPools = asset == "All" ? filteredPools : filteredPools.filter(pool => pool[1] === asset);
        setShownPools(nfilteredPools.slice(5*activePagination, 5+5*activePagination));
        }, [activePagination]);
  
    // useEffect(() => {
    //     const new_pools = shownPools;
    //     for(po in shownPools){

    //     }
    // }, [shownPools]);
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
  const [selectedPool, setSelectedPool] = useState(0);
  return (
    <div
      ref={nextPageRef}
      className="relative bg-primaryBg min-h-screen lg:pb-0 pb-20"
    >
        <Navbar setNetwork={setNetwork} showPopup={showPopup||showConfirmPopup} />
      <div className="container mx-auto w-11/12 min-h-screen" style={{ minHeight: `calc(100vh - 250px)` }}>
        <div className="mt-8">
            <p className="text-center text-2xl md:text-4xl text-white font-bold">
                {messsage}
            </p>
        </div>
        {/* content */}
        <div className="w-full flex lg:flex-row gap-16 mt-16 mx-[3vw]">
          {/* left side */}
          <div className="w-full max-w-[15vw] flex flex-col items-center text-center ">
            {/* Maturity (Months) */}
            <div className="px-auto">
              <p className="text-m font-bold text-white">Maturity (Months)</p>

              {/* maturity btns */}
              <div className="flex items-center gap-10 mt-4">
                {maturityDuration?.map((item, idx) => (
                <div
                    key={idx}
                    className={` ${
                    activeMaturities == idx ? "bg-primaryColor" : ""
                    } w-8 h-8 rounded-full flex items-center justify-center cursor-pointer`}
                    onClick={() => toggleMaturity(idx)}>
                    <p
                    className={` ${
                        activeMaturities == idx ? "text-primaryBg" : "text-white"
                    } text-sm`}>
                    {item}
                    </p>
                </div>
                ))}
            </div>

            </div>
            <div className="mt-12 px-auto">
              <p className="text-m font-bold text-white">Asset</p>

              {/* dropdown */}
              <div
                onClick={() => setShowDropdown(!showDropdown)}
                className={`bg-primaryColor border border-black w-32 ${
                  showDropdown === true ? "h-[140px]" : "h-[40px]"
                }  rounded-[20px] mt-3 relative py-2 overflow-hidden duration-300 cursor-pointer`}>
                <p className="text-m text-primaryBg font-medium text-center">
                  {selectedAsset}
                </p>

                <ul className="mt-2 border-t pt-1">
                {assetData.map((item, idx) => {
                    if (item === selectedAsset) return null;

                    return (
                    <p
                        onClick={() => setselectedAsset(item)}
                        key={idx}
                        className="text-m text-primaryBg font-medium text-center cursor-pointer mb-1">
                        {item}
                    </p>
                    );
                })}
                </ul>

                {/* arrow */}
                <div className="absolute right-2 top-[10px]">
                  <img
                    src="./images/dropdown-arrow.svg"
                    alt=""
                    className="cursor-pointer"/>
                </div>
              </div>
            </div>
            
          </div>
          {/* right side */}
          <div className="w-full max-w-[45vw]">
            {/* header */}
            <div className="w-full flex items-center justify-between pb-4 border-b-[4px] border-b-primaryColor">
              <div className="w-4/12 flex items-center justify-start gap-2 px-5">
                <p className="text-m text-white font-bold">Asset</p>
                {/* <img src="./images/header-arrow.svg" alt="" /> */}
              </div>

              <div className="w-4/12 flex items-center justify-center gap-2">
                <p className="text-m text-white font-bold">Protocol</p>
                {/* <img src="./images/header-arrow.svg" alt="" /> */}
              </div>

              <div className="w-4/12 flex items-center justify-end gap-2 px-5">
                <p className="text-m text-white font-bold">APY</p>
                <img 
                    src="./images/header-arrow.svg" 
                    alt="" 
                    onClick={() => {
                        setSortAPY(prevSortAPY => prevSortAPY < 0 ? (-prevSortAPY + 1) % 3 : (prevSortAPY + 1) % 3);
                        if(sortTVL > 0) setSortTVL(prevSortTVL => -prevSortTVL)
                    }} 
                    style={{
                        transform: sortAPY === 1 || sortAPY === -1 ? 'rotate(180deg)' : 'rotate(0deg)',
                        opacity: sortAPY === 0 ? 0.5 : 1 
                      }} 
                />
                </div>
              

              <div className="w-4/12 flex items-center justify-end gap-2 px-5">
                <p className="text-m text-white font-bold">TVL</p>
                <img 
                    src="./images/header-arrow.svg" 
                    alt="" 
                    onClick={() => {
                        setSortTVL(prevSortTVL => prevSortTVL < 0 ? (-prevSortTVL + 1) % 3 : (prevSortTVL + 1) % 3);
                        if(sortAPY > 0) setSortAPY(prevSortAPY => -prevSortAPY)
                    }} 
                    style={{
                        transform: sortTVL === 1 || sortTVL === -1  ? 'rotate(180deg)' : 'rotate(0deg)',
                        opacity: sortTVL === 0 ? 0.5 : 1 
                      }} 
                />
              </div>
            </div>

            {/* contetn */}
            <div>
              {shownPools?.map((item, idx) => {
                const [ protocol, asset, duration, id, rate, tvl ] = item;

                return (
                  <div
                    onClick={() => openPopup(id)} 
                    key={id}
                    className={`w-full flex items-center justify-between py-5 mb-1 ${
                      idx === shownPools.length - 1
                        ? ""
                        : "border-b border-b-primaryColor"
                    }  cursor-pointer hover:border-2 hover:border-primaryColor duration-200`}
                  >
                    
                    <div className="w-4/12 flex items-center justify-start gap-2 px-5">
                      <p className="text-sm text-white font-medium">{asset}</p>
                    </div>

                    <div className="w-4/12 flex items-center justify-center gap-2">
                      <p className="text-sm text-white font-medium">{protocol}</p>
                    </div>

                    <div className="w-4/12 flex items-center justify-end gap-2 px-5">
                      <p className="text-sm text-white font-medium">{rate}%</p>
                    </div>

                    {/* <div className="w-4/12 flex items-center justify-end gap-2 px-5">
                      <p className="text-sm text-white font-medium">{duration[0]} Month</p>
                    </div> */}

                    <div className="w-4/12 flex items-center justify-end gap-2 px-5">
                      <p className="text-sm text-white font-medium">{to3NumbersAndChar(tvl)}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* pagination */}
            <div className="flex items-center justify-center gap-14 mt-5 md:mt-14 lg:mb-0">
              {pagination?.map((item, idx) => (
                <div
                  key={idx}
                  className={` ${
                    activePagination === idx ? "bg-primaryColor" : ""
                  } w-8 h-8 rounded-full flex items-center justify-center cursor-pointer`}
                  onClick={() => setActivePagination(idx)}
                >
                  <p
                    className={` ${
                      activePagination === idx ? "text-primaryBg" : "text-white"
                    } font-medium text-sm`}
                  >
                    {item}
                  </p>
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>
      <div className="w-full h-[55px] bg-primaryColor"></div>
      <div className="w-full h-[55px]"></div>
      {(showPopup||showConfirmPopup) === true ? <Overlay closeFunc={closePopup} /> : null}
            <Popup showPopup={showPopup} getBalance={getUserBalance} selectedPool={pools[selectedPool]}
            userAddress={userAddress} publicClient={publicClient} setShowConfirmPopup={setConfirmPopup}
            network={getNetwork}/>
            <ConfirmationPopup showPopup={showConfirmPopup} setShowConfirmPopup={setShowConfirmPopup}
            amount={amount} token={token}/>
    </div>
  );
};

export default Market;
