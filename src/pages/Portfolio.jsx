import PortfolioBanner from "../components/portfolio/PortfolioBanner";
import ActivePosition from "../components/portfolio/ActivePosition";
import Footer from "../components/primary/Footer";
import Navbar from "../components/primary/Navbar";
import MaturedPosition from "../components/portfolio/MaturedPosition";
import { ScrollRestoration } from "react-router-dom";

const Portfolio = () => {
  return (
    <div className="w-full">
      <ScrollRestoration />
      <Navbar />
      <div className="w-full 2xl:max-w-7xl 3xl:max-w-[1400px] mx-auto px-4 md:px-10 lg:px-16 xl:px-24">
        <PortfolioBanner />
        <ActivePosition />
        <MaturedPosition />
        <Footer />
      </div>
    </div>
  );
};

export default Portfolio;
