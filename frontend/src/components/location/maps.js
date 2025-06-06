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

// Patch default icon biar marker muncul
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Komponen ini yang bakal update view peta secara otomatis saat position berubah
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
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef(null);

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
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);
    const latlng = L.latLng(latNum, lonNum);

    // Set posisi terpilih dan otomatis peta akan pindah oleh MapUpdater
    setSelectedPos(latlng);
    setSearchResults([]);
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Browser tidak mendukung geolokasi.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const latlng = L.latLng(pos.coords.latitude, pos.coords.longitude);

        const trySetMap = (retries = 5) => {
          if (mapRef.current) {
            mapRef.current.setView(latlng, 16);
            setSelectedPos(latlng);
          } else if (retries > 0) {
            setTimeout(() => trySetMap(retries - 1), 200);
          } else {
            alert('Gagal menampilkan lokasi di peta. Coba ulangi.');
          }
        };

        trySetMap();
      },
      () => {
        alert('Gagal mendapatkan lokasi.');
      },
    );
  };

  // Reset saat modal ditutup
  useEffect(() => {
    if (!isOpen) {
      setSelectedPos(null);
      setSearch('');
      setSearchResults([]);
      setMapReady(false);
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Pilih Lokasi di Peta</ModalHeader>
        <ModalBody>
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
              isDisabled={!mapRef.current}
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
              style={{ height: '100%', width: '100%' }}
              whenCreated={(mapInstance) => {
                mapRef.current = mapInstance;
                setMapReady(true);
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
  );
};

export default LocationPicker;
