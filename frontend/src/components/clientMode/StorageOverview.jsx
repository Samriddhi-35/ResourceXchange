import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function StorageOverview({ storageData }) {
  const pieData = {
    labels: ["Used Storage", "Available Storage"],
    datasets: [
      {
        data: [storageData.totalUsed, storageData.totalLeft],
        backgroundColor: ["#4A90E2", "#D1E8FF"],
        hoverBackgroundColor: ["#357ABD", "#B5D7FF"],
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      <div className="bg-white shadow-md rounded-lg p-6 text-center">
        <Pie data={pieData} />
        <div className="mt-4 text-xl font-bold text-blue-600">{storageData.totalUsed}GB used</div>
        <div className="text-gray-500">{storageData.totalLeft}GB left</div>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6 text-center">
        <div className="text-2xl font-bold text-blue-600">{storageData.totalFiles}</div>
        <div className="text-gray-500">total files on drive</div>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6 text-center">
        <div className="text-2xl font-bold text-blue-600">{storageData.totalFolders}</div>
        <div className="text-gray-500">total folders on drive</div>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6 text-center">
        <div className="text-2xl font-bold text-blue-600">{storageData.totalServers}</div>
        <div className="text-gray-500">total servers on drive</div>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6 text-center">
        <div className="text-2xl font-bold text-blue-600">{storageData.maxFileSize}</div>
        <div className="text-gray-500">maximum file size</div>
      </div>
    </div>
  );
}

export default StorageOverview;
