import { NavLink } from "react-router-dom";
import gitbook from "../assets/gitbook-icon.png";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Navbar = ({ homepage }) => {
  // State for toggling the social icons dropdown
  const [showDropdown, setShowDropwdown] = useState(false);

  // References
  const ref = useRef();
  const ref2 = useRef();

  // Close social dropdown when clicked outside
  useEffect(() => {
    const closePopup = (e) => {
      if (
        !ref &&
        !ref.current &&
        e != undefined &&
        !ref.current.contains(e.target) &&
        !ref2.current.contains(e.target)
      ) {
        setShowDropwdown(false);
      }
    };
    document.addEventListener("click", closePopup);
    return () => {
      document.removeEventListener("click", closePopup);
    };
  }, [showDropdown]);

  return (
    <div className="md:py-10 py-6 flex items-center justify-between md:flex-row flex-col gap-y-6">
      {/* Left Side */}
      <div
        className={`flex items-center md:justify-start ${
          homepage === true ? "justify-between" : "justify-center"
        } md:flex-nowrap flex-wrap gap-y-4 gap-10`}
      >
        {homepage === false ? (
            <NavLink to="/">
            {/* <h1 className="text-2xl md:text-[35px] lg:text-[40px]">
                Lila Finance
            </h1> */}
            <img src="./images/lilabwlogo.png" alt="Lila Logo" className="sm:w-[350px] sm:h-[100px]" />
            {/* src="./images/lilabwlogo.png" */}
            </NavLink>
        ) : (<div></div>)}

        {/* social links for homepage */}
        {homepage === true && (
          <div className="flex items-center gap-6 mt-2">
            <a href="https://discord.gg/y2xzVcSuCq" target="_blank">
              <i className="fa-brands fa-discord text-lg md:text-[22px]"></i>
            </a>

            <a href="https://twitter.com/LilaFinance" target="_blank">
              <i className="fa-brands fa-twitter text-lg md:text-[22px]"></i>
            </a>

            <a
              href="https://lila-finance.gitbook.io/lila-documentation/"
              target="_blank"
            >
              <img
                src={gitbook}
                alt="gitbook_icon"
                className="w-[22px] md:w-full"
              />
            </a>
          </div>
        )}

        {/* NavLinks */}
        {!homepage && (
          <div className="flex items-center gap-10 navlinks">
            <NavLink to="/market">
              <p className="text-lg lg:text-xl">Market</p>
            </NavLink>

            <NavLink to="/portfolio">
              <p className="text-lg lg:text-xl">Portfolio</p>
            </NavLink>

            <NavLink to="/faucet">
              <p className="text-lg lg:text-xl">Faucet</p>
            </NavLink>

            {/* dropdown */}
            <div className="relative">
              <i
                className="fa-solid fa-ellipsis text-[26px] cursor-pointer"
                onClick={() => setShowDropwdown(!showDropdown)}
                ref={ref}
              ></i>

              {/* social icons */}
              {showDropdown === true && (
                <div
                  className="w-max px-4 py-3  bg-themeColor rounded-md absolute -right-full top-full"
                  ref={ref2}
                >
                  <div className="flex items-center flex-col gap-6 mt-2">
                    <a href="https://discord.gg/y2xzVcSuCq" target="_blank">
                      <i className="fa-brands fa-discord text-lg md:text-[22px]"></i>
                    </a>

                    <a href="https://twitter.com/LilaFinance" target="_blank">
                      <i className="fa-brands fa-twitter text-lg md:text-[22px]"></i>
                    </a>

                    <a
                      href="https://lila-finance.gitbook.io/lila-documentation/"
                      target="_blank"
                    >
                      <img
                        src={gitbook}
                        alt="gitbook_icon"
                        className="w-[22px] md:w-full"
                      />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right side */}
      <div>
        {/* <button className="bg-themeColor lg:text-lg md:py-[10px] py-2 px-8 md:px-12 rounded-full duration-300 hover:-translate-x-3">
            {homepage === true ? "Enter App" : "Connect"}
          </button>
          <ConnectButton />; */}
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
                        className="bg-themeColor lg:text-lg md:py-[10px] py-2 px-8 md:px-12 rounded-full duration-300 hover:-translate-x-3"
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
                        className="bg-themeColor lg:text-lg md:py-[10px] py-2 px-8 md:px-12 rounded-full duration-300 hover:-translate-x-3"
                      >
                        Wrong network
                      </button>
                    );
                  }

                  return (
                    <div style={{ display: "flex", gap: 12 }}>
                      <button
                        onClick={openChainModal}
                        style={{ display: "flex", alignItems: "center" }}
                        type="button"
                        className="bg-themeColor lg:text-lg md:py-[10px] py-2 px-8 md:px-12 rounded-full duration-300 hover:-translate-x-3"
                      >
                        {chain.hasIcon && (
                          <div
                            style={{
                              background: chain.iconBackground,
                              width: 12,
                              height: 12,
                              borderRadius: 999,
                              overflow: "hidden",
                              marginRight: 4,
                            }}
                          >
                            {chain.iconUrl && (
                              <img
                                alt={chain.name ?? "Chain icon"}
                                src={chain.iconUrl}
                                style={{ width: 12, height: 12 }}
                              />
                            )}
                          </div>
                        )}
                        {chain.name}
                      </button>

                      <button
                        onClick={openAccountModal}
                        type="button"
                        className="bg-themeColor lg:text-lg md:py-[10px] py-2 px-8 md:px-12 rounded-full duration-300 hover:-translate-x-3"
                      >
                        {account.displayName}
                      </button>
                    </div>
                  );
                })()}
              </div>
            );
          }}
        </ConnectButton.Custom>
      </div>
    </div>
  );
};

export default Navbar;
