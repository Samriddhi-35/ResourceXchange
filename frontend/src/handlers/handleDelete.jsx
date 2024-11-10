import axios from "axios";
import getMyIp from "../utils/getmyIp";

const handleDelete = async (fileName, receiverIp) => {
    try {
        const ipAddress = await getMyIp(receiverIp);
        if (!ipAddress) {
          console.error("IP address could not be retrieved.");
          return;
        }
    
        const response = await axios.post(
          `http://${receiverIp}:5000/delete_file`,
          { file_name: fileName, ip_address: ipAddress },
          { responseType: "blob" }
        );

    if (response.status === 200) {
      console.log(response.data.message);  // Success message
      // Optionally, you can remove the file from the UI list or refresh the file list
    } else {
      console.error(`File deletion failed. Server responded with status: ${response.status}`);
    }
  } catch (error) {
    if (error.response) {
      console.error(`Deletion failed with status: ${error.response.status}. ${error.response.data}`);
    } else if (error.request) {
      console.error("No response received from the server. Check the network or server status.");
    } else {
      console.error("Error in deleting file:", error.message);
    }
  }
};

export default handleDelete;
