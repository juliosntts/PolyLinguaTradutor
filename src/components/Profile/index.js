import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast,
  Divider,
  Switch,
  HStack,
  Avatar,
  IconButton,
  Flex,
  useColorMode,
  Container,
  useColorModeValue,
  Spinner
} from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import { useSettings } from '../../context/SettingsContext';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user, updateUser, loading: authLoading } = useAuth();
  const { settings, updateSettings, updateSetting, isLoading: settingsLoading } = useSettings();
  const { setColorMode } = useColorMode();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    preferredLanguage: 'pt',
    theme: 'light',
    autoDetectLanguage: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Inicializar os dados do usuário quando o componente for montado
  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name || '',
        email: user.email || '',
        preferredLanguage: user.preferred_language || 'pt',
        theme: user.theme || 'light',
        autoDetectLanguage: user.auto_detect_language || false
      });
    }
  }, [user]);

  // Efeito para aplicar o tema quando ele mudar
  useEffect(() => {
    if (userData.theme) {
      setColorMode(userData.theme);
    }
  }, [userData.theme, setColorMode]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Aplicar tema imediatamente
      setColorMode(userData.theme);
      
      // Atualizar localmente
      updateSetting('theme', userData.theme);
      updateSetting('preferredLanguage', userData.preferredLanguage);
      
      // Atualizar no backend
      await updateSettings({
        name: userData.name,
        email: userData.email,
        preferredLanguage: userData.preferredLanguage,
        theme: userData.theme,
        autoDetectLanguage: userData.autoDetectLanguage
      });
      
      // Atualizar no estado do contexto de autenticação
      updateUser({
        name: userData.name,
        email: userData.email,
        preferred_language: userData.preferredLanguage,
        theme: userData.theme,
        auto_detect_language: userData.autoDetectLanguage
      });
      
      toast({
        title: 'Configurações salvas',
        description: 'Suas configurações foram atualizadas com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar as configurações',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setUserData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Aplicar o tema imediatamente quando for alterado
    if (name === 'theme') {
      setColorMode(value);
      updateSetting('theme', value);
    }
    
    // Atualizar o idioma preferido imediatamente
    if (name === 'preferredLanguage') {
      updateSetting('preferredLanguage', value);
    }
  };

  // Se estiver carregando, mostrar um spinner
  if (authLoading) {
    return (
      <Container maxW="container.xl" py={8} centerContent>
        <Spinner size="xl" />
        <Text mt={4}>Carregando dados do perfil...</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading size="lg" mb={2}>Perfil do Usuário</Heading>
          <Text color="gray.500">
            Gerencie suas configurações e preferências do LibreTranslate
          </Text>
        </Box>

        <Box
          bg={bgColor}
          p={6}
          borderRadius="lg"
          boxShadow="sm"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <VStack spacing={6}>
            <HStack spacing={4} width="full" align="center">
              <Avatar size="xl" name={userData.name} />
              <VStack align="start" spacing={1}>
                <Text fontSize="xl" fontWeight="bold">{userData.name}</Text>
                <Text color="gray.500">{userData.email}</Text>
              </VStack>
            </HStack>

            <FormControl>
              <FormLabel>Nome</FormLabel>
              <Input
                name="name"
                value={userData.name}
                onChange={handleChange}
                placeholder="Digite seu nome"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                name="email"
                type="email"
                value={userData.email}
                onChange={handleChange}
                placeholder="Digite seu email"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Idioma Preferido</FormLabel>
              <Select
                name="preferredLanguage"
                value={userData.preferredLanguage}
                onChange={handleChange}
              >
                <option value="pt">Português</option>
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="it">Italiano</option>
                <option value="ja">日本語</option>
                <option value="ko">한국어</option>
                <option value="zh">中文</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Tema</FormLabel>
              <Select
                name="theme"
                value={userData.theme}
                onChange={handleChange}
              >
                <option value="light">Claro</option>
                <option value="dark">Escuro</option>
              </Select>
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">
                Detecção Automática de Idioma
              </FormLabel>
              <Switch
                name="autoDetectLanguage"
                isChecked={userData.autoDetectLanguage}
                onChange={handleChange}
              />
            </FormControl>

            <Button
              colorScheme="blue"
              onClick={handleSave}
              isLoading={isLoading || settingsLoading}
              loadingText="Salvando..."
              width="full"
            >
              Salvar Configurações
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default Profile; 