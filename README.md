# **Fideliza+ - Aplicação Cliente (React Native)**

Bem-vindo ao repositório oficial da aplicação cliente do sistema **Fideliza+**. Este aplicativo foi desenvolvido para oferecer uma experiência intuitiva e eficiente para os clientes gerenciarem seus programas de fidelidade.

## **📋 Visão Geral**

O **Fideliza+** é uma solução completa para programas de fidelidade, permitindo que empresas recompensem seus clientes de forma prática e personalizada. Este aplicativo móvel é a interface principal para os clientes acessarem suas informações de pontos, prêmios e muito mais.

## **✨ Funcionalidades Principais**

- **Autenticação Segura:**
  - Registro de novos clientes.
  - Login com suporte a tokens JWT.
- **Painel do Cliente:**
  - Visualização de informações pessoais e QR Code único.
- **Gestão de Pontos e Prêmios:**
  - Consulta de saldo de pontos em tempo real.
  - Listagem de prêmios disponíveis e status de resgate.
- **Histórico de Pontos:**
  - Visualização detalhada das transações de pontos realizadas.
- **Resgate de Prêmios:**
  - Processo interativo e seguro para resgatar prêmios.
- **Redefinição de Senha:**
  - Suporte a deep linking para redefinição de senha.

## **🛠️ Tecnologias Utilizadas**

- **Framework:** [React Native](https://reactnative.dev/)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Navegação:** [React Navigation](https://reactnavigation.org/) com suporte a deep linking
- **Estilização:** StyleSheet (API nativa do React Native)
- **Gerenciamento de Estado:** Context API
- **Comunicação com API:** Axios

## **🚀 Configuração e Execução**

### **1. Pré-requisitos**

- Ambiente de desenvolvimento React Native configurado (Node.js, JDK 17, Android Studio).
- Backend do **Fideliza+** em execução. Consulte o repositório [fideliza_backend](https://github.com/wellingtonads/fideliza_backend).

### **2. Configuração do Ambiente**

1. Clone o repositório:
   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd fideliza_cliente
   ```

2. Instale as dependências:
   ```bash
   npm install
   # ou
   yarn install
   ```

3. Configure a URL da API:
   - Edite o arquivo `src/services/api.ts` e atualize a constante `API_BASE_URL`:
     - Emulador Android: `http://10.0.2.2:8000/api/v1`
     - Dispositivo físico: `http://<SEU_IP_LOCAL>:8000/api/v1`

### **3. Executar o Aplicativo**

1. Inicie um emulador ou conecte um dispositivo físico.
2. Execute o comando:
   ```bash
   npx react-native run-android
   ```

O aplicativo será instalado e estará pronto para uso.

## **📄 Estrutura do Projeto**

- **src/**: Contém todo o código-fonte do aplicativo.
  - **assets/**: Recursos estáticos como imagens e fontes.
  - **components/**: Componentes reutilizáveis da interface.
  - **context/**: Gerenciamento de estado global com Context API.
  - **navigation/**: Configuração de navegação com React Navigation.
  - **screens/**: Telas principais do aplicativo.
  - **services/**: Configuração de comunicação com a API.
  - **styles/**: Estilos globais e temas.
  - **types/**: Definições de tipos TypeScript.

## **🎨 Padrão de Ícones (Semantic Icon Mapping)**

Para padronizar e facilitar a manutenção dos ícones foi adotado um mapeamento semântico centralizado:

- Arquivo: `src/components/iconNames.ts`
- Componente: `src/components/IconComponent.tsx`

### Objetivos
1. Permitir troca de biblioteca ou nomes de ícones em um único ponto.
2. Garantir legibilidade do código usando chaves de domínio (`home`, `pointHistory`, `rewards`, etc.).
3. Evitar espalhar strings mágicas pelos componentes/telas.

### Uso Básico

```tsx
import Icon from '../components/IconComponent';

// Usando chave semântica (preferencial)
<Icon icon="home" size={28} color="#444" />

// Usando nome direto da fonte (fallback)
<Icon name="user" size={28} />

// Com rótulo
<Icon icon="rewards" label="Prêmios" />
```

### Adicionando um Novo Ícone
1. Escolha um nome semântico coerente com o domínio (ex: `profile`, `settings`).
2. No arquivo `iconNames.ts`, adicione a chave ao tipo `AppIconKey` e ao objeto `AppIcons` apontando para o nome FontAwesome.
3. Use `<Icon icon="novaChave" />` nas telas.

### Boas Práticas
- Sempre prefira a prop `icon` (semântica) em vez de `name` (literal).
- Evite reutilizar a mesma chave para múltiplos significados.
- Se a biblioteca de ícones mudar, apenas atualize `AppIcons` (nenhuma tela precisa ser alterada).

### Futuras Evoluções Possíveis
- Criar pacote compartilhado entre apps (cliente / gestão) para reutilizar o mesmo mapping.
- Adicionar testes de snapshot para garantir que novas alterações não quebrem o componente.
- Suporte a temas alterando automaticamente a cor padrão.

---

## **📄 Licença**

Este projeto está licenciado sob a [MIT License](LICENSE).