const Assets = () => {
  // asset data
  const assetData = [
    {
      id: 1,
      title: "USDC",
      desc: "Managed by the consortium Circle, USDC is lauded for its full backing by reserve assets, enabling secure and liquid digital asset transactions, underpinning USDC's role as a trusted stablecoin of choice.",
      bg: "#2774CA",
      link: "https://www.circle.com/en/usdc"
    },
    {
      id: 2,
      title: "DAI",
      desc: "DAI is a decentralized stablecoin backed by crypto assets and governed by MakerDAO.",
      bg: "#F4B731",
      link: "https://makerdao.com/en/"
    },
    {
      id: 3,
      title: "USDT",
      desc: "Tether (USDT) is a widely-used stablecoin issued by Tether Limited, backed by fiat currency reserves, offering a bridge between traditional finance and the cryptocurrency market with its dollar-pegged value.",
      bg: "#26A17B",
      link: "https://tether.to/en/"
    },
    {
      id: 4,
      title: "Frax",
      desc: "Frax is a stablecoin blending decentralized collateralization with algorithmic mechanisms, issued by Frax Finance, aiming to create a scalable and stable digital currency adaptable to the dynamic crypto environment.",
      bg: "#000",
      link: "https://frax.finance/"
    },
    {
      id: 5,
      title: "ETH",
      desc: "Ethereum (ETH) is the first-of-it’s-kind blockchain platform known for its native cryptocurrency, ETH, which powers a vast ecosystem of decentralized applications, smart contracts, and new financial protocols.",
      bg: "#48CBD9",
      link: "https://ethereum.org/en/"
    },
    {
      id: 6,
      title: "wBTC",
      desc: "Wrapped Bitcoin (WBTC) is a tokenized version of Bitcoin on the Ethereum blockchain, offering Bitcoin's value with Ethereum's smart contract capabilities.",
      bg: "#F09242",
      link: "https://wbtc.network/"
    },
    {
      id: 7,
      title: "USDC.e",
      desc: "USDC.e is the bridged blockchain version of USDC, offering the same stablecoin benefits with enhanced transaction speed and efficiency on a variety of different blockchain ecosystems.",
      bg: "#2774CA",
      link: "https://www.circle.com/en/usdc"
    }
  ];
  

  return (
    <div className="pb-20">
      {/* heading */}
      <div>
        <h2 className="text-3xl">Lila Asset Suite</h2>
      </div>

      {/* Content Start */}
      <div className="w-full">
        {/* Top part */}
        <div className="w-full grid md:grid-cols-3 lg:grid-cols-5 gap-5 mt-7">
          {assetData?.map((item) => {
            const { bg, desc, id, title, link } = item;

            return (
              
              <div
                style={{
                  backgroundColor: `${bg}`,
                }}
                className="w-full py-5 px-3"
                key={id}
              >
                <a href={link} target="_blank" rel="noopener noreferrer">
                {/* heading */}
                <h1
                  className={`text-2xl md:text-3xl xl:text-[34px] 2xl:text-4xl ${
                    id === 2 || id === 6 ? "text-black" : "text-white"
                  }`}
                >
                  {title}
                </h1>

                {/* Content 1 */}
                <div className="mt-3">
                  <p
                    className={`text-[10px] ${
                      id === 2 || id === 6 ? "text-black" : "text-white"
                    }`}
                  >
                    {desc}
                  </p>
                </div>
                </a>
              </div>
            );
          })}
          <div className="md:col-span-2 lg:col-span-3 flex items-center justify-center gap-8 md:gap-[65px]">
            <div className="bg-[#FF1E1E] w-full h-16 md:w-[100px] md:h-[100px] flex items-center justify-center">
              <p className="text-sm md:text-base text-white">more</p>
            </div>

            <div className="bg-[#FF6060] w-full h-16 md:w-[100px] md:h-[100px] flex items-center justify-center">
              <p className="text-sm md:text-base text-white">coming</p>
            </div>

            <div className="bg-[#FF7C7C] w-full h-16 md:w-[100px] md:h-[100px] flex items-center justify-center">
              <p className="text-sm md:text-base text-white">soon</p>
            </div>
          </div>
        </div>
      </div>
      {/* Content End */}
    </div>
  );
};

export default Assets;
