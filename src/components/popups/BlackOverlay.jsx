import { motion } from "framer-motion";

const BlackOverlay = ({ clo }) => {
  return (
    <motion.div
      style={{
        background: "rgba(0,0,0, 0.7)",
        width: "100%",
        minHeight: "100vh",
        position: "fixed",
        inset: "0",
      }}
      initial={{ opacity: "0" }}
      animate={{ opacity: "100" }}
      exit={{ opacity: "0" }}
      transition={{ duration: 0.4 }}
      onClick={clo}
    ></motion.div>
  );
};

export default BlackOverlay;
