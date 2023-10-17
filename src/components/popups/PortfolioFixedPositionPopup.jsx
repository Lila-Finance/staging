import React from "react";
import LineBreak from "./LineBreak";
import { motion } from "framer-motion";
import addresj from '../../addresses/addresj.json';
import { useState } from "react";
import {useContractEvent } from "wagmi";
import ILilaPool from "../../abi/ILilaPool.json"

const PortfolioFixedPositionPopup = ({ close, position, withdraw, UpdatePositions}) => {
    const [successWith, setSuccessWith] = useState(false);

    useContractEvent({
        address: position[0],
        abi: ILilaPool.abi,
        eventName: 'Withdrawal',
        listener(log) {
            console.log(log);
            console.log(Number(log[0].args['tokenID']) );
            console.log(Number(position[11]));
            if(Number(log[0].args['tokenID']) === Number(position[11])){
                setSuccessWith(true);
                UpdatePositions(log[0].args['tokenID']);
            }
        },
    });

  
  const [claiming, setClaiming] = useState(false);
  const [claimingPrinc, setClaimingPrinc] = useState(false);
  // earn fixed popup details data
  const fixedPDD = [
    {
      id: 1,
      key: "Asset",
      content: "Dai",
    },
    {
      id: 2,
      key: "Protocol",
      content: "AAVE",
    },
    {
      id: 3,
      key: "Length",
      content: "1 Week",
    },
    {
      id: 4,
      key: "Date Started",
      content: position[8],
    },
    {
      id: 5,
      key: "Fixed Rate",
      content: position[3],
    },
  ];
//   console.log(position);
  // swap nft details
  const swapNFTDetails = [
    {
      id: 1,
      key: "Total Fixed Deposited:",
      content: position[10][2] + " Dai",
    },
    {
      id: 2,
      key: "Total Variable Deposited:",
      content: position[10][4] + " Dai",
    },
    {
      id: 3,
      key: "Fixed Rate:",
      content: position[3],
    },
    // {
    //   id: 4,
    //   key: "True Variable Rate:",
    //   content: "-.--%",
    // },
    // {
    //   id: 5,
    //   key: "Deposit Week APY:",
    //   content: "-.--%",
    // },
    // {
    //   id: 6,
    //   key: "Total Fixed Gas Fees:",
    //   content: "- Dai",
    // },
    // {
    //   id: 7,
    //   key: "Total Variable Gas Fees:",
    //   content: "- Dai",
    // },
    {
      id: 8,
      key: "My Fixed Deposit:",
      content: (position[2] == "Fixed" ? position[4] : "0 Dai" ),
    },
    {
      id: 9,
      key: "My Variable Deposit:",
      content: (position[2] == "Variable" ? position[4] : "0 Dai"  ),
    },
    // {
    //   id: 10,
    //   key: "My Fixed Gas Fees:",
    //   content: "- Dai",
    // },
    // {
    //   id: 11,
    //   key: "My Variable Gas Fees:",
    //   content: "- Dai",
    // },
  ];

  const claimPayoutC = () => {
    // console.log("Claiming");
    setClaiming(true);
    setClaimingPrinc(false);
    withdraw();
  }
  const claimPrincC = () => {
    // console.log("Claiming");
    setClaimingPrinc(true);
    setClaiming(false);
    setSuccessWith(false);
    withdraw();
  }
  const subclose = () => {
    setClaiming(false);
    setClaimingPrinc(false);
    close();
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, x: "-50%", y: "-50%" }}
      animate={{ opacity: 1, scale: 0.8, x: "-50%", y: "-50%" }}
      exit={{ opacity: 0, scale: 0.8, x: "-50%", y: "-50%" }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-[91%] max-w-[670px] h-[80vh] lg:h-auto overflow-y-auto bg-white drop-shadow-buttonShadow px-4 md:px-10 pt-8 pb-0 rounded-[20px] fixed lg:absolute lg:mt-[14vh] left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 z-50"
    >
      {/* Heading and back button */}
      <div className="w-full flex items-center justify-between md:flex-row flex-col gap-y-4">
        <h2 className="font-bold text-lg md:text-2xl lg:text-[27px] xl:text-2xl">
            Position Info
        </h2>

        <button
          className="text-base lg:text-xl bg-themeColor py-[6px] px-10 rounded-[15px] drop-shadow-buttonShadow hover:-translate-x-2 duration-200"
          onClick={subclose}
        >
          Back
        </button>
      </div>

      {/* content */}
      <div className="w-full mt-4">
        <h3 className="text-lg md:text-xl xl:text-2xl text-black font-extrabold mb-1">
          Details
        </h3>

        <LineBreak />
      </div>

      {/* details data */}
      <div className="w-full mt-4">
        {fixedPDD?.map((item) => {
          const { content, id, key } = item;

          return (
            <div className="flex items-center justify-between mb-4" key={id}>
              {/* Left Side */}
              <div className="w-full pl-3">
                <p className="text-base lg:text-lg font-semibold">{key}</p>
              </div>

              {/* Right Side */}
              <div className="w-full text-center">
                <p className="text-base lg:text-lg font-normal">{content}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* content */}
      <div className="w-full mt-6">
        <h3 className="text-lg md:text-xl xl:text-2xl text-black font-extrabold mb-1">
          Payouts
        </h3>

        <LineBreak />
      </div>


      <div className="w-full flex items-center justify-between gap-8 md:flex-nowrap flex-wrap mt-8">
        {/* left side */}
        {/* <div className="w-full md:w-9/12">
          <FixedEarnPayout portfolio={true} />
        </div> */}
        <div className="flex items-center justify-between">

            <div className="w-full">
                <p className="text-base lg:text-lg font-semibold">Payouts</p>
            </div>
        </div>

        
        <div className="flex items-center justify-between">

            <div className="text-left">
                <p className="text-base px-2 lg:text-lg font-normal">{position[6]+"/"+position[7]}</p>
            </div>
        </div>
        

        {successWith && claiming && !claimingPrinc ? (
            <div className="w-full md:w-3/12">
                <button className="w-6/12 mx-auto md:w-full text-base lg:text-lg bg-green-500 py-[6px] px-2 rounded-full font-semibold">
                    <p>Claimed!</p>
                </button>
            </div>
        ) : (
            <div className="w-full md:w-3/12">
            
            {claiming === true ? (
                <button className="w-6/12 mx-auto md:w-full text-base lg:text-lg bg-gray-300 py-[6px] px-2 rounded-full font-semibold">
                <div className="flex items-center justify-center gap-2">
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    <p>Claiming</p>
                </div>
                </button>
            ) : (
                <div>
                    {position[6] === position[7] ? 
                    (
                        <button className="w-6/12 mx-auto md:w-full text-base lg:text-lg bg-gray-300 py-[6px] px-2 rounded-full font-semibold">
                            Claimed
                        </button>
                    ) : (
                        <button onClick={claimPayoutC} className="w-6/12 mx-auto md:w-full text-base lg:text-lg bg-themeColor py-[6px] px-2 rounded-full font-semibold">
                            Claim
                        </button>
                    )}
                </div>
                
            )}
          
    </div>
        )}
        
        
      </div>
      {/* {position[2] == "Fixed" ? () : (
      )} */}
      {position[2] == "Fixed" ? (
            <div className="w-full flex items-center justify-between gap-8 md:flex-nowrap flex-wrap mt-8">
            
            <div className="flex items-center justify-between">
    
                <div className="w-full">
                    <p className="text-base lg:text-lg font-semibold">Principal</p>
                </div>
            </div>
    
            
            <div className="flex items-center justify-between">
    
                <div className="text-left">
                    <p className="text-base px-2 lg:text-lg font-normal">{position[12] ? "Claimed" : "Unclaimed"}</p>
                </div>
            </div>
            
    
            {successWith && claimingPrinc && !claiming ? (
                <div className="w-full md:w-3/12">
                    <button className="w-6/12 mx-auto md:w-full text-base lg:text-lg bg-green-500 py-[6px] px-2 rounded-full font-semibold">
                        <p>Claimed!</p>
                    </button>
                </div>
            ) : (
                <div className="w-full md:w-3/12">
                
                    {claimingPrinc === true ? (
                        <button className="w-6/12 mx-auto md:w-full text-base lg:text-lg bg-gray-300 py-[6px] px-2 rounded-full font-semibold">
                        <div className="flex items-center justify-center gap-2">
                            <i className="fa-solid fa-spinner fa-spin"></i>
                            <p>Claiming</p>
                        </div>
                        </button>
                    ) : (
                        
                        <div>
                            {position[6] === position[7] && !position[12] ? 
                            (
                                <button onClick={claimPrincC} className="w-6/12 mx-auto md:w-full text-base lg:text-lg bg-themeColor py-[6px] px-2 rounded-full font-semibold">
                                    Claim
                                </button>

                            ) : (
                                <button className="w-6/12 mx-auto md:w-full text-base lg:text-lg bg-gray-300 py-[6px] px-2 rounded-full font-semibold">
                                    Claim
                                </button>
                            )}
                        </div>
                        
                    )}
                    
                </div>
            )}
            
    
    
            {/* right side */}
            
          </div>
        ) : (
            <div>
                
            </div>
        )}


      {/* Swap NFT content */}
      <div className="flex items-center justify-between mt-12">
        <h3 className="text-lg md:text-xl xl:text-2xl text-black font-extrabold mb-1">
          Lila Swap NFT
        </h3>

        <a target="_blank" href={`https://sepolia.etherscan.io/nft/${addresj.lilaposaddr}/${position[11]}`}>
            {addresj.lilaposaddr.slice(0, 10)}...
            <i class="fa fa-external-link" aria-hidden="true"></i>
        </a>
      </div>

      {/* Swap nft details */}
      <div className="w-full mt-3">
        <h3 className="text-lg md:text-xl text-black font-extrabold mb-2">
          Lila Swap Details
        </h3>

        <LineBreak />
      </div>

      {/* swap nft items */}
      <div className="w-full mt-4">
        {swapNFTDetails?.map((item) => {
          const { content, id, key } = item;

          return (
            <div className="flex items-center justify-between mb-4" key={id}>
              {/* Left Side */}
              <div className="w-full">
                <p className="text-base lg:text-lg font-semibold">{key}</p>
              </div>

              {/* Right Side */}
              <div className="w-full text-center">
                <p className="text-base lg:text-lg font-normal">{content}</p>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default PortfolioFixedPositionPopup;
