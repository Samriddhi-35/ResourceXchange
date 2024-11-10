import { Link } from 'react-router-dom'; 
import { FaHome, FaHdd, FaStar, FaChartBar, FaTrash, FaMemory } from 'react-icons/fa'; 

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-blueback text-blue-950 font-dm-sans flex flex-col pt-28 p-4">
      {/* Navigation Links */}
      <nav className="flex flex-col space-y-4">
        <Link 
          to="/" 
          className="flex items-center p-2 text-xl hover:bg-highlight hover:text-white rounded-tl-lg rounded-br-lg border-2 border-transparent hover:border-white transition-all duration-200"
        >
          <FaHome className="mr-2" />
          Home
        </Link>
        <Link 
          to="/mydrive" 
          className="flex items-center p-2 text-xl hover:bg-highlight hover:text-white rounded-tl-lg rounded-br-lg border-2 border-transparent hover:border-white transition-all duration-200"
        >
          <FaHdd className="mr-2" />
          My Drive
        </Link>
        <Link 
          to="/starred" 
          className="flex items-center p-2 text-xl hover:bg-highlight hover:text-white rounded-tl-lg rounded-br-lg border-2 border-transparent hover:border-white transition-all duration-200"
        >
          <FaStar className="mr-2" />
          Starred
        </Link>
        <Link 
          to="/storage" 
          className="flex items-center p-2 text-xl hover:bg-highlight hover:text-white rounded-tl-lg rounded-br-lg border-2 border-transparent hover:border-white transition-all duration-200"
        >
          <FaChartBar className="mr-2" />
          Storage Analytics
        </Link>
        <Link 
          to="/trash" 
          className="flex items-center p-2 text-xl hover:bg-highlight hover:text-white rounded-tl-lg rounded-br-lg border-2 border-transparent hover:border-white transition-all duration-200"
        >
          <FaTrash className="mr-2" />
          Trash
        </Link>
        <Link 
          to="/ramsharing"
          className="flex items-center p-2 text-xl hover:bg-highlight hover:text-white rounded-tl-lg rounded-br-lg border-2 border-transparent hover:border-white transition-all duration-200"
        >
          <FaMemory className="mr-2" />
          Ramsharing
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
