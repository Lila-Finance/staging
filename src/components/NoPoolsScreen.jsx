import Pool from "../assets/pool.png";
import { NavLink } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const NoPoolsScreen = () => {
  return (
    <div className="w-full">
      {/* Image */}
      <div className="flex items-center justify-center">
        <img src={Pool} alt="pool-image" />
      </div>

      {/* texts */}
      <div className="mt-6 text-center">
        <h2 className="text-xl md:text-2xl lg:text-[36px] font-bold mb-4">
          Looks a bit empty... <br /> Go to{" "}
          <NavLink
            to="/market"
            className="text-buttonText underline underline-offset-8 inline-block lg:mt-[10px] text-[#f85c70]"
          >
            Market
          </NavLink>{" "}
          to find Pools 
        </h2>


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
                !connected ? (
                    <h2 className="text-xl md:text-2xl lg:text-[36px] font-bold">
                      or <span className="text-[#f85c70]">Connect Wallet</span>.
                    </h2>
                  ) : null
            );
          }}
        </ConnectButton.Custom>

        
      </div>
    </div>
  );
};

export default NoPoolsScreen;
