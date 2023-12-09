const Banner = () => {
  // design box array
  const bannerDesigns = [
    {
      id: 1,
      bg: "#FFF0F0",
    },
    {
      id: 2,
      bg: "#FFE3E3",
    },
    {
      id: 3,
      bg: "#FFC9C9",
    },
    {
      id: 4,
      bg: "#FF7C7C",
    },
    {
      id: 5,
      bg: "#FF6060",
    },
    {
      id: 6,
      bg: "#FF1E1E",
    },
    {
      id: 7,
      bg: "#fff",
    },
    {
      id: 8,
      bg: "#FFF0F0",
    },
    {
      id: 9,
      bg: "#FFE3E3",
    },
    {
      id: 10,
      bg: "#FFC9C9",
    },
    {
      id: 11,
      bg: "#FF7C7C",
    },
    {
      id: 12,
      bg: "#FF6060",
    },
    {
      id: 13,
      bg: "#fff",
    },
    {
      id: 14,
      bg: "#fff",
    },
    {
      id: 15,
      bg: "#FFF0F0",
    },
    {
      id: 16,
      bg: "#FFE3E3",
    },
    {
      id: 17,
      bg: "#FFC9C9",
    },
    {
      id: 18,
      bg: "#FF7C7C",
    },
  ];

  return (
    <div className="pb-14">
      {/* Wrapper start */}
      <div className="flex md:items-end justify-center md:flex-row flex-col">
        {/* left side */}
        <div className="w-full lg:w-[320px] 3xl:w-[400px] pb-7 md:pb-[52px]">
          <p className="xl:text-lg 2xl:text-xl">
            Lila Finance Interest Rate Swaps
          </p>
          <p className="text-xl 2xl:text-2xl xl:mt-2.5 2xl:mt-3.5">
            Earn Fixed Income
          </p>
        </div>

        {/* right side */}
        <div className="w-full lg:w-[980px] 3xl:w-[1000px] grid grid-cols-6 gap-1 md:gap-5 lg:gap-[26px]">
          {bannerDesigns?.map((item) => (
            <div
              style={{
                backgroundColor: `${item.bg}`,
              }}
              className={`h-[100px]`}
              key={item.id}
            ></div>
          ))}
        </div>
      </div>
      {/* Wrapper end */}
    </div>
  );
};

export default Banner;
