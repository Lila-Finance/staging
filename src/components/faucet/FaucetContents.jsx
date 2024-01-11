
import { LiaFileContractSolid } from "react-icons/lia";

import { IoWalletOutline } from "react-icons/io5";
import { IoAddCircleOutline } from "react-icons/io5";

import { useState, useContext } from "react";
import address from "../../data/address.json";

const FaucetContents = ({ Faucet, addToWallet, setSelectedAsset, marketContents }) => {  
  return (
    <div>  
      <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-5">
        {marketContents.map((item) => {
          const { bottomCoin, coinName, id, topBg, value, wallet } = item;
            return (
              <div className="w-full h-full cursor-pointer" key={id} 
              onMouseEnter={() => Faucet(coinName.toLowerCase())} 
              >
                {/* top content */}
                <div
                  style={{
                    backgroundColor: `${topBg}`,
                  }}
                  className="w-full pb-6 px-3.5 pt-4"
                >
                  <p
                    className={`text-xl xl:text-[25px] ${
                      id === 1 || id === 3 ? "text-black" : "text-white"
                    }`}
                  >
                    {coinName}
                  </p>
                  <div className={`text-sm md:text-base xl:text-[17px] ${
                      id === 1 || id === 3 ? "text-black" : "text-white"
                    }`}>
                  <p>
                    Testnet Token
                  </p>
                  <div className="flex">
                    <IoAddCircleOutline onClick={() => setSelectedAsset(id)}/>
                    <a href={`https://sepolia.etherscan.io/address/${address.assets[coinName.toLowerCase()]}/`} target="_blank" rel="noopener noreferrer">
                    <LiaFileContractSolid />
                    </a>
                    <IoWalletOutline onClick={() => addToWallet(coinName.toLowerCase())}/>
                    </div>
                  </div>
                  
                </div>

                {/* Bottom Content */}
                <div className="w-full bg-aaveBg pb-3.5 px-3.5 pt-8 text-end">
                  {/* name */}
                  <p className="text-lg xl:text-xl text-white">{"Balance"}</p>
                  {/* value */}
                  <p className="text-sm xl:text-[15px] text-white pt-1.5 roboto">
                    {value}
                  </p>
                </div>
              </div>
            );
        })}
      </div>
    </div>
  );
};

export default FaucetContents;
