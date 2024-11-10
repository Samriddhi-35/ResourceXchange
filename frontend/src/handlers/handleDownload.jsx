import axios from "axios";
import getMyIp from "../utils/getmyIp";

const handleDownload = async (fileName, receiverIp) => {
  try {
    const ipAddress = await getMyIp();
    if (!ipAddress) {
      console.error("IP address could not be retrieved.");
      return;
    }

    const response = await axios.post(
      `http://${receiverIp}:5000/download_file`,
      { file_name: fileName, ip_address: ipAddress },
      { responseType: "blob" }
    );

    if (response.status === 200) {
      const blob = new Blob([response.data], {
        type: response.headers["content-type"] || "application/octet-stream",
      });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(link);
    } else {
      console.error(
        `File download failed. Server responded with status: ${response.status}`
      );
    }
  } catch (error) {
    if (error.response) {
      console.error(
        `Download failed with status: ${error.response.status}. ${error.response.data}`
      );
    } else if (error.request) {
      console.error(
        "No response received from the server. Check the network or server status."
      );
    } else {
      console.error("Error in downloading file:", error.message);
    }
  }
};

export default handleDownload;
