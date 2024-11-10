// SAMPLE DATA
import { useState } from "react";

const ClientData = () => {
  const [clients] = useState([
    {
      name: "Client_1",
      usedStorage: "24MB",
      allocatedStorage: "24MB",
      duration: "3 months",
      lastEdited: "11-Feb-2024",
    },
    {
      name: "Client_2",
      usedStorage: "30MB",
      allocatedStorage: "50MB",
      duration: "6 months",
      lastEdited: "01-Mar-2024",
    },
    {
      name: "Client_3",
      usedStorage: "18MB",
      allocatedStorage: "40MB",
      duration: "2 months",
      lastEdited: "15-Apr-2024",
    },
    {
      name: "Client_4",
      usedStorage: "12MB",
      allocatedStorage: "20MB",
      duration: "1 month",
      lastEdited: "30-Apr-2024",
    },
  ]);

  return clients;
};

export default ClientData;
