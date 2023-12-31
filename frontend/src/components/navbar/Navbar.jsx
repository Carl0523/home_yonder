import { logo } from "../../assets";
import { FaSearch, FaHome } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { RxAvatar } from "react-icons/rx";
import { MdOutlineLogout, MdSell } from "react-icons/md";
import { GiHouseKeys } from "react-icons/gi";


import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/userSlice";
import IconWithText from "../IconWithText";
import Filter from "./Filter";
import LinkText from "../utils/LinkText";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchWords, setSearchWords] = useState("");

  const { userInfo } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const avatarClickHandler = () => {
    setIsMenuOpen((prevState) => {
      return !prevState;
    });
  };

  const logoutHandler = () => {
    axios
      .post(
        "https://home-yonder.onrender.com/api/auth/logout",
        {},
        { withCredentials: true }
      )
      .catch((error) => {
        console.log(error);
      });
    dispatch(logout());
  };

  /**
   * Create urlParams based on the search words enter by the user
   * and then navigate to specific route
   * @param e the event listener object
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    // create new URLSearchParams object that contain the querystring part of URL
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchWords", searchWords);
    const urlQuery = urlParams.toString(); // It may contain number
    navigate(`/search?${urlQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchWords = urlParams.get("searchWords");
    if (searchWords) {
      setSearchWords(searchWords);
    }
  }, [location.search]);

  return (
    <header className="fixed top-0 left-0 w-full flex flex-col gap-6 xs:px-6 xs:pt-5 xs:pb-2 py-2 px-3 bg-white z-20">
      <div className="w-full flex justify-between items-center">
        {/* 1. Logo and the Logo name */}
        <Link to="/">
          <div className="flex items-center gap-1 mr-1">
            <img src={logo} alt="logo" className="object-contain xs:w-[8rem] w-[5rem]" />
          </div>
        </Link>

        {/* 2. The middle search bar */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center p-3 bg-gray-100 rounded-md"
        >
          <FaLocationDot className="mr-2 xs:text-base text-xs" />
          <input
            type="text"
            placeholder="Enter an address or ZIP code"
            onChange={(e) => {
              setSearchWords(e.target.value);
            }}
            value={searchWords}
            className="bg-transparent outline-none lg:w-[18rem] lg:focus:w-[30rem] 
            md:w-[16rem] md:focus:w-[24rem] sm:w-[12rem] sm:focus:w-[17rem] 
            xs:focus:w-[13rem] w-[10rem] xs:text-base text-xs duration-200"
          />
          <button>
            <FaSearch className="cursor-pointer xs:text-base text-xs" />
          </button>
        </form>

        {/* 3. The navigation links */}
        <ul className="flex items-center gap-5 font-semibold">
          {/* 3A. LOGIN: display the sale and rent links */}
          {userInfo ? (
            <>
              <LinkText
                text="Sell"
                path="/search?type=sale"
                customCss="sm:mr-4 mr-2 text-lg sm:flex hidden"
              />
              <LinkText
                text="Rent"
                path="/search?type=rent"
                customCss="sm:mr-4 mr-2 text-lg sm:flex hidden"
              />
              <img
                src={userInfo.avatar}
                alt="avatar"
                referrerPolicy="no-referrer"
                className={`rounded-full border object-cover h-10 w-10 cursor-pointer hover:shadow-md ${
                  isMenuOpen && "shadow-md shadow-gray-400"
                }`}
                onClick={avatarClickHandler}
              />

              {/* OPTIONAL: When the menu is open: display profile, your homes, and logout link */}
              {isMenuOpen && (
                <motion.div
                  initial={{ translateY: -20, opacity: 0 }}
                  animate={{ translateY: 0, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col gap-2 p-6 absolute top-16 right-0 mx-4 my-3 min-w-[140px] rounded-2xl border shadow-lg z-30 bg-white"
                >
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                    <IconWithText
                      text="Profile"
                      icon={<RxAvatar className="text-2xl" />}
                      customCss="hover:text-gray-600 hover:scale-95 font-normal"
                    />
                  </Link>
                  <Link to="/your-homes" onClick={() => setIsMenuOpen(false)}>
                    <IconWithText
                      text="Your Homes"
                      icon={<FaHome className="text-2xl" />}
                      customCss="hover:text-gray-600 hover:scale-95 font-normal"
                    />
                  </Link>

                  {/* ------------------------- ONLY DISPLAY WHEN SCREEN WIDTH LESS THAN 640px  -------------------------  */}
                  <Link to="/search?type=sale" onClick={() => setIsMenuOpen(false)} className="sm:hidden flex">
                    <IconWithText
                      text="Sell"
                      icon={<MdSell className="text-2xl" />}
                      customCss="hover:text-gray-600 hover:scale-95 font-normal"
                    />
                  </Link>
                  <Link to="/search?type=rent" onClick={() => setIsMenuOpen(false)} className="sm:hidden flex">
                    <IconWithText
                      text="Rent"
                      icon={<GiHouseKeys className="text-2xl" />}
                      customCss="hover:text-gray-600 hover:scale-95 font-normal"
                    />
                  </Link>
                  {/* ---------------------------------------------------------------------------  */}

                  <Link onClick={logoutHandler} to="/">
                    <IconWithText
                      text="Logout"
                      icon={<MdOutlineLogout className="text-2xl" />}
                      customCss="hover:text-gray-600 hover:scale-95 font-normal"
                    />
                  </Link>
                </motion.div>
              )}
            </>
          ) : (
            <>
              {/* 3B. NOT LOGIN: Display login and register links */}
              <Link to="/login" className="">
                <li className="sm:text-base text-xs hover:scale-105">Login</li>
              </Link>
              <Link to="/register">
                <li className="hidden md:flex px-4 py-2 bg-primary text-white rounded-md xs:text-base text-xs hover:scale-105">
                  Register
                </li>
              </Link>
            </>
          )}
        </ul>
      </div>
      {location.pathname.includes("search") && (
        <Filter searchWords={searchWords} />
      )}
    </header>
  );
}
