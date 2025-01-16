import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  useColorModeValue,
  Input,
} from '@chakra-ui/react';
import Card from 'components/card/Card.js';
import axios from 'axios';
import { useToast } from '@chakra-ui/react';
import _ from 'lodash'; // lodash untuk memudahkan perbandingan objek

export default function Banner(props) {
  const toast = useToast();
  const { banner, avatar } = props;
  const [userData, setUserData] = useState({
    username: '',
    name: '',
    age: '',
    position: '',
    created_at: '',
    password: '',
    editing: null,
  });

  const [userDataEditing, setUserDataEditing] = useState(userData);

  const inputRefs = React.useRef({
    username: null,
    name: null,
    age: null,
    created_at: null,
  });

  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = 'gray.400';
  const borderColor = useColorModeValue(
    'white !important',
    '#111C44 !important',
  );

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${
            process.env.REACT_APP_BACKEND_URL
          }/api/users/privateUser/${localStorage.getItem('user_id')}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'ngrok-skip-browser-warning': 'true',
            },
          },
        );
        setUserData({
          username: response.data.username,
          name: response.data.name,
          age: `${response.data.age} Tahun`,
          position: 'Admin',
          created_at: new Date(response.data.created_at).toLocaleDateString(),
          password: response.data.password,
        });
        setUserDataEditing({
          username: response.data.username,
          name: response.data.name,
          age: `${response.data.age} Tahun`,
          position: 'Admin',
          created_at: new Date(response.data.created_at).toLocaleDateString(),
          password: response.data.password,
          editing: null,
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleEdit = (field) => {
    setUserData({ ...userData, editing: field });
    inputRefs.current[field]?.focus();
  };

  const handleChange = (field, value) => {
    if (field === 'age' && isNaN(value)) {
      toast({
        title: 'Error',
        description: 'Umur hanya boleh berupa angka.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    } else {
      setUserData({ ...userData, [field]: value });
    }
  };

  const handleBlur = async (field) => {
    if (!_.isEqual(userDataEditing[field], userData[field])) {
      try {
        const updatedData = { [field]: userData[field] };
        await axios.put(
          `${
            process.env.REACT_APP_BACKEND_URL
          }/api/users/privateUser/${localStorage.getItem('user_id')}`,
          updatedData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'ngrok-skip-browser-warning': 'true',
            },
          },
        );

        toast({
          title: 'Berhasil Disimpan',
          description: `Field ${field} telah diperbarui.`,
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      } catch (error) {
        console.error(`Error updating ${field}:`, error);
      } finally {
        setUserData({ ...userData, editing: null });
        setUserDataEditing({ ...userData });
      }
    } else {
      // Jika tidak ada perubahan, set kembali ke mode non-editing
      setUserData({ ...userData, editing: null });
    }
  };

  const handleKeyDown = async (e, field) => {
    if (e.key === 'Enter') {
      if (_.isEqual(userDataEditing[field], userData[field])) {
        setUserData({ ...userData, editing: null });
        e.preventDefault();
        return;
      }

      try {
        const updatedData = { [field]: userData[field] };
        await axios.put(
          `${
            process.env.REACT_APP_BACKEND_URL
          }/api/users/privateUser/${localStorage.getItem('user_id')}`,
          updatedData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'ngrok-skip-browser-warning': 'true',
            },
          },
        );

        toast({
          title: 'Berhasil Disimpan',
          description: `Field ${field} telah diperbarui.`,
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      } catch (error) {
        console.error(`Error updating ${field}:`, error);
      } finally {
        setUserData({ ...userData, editing: null });
        e.preventDefault();
      }
    } else if (e.key === 'Escape') {
      setUserData({ ...userData, editing: null });
    }
  };

  const formatDate = (dateString) => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <Card mb={{ base: '0px', lg: '20px' }} align="center">
      <Box
        bg={`url(${banner})`}
        bgSize="cover"
        borderRadius="16px"
        h={{ base: '20vh', md: '30vh', lg: '40vh' }}
        w="100%"
      />
      <Avatar
        mx="auto"
        src={avatar}
        h={{ base: '100px', md: '200px', lg: '200px' }}
        w={{ base: '100px', md: '200px', lg: '200px' }}
        mt={{ base: '-60px', md: '-120px', lg: '-120px' }}
        border="4px solid"
        borderColor={borderColor}
      />
      <Text color={textColorPrimary} fontWeight="bold" fontSize="xl" mt="10px">
        {userData.name}
      </Text>
      <Text color={textColorSecondary} fontSize="sm">
        Admin
      </Text>
      <Flex
        direction="column"
        mx="auto"
        mt="26px"
        p="20px"
        bg={useColorModeValue('gray.100', 'gray.700')}
        borderRadius="12px"
        boxShadow="md"
        w="100%"
        maxW="600px"
      >
        <Table variant="striped" width="100%">
          <Tbody>
            {[
              { label: 'Username', key: 'username' },
              { label: 'Nama', key: 'name' },
              { label: 'Umur', key: 'age' },
              { label: 'Tanggal Dibuat', key: 'created_at' },
              { label: 'Jabatan', key: 'position' },
              { label: 'Kata Sandi', key: 'password' },
            ].map((field) => (
              <Tr key={field.key}>
                <Td width={'40%'} h="75px">
                  {field.label}
                </Td>
                <Td width={'10%'} h="75px">
                  :
                </Td>
                <Td width={'40%'} h="75px">
                  {userData.editing === field.key &&
                  field.key !== 'created_at' &&
                  field.key !== 'position' ? (
                    <Input
                      ref={(el) => (inputRefs.current[field.key] = el)}
                      size="md"
                      value={
                        field.key === 'age'
                          ? userData[field.key].split(' ')[0]
                          : userData[field.key]
                      }
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      onBlur={() => handleBlur(field.key)}
                      onKeyDown={(e) => handleKeyDown(e, field.key)}
                      autoFocus
                      padding="4px"
                      h="60%"
                      w="60%"
                    />
                  ) : (
                    <Text
                      cursor="pointer"
                      onClick={() => {
                        if (
                          field.key !== 'created_at' &&
                          field.key !== 'position'
                        ) {
                          handleEdit(field.key);
                        }
                      }}
                    >
                      {field.key === 'password'
                        ? '********'
                        : field.key === 'created_at'
                        ? formatDate(userData[field.key])
                        : userData[field.key]}
                    </Text>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Flex>
    </Card>
  );
}
