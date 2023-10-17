const SponsorsBanner = () => {
    return (
        <div>
        <div className="w-full bg-black pt-10 md:pt-14">
            <div className="container mx-auto lg:w-9/12 2xl:w-8/12 w-11/12">
                {/* Left side */}
                    <p className="text-base md:text-2xl lg:text-2xl text-center text-white">
                        DeFi Guaranteed Fixed Income and Rate Swap markets
                    </p>

                </div>
            

            <div className="w-full">
                <img
                    src="./images/protocol.png"
                    alt="banner-2"
                    className="w-full h-full"
                />
            </div>
            </div>
        </div>
    );
  };
  
  export default SponsorsBanner;
  