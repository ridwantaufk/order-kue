import { useEffect } from 'react';
import axios from 'axios';

const Tracker = ({ page }) => {
  useEffect(() => {
    // Mendapatkan lokasi pengguna dan mengirimkan data
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Mengirim data lokasi dan halaman yang dikunjungi ke backend
          sendLocationAndPageToServer(latitude, longitude, page);
        },
        (error) => {
          console.error('Error getting location: ', error);
          // Tetap kirim data ke server meskipun terjadi error
          sendLocationAndPageToServer(null, null, page);
        },
      );
    } else {
      console.log('Geolocation is not supported by this browser.');
      // Tetap kirim data ke server jika geolocation tidak didukung
      sendLocationAndPageToServer(null, null, page);
    }
  }, [page]);

  const sendLocationAndPageToServer = (latitude, longitude, page) => {
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/api/visitors`, {
        latitude: latitude || null, // Pastikan nilai null jika tidak tersedia
        longitude: longitude || null, // Pastikan nilai null jika tidak tersedia
        page,
      })
      .then((response) => {
        console.log('Location and page sent successfully:', response.data);
      })
      .catch((error) => {
        console.error('Error sending data:', error);
      });
  };

  return null; // Tidak perlu render apa-apa di sini
};

export default Tracker;
