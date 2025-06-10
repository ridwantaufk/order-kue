'use client';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Box,
  Text,
  VStack,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from '@chakra-ui/react';
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';

// Patch icon Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Komponen untuk update peta saat posisi berubah
const MapUpdater = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, 16);
    }
  }, [position, map]);

  return null;
};

const LocationPicker = ({ isOpen, onClose, onSave }) => {
  const [selectedPos, setSelectedPos] = useState(null);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const mapRef = useRef(null);
  const [isLocationEnabled, setIsLocationEnabled] = useState(true); // State untuk cek status lokasi
  const [isAlertOpen, setIsAlertOpen] = useState(false); // State untuk menampilkan alert
  const cancelRef = useRef();

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setSelectedPos(e.latlng);
      },
    });

    return selectedPos ? <Marker position={selectedPos} /> : null;
  };

  const handleSearch = async () => {
    if (!search) return;
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        search,
      )}`,
    );
    const data = await res.json();
    setSearchResults(data);
  };

  const goToPosition = (lat, lon) => {
    const latlng = L.latLng(parseFloat(lat), parseFloat(lon));
    setSelectedPos(latlng);
    setSearchResults([]);
  };

  const checkLocationEnabled = () => {
    if (!navigator.geolocation) {
      alert('Browser tidak mendukung geolokasi.');
      setIsLocationEnabled(false);
      return;
    }

    navigator.permissions.query({ name: 'geolocation' }).then((result) => {
      if (result.state === 'denied') {
        // Lokasi ditolak
        setIsLocationEnabled(false);
        setIsAlertOpen(true); // Tampilkan alert
      } else if (result.state === 'prompt') {
        // Lokasi belum diizinkan
        setIsLocationEnabled(true); // Set true dulu, nanti dicek di getCurrentPosition
      } else {
        // Lokasi diizinkan
        setIsLocationEnabled(true);
      }
    });
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Browser tidak mendukung geolokasi.');
      setIsLocationEnabled(false);
      return;
    }

    // Cek status lokasi sebelum meminta lokasi
    checkLocationEnabled();

    if (!isLocationEnabled) {
      setIsAlertOpen(true); // Pastikan alert ditampilkan jika lokasi tidak aktif
      return;
    }

    // Deteksi Safari dan gunakan requestAuthorization jika tersedia
    if (
      navigator.userAgent.includes('Safari') &&
      navigator.userAgent.includes('Apple')
    ) {
      if (navigator.geolocation.requestAuthorization) {
        navigator.geolocation.requestAuthorization().then((status) => {
          if (status === 'granted') {
            // Izin diberikan
            getGeolocation();
          } else {
            // Izin ditolak
            setIsLocationEnabled(false);
            setIsAlertOpen(true);
          }
        });
      } else {
        // Safari versi lama yang tidak mendukung requestAuthorization
        getGeolocation();
      }
    } else {
      // Browser lain (Chrome, Firefox, Edge, dll.)
      getGeolocation();
    }
  };

  const getGeolocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const latlng = L.latLng(pos.coords.latitude, pos.coords.longitude);
        setSelectedPos(latlng);
        if (mapRef.current) {
          mapRef.current.setView(latlng, 16);
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        if (error.code === error.PERMISSION_DENIED) {
          // User menolak izin lokasi
          setIsLocationEnabled(false);
          setIsAlertOpen(true); // Tampilkan alert
        } else {
          alert('Gagal mendapatkan lokasi.');
        }
      },
    );
  };

  useEffect(() => {
    if (!isOpen) {
      setSelectedPos(null);
      setSearch('');
      setSearchResults([]);
      setIsLocationEnabled(true); // Reset status lokasi saat modal ditutup
      setIsAlertOpen(false); // Pastikan alert tertutup
    } else {
      // Cek status lokasi saat modal dibuka
      checkLocationEnabled();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      checkLocationEnabled();
    }
  }, [isOpen]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent style={{ touchAction: 'auto' }}>
          <ModalHeader>Pilih Lokasi di Peta</ModalHeader>
          <ModalBody style={{ touchAction: 'auto' }}>
            <VStack spacing={3} mb={3}>
              <Input
                placeholder="Cari lokasi (misal: Monas, Jakarta)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button size="sm" onClick={handleSearch}>
                Cari
              </Button>
              <Button
                size="sm"
                colorScheme="green"
                onClick={handleGetCurrentLocation}
                isDisabled={!isLocationEnabled} // Disable button jika lokasi tidak aktif
              >
                Gunakan Lokasi Saya
              </Button>
              {searchResults.length > 0 && (
                <Box
                  w="100%"
                  maxH="100px"
                  overflowY="auto"
                  border="1px solid #eee"
                  borderRadius="md"
                >
                  {searchResults.map((res, idx) => (
                    <Text
                      key={idx}
                      fontSize="sm"
                      p={2}
                      _hover={{ bg: 'gray.100', cursor: 'pointer' }}
                      onClick={() => goToPosition(res.lat, res.lon)}
                    >
                      {res.display_name}
                    </Text>
                  ))}
                </Box>
              )}
            </VStack>

            <Box h="400px" w="100%">
              <MapContainer
                center={[-6.2, 106.8]}
                zoom={13}
                style={{ height: '100%', width: '100%', touchAction: 'auto' }}
                whenCreated={(mapInstance) => {
                  mapRef.current = mapInstance;
                }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationMarker />
                <MapUpdater position={selectedPos} />
              </MapContainer>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={() => {
                if (selectedPos) {
                  onSave(selectedPos);
                  onClose();
                }
              }}
              isDisabled={!selectedPos}
            >
              Pilih Lokasi
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Alert Dialog */}
      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsAlertOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Akses Lokasi Dibutuhkan
            </AlertDialogHeader>

            <AlertDialogBody>
              Untuk menggunakan fitur ini, Anda perlu mengaktifkan layanan
              lokasi pada perangkat Anda dan memberikan izin akses lokasi kepada
              aplikasi ini. Aktifkan lokasi sekarang?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsAlertOpen(false)}>
                Nanti
              </Button>
              <Button
                colorScheme="blue"
                onClick={() => {
                  setIsAlertOpen(false);
                  // Tidak ada cara standar untuk membuka pengaturan lokasi langsung dari browser
                  // Pengguna harus diarahkan secara manual.
                  alert(
                    'Silakan aktifkan lokasi pada pengaturan perangkat Anda.',
                  );
                }}
                ml={3}
              >
                OK
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default LocationPicker;
