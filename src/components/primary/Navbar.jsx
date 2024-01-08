import { useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Navbar = ({ launchApp }) => {
  const history = useNavigate();
  const location = useLocation();

  const handleNavLinkClick = (target) => {
    // Check if the target is the current route
    if (location.pathname === target) {
      // Refresh the page
      history.go(0);
    }
  };


  // links
  const navLinks = [
    {
      id: 1,
      title: "Testnet Market",
      target: "/market",
    },
    {
      id: 2,
      title: "Portfolio",
      target: "/portfolio",
    },
    {
      id: 3,
      title: "Faucet",
      target: "/faucet",
    },
  ];

  const [walletConnected, setWalletConnected] = useState(false);

  return (
    <div className="w-full 2xl:max-w-7xl 3xl:max-w-[1400px] mx-auto pt-5 md:pt-9 pb-14 px-6 md:px-8 xl:px-12">
      {/* Wrapper start */}
      <div className="w-full flex items-center justify-between gap-10">
        {/* left side */}
        <div className="flex items-center gap-12">
          {/* logo */}
          <NavLink to={"/"}>
            <img src="./images/logo.svg" alt="site_logo" />
          </NavLink>

          {/* title */}
          <div className="md:block hidden">
            <div className="flex items-center gap-14">
                            {navLinks?.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.target}
                  className="text-sm md:text-base xl:text-lg"
                  onClick={() => handleNavLinkClick(item.target)}
                >
                  {item.title}
                </NavLink>
              ))}
              <a
                href={"https://lila-finance.gitbook.io/lila-documentation/getting-started-with-cryptocurrency/what-is-decentralized-finance"}
                key={4}
                target="_blank"
                rel="noopener noreferrer" // important for security reasons when using target='_blank'
                className="text-sm md:text-lg lg:text-xl"
              >
                {"Docs"}
              </a>
            </div>
          </div>
        </div>
        <ConnectButton></ConnectButton>
      </div>

      <div className="md:hidden block">
        <div className="flex items-center justify-center gap-14 mt-4">
          {navLinks?.map((item) => (
            <NavLink
              key={item.id}
              to={item.target}
              className={"text-base hover:translate-y-2 duration-300"}
            >
              {item.title}
            </NavLink>
          ))}
          <a
            href={"https://lila-finance.gitbook.io/lila-documentation/getting-started-with-cryptocurrency/what-is-decentralized-finance"}
            key={4}
            target="_blank"
            rel="noopener noreferrer" // important for security reasons when using target='_blank'
            className="text-sm md:text-lg lg:text-xl"
          >
            {"Docs"}
          </a>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
