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

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Browser tidak mendukung geolokasi.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const latlng = L.latLng(pos.coords.latitude, pos.coords.longitude);
        setSelectedPos(latlng);
        if (mapRef.current) {
          mapRef.current.setView(latlng, 16);
        }
      },
      () => {
        alert('Gagal mendapatkan lokasi.');
      },
    );
  };

  useEffect(() => {
    if (!isOpen) {
      setSelectedPos(null);
      setSearch('');
      setSearchResults([]);
    }
  }, [isOpen]);

  return (
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
  );
};

export default LocationPicker;
