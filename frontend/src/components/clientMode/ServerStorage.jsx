function ServerStorage({ serverStorage }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
      {Object.entries(serverStorage).map(([server, storage]) => (
        <div key={server} className="bg-white shadow-md rounded-lg p-4 text-center">
          <div className="text-lg font-semibold">{storage}</div>
          <div className="text-gray-500">{server}</div>
        </div>
      ))}
    </div>
  );
}

export default ServerStorage;
