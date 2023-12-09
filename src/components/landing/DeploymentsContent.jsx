import AaveContentContent from "./AaveContent";
import ArbitrumOneContent from "./ArbitrumOneContent";

const DeploymentsContent = () => {
  return (
    <div className="w-full pb-[75px]">
      {/* Lila Chain Deployments */}
      <ArbitrumOneContent />

      {/* AAVE V3 */}
      <AaveContentContent />
    </div>
  );
};

export default DeploymentsContent;
