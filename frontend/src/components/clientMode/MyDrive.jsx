import { useState, useEffect } from "react";
import axios from "axios";
import UploadModal from "./UploadModal";
import UploadButton from "./UploadButton";
import FileCard from "./FileCard";
import SearchBar from "./SearchBar";
const MyDrive = () => {
  const [myDriveFiles, setMyDriveFiles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [previewFile, setPreviewFile] = useState(null);
  const [filter1Open, setFilter1Open] = useState(false);
  const [filter2Open, setFilter2Open] = useState(false);

  useEffect(() => {
    // Check if files are already cached
    const cachedFiles = sessionStorage.getItem("myDriveFiles");

    if (cachedFiles) {
      setMyDriveFiles(JSON.parse(cachedFiles));
    } else {
      const fetchFilesFromBackend = async () => {
        try {
          const response = await axios.get(
            "http://127.0.0.1:5000/files_from_client"
          );
          if (response.status === 200) {
            const files = response.data.files_info;
            setMyDriveFiles(files);
            sessionStorage.setItem("myDriveFiles", JSON.stringify(files));
          }
        } catch (error) {
          console.error("Error fetching files:", error);
        }
      };

      fetchFilesFromBackend();
    }
  }, []);

  // Filter files based on search criteria
  const filteredFiles = myDriveFiles.filter(
    (file) =>
      file.file_name.toLowerCase().includes(searchValue.toLowerCase()) ||
      (file.email &&
        file.email.toLowerCase().includes(searchValue.toLowerCase()))
  );

  // Handle file upload
  const handleFileUpload = (fileDetails) => {
    const updatedFiles = [...myDriveFiles, fileDetails];
    setMyDriveFiles(updatedFiles);
    sessionStorage.setItem("myDriveFiles", JSON.stringify(updatedFiles));
  };

  const handleFileClick = (file) => {
    setPreviewFile(file);
  };

  const closePreview = () => {
    setPreviewFile(null);
  };

  return (
    <div className="bg-white p-6">
      {/* Search Bar with Filters */}
      <SearchBar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onFilter1Toggle={() => setFilter1Open(!filter1Open)}
        onFilter2Toggle={() => setFilter2Open(!filter2Open)}
      />

      {/* File Display */}
      <h2 className="text-blue-950 font-dm-sans mb-7">My Drive Files</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredFiles.length === 0 ? (
          <p>No files found matching your search criteria.</p>
        ) : (
          filteredFiles.map((file, index) => (
            <FileCard
              key={index}
              fileName={file.file_name}
              email={file.email || "Unknown"}
              type={file.type || "Unknown"}
              content={file.content || "Unknown"}
              onClick={() => handleFileClick(file)}
            />
          ))
        )}
      </div>

      {/* Upload Button */}
      <UploadButton onClick={() => setIsModalOpen(true)} />

      {/* Upload Modal */}
      {isModalOpen && (
        <UploadModal
          onClose={() => setIsModalOpen(false)}
          onFileUpload={handleFileUpload}
        />
      )}
    </div>
  );
};

export default MyDrive;
