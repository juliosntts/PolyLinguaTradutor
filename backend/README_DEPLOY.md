# Instruções de Deploy do PolyLingua Backend no PythonAnywhere

Este documento contém instruções para implementar o backend da aplicação PolyLingua no PythonAnywhere.

## Pré-requisitos

- Conta no PythonAnywhere (plano gratuito é suficiente para começar)
- Serviço de tradução configurado e acessível (como LibreTranslate)

## Passos para o Deploy

### 1. Upload de Arquivos

Existem duas maneiras de fazer o upload do seu código:

#### Usando Git (recomendado)
```bash
# No console do PythonAnywhere
git clone https://github.com/seu-usuario/polylingua.git
```

#### Upload Manual
Faça o upload de todos os arquivos via interface do PythonAnywhere.

### 2. Configuração do Ambiente Virtual

```bash
# No console do PythonAnywhere
cd ~/polylingua/backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 3. Configurações do Ambiente

Edite o arquivo `.env.production` e configure:

- `SECRET_KEY`: Uma chave secreta forte para produção
- `TRANSLATE_API_URL`: URL do serviço de tradução
- `ALLOWED_ORIGINS`: URLs do seu frontend (separados por vírgula)

### 4. Configuração da Web App no PythonAnywhere

1. Vá para a seção "Web" no dashboard do PythonAnywhere
2. Clique em "Add a new web app"
3. Escolha "Manual configuration" e selecione Python 3.9
4. Na página de configuração:
   - Source code: `/home/seuusuario/polylingua/backend`
   - Working directory: `/home/seuusuario/polylingua/backend`
   - Virtualenv: `/home/seuusuario/polylingua/backend/venv`

### 5. Configuração do Arquivo WSGI

Substitua o conteúdo do arquivo WSGI gerado pelo PythonAnywhere pelo conteúdo do arquivo `pythonanywhere_wsgi.py` (não esqueça de atualizar o caminho com seu nome de usuário).

### 6. Inicialização do Banco de Dados

```python
# No console Python do PythonAnywhere
from app import app, db
with app.app_context():
    db.create_all()
```

### 7. Verificação

Acesse `https://seuusuario.pythonanywhere.com/health` para verificar se a API está funcionando.

## Configuração do Frontend

Atualize as URLs de API no frontend para apontar para:
```javascript
const apiUrl = 'https://seuusuario.pythonanywhere.com';
```

## Solução de Problemas

- Verifique os logs no painel do PythonAnywhere
- Certifique-se de que o CORS está configurado corretamente
- Verifique se o banco de dados foi inicializado adequadamente 