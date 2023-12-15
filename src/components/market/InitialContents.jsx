import { marketContents } from "../../constants";
import { useState } from "react";
const InitialContents = ({ setSelectedAsset, selectedAsset }) => {
  
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div>
        {selectedAsset == -1 ?  
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-5">
          {marketContents.map((item) => {
            const { bottomCoin, coinName, id, topBg, value, wallet } = item;
              return (
                <div className="w-full h-full cursor-pointer" key={id} onClick={() => setSelectedAsset(id)}>
                  {/* top content */}
                  <div
                    style={{
                      backgroundColor: `${topBg}`,
                    }}
                    className="w-full pb-6 px-3.5 pt-4"
                  >
                    <p
                      className={`text-xl xl:text-[25px] ${
                        id === 3 || id === 7 ? "text-black" : "text-white"
                      }`}
                    >
                      {coinName}
                    </p>

                    <p
                      className={`text-sm md:text-base xl:text-[17px] ${
                        id === 3 || id === 7 ? "text-black" : "text-white"
                      }`}
                    >
                      {wallet}
                    </p>
                  </div>

                  {/* Bottom Content */}
                  <div className="w-full bg-aaveBg pb-3.5 px-3.5 pt-8 text-end">
                    {/* name */}
                    <p className="text-lg xl:text-xl text-white">{bottomCoin}</p>
                    {/* value */}
                    <p className="text-sm xl:text-[15px] text-white pt-1.5 roboto">
                      {value}
                    </p>
                  </div>
                </div>
              );
          })}
        </div>
        : 
        <></>
        }
    </div>
  );
};

export default InitialContents;
