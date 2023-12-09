import ContentCard from "./ContentCard";

const AaveContentContent = () => {
  // design box array
  const aaveContentDesigns = [
    {
      id: 1,
      bg: "#FFC9C9",
      title: "more",
    },
    {
      id: 2,
      bg: "#FFC9C9",
      title: "more",
    },
    {
      id: 3,
      bg: "#FFC9C9",
      title: "more",
    },
    {
      id: 4,
      bg: "#FFC9C9",
      title: "more",
    },
    {
      id: 5,
      bg: "#FFE3E3",
      title: "coming",
    },
    {
      id: 6,
      bg: "#FFE3E3",
      title: "coming",
    },
    {
      id: 7,
      bg: "#FFE3E3",
      title: "coming",
    },
    {
      id: 8,
      bg: "#FFE3E3",
      title: "coming",
    },
    {
      id: 9,
      bg: "#FFF0F0",
      title: "soon",
    },
    {
      id: 10,
      bg: "#FFF0F0",
      title: "soon",
    },
    {
      id: 11,
      bg: "#FFF0F0",
      title: "soon",
    },
    {
      id: 12,
      bg: "#FFF0F0",
      title: "soon",
    },
  ];

  return (
    <div className="">
      {/* wrapper start */}
      <div className="flex items-center md:items-start md:justify-between justify-center gap-4 pt-4 2xl:pt-7 md:flex-row flex-col">
        {/* left side */}
        <div className="">
          {/* heading */}
          <div className="-mt-11 pb-4 lg:pb-7">
            <h2 className="text-xl lg:text-2xl 2xl:text-3xl">
              Lila Integrated Protocols
            </h2>
          </div>

          {/* Card */}
          <ContentCard
            bg="#B6509E"
            title={"AAVE V3"}
            descOne={
              "“AAVE” is a Finnish word for “ghost” in English, nodding to their focus on creating a transparent, open source infrastructure for DeFi. But nothing is transparent about its success. Launched in 2022, AAVE V3 reigns as the largest lending protocol on chain holding over 3 billion USD of AUM."
            }
            descTwo={
              "Due to the additions of cross-chain transactions, improvements in borrowing efficiency, 20-25% decrease in gas costs, and an array of risk management tools, AAVE has become synonymous with the industry standard of DeFi. "
            }
          />
        </div>

        {/* Right side */}
        <div className="w-full md:w-auto grid grid-cols-4 gap-1 md:gap-5 lg:gap-[26px]">
          {aaveContentDesigns?.map((item) => (
            <div
              key={item.id}
              className="w-full md:w-[100px] h-16 md:h-[100px] flex items-center justify-center"
              style={{
                backgroundColor: `${item.bg}`,
              }}
            >
              <p className="text-sm md:text-base text-black">{item.title}</p>
            </div>
          ))}
        </div>
      </div>
      {/* wrapper end */}
    </div>
  );
};

export default AaveContentContent;
