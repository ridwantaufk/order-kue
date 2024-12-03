import React, { useEffect, useState } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  useColorModeValue,
  IconButton,
  Tooltip,
  Spinner,
  Textarea,
  Checkbox,
  Text,
} from '@chakra-ui/react';
import { RepeatIcon } from '@chakra-ui/icons';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import { format, parse } from 'date-fns';

const UpdateTool = ({ tool: toolToEdit, onUpdateComplete }) => {
  const [tool, setTool] = useState(toolToEdit);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const toast = useToast();
  const readOnlyBg = useColorModeValue('gray.200', 'gray.600');
  const editableBg = useColorModeValue('white', 'gray.900');
  const textColor = useColorModeValue('black', 'white');
  const readOnlyColor = useColorModeValue('gray.500', 'gray.500');

  useEffect(() => {
    setTool(toolToEdit);
  }, [toolToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTool((prevTool) => ({
      ...prevTool,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/tools/${tool.tool_id}`,
        tool,
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );

      toast({
        title: 'Success.',
        description: 'Tool data updated successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setIsReadOnly(true);
      onUpdateComplete();
    } catch (error) {
      console.error(
        'Error updating tool:',
        error.response?.data || error.message,
      );
      toast({
        title: 'Failed.',
        description: 'Failed to update tool data.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRefresh = () => {
    setTool(toolToEdit);
    toast({
      title: 'Form refreshed.',
      status: 'info',
      duration: 1000,
      isClosable: true,
    });
  };

  return (
    <Box w="100%" p={4}>
      <Box display="flex" justifyContent="flex-end" mb={4}>
        <Tooltip label="Refresh" aria-label="Refresh Tooltip">
          <IconButton
            aria-label="Refresh Form"
            icon={isRefreshing ? <Spinner size="sm" /> : <RepeatIcon />}
            onClick={handleRefresh}
            colorScheme="blue"
            size="sm"
            isDisabled={isRefreshing}
          />
        </Tooltip>
      </Box>

      <form onSubmit={handleSubmit}>
        <FormControl isRequired>
          <FormLabel>Nama Alat</FormLabel>
          <Input
            type="text"
            name="tool_name"
            value={tool?.tool_name || ''}
            onChange={handleChange}
            isReadOnly={isReadOnly}
            bg={isReadOnly ? readOnlyBg : editableBg}
            color={isReadOnly ? readOnlyColor : textColor}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Deskripsi Alat</FormLabel>
          <Textarea
            type="text"
            name="tool_description"
            value={tool?.tool_description || ''}
            onChange={handleChange}
            isReadOnly={isReadOnly}
            bg={isReadOnly ? readOnlyBg : editableBg}
            color={isReadOnly ? readOnlyColor : textColor}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Tanggal Pembelian</FormLabel>
          <Box display="flex" alignItems="center">
            <DatePicker
              selected={
                tool?.purchase_date
                  ? parse(tool.purchase_date, 'yyyy-MM-dd', new Date())
                  : new Date() // Gunakan tanggal saat ini jika purchase_date tidak tersedia
              }
              onChange={(date) =>
                handleChange({
                  target: {
                    name: 'purchase_date',
                    value: format(date, 'yyyy-MM-dd'),
                  },
                })
              }
              dateFormat="dd MMM yyyy"
              customInput={
                <Input
                  name="purchase_date"
                  value={
                    tool?.purchase_date
                      ? format(
                          parse(tool.purchase_date, 'yyyy-MM-dd', new Date()),
                          'dd MMM yyyy',
                        )
                      : format(new Date(), 'dd MMM yyyy') // Tampilkan tanggal saat ini secara default
                  }
                  isReadOnly={isReadOnly}
                  bg={isReadOnly ? readOnlyBg : editableBg}
                  color={isReadOnly ? readOnlyColor : textColor}
                  placeholder="DD MMM YYYY"
                />
              }
            />
            {tool?.available !== undefined && (
              <Checkbox
                ml={4}
                isChecked={tool.available}
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: 'available',
                      value: e.target.checked,
                    },
                  })
                }
              >
                <Text color={textColor} ml={2}>
                  {tool.available ? 'Tersedia' : 'Tidak Tersedia'}
                </Text>
              </Checkbox>
            )}
          </Box>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Harga</FormLabel>
          <Input
            type="number"
            name="price"
            value={tool?.price || ''}
            onChange={handleChange}
            isReadOnly={isReadOnly}
            bg={isReadOnly ? readOnlyBg : editableBg}
            color={isReadOnly ? readOnlyColor : textColor}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Jumlah</FormLabel>
          <Input
            type="number"
            name="quantity"
            value={tool?.quantity || ''}
            onChange={handleChange}
            isReadOnly={isReadOnly}
            bg={isReadOnly ? readOnlyBg : editableBg}
            color={isReadOnly ? readOnlyColor : textColor}
          />
        </FormControl>
        <Box display="flex" justifyContent="flex-end" mt={4}>
          <Button type="submit" colorScheme="blue" isDisabled={isReadOnly}>
            Update Tool
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default UpdateTool;
