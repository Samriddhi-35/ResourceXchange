import { FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import avatar from "/avatar.svg";
import PropTypes from "prop-types";

const Navbar = ({ onLogout, title, userName, userEmail }) => {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();

    // Clear user data from sessionStorage
    sessionStorage.removeItem("user");

    // Trigger any additional logout logic passed down via onLogout prop
    onLogout();

    // Redirect to the login page
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between bg-blueback p-6 shadow-md rounded-b-lg">
      <h1 className="font-dm-sans text-blue-950 text-[32px] font-bold ml-8">
        {title}
      </h1>
      <div className="flex items-center space-x-8">
        <div className="flex items-center space-x-4">
          <img src={avatar} alt="Profile" className="w-14 h-14 rounded-full" />
          <div className="flex flex-col text-left">
            <span className="text-blue-950 font-bold text-lg">{userName}</span>
            <span className="text-neutral-400 italic text-base">
              {userEmail}
            </span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="text-blue-950 hover:text-blue-600 text-2xl"
        >
          <FaSignOutAlt />
        </button>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  onLogout: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  userEmail: PropTypes.string.isRequired,
};

export default Navbar;
