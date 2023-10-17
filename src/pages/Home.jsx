import Banner from "../components/Banner";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LilaBanner from "../components/LilaBanner";
import SponsorsBanner from "../components/SponsorsBanner";

const Home = () => {
  return (
    <div>
        <div className="pb-10 min-h-screen relative" id="lilabanner">
            <div className="container mx-auto w-11/12 lg:w-[85%] 3xl:w-[70%]">
                <Navbar homepage={true} />
                    <LilaBanner />
                </div>
            </div>
        <SponsorsBanner></SponsorsBanner>
        <div className="pb-10">
            <div className="container mx-auto w-11/12 md:w-[85%] 3xl:w-[70%]">
                <Banner />
            </div>
        </div>
        <Footer />
    </div>
  );
};

export default Home;
