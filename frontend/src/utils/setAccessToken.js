import axios from 'axios';

const setAccessToken = accessToken => {
  if (accessToken) {
    axios.defaults.headers.common['Authorization'] = `token ${accessToken}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

export default setAccessToken;
