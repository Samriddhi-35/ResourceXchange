// Client Table
// Updated ClientDetails component
import PropTypes from "prop-types";

const ClientDetails = ({ clients }) => {
  return (
    <section className="bg-white mt-8 p-8 rounded-lg shadow-lg overflow-x-auto">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-6">
        Client Details
      </h2>
      <table className="min-w-full bg-white text-gray-600 w-full">
        <thead>
          <tr className="border-b border-gray-300 bg-gray-200">
            <th className="px-4 py-4 text-left text-sm md:text-base font-bold text-gray-700">
              Client MAC
            </th>
            <th className="px-4 py-4 text-left text-sm md:text-base font-bold text-gray-700">
              Username
            </th>
            <th className="px-4 py-4 text-left text-sm md:text-base font-bold text-gray-700">
              Storage Usage
            </th>
            <th className="px-4 py-4 text-left text-sm md:text-base font-bold text-gray-700">
              Latest File Uploaded On
            </th>
            <th className="px-4 py-4 text-left text-sm md:text-base font-bold text-gray-700">
              Started Using Storage From
            </th>
          </tr>
        </thead>
        <tbody>
          {clients?.map((client, index) => (
            <tr
              key={index}
              className="border-b border-gray-300 hover:bg-gray-100 transition"
            >
              <td className="px-4 py-4 whitespace-nowrap text-sm md:text-base text-gray-800">
                {client.client_mac}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm md:text-base text-gray-800">
                {client.username}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm md:text-base text-gray-800">
                {client.storage_usage_bytes}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm md:text-base text-gray-800">
                {client.latest_file_start_date || "N/A"}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm md:text-base text-gray-800">
                {client.oldest_file_start_date || "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

ClientDetails.propTypes = {
  clients: PropTypes.arrayOf(
    PropTypes.shape({
      client_mac: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      storage_usage_bytes: PropTypes.number.isRequired,
      latest_file_start_date: PropTypes.string,
      oldest_file_start_date: PropTypes.string,
    })
  ).isRequired,
};

export default ClientDetails;
