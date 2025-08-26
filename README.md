# **Aplicação Cliente - Fideliza+ (React Native)**

Bem-vindo ao repositório da aplicação do cliente para o sistema **Fideliza+**. Esta aplicação foi construída em React Native e serve como a interface principal para os clientes interagirem com os seus programas de fidelidade.

## **✨ Funcionalidades Implementadas**

* **Fluxo de Autenticação Completo:**  
  * Tela de **Registro** para novos clientes (POST /register/client/).  
  * Tela de **Login** segura (POST /token).  
  * Gestão de sessão com tokens JWT.  
* **Painel do Cliente (Dashboard):**  
  * Exibição dos dados do usuário logado (nome e email).  
  * Geração e exibição do **QR Code** de fidelidade único do cliente.  
* **Consulta de Pontos e Prêmios:**  
  * Busca e exibe o saldo de pontos do cliente em tempo real, agrupado por empresa (GET /points/my-points).  
  * Lista todos os prêmios disponíveis, mostrando o progresso e o estado de resgate (redeemable) para cada um (GET /rewards/my-status).  
* **Resgate de Prêmios:**  
  * Botão interativo para resgatar prêmios.  
  * Caixa de diálogo de confirmação para evitar resgates acidentais.  
  * Comunicação com a API para "gastar" os pontos e registrar o resgate (POST /rewards/redeem).  
  * Atualização automática do painel após o resgate.
* **Reset de Senha:**  
  * Suporte para redefinição de senha via link dinâmico (deep linking).

## **🛠️ Tecnologias Utilizadas**

* **Framework:** [React Native](https://reactnative.dev/)  
* **Linguagem:** [TypeScript](https://www.typescriptlang.org/)  
* **Estilização:** StyleSheet (API nativa do React Native)  
* **Navegação:** React Navigation com suporte a deep linking.

## **🚀 Como Executar o Projeto Localmente**

### **1. Pré-requisitos**

* Ambiente de desenvolvimento React Native configurado (Node.js, JDK 17, Android Studio).  
* O [servidor backend do Fideliza+](https://github.com/wellingtonads/fideliza_backend) em execução localmente.

### **2. Configuração do Ambiente**

1. **Clone o repositório:**  
   ```bash
   git clone <URL_DO_SEU_REPOSITORIO_FRONTEND>
   cd fideliza_cliente
   ```

2. **Instale as dependências:**  
   ```bash
   npm install
   # ou, se usar Yarn
   # yarn install
   ```

3. **Configure a Conexão com a API:**  
   * Abra o arquivo `src/services/api.ts`.  
   * Atualize a URL base da API para corresponder ao seu ambiente de desenvolvimento:  
     * Para o **Emulador Android**, use: `http://10.0.2.2:8000/api/v1`  
     * Para um **dispositivo físico** na mesma rede Wi-Fi, use o IP da sua máquina: `http://SEU_IP_LOCAL:8000/api/v1`.

### **3. Executar a Aplicação**

1. Inicie um emulador a partir do Android Studio ou conecte um dispositivo físico.  
2. No terminal, dentro da pasta `fideliza_cliente`, execute:  
   ```bash
   npx react-native run-android
   ```

A aplicação será compilada e instalada no seu emulador ou dispositivo, pronta para ser testada.