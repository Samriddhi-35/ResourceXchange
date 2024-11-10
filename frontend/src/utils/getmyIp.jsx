import axios from "axios";

const getMyIp = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/get_my_ip");
      if (response.status === 200) {
        return response.data.ip_address;
      } else {
        console.error("Failed to retrieve IP address.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching IP address:", error.message);
      return null;
    }
  };

export default getMyIp;