import { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
} from "chart.js";

import SearchBar from "../components/serverMode/SearchBar";
import RefreshButton from "../components/serverMode/RefreshButton";
import StorageData from "../components/serverMode/StorageData";
import StorageAllocation from "../components/serverMode/StorageAllocation";
import StorageUsageTrends from "../components/serverMode/StorageUsageTrends";
import ClientDetails from "../components/serverMode/ClientTable";

import prepareStorageAllocationData from "../utils/serverMode/prepareStorageAllocationData";
import prepareUsageTrendsData from "../utils/serverMode/prepareUsageTrendsData";
import pieChartOptions from "../utils/serverMode/pieChartOptions";

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement
);

function ServerDashboard() {
  const [clients, setClients] = useState([]);
  const [storageDetails, setStorageDetails] = useState({
    total_storage: "",
    total_available_space: "",
    total_storage_text: "",
    total_available_space_text: "",
  });
  const [storageAllocationData, setStorageAllocationData] = useState(null);
  const [usageTrendsData, setUsageTrendsData] = useState(null);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:5000/clients_storage_usage"
        );
        const clientData = response.data.clients_storage_usage;
        setClients(clientData);
        setStorageDetails(response.data.storage_details);

        setStorageAllocationData(prepareStorageAllocationData(clientData));
        setUsageTrendsData(prepareUsageTrendsData(clientData));
      } catch (error) {
        console.error("Error fetching client data:", error);
      }
    };
    fetchClientData();
  }, []);

  const totalStorageData = {
    labels: ["Used Storage", "Available Storage"],
    datasets: [
      {
        data: [
          parseFloat(storageDetails.total_storage), // Convert to numerical if stored as string
          parseFloat(storageDetails.total_available_space),
          storageDetails.total_storage_text,
          storageDetails.total_available_space_text,
        ],
        backgroundColor: ["#163C4C", "#AFD5E5"],
        borderColor: "#ffffff",
        borderWidth: 1,
        hoverOffset: 10,
      },
    ],
  };

  return (
    <>
      {/* Search Bar and Refresh Button */}
      <div className="flex justify-center items-center p-6 bg-gray-50 space-x-8">
        <SearchBar />
        <RefreshButton />
      </div>

      <div className="p-6 bg-gray-50 font-sans">
        {/* Dashboard Components */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {/* Storage Data */}
          {storageDetails && (
            <StorageData
              totalStorageData={totalStorageData}
              pieChartOptions={pieChartOptions}
            />
          )}

          {/* Storage Allocation */}
          {storageAllocationData && (
            <StorageAllocation
              storageAllocationData={storageAllocationData}
              pieChartOptions={pieChartOptions}
              clients={clients}
            />
          )}

          {/* Storage Usage Trends */}
          {usageTrendsData && (
            <StorageUsageTrends
              usageTrendsData={usageTrendsData}
              clients={clients}
            />
          )}
        </section>

        {/* Client Details Table */}
        <ClientDetails clients={clients} />
      </div>
    </>
  );
}

export default ServerDashboard;