import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
const Faucet = () => {
    return (
        <div>
             
         <div className="container mx-auto w-11/12 lg:w-[85%] 3xl:w-[70%]">
                <Navbar homepage={false} />
        </div>
         <div className="min-h-screen flex flex-col">
         
         <main className="flex-grow container mx-auto w-11/12 md:w-[85%] 3xl:w-[70%] py-12">
             <h1 className="text-2xl md:text-3xl font-bold mb-8">Faucet Links</h1>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="p-6 bg-white border rounded shadow hover:shadow-md transition-shadow duration-300">
                     <h2 className="mb-4 font-semibold text-xl">Recommended Sepolia Ether Faucet</h2>
                     <Link to="https://sepoliafaucet.com/" className="text-blue-600 hover:text-blue-800 hover:underline">https://sepoliafaucet.com/</Link>
                 </div>

                 <div className="p-6 bg-white border rounded shadow hover:shadow-md transition-shadow duration-300">
                     <h2 className="mb-4 font-semibold text-xl">Recommended Stablecoins Faucet</h2>
                     <Link to="https://staging.aave.com/faucet/" className="text-blue-600 hover:text-blue-800 hover:underline">https://staging.aave.com/faucet/</Link>
                 </div>
             </div>
         </main>
         </div>

         <Footer />
     
     </div>
    );
}

export default Faucet;