import './assets/css/App.css';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin';
import { ChakraProvider, useToast } from '@chakra-ui/react';
import initialTheme from './theme/theme';
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import NotFound from 'pages/NotFound';

export default function Main() {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);
  const [data, setData] = useState([]); // State untuk menyimpan data
  const navigate = useNavigate();
  const toast = useToast();

  // useEffect(() => {
  //   console.log('token : ', localStorage.getItem('token'));
  //   if (localStorage.getItem('token')) {
  //     console.log(
  //       'sesi token : ',
  //       jwtDecode(localStorage.getItem('token')).exp - Date.now() / 1000,
  //     );
  //     const decodedToken1 = jwtDecode(localStorage.getItem('token'));
  //     console.log('decodedToken1 : ', decodedToken1);
  //     const tes = setInterval(() => {
  //       const currentTime1 = Date.now() / 1000;
  //       const expiresIn1 = decodedToken1.exp - currentTime1;
  //       console.log('Sisa waktu: ', expiresIn1);

  //       // Jika token sudah expired, clear interval dan arahkan ke login
  //       if (expiresIn1 <= 0) {
  //         clearInterval(tes); // Menghentikan interval
  //         alert('Sesi habis. Silahkan masuk kembali.');
  //         localStorage.removeItem('tes');
  //       }
  //     }, 1000); // Setiap 1 detik untuk cek sisa waktu

  //     // Bersihkan interval saat komponen dilepas
  //     return () => clearInterval(tes);
  //   }
  // }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      const expiresIn = decodedToken.exp - currentTime;

      if (expiresIn > 0) {
        const timeout = setTimeout(() => {
          toast({
            title: 'Sesi Berakhir',
            description: 'Sesi habis. Silahkan masuk kembali.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          localStorage.clear();
          navigate('/auth/sign-in', { replace: true });
        }, expiresIn * 1000);

        return () => clearTimeout(timeout); // Clear timer saat komponen dilepas
      } else {
        toast({
          title: 'Sesi Berakhir',
          description: 'Sesi habis. Silahkan masuk kembali.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        localStorage.clear();
        navigate('/auth/sign-in', { replace: true });
      }
    }
  }, [navigate, toast]);

  return (
    <ChakraProvider theme={currentTheme}>
      <Routes>
        <Route path="auth/*" element={<AuthLayout />} />
        <Route
          path="admin/*"
          element={
            <AdminLayout
              theme={currentTheme}
              setTheme={setCurrentTheme}
              data={data} // Kirim data ke AdminLayout
            />
          }
        />
        <Route
          path="orderan/"
          element={
            <AdminLayout
              theme={currentTheme}
              setTheme={setCurrentTheme}
              data={data} // Kirim data ke AdminLayout
            />
          }
        />
        <Route path="/" element={<Navigate to="/orderan" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ChakraProvider>
  );
}
