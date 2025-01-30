# Windows Security Baseline Dashboard

O **Windows Security Baselines** é uma ferramenta web que permite visualizar e filtrar políticas e configurações de segurança do Windows a partir de arquivos `.htm` gerados pelo **Microsoft Security Compliance Toolkit**. Ele é projetado para ajudar administradores de sistemas e profissionais de segurança a padronizar, proteger e fortalecer suas infraestruturas com políticas configuradas para máxima segurança e conformidade.

---

## Funcionalidades

- **Importação de Arquivos `.htm`**:
  - Carregue arquivos `.htm` gerados pelo Microsoft Security Compliance Toolkit.
  - Extrai e exibe políticas e configurações de segurança do Windows.

- **Filtro de Políticas**:
  - Filtre políticas pelo nome para encontrar rapidamente as configurações desejadas.

- **Visualização em Cards**:
  - Exibe as políticas em cards organizados, com:
    - Nome da política.
    - Configuração (`Enabled` ou `Disabled`).
    - Caminho completo da política (ex: `Computer Configuration > Policies > Windows Settings > ...`).

- **Foco em Windows Settings**:
  - Somente políticas dentro de **Windows Settings** são exibidas e filtradas.

---

## Como Usar

1. **Baixe os Baselines**:
   - Acesse o [Microsoft Security Compliance Toolkit](https://www.microsoft.com/en-us/download/details.aspx?id=55319) e baixe os baselines atualizados para o Windows.

2. **Importe o Arquivo `.htm`**:
   - No dashboard, clique em **Importar Arquivo .htm** e selecione o arquivo `.htm` baixado.

3. **Visualize as Políticas**:
   - Após a importação, as políticas serão exibidas em cards organizados.
   - Use o campo de filtro para buscar políticas específicas.

4. **Explore os Detalhes**:
   - Cada card exibe o nome da política, a configuração e o caminho completo.

---

## Tecnologias Utilizadas

- **HTML5**: Estrutura da página.
- **CSS3**: Estilização e layout responsivo.
- **JavaScript**: Lógica de importação, filtragem e exibição das políticas.
- **Microsoft Security Compliance Toolkit**: Fonte dos baselines e políticas de segurança.

---

## Contato

- **LinkedIn**: [LinkedIn](https://www.linkedin.com/in/amdcastro/)

---

## Próximos Passos

- Converter arquivos de baseline .htm para .inf.