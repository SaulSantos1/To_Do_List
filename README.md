# 📝 To-Do List App: Guia Completo de Instalação e Execução

## 🎥 Demonstração do Projeto

📂 [Clique aqui para assistir ao vídeo de demonstração](images-videos/To%20Do%20List.mp4)

> Clique na imagem acima para assistir a um vídeo mostrando a aplicação em funcionamento.

## 📌 Funcionalidades

A aplicação **To-Do List** permite uma gestão eficiente de tarefas e usuários. Abaixo estão as principais funcionalidades disponíveis no sistema:

### ✅ Gerenciamento de Tarefas
- **Paginação de Tarefas:** As tarefas são exibidas com paginação para facilitar a navegação em listas longas.
- **Filtro de Tarefas:** Permite filtrar tarefas por status (a fazer, em andamento, concluída e não concluída).
- **Criação de Tarefa:** Adicione novas tarefas com título, descrição, status e responsável.
- **Edição de Tarefa:** Atualize informações das tarefas existentes.
- **Deleção de Tarefa:** Remova tarefas da lista de forma permanente.

### 👥 Gerenciamento de Usuário
- **Criação de Usuário:** Autenticação de Usuário.
- **Edição de Usuário:** Atualizar dados cadastrais da sua conta.

---

## 🚀 Instalação e Execução

### Opção 1: Com Docker (Recomendado)

#### Pré-requisitos
- Docker instalado (Windows/Mac | Linux)

#### Passo a Passo

Clone o repositório:

```bash
git clone https://github.com/SaulSantos1/To_Do_List.git
cd To_Do_List
```

Construa e inicie os containers:

```bash
docker-compose up --build
```

##### Isso irá:
1. Criar containers para backend (Django) e frontend (React)

2. Configurar automaticamente as dependências

3. Iniciar ambos os servidores

##### Acesse a aplicação
- Frontend: http://localhost:3000

- API Backend: http://localhost:8000/

Para parar os containers:

```bash
docker-compose down
```

### Opção 2: Sem Docker (Instalação Manual)
#### Pré-requisitos
- Python 3.10+

- Node.js 16+

- pip e npm instalados

#### Backend (Django)
- Configure o ambiente:

```bash
git clone https://github.com/SaulSantos1/To_Do_List.git
cd To_Do_List
cd backend
python -m venv venv
Linux/Mac: source venv/bin/activate
Windows: venv\Scripts\activate
pip install -r ../requirements.txt
```

- Execute migrações:

```bash
python manage.py migrate
```

Inicie o servidor:

```bash
python manage.py runserver
# API disponível em: http://localhost:8000
```

#### Frontend (React)
- Instale dependências:

```bash
cd frontend
npm install
```

- Inicie o servidor:

```bash
npm start
# Aplicação disponível em: http://localhost:3000
# Se a porta 3000 já estiver sendo usada user o comando set PORT=3001 && npm start
```


## ⚙️ Fluxo de Desenvolvimento
#### GitHub Actions
- Pipeline automático que:

- Roda testes unitários em push/pull requests

- Verifica qualidade de código

- Bloqueia merge se testes falharem

#### Padrão de Commits

##### Mensagens semânticas:


:sparkles: feat: Adiciona funcionalidade de filtro
:bug: fix: Corrige bug na deleção de tarefas
:recycle: refactor: Melhora estrutura do service

#### Arquitetura em Camadas
- Models: Definem estrutura do banco de dados

- Repositories: Gerenciam acesso aos dados

- Serializers: Convertem dados para JSON

- Services: Contêm regras de negócio

- Views: Lidam com requisições HTTP

## 🔧 Solução de Problemas Comuns
#### Docker
Erros de build? Execute:

```bash
docker-compose down && docker-compose up --build
```
#### Instalação Manual
Erros no frontend? Delete node_modules e reinstale:

```bash
rm -rf node_modules && npm install
```

Problemas no backend? Verifique migrações:

```bash
python manage.py makemigrations && python manage.py migrate
```
