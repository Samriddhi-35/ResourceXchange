import { useState } from 'react';
import PropTypes from 'prop-types';
import addFile from '/add-file.svg';
import axios from 'axios';

const UploadModal = ({ onClose, onFileUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const [dragging, setDragging] = useState(false);

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setUploadMessage('');
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadMessage('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

   try {
   setUploadMessage('Uploading...');
   const response = await axios.post("http://127.0.0.1:5000/send", formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
   });
   
   if (response.status === 200) {
      setUploadMessage(`File "${selectedFile.name}" uploaded successfully!`);
   }

   if (onFileUpload) {
      onFileUpload({
         name: selectedFile.name,
         email: "velmajane@gmail.com",
         type: selectedFile.type.split('/')[0],
         content: URL.createObjectURL(selectedFile),
      });
   }

   // Reset file selection and close modal after upload
   setSelectedFile(null);
   setTimeout(onClose, 1000);
} catch (error) {
   console.log("Upload Error:", error);
   setUploadMessage('Failed to upload file.');
}

  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    if (!dragging) setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setUploadMessage('');
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-3xl mx-4 relative">
        <h2 className="text-2xl font-semibold mb-6 text-center">Upload Files</h2>

        {/* Drag and Drop Zone */}
        <div
          className={`border border-gray-200 rounded-lg p-6 space-y-6 text-center ${dragging ? 'border-blue-400' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <p className="text-sm text-gray-500 mb-4">
            Drag or Select files to Upload
          </p>

          {/* SVG image for file input */}
          <div className="mb-4">
            <img
              src={addFile} 
              alt="Add file"
              className="mx-auto mb-4 cursor-pointer"
              onClick={() => document.getElementById('file-input').click()}
            />
            <input
              type="file"
              id="file-input"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {selectedFile && ( 
            <div className="text-gray-600 mb-4">
              <p>Selected file: {selectedFile.name}</p>
            </div>
          )}

          <div className="flex sm:flex-col sm:w-full space-x-4 sm:space-x-0 sm:space-y-4">

            <div className="flex-1">
              <button
                onClick={handleUpload}
                className="px-6 py-3 rounded-lg w-full text-xl bg-[#2D7797] text-[#ffffff] shadow-md hover:bg-[#D4E7F0] hover:text-[#2D7797] transition-all"
              >
                Upload
              </button>
            </div>
          </div>
        </div>

        {/* Upload Status */}
        {uploadMessage && (
          <div className="mt-4 text-center">
            <p className={`text-lg ${uploadMessage.includes("successfully") ? 'text-green-500' : 'text-red-500'}`}>
              {uploadMessage}
            </p>
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl text-gray-600 hover:text-gray-900"
        >
          ×
        </button>
      </div>
    </div>
  );
};

UploadModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onFileUpload: PropTypes.func.isRequired,
};

export default UploadModal;
