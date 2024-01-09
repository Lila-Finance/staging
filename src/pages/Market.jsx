import { useState } from "react";
import InitialContents from "../components/market/InitialContents";
import MonthSelection from "../components/market/MonthSelection";
import DepositContent from "../components/market/DepositContent";
import DepositAmountContent from "../components/market/DepositAmountContent";
import AssetProcotolTopContent from "../components/market/AssetProcotolTopContent";
import Navbar from "../components/primary/Navbar";

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
    if(ni == -1) setDeposit(false);
    if(ni == -1) setFinalize(false);
  };

  // Deposit content
  const [makeDeposit, setMakeDeposit] = useState(false);
  const [enterDeposit, setEnterDeposit] = useState(false);
  const [deposit, setDeposit] = useState(false);
  const [finalize, setFinalize] = useState(false);
  const [amount, setAmount] = useState(BigInt(0));
  const [month, setMontht] = useState(0);

  const showAmountScreen = (month) => {
    setEnterDeposit(true);
    setMontht(month);
    setMonthSelection(false);
  };
  const showDepositScreen = (value) => {
    setEnterDeposit(false);
    setAmount(value);
    setMakeDeposit(true);
  };
  const showDepositValue = () => {
    // setMakeDeposit(false);
    setDeposit(true);
  };
  const showFinalizedScreen = () => {
    // setMakeDeposit(false);
    setDeposit(false);
    setFinalize(true);
  };
  const backFunction = () => {
    if(monthSelection) setSelectedAssetM(-1);
    if(enterDeposit) setSelectedAssetM(selectedAsset); setEnterDeposit(false);
    if(makeDeposit) showAmountScreen(month); setMakeDeposit(false);
  };
  

  return (
    <div className="w-full pb-10">
      <Navbar />
      
      <div className="w-full 2xl:max-w-7xl 3xl:max-w-[1400px] mx-auto px-4 md:px-10 lg:px-16 xl:px-24">
        {/* INitial Content */}
        {<AssetProcotolTopContent boolean={[monthSelection, enterDeposit, makeDeposit, deposit, finalize]} back={backFunction}></AssetProcotolTopContent>}
        
        {<InitialContents selectedAsset={selectedAsset} setSelectedAsset={setSelectedAssetM} />}

        {/* MonthContents */}
        {monthSelection && <MonthSelection selectedAsset={selectedAsset} toggleDeposit={showAmountScreen} setSelectedAsset={setSelectedAssetM} />}

        {/* DepositContent */}
        {enterDeposit && <DepositAmountContent rate={month} toggleDeposit={showDepositScreen} selectedAsset={selectedAsset} setSelectedAsset={setSelectedAssetM}/>}

        {/* DepositContent */}
        {makeDeposit && <DepositContent selectedAsset={selectedAsset} setSelectedAsset={setSelectedAssetM} deposit={deposit} finalize={finalize} setDeposit={showDepositValue} setFinalize={showFinalizedScreen} amount={amount} month={month}/>}
      </div>
    </div>
  );
};

export default Market;
