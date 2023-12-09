const ContentCard = ({ title, descOne, descTwo, bg }) => {
  return (
    <div
      className="w-full md:max-w-[300px] p-5 rounded"
      style={{
        backgroundColor: `${bg}`,
      }}
    >
      {/* heading */}
      <h1 className="text-2xl md:text-3xl xl:text-[34px] 2xl:text-4xl text-white">
        {title}
      </h1>

      {/* Content 1 */}
      <div className="mt-3">
        <p className="text-[10px] text-white">{descOne}</p>
      </div>

      {/* Content 2 */}
      <div className="mt-4">
        <p className="text-[10px] text-white">{descTwo}</p>
      </div>
    </div>
  );
};

export default ContentCard;
