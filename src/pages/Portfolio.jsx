import Card from "../components/Card";
import Navbar from "../components/Navbar";
import Filter from "../components/Filter";
import NoPoolsScreen from "../components/NoPoolsScreen";
import addresj from '../addresses/addresj.json';
import ILilaPool from "../abi/ILilaPool.json";
import ILilaPosition from "../abi/ILilaPosition.json";
import ILilaPoolAddressProvider from "../abi/ILilaPoolAddressProvider.json";
import { useAccount, usePublicClient, useContractWrite } from "wagmi";
import { ethers, getIndexedAccountPath } from "ethers";
import { useEffect, useState } from "react";
import PortfolioSingleAsset from '../components/PortfolioSingleAsset';

const Portfolio = () => {
  // get all pool addresses
    const lilaposaddr = addresj.lilaposaddr;
    const addrprov = addresj.addrprov;
    const [positions, setPositionss] = useState(() => {
        const cachedPos = localStorage.getItem('positions');
        return cachedPos ? JSON.parse(cachedPos) : [];
    });

    const getCorrectPosition = (tokenID) => {
        for(let i = 0; i < positions.length; i++){
            if(positions[i][11] == tokenID){
                return positions[i];
            }
        }
        return undefined;
    } 

    const [selected_position, setselected_position] = useState(0);

    const publicClient = usePublicClient();
    const { address } = useAccount();
    const getPoolInfo = async (addre) => {

        if (publicClient) {
            const fixedLimit = await publicClient.readContract({
                address: addre,
                abi: ILilaPool.abi,
                functionName: "fixedLimit",
                args: [],
            });
            const fixedDepo = await publicClient.readContract({
                address: addre,
                abi: ILilaPool.abi,
                functionName: "totalFixedDeposits",
                args: [],
            });
            const varLimit = await publicClient.readContract({
                address: addre,
                abi: ILilaPool.abi,
                functionName: "variableLimit",
                args: [],
            });
            const varDepo = await publicClient.readContract({
                address: addre,
                abi: ILilaPool.abi,
                functionName: "totalVariableDeposits",
                args: [],
            });
            const payouts = await publicClient.readContract({
                address: addre,
                abi: ILilaPool.abi,
                functionName: "payoutCount",
                args: [],
            });
            const duration = await publicClient.readContract({
                address: addre,
                abi: ILilaPool.abi,
                functionName: "timeLength",
                args: [],
            });
            const fixedLimitForm = ethers.formatEther(fixedLimit);
            const fixedDepoForm = ethers.formatEther(fixedDepo);
            const varLimitForm = ethers.formatEther(varLimit);
            const varDepoForm = ethers.formatEther(varDepo);
            const time = Number(BigInt("31536000")/duration); // 105120
            const APY = Number(1+varLimitForm/fixedLimitForm); // 1.5
            const value = ((APY ** time) - 1)*100;

            return [addre, value.toFixed(2)+"%", fixedDepoForm, fixedLimitForm, varDepoForm, varLimitForm, Number(payouts), duration, "15"]
        }

        return null;
    };
    const getPosition = async (i) => {
        const owner = await publicClient.readContract({
            address: lilaposaddr,
            abi: ILilaPosition.abi,
            functionName: "ownerOf",
            args: [i],
            });
        if(address === undefined || address === ""){
            return [];
        }
        if(owner != address){
            return []
        }
        const pool = await publicClient.readContract({
            address: lilaposaddr,
            abi: ILilaPosition.abi,
            functionName: "lilaPool",
            args: [i],
            });
        
        const fixed = await publicClient.readContract({
            address: pool,
            abi: ILilaPool.abi,
            functionName: "usersMap",
            args: [i],
            });

        const pool_info = await getPoolInfo(pool);
            
        const startDate = await publicClient.readContract({
            address: pool,
            abi: ILilaPool.abi,
            functionName: "poolStartTime",
            args: [],
            });

        const exp = Number(startDate+pool_info[7]);
        
        var seconds = new Date().getTime() / 1000;
        
        function formatTime(date) {
            const months = [
              'Jan', 'Feb', 'Mar', 'Apr',
              'May', 'Jun', 'Jul', 'Aug',
              'Sep', 'Oct', 'Nov', 'Dec'
            ];
          
            const month = months[date.getMonth()];
            const day = date.getDate();
            const year = date.getFullYear();
            const hours = date.getHours();
            const minutes = date.getMinutes();
          
            // Ensure that single-digit day and month are formatted with leading zeros
            const formattedDay = day < 10 ? `0${day}` : day;
            const formattedHours = hours < 10 ? `0${hours}` : hours;
            const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
          
            return `${month} ${formattedDay} ${year} ${formattedHours}:${formattedMinutes}`;
          }
        
        let sdate = new Date(Number(startDate) * 1000);
        let sformattedDate = formatTime(sdate);

        let exdate = new Date(exp * 1000);
        let edformattedDate = formatTime(exdate);
        // console.log(fixed, Number(fixed[2]))
        // console.log(pool_info, Number(pool_info[6]))
        // console.log(seconds)
        //Dec 31 1969 19:00

        let pos_data = [pool, 
            (startDate == 0) ? "Unfilled" : ((exp > seconds) ? "Active" : "Settled"),
             fixed[4] ? "Fixed" : "Variable",
              pool_info[1],
              ethers.formatEther(fixed[0]) + " Dai",
               (Number(fixed[2])*ethers.formatEther(fixed[0])*pool_info[5]/pool_info[3]).toFixed(3)+" Dai",
                Number(fixed[2]),
                 Number(pool_info[6]),
                  sformattedDate == "Dec 31 1969 19:00" ? "Not Started" : sformattedDate,
                  sformattedDate == "Dec 31 1969 19:00" ? "Not Started" : edformattedDate,
                    pool_info,
                     i,
                     fixed[3]];
        // console.log(i, pos_data);
        return pos_data;

        
    };
    const getListOfPositions = async () => {
        let poss = [];
        if(address !== undefined && address !== "" ){
            const myPositions = await publicClient.readContract({
                address: lilaposaddr,
                abi: ILilaPosition.abi,
                functionName: "getUserNFTs",
                args: [address],
                });

                for(let j = 0; j < myPositions.length; j++){
                    let po = await getPosition(Number(myPositions[j]));
                    if(po != [] && po!=""){
                        poss.push(po);
                    }
                }

        }

        setPositionss(poss);
        const stringifiedPositions = JSON.stringify(poss, (key, value) => {
            if (typeof value === 'bigint') {
              return value.toString();
            }
            return value;
          });
          
        localStorage.setItem('positions', stringifiedPositions);
        
      };
      useEffect(() => {
        getListOfPositions();
        
        const interval = setInterval(getListOfPositions, 1200000);
        
        return () => clearInterval(interval);
      }, []);
      const getIndex = () => {
        return selected_position;
      }
      const {
        data: dataAllow,
        isLoading: isLoadingAllow,
        isSuccess: isSuccessAllow,
        write: withdraw,
    } = useContractWrite({
        address: getCorrectPosition(getIndex()) ? getCorrectPosition(getIndex())[0] : "0",
        abi: ILilaPool.abi,
        functionName: "withdraw",
        args: [getCorrectPosition(getIndex()) ? getCorrectPosition(getIndex())[11] : 0],
    });

    const UpdatePositions = async (tokenID) => {
        let po = await getPosition(tokenID);
        if(po != [] && po!=""){
            setPositionss(prevPositions => {
                // Make a copy of the array
                const updatedPositions = [...prevPositions];
                
                for(let i = 0; i < prevPositions.length; i++){
                    if(positions[i][11] == tokenID){
                        updatedPositions[i] = po;
                    }
                }
        
                return updatedPositions;
            });
        }
    }

    const setselected_positionbuffer = (index) => {
        setselected_position(index);
        getIndex();
    }


  return (
    <div>
      <div className="container mx-auto w-11/12 md:w-[85%] 3xl:w-[70%]">
        <Navbar homepage={false} />

        {/* Cards */}
            {positions && positions.length > 0 ? (
                    <PortfolioSingleAsset positions={positions} selected_position={selected_position} setselected_position={setselected_positionbuffer} withdraw={withdraw} 
                    getCorrectPosition={getCorrectPosition} UpdatePositions={UpdatePositions}/>
            ) : (
                <NoPoolsScreen></NoPoolsScreen>
            )}

        
      </div>
    </div>
  );
};

export default Portfolio;
