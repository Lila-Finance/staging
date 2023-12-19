import { NavLink } from "react-router-dom";
import { useState, useContext } from "react";
import { MarketDataContext } from '../../constants/MarketDataProvider';
        
const DepositContent = ({ selectedAsset, setSelectedAsset, deposit, setDeposit, setFinalize, finalize }) => {
  const { marketContents } = useContext(MarketDataContext);
  let globitem = selectedAsset == -1 ? undefined : marketContents.filter(item => item.id == selectedAsset);
  const { bottomCoin, coinName, id, topBg, value, wallet } = globitem[0];

  return (
    <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-5 items-end">
      <div className="w-full cursor-pointer w-full min-h-[192px] min-w-[233.59px] border-2" onClick={() => setSelectedAsset(-1)} key={10}>
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
      onClick={() => setDeposit()}
      className={`w-full ${(!deposit && !finalize) ? "bg-[#FFC9C9]" : "bg-depositBg"} px-3.5 h-[105px] flex items-center justify-end cursor-pointer`}>
        <p className="text-lg xl:text-xl text-black">Allow</p>
      </div>

      {/* Deposit */}
      <div 
      onClick={() => setFinalize()}
      className={`w-full ${(deposit && !finalize) ? "bg-[#FFC9C9]" : "bg-depositBg"} px-3.5 h-[105px] flex items-center justify-end cursor-pointer`}>
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
    </div>
  );
};

export default DepositContent;
