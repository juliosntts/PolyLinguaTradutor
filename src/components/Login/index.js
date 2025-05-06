import React, { useState } from 'react';
import {
  Box,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Text,
  Link as ChakraLink,
  Container
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast({
          title: 'Login realizado com sucesso',
          description: 'Você será redirecionado para a página inicial',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/');
      } else {
        throw new Error('Falha no login');
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: error.message || 'Não foi possível fazer login',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="container.sm" py={8}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading size="lg" mb={2}>Login</Heading>
          <Text color="gray.500">
            Entre para começar a usar o PolyLingua
          </Text>
        </Box>

        <Box
          p={8}
          borderWidth={1}
          borderRadius="lg"
          boxShadow="sm"
        >
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Senha</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha"
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                width="full"
                isLoading={isLoading}
                loadingText="Entrando..."
                mt={4}
              >
                Entrar
              </Button>
            </VStack>
          </form>
        </Box>

        <Text textAlign="center">
          Não tem uma conta?{' '}
          <ChakraLink as={RouterLink} to="/register" color="blue.500">
            Registre-se
          </ChakraLink>
        </Text>
      </VStack>
    </Container>
  );
};

export default Login; 