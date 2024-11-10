const ServerCard = ({ name, storage, used, available }) => (
  <div className="bg-white shadow-md rounded-lg p-6 text-center">
    <h3 className="text-xl font-bold text-blue-600">{name}</h3>
    <p className="text-gray-500">Total: {storage}</p>
    <p className="text-gray-500">Used: {used}</p>
    <p className="text-gray-500">Available: {available}</p>
  </div>
);

export default ServerCard;
