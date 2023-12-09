const DepositContent = () => {
  return (
    <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-5 items-end">
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

      {/* Allow */}
      <div className="w-full bg-[#FFC9C9] px-3.5 h-[105px] flex items-center justify-end cursor-pointer">
        <p className="text-lg xl:text-xl text-black">Allow</p>
      </div>

      {/* Deposit */}
      <div className="w-full bg-depositBg px-3.5 h-[105px] flex items-center justify-end cursor-pointer">
        <p className="text-lg xl:text-xl text-black">Deposit</p>
      </div>
    </div>
  );
};

export default DepositContent;
