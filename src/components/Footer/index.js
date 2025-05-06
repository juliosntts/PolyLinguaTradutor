import React from 'react';
import { Box, Text, Link, VStack } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Box as="footer" bg="gray.100" py={6} mt={8}>
      <VStack spacing={2}>
        <Text>PolyLingua - Projeto de Teoria dos Grafos</Text>
        <Text fontSize="sm">
          Desenvolvido por:{' '}
          <Link href="https://github.com/juliosntts/PolyLingua" isExternal color="blue.500">
            Júlio Nascimento Santos, Rodrigo Araújo, Guilherme Santos e Caique Kelvin
          </Link>
        </Text>
        <Text fontSize="xs">Usando modelo T5 para traduções precisas</Text>
      </VStack>
    </Box>
  );
};

export default Footer; 