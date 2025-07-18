# 🧪 Como Testar Localmente

## 1. Teste em Modo de Desenvolvimento

```bash
# Executar em modo interativo
npm run dev

# Ou com URL como parâmetro
npm run dev "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
```

## 2. Teste da Versão Compilada

```bash
# Compilar primeiro
npm run build

# Executar versão compilada
npm start

# Ou diretamente
node dist/index.js
```

## 3. Teste como NPX Global

```bash
# Instalar globalmente (para teste local)
npm install -g .

# Usar como comando global
sc-youtube-downloader

# Desinstalar após o teste
npm uninstall -g sc-youtube-downloader
```

## 4. Teste com NPX sem Instalação

```bash
# Executar sem instalar (após publicar no NPM)
npx sc-youtube-downloader
```

## 📝 Exemplos de URLs para Teste

⚠️ **Use apenas vídeos públicos e que você tem permissão para baixar**

- Vídeos curtos de demonstração
- Vídeos educacionais públicos
- Seus próprios vídeos

## 🚀 Próximos Passos

Para publicar no NPM:

1. Criar conta no NPM: https://www.npmjs.com/signup
2. Fazer login: `npm login`
3. Publicar: `npm publish`

---

**Nota**: Sempre respeite os direitos autorais e os termos de serviço do YouTube!
