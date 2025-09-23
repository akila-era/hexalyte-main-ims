import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

async function handleUserLogout() {

  try {
    const response = await axios.post(`${BASE_URL}auth/logout`);
  } catch (error) {
    console.error(error);
  }
}

export default handleUserLogout;