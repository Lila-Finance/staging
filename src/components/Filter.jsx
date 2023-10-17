import React from "react";

const Filter = ({ buttons, currentTab, setCurrentTab }) => {
  return (
    <div className="flex items-center justify-center flex-wrap gap-8 md:gap-10 md:gap-y-10 gap-x-8 gap-y-6 lg:gap-32">
      {buttons?.map((btn, i) => (
        <button
          key={btn.id}
          onClick={() => setCurrentTab(i)}
          className={`text-buttonText font-bold text-lg lg:text-[22px] ${
            i === currentTab
              ? "underline underline-offset-[12px] decoration-[6px] decoration-buttonText"
              : ""
          } `}
        >
          {btn.title}
        </button>
      ))}
    </div>
  );
};

export default Filter;
