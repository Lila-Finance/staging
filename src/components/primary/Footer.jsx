import { Link } from "react-router-dom";

const Footer = () => {
  // footer links
  const footerLinks = [
    {
      id: 1,
      title: "Discord",
      target: "https://www.discord.com",
    },
    {
      id: 2,
      title: "Docs",
      target: "/docs",
    },
    {
      id: 3,
      title: "Github",
      target: "https://www.github.com",
    },
    {
      id: 4,
      title: "Medium",
      target: "/",
    },
    {
      id: 5,
      title: "Twitter",
      target: "https://www.twitter.com",
    },
  ];

  return (
    <footer className="w-full 2xl:max-w-7xl 3xl:max-w-[1400px] mx-auto py-9">
      {/* Wrapper Start */}
      <div className="flex items-center justify-between gap-4">
        {footerLinks?.map((item) => (
          <Link
            to={item.target}
            key={item.id}
            className="text-sm md:text-lg lg:text-xl hover:-translate-y-2 duration-300"
          >
            {item.title}
          </Link>
        ))}
      </div>
      {/* Wrapper End */}
    </footer>
  );
};

export default Footer;
