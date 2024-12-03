'use client';
/* eslint-disable */

import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Checkbox,
  HStack,
  useColorModeValue,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import * as React from 'react';
import axios from 'axios';

export default function ViewTools({ onEdit }) {
  const [tools, setTools] = React.useState([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedTools, setSelectedTools] = React.useState([]);
  const [isAllSelected, setIsAllSelected] = React.useState(false);
  const [sortColumn, setSortColumn] = React.useState(null);
  const [sortDirection, setSortDirection] = React.useState('asc');
  const [toolToDelete, setToolToDelete] = React.useState(null);
  const cancelRef = React.useRef();
  const toast = useToast();

  const rowBgColorTr = useColorModeValue('red.100', 'red.300');
  const rowBgColorTd = useColorModeValue('gray.500', 'gray.300');

  const fetchTools = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/tools`,
        {
          headers: {
            'ngrok-skip-browser-warning': 'true', // gara-gara baris nu kieu patut beak mikiran
          },
        },
      );
      const sortedTools = response.data.sort((a, b) =>
        a.tool_name.localeCompare(b.tool_name),
      );
      setTools(sortedTools);
    } catch (error) {
      toast({
        title: 'Error.',
        description: 'Failed to load tools.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  React.useEffect(() => {
    fetchTools();
  }, []);

  React.useEffect(() => {
    const activeTools = tools.filter((tool) => tool.available === true);
    const allSelected =
      activeTools.length > 0 &&
      activeTools.every((tool) =>
        selectedTools.some((selected) => selected.tool_id === tool.tool_id),
      );
    setIsAllSelected(allSelected);
  }, [selectedTools, tools]);

  const handleSort = (column) => {
    const direction =
      sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(column);
    setSortDirection(direction);
    const sortedTools = [...tools].sort((a, b) => {
      const isNumericColumn = ['quantity', 'price'].includes(column);
      const valA = isNumericColumn
        ? parseFloat(a[column])
        : a[column].toLowerCase();
      const valB = isNumericColumn
        ? parseFloat(b[column])
        : b[column].toLowerCase();

      if (valA < valB) return direction === 'asc' ? -1 : 1;
      if (valA > valB) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setTools(sortedTools);
  };

  const handleDeleteClick = (tool) => {
    setToolToDelete(tool);
    setIsOpen(true);
  };

  const deleteSelectedTools = async () => {
    console.log('selectedTools : ', selectedTools);
    try {
      const toolsToDelete =
        selectedTools.length > 0 ? selectedTools : [toolToDelete];

      await Promise.all(
        toolsToDelete.map(async (tool) => {
          if (tool.tool_id) {
            await axios.put(
              `${process.env.REACT_APP_BACKEND_UR}L/api/tools/delete/${tool.tool_id}`,
              {
                available: false,
              },
            );
          }
        }),
      );

      setTools((prevTools) =>
        prevTools.map((t) =>
          toolsToDelete.some((selected) => selected.tool_id === t.tool_id)
            ? { ...t, available: false }
            : t,
        ),
      );

      toast({
        title: 'Deleted!',
        description: `${toolsToDelete.length} tools were deleted.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setIsOpen(false);
      setSelectedTools([]);
      setIsAllSelected(false);
      setToolToDelete(null);
    } catch (error) {
      toast({
        title: 'Error.',
        description: 'Failed to delete tools.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSelectAll = () => {
    const allTools = tools.filter((tool) => tool.available === true);
    if (isAllSelected) {
      setSelectedTools([]);
      setIsAllSelected(false);
    } else {
      setSelectedTools(allTools);
      setIsAllSelected(true);
    }
  };

  const handleSelectTool = (tool) => {
    console.log(tool);
    if (selectedTools.some((selected) => selected.tool_id === tool.tool_id)) {
      setSelectedTools(
        selectedTools.filter((selected) => selected.tool_id !== tool.tool_id),
      );
    } else {
      setSelectedTools([...selectedTools, tool]);
    }
  };

  return (
    <Box w="100%" p={4}>
      <Button
        colorScheme="red"
        onClick={handleDeleteClick}
        isDisabled={selectedTools.length === 0}
        mb={4}
      >
        Delete Selected
      </Button>
      <Table variant="simple" colorScheme="teal">
        <Thead>
          <Tr>
            <Th>
              <Checkbox
                isChecked={isAllSelected}
                onChange={handleSelectAll}
                colorScheme="red"
              />
            </Th>
            <Th cursor="pointer" onClick={() => handleSort('tool_name')}>
              Nama Alat
            </Th>
            <Th
              cursor="pointer"
              isNumeric
              onClick={() => handleSort('quantity')}
            >
              Jumlah
            </Th>
            <Th cursor="pointer" onClick={() => handleSort('price')} isNumeric>
              Harga
            </Th>
            <Th>Aksi</Th>
          </Tr>
        </Thead>
        <Tbody>
          {tools.map((tool) => (
            <Tr
              key={tool.tool_id}
              bg={tool.available === false ? rowBgColorTr : undefined}
            >
              <Td>
                <Checkbox
                  isChecked={selectedTools.some(
                    (selected) => selected.tool_id === tool.tool_id,
                  )}
                  onChange={() => handleSelectTool(tool)}
                  colorScheme="red"
                  isDisabled={tool.available === false}
                />
              </Td>
              <Td
                textDecoration={
                  tool.available === false ? 'line-through' : 'none'
                }
                color={tool.available === false ? rowBgColorTd : undefined}
              >
                {tool.tool_name}
              </Td>
              <Td
                textDecoration={
                  tool.available === false ? 'line-through' : 'none'
                }
                color={tool.available === false ? rowBgColorTd : undefined}
                isNumeric
              >
                {tool.quantity}
              </Td>
              <Td
                textDecoration={
                  tool.available === false ? 'line-through' : 'none'
                }
                color={tool.available === false ? rowBgColorTd : undefined}
                isNumeric
              >
                {tool.price}
              </Td>
              <Td>
                <HStack spacing={2}>
                  <Button colorScheme="blue" onClick={() => onEdit(tool)}>
                    Edit
                  </Button>
                  <Button
                    colorScheme="red"
                    onClick={() => handleDeleteClick(tool)}
                    isDisabled={tool.available === false}
                  >
                    Delete
                  </Button>
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Tool
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete the tool {toolToDelete?.tool_name}
              ? This will mark the tool as unavailable.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={deleteSelectedTools} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
