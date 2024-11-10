const prepareUsageTrendsData = () => ({
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  datasets: [
    {
      label: "Storage Usage",
      data: [12, 19, 3, 5, 2, 3, 9],
      backgroundColor: [
        "#163C4C",
        "#AFD5E5",
        "#60AACA",
        "#AFD5E5",
        "#163C4C",
        "#AFD5E5",
        "#60AACA",
      ],
      borderColor: "#163C4C",
      borderWidth: 1,
    },
  ],
});

export default prepareUsageTrendsData;

// TODO: Refactor once the backend is implemented
