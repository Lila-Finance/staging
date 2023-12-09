import ContentCard from "./ContentCard";

const ArbitrumOneContent = () => {
  // design box array
  const arbitrumOneDesigns = [
    {
      id: 1,
      bg: "#FF1E1E",
      title: "more",
    },
    {
      id: 2,
      bg: "#FF1E1E",
      title: "more",
    },
    {
      id: 3,
      bg: "#FF1E1E",
      title: "more",
    },
    {
      id: 4,
      bg: "#FF1E1E",
      title: "more",
    },
    {
      id: 5,
      bg: "#FF6060",
      title: "coming",
    },
    {
      id: 6,
      bg: "#FF6060",
      title: "coming",
    },
    {
      id: 7,
      bg: "#FF6060",
      title: "coming",
    },
    {
      id: 8,
      bg: "#FF6060",
      title: "coming",
    },
    {
      id: 9,
      bg: "#FF7C7C",
      title: "soon",
    },
    {
      id: 10,
      bg: "#FF7C7C",
      title: "soon",
    },
    {
      id: 11,
      bg: "#FF7C7C",
      title: "soon",
    },
    {
      id: 12,
      bg: "#FF7C7C",
      title: "soon",
    },
  ];

  return (
    <div className="pb-20 md:pb-2">
      {/* heading */}
      <div>
        <h2 className="text-xl lg:text-2xl 2xl:text-3xl">
          Lila Chain Deployments
        </h2>
      </div>

      {/* wrapper start */}
      <div className="flex items-center md:items-start md:justify-between justify-center gap-4 pt-4 2xl:pt-7 md:flex-row flex-col">
        {/* left side */}
        <div className="md:mx-0 mx-auto">
          {/* Card */}
          <ContentCard
            bg={"rgba(27, 74, 221, 0.87)"}
            title={"Arbitrum One"}
            descOne={
              "Arbitrum One has established itself as a pivotal layer-2 scaling solution for Ethereum, enabling faster and cheaper transactions while maintaining a high level of security. Since its launch in 2021, it has attracted a significant number of projects and has locked in over 2 billion USD in total value. "
            }
            descTwo={
              "Its innovative optimization technology has made it possible to reduce gas fees by up to 45%, enhancing transaction throughput without compromising the decentralized nature of the blockchain, solidifying its position as a cornerstone of the Ethereum scaling solutions."
            }
          />
        </div>

        {/* Right side */}
        <div className="w-full md:w-auto grid grid-cols-4 gap-1 md:gap-5 lg:gap-[26px]">
          {arbitrumOneDesigns?.map((item) => (
            <div
              key={item.id}
              className="w-full md:w-[100px] h-16 md:h-[100px] flex items-center justify-center"
              style={{
                backgroundColor: `${item.bg}`,
              }}
            >
              <p className="text-sm md:text-base text-white">{item.title}</p>
            </div>
          ))}
        </div>
      </div>
      {/* wrapper end */}
    </div>
  );
};

export default ArbitrumOneContent;
