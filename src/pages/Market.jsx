import { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
import Popup from "../components/Popup";
import Overlay from "../components/Overlay";
import addresses from "../addresses/address.json";
import mapping from "../localdata/mapping.json";

import { useAccount, usePublicClient} from "wagmi";
import { ethers } from "ethers";

import IERC20 from "../abi/IERC20.json";
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

  const maturityDuration = ["1", "3", "6"];
const [activeMaturities, setActiveMaturities] = useState([0, 1, 2]);
const toggleMaturity = (index) => {
    if (activeMaturities.includes(index)) {
      setActiveMaturities(activeMaturities.filter(item => item !== index));
    } else {
      setActiveMaturities([...activeMaturities, index]);
    }
  };



  const assetData = ["All", "USDT", "DAI", "USDC"];
  const [selectedAsset, setselectedAsset] = useState("All");

  const [showDropdown, setShowDropdown] = useState(false);

//   const pagination = ["1", "2", "3"];
  const [pagination, setPagination] = useState(["1"]);
  const [activePagination, setActivePagination] = useState(0);

  // popup
  const [showPopup, setShowPopup] = useState(false);

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
  

useEffect(() => {
    if(network != "None"){
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
              listOfLists.push([topLevelKey, assetKey, timeframe, value['index'], value['rate']]);
            }
          }
        }
      
        return listOfLists;
      }
      const list = convertMapToListOfLists(map);
      setPools(list);
    }
  }, [network]);

  useEffect(() => {
    // console.log(pools);
    
    let activeMaturitiesDuration = activeMaturities.map(index => maturityDuration[index] + "m");
    let filteredPools = pools.filter(pool => activeMaturitiesDuration.includes(pool[2]));

    let asset = selectedAsset;  
    let nfilteredPools = asset == "All" ? filteredPools : filteredPools.filter(pool => pool[1] === asset);

    setShownPools(nfilteredPools.slice(0, 5));
    
    let page_count = Math.ceil(nfilteredPools.length / 5);
    setPagination(Array.from({ length: page_count }, (_, index) => (index + 1).toString()));

    }, [pools, selectedAsset, activeMaturities]);

    useEffect(() => {
        // console.log(pools);
        
        let activeMaturitiesDuration = activeMaturities.map(index => maturityDuration[index] + "m");
        let filteredPools = pools.filter(pool => activeMaturitiesDuration.includes(pool[2]));

        let asset = selectedAsset;  
        let nfilteredPools = asset == "All" ? filteredPools : filteredPools.filter(pool => pool[1] === asset);
        setShownPools(nfilteredPools.slice(5*activePagination, 5+5*activePagination));
        }, [activePagination]);
  
    // useEffect(() => {
    //     const new_pools = shownPools;
    //     for(po in shownPools){

    //     }
    // }, [shownPools]);

  const [selectedPool, setSelectedPool] = useState(0);
  return (
    <div
      ref={nextPageRef}
      className="relative bg-primaryBg min-h-screen lg:pb-0 pb-20"
    >
        <Navbar setNetwork={setNetwork} showPopup={showPopup} />
      <div className="container mx-auto w-11/12 min-h-screen">
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
                    activeMaturities.includes(idx) ? "bg-primaryColor" : ""
                    } w-8 h-8 rounded-full flex items-center justify-center cursor-pointer`}
                    onClick={() => toggleMaturity(idx)}>
                    <p
                    className={` ${
                        activeMaturities.includes(idx) ? "text-primaryBg" : "text-white"
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
                <img src="./images/header-arrow.svg" alt="" />
              </div>

              <div className="w-4/12 flex items-center justify-end gap-2 px-5">
                <p className="text-m text-white font-bold">Maturity</p>
                {/* <img src="./images/header-arrow.svg" alt="" /> */}
              </div>

              <div className="w-4/12 flex items-center justify-end gap-2 px-5">
                <p className="text-m text-white font-bold">TVL</p>
                <img src="./images/header-arrow.svg" alt="" />
              </div>
            </div>

            {/* contetn */}
            <div>
              {shownPools?.map((item, idx) => {
                const [ protocol, asset, duration, id, rate  ] = item;

                return (
                  <div
                    onClick={() => openPopup(id)} 
                    key={id}
                    className={`w-full flex items-center justify-between py-5 mb-1 ${
                      idx === shownPools.length - 1
                        ? ""
                        : "border-b border-b-primaryColor"
                    }  cursor-pointer hover:shadow-rowShadow duration-200`}
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

                    <div className="w-4/12 flex items-center justify-end gap-2 px-5">
                      <p className="text-sm text-white font-medium">{duration[0]} Month</p>
                    </div>

                    <div className="w-4/12 flex items-center justify-end gap-2 px-5">
                      <p className="text-sm text-white font-medium">tvl</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* pagination */}
            <div className="flex items-center justify-center gap-14 mt-5 md:mt-14 lg:mb-0 mb-10">
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
      <div className="w-full h-[55px] bg-primaryColor mt-10"></div>
      <div className="w-full h-[55px]"></div>
      {showPopup === true ? <Overlay closeFunc={closePopup} /> : null}
            <Popup showPopup={showPopup} getBalance={getUserBalance} selectedPool={pools[selectedPool]}
            userAddress={userAddress} publicClient={publicClient}/>
    </div>
  );
};

export default Market;
