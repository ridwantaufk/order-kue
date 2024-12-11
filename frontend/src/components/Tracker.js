import { useEffect } from 'react';
import axios from 'axios';

const Tracker = ({ page }) => {
  useEffect(() => {
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/api/visitors`, { page })
      .then(() => console.log('Visit recorded'))
      .catch((error) => console.error('Error recording visit:', error));
  }, [page]);

  return null;
};

export default Tracker;
