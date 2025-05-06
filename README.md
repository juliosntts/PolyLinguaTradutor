# PolyLingua

PolyLingua é uma aplicação web de tradução que utiliza o LibreTranslate como serviço de tradução. A aplicação oferece uma interface moderna e intuitiva para traduzir textos entre diferentes idiomas, com recursos como detecção automática de idioma, histórico de traduções e gerenciamento de perfil de usuário.

## Funcionalidades

- Tradução de textos entre diferentes idiomas
- Detecção automática de idioma
- Histórico de traduções
- Perfil de usuário com configurações personalizadas
- Autenticação de usuários
- Interface responsiva e tema claro/escuro

## Tecnologias Utilizadas

### Frontend
- React
- Chakra UI
- React Router
- Context API

### Backend
- Flask
- SQLAlchemy
- JWT para autenticação
- LibreTranslate API

## Configuração do Ambiente

### Pré-requisitos
- Python 3.8+
- Node.js 14+
- Docker (para o LibreTranslate)

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/polylingua.git
cd polylingua
```

2. Configure o backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # No Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Configure o frontend:
```bash
cd frontend
npm install
```

4. Inicie o LibreTranslate usando Docker:
```bash
docker run -ti --rm -p 5002:5002 libretranslate/libretranslate
```

5. Inicie o backend:
```bash
cd backend
python app.py
```

6. Inicie o frontend:
```bash
cd frontend
npm start
```

A aplicação estará disponível em:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- LibreTranslate: http://localhost:5002

## Estrutura do Projeto

```
polylingua/
├── backend/
│   ├── app.py
│   ├── auth.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   └── App.js
│   └── package.json
└── README.md
```

## API Endpoints

### Autenticação
- POST /api/register - Registro de novo usuário
- POST /api/login - Login de usuário

### Perfil
- GET /api/profile - Obter perfil do usuário
- PUT /api/profile - Atualizar perfil do usuário

### Tradução
- POST /api/translate - Traduzir texto
- POST /api/detect - Detectar idioma do texto

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE] para mais detalhes. 