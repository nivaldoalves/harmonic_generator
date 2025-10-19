# AGENTS.md

## Objetivo do Projeto

O objetivo deste projeto é criar uma aplicação web que serve como uma ferramenta para a geração de harmonias musicais a partir de uma única nota. A aplicação permite a criação de sequências harmônicas aleatórias, a audição e a opção de salvar as harmonias geradas.

## Tecnologias

- **Frontend:**
  - Angular
  - TypeScript
  - SCSS
  - Angular Material
- **Áudio:**
  - Tone.js

## Estrutura

O projeto segue a estrutura padrão de um projeto Angular:

- `src/`: Contém o código-fonte da aplicação.
- `src/app/`: Onde residem os componentes, serviços e módulos do Angular.
- `angular.json`: Arquivo de configuração do Angular CLI, definindo a estrutura do projeto e os comandos de build.
- `package.json`: Gerencia as dependências do projeto e os scripts.
- `styles.scss`: Estilos globais da aplicação.

## Instruções de Setup

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/nivaldoalves/harmonic_generator.git
   ```
2. **Navegue até o diretório do projeto:**
   ```bash
   cd harmonic_generator/
   ```
3. **Instale as dependências:**
   ```bash
   npm install
   ```
4. **Inicie o servidor de desenvolvimento:**
   ```bash
   ng serve
   ```
A aplicação estará disponível em `http://localhost:4200/`.

## Diretrizes Adicionais

- **Estilo de Código:** Siga as diretrizes de estilo do Angular e TypeScript. Utilize o Prettier para formatação de código.
- **Componentes:** Crie componentes de forma modular e reutilizável.
- **Commits:** Escreva mensagens de commit claras e descritivas.
