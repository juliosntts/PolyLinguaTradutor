// Configurações da API para diferentes ambientes
const config = {
  // API url - ajuste para o seu backend no PythonAnywhere
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  
  // URL do serviço de tradução
  translateApiUrl: process.env.REACT_APP_TRANSLATE_API_URL || 'http://localhost:5002',
};

export default config; 