# 🔧 Guia Rápido de Git - Refugio's Lanche

## 📋 Comandos Básicos

### 1️⃣ Ver Status do Repositório
```bash
git status
```
Mostra quais arquivos foram modificados, adicionados ou deletados.

### 2️⃣ Adicionar Arquivos para Commit
```bash
# Adicionar todos os arquivos modificados
git add .

# Adicionar arquivo específico
git add nome-do-arquivo.js
```

### 3️⃣ Fazer Commit (Salvar Alterações)
```bash
git commit -m "Descrição do que foi alterado"
```

**Exemplos:**
```bash
git commit -m "feat: Logo fixo e responsivo implementado"
git commit -m "fix: Corrigido posicionamento do logo"
git commit -m "docs: Adicionado guia de uso do Git"
```

### 4️⃣ Enviar para GitHub
```bash
git push origin main
```

### 5️⃣ Baixar Atualizações do GitHub
```bash
git pull origin main
```

---

## 🚀 Fluxo Completo de Trabalho

```bash
# 1. Ver o que mudou
git status

# 2. Adicionar todas as mudanças
git add .

# 3. Salvar com mensagem descritiva
git commit -m "feat: Implementado sistema de logo responsivo"

# 4. Enviar para o GitHub
git push origin main
```

---

## 📝 Boas Práticas de Mensagens de Commit

### Prefixos Recomendados:
- **feat:** Nova funcionalidade
  - `feat: Adicionado carrinho de compras`
- **fix:** Correção de bug
  - `fix: Corrigido erro no cálculo do total`
- **docs:** Documentação
  - `docs: Atualizado README com instruções`
- **style:** Mudanças visuais (CSS, layout)
  - `style: Ajustado tamanho e posição do logo`
- **refactor:** Refatoração de código
  - `refactor: Reorganizado estrutura de componentes`
- **chore:** Tarefas gerais
  - `chore: Atualizado dependências`

---

## 🔍 Comandos Úteis

### Ver Histórico de Commits
```bash
git log
git log --oneline  # Versão resumida
```

### Desfazer Mudanças Não Commitadas
```bash
# Desfazer mudanças em um arquivo específico
git checkout -- nome-do-arquivo.js

# Desfazer TODAS as mudanças não salvas (CUIDADO!)
git reset --hard
```

### Ver Diferenças (O que mudou)
```bash
git diff  # Ver mudanças não adicionadas
git diff --staged  # Ver mudanças já adicionadas
```

### Criar Nova Branch (Ramo)
```bash
# Criar e mudar para nova branch
git checkout -b nome-da-branch

# Exemplos:
git checkout -b feature/novo-sistema-pagamento
git checkout -b fix/corrigir-logo
```

### Voltar para Branch Principal
```bash
git checkout main
```

---

## 🆘 Resolver Problemas Comuns

### Erro: "Changes not staged for commit"
```bash
git add .
git commit -m "Suas alterações"
```

### Erro: "Your branch is behind"
```bash
git pull origin main
```

### Erro: Conflito de Merge
1. Abra os arquivos em conflito
2. Escolha qual versão manter (remova as marcações `<<<<`, `====`, `>>>>`)
3. Salve o arquivo
4. Execute:
```bash
git add .
git commit -m "fix: Resolvido conflito de merge"
```

### Desfazer Último Commit (mas manter mudanças)
```bash
git reset --soft HEAD~1
```

---

## 📦 Configuração Inicial (Primeira Vez)

```bash
# Configurar nome e email
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@example.com"

# Verificar configuração
git config --list
```

---

## 🌐 Trabalhar com GitHub

### Clonar Repositório
```bash
git clone https://github.com/Jhony8727/refugio-s-lanche.git
```

### Atualizar Repositório Remoto
```bash
# Ver repositórios remotos
git remote -v

# Adicionar repositório remoto
git remote add origin https://github.com/Jhony8727/refugio-s-lanche.git
```

---

## ⚡ Atalhos PowerShell

Crie aliases no PowerShell para comandos rápidos:

```powershell
# Adicionar ao perfil do PowerShell
function gs { git status }
function ga { git add . }
function gc { param($msg) git commit -m $msg }
function gp { git push origin main }
function gl { git log --oneline }
```

**Uso:**
```powershell
gs           # git status
ga           # git add .
gc "mensagem"  # git commit -m "mensagem"
gp           # git push origin main
gl           # git log --oneline
```

---

## 🎯 Workflow Diário Recomendado

```bash
# Ao começar o dia
git pull origin main

# Depois de fazer alterações
git status
git add .
git commit -m "feat: Descrição clara do que fez"

# Ao finalizar
git push origin main
```

---

## 📌 Dicas Importantes

1. **Commit frequentemente** - Faça commits pequenos e frequentes
2. **Mensagens claras** - Escreva mensagens descritivas
3. **Pull antes de Push** - Sempre puxe atualizações antes de enviar
4. **Não commite node_modules** - Use `.gitignore` (já configurado)
5. **Teste antes de commitar** - Certifique-se que o código funciona

---

## 🔐 Arquivo .gitignore Atual

```
node_modules/
.env
.vite/
dist/
build/
*.log
.DS_Store
```

Esses arquivos/pastas NÃO serão enviados para o GitHub.

---

## 📞 Ajuda Rápida

```bash
git --help           # Ajuda geral
git commit --help    # Ajuda sobre commit
git push --help      # Ajuda sobre push
```

---

**✨ Lembre-se:** Git é sua máquina do tempo! Use commits descritivos para poder voltar facilmente a qualquer ponto do desenvolvimento.
