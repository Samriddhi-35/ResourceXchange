import { FaTimes } from "react-icons/fa";
import PropTypes from 'prop-types';
import FileViewer from "react-file-viewer"

const FilePreview = ({ file, onClose }) => {
  console.log("File type:", file.type);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-full h-full">
        <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
          <h3 className="text-xl font-medium"> {file.name}</h3>
          <FaTimes
            className="text-gray-500 cursor-pointer text-4xl p-2 hover:text-white"
            onClick={onClose}
          />
        </div>
        <div className="flex justify-center items-center h-full">
          {file.type === "image" ? (
            <img src={file.content} alt={file.name} className="w-full h-full object-contain" />
          ) : file.name.endsWith(".pdf") ? (
            <iframe src={file.content} title={file.name} className="w-full h-full" />
           ) : file.type === "video" ? (
            <video controls className="w-full max-h-[90vh] object-contain">
              <source src={file.content} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : file.name.endsWith(".docx") ? (
            <div className="w-full h-full overflow-y-auto">
              <FileViewer
                fileType="docx"
                filePath={file.content}
                onError={(e) => console.error("Error displaying file:", e)}
              />
            </div>
         ) : (
            <div className="text-center text-gray-500">Preview not available for this file type.</div>
          )}
          
        </div>
      </div>
    </div>
  );
};

FilePreview.propTypes = {
  file: PropTypes.shape({
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired
  }).isRequired,
  onClose: PropTypes.func.isRequired
};

export default FilePreview;