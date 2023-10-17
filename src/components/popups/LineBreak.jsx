import React from "react";

const LineBreak = () => {
  return (
    <div className="w-full h-1 relative bg-themeColor">
      {/* dot*/}
      <div className="w-5 h-5 bg-themeColor rounded-full absolute -right-2 -top-2"></div>
    </div>
  );
};

export default LineBreak;
