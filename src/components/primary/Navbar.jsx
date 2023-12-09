import { useState } from "react";
import { NavLink } from "react-router-dom";

const Navbar = ({ launchApp }) => {
  // links
  const navLinks = [
    {
      id: 1,
      title: "Market",
      target: "/market",
    },
    {
      id: 2,
      title: "Portfolio",
      target: "/portfolio",
    },
    {
      id: 3,
      title: "Docs",
      target: "/docs",
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
                  className={
                    "text-sm md:text-base xl:text-lg hover:translate-y-2 duration-300"
                  }
                >
                  {item.title}
                </NavLink>
              ))}
            </div>
          </div>
        </div>

        {/* right side */}
        {walletConnected === false ? (
          <div className="md:w-auto w-6/12 flex items-center justify-end">
            {launchApp === true ? (
              <div>
                <NavLink to="/market">
                  <button className="bg-navButtonBg py-2 md:py-3 px-4 md:px-8 text-sm md:text-base xl:text-lg rounded hover:-translate-x-2 duration-300">
                    Launch App
                  </button>
                </NavLink>
              </div>
            ) : (
              <div onClick={() => setWalletConnected(true)}>
                <button className="bg-navButtonBg py-2 md:py-3 px-4 md:px-8 text-sm md:text-base xl:text-lg rounded hover:-translate-x-2 duration-300">
                  Connect
                </button>
              </div>
            )}
          </div>
        ) : null}

        {walletConnected === true ? (
          <div className="flex items-center gap-[5px]">
            <button className="bg-navButtonBg py-2 md:py-3 px-3 text-sm md:text-base xl:text-lg rounded">
              Arbitrum
            </button>
            <button className="bg-navButtonBg py-2 md:py-3 px-3 text-sm md:text-base xl:text-lg rounded">
              0xab...cd
            </button>
          </div>
        ) : null}
      </div>
      {/* Wrapper end */}

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
        </div>
      </div>
    </div>
  );
};

export default Navbar;
