import { ScrollRestoration } from "react-router-dom";
import Assets from "./components/landing/Assets";
import Banner from "./components/landing/Banner";
import BannerBottom from "./components/landing/BannerBottom";
import DeploymentsContent from "./components/landing/DeploymentsContent";
import Footer from "./components/primary/Footer";
import Navbar from "./components/primary/Navbar";

function App() {
  return (
    <div className="w-full">
      <ScrollRestoration />
      <Navbar launchApp={true} />
      {/* Container Start */}
      <div className="w-full 2xl:max-w-7xl 3xl:max-w-[1400px] mx-auto px-4 md:px-10 lg:px-16 xl:px-24">
        <Banner />
        <BannerBottom />
        <DeploymentsContent />
        <Assets />
        <Footer />
      </div>
      {/* Container End */}
    </div>
  );
}

export default App;
