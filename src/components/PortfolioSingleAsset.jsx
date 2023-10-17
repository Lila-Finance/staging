import { useState } from "react";
import BlackOverlay from "./popups/BlackOverlay";
import PortfolioFixedPositionPopup from "./popups/PortfolioFixedPositionPopup";
import { AnimatePresence } from "framer-motion";

const PortfolioSingleAsset = ({positions, selected_position, setselected_position, withdraw, UpdatePositions, getCorrectPosition}) => {
  // first table data
  const firstTableHeading = [
    {
      id: 0,
      title: "Pool Address",
    },
    {
      id: 1,
      title: "Pool Status",
    },
    {
      id: 2,
      title: "Type",
    },
    {
      id: 3,
      title: "Fixed APY",
    },
    {
      id: 4,
      title: "Supplied",
    },
    {
      id: 5,
      title: "Claimed",
    },
    {
      id: 6,
      title: "Claimed Payouts",
    },
    {
      id: 7,
      title: "Start Date",
    },
    {
      id: 8,
      title: "Expiration",
    },
  ];

  // first table datas

  // Toggle Popup
  const [showFixedPositionPopup, setShowFixedPositionPopup] = useState(false);
  

  const openPositionPopup = (index) => {
    setselected_position(index);
    setShowFixedPositionPopup(true);
  };

  const closePositionPopup = () => {
    setShowFixedPositionPopup(false);
  };

  return (
    <div className="w-full">
      {/* heading */}
      <h1 className="text-3xl lg:text-4xl 2xl:text-5xl mt-4">
        Single Asset Protocols
      </h1>


      {/* content wrapper */}
      <div className="w-full flex items-center justify-between lg:flex-nowrap flex-wrap gap-12 2xl:gap-[70px] mt-14">
        {/* left side */}
        <div className="w-full h-[320px] overflow-y-auto bg-white border-2 border-themeColor px-2">

          {/* Table */}
            <table className="w-full">
              <thead className="sticky top-0 bg-white z-0">
                <tr key={-1} className="w-full">
                    {firstTableHeading?.map((item, idx) => (
                        <td
                        key={item.id}
                        className={`text-base xl:text-lg font-medium py-2 ${
                            idx === 0 ? "text-start pl-4" : "text-center"
                        }`}
                        >
                        {item.title}
                        </td>
                    ))}
                    </tr>
              </thead>
              <tbody>
                

                {positions?.map((pool) => (
                    <tr
                        onClick={() => openPositionPopup(pool[11])}
                        key={pool[11]}  // you might want to use a unique identifier from the pool object as the key
                        className="bg-white hover:drop-shadow-buttonShadow duration-200 cursor-pointer"
                    >

                    <td className="text-start py-3 pl-4">
                        <a target="_blank" href={`https://sepolia.etherscan.io/address/${pool[0]}`}>
                            {pool[0].slice(0, 10)}...
                            <i className="fa fa-external-link" aria-hidden="true"></i>
                        </a>
                    </td>
                    <td className="text-start py-3 pl-4">{pool[1]}</td>
                    <td className="text-center py-3 pl-4">{pool[2]}</td>
                    <td className="text-center py-3 pl-4">{pool[3]}</td>
                    <td className="text-center py-3 pl-4">{pool[4]}</td>
                    <td className="text-center py-3 pl-4">{pool[5]}</td>
                    <td className="text-center py-3 pl-4">{pool[6]+"/"+pool[7]}</td>
                    <td className="text-center py-3 pl-4">{pool[8]=="01-01-1970" ? "Not Started" : pool[8]}</td>
                    <td className="text-center py-3 pl-4">{pool[9]=="01-01-1970" ? "Not Started" : pool[9]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </div>

      <AnimatePresence initial={false}>
        {showFixedPositionPopup === true ? (
          <>
            <BlackOverlay close={closePositionPopup} />
            <PortfolioFixedPositionPopup close={closePositionPopup} position={getCorrectPosition(selected_position)} withdraw={withdraw} UpdatePositions={UpdatePositions}/>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default PortfolioSingleAsset;
