import { FaShare, FaStar, FaTrash, FaDownload, FaEdit } from "react-icons/fa";
import PropTypes from "prop-types";
import { useState } from "react";
import getFileIcon from "../../utils/clientMode/getFileIcon";

const FileCard = ({
  fileName,
  fileSize,
  lastModified,
  receiverIp,
  onClick,
  onDownload,
  onDelete
}) => {
  const [isStarred, setIsStarred] = useState(false);

  // Toggle starred state
  const toggleStar = () => {
    setIsStarred(!isStarred);
  };

 

  return (
    <div className="bg-blueback p-7 rounded-lg shadow-md w-64 relative cursor-pointer">
      <div className="absolute top-2 right-2">
        <FaDownload
          className="cursor-pointer text-gray-500 hover:text-blue-500 transition-colors"
          onClick={() => onDownload(fileName, receiverIp)}
        />
      </div>

      <div
        className="flex justify-center items-center h-32 bg-white rounded-md mb-4"
        onClick={() => onClick(fileName)}
      >
        {getFileIcon(fileName)}
      </div>
      <div className="text-left">
        <p className="text-sm font-medium text-gray-800 overflow-hidden text-ellipsis whitespace-nowrap">
          {fileName}
        </p>
        <p className="text-xs text-gray-500">Size: {fileSize}</p>
        <p className="text-xs text-gray-500">Last Modified: {lastModified}</p>
      </div>
      <div className="absolute bottom-2 right-2 flex space-x-2">
        <FaStar
          className={`cursor-pointer ${
            isStarred ? "text-yellow-500" : "text-gray-500"
          }`}
          onClick={toggleStar}
        />
        <FaTrash
          className="cursor-pointer text-gray-500 hover:text-red-500 transition-colors"
          onClick={() => onDelete(fileName, receiverIp)}
        />
        <FaShare
          className="cursor-pointer text-gray-500 hover:text-green-500 transition-colors"
          onClick={() => onClick(fileName)} // Fix: Use onClick instead of onclick
        />
        <FaEdit
          className="cursor-pointer text-gray-500 hover:text-green-500 transition-colors"
          onClick={() => onClick(fileName)} // Fix: Use onClick instead of onclick
        />
      </div>
    </div>
  );
};

FileCard.propTypes = {
  fileName: PropTypes.string.isRequired,
  fileSize: PropTypes.string.isRequired,
  lastModified: PropTypes.string.isRequired,
  receiverIp: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired, 
  onDelete: PropTypes.func.isRequired,
};

export default FileCard;