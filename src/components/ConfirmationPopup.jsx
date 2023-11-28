import { useEffect, useState } from "react";

const ConfirmationPopup = ({showPopup, setShowConfirmPopup, amount, token}) => {
 const close = () =>{
    setShowConfirmPopup(false);
 }
  return (
    <div
      className={`w-[95%] max-w-[20vw] bg-primaryBg px-12 py-10 rounded-[20px] fixed top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2 duration-300 ${
        showPopup === true
          ? "opacity-100 scale-100 visible"
          : "invisible opacity-0 scale-75"
      }`}
    >
      {/* heading */}
      <div className="pt-5 text-center">
        <button
        className="text-lg font-medium px-4 py-1">
            <div className="flex items-center justify-center gap-2">
            <img src="./images/tickk.png" alt="" />
            </div>
        </button>
      </div>
      

      <div className="flex items-center justify-between gap-7 pt-5 pb-6 border-b border-b-primaryColor">
        {/* left side */}
        <div className="w-full">
          <p className="text-base md:text-xl text-white font-semibold">
            Deposited {amount} {token}.
          </p>
        </div>
      </div>
      {/* button */}
      <div className="pt-5 text-center">
        <button onClick={close}
        className="bg-primaryColor text-lg font-medium px-4 py-1 rounded-[30px] border-2 border-primaryColor
        hover:bg-primaryBg hover:border-2 hover:border-primaryColor hover:text-white">
            <div className="flex items-center justify-center gap-2">
            <p>See Position</p>
            </div>
        </button>
      </div>
    </div>
  );
};

export default ConfirmationPopup;
