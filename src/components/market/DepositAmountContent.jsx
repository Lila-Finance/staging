
import { marketContents } from "../../constants";
import { useRef, useEffect } from "react";

const DepositAmountContent = ({ toggleDeposit, selectedAsset, setSelectedAsset }) => {
        // data
        let globitem = selectedAsset == -1 ? undefined : marketContents.filter(item => item.id == selectedAsset);
        const { bottomCoin, coinName, id, topBg, value, wallet } = globitem[0];

        const inputRef = useRef(null);

        useEffect(() => {
          // Set focus on the input field when the component mounts
          inputRef.current.focus();
        }, []); // The empty dependency array ensures that the effect runs only once after the initial render

        
        return (
          <div className="grid md:grid-cols-4 lg:grid-cols-5 gap-5 items-start">
            <div className="w-full cursor-pointer w-full min-h-[192px] min-w-[233.59px] border-2" onClick={() => setSelectedAsset(-1)} key={10}>
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
                
                {/* BALANCE */}
                <div
                    className="w-full pb-3.5 px-3.5 pt-8 text-end cursor-pointer"
                    style={{
                    backgroundColor: `${topBg}`,
                    }}
                    key={id}
                    onClick={toggleDeposit}
                >
                    {/* name */}
                    <p
                    className={`text-xl xl:text-[25px] ${
                        id === 3 || id === 7 ? "text-black" : "text-white"
                    }`}
                    >
                    {"Balance"}
                    </p>
                    
                    {/* value */}
                    <p
                    className={`text-sm md:text-base xl:text-[17px] ${
                        id === 3 || id === 7 ? "text-black" : "text-white"
                    }`}
                    >
                    {"00000000.00000"}
                    </p>
                </div>
            
                {/* AMOUNT */}
                <div
                    className="w-full pb-3.5 px-3.5 pt-8 text-end cursor-pointer"
                    style={{
                    backgroundColor: `${topBg}`,
                    }}
                    key={id}
                    onClick={toggleDeposit}
                >
                    {/* name */}
                    <p
                    className={`text-xl xl:text-[25px] ${
                        id === 3 || id === 7 ? "text-black" : "text-white"
                    }`}
                    >
                    {"Enter Amount"}
                    </p>
                    
                    {/* value */}
                    <p
                    className={`text-sm md:text-base xl:text-[17px] ${
                        id === 3 || id === 7 ? "text-black" : "text-white"
                    }`}
                    >
                    </p>

                    <input
                        type="text"
                        ref={inputRef}
                        style={{
                            backgroundColor: "transparent",
                            border: "none",
                            outline: 'none',
                            textAlign: 'right', // Right-align text
                            color: id === 3 || id === 7 ? "black" : "white", // Set text color conditionally
                        }}
                        onKeyDown={(e) => {
                            // Allow numeric values and a single decimal point
                            if (
                                (!/[0-9]/.test(e.key) && e.key !== 'Backspace') &&
                                (e.key !== '.' || e.target.value.includes('.'))
                            ) {
                                e.preventDefault();
                            }
                        }}           
                    />
                </div>
          </div>
        );
      };
      
  export default DepositAmountContent;
  