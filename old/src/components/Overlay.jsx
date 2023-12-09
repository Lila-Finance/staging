const Overlay = ({ closeFunc }) => {
  return (
    <div
      className="fixed inset-0 bg-white bg-opacity-40"
      onClick={closeFunc}
    ></div>
  );
};

export default Overlay;
