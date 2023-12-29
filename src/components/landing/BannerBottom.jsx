import { useState, useEffect, useContext } from "react";

import address from "../../data/address.json";

import IProxy from "../../abi/IProxy.json";

import { ExchangeRateContext } from '../../helpers/Converter';

const BannerBottom = () => {
  const [front, toggleFront] = useState(0)
  const { publicClient, to10DecUSD } = useContext(ExchangeRateContext);

  const [totalTVL, setTotalTVL] = useState(BigInt(0)); // 10 0's

  const getProxyTVL = async (proxyAddress) => {
    if (publicClient) {
        const ProxyBalance = await publicClient.readContract({
            address: proxyAddress,
            abi: IProxy.abi,
            functionName: "balance",
            args: [],
        });
        return ProxyBalance;
    }

    return 0;
  };

  const getTotalTVL = async () => {
    
    let sumTVL = BigInt(0);
    for(let proxy in address.proxies){
      let proxy_address = address.proxies[proxy];
      let value = await getProxyTVL(proxy_address);
      let token = proxy.split('_')[0];
      sumTVL += to10DecUSD(value, token);
    }
    setTotalTVL(sumTVL);
  };

  useEffect(() => {
      getTotalTVL();
      

      const interval = setInterval(() => {
          getTotalTVL();
      }, 8000);

      return () => clearInterval(interval);
  }, []);

  const toTVLString = (value) => {
    let strValue = value.toString();

    strValue = strValue.padStart(15, '0');

    strValue = strValue.slice(0, -10) + '.' + strValue.slice(-10);

    return `$${strValue}`;
  };

  return (
    <div className=" pb-20">
      {/* Wrapper Start */}
      <div className="w-full flex md:items-center justify-between md:flex-row flex-col gap-y-10">
        {/* left side */}
        <div>
          <p className="text-xl lg:text-2xl 2xl:text-3xl">
            {toTVLString(totalTVL)}
            {/* $00000.000000000000 */}
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
