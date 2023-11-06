import { useRef, useState } from "react";
import { Link } from "react-router-dom";



const Homepage = () => {
  const nextPageRef = useRef();

  const [nextPage, setNextPage] = useState(false);

  const goToNextPage = () => {
    setNextPage(true);

    setTimeout(() => {
      if (nextPageRef?.current) {
        window.scrollTo({
          top: nextPageRef?.current.offsetTop,
          behavior: "smooth",
        });
      }
    }, 300);
  };

  return (
    <div>
      <div className="h-screen bg-primaryBg">
        <div className="container w-11/12 mx-auto h-full flex flex-col items-center justify-center gap-20">
          <img src="./images/logo.svg" alt="logo_svg" />
          <Link to={"/portfolio"}>
            <div
                className="w-[75px] h-[225px] bg-primaryColor shadow-barShadow rounded-barRadius cursor-pointer"
                onClick={goToNextPage}
            ></div>
          </Link>
        </div>
      </div>

      {/* second part
      {nextPage === true ? <Portfolio nextPageRef={nextPageRef} /> : null} */}
    </div>
  );
};

export default Homepage;
