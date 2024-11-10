import { useState } from "react";
import storageData from "./storageData.json"; 
import StorageOverview from "./StorageOverview";
import ServerStorage from "./ServerStorage";
import FileList from "./FileList";
import SearchBar from "./SearchBar"; 

function StorageAnalytics() {
  const [searchValue, setSearchValue] = useState(""); 
  const [selectedFilter1, setSelectedFilter1] = useState(null); 
  const [selectedFilter2, setSelectedFilter2] = useState(null); 
  const [filter1Open, setFilter1Open] = useState(false);
  const [filter2Open, setFilter2Open] = useState(false);

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

      <h1 className="text-2xl font-semibold mb-6">Storage Analytics</h1>

      {/* Storage Overview Section */}
      <StorageOverview storageData={storageData} />

      {/* Server Storage Section */}
      <ServerStorage serverStorage={storageData.serverStorage} />

      {/* File List Section */}
      <FileList files={storageData.fileData} />
    </div>
  );
}

export default StorageAnalytics;
