import { Link } from "react-router-dom";

const MaturedPosition = () => {
  const activePostions = [
    {
      id: 1,
      topBg: "#2774CA",
      title: "USDC",
      deposit: "10000.00",
      parcent: "4.00%",
      earned: "198",
      coinName: "AAVE V3",
      timeline: "Six Months",
      expire: "Jan. 20, 2024",
    },
    {
      id: 2,
      topBg: "#000",
      title: "FRAX",
      deposit: "10000.00",
      parcent: "4.00%",
      earned: "198",
      coinName: "AAVE V3",
      timeline: "Six Months",
      expire: "Jan. 20, 2024",
    },
    {
      id: 3,
      topBg: "#26A17B",
      title: "USDT",
      deposit: "10000.00",
      parcent: "4.00%",
      earned: "198",
      coinName: "AAVE V3",
      timeline: "Six Months",
      expire: "Jan. 20, 2024",
    },
  ];

  return (
    <div className="pt-6 pb-[10vh] lg:pb-[20vh]">
      {/* heading */}
      <div>
        <p className="text-xl 2xl:text-2xl xl:mt-2.5 2xl:mt-3.5">
          Matured Positions
        </p>
      </div>

      {/* Cards */}
      <div className="mt-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {activePostions.map((item) => {
            const {
              coinName,
              deposit,
              expire,
              id,
              earned,
              parcent,
              timeline,
              title,
              topBg,
            } = item;

            return (
              <div
                style={{
                  backgroundColor: `${topBg}`,
                }}
                className="w-full relative select-none"
                key={id}
              >
                {/* Top Part */}
                <div className="w-full px-4 pt-5 pb-2.5">
                  {/* coin name */}
                  <p className={`text-xl xl:text-[25px] text-white`}>{title}</p>

                  {/* deposit */}
                  <p className="text-[13px] md:text-[15px] text-white mt-2.5">
                    {deposit} Deposit
                  </p>

                  {/* parcentage */}
                  <div className="mt-2.5 flex items-start justify-between">
                    {/* parcent */}
                    <p className="text-[13px] md:text-[15px] text-white">
                      {parcent}
                    </p>

                    {/* month */}
                    <p className="text-[13px] md:text-[15px] text-white pt-2.5">
                      {earned} Earned
                    </p>
                  </div>
                </div>

                {/* Bottom Content */}
                <div className="w-full bg-aaveBg pt-9 pb-4 px-4 text-end">
                  {/* coin name */}
                  <h3 className="text-xl text-white">{coinName}</h3>

                  {/* Months */}
                  <p className="text-white text-xs md:text-sm mt-2">
                    {timeline}
                  </p>

                  {/* expired */}
                  <p className="text-white text-xs md:text-sm mt-2">
                    End: {expire}
                  </p>
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-20 z-50"></div>
              </div>
            );
          })}

          <div className="flex items-center justify-center">
            <Link to="/">
              <div className="bg-[#FF1E1E] w-[100px] h-[100px] flex items-center justify-center">
                <p className="text-white">View more</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaturedPosition;
