const AssetProcotolTopContent = ({boolean}) => {
    return (
      <div className="flex gap-10 md:flex-row flex-col min-h-[192px] mb-10">
        {/* left side start */}
        
        <div
          className="min-h-[192px] min-w-[233.59px] cursor-pointer"
        >
          {/* top content */}
          <div
            className="bg-navButtonBg w-full pb-6 px-3.5 pt-4"
          >
            <p
              className={`text-xl xl:text-[25px] ${
                "text-black"
              }`}
            >
              {"Asset"}
            </p>

            <p
              className={`text-sm md:text-base xl:text-[17px] ${
                "text-black"
              }`}
            >
              {"Low - High Interest"}
            </p>
          </div>

          {/* Bottom Content */}
          <div className="w-full bg-portfolioBottomBg pb-3.5 px-3.5 pt-8 text-end">
            {/* name */}
            <p className="text-lg xl:text-xl text-white">{"Protocol"}</p>
            {/* value */}
            <p className="text-sm xl:text-[15px] text-white pt-1.5 roboto">
              {"Lila Finance TVL"}
            </p>
          </div>
        </div>
        {/* left side end */}
  
        {/* right side start */}
        <div className="w-full flex flex-col justify-between gap-6 md:gap-4">
          <div className="text-end">
            
            <p className="xl:text-lg 2xl:text-xl">

            {!(boolean[0] || boolean[1] || boolean[2] || boolean[3]|| boolean[4]) && "Welcome to the Market"}
            {!(!boolean[0] || boolean[1] || boolean[2]|| boolean[3]|| boolean[4]) && "Build a	Personalized Position"}
            {!(boolean[0] || !boolean[1] || boolean[2]|| boolean[3]|| boolean[4]) && "Maturity and Rate Updated"}
            {!(boolean[0] || boolean[1] || !boolean[2]|| boolean[3]|| boolean[4]) && "Deposit	Amount Updated"}
            {!(boolean[0] || boolean[1] || !boolean[2]|| !boolean[3]|| boolean[4]) && "Allow Confirmed"}
            {!(boolean[0] || boolean[1] || !boolean[2]|| boolean[3] || !boolean[4]) && "Thank You for Choosing Lila Finance"}
  

            </p>
            <p className="text-2xl 3xl:text-3xl 2xl:mt-2.5 3xl:mt-3.5">
            {!(boolean[0] || boolean[1] || boolean[2]|| boolean[3]|| boolean[4]) && "Select a Base to Customize"}
            {!(!boolean[0] || boolean[1] || boolean[2]|| boolean[3]|| boolean[4]) && "Select a Maturity"}
            {!(boolean[0] || !boolean[1] || boolean[2]|| boolean[3]|| boolean[4]) && "Hit 'Enter' After Inputing Deposit Amount"}
            {!(boolean[0] || boolean[1] || !boolean[2]|| boolean[3]|| boolean[4]) && "Two More Steps - Approval and Deposit"}
            {!(boolean[0] || boolean[1] || !boolean[2]|| !boolean[3]|| boolean[4]) && "Finalize Deposit"}
            {!(boolean[0] || boolean[1] || !boolean[2]|| boolean[3]|| !boolean[4]) && "View this position in Your Portfolio"}
            </p>
          </div>
  
          
        </div>
        {/* right side end */}
      </div>
    );
  };
  
  export default AssetProcotolTopContent;
  