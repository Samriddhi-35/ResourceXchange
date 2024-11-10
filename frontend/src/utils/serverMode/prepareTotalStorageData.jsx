const prepareTotalStorageData = () => ({
  labels: ["Used", "Left"],
  datasets: [
    {
      data: [70, 30],
      backgroundColor: ["#163C4C", "#AFD5E5"],
      borderColor: "#FFFFFF",
      borderWidth: 2,
      hoverOffset: 4,
    },
  ],
});

export default prepareTotalStorageData;

// TODO: Refactor once the backend is implemented
