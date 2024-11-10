// StorageData.js
import { Pie } from "react-chartjs-2";
import PropTypes from "prop-types";

const StorageData = ({ totalStorageData, pieChartOptions }) => {
  const usedStorage = totalStorageData.datasets[0].data[2];
  const availableStorage = totalStorageData.datasets[0].data[3];

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center relative aspect-w-1 aspect-h-1">
      <h2 className="text-center text-lg font-semibold text-gray-600 mb-2">
        Total Storage
      </h2>
      <div className="w-full h-full relative">
        <Pie data={totalStorageData} options={pieChartOptions} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-2xl font-bold text-[#163C4C]">{usedStorage}</p>
          <p className="text-sm font-bold text-[#163C4C]">used</p>
          <p className="text-xl font-bold text-[#AFD5E5]">{availableStorage}</p>
          <p className="text-sm font-bold text-[#AFD5E5]">left</p>
        </div>
      </div>
    </div>
  );
};

// PropTypes validation
StorageData.propTypes = {
  totalStorageData: PropTypes.shape({
    labels: PropTypes.arrayOf(PropTypes.string).isRequired,
    datasets: PropTypes.arrayOf(
      PropTypes.shape({
        data: PropTypes.arrayOf(PropTypes.number).isRequired,
        backgroundColor: PropTypes.arrayOf(PropTypes.string).isRequired,
        borderColor: PropTypes.string.isRequired,
        borderWidth: PropTypes.number.isRequired,
        hoverOffset: PropTypes.number,
      })
    ).isRequired,
  }).isRequired,
  pieChartOptions: PropTypes.object.isRequired,
};

export default StorageData;
