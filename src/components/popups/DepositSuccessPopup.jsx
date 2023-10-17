import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";

const DepositSuccessPopup = ({ clo, amount }) => {
    return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, x: "-50%", y: "-50%" }}
      animate={{ opacity: 1, scale: 0.9, x: "-50%", y: "-50%" }}
      exit={{ opacity: 0, scale: 0.8, x: "-50%", y: "-50%" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-[91%] max-w-[381px] bg-white drop-shadow-buttonShadow p-10 rounded-[20px] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      {/* Image */}
      <div className="flex items-center justify-center">
        <img src="./images/tick.png" alt="" />
      </div>

      {/* Heading */}
      <div className="mt-4">
        <h2 className="text-lg lg:text-xl 2xl:text-2xl font-extrabold text-center">
          Entered Position!
        </h2>
      </div>

      {/* Subheading 1 */}
      <div className="my-4">
        <p className="text-base lg:text-lg font-medium text-center">
          You Deposited {amount} Dai.
        </p>
      </div>

      {/* Subheading 2 */}
      <div>
        <p className="text-base lg:text-lg font-medium text-center">
          You can see your position <br className="md:block hidden" />
          on your{" "}
          <NavLink to="/portfolio">
            <span className="underline underline-offset-4">Portfolio</span>
          </NavLink>
        </p>
      </div>

      {/* Button */}
      <div className="text-center mt-5 mb-10">
        <button
          className="py-3 px-8 bg-themeColor lg:text-xl text-base font-bold rounded-[50px] drop-shadow-buttonShadow"
          onClick={clo}
        >
          Earn
        </button>
      </div>
    </motion.div>
  );
};

export default DepositSuccessPopup;
