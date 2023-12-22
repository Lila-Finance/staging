import { useState } from "react";
const BannerBottom = () => {
  const [front, toggleFront] = useState(0)

  return (
    <div className=" pb-20">
      {/* Wrapper Start */}
      <div className="w-full flex md:items-center justify-between md:flex-row flex-col gap-y-10">
        {/* left side */}
        <div>
          <p className="text-xl lg:text-2xl 2xl:text-3xl">
            $00000.000000000000
          </p>
          <p className="text-[15px] md:text-base 2xl:text-[17px] mt-2.5">
            of liquidity locked into in Lila Finance
          </p>
        </div>

        {/* Right side */}
        <div>
          {/* header */}
          <div className="flex items-center gap-[91px] border-b border-b-black pb-1.5">
              <button onClick={() => toggleFront(0)}>
                  <p className={`text-base md:text-[17px] 2xl:text-lg ${front === 0 ? '' : 'opacity-50'}`}>
                      Deposit
                  </p>
              </button>
              <button onClick={() => toggleFront(1)}>
                  <p className={`text-base md:text-[17px] 2xl:text-lg ${front === 1 ? '' : 'opacity-50'}`}>
                      Trade
                  </p>
              </button>
              <button onClick={() => toggleFront(2)}>
                  <p className={`text-base md:text-[17px] 2xl:text-lg ${front === 2 ? '' : 'opacity-50'}`}>
                      Earn
                  </p>
              </button>
          </div>


          {/* Content */}
          <div className="pt-1.5">
            {front == 0 &&
            <p className="text-base md:text-[17px] 2xl:text-lg">
              Enter a position with your preferred <br /> asset, maturity,
              protocol, and rate
            </p>
            }
            {front == 1 &&
            <p className="text-base md:text-[17px] 2xl:text-lg">
              Sell your positions or buy a new one <br /> 
              from the Lila Finance Marketplace
            </p>
            }
            {front == 2 &&
            <p className="text-base md:text-[17px] 2xl:text-lg">
              Earn cash flow with interest paid every <br /> 
              month delivered to your portfolio
            </p>
            }
          </div>
        </div>
      </div>
      {/* Wrapper End */}
    </div>
  );
};

export default BannerBottom;
