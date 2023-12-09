import { useState } from "react";
import InitialContents from "../components/market/InitialContents";
import MonthSelection from "../components/market/MonthSelection";
import DepositContent from "../components/market/DepositContent";
import Navbar from "../components/primary/Navbar";
import { ScrollRestoration } from "react-router-dom";

const Market = () => {
  const [initialContent, setInitialContent] = useState(true);

  // Month selection state
  const [monthSelection, setMonthSelection] = useState(false);

  const showMonthSelection = () => {
    setMonthSelection(true);
    setInitialContent(false);
  };

  // Deposit content
  const [makeDeposit, setMakeDeposit] = useState(false);

  const showDepositScreen = () => {
    setMakeDeposit(true);
    setMonthSelection(false);
    setInitialContent(false);
  };

  return (
    <div className="w-full pb-10">
      <ScrollRestoration />
      <Navbar />
      <div className="w-full 2xl:max-w-7xl 3xl:max-w-[1400px] mx-auto px-4 md:px-10 lg:px-16 xl:px-24">
        {/* INitial Content */}
        {initialContent && <InitialContents toggleMonth={showMonthSelection} />}

        {/* MonthContents */}
        {monthSelection && <MonthSelection toggleDeposit={showDepositScreen} />}

        {/* DepositContent */}
        {makeDeposit && <DepositContent />}
      </div>
    </div>
  );
};

export default Market;
