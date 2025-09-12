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

## ⚡️ Build e Execução

### Instalação e Build

```bash
# Instale dependências
npm install
# ou
yarn install

# Execute em modo desenvolvimento (Android)
npx react-native run-android

# Execute testes automatizados
npm test
```

### Ambiente
- Node.js >= 18
- JDK 17
- Android Studio (emulador ou dispositivo físico)
- Backend rodando (consulte [fideliza_backend](https://github.com/wellingtonads/fideliza_backend))

### Testes
- Para atualizar snapshots: `npm test -- -u` ou `npx jest --updateSnapshot`
- Para limpar cache do Jest: `npm test -- --clearCache`

---

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

## 🧩 Exemplos de Uso dos Componentes Semânticos

### Card
```tsx
import Card from '../components/Card';
<Card title="Prêmio" description="Vale R$ 50" icon="rewards" />
```

### ActionButton
```tsx
import ActionButton from '../components/ActionButton';
<ActionButton label="Resgatar" onPress={handleRedeem} icon="rewards" />
```

### IconComponent
```tsx
import Icon from '../components/IconComponent';
<Icon icon="home" size={28} color="#444" />
```

### CustomHeader
```tsx
import CustomHeader from '../components/CustomHeader';
<CustomHeader title="Minha Conta" icon="profile" />
```

---

## 🛠️ Como Adicionar Novos Ícones e Componentes

### Novos Ícones
1. Abra `src/components/iconNames.ts`.
2. Adicione a chave ao tipo `AppIconKey` e ao objeto `AppIcons`:
   ```ts
   export type AppIconKey = 'home' | 'profile' | 'settings' | 'novoIcone';
   export const AppIcons = {
     home: 'home',
     profile: 'user',
     settings: 'cog',
     novoIcone: 'star',
   };
   ```
3. Use `<Icon icon="novoIcone" />` nos componentes/telas.

### Novos Componentes
1. Crie o componente em `src/components/NovoComponente.tsx`.
2. Siga o padrão de props e documentação dos componentes existentes.
3. Adicione exemplos de uso no README.md.
4. Crie testes em `__tests__/NovoComponente.test.tsx`.

---

## 🎨 Refino Visual do README.md
- Títulos claros e hierárquicos.
- Listas e exemplos de código para facilitar onboarding.
- Separação de seções por linhas `---`.
- Links para documentação oficial e backend.
- Exemplos reais de uso dos componentes.
- Orientação para boas práticas e evolução futura.

---

## 📱 Responsividade e Adaptação de Telas

Todos os componentes e telas principais utilizam `flex`, porcentagens (`width: '100%'`), e espaçamentos adaptativos para garantir boa experiência em celulares pequenos, médios e grandes.

### Recomendações para Responsividade
- Prefira `flex: 1`, `justifyContent`, `alignItems` e `paddingHorizontal` para layout adaptativo.
- Use `Dimensions` ou `useWindowDimensions` para casos específicos (ex: imagens, QR Code, banners).
- Evite valores fixos de largura/altura, exceto para ícones/imagens que exigem proporção.
- Teste em emuladores e dispositivos reais de diferentes tamanhos.
- Utilize `SafeAreaView` para evitar sobreposição com notch/barras do sistema.

### Exemplos
```tsx
// Exemplo de container adaptativo
<View style={{ flex: 1, paddingHorizontal: 20, justifyContent: 'center' }}>
  <Card title="Exemplo" />
</View>

// Exemplo de imagem responsiva
<Image style={{ width: '100%', height: 140, resizeMode: 'contain' }} source={...} />
```

### Componentes já preparados
- Card, ActionButton, CustomHeader, IconComponent, StyledTextInput: todos usam `width: '100%'`, `flexDirection`, `alignItems` e espaçamentos flexíveis.
- Telas principais (Login, Home, Register, Rewards, PointHistory, Companies): layout centralizado, listas com `FlatList` e containers flexíveis.

### Como validar
- Rode o app em diferentes emuladores (Pixel 4, Moto G, Galaxy S, iPhone SE, iPhone 13).
- Ajuste o zoom/escala do emulador para simular telas pequenas e grandes.
- Se necessário, ajuste valores de padding/margin/fontSize para melhor adaptação visual.

---

## 📄 Licença

Este projeto está licenciado sob a [MIT License](LICENSE).