import { useState, useEffect } from "react";
import axios from "axios";
import UploadModal from "../components/clientMode/UploadModal";
import UploadButton from "../components/clientMode/UploadButton";
import FileCard from "../components/clientMode/FileCard";
import SearchBar from "../components/clientMode/SearchBar";
import handleDownload from "../handlers/handleDownload";
import handleDelete from "../handlers/handleDelete";

const Home = () => {
  const [recentFiles, setRecentFiles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [previewFile, setPreviewFile] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Fetch files from backend on component mount with caching
  useEffect(() => {
    const cachedFiles = localStorage.getItem("cachedRecentFiles");
    const fetchFilesFromClient = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:5000/files_from_client"
        );
        if (response.status === 200) {
          // Store only the file_name and receiver_ip fields
          const filesWithIPs = response.data.files_info.map((file) => ({
            file_name: file.file_name,
            receiver_ip: file.receiver_ip,
          }));
          setRecentFiles(filesWithIPs);

          // Check if receiver IPs and file names are stored correctly
          console.log(
            "Fetched files (file_name and receiver_ip only):",
            filesWithIPs
          );
        }
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    if (cachedFiles) {
      // Use cached files if available
      setRecentFiles(JSON.parse(cachedFiles));
      console.log("Loaded files from cache:", JSON.parse(cachedFiles));
    } else {
      // Fetch from server if not cached
      const fetchFilesFromClient = async () => {
        try {
          const response = await axios.get("http://127.0.0.1:5000/files_from_client");
          if (response.status === 200) {
            // Store only the file_name and receiver_ip fields
            const filesWithIPs = response.data.files_info.map((file) => ({
              file_name: file.file_name,
              receiver_ip: file.receiver_ip
            }));
            setRecentFiles(filesWithIPs);

            // Store files in local storage for caching
            localStorage.setItem("cachedRecentFiles", JSON.stringify(filesWithIPs));

            // Check if receiver IPs and file names are stored correctly
            console.log("Fetched files (file_name and receiver_ip only):", filesWithIPs);
          }
        } catch (error) {
          console.error("Error fetching files:", error);
        }
      };

      fetchFilesFromClient();
    }
  }, []);

  // Filter files based on search value (only by file_name as email is no longer included)
  const filteredFiles = recentFiles.filter((file) =>
    file.file_name.toLowerCase().includes(searchValue.toLowerCase())
  );

 const handleDownload = async (fileName, receiverIp) => {
  try {
    // Send POST request to download file
    const response = await axios.post(
      `http://${receiverIp}:5000/download_file`,
      { file_name: fileName, ip_address: receiverIp },
      { responseType: 'blob' } // Ensure response is received as a Blob
    );

    // Check if the response is successful
    if (response.status === 200) {
      // Create a blob from the response data
      const blob = new Blob([response.data], { type: response.headers['content-type'] || 'application/octet-stream' });

      // Generate a temporary URL for the Blob
      const downloadUrl = window.URL.createObjectURL(blob);

      // Create a link element to trigger the download
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName; // Set the filename for the download
      document.body.appendChild(link); // Append link to the body
      link.click(); // Programmatically click to trigger download
      
      // Clean up by revoking the object URL and removing the link
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(link);
    } else {
      console.error(`File download failed. Server responded with status: ${response.status}`);
    }
  } catch (error) {
    if (error.response) {
      // Handle error if server responds with a non-2xx status
      console.error(`Download failed with status: ${error.response.status}. ${error.response.data}`);
    } else if (error.request) {
      // Handle case where request was made but no response was received
      console.error("No response received from the server. Check the network or server status.");
    } else {
      // Handle other errors
      console.error("Error in downloading file:", error.message);
    }
  }
};
  const handleFileClick = (file) => {
    setSelectedFile(file);
  };

  return (
    <div className="bg-white p-6">
      {/* Search and Filters */}
      <SearchBar searchValue={searchValue} onSearchChange={setSearchValue} />

      {/* Recent Files Section */}
      <h2 className="text-blue-950 font-dm-sans mb-7">Recent Files</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredFiles.length === 0 ? (
          <p>No files found matching your search criteria.</p>
        ) : (
          filteredFiles.map((file, index) => (
            <FileCard
              key={index}
              fileName={file.file_name}
              receiverIp={file.receiver_ip}
              onClick={() => handleFileClick(file)}
              onDownload={(fileName, receiverIp) =>
                handleDownload(fileName, receiverIp)
              }
              onDelete={(fileName, receiverIp) =>
                handleDelete(fileName, receiverIp)
              }
            />
          ))
        )}
      </div>

      {/* Upload Button and Modals */}
      <UploadButton onClick={() => setIsModalOpen(true)} />
      {isModalOpen && <UploadModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default Home;

