
import { MarketDataContext } from '../../constants/MarketDataProvider'; 

import { useRef, useEffect, useContext } from "react";
import { useState } from 'react';

import IERC20 from "../../abi/IERC20Permit.json";

import { ExchangeRateContext } from "../../helpers/Converter";

import address from "../../data/address.json";

const DepositAmountContent = ({ toggleDeposit, selectedAsset, setSelectedAsset, rate }) => {
        // data
        const { publicClient, userAddress, to5DecValue } = useContext(ExchangeRateContext);
        const { marketContents } = useContext(MarketDataContext);
        let globitem = selectedAsset == -1 ? undefined : marketContents.filter(item => item.id == selectedAsset);
        const { bottomCoin, coinName, id, topBg, value, wallet, rates } = globitem[0];
        
        const [balance, setBalance] = useState(BigInt(0));

        const inputRef = useRef(null);

        const toBalanceString = (value) => {
            let newValue = to5DecValue(value, coinName.toLowerCase());
            
            let strValue = newValue.toString();
        
            strValue = strValue.padStart(6, '0');
        
            strValue = strValue.slice(0, -5) + '.' + strValue.slice(-5);
            
            return strValue;

        }

        const getUserBalance = async (tokenAddress) => {
            if (publicClient && userAddress != undefined) {
                const BALANCE = await publicClient.readContract({
                    address: tokenAddress,
                    abi: IERC20.abi,
                    functionName: "balanceOf",
                    args: [userAddress],
                });
                setBalance(BigInt(BALANCE.toString()));
            }            
        };

        useEffect(() => {
          // Set focus on the input field when the component mounts
          inputRef.current.focus();
          getUserBalance(address.assets[coinName.toLowerCase()]);
        }, []); // The empty dependency array ensures that the effect runs only once after the initial render

        
        return (
          <div className="grid md:grid-cols-4 lg:grid-cols-5 gap-5 items-start">
            <div className="w-full cursor-pointer w-full min-h-[192px] min-w-[233.59px]" onClick={() => setSelectedAsset(-1)} key={0}>
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
                    {rates[rate]}%
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
                    onClick={() => inputRef.current.value = toBalanceString(balance)}
                    key={1}

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
                    {toBalanceString(balance)}
                    </p>
                </div>

                {/* AMOUNT */}
                <div
                    className="w-full pb-3.5 px-3.5 pt-8 text-end cursor-pointer"
                    style={{
                    backgroundColor: `${topBg}`,
                    }}
                    key={2}
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
                            // Allow numeric values, a single decimal point, and backspace
                            if ((!/[0-9]/.test(e.key) && e.key !== 'Backspace') &&
                                (e.key !== '.' || e.target.value.includes('.'))) {
                                e.preventDefault();
                            }
                        
                            // Check if there's a decimal point and if the number of digits after it is more than 5
                            if (e.key !== 'Backspace' && e.target.value.includes('.') && e.key.match(/[0-9]/)) {
                                const parts = e.target.value.split('.');
                                if (parts[1] && parts[1].length >= 5) {
                                    e.preventDefault();
                                }
                            }
                        
                            if (e.key === 'Enter') {
                                // Print the input so far:
                                const parts = inputRef.current.value.split('.');

                                // Pad the decimal part to 5 digits
                                const decimalPart = parts[1] ? parts[1].padEnd(5, '0') : '00000';

                                // Concatenate the integer part and the padded decimal part
                                const concatenated = parts[0] + decimalPart;

                                // Convert to BigInt and return
                                const value = BigInt(concatenated);

                                if(value <= balance){
                                    toggleDeposit(value);
                                }
                            }
                        }}  
                                  
                    />
                </div>
          </div>
        );
      };
      
  export default DepositAmountContent;
  