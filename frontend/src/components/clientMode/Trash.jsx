import React, { useState, useEffect } from "react";
import axios from "axios";
import FileCard from "./FileCard";  // Assuming FileCard component exists
import SearchBar from "./SearchBar"; 
import getMyIp from "../../utils/getmyIp"; // Assuming SearchBar component exists

const Trash = () => {
  const [trashedFiles, setTrashedFiles] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  // Fetch trashed files from the backend
  const fetchTrashedFiles = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/get_trashed_files`);
      if (response.status === 200) {
        setTrashedFiles(response.data.trashed_files); // Store the trashed files in state
      }
    } catch (error) {
      console.error("Error fetching trashed files:", error);
    }
  };
  

  useEffect(() => {
    fetchTrashedFiles();  // Fetch trashed files when the component mounts
  }, []);

  console.log(trashedFiles);
const filteredFiles = trashedFiles.filter((file) => {
  console.log(file); // Log each file to see its structure
  if (file && file.file_name) {
    return file.file_name.toLowerCase().includes(searchValue.toLowerCase());
  }
  return false;
});


  return (
    <div className="bg-white p-6">
      <SearchBar searchValue={searchValue} onSearchChange={setSearchValue} />
      <h2 className="text-blue-950 font-dm-sans mb-4">Trashed Files</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {trashedFiles.length === 0 ? (
          <p>No trashed files.</p>
        ) : (
          filteredFiles.map((file, index) => (
            <FileCard
              key={index}
              fileName={file.file_name}
              fileSize={file.file_size}
              lastModified={file.end_time} 
              receiverIp={file.receiver_ip}  
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Trash;
