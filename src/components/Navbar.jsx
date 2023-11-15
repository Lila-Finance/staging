import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import  Overlay  from './Overlay';

const Navbar = ({setNetwork, showPopup}) => {
    
  
  return (
    // <div className={`mx-20 ${showPopup ? "fixed inset-0 bg-white bg-opacity-40" : ""}`}></div>
    <div className=
    {`bg-primaryBgDark sticky top-0 z-50 ${showPopup ? "fixed inset-0 bg-white bg-opacity-10" : ""}`}>
        
        {/* if showPopup is true then add the following css fixed inset-0 bg-white bg-opacity-40 */}
        <div className="mx-20">
    <nav className="flex items-center justify-between py-6 md:flex-row flex-col gap-y-8
     w-11/12" 
    >
      {/* left side */}
      <div className="flex items-center gap-8 md:gap-16 md:flex-row flex-col">
        <Link to="/">
          <img src="./images/logo-2.svg" alt="nav__logo" className="w-[16vw] h-[8vh]"/>
        </Link>

        {/* links */}
        <ul className="flex items-center gap-10 lg:gap-20 text-sm md:text-base text-white">
          <li>
            <Link to={"/market"}>Market</Link>
          </li>
          <li>
            <Link to={"/portfolio"}>Portfolio</Link>
          </li>
          <li>
            <Link to={"/"}>Help</Link>
          </li>
        </ul>
      </div>

      {/* right side */}
      <div>
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            authenticationStatus,
            mounted,
          }) => {
            const ready = mounted && authenticationStatus !== "loading";
            const connected =
              ready &&
              account &&
              chain &&
              (!authenticationStatus ||
                authenticationStatus === "authenticated");
                useEffect(() => {
                    setNetwork(chain.name);
                },[]);
                
            return (
              <div
                {...(!ready && {
                  "aria-hidden": true,
                  style: {
                    opacity: 0,
                    pointerEvents: "none",
                    userSelect: "none",
                  },
                })}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <button
                        onClick={openConnectModal}
                        type="button"
                        className="bg-primaryColor pt-[0.35vw] pb-[0.5vw] px-[2.25vw] 
                      rounded-barRadius text-[1vw] flex items-center 
                      justify-center hover:bg-primaryColorDark duration-200"
                      >
                        Connect Wallet
                      </button>
                    );
                  }

                  if (chain.unsupported) {
                    return (
                      <button
                        onClick={openChainModal}
                        type="button"
                        className="bg-primaryColor pt-[0.35vw] pb-[0.5vw] px-[2.25vw] 
                      rounded-barRadius text-[1vw] flex items-center 
                      justify-center hover:bg-primaryColorDark duration-200"
                      >
                        Wrong Network
                      </button>
                    );
                  }

                  return (
                    <div style={{ display: "flex", gap: 12 }}>
                      <button
                        onClick={openChainModal}
                        style={{ display: "flex", alignItems: "center" }}
                        type="button"
                        className="w-[5vh] h-[5vh] rounded-lg flex items-center justify-center text-xl cursor-pointer"
                      >
                        {chain.hasIcon && (
                          <div
                            style={{
                              background: chain.iconBackground,
                              width: 30,
                              height: 30,
                              borderRadius: 999,
                              overflow: "hidden",
                            }}
                          >
                            {chain.iconUrl && (
                              <img
                                alt={chain.name ?? "Chain icon"}
                                src={chain.iconUrl}
                                style={{ width: 30, height: 30 }}
                              />
                            )}
                          </div>
                        )}
                      </button>

                      <button
                        onClick={openAccountModal}
                        type="button"
                        className="w-[5vh] h-[5vh] rounded-lg flex items-center justify-center text-xl cursor-pointer"
                      >
                        <img src="./images/walletico.png" alt="nav__logo" className="w-[2.5vw] h-[4vh]"/>
                      </button>
                    </div>
                  );
                })()}
              </div>
            );
          }}
        </ConnectButton.Custom>

      </div>
    </nav>
    </div>
    </div>
  );
};

export default Navbar;
