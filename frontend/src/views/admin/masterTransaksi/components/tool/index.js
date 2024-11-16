import { Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { useState } from 'react';
import Card from 'components/card/Card';
import MainMenu from 'components/menu/MainMenu';
import CreateTool from './createTool';
import ViewTool from './viewTool';
import UpdateTool from './updateTool';

export default function Tools({ onExpand, isExpanded }) {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const [activeView, setActiveView] = useState('view');
  const [toolToEdit, setToolToEdit] = useState(null);

  const handleMenuClick = (view) => {
    if (view === 'expand') {
      onExpand();
    } else {
      setActiveView(view);
      setToolToEdit(null);
    }
  };

  const handleEdit = (tool) => {
    setToolToEdit(tool);
    setActiveView('edit');
  };

  const handleUpdateComplete = () => {
    setActiveView('view');
  };

  return (
    <Card
      flexDirection="column"
      w="100%"
      px="0px"
      overflowX={{ sm: 'scroll', md: 'scroll', lg: 'scroll' }}
      overflowY="auto"
      maxHeight={{
        base: '450px',
        sm: '500px',
        md: '550px',
        lg: '600px',
        xl: '650px',
      }}
    >
      <Flex
        px="25px"
        mb="8px"
        justifyContent="space-between"
        align="center"
        position="sticky"
        top="0"
        zIndex="1"
        whiteSpace="nowrap"
      >
        <Text
          color={textColor}
          fontSize="22px"
          fontWeight="700"
          lineHeight="100%"
        >
          Alat-alat : {activeView === 'create' && 'Tambah'}
          {activeView === 'view' && 'Informasi'}
          {activeView === 'edit' && 'Edit'}
        </Text>
        <MainMenu onMenuClick={handleMenuClick} isExpanded={isExpanded} />
      </Flex>

      <Flex overflowX="auto">
        {activeView === 'create' && <CreateTool />}
        {activeView === 'view' && <ViewTool onEdit={handleEdit} />}
        {activeView === 'edit' && (
          <UpdateTool
            tool={toolToEdit}
            onUpdateComplete={handleUpdateComplete}
          />
        )}
      </Flex>
    </Card>
  );
}
