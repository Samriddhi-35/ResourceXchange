import { FaImage, FaFilePdf, FaFileVideo, FaFileAlt } from 'react-icons/fa';

const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'bmp':
        return <FaImage className="text-blue-400 text-6xl" />;
      case 'pdf':
        return <FaFilePdf className="text-red-500 text-6xl" />;
      case 'mp4':
      case 'avi':
      case 'mov':
        return <FaFileVideo className="text-purple-500 text-6xl" />;
      case 'txt':
        return <FaFileAlt className="text-green-500 text-6xl" />;
      default:
        return <FaFileAlt className="text-gray-400 text-6xl" />;
    }
  };

export default getFileIcon;