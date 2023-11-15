import Navbar from "../components/Navbar";
import { useState } from "react";

const Portfolio = () => {
  const dataTableHeading = ["Asset", "Protocol", "APY", "Maturity", "Principal"];

  const tableRowData = [
    {
      id: 1,
      asset: "USDC",
      protocol: "AAA",
      apy: "5.00%",
      maturity: "08/28/23",
      principal: "23 000",
    },
    {
      id: 2,
      asset: "USDC",
      protocol: "AAA",
      apy: "5.00%",
      maturity: "08/28/23",
      principal: "23 000",
    },
    {
        id: 7,
        asset: "USDC",
        protocol: "AAA",
        apy: "5.00%",
        maturity: "08/28/23",
        principal: "23 000",
      },
      {
        id: 8,
        asset: "USDC",
        protocol: "AAA",
        apy: "5.00%",
        maturity: "08/28/23",
        principal: "23 000",
      },
    {
      id: 3,
      asset: "USDC",
      protocol: "AAA",
      apy: "5.00%",
      maturity: "08/28/23",
      principal: "23 000",
    },
    {
      id: 4,
      asset: "USDC",
      protocol: "AAA",
      apy: "5.00%",
      maturity: "08/28/23",
      principal: "23 000",
    },
    {
        id: 5,
        asset: "USDC",
        protocol: "AAA",
        apy: "5.00%",
        maturity: "08/28/23",
        principal: "23 000",
      },
      {
        id: 6,
        asset: "USDC",
        protocol: "AAA",
        apy: "5.00%",
        maturity: "08/28/23",
        principal: "23 000",
      },
  ];
  const [network, setNetwork] = useState("None");
  return (
    <div className="min-h-screen bg-primaryBg relative">
      <Navbar setNetwork={setNetwork} />
      <div className="container mx-auto w-11/12">


        {/* heading */}
        <div className="mt-12">
          <p className="text-center text-xl md:text-3xl text-white">
            Unclaimed Balance
          </p>

          <div className="flex items-center justify-center gap-10 md:gap-[70px] mt-8">
            <p className="text-center text-lg md:text-xl lg:text-2xl text-white">
              10.00 DAI
            </p>
            <p className="text-center text-lg md:text-xl lg:text-2xl text-white">
              10.00 USDC
            </p>
            <p className="text-center text-lg md:text-xl lg:text-2xl text-white">
              1.00 Weth
            </p>
          </div>

          <div className="text-center mt-7">
            <button className="bg-primaryColor text-lg font-medium px-12 py-2 rounded-[30px] hover:-translate-x-2 duration-200">
              Allow
            </button>
          </div>
        </div>

        {/* data table */}
        <div className="w-[95%] max-w-[900px] mx-auto mt-20 lg:mt-32 lg:pb-0 pb-36">
          {/* heading */}
          <div className="w-full flex items-center justify-between pb-4 
                        border-b-[4px] border-b-primaryColor overflow-x-auto">
          {/* <div className="sticky top-0 z-10 w-full flex items-center justify-between 
                pb-4 border-b-[4px] border-b-primaryColor bg-primaryBg"> */}

            {dataTableHeading?.map((item, idx) => (
              <div
                key={idx}
                className={`min-w-[140px] lg:w-[20%] flex items-center gap-2 px-5 ${
                  idx === 0
                    ? "justify-start"
                    : idx === dataTableHeading.length - 1
                    ? "justify-end"
                    : "justify-center"
                }`}
              >
                <p className="text-lg text-white font-bold">{item}</p>
                <img src="./images/header-arrow.svg" alt="" />
              </div>
            ))}
          </div>

          {/* data row */}
          <div className="w-full">
            {tableRowData?.map((item, idx) => {
              const { apy, asset, id, protocol, maturity, principal } = item;

              return (
                <div
                  key={id}
                  className={`w-full flex items-center justify-between py-5 mb-1 ${
                    idx === tableRowData.length - 1
                      ? ""
                      : "border-b border-b-primaryColor"
                  }  cursor-pointer hover:shadow-rowShadow duration-200`}
                >
                  <div className="min-w-[140px] lg:w-[20%] flex items-center justify-start gap-2 px-5">
                    <p className="text-lg text-white font-medium">{asset}</p>
                  </div>

                  <div className="min-w-[140px] lg:w-[20%] flex items-center justify-center gap-2">
                    <p className="text-lg text-white font-medium">{protocol}</p>
                  </div>

                  <div className="min-w-[140px] lg:w-[20%] flex items-center justify-center gap-2 px-5">
                    <p className="text-lg text-white font-medium">{apy}</p>
                  </div>

                  <div className="min-w-[140px] lg:w-[20%] flex items-center justify-center gap-2 px-5">
                    <p className="text-lg text-white font-medium">{maturity}</p>
                  </div>

                  <div className="min-w-[140px] lg:w-[20%] flex items-center justify-end gap-2 px-5">
                    <p className="text-lg text-white font-medium">
                      {principal}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="w-full h-[55px] bg-primaryColor mt-10"></div>
      <div className="w-full h-[55px]"></div>
    </div>
  );
};

export default Portfolio;
