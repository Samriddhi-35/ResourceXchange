import { Pie } from 'react-chartjs-2';
import PropTypes from 'prop-types';

const StorageAllocation = ({ storageAllocationData, pieChartOptions, clients }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center relative square-box">
      <h2 className="text-center text-lg font-semibold text-gray-600 mb-2">
        Storage Allocation
      </h2>
      <div className="w-full h-full relative">
        <Pie data={storageAllocationData} options={pieChartOptions} />
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1">
          {clients.map((client, index) => {
            const colorIndex = index % 4;
            const colors = ["#163C4C", "#2D7797", "#60AACA", "#AFD5E5"];
            return (
              <p
                key={client.name}
                className="text-sm font-bold"
                style={{ color: colors[colorIndex] }}
              >
                {`${client.usedStorage} ${client.name}`}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// PropTypes validation
StorageAllocation.propTypes = {
  storageAllocationData: PropTypes.shape({
    labels: PropTypes.arrayOf(PropTypes.string).isRequired,
    datasets: PropTypes.arrayOf(
      PropTypes.shape({
        data: PropTypes.arrayOf(PropTypes.number).isRequired,
        backgroundColor: PropTypes.arrayOf(PropTypes.string).isRequired,
        borderColor: PropTypes.string.isRequired,
        borderWidth: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
  pieChartOptions: PropTypes.object.isRequired,
  clients: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      usedStorage: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default StorageAllocation;

// TODO: Refactoring the logic and handle hovering once the backend is implemented 
