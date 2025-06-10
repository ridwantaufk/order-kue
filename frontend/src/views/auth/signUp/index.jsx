import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Text,
  useColorModeValue,
  Select,
  Textarea,
} from '@chakra-ui/react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DefaultAuth from 'layouts/auth/Default';
import illustration from 'assets/img/auth/auth.png';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';
import axios from 'axios';

function SignUp() {
  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = 'gray.400';
  const brandStars = useColorModeValue('brand.500', 'brand.400');
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    age: '',
    birth_date: '',
    phone_number: '',
    address: '',
    username: '',
    password: '',
    role: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'name') {
      setForm({
        ...form,
        [name]: value.replace(/\b\w/g, (char) => char.toUpperCase()),
      });
    } else if (name === 'birth_date') {
      const birthDate = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      setForm({
        ...form,
        birth_date: value,
        age: age >= 0 ? age : '', // biar ga negatif
      });
    } else if (name === 'phone_number') {
      // Hanya izinkan angka
      const numericValue = value.replace(/\D/g, '');
      setForm({ ...form, [name]: numericValue });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    setError('');

    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/register`,
        form,
      );
      toast.success('Registrasi berhasil! Silakan login.', {
        position: 'top-right',
      });
      setTimeout(() => navigate('/auth/sign-in'), 500);
    } catch (err) {
      const message =
        err?.response?.data?.message || 'Terjadi kesalahan saat registrasi.';
      setError(message);
      toast.error(message, { position: 'top-right' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultAuth illustrationBackground={illustration} image={illustration}>
      <ToastContainer />
      {loading ? (
        <Center h="100vh">
          <Spinner size="xl" color="blue.500" />
        </Center>
      ) : (
        <Flex
          maxW={{ base: '100%', md: 'max-content' }}
          w="100%"
          mx={{ base: 'auto', lg: '0px' }}
          me="auto"
          h="100%"
          alignItems="start"
          justifyContent="center"
          mb={{ base: '30px', md: '60px' }}
          px={{ base: '25px', md: '0px' }}
          mt={{ base: '40px', md: '6vh' }}
          flexDirection="column"
        >
          <Flex
            zIndex="2"
            direction="column"
            w={{ base: '100%', md: '420px' }}
            maxW="100%"
            background="transparent"
            borderRadius="15px"
            mx={{ base: 'auto', lg: 'unset' }}
            me="auto"
            mb={{ base: '20px', md: 'auto' }}
          >
            <Heading mb="6" color={textColor}>
              Registrasi
            </Heading>

            <Flex mb="24px" gap="16px">
              <FormControl flex="1" isRequired>
                <FormLabel color={textColor} fontWeight="500" mb="8px">
                  Nama Lengkap
                </FormLabel>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  type="text"
                  placeholder="Nama Lengkap"
                  size="lg"
                  fontSize="sm"
                  borderRadius="md"
                  required
                />
              </FormControl>

              <FormControl flex="1" isRequired>
                <FormLabel color={textColor} fontWeight="500" mb="8px">
                  Username
                </FormLabel>
                <Input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  type="text"
                  placeholder="Username"
                  size="lg"
                  fontSize="sm"
                  borderRadius="md"
                  required
                />
              </FormControl>
            </Flex>

            <Flex mb="24px" gap="16px">
              <FormControl flex="7">
                <FormLabel color={textColor} fontWeight="500" mb="8px">
                  Tanggal Lahir
                </FormLabel>
                <Input
                  name="birth_date"
                  value={form.birth_date}
                  onChange={handleChange}
                  type="date"
                  placeholder="Tanggal Lahir"
                  size="lg"
                  fontSize="sm"
                  borderRadius="md"
                />
              </FormControl>

              <FormControl flex="3">
                <FormLabel color={textColor} fontWeight="500" mb="8px">
                  Umur
                </FormLabel>
                <Input
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  type="number"
                  placeholder="Umur"
                  size="lg"
                  fontSize="sm"
                  borderRadius="md"
                  readOnly
                />
              </FormControl>
            </Flex>

            <Flex mb="24px" gap="16px">
              <FormControl flex="4">
                <FormLabel color={textColor} fontWeight="500" mb="8px">
                  No. HP
                </FormLabel>
                <Input
                  name="phone_number"
                  value={form.phone_number}
                  onChange={handleChange}
                  type="tel"
                  maxLength={12}
                  placeholder="08xxxxxxxx"
                  size="lg"
                  fontSize="sm"
                  borderRadius="md"
                />
              </FormControl>

              <FormControl flex="6">
                <FormLabel color={textColor} fontWeight="500" mb="8px">
                  Alamat
                </FormLabel>
                <Textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Alamat"
                  size="lg"
                  fontSize="sm"
                  borderRadius="md"
                />
              </FormControl>
            </Flex>

            <FormControl mb="24px" isRequired>
              <FormLabel color={textColor} fontWeight="500" mb="8px">
                Password
              </FormLabel>
              <InputGroup size="md">
                <Input
                  type={show ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 8 karakter"
                  size="lg"
                  fontSize="sm"
                  borderRadius="md"
                  required
                />
                <InputRightElement>
                  <Icon
                    as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                    onClick={() => setShow(!show)}
                    cursor="pointer"
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <FormControl mb="24px" isRequired>
              <FormLabel color={textColor} fontWeight="500" mb="8px">
                Role
              </FormLabel>
              <Select
                name="role"
                value={form.role}
                onChange={handleChange}
                placeholder="Pilih role"
                size="lg"
                fontSize="sm"
                borderRadius="md"
              >
                <option value="Developer">Developer</option>
                <option value="Admin">Admin</option>
                <option value="Super Admin">Super User</option>
              </Select>
            </FormControl>

            {error && (
              <Text color="red.500" fontSize="sm" mb="6">
                {error}
              </Text>
            )}

            <Button
              fontSize="sm"
              variant="brand"
              fontWeight="500"
              w="100%"
              h="50px"
              mb="24px"
              onClick={handleSignUp}
            >
              Daftar
            </Button>

            <Flex direction="column" align="center" mt="4">
              <Text fontSize="sm" color={textColorSecondary}>
                Sudah punya akun?{' '}
                <Text
                  as="span"
                  color="blue.500"
                  cursor="pointer"
                  fontWeight="medium"
                  onClick={() => navigate('/auth/sign-in')}
                >
                  Masuk di sini
                </Text>
              </Text>
            </Flex>
          </Flex>
        </Flex>
      )}
    </DefaultAuth>
  );
}

export default SignUp;
