import { useState } from "react";
import InitialContents from "../components/market/InitialContents";
import MonthSelection from "../components/market/MonthSelection";
import DepositContent from "../components/market/DepositContent";
import DepositAmountContent from "../components/market/DepositAmountContent";
import AssetProcotolTopContent from "../components/market/AssetProcotolTopContent";
import Navbar from "../components/primary/Navbar";
import { ScrollRestoration } from "react-router-dom";

const Market = () => {
  const [initialContent, setInitialContent] = useState(true);

  // Month selection state
  const [monthSelection, setMonthSelection] = useState(false);

  const [selectedAsset, setSelectedAsset] = useState(-1);


  const setSelectedAssetM = (ni) => {
    setSelectedAsset(ni);
    setMonthSelection(ni != -1);
    if(ni == -1) setMakeDeposit(false);
    if(ni == -1) setEnterDeposit(false);
  };

  // Deposit content
  const [makeDeposit, setMakeDeposit] = useState(false);
  const [enterDeposit, setEnterDeposit] = useState(false);

  const showAmountScreen = () => {
    setEnterDeposit(true);
    setMonthSelection(false);
  };
  const showDepositScreen = () => {
    setEnterDeposit(false);
    setMakeDeposit(true);
  };

  return (
    <div className="w-full pb-10">
      <ScrollRestoration />
      <Navbar />
      
      <div className="w-full 2xl:max-w-7xl 3xl:max-w-[1400px] mx-auto px-4 md:px-10 lg:px-16 xl:px-24">
        {/* INitial Content */}
        {<AssetProcotolTopContent></AssetProcotolTopContent>}
        
        {<InitialContents selectedAsset={selectedAsset} setSelectedAsset={setSelectedAssetM} />}

        {/* MonthContents */}
        {monthSelection && <MonthSelection selectedAsset={selectedAsset} toggleDeposit={showAmountScreen} setSelectedAsset={setSelectedAssetM} />}

        {/* DepositContent */}
        {enterDeposit && <DepositAmountContent toggleDeposit={showDepositScreen} selectedAsset={selectedAsset} setSelectedAsset={setSelectedAssetM}/>}

        {/* DepositContent */}
        {makeDeposit && <DepositContent selectedAsset={selectedAsset} setSelectedAsset={setSelectedAssetM} />}
      </div>
    </div>
  );
};

export default Market;
