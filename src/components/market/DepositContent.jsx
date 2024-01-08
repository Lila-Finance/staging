import { NavLink } from "react-router-dom";
import { useState, useContext } from "react";
import { MarketDataContext } from '../../constants/MarketDataProvider';
import { signTypedData } from '@wagmi/core'

import address from "../../data/address.json";

import IERC20Permit from "../../abi/IERC20Permit.json";
import { ExchangeRateContext } from "../../helpers/Converter";

import {useContractWrite, useContractEvent} from "wagmi";

import ILilaPoolsProvider from "../../abi/ILilaPoolsProvider.json";

const DepositContent = ({ selectedAsset, setSelectedAsset, deposit, setDeposit, setFinalize, finalize, amount, month }) => {
  const { marketContents } = useContext(MarketDataContext);
  let globitem = selectedAsset == -1 ? undefined : marketContents.filter(item => item.id == selectedAsset);
  const { bottomCoin, coinName, id, topBg, value, wallet, pool_index } = globitem[0];
  const { publicClient, userAddress, FivDecBigIntToFull } = useContext(ExchangeRateContext);

  const [done, setDone] = useState(false);
  const [depositArgs, setDepositArgs] = useState([]);
  const [depositLoading, setDepositLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(1); // state to force re-render

  const { write: depositContractR } = useContractWrite({
        address: address.core.poolprovider_address,
        abi: ILilaPoolsProvider.abi,
        functionName: "deposit",
        args: depositArgs,
    });
  const depositContract = async () => {
    setDepositLoading(true);
    depositContractR();
  }
    
  const allowAmount = async () => {

    if(userAddress == undefined || publicClient == undefined){
      return;
    }
      const expiry = Math.trunc((Date.now() + 300 * 1000) / 1000)
      
      const nonce = (await publicClient.readContract({
          address: address.assets[coinName.toLowerCase()],
          abi: IERC20Permit.abi,
          functionName: "nonces",
          args: [userAddress],
        })).toString();
      
      const correct_amount = FivDecBigIntToFull(amount, coinName.toLowerCase()); //TODO based on asset correct amount of zeros added
      
      const message = {
          owner: userAddress,
          spender: address.core.poolprovider_address,
          value: correct_amount,
          nonce: nonce,
          deadline: expiry
      };
      const types = {
          EIP712Domain: [
          {
              name: "name",
              type: "string",
          },
          {
              name: "version",
              type: "string",
          },
          {
              name: "chainId",
              type: "uint256",
          },
          {
              name: "verifyingContract",
              type: "address",
          },
          ],
          Permit: [
          { //Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline
              name: "owner",
              type: "address",
          },
          {
              name: "spender",
              type: "address",
          },
          {
              name: "value",
              type: "uint256",
          },
          {
              name: "nonce",
              type: "uint256",
          },
          {
              name: "deadline",
              type: "uint256",
          }
          ],
      };
      
      const domain = {
          name: coinName.toUpperCase(),
          version: "1",
          chainId: 11155111,
          verifyingContract: address.assets[coinName.toLowerCase()],
      };

      const signature = await signTypedData({
          domain,
          message,
          primaryType: 'Permit',
          types,
      });
  
      const r = signature.substring(0, 66);
      const s = "0x" + signature.substring(66, 130);
      const v = Number("0x" + signature.substring(130, 132));
      
      setDepositArgs([correct_amount, pool_index[month], expiry, v, r, s]);
      setDeposit();
  }

  useContractEvent({
    address: address.core.poolprovider_address,
    abi: ILilaPoolsProvider.abi,
    eventName: 'Deposit',
    listener(log) {
        if(!!log && !!log[0] && !!log[0].args && log[0].args["owner"] == userAddress){
          setDone(true);
          setDepositLoading(false);
          setFinalize();
        }
    },
    });




  return (
    <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-5 items-end">
      <div className="w-full cursor-pointer w-full min-h-[192px] min-w-[233.59px]" onClick={() => setSelectedAsset(-1)} key={0}>
                {/* top content */}
                <div
                    style={{backgroundColor: `${topBg}`}}
                    className="bg-aaveBg w-full pb-6 px-3.5 pt-4"
                >
                    <p
                    className={`text-xl xl:text-[25px] ${
                        id === 3 || id === 7 ? "text-black" : "text-white"
                    }`}
                    >
                    {coinName}
                    </p>

                    <p
                    className={`text-sm md:text-base xl:text-[17px] ${
                        id === 3 || id === 7 ? "text-black" : "text-white"
                    }`}
                    >
                    {wallet}
                    </p>
                </div>

                {/* Bottom Content */}
                <div className="w-full bg-aaveBg pb-3.5 px-3.5 pt-8 text-end">
                    {/* name */}
                    <p className="text-lg xl:text-xl text-white">{bottomCoin}</p>
                    {/* value */}
                    <p className="text-sm xl:text-[15px] text-white pt-1.5 roboto">
                    {value}
                    </p>
                </div>
            </div>

      {/* Allow */}
      <div 
      onClick={() => !done && allowAmount()}
      className={`w-full ${(!deposit && !finalize) ? "bg-[#FFC9C9]" : "bg-depositBg"} px-3.5 h-[105px] flex items-center justify-end cursor-pointer`}>
        <p className="text-lg xl:text-xl text-black">Allow</p>
      </div>

      {/* Deposit */}
      <div 
      onClick={() => !done && depositContract()}
      className={`w-full ${(deposit && !finalize) ? "bg-[#FFC9C9]" : "bg-depositBg"} px-3.5 h-[105px] flex items-center justify-end cursor-pointer z-10`}>
        <p className="text-lg xl:text-xl text-black">Deposit</p>
      </div>

      {finalize &&
      <NavLink to={"/portfolio"}>
        <div 
        className={`w-full bg-[#FFC9C9] px-3.5 h-[105px] flex items-center justify-end cursor-pointer`}>
          <p className="text-lg xl:text-xl text-black">Portfolio</p>
        </div>
      </NavLink>
      }

      { depositLoading && 
      <div 
      key={animationKey}
      className={`w-full bg-[#f6f6f6] px-3.5 h-[105px] flex items-center justify-end cursor-pointer animate-loadingslideIn z-0`}
      onAnimationEnd={() => setAnimationKey(animationKey+1)}>
      </div>
      }
      
    </div>
  );
};

export default DepositContent;
