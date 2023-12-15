import AaveContentContent from "./AaveContent";
import ArbitrumOneContent from "./ArbitrumOneContent";

const DeploymentsContent = () => {
  return (
    <div className="w-full pb-[75px]">
      {/* Lila Chain Deployments */}
      <a href="https://arbitrum.io/" target="_blank" rel="noopener noreferrer">
        <ArbitrumOneContent />
      </a>

      {/* AAVE V3 */}
      <a href="https://aave.com/" target="_blank" rel="noopener noreferrer">
        <AaveContentContent />
      </a>
    </div>

  );
};

export default DeploymentsContent;
