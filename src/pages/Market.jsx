import { useState } from "react";
import Navbar from "../components/Navbar";
import Popup from "../components/Popup";
import Overlay from "../components/Overlay";

const Market = ({ nextPageRef }) => {
  //   maturity data
  const maturityDuration = ["1", "3", "5"];

  const [activeMaturity, setActiveMaturity] = useState(0);

  const assetData = ["All", "USDT", "DAI", "USDC"];
  const [selectedAsset, setselectedAsset] = useState("All");

  const [showDropdown, setShowDropdown] = useState(false);

  const tableData = [
    {
      id: 1,
      asset: "USDC",
      protocol: "AAA",
      apy: "5.00%",
    },
    {
      id: 2,
      asset: "USDC",
      protocol: "AAA",
      apy: "5.00%",
    },
    {
      id: 3,
      asset: "USDC",
      protocol: "AAA",
      apy: "5.00%",
    },
    {
      id: 4,
      asset: "USDC",
      protocol: "AAA",
      apy: "5.00%",
    },
    {
      id: 5,
      asset: "USDC",
      protocol: "AAA",
      apy: "5.00%",
    },
  ];

  const pagination = ["1", "2", "3"];
  const [activePagination, setActivePagination] = useState(0);

  // popup
  const [showPopup, setShowPopup] = useState(false);

  const openPopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div
      ref={nextPageRef}
      className="relative bg-primaryBg min-h-screen lg:pb-0 pb-20"
    >
        <Navbar/>
      <div className="container mx-auto w-11/12">
        <div className="mt-8">
            <p className="text-center text-2xl md:text-4xl text-white font-bold">
                Lila Markets
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
                      activeMaturity === idx ? "bg-primaryColor" : ""
                    } w-8 h-8 rounded-full flex items-center justify-center cursor-pointer`}
                    onClick={() => setActiveMaturity(idx)}
                  >
                    <p
                      className={` ${
                        activeMaturity === idx ? "text-primaryBg" : "text-white"
                      } text-sm`}
                    >
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
                }  rounded-[20px] mt-3 relative py-2 overflow-hidden duration-300 cursor-pointer`}
              >
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
                        className="text-m text-primaryBg font-medium text-center cursor-pointer mb-1"
                    >
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
                    className="cursor-pointer"
                  />
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
                <img src="./images/header-arrow.svg" alt="" />
              </div>

              <div className="w-4/12 flex items-center justify-center gap-2">
                <p className="text-m text-white font-bold">Protocol</p>
                <img src="./images/header-arrow.svg" alt="" />
              </div>

              <div className="w-4/12 flex items-center justify-end gap-2 px-5">
                <p className="text-m text-white font-bold">APY</p>
                <img src="./images/header-arrow.svg" alt="" />
              </div>

              <div className="w-4/12 flex items-center justify-end gap-2 px-5">
                <p className="text-m text-white font-bold">Maturity</p>
                <img src="./images/header-arrow.svg" alt="" />
              </div>

              <div className="w-4/12 flex items-center justify-end gap-2 px-5">
                <p className="text-m text-white font-bold">TVL</p>
                <img src="./images/header-arrow.svg" alt="" />
              </div>
            </div>

            {/* contetn */}
            <div>
              {tableData?.map((item, idx) => {
                const { apy, asset, id, protocol } = item;

                return (
                  <div
                    onClick={openPopup}
                    key={id}
                    className={`w-full flex items-center justify-between py-5 mb-1 ${
                      idx === tableData.length - 1
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
                      <p className="text-sm text-white font-medium">{apy}</p>
                    </div>

                    <div className="w-4/12 flex items-center justify-end gap-2 px-5">
                      <p className="text-sm text-white font-medium">{apy}</p>
                    </div>

                    <div className="w-4/12 flex items-center justify-end gap-2 px-5">
                      <p className="text-sm text-white font-medium">{apy}</p>
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

            {showPopup === true ? <Overlay closeFunc={closePopup} /> : null}
            <Popup showPopup={showPopup} />
          </div>
        </div>
      </div>
      <div className="w-full h-[55px] bg-primaryColor mt-10"></div>
      <div className="w-full h-[55px]"></div>
    </div>
  );
};

export default Market;
