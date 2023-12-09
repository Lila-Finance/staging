const InitialContents = ({ toggleMonth }) => {
  // Data
  const marketContents = [
    {
      id: 1,
      coinName: "USDC",
      wallet: "a.bc% - x.yz%",
      topBg: "#2774CA",
      bottomCoin: "AAVE V3",
      value: "0000.000000000",
    },
    {
      id: 2,
      coinName: "USDC.e",
      wallet: "a.bc% - x.yz%",
      topBg: "#2774CA",
      bottomCoin: "AAVE V3",
      value: "0000.000000000",
    },
    {
      id: 3,
      coinName: "DAI",
      wallet: "a.bc% - x.yz%",
      topBg: "#F4B731",
      bottomCoin: "AAVE V3",
      value: "0000.000000000",
    },
    {
      id: 4,
      coinName: "USDT",
      wallet: "a.bc% - x.yz%",
      topBg: "#26A17B",
      bottomCoin: "AAVE V3",
      value: "0000.000000000",
    },
    {
      id: 5,
      coinName: "Frax",
      wallet: "a.bc% - x.yz%",
      topBg: "#000",
      bottomCoin: "AAVE V3",
      value: "0000.000000000",
    },
    {
      id: 6,
      coinName: "ETH",
      wallet: "a.bc% - x.yz%",
      topBg: "#48CBD9",
      bottomCoin: "AAVE V3",
      value: "0000.000000000",
    },
    {
      id: 7,
      coinName: "wBTC",
      wallet: "a.bc% - x.yz%",
      topBg: "#F09242",
      bottomCoin: "AAVE V3",
      value: "0000.000000000",
    },
  ];

  return (
    <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-5">
      {marketContents.map((item) => {
        const { bottomCoin, coinName, id, topBg, value, wallet } = item;

        return (
          <div className="w-full cursor-pointer" key={id} onClick={toggleMonth}>
            {/* top content */}
            <div
              style={{
                backgroundColor: `${topBg}`,
              }}
              className="w-full pb-6 px-3.5 pt-4"
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
        );
      })}
    </div>
  );
};

export default InitialContents;
