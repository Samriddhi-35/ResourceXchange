import React from "react";

const ServerRunning = ({ servers }) => {
  return (
    <div className="flex-1 bg-gray-200 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Servers Running Code</h3>
      <ul className="space-y-2">
        {servers.map((server) => (
          <li
            key={server.id}
            className="p-2 bg-white rounded shadow-sm flex justify-between"
          >
            <span>{server.name}</span>
            <span
              className={`${
                server.status === "Online" ? "text-green-500" : "text-gray-500"
              }`}
            >
              {server.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ServerRunning;
