# 📹 SC YouTube Downloader

Um downloader de YouTube bonito e interativo para o terminal, desenvolvido com TypeScript.

## ✨ Características

- 🎨 **Interface bonita e colorida** no terminal
- 📊 **Exibe informações detalhadas** do vídeo antes do download
- 🎯 **Seleção interativa** de qualidade e formato
- 📁 **Escolha personalizada** do diretório de download
- 📈 **Progresso em tempo real** durante o download
- 🎵 **Suporte para download de áudio** apenas
- 🔄 **Download múltiplo** sem reiniciar a aplicação

## 🚀 Instalação

### Instalação Global (NPX)

```bash
npm install -g sc-youtube-downloader;
sc-youtube-downloader;
```

### Uso com NPX (sem instalação)

```bash
npx sc-youtube-downloader;
```

## 💻 Como Usar

### Modo Interativo

Execute sem argumentos para o modo interativo completo:

```bash
sc-youtube-downloader
```

ou

```bash
npx sc-youtube-downloader
```

### Modo com URL

Passe a URL como argumento:

```bash
sc-youtube-downloader "https://youtu.be/dQw4w9WgXcQ"
```

ou

```bash
npx sc-youtube-downloader "https://youtu.be/dQw4w9WgXcQ"
```

## 📋 Funcionalidades

### 📺 Informações do Vídeo

O aplicativo exibe:

- 🎬 Título do vídeo
- 👤 Canal/Autor
- ⏱️ Duração
- 👀 Número de visualizações
- 📝 Descrição (prévia)

### 🎯 Seleção de Formato

Escolha entre:

- 🎬 **Vídeos em alta qualidade** (1080p, 720p, 480p, etc.)
- 🎵 **Apenas áudio** (MP4, WebM, etc.)
- 📊 **Tamanho do arquivo** para cada opção
- 📦 **Formato do container** (MP4, WebM, etc.)

### 📁 Opções de Download

- 💾 Download na pasta atual
- 📍 Escolher pasta personalizada
- 🔍 Validação de diretório

## 🛠️ Desenvolvimento

### Pré-requisitos

- Node.js 16+
- NPM ou Yarn

### Configuração Local

```bash
# Clonar o repositório
git clone https://github.com/saulotarsobc/sc-youtube-downloader.git
cd sc-youtube-downloader

# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run dev

# Compilar para produção
npm run build

# Executar versão compilada
npm start
```

### Estrutura do Projeto

```
📦 sc-youtube-downloader
├── 📁 src/
│   └── 📄 index.ts          # Código principal
├── 📁 dist/                 # Arquivos compilados
├── 📄 package.json
├── 📄 tsconfig.json
└── 📄 README.md
```

## 📦 Dependências

### Principais

- **ytdl-core**: Download de vídeos do YouTube
- **inquirer**: Interface interativa no terminal
- **chalk**: Cores e estilos no terminal
- **ora**: Spinners para feedback visual
- **figlet**: Arte ASCII para o título
- **boxen**: Caixas decorativas no terminal

### Desenvolvimento

- **typescript**: Linguagem de desenvolvimento
- **@types/node**: Tipos para Node.js
- **tsx**: Execução direta de TypeScript

## 🎨 Screenshots

```
███████╗ ██████╗    ██╗   ██╗ ██████╗ ██╗   ██╗████████╗██╗   ██╗██████╗ ███████╗    ██████╗ ██╗
██╔════╝██╔════╝    ╚██╗ ██╔╝██╔═══██╗██║   ██║╚══██╔══╝██║   ██║██╔══██╗██╔════╝    ██╔══██╗██║
███████╗██║          ╚████╔╝ ██║   ██║██║   ██║   ██║   ██║   ██║██████╔╝█████╗      ██║  ██║██║
╚════██║██║           ╚██╔╝  ██║   ██║██║   ██║   ██║   ██║   ██║██╔══██╗██╔══╝      ██║  ██║██║
███████║╚██████╗       ██║   ╚██████╔╝╚██████╔╝   ██║   ╚██████╔╝██████╔╝███████╗    ██████╔╝███████╗
╚══════╝ ╚═════╝       ╚═╝    ╚═════╝  ╚═════╝    ╚═╝    ╚═════╝ ╚═════╝ ╚══════╝    ╚═════╝ ╚══════╝

📹 Downloader de YouTube bonito e interativo
```

## ⚠️ Aviso Legal

Este projeto é apenas para fins educacionais. Certifique-se de:

- ✅ Respeitar os direitos autorais
- ✅ Seguir os termos de serviço do YouTube
- ✅ Usar apenas para conteúdo que você tem permissão para baixar
- ✅ Não redistribuir conteúdo protegido por direitos autorais

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença ISC. Veja o arquivo `LICENSE` para mais detalhes.

## 🙏 Agradecimentos

- [ytdl-core](https://github.com/fent/node-ytdl-core) - Core do download de vídeos
- [inquirer](https://github.com/SBoudrias/Inquirer.js) - Interface interativa
- [chalk](https://github.com/chalk/chalk) - Cores no terminal
- Comunidade Node.js e TypeScript

---

Feito com ❤️ e TypeScript
