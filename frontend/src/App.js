import './assets/css/App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin';
import { ChakraProvider } from '@chakra-ui/react';
import initialTheme from './theme/theme';
import { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios

export default function Main() {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);
  const [data, setData] = useState([]); // State untuk menyimpan data

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
        <Route path="/" element={<Navigate to="/admin" replace />} />
      </Routes>
    </ChakraProvider>
  );
}
