import PropTypes from "prop-types";
import { useNavigate } from 'react-router-dom';
import coverImg from "/cover.png";

function ModeSelection({ onModeSelect, onLogout }) {
  const navigate = useNavigate();

  const handleModeSelection = (mode) => {
    alert(`You selected ${mode} Mode`);
    onModeSelect(mode); 
    if (mode === "Client") {
      navigate("/home");
    } else if (mode === "Server") {
      navigate("/server-dashboard");
    }
  };

  const handleLogout = () => {
    // Clear session storage
    sessionStorage.clear();
    
    // Execute any additional logout functionality
    onLogout();
  };

  return (
    <div className="flex items-center justify-center h-screen bg-cover bg-center bg-blue" style={{ backgroundImage: `url(${coverImg})` }}> 
      <div className="w-full max-w-md bg-white bg-opacity-80 p-12 rounded-lg shadow-lg">
        <h2 className="text-5xl font-bold mb-8 text-center text-black">Choose Mode</h2>
        <div className="flex space-x-6 justify-center">
          <button
            onClick={() => handleModeSelection("Client")}
            className="flex flex-col items-center p-8 bg-white border rounded-xl shadow-lg hover:shadow-2xl transition duration-200"
          >
            <svg
              className="w-12 h-12 mb-4 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 0c6.6 0 12 5.4 12 12s-5.4 12-12 12S0 18.6 0 12 5.4 0 12 0zm0 21.8c5.4 0 9.8-4.4 9.8-9.8 0-5.4-4.4-9.8-9.8-9.8-5.4 0-9.8 4.4-9.8 9.8 0 5.4 4.4 9.8 9.8 9.8zm0-7.8c-1.2 0-2.3-.5-3.2-1.3-.8-.8-1.3-1.9-1.3-3.2s.5-2.3 1.3-3.2c.8-.8 1.9-1.3 3.2-1.3s2.3.5 3.2 1.3c.8.8 1.3 1.9 1.3 3.2s-.5 2.3-1.3 3.2c-.8.8-1.9 1.3-3.2 1.3z" />
            </svg>
            <span className="text-2xl font-semibold text-black">Client Mode</span>
          </button>
          <button
            onClick={() => handleModeSelection("Server")}
            className="flex flex-col items-center p-8 bg-white border rounded-xl shadow-lg hover:shadow-2xl transition duration-200"
          >
            <svg
              className="w-12 h-12 mb-4 text-green-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M3 3h18a3 3 0 013 3v12a3 3 0 01-3 3H3a3 3 0 01-3-3V6a3 3 0 013-3zm0 2v12h18V5H3zm16 2h-2v2h2V7zm0 4h-2v2h2v-2zm-4-4H5v2h10V7zm0 4H5v2h10v-2zm-6 4H5v2h4v-2z" />
            </svg>
            <span className="text-2xl font-semibold text-black">Server Mode</span>
          </button>
        </div>
        <button
          onClick={handleLogout}
          className="mt-10 bg-red-500 text-white p-4 rounded-xl hover:bg-red-600 transition duration-200 text-lg w-full"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

ModeSelection.propTypes = {
  onModeSelect: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default ModeSelection;