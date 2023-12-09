const MonthSelection = ({ toggleDeposit }) => {
  // data
  const months = [
    {
      id: 1,
      title: "One Month",
      content: "a.bc%",
    },
    {
      id: 2,
      title: "Two Months",
      content: "xy.z%",
    },
    {
      id: 3,
      title: "Six Months",
      content: "ij.k%",
    },
  ];

  return (
    <div className="grid md:grid-cols-4 lg:grid-cols-5 gap-5 items-end">
      <div className="w-full cursor-pointer">
        {/* top content */}
        <div className="w-full pb-6 px-3.5 pt-4 bg-[#2774CA]">
          <p className={`text-xl xl:text-[25px] text-white`}>USDC</p>

          <p className={`text-sm md:text-base xl:text-[17px] text-white`}>
            a.bc% - x.yz%
          </p>
        </div>

        {/* Bottom Content */}
        <div className="w-full bg-aaveBg pb-3.5 px-3.5 pt-8 text-end">
          {/* name */}
          <p className="text-lg xl:text-xl text-white">AAVE V3</p>
          {/* value */}
          <p className="text-sm xl:text-[15px] text-white pt-1.5 roboto">
            0000.000000000
          </p>
        </div>
      </div>

      {months?.map((item) => {
        const { content, id, title } = item;

        return (
          <div
            className="w-full bg-aaveBg pb-3.5 px-3.5 pt-8 text-end cursor-pointer"
            key={id}
            onClick={toggleDeposit}
          >
            {/* name */}
            <p className="text-lg xl:text-xl text-white">{title}</p>
            {/* value */}
            <p className="text-sm xl:text-[15px] text-white pt-1.5">
              {content}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default MonthSelection;
