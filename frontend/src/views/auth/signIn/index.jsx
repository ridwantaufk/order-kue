import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Chakra imports
import {
  Box,
  Button,
  Center,
  Checkbox,
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
} from '@chakra-ui/react';
// Custom components
import { HSeparator } from 'components/separator/Separator';
import DefaultAuth from 'layouts/auth/Default';
// Assets
import illustration from 'assets/img/auth/auth.png';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';
import axios from 'axios';

function SignIn() {
  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = 'gray.400';
  const textColorDetails = useColorModeValue('navy.700', 'secondaryGray.600');
  const textColorBrand = useColorModeValue('brand.500', 'white');
  const brandStars = useColorModeValue('brand.500', 'brand.400');

  const [show, setShow] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const passwordInputRef = useRef();

  const handleClick = () => setShow(!show);

  const handleUsernameChange = (e) => {
    setUsernameInput(e.target.value);
    if (error && !e.target.value.trim()) {
      setError(null);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordInput(e.target.value);
    if (error && !e.target.value.trim()) {
      setError(null);
    }
  };

  const handleLogin = async () => {
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/login`,
        {
          username: usernameInput,
          password: passwordInput,
        },
      );

      console.log('response : ', response.data);

      const { id, token, username, role } = response.data;

      localStorage.setItem('username', username);
      localStorage.setItem('user_id', id);
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      toast.success('Login berhasil!', {
        position: 'top-right',
      });

      setTimeout(() => {
        setLoading(false);
        window.location.href = '/admin/data-tables';
      }, 1000);
    } catch (err) {
      setLoading(false);
      if (err.response) {
        setError(err.response.data.message);
        console.error('Error response:', err.response.data);
        console.error('Error status:', err.response.status);
      } else {
        console.error('Error message:', err.message);
        setError('Terjadi kesalahan, silakan coba lagi.');
      }

      toast.error('Login gagal. Periksa kembali username dan password Anda.', {
        position: 'top-right',
      });
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
          mt={{ base: '40px', md: '14vh' }}
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
            <FormControl isInvalid={error && !usernameInput.trim()} mb="24px">
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb="8px"
              >
                Username<Text color={brandStars}>*</Text>
              </FormLabel>
              <Input
                isRequired={true}
                variant="auth"
                fontSize="sm"
                type="text"
                placeholder="Masukkan username"
                fontWeight="500"
                size="lg"
                value={usernameInput}
                onChange={handleUsernameChange}
                onInput={() => setError(null)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    passwordInputRef.current.focus();
                  }
                }}
                borderColor={
                  error && !usernameInput.trim() ? 'red.500' : 'inherit'
                }
                _focus={{
                  borderColor:
                    error && !usernameInput.trim() ? 'red.500' : 'blue.500',
                  boxShadow:
                    error && !usernameInput.trim()
                      ? '0 0 0 1px red'
                      : '0 0 0 1px blue',
                }}
              />
              {error && !usernameInput.trim() ? (
                <Text color="red.500" fontSize="sm" mt="2">
                  Harap isi username.
                </Text>
              ) : (
                <Text color="red.500" fontSize="sm" mt="2">
                  {error && error.includes('Username') ? error : ''}
                </Text>
              )}
            </FormControl>

            <FormControl isInvalid={error && !passwordInput.trim()} mb="24px">
              <FormLabel
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                display="flex"
              >
                Password<Text color={brandStars}>*</Text>
              </FormLabel>
              <InputGroup size="md">
                <Input
                  isRequired={true}
                  fontSize="sm"
                  placeholder="Min. 8 karakter"
                  size="lg"
                  type={show ? 'text' : 'password'}
                  variant="auth"
                  value={passwordInput}
                  onChange={handlePasswordChange}
                  onInput={() => setError(null)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  ref={passwordInputRef}
                  borderColor={
                    error && usernameInput == '' && !passwordInput.trim()
                      ? 'red.500'
                      : 'inherit'
                  }
                  _focus={{
                    borderColor:
                      error && usernameInput == '' && !passwordInput.trim()
                        ? 'red.500'
                        : 'blue.500',
                    boxShadow:
                      error && usernameInput == '' && !passwordInput.trim()
                        ? '0 0 0 1px red'
                        : '0 0 0 1px blue',
                  }}
                />
                <InputRightElement display="flex" alignItems="center" mt="4px">
                  <Icon
                    color={textColorSecondary}
                    _hover={{ cursor: 'pointer' }}
                    as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                    onClick={handleClick}
                  />
                </InputRightElement>
              </InputGroup>
              {error && !error.includes('Username') && !passwordInput.trim() ? (
                <Text color="red.500" fontSize="sm" mt="2">
                  Harap isi password.
                </Text>
              ) : (
                <Text color="red.500" fontSize="sm" mt="2">
                  {error && error.includes('Password') ? error : ''}
                </Text>
              )}
            </FormControl>

            <Flex justifyContent="space-between" align="center" mb="24px">
              <FormControl display="flex" alignItems="center">
                <Checkbox
                  id="remember-login"
                  colorScheme="brandScheme"
                  me="10px"
                />
                <FormLabel
                  htmlFor="remember-login"
                  mb="0"
                  fontWeight="normal"
                  color={textColor}
                  fontSize="sm"
                >
                  Biarkan saya tetap masuk
                </FormLabel>
              </FormControl>
            </Flex>

            <Button
              fontSize="sm"
              variant="brand"
              fontWeight="500"
              w="100%"
              h="50"
              mb="24px"
              onClick={handleLogin}
            >
              Masuk
            </Button>
            <Flex direction="column" align="center" mt="4">
              <Text fontSize="sm" color={textColorSecondary}>
                Belum punya akun?{' '}
                <Text
                  as="span"
                  color="blue.500"
                  cursor="pointer"
                  fontWeight="medium"
                  onClick={() => navigate('/auth/sign-up')}
                >
                  Daftar di sini
                </Text>
              </Text>
            </Flex>
          </Flex>
        </Flex>
      )}
    </DefaultAuth>
  );
}

export default SignIn;
