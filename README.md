# CardápioDigital

Sistema de cardápio digital para restaurantes. Crie cardápios profissionais que seus clientes acessam via QR Code.

## Como Rodar o Projeto Localmente

### Pré-requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conta no Firebase (gratuita)

### Passos

1. **Clone ou baixe o projeto**
   ```bash
   cd /caminho/para/projeto
   ```

2. **Configure o Firebase**

   a) Acesse [Firebase Console](https://console.firebase.google.com/)

   b) Crie um novo projeto:
      - Clique em "Adicionar projeto"
      - Dê um nome (ex: `cardapio-digital`)
      - Desative Google Analytics (opcional)
      - Clique em "Criar projeto"

   c) Ative o Firestore Database:
      - Menu lateral → "Firestore Database"
      - Clique em "Criar banco de dados"
      - Escolha "Iniciar no modo de teste"
      - Selecione a região (ex: `southamerica-east1` para Brasil)
      - Clique em "Ativar"

   d) Ative o Storage:
      - Menu lateral → "Storage"
      - Clique em "Começar"
      - Aceite as regras padrão
      - Selecione a mesma região do Firestore
      - Clique em "Concluído"

   e) Obtenha as credenciais:
      - Clique no ícone de engrenagem ⚙️ → "Configurações do projeto"
      - Role até "Seus aplicativos"
      - Clique no ícone "Web" (`</>`)
      - Dê um nome (ex: `cardapio-web`)
      - Clique em "Registrar app"
      - Copie o objeto `firebaseConfig`

   f) Cole as credenciais nos arquivos:
      - Abra `public/admin.html`
      - Procure por `firebaseConfig` (por volta da linha 800)
      - Substitua com suas credenciais
      - Faça o mesmo em `public/menu.html`

3. **Rode localmente**

   Opção 1 - Python:
   ```bash
   cd public
   python3 -m http.server 8000
   ```
   Acesse: http://localhost:8000

   Opção 2 - Node.js (http-server):
   ```bash
   npx http-server public -p 8000
   ```
   Acesse: http://localhost:8000

   Opção 3 - VS Code Live Server:
   - Instale a extensão "Live Server"
   - Clique com botão direito em `public/index.html`
   - Selecione "Open with Live Server"

## Deploy no Firebase Hosting

### 1. Instalar Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Fazer Login

```bash
firebase login
```

Isso abrirá seu navegador para autenticação. Faça login com a mesma conta do Firebase Console.

### 3. Inicializar o Projeto

```bash
firebase init
```

Configurações recomendadas:
- **Recursos**: Selecione apenas "Hosting" (use espaço para selecionar, Enter para confirmar)
- **Projeto**: Escolha o projeto que você criou no Firebase Console
- **Public directory**: Digite `public` (isso é importante!)
- **Single-page app**: Digite `N` (não)
- **Sobrescrever index.html**: Digite `N` (não)
- **GitHub auto-deploy**: Digite `N` (não, a menos que queira)

### 4. Fazer Deploy

```bash
firebase deploy
```

Aguarde alguns segundos. Quando terminar, você verá:
```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/seu-projeto/overview
Hosting URL: https://seu-projeto.web.app
```

### 5. Acessar seu Site

Seu cardápio digital estará disponível em:
- `https://seu-projeto.web.app`
- `https://seu-projeto.firebaseapp.com`

## Comandos Úteis Firebase

```bash
# Ver status do projeto
firebase list

# Fazer deploy apenas do Hosting
firebase deploy --only hosting

# Abrir o console do Firebase no navegador
firebase open

# Visualizar logs
firebase functions:log
```

## Estrutura do Projeto

```
cardapio-digital/
├── public/
│   ├── index.html       # Landing page
│   ├── register.html    # Cadastro de restaurante
│   ├── admin.html       # Painel de administração
│   └── menu.html        # Cardápio público
├── firebase.json        # Configuração Firebase (criado após init)
└── README.md           # Este arquivo
```

## Como Usar

### Para Restaurantes

1. Acesse o site (seu-projeto.web.app)
2. Clique em "Criar Cardápio"
3. Escolha um ID único e senha
4. Configure logo, nome e cores
5. Adicione menus, seções e itens
6. Gere o QR Code e imprima para as mesas

### Para Clientes

1. Escaneie o QR Code na mesa
2. Navegue pelo cardápio no celular
3. Veja fotos, descrições e preços

## Solução de Problemas

### Erro: "Firebase config not found"
- Verifique se você copiou o `firebaseConfig` corretamente em `admin.html` e `menu.html`

### Erro: "Permission denied"
- Configure as regras de segurança no Firebase Console:
  - Firestore Database → Regras
  - Storage → Regras

### Deploy falhou
```bash
# Limpar cache e tentar novamente
firebase deploy --force
```

## Tecnologias

- HTML5, CSS3, JavaScript
- Firebase (Firestore + Storage + Hosting)
- Tailwind CSS
- SortableJS
- html2pdf.js
- QRCode.js

## Licença

MIT License - Use livremente.
