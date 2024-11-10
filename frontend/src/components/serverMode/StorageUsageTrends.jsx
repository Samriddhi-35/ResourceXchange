import { Bar } from 'react-chartjs-2';
import PropTypes from 'prop-types';

const StorageUsageTrends = ({ usageTrendsData, clients }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-center text-lg font-semibold text-gray-600 mb-2">
        Storage Usage Trends
      </h2>
      <div className="flex justify-center mb-2">
        <select className="p-2 border border-gray-300 rounded-lg text-gray-700">
          {clients.map((client) => (
            <option key={client.name}>{client.name}</option>
          ))}
        </select>
      </div>
      <div className="h-40">
        <Bar
          data={usageTrendsData}
          options={{ responsive: true, maintainAspectRatio: false }}
        />
      </div>
    </div>
  );
};

// PropTypes validation
StorageUsageTrends.propTypes = {
  usageTrendsData: PropTypes.shape({
    labels: PropTypes.arrayOf(PropTypes.string).isRequired,
    datasets: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        data: PropTypes.arrayOf(PropTypes.number).isRequired,
        backgroundColor: PropTypes.arrayOf(PropTypes.string).isRequired,
        borderColor: PropTypes.string.isRequired,
        borderWidth: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
  clients: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default StorageUsageTrends;

// TODO: Refactoring the logic once the backend is implemented 