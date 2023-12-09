const PortfolioBanner = () => {
  return (
    <div className="flex gap-10 md:flex-row flex-col">
      {/* left side start */}
      <div className="w-full max-w-[400px]">
        {/* Card */}
        <div>
          {/* upper part */}
          <div className="w-full bg-navButtonBg pt-4 pb-14 px-5">
            {/* heading */}
            <h2 className="text-xl lg:text-2xl mb-[22px]">Your Portfolio</h2>

            {/* Content */}
            <div>
              {/* NEt worth */}
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm lg:text-[17px]">Net Worth:</p>
                <p className="roboto text-sm lg:text-[17px]">
                  $00000.000000000000
                </p>
              </div>

              {/* Lifetime Earnings: */}
              <div className="flex items-center justify-between gap-2 mt-5">
                <p className="text-sm lg:text-[17px]">Lifetime Earnings:</p>
                <p className="roboto text-sm lg:text-[17px]">
                  $00000.000000000000
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Part */}
          <div className="w-full bg-portfolioBottomBg px-5 pt-16 pb-[22px]">
            {/* Monthly Yield */}
            <div className="flex items-center justify-between gap-2 mt-5">
              <p className="text-sm lg:text-[17px] text-white">Monthly Yield</p>
              <p className="roboto text-sm lg:text-[17px] text-white">
                $000.00
              </p>
            </div>

            {/* Next Payout */}
            <div className="flex items-center justify-between gap-2 mt-5">
              <p className="text-sm lg:text-[17px] text-white">Next Payout</p>
              <p className="roboto text-sm lg:text-[17px] text-white">
                00M 00D 00H 00S
              </p>
            </div>

            {/* Unclaimed Interest */}
            <div className="flex items-center justify-between gap-2 mt-5">
              <p className="text-[19px] text-white">Unclaimed Interest</p>
              <p className="roboto text-[19px] text-white">$000.00</p>
            </div>
          </div>
        </div>
      </div>
      {/* left side end */}

      {/* right side start */}
      <div className="w-full flex flex-col justify-between gap-6 md:gap-4">
        <div className="text-end">
          <p className="xl:text-lg 2xl:text-xl">
            Lila Finance Interest Rate Swaps
          </p>
          <p className="text-xl 2xl:text-2xl xl:mt-2.5 2xl:mt-3.5">
            Welcome Back
          </p>
        </div>

        {/* Claim All */}
        <div className="w-[200px] h-[100px] bg-navButtonBg px-3.5 text-end pt-7">
          <p className="text-base md:text-xl">Claim All</p>
        </div>
      </div>
      {/* right side end */}
    </div>
  );
};

export default PortfolioBanner;
