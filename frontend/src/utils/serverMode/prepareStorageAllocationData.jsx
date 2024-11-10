const prepareStorageAllocationData = (clients) => ({
  labels: clients.map((client) => client.name),
  datasets: [
    {
      data: clients.map((client) => parseInt(client.usedStorage)),
      backgroundColor: ["#163C4C", "#2D7797", "#60AACA", "#AFD5E5"],
      borderColor: "#FFFFFF",
      borderWidth: 2,
    },
  ],
});

export default prepareStorageAllocationData;

// TODO: Refactor once the backend is implemented
