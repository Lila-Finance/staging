const Popup = ({ showPopup }) => {
  return (
    <div
      className={`w-[95%] max-w-[550px] bg-primaryBg px-12 py-10 rounded-[30px] fixed top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2 duration-300 ${
        showPopup === true
          ? "opacity-100 scale-100 visible"
          : "invisible opacity-0 scale-75"
      }`}
    >
      {/* heading */}
      <div className="flex items-center justify-between pb-5 border-b border-b-primaryColor">
        <p className="text-lg text-white font-medium">USDC</p>
        <p className="text-lg text-white font-medium">AAA</p>
        <p className="text-lg text-white font-medium">5.00%</p>
        <p className="text-lg text-white font-medium">6 Months</p>
      </div>

      <div className="flex items-center justify-between gap-7 pt-5 pb-6 border-b border-b-primaryColor">
        {/* left side */}
        <div className="w-full">
          <p className="text-base md:text-xl text-white font-semibold">
            Balance: 50000
          </p>
        </div>

        {/* right side */}
        <div className="w-full">
          <input
            type="number"
            className="bg-transparent outline-none w-full p-2 text-end border-2 border-primaryColor rounded-[15px] text-white font-medium"
          />
        </div>
      </div>

      {/* button */}
      <div className="pt-5 text-center">
        <button className="bg-primaryColor text-lg font-medium px-16 py-1 rounded-[30px] hover:-translate-x-2 duration-200">
          Allow
        </button>
      </div>

      <div className="absolute bottom-5 right-5">
        <img src="./images/tooltip.svg" alt="" />
      </div>
    </div>
  );
};

export default Popup;
