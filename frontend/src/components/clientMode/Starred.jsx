import { useState } from "react";
import FileCard from "./FileCard";
import SearchBar from "./SearchBar";
import starredData from "./Starred.json";

const Starred = () => {
  const [starredFiles, setStarredFiles] = useState(starredData.starredFiles);
  const [starredFolders, setStarredFolders] = useState(starredData.starredFolders);

  const [filter1Open, setFilter1Open] = useState(false);
  const [filter2Open, setFilter2Open] = useState(false);
  const [selectedFilter1, setSelectedFilter1] = useState(null);
  const [selectedFilter2, setSelectedFilter2] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  // Placeholder function to toggle the "starred" status of a file
  const toggleStar = (fileName) => {
    setStarredFiles((prevFiles) =>
      prevFiles.map((file) =>
        file.name === fileName ? { ...file, starred: !file.starred } : file
      )
    );
  };

  return (
    <div className="bg-white p-6">
      {/* Search and Filters */}
      <SearchBar 
        searchValue={searchValue} 
        onSearchChange={setSearchValue}
        filter1Text={selectedFilter1}
        onFilter1Toggle={() => setFilter1Open(!filter1Open)}
        filter2Text={selectedFilter2}
        onFilter2Toggle={() => setFilter2Open(!filter2Open)}
      />

      {/* Starred Files Section */}
      <h2 className="text-blue-950 font-dm-sans mb-4">Starred Files</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {starredFiles
          .filter(file => file.name.toLowerCase().includes(searchValue.toLowerCase())) // Apply search filter
          .map((file, index) => (
            <FileCard 
              key={index} 
              fileName={file.name} 
              email={file.email} 
              onStar={() => toggleStar(file.name)} 
              isStarred={file.starred} 
            />
          ))}
      </div>
    </div>
  );
};

export default Starred;
