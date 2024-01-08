import { MarketDataContext } from '../../constants/MarketDataProvider';
import { useContext, useState} from 'react';

const MonthSelection = ({ toggleDeposit, selectedAsset, setSelectedAsset }) => {
  // data
  const { marketContents } = useContext(MarketDataContext);
  let globitem = selectedAsset == -1 ? undefined : marketContents.filter(item => item.id == selectedAsset);
  const { bottomCoin, coinName, id, topBg, value, wallet } = globitem[0];
  
  if(globitem == undefined || globitem[0] == undefined || globitem[0]['rates'] == undefined){
    return (
      <div></div>
    );
  }
  const months = [
    {
      id: 0,
      title: "Ten Minutes",
      content: `${globitem[0]['rates'][0]}%`,
    },
    {
      id: 1,
      title: "Thirty Minutes",
      content: `${globitem[0]['rates'][1]}%`,
    },
    {
      id: 2,
      title: "Sixty Minutes",
      content: `${globitem[0]['rates'][2]}%`,
    },
  ];
  const [isAnimationDone, setIsAnimationDone] = useState(true); // New state variable

  return (
    <>
      { isAnimationDone &&
      <div className="flex">
        <div className="cursor-pointer w-full max-h-[192px] max-w-[233.59px]" key={10}>
            {/* top content */}
            <div
              style={{backgroundColor: `${topBg}`}}
              className="bg-aaveBg w-full pb-6 px-3.5 pt-4"
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
        {months?.map((item) => {
        const { content, id, title } = item;

        return (
          <div
            className="bg-aaveBg ml-5 pb-3.5 px-3.5 mt-[92px] pt-8 text-end cursor-pointer max-h-[100px] max-w-[233.59px] min-w-[233.59px] animate-slideIn"
            onAnimationEnd={() => setIsAnimationDone(false)}
            key={id}
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
      }
      { !isAnimationDone &&
    <div className="grid md:grid-cols-4 lg:grid-cols-5 gap-5 items-end">
      <div className="w-full cursor-pointer w-full min-h-[192px] min-w-[233.59px]" onClick={() => setSelectedAsset(-1)} key={10}>
          {/* top content */}
          <div
            style={{backgroundColor: `${topBg}`}}
            className="bg-aaveBg w-full pb-6 px-3.5 pt-4"
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
      
      {months?.map((item) => {
        const { content, id, title } = item;

        return (
          <div
            className="w-full bg-aaveBg pb-3.5 px-3.5 pt-8 text-end cursor-pointer"
            key={id}
            onClick={() => toggleDeposit(id)}
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
    }
    </>
  );
};

export default MonthSelection;
