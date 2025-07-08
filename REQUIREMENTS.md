# Requisitos Funcionais - SISGENDA

## Módulo 1: Controle de Acesso e Segurança

### Submódulo 1.1: Autenticação

---

**RF001 - Exibição do Formulário de Login**

- **Descrição:** O sistema deve exibir um formulário de login claro e acessível como principal meio de entrada na plataforma.
- **Pré-condições:**
  1. O usuário acessa a URL base do sistema sem estar autenticado.
- **Pós-condições:**
  1. O formulário de login é renderizado, contendo campos para "Identificador" e "Senha", um botão "Entrar", e um link para "Esqueci minha senha".
- **Regras de Negócio:**
  - N/A

---

**RF002 - Autenticação de Usuário com Email**

- **Descrição:** O sistema deve permitir que um usuário se autentique utilizando seu endereço de email funcional como identificador.
- **Pré-condições:**
  1. O usuário preenche o campo "Identificador" com um email válido e cadastrado.
  2. O usuário preenche o campo "Senha" com a senha correta.
- **Pós-condições:**
  1. O usuário é autenticado com sucesso e redirecionado para o dashboard.
  2. O acesso é registrado em log de auditoria.
- **Regras de Negócio:**
  - N/A

---

**RF003 - Autenticação de Usuário com CPF**

- **Descrição:** O sistema deve permitir que um usuário se autentique utilizando seu número de CPF como identificador.
- **Pré-condições:**
  1. O usuário preenche o campo "Identificador" com um CPF válido e cadastrado.
  2. O usuário preenche o campo "Senha" com a senha correta.
- **Pós-condições:**
  1. O usuário é autenticado com sucesso e redirecionado para o dashboard.
  2. O acesso é registrado em log de auditoria.
- **Regras de Negócio:**
  - O sistema deve formatar/normalizar o CPF (removendo pontos e hífens) antes da consulta.

---

**RF004 - Validação de Campo de Identificador Vazio**

- **Descrição:** O sistema não deve permitir uma tentativa de login se o campo "Identificador" estiver vazio.
- **Pré-condições:**
  1. O usuário deixa o campo "Identificador" em branco e clica em "Entrar".
- **Pós-condições:**
  1. A submissão do formulário é bloqueada.
  2. Uma mensagem de erro "O campo Identificador é obrigatório." é exibida junto ao campo.
- **Regras de Negócio:**
  - A validação deve ocorrer no lado do cliente (client-side) para feedback imediato.

---

**RF005 - Validação de Campo de Senha Vazio**

- **Descrição:** O sistema não deve permitir uma tentativa de login se o campo "Senha" estiver vazio.
- **Pré-condições:**
  1. O usuário preenche o "Identificador" mas deixa a "Senha" em branco e clica em "Entrar".
- **Pós-condições:**
  1. A submissão do formulário é bloqueada.
  2. Uma mensagem de erro "O campo Senha é obrigatório." é exibida junto ao campo.
- **Regras de Negócio:**
  - A validação deve ocorrer no lado do cliente.

---

**RF006 - Tentativa de Autenticação com Credenciais Inválidas**

- **Descrição:** O sistema deve impedir o acesso de um usuário que forneça um identificador e/ou senha incorretos. Uma mensagem de erro genérica deve ser exibida, sem especificar qual campo está incorreto.
- **Pré-condições:**
  1. O usuário está na página de login.
- **Pós-condições:**
  1. O acesso do usuário é negado.
  2. O sistema exibe a mensagem: "Identificador ou senha inválidos."
  3. Os campos do formulário de login são limpos.
  4. O sistema registra a tentativa de login falha em log de auditoria.
- **Regras de Negócio:**
  - Para evitar ataques de "timing", o tempo de resposta para falha deve ser semelhante ao de sucesso.

---

**RF007 - Bloqueio de Conta por Tentativas de Login Excedidas**

- **Descrição:** O sistema deve bloquear temporariamente a conta de um usuário após um número excessivo de tentativas de login malsucedidas, para prevenir ataques de força bruta.
- **Pré-condições:**
  1. Um usuário tenta fazer login repetidamente com credenciais inválidas.
- **Pós-condições:**
  1. A conta do usuário é marcada como "bloqueada" no sistema.
  2. O sistema envia uma notificação ao email do usuário informando sobre o bloqueio e as ações necessárias.
  3. O usuário fica impedido de realizar login, mesmo com a senha correta, durante o período de bloqueio.
- **Regras de Negócio:**
  - O número máximo de tentativas de login permitidas é 5.
  - O período de bloqueio temporário é de 30 minutos.
  - O contador de tentativas falhas deve ser zerado após um login bem-sucedido.

---

**RF008 - Autenticação de Usuário com Conta Bloqueada**

- **Descrição:** O sistema deve negar a autenticação de um usuário cuja conta esteja com o status "bloqueada", mesmo que as credenciais inseridas sejam válidas, e informar sobre o estado de bloqueio.
- **Pré-condições:**
  1. A conta do usuário está com status "bloqueada".
  2. O usuário tenta realizar o login.
- **Pós-condições:**
  1. O acesso é negado.
  2. O sistema exibe a mensagem: "Esta conta está temporariamente bloqueada. Verifique seu email para mais instruções ou aguarde o fim do período de bloqueio."
- **Regras de Negócio:**
  - N/A

---

**RF009 - Autenticação de Usuário com Conta Inativa**

- **Descrição:** O sistema deve negar a autenticação de um usuário cuja conta esteja com o status "Inativa".
- **Pré-condições:**
  1. A conta de um usuário foi desativada por um administrador.
  2. O usuário tenta realizar o login com credenciais válidas.
- **Pós-condições:**
  1. O acesso é negado.
  2. O sistema exibe a mensagem: "Seu usuário está inativo. Por favor, contate o administrador do sistema."
- **Regras de Negócio:**
  - N/A

---

**RF010 - Desbloqueio Automático de Conta após Período de Bloqueio**

- **Descrição:** O sistema deve desbloquear automaticamente uma conta de usuário após o término do período de bloqueio temporário.
- **Pré-condições:**
  1. Uma conta de usuário está com o status "bloqueada".
  2. O tempo de bloqueio definido (e.g., 30 minutos) transcorreu.
- **Pós-condições:**
  1. O status da conta é alterado para "ativo".
  2. O usuário pode novamente tentar realizar o login.
- **Regras de Negócio:**
  - N/A

---

**RF011 - Logout Voluntário do Sistema**

- **Descrição:** O sistema deve permitir que um usuário autenticado encerre sua sessão de forma segura através de uma ação explícita (clicar no botão "Sair").
- **Pré-condições:**
  1. O usuário está autenticado no sistema.
- **Pós-condições:**
  1. A sessão do usuário é invalidada no servidor.
  2. O usuário é redirecionado para a página de login.
  3. O sistema registra o logout em log de auditoria.
- **Regras de Negócio:**
  - O token de sessão (se aplicável) deve ser invalidado/removido.

---

**RF012 - Timeout de Sessão por Inatividade**

- **Descrição:** O sistema deve encerrar automaticamente a sessão de um usuário após um período predeterminado de inatividade.
- **Pré-condições:**
  1. O usuário está autenticado.
  2. O usuário não realiza nenhuma interação com o sistema por um período definido.
- **Pós-condições:**
  1. A sessão do usuário é invalidada no servidor.
  2. Ao tentar realizar uma nova ação, o usuário é redirecionado para a página de login.
- **Regras de Negócio:**
  - O tempo de inatividade para expirar a sessão é de 15 minutos.

---

**RF013 - Exibição de Aviso de Timeout da Sessão**

- **Descrição:** O sistema deve exibir um aviso modal ao usuário pouco antes de a sessão expirar por inatividade, dando a ele a chance de continuar logado.
- **Pré-condições:**
  1. A sessão do usuário está prestes a expirar (e.g., no 14º minuto de inatividade).
- **Pós-condições:**
  1. Um pop-up é exibido com a mensagem: "Sua sessão está prestes a expirar por inatividade. Deseja continuar logado?".
  2. O pop-up contém os botões "Sim, continuar logado" e "Não, sair agora".
- **Regras de Negócio:**
  - O aviso deve ser exibido 1 minuto antes do timeout.

---

**RF014 - Manter Sessão Ativa via Aviso de Timeout**

- **Descrição:** O sistema deve renovar a sessão do usuário se ele optar por continuar logado através do aviso de timeout.
- **Pré-condições:**
  1. O aviso de timeout (RF013) é exibido.
  2. O usuário clica em "Sim, continuar logado".
- **Pós-condições:**
  1. O temporizador de inatividade da sessão é reiniciado.
  2. O pop-up de aviso é fechado.
- **Regras de Negócio:**
  - N/A

---

**RF015 - Logout via Aviso de Timeout**

- **Descrição:** O sistema deve fazer o logout do usuário se ele optar por sair através do aviso de timeout.
- **Pré-condições:**
  1. O aviso de timeout (RF013) é exibido.
  2. O usuário clica em "Não, sair agora".
- **Pós-condições:**
  1. A sessão é encerrada imediatamente, e o usuário é redirecionado para a página de login.
- **Regras de Negócio:**
  - N/A

---

**RF016 - Acesso à Funcionalidade "Esqueci Minha Senha"**

- **Descrição:** O sistema deve fornecer um link ou botão visível na tela de login para que o usuário inicie o processo de redefinição de senha.
- **Pré-condições:**
  1. O usuário está na página de login.
- **Pós-condições:**
  1. O usuário clica no link "Esqueci minha senha".
  2. O usuário é redirecionado para a página de solicitação de redefinição de senha.
- **Regras de Negócio:**
  - N/A

---

**RF017 - Solicitação de Redefinição de Senha**

- **Descrição:** O sistema deve permitir que o usuário solicite a redefinição de sua senha fornecendo seu email ou CPF.
- **Pré-condições:**
  1. O usuário está na página de solicitação de redefinição de senha.
- **Pós-condições:**
  1. O sistema solicita o email funcional ou CPF associado à conta.
  2. Se o identificador for válido e existir no sistema, um email com um link de redefinição de senha é enviado para o endereço cadastrado.
  3. O sistema exibe a mensagem: "Se o identificador informado estiver correto, um email com as instruções para redefinição de senha será enviado."
- **Regras de Negócio:**
  - O link de redefinição de senha deve ser único, de uso único e ter um tempo de expiração.
  - O tempo de expiração do link é de 1 hora.
  - O sistema deve apresentar a mesma mensagem de sucesso mesmo que o email não exista, para evitar enumeração de usuários.

---

**RF018 - Tentativa de Redefinição com Link Expirado ou Inválido**

- **Descrição:** O sistema deve exibir uma mensagem de erro se o usuário tentar usar um link de redefinição de senha que seja inválido ou já tenha expirado.
- **Pré-condições:**
  1. O usuário clica em um link de redefinição de senha que não é mais válido.
- **Pós-condições:**
  1. O sistema exibe uma página de erro com a mensagem: "O link para redefinição de senha é inválido ou já expirou. Por favor, solicite um novo."
  2. A página oferece um link para retornar à tela de solicitação de redefinição.
- **Regras de Negócio:**
  - N/A

---

**RF019 - Redefinição de Senha a partir do Link**

- **Descrição:** O sistema deve permitir que o usuário defina uma nova senha ao acessar o link de redefinição enviado por email.
- **Pré-condições:**
  1. O usuário clica em um link de redefinição de senha válido e não expirado.
- **Pós-condições:**
  1. O sistema exibe um formulário para que o usuário insira e confirme a nova senha.
  2. A nova senha é validada (de acordo com as regras de complexidade), salva no banco de dados de forma criptografada, e a senha antiga é invalidada.
  3. O link de redefinição de senha é invalidado após o uso.
  4. O usuário é redirecionado para a página de login com uma mensagem de sucesso.
- **Regras de Negócio:**
  - A nova senha não pode ser igual às últimas 3 senhas utilizadas.
  - A nova senha deve atender aos critérios de complexidade definidos.

---

**RF020 - Validação de Confirmação de Senha no Formulário**

- **Descrição:** O sistema deve validar, no lado do cliente, se os campos "Nova Senha" e "Confirmar Nova Senha" coincidem durante a redefinição.
- **Pré-condições:**
  1. O usuário está no formulário de definição de nova senha.
- **Pós-condições:**
  1. Se as senhas não coincidirem, uma mensagem de erro "As senhas não conferem." é exibida, e o envio do formulário é bloqueado.
- **Regras de Negócio:**
  - N/A

---

**RF021 - Política de Complexidade de Senha**

- **Descrição:** O sistema deve forçar que todas as senhas (no momento do cadastro ou redefinição) atendam a uma política de complexidade mínima.
- **Pré-condições:**
  1. Um usuário está criando ou alterando sua senha.
- **Pós-condições:**
  1. A senha é aceita somente se cumprir todos os critérios definidos.
  2. Se a senha não atender aos critérios, o sistema exibirá mensagens de erro específicas para cada regra não cumprida em tempo real.
- **Regras de Negócio:**
  - A senha deve ter no mínimo 8 caracteres.
  - A senha deve conter pelo menos uma letra maiúscula.
  - A senha deve conter pelo menos uma letra minúscula.
  - A senha deve conter pelo menos um número.
  - A senha deve conter pelo menos um caractere especial (e.g., @, #, $, %).

---

### Submódulo 1.2: Gestão de Perfis de Acesso (Roles)

---

**RF022 - Visualização de Perfis de Acesso**

- **Descrição:** O sistema deve permitir que um administrador visualize a lista de todos os perfis de acesso (roles) existentes, exibindo seus nomes e descrições.
- **Pré-condições:**
  1. O usuário deve estar autenticado com um perfil de "Administrador".
  2. O usuário deve navegar para a seção de "Gestão de Perfis de Acesso".
- **Pós-condições:**
  1. O sistema exibe uma lista paginada com os perfis de acesso, contendo "Nome do Perfil", "Descrição" e "Nº de Usuários Associados".
- **Regras de Negócio:**
  - Perfis padrão do sistema (e.g., "Administrador Master") não podem ser excluídos, apenas visualizados.

---

**RF023 - Paginação na Lista de Perfis de Acesso**

- **Descrição:** A lista de perfis de acesso deve ser paginada para garantir a performance da aplicação.
- **Pré-condições:**
  1. Existem mais perfis do que o limite de itens por página.
- **Pós-condições:**
  1. A lista é exibida em páginas.
  2. Controles de paginação (próxima, anterior, números de página) são exibidos e funcionais.
- **Regras de Negócio:**
  - O número padrão de itens por página é 20.

---

**RF024 - Busca de Perfis de Acesso**

- **Descrição:** O sistema deve permitir que o administrador busque por um perfil de acesso pelo seu nome.
- **Pré-condições:**
  1. O usuário está na tela de "Gestão de Perfis de Acesso".
- **Pós-condições:**
  1. O usuário digita parte do nome de um perfil na caixa de busca.
  2. A lista de perfis é atualizada para mostrar apenas os resultados que contêm o texto buscado.
- **Regras de Negócio:**
  - A busca não deve ser case-sensitive.

---

**RF025 - Criação de um Novo Perfil de Acesso**

- **Descrição:** O sistema deve permitir que um administrador crie um novo perfil de acesso, definindo um nome, uma descrição e associando um conjunto de permissões a ele.
- **Pré-condições:**
  1. O usuário deve estar autenticado com um perfil de "Administrador".
  2. O usuário está na tela de "Gestão de Perfis de Acesso" e clica na opção "Criar Novo Perfil".
- **Pós-condições:**
  1. Um novo perfil de acesso é criado e armazenado no sistema.
  2. O novo perfil passa a ser listado na tela de visualização de perfis.
  3. O sistema registra a criação do perfil em log de auditoria.
- **Regras de Negócio:**
  - O nome do perfil de acesso deve ser único no sistema.
  - O administrador deve selecionar pelo menos uma permissão para o novo perfil.

---

**RF026 - Validação de Nome de Perfil Duplicado**

- **Descrição:** O sistema deve impedir a criação de um perfil de acesso com um nome que já existe.
- **Pré-condições:**
  1. O usuário tenta criar um perfil com um nome já em uso.
- **Pós-condições:**
  1. O sistema exibe uma mensagem de erro: "Já existe um perfil com este nome."
  2. A criação do perfil é bloqueada.
- **Regras de Negócio:**
  - A validação deve ocorrer no lado do servidor (server-side).

---

**RF027 - Edição de um Perfil de Acesso**

- **Descrição:** O sistema deve permitir que um administrador edite as informações (nome, descrição) e as permissões de um perfil de acesso existente.
- **Pré-condições:**
  1. O usuário deve estar autenticado com um perfil de "Administrador".
  2. O usuário seleciona um perfil para editar na lista de perfis de acesso.
- **Pós-condições:**
  1. As informações e/ou permissões do perfil são atualizadas no sistema.
  2. As alterações são refletidas para todos os usuários associados a este perfil no próximo login.
  3. O sistema registra a edição do perfil em log de auditoria.
- **Regras de Negócio:**
  - O perfil "Administrador Master" não pode ser editado.
  - Se o nome do perfil for alterado, a unicidade deve ser mantida.

---

**RF028 - Exclusão de um Perfil de Acesso**

- **Descrição:** O sistema deve permitir que um administrador exclua um perfil de acesso que não esteja mais em uso.
- **Pré-condições:**
  1. O usuário deve estar autenticado com um perfil de "Administrador".
  2. O usuário seleciona um perfil para excluir na lista de perfis de acesso.
- **Pós-condições:**
  1. O perfil de acesso é removido permanentemente do sistema.
  2. O perfil não é mais exibido na lista de perfis.
  3. O sistema registra a exclusão do perfil em log de auditoria.
- **Regras de Negócio:**
  - Um perfil de acesso não pode ser excluído se houver usuários associados a ele. O sistema deve exibir uma mensagem de erro informativa.
  - Perfis de acesso padrão do sistema não podem ser excluídos.

---

**RF029 - Confirmação para Exclusão de Perfil de Acesso**

- **Descrição:** O sistema deve solicitar uma confirmação ao administrador antes de excluir permanentemente um perfil de acesso.
- **Pré-condições:**
  1. O usuário clica na opção "Excluir" para um perfil.
- **Pós-condições:**
  1. Um modal de confirmação é exibido com a mensagem: "Tem certeza que deseja excluir o perfil '[Nome do Perfil]'? Esta ação não pode ser desfeita."
  2. O modal contém os botões "Confirmar Exclusão" e "Cancelar".
- **Regras de Negócio:**
  - N/A

---

**RF030 - Associação de Usuário a um Perfil de Acesso**

- **Descrição:** O sistema deve permitir que um administrador associe um usuário a um ou mais perfis de acesso durante a criação ou edição do cadastro do usuário.
- **Pré-condições:**
  1. O usuário deve estar autenticado com um perfil de "Administrador".
  2. O usuário está na tela de criação ou edição de um usuário (ver Módulo de Cadastros).
- **Pós-condições:**
  1. O usuário editado passa a ter as permissões concedidas pelo perfil associado.
- **Regras de Negócio:**
  - Todo usuário deve ter pelo menos um perfil de acesso associado.

---

**RF031 - Remoção de Associação de Perfil de um Usuário**

- **Descrição:** O sistema deve permitir que um administrador remova a associação de um perfil de acesso de um usuário.
- **Pré-condições:**
  1. O usuário deve estar autenticado com um perfil de "Administrador".
  2. O usuário está na tela de edição de um usuário.
- **Pós-condições:**
  1. O usuário perde as permissões que eram concedidas pelo perfil removido.
- **Regras de Negócio:**
  - A remoção da associação só é permitida se o usuário continuar com pelo menos um outro perfil de acesso associado.

---

### Submódulo 1.3: Controle de Permissões

---

**RF032 - Visualização de Permissões do Sistema**

- **Descrição:** O sistema deve permitir que um administrador visualize a lista completa de todas as permissões disponíveis no sistema, agrupadas por módulo ou funcionalidade para facilitar a compreensão.
- **Pré-condições:**
  1. O usuário deve estar autenticado com um perfil de "Administrador".
  2. O usuário deve navegar para a seção de "Gestão de Perfis de Acesso" -> "Configurar Permissões".
- **Pós-condições:**
  1. O sistema exibe uma lista ou árvore de permissões, mostrando o nome da permissão (e.g., "agendamento:criar", "fornecedor:visualizar") e uma descrição clara do que ela concede.
- **Regras de Negócio:**
  - As permissões são definidas no código-fonte e lidas pelo sistema, não podendo ser criadas dinamicamente pela interface. Esta tela é para consulta e associação.

---

**RF033 - Atribuição de Permissões a um Perfil de Acesso**

- **Descrição:** Ao criar ou editar um perfil de acesso, o sistema deve permitir que o administrador selecione e atribua múltiplas permissões a esse perfil.
- **Pré-condições:**
  1. O usuário deve estar autenticado com um perfil de "Administrador".
  2. O usuário está na tela de criação ou edição de um Perfil de Acesso.
- **Pós-condições:**
  1. As permissões selecionadas são salvas e associadas ao perfil.
  2. O sistema registra a alteração de permissões em log de auditoria.
- **Regras de Negócio:**
  - A interface deve apresentar as permissões de forma organizada (e.g., checkboxes agrupados por módulo).

---

**RF034 - Remoção de Permissões de um Perfil de Acesso**

- **Descrição:** Ao editar um perfil de acesso, o sistema deve permitir que o administrador desmarque e remova permissões previamente associadas a esse perfil.
- **Pré-condições:**
  1. O usuário deve estar autenticado com um perfil de "Administrador".
  2. O usuário está na tela de edição de um Perfil de Acesso.
- **Pós-condições:**
  1. As permissões desmarcadas são removidas da associação com o perfil.
  2. O sistema registra a alteração de permissões em log de auditoria.
- **Regras de Negócio:**
  - N/A

---

**RF035 - Verificação de Permissão para Acesso a Rotas/Páginas**

- **Descrição:** O sistema deve verificar automaticamente se o usuário autenticado possui a permissão necessária para acessar uma determinada rota (página) do sistema.
- **Pré-condições:**
  1. O usuário está autenticado.
  2. O usuário tenta navegar para uma URL do sistema.
- **Pós-condições:**
  1. Se o usuário tiver a permissão, a página é carregada normalmente.
  2. Se o usuário não tiver a permissão, ele é redirecionado para uma página de "Acesso Negado" (Erro 403) e a tentativa é registrada em log.
- **Regras de Negócio:**
  - Cada rota protegida do sistema deve estar mapeada a uma ou mais permissões necessárias.

---

**RF036 - Verificação de Permissão para Execução de Ações**

- **Descrição:** O sistema deve verificar automaticamente se o usuário autenticado possui a permissão necessária para executar uma ação específica (e.g., clicar em um botão "Criar", "Editar", "Excluir").
- **Pré-condições:**
  1. O usuário está autenticado e visualizando uma página do sistema.
  2. O usuário tenta executar uma ação que exige uma permissão específica.
- **Pós-condições:**
  1. Se o usuário tiver a permissão, a ação é executada com sucesso.
  2. Se o usuário não tiver a permissão, a ação é bloqueada e o sistema exibe uma mensagem de erro amigável (e.g., "Você não tem permissão para executar esta ação.").
- **Regras de Negócio:**
  - O controle deve ser feito tanto no frontend (desabilitando ou ocultando o elemento de UI) quanto no backend (validando a permissão na chamada da API).

---

**RF037 - Ocultar/Desabilitar Elementos de UI com Base na Permissão**

- **Descrição:** O sistema deve dinamicamente ocultar ou desabilitar elementos da interface do usuário (como botões, links, ou campos de formulário) para os quais o usuário autenticado não possui a permissão correspondente.
- **Pré-condições:**
  1. O usuário está autenticado.
  2. Uma página do sistema é carregada.
- **Pós-condições:**
  1. A interface exibida para o usuário contém apenas os elementos com os quais ele pode interagir de acordo com suas permissões.
- **Regras de Negócio:**
  - Exemplo: Um usuário sem a permissão "usuario:criar" não deve visualizar o botão "Adicionar Novo Usuário".

---

### Submódulo 1.4: Auditoria

---

**RF038 - Registro de Log de Ações Críticas**

- **Descrição:** O sistema deve registrar automaticamente em um log de auditoria todas as ações consideradas críticas para a segurança e integridade dos dados.
- **Pré-condições:**
  1. Um usuário executa uma ação crítica no sistema.
- **Pós-condições:**
  1. Um novo registro de log é criado e armazenado de forma segura.
- **Regras de Negócio:**
  - As ações a serem auditadas incluem, mas não se limitam a:
    - Login (sucesso e falha)
    - Logout
    - Tentativa de acesso a recurso não autorizado
    - Criação, edição e exclusão de Usuários
    - Criação, edição e exclusão de Perfis de Acesso
    - Criação, edição e exclusão de Organizações Militares
    - Criação, edição e exclusão de Fornecedores
    - Criação, cancelamento e alteração de status de Agendamentos
    - Geração de relatórios
  - Cada registro de log deve conter no mínimo:
    - Timestamp (Data e Hora do evento)
    - ID do Usuário que realizou a ação
    - Endereço IP de origem
    - Tipo de Ação (e.g., "LOGIN_SUCCESS", "USER_CREATE")
    - Detalhes da Ação (e.g., "Usuário 'joao.silva' criado")
    - Status (Sucesso/Falha)

---

**RF039 - Visualização de Logs de Auditoria**

- **Descrição:** O sistema deve fornecer uma interface para que administradores possam visualizar os logs de auditoria registrados.
- **Pré-condições:**
  1. O usuário deve estar autenticado com um perfil de "Administrador".
  2. O usuário navega para a tela de "Logs de Auditoria".
- **Pós-condições:**
  1. O sistema exibe uma lista paginada e em ordem cronológica decrescente dos eventos de auditoria.
  2. Os dados de cada evento (Timestamp, Usuário, IP, Ação, etc.) são exibidos em colunas.
- **Regras de Negócio:**
  - Os logs de auditoria são imutáveis. Não deve haver funcionalidade para editar ou excluir logs através da interface.

---

**RF040 - Filtragem de Logs de Auditoria**

- **Descrição:** O sistema deve permitir que o administrador filtre os logs de auditoria por um ou mais critérios para facilitar a busca por eventos específicos.
- **Pré-condições:**
  1. O usuário está na tela de visualização de logs de auditoria.
- **Pós-condições:**
  1. A lista de logs é atualizada para exibir apenas os registros que correspondem aos critérios de filtro aplicados.
- **Regras de Negócio:**
  - Os critérios de filtragem devem incluir:
    - Intervalo de datas (data de início e fim)
    - Usuário (selecionar um usuário específico)
    - Tipo de Ação (e.g., "LOGIN_FAILURE", "SUPPLIER_DELETE")
    - Endereço IP

---

**RF041 - Exportação de Logs de Auditoria**

- **Descrição:** O sistema deve permitir que o administrador exporte os resultados (filtrados ou não) da trilha de auditoria para um formato de arquivo padronizado.
- **Pré-condições:**
  1. O usuário está na tela de visualização de logs de auditoria.
- **Pós-condições:**
  1. O sistema gera um arquivo contendo os dados da trilha de auditoria e inicia o download para o usuário.
- **Regras de Negócio:**
  - Os formatos de exportação suportados devem ser CSV e PDF.
  - A exportação deve respeitar os filtros aplicados no momento da solicitação.

---

## Módulo 2: Cadastros Centrais

### Submódulo 2.1: Gestão de Organizações Militares (OM)

---

**RF042 - Cadastro de Nova Organização Militar (OM)**

- **Descrição:** O sistema deve permitir que um usuário com permissão adequada cadastre uma nova Organização Militar (OM) no sistema, fornecendo todas as informações necessárias.
- **Pré-condições:**
  1. O usuário está autenticado e possui a permissão "om:criar".
  2. O usuário navega para a seção de "Cadastros" -> "Organizações Militares" e seleciona a opção "Nova OM".
- **Pós-condições:**
  1. Uma nova OM é registrada no banco de dados com um status inicial "Ativa".
  2. A nova OM passa a ser listada na tela de visualização de OMs.
  3. A ação é registrada no log de auditoria.
- **Regras de Negócio:**
  - O campo "Sigla" da OM deve ser único no sistema.
  - Os campos obrigatórios para cadastro são: Nome Completo, Sigla, CNPJ, Endereço Completo (Logradouro, Número, Bairro, Cidade, Estado, CEP), Telefone de contato.
  - O CNPJ deve ser validado quanto ao formato e à unicidade.

---

**RF043 - Visualização de Organizações Militares Cadastradas**

- **Descrição:** O sistema deve permitir que usuários com a devida permissão visualizem a lista de todas as Organizações Militares cadastradas de forma paginada.
- **Pré-condições:**
  1. O usuário está autenticado e possui a permissão "om:visualizar".
  2. O usuário navega para a seção "Organizações Militares".
- **Pós-condições:**
  1. O sistema exibe uma tabela com as OMs, contendo as colunas: Sigla, Nome Completo, CNPJ, Cidade/Estado e Status (Ativa/Inativa).
- **Regras de Negócio:**
  - N/A

---

**RF044 - Busca e Filtragem de Organizações Militares**

- **Descrição:** O sistema deve permitir a busca e a filtragem da lista de OMs para facilitar a localização de registros específicos.
- **Pré-condições:**
  1. O usuário está na tela de visualização de OMs.
- **Pós-condições:**
  1. A lista de OMs é atualizada para exibir apenas os registros que correspondem aos critérios de busca ou filtro.
- **Regras de Negócio:**
  - Os campos de busca devem incluir: Sigla, Nome, CNPJ.
  - O filtro deve permitir a seleção por "Status" (Ativa, Inativa, Todas).

---

**RF045 - Edição de Dados de uma Organização Militar**

- **Descrição:** O sistema deve permitir que um usuário com permissão edite as informações cadastrais de uma OM existente.
- **Pré-condições:**
  1. O usuário está autenticado e possui a permissão "om:editar".
  2. O usuário seleciona a opção "Editar" para uma OM na lista.
- **Pós-condições:**
  1. Os dados da OM são atualizados no banco de dados.
  2. A ação é registrada no log de auditoria.
- **Regras de Negócio:**
  - A Sigla e o CNPJ, após cadastrados, não podem ser alterados para garantir a integridade referencial. Para corrigi-los, a OM deve ser inativada e uma nova deve ser criada.

---

**RF046 - Inativação de uma Organização Militar**

- **Descrição:** O sistema deve permitir que um usuário com permissão altere o status de uma OM para "Inativa", impedindo que ela seja utilizada em novos agendamentos ou associações.
- **Pré-condições:**
  1. O usuário está autenticado e possui a permissão "om:inativar".
  2. O usuário seleciona a opção "Inativar" para uma OM ativa na lista.
- **Pós-condições:**
  1. O status da OM é alterado para "Inativa".
  2. A OM inativa não aparecerá mais em listas de seleção para novos agendamentos.
  3. A ação é registrada no log de auditoria.
- **Regras de Negócio:**
  - Uma OM não pode ser inativada se existirem agendamentos futuros ou pendentes associados a ela.

---

**RF047 - Reativação de uma Organização Militar**

- **Descrição:** O sistema deve permitir que um usuário com permissão altere o status de uma OM inativa de volta para "Ativa".
- **Pré-condições:**
  1. O usuário está autenticado e possui a permissão "om:inativar" (a mesma permissão para o ato inverso).
  2. O usuário seleciona a opção "Reativar" para uma OM inativa na lista.
- **Pós-condições:**
  1. O status da OM é alterado para "Ativa".
  2. A OM volta a ficar disponível para seleção em novos agendamentos.
  3. A ação é registrada no log de auditoria.
- **Regras de Negócio:**
  - N/A

---

**RF048 - Visualização de Detalhes de uma Organização Militar**

- **Descrição:** O sistema deve permitir que o usuário visualize todos os dados cadastrais de uma OM específica, incluindo informações de contato e endereço, e um histórico de usuários vinculados.
- **Pré-condições:**
  1. O usuário está autenticado e possui a permissão "om:visualizar".
  2. O usuário clica no nome ou em um ícone de "detalhes" de uma OM na lista.
- **Pós-condições:**
  1. O sistema exibe uma tela com todas as informações detalhadas da OM selecionada.
  2. Uma aba ou seção na tela de detalhes exibe a lista de usuários do sistema que estão associados a esta OM.
- **Regras de Negócio:**
  - N/A

---

### Submódulo 2.2: Gestão de Fornecedores

---

**RF049 - Cadastro de Novo Fornecedor**

- **Descrição:** O sistema deve permitir que um usuário com a devida permissão cadastre um novo fornecedor de produtos ou serviços.
- **Pré-condições:**
  1. O usuário está autenticado e possui a permissão "fornecedor:criar".
  2. O usuário navega para a seção "Cadastros" -> "Fornecedores" e seleciona "Novo Fornecedor".
- **Pós-condições:**
  1. Um novo fornecedor é registrado no banco de dados com status "Ativo".
  2. O novo fornecedor passa a ser listado na tela de visualização de fornecedores.
  3. A ação é registrada no log de auditoria.
- **Regras de Negócio:**
  - Os campos obrigatórios para cadastro são: Razão Social, CNPJ/CPF, Nome Fantasia (se aplicável), Endereço Completo, Telefone de Contato e Email.
  - O sistema deve validar o CNPJ ou CPF quanto ao formato e unicidade no cadastro de fornecedores.
  - O fornecedor pode ser categorizado por "Tipo de Serviço/Produto" (e.g., Alimentação, Manutenção, Material de Escritório).

---

**RF050 - Visualização de Fornecedores Cadastrados**

- **Descrição:** O sistema deve permitir a visualização da lista de todos os fornecedores cadastrados de forma paginada.
- **Pré-condições:**
  1. O usuário está autenticado e possui a permissão "fornecedor:visualizar".
  2. O usuário navega para a seção "Fornecedores".
- **Pós-condições:**
  1. O sistema exibe uma tabela com os fornecedores, contendo as colunas: Razão Social, CNPJ/CPF, Contato Principal (Telefone/Email), Categoria e Status.
- **Regras de Negócio:**
  - N/A

---

**RF051 - Busca e Filtragem de Fornecedores**

- **Descrição:** O sistema deve fornecer funcionalidades de busca e filtro para localizar fornecedores específicos na lista.
- **Pré-condições:**
  1. O usuário está na tela de visualização de fornecedores.
- **Pós-condições:**
  1. A lista de fornecedores é atualizada para refletir os critérios de busca e filtro aplicados.
- **Regras de Negócio:**
  - A busca deve poder ser feita por: Razão Social, Nome Fantasia, CNPJ/CPF.
  - Os filtros devem incluir: Categoria de Serviço/Produto e Status (Ativo/Inativo).

---

**RF052 - Edição de Dados de um Fornecedor**

- **Descrição:** O sistema deve permitir a edição das informações cadastrais de um fornecedor existente.
- **Pré-condições:**
  1. O usuário está autenticado e possui a permissão "fornecedor:editar".
  2. O usuário seleciona a opção "Editar" para um fornecedor na lista.
- **Pós-condições:**
  1. Os dados do fornecedor são atualizados no banco de dados.
  2. A ação é registrada no log de auditoria.
- **Regras de Negócio:**
  - O CNPJ/CPF de um fornecedor não pode ser alterado. Para correções, o cadastro deve ser inativado e um novo deve ser criado.

---

**RF053 - Inativação de um Fornecedor**

- **Descrição:** O sistema deve permitir que o status de um fornecedor seja alterado para "Inativo", removendo-o das opções para novos agendamentos.
- **Pré-condições:**
  1. O usuário está autenticado e possui a permissão "fornecedor:inativar".
  2. O usuário seleciona a opção "Inativar" para um fornecedor ativo na lista.
- **Pós-condições:**
  1. O status do fornecedor é alterado para "Inativo".
  2. A ação é registrada no log de auditoria.
- **Regras de Negócio:**
  - Um fornecedor não pode ser inativado se houver agendamentos futuros ou pendentes vinculados a ele.

---

**RF054 - Reativação de um Fornecedor**

- **Descrição:** O sistema deve permitir reativar um fornecedor previamente inativado.
- **Pré-condições:**
  1. O usuário está autenticado e possui a permissão "fornecedor:inativar".
  2. O usuário seleciona a opção "Reativar" para um fornecedor inativo.
- **Pós-condições:**
  1. O status do fornecedor é alterado para "Ativo".
  2. O fornecedor volta a estar disponível para novos agendamentos.
  3. A ação é registrada no log de auditoria.
- **Regras de Negócio:**
  - N/A

---

**RF055 - Visualização de Detalhes de um Fornecedor**

- **Descrição:** O sistema deve permitir a visualização de todos os dados de um fornecedor, incluindo múltiplos contatos, endereços secundários e um histórico de agendamentos associados.
- **Pré-condições:**
  1. O usuário está autenticado e possui a permissão "fornecedor:visualizar".
  2. O usuário clica no nome de um fornecedor na lista.
- **Pós-condições:**
  1. O sistema exibe uma tela de detalhes com todas as informações do fornecedor.
  2. A tela de detalhes deve conter abas para: "Dados Cadastrais", "Contatos Adicionais", "Histórico de Agendamentos".
- **Regras de Negócio:**
  - O histórico de agendamentos deve ser uma lista paginada e clicável, levando ao detalhe do agendamento específico.

---

**RF056 - Gestão de Categorias de Fornecedores**

- **Descrição:** O sistema deve permitir que um administrador gerencie as categorias de serviço/produto que podem ser associadas aos fornecedores.
- **Pré-condições:**
  1. O usuário está autenticado com um perfil de "Administrador".
  2. O usuário navega para a área de "Configurações" -> "Categorias de Fornecedores".
- **Pós-condições:**
  1. O administrador pode Criar, Editar e Excluir categorias.
- **Regras de Negócio:**
  - Uma categoria não pode ser excluída se estiver associada a pelo menos um fornecedor. Ela deve primeiro ser removida de todos os fornecedores.
  - O nome da categoria deve ser único.

---

### Submódulo 2.3: Gestão de Usuários do Sistema

---

**RF057 - Criação de Novo Usuário**

- **Descrição:** O sistema deve permitir que um administrador crie um novo usuário, associando-o a uma Organização Militar (OM) e a um ou mais perfis de acesso.
- **Pré-condições:**
  1. O usuário está autenticado e possui a permissão "usuario:criar".
  2. O usuário navega para a seção "Cadastros" -> "Usuários" e seleciona "Novo Usuário".
- **Pós-condições:**
  1. Um novo usuário é registrado no banco de dados.
  2. O sistema envia um email de boas-vindas ao novo usuário com uma senha temporária ou um link para definição da primeira senha.
  3. A ação é registrada no log de auditoria.
- **Regras de Negócio:**
  - Campos obrigatórios: Nome Completo, Email Funcional, CPF, Matrícula/ID Funcional, Organização Militar (OM) de lotação, Perfil(is) de Acesso.
  - O Email Funcional e o CPF devem ser únicos no sistema.
  - O sistema deve permitir a seleção da OM a partir de uma lista de OMs ativas.
  - O sistema deve permitir a seleção dos perfis de acesso a partir de uma lista de perfis existentes.

---

**RF058 - Visualização de Usuários Cadastrados**

- **Descrição:** O sistema deve permitir a visualização da lista de todos os usuários cadastrados de forma paginada.
- **Pré-condições:**
  1. O usuário está autenticado e possui a permissão "usuario:visualizar".
  2. O usuário navega para a seção "Usuários".
- **Pós-condições:**
  1. O sistema exibe uma tabela com os usuários, contendo as colunas: Nome, Email, OM de Lotação, Perfil(is) e Status (Ativo/Inativo).
- **Regras de Negócio:**
  - N/A

---

**RF059 - Busca e Filtragem de Usuários**

- **Descrição:** O sistema deve permitir a busca e a filtragem da lista de usuários para facilitar a localização de registros específicos.
- **Pré-condições:**
  1. O usuário está na tela de visualização de usuários.
- **Pós-condições:**
  1. A lista de usuários é atualizada para exibir apenas os registros que correspondem aos critérios de busca ou filtro.
- **Regras de Negócio:**
  - A busca deve poder ser feita por: Nome, Email, CPF.
  - Os filtros devem incluir: OM de Lotação, Perfil de Acesso e Status (Ativo, Inativo, Bloqueado).

---

**RF060 - Edição de Dados de um Usuário**

- **Descrição:** O sistema deve permitir que um administrador edite as informações cadastrais, a OM de lotação e os perfis de acesso de um usuário existente.
- **Pré-condições:**
  1. O usuário está autenticado e possui a permissão "usuario:editar".
  2. O usuário seleciona a opção "Editar" para um usuário na lista.
- **Pós-condições:**
  1. Os dados do usuário são atualizados no banco de dados.
  2. A ação é registrada no log de auditoria.
- **Regras de Negócio:**
  - O CPF do usuário não pode ser alterado.
  - O email do usuário só pode ser alterado por um administrador master e requer uma nova verificação.

---

**RF061 - Inativação de um Usuário**

- **Descrição:** O sistema deve permitir que um administrador inative a conta de um usuário, o que revoga seu acesso ao sistema.
- **Pré-condições:**
  1. O usuário está autenticado e possui a permissão "usuario:inativar".
  2. O usuário seleciona a opção "Inativar" para um usuário ativo na lista.
- **Pós-condições:**
  1. O status do usuário é alterado para "Inativo".
  2. A sessão do usuário, se ativa, é imediatamente invalidada.
  3. O usuário inativo não consegue mais realizar login.
  4. A ação é registrada no log de auditoria.
- **Regras de Negócio:**
  - N/A

---

**RF062 - Reativação de um Usuário**

- **Descrição:** O sistema deve permitir que um administrador reative uma conta de usuário previamente inativada.
- **Pré-condições:**
  1. O usuário está autenticado e possui a permissão "usuario:inativar".
  2. O usuário seleciona a opção "Reativar" para um usuário inativo na lista.
- **Pós-condições:**
  1. O status do usuário é alterado para "Ativo".
  2. O usuário pode novamente fazer login no sistema.
  3. A ação é registrada no log de auditoria.
- **Regras de Negócio:**
  - N/A

---

**RF063 - Desbloqueio Manual de Conta de Usuário**

- **Descrição:** O sistema deve permitir que um administrador desbloqueie manualmente uma conta de usuário que foi bloqueada por excesso de tentativas de login.
- **Pré-condições:**
  1. O usuário está autenticado e possui a permissão "usuario:desbloquear".
  2. O usuário localiza um usuário com status "Bloqueado" e seleciona a opção "Desbloquear".
- **Pós-condições:**
  1. O status do usuário é alterado para "Ativo".
  2. A ação é registrada no log de auditoria.
  3. Uma notificação é enviada ao email do usuário informando sobre o desbloqueio.
- **Regras de Negócio:**
  - N/A

---

**RF064 - Reset de Senha pelo Administrador**

- **Descrição:** O sistema deve permitir que um administrador inicie um processo de redefinição de senha para um usuário.
- **Pré-condições:**
  1. O usuário está autenticado e possui a permissão "usuario:resetar-senha".
  2. O usuário está na tela de edição ou detalhes de um usuário e seleciona a opção "Resetar Senha".
- **Pós-condições:**
  1. O sistema envia um email ao usuário com um link para que ele defina uma nova senha.
  2. A ação é registrada no log de auditoria.
- **Regras de Negócio:**
  - O administrador não define a senha, apenas dispara o fluxo que o usuário seguirá para definir sua própria nova senha.

---

**RF065 - Alteração da Própria Senha pelo Usuário**

- **Descrição:** O sistema deve permitir que um usuário autenticado altere sua própria senha.
- **Pré-condições:**
  1. O usuário está autenticado no sistema.
  2. O usuário navega para a sua página de "Perfil" ou "Configurações da Conta".
- **Pós-condições:**
  1. O sistema solicita a senha atual e a nova senha (com confirmação).
  2. Após validar a senha atual, a nova senha é salva de forma criptografada, substituindo a antiga.
  3. A ação é registrada no log de auditoria.
- **Regras de Negócio:**
  - A nova senha deve seguir a política de complexidade (RF010).
  - A nova senha não pode ser igual às últimas 3 senhas utilizadas.

---

## Módulo 3: Gestão de Agendamentos

### Submódulo 3.1: Operações de Agendamento

---

**RF066 - Criação de Novo Agendamento**

- **Descrição:** O sistema deve permitir que um usuário com permissão crie um novo agendamento, associando uma OM, um fornecedor, e especificando os detalhes do serviço ou entrega.
- **Pré-condições:**
  1. O usuário está autenticado e possui a permissão "agendamento:criar".
  2. O usuário navega para a seção "Agendamentos" e seleciona "Novo Agendamento".
- **Pós-condições:**
  1. Um novo registro de agendamento é criado no sistema com um status inicial "Agendado".
  2. O sistema gera um número de protocolo único para o agendamento.
  3. Notificações são enviadas para as partes relevantes (e.g., gestor da OM, fornecedor).
  4. A ação é registrada no log de auditoria.
- **Regras de Negócio:**
  - Campos obrigatórios: Organização Militar (solicitante), Fornecedor, Data e Hora do agendamento, Tipo de Serviço/Entrega, Descrição detalhada.
  - O usuário só pode selecionar OMs e Fornecedores com status "Ativo".
  - A data e hora do agendamento devem ser futuras.
  - O sistema deve verificar a disponibilidade de horários (ver submódulo de Calendário).

---

**RF067 - Visualização de Lista de Agendamentos (Visão Geral)**

- **Descrição:** O sistema deve exibir uma lista paginada de todos os agendamentos sobre os quais o usuário tem permissão de visualização.
- **Pré-condições:**
  1. O usuário está autenticado e possui a permissão "agendamento:visualizar_todos" ou "agendamento:visualizar_proprios".
  2. O usuário navega para a seção "Agendamentos".
- **Pós-condições:**
  1. O sistema exibe uma tabela com os agendamentos, contendo as colunas: Protocolo, OM Solicitante, Fornecedor, Data/Hora, Status.
- **Regras de Negócio:**
  - Usuários com permissão "visualizar_proprios" veem apenas agendamentos ligados à sua OM.
  - Usuários com "visualizar_todos" (e.g., administradores) veem todos os agendamentos.
  - O status do agendamento deve ser destacado por cor (e.g., Agendado, Em Andamento, Concluído, Cancelado).

---

**RF068 - Busca e Filtragem de Agendamentos**

- **Descrição:** O sistema deve permitir a busca e a filtragem da lista de agendamentos para facilitar a localização de registros.
- **Pré-condições:**
  1. O usuário está na tela de visualização de agendamentos.
- **Pós-condições:**
  1. A lista de agendamentos é atualizada para exibir apenas os registros que correspondem aos critérios aplicados.
- **Regras de Negócio:**
  - A busca deve poder ser feita por: Número do Protocolo.
  - Os filtros devem incluir: Intervalo de Datas, Organização Militar, Fornecedor, Status do Agendamento.

---

**RF069 - Visualização de Detalhes de um Agendamento**

- **Descrição:** O sistema deve permitir a visualização de todas as informações detalhadas de um agendamento específico.
- **Pré-condições:**
  1. O usuário tem permissão para visualizar o agendamento.
  2. O usuário clica em um agendamento na lista.
- **Pós-condições:**
  1. O sistema exibe uma tela com todos os detalhes do agendamento, incluindo:
     - Dados completos da OM e do Fornecedor.
     - Linha do tempo do histórico de status do agendamento.
     - Campo para observações e anexos.
- **Regras de Negócio:**
  - N/A

---

**RF070 - Edição de um Agendamento**

- **Descrição:** O sistema deve permitir que um usuário com permissão edite as informações de um agendamento existente, desde que o agendamento não esteja em um status final (Concluído ou Cancelado).
- **Pré-condições:**
  1. O usuário está autenticado e possui a permissão "agendamento:editar".
  2. O agendamento está com status "Agendado".
  3. O usuário seleciona a opção "Editar" em um agendamento.
- **Pós-condições:**
  1. Os dados do agendamento são atualizados.
  2. A ação é registrada no log de auditoria.
  3. Notificações sobre a alteração são enviadas às partes envolvidas.
- **Regras de Negócio:**
  - Apenas alguns campos podem ser editados, como a descrição e os anexos. Para alterar data, hora, fornecedor ou OM, o agendamento deve ser cancelado e um novo criado.

---

**RF071 - Cancelamento de um Agendamento**

- **Descrição:** O sistema deve permitir que um usuário autorizado cancele um agendamento.
- **Pré-condições:**
  1. O usuário está autenticado e possui a permissão "agendamento:cancelar".
  2. O agendamento está com status "Agendado" ou "Em Andamento".
  3. O usuário seleciona a opção "Cancelar" em um agendamento.
- **Pós-condições:**
  1. O sistema solicita um motivo para o cancelamento (obrigatório).
  2. O status do agendamento é alterado para "Cancelado".
  3. A ação e o motivo são registrados no log de auditoria e no histórico do agendamento.
  4. Notificações sobre o cancelamento são enviadas.
- **Regras de Negócio:**
  - Agendamentos com status "Concluído" não podem ser cancelados.

---

**RF072 - Alteração de Status do Agendamento (Fluxo de Trabalho)**

- **Descrição:** O sistema deve permitir a progressão manual do status de um agendamento seguindo um fluxo de trabalho predefinido.
- **Pré-condições:**
  1. O usuário tem permissão para gerenciar o status do agendamento.
  2. O usuário está na tela de detalhes de um agendamento.
- **Pós-condições:**
  1. O status do agendamento é alterado para o próximo estágio válido.
  2. A alteração é registrada no histórico do agendamento e no log de auditoria.
- **Regras de Negócio:**
  - O fluxo de status permitido é:
    - Agendado -> Em Andamento
    - Em Andamento -> Concluído
    - Em Andamento -> Concluído com Ressalvas
  - O status "Cancelado" é um estado final e pode ser acionado a partir de "Agendado".

---

**RF073 - Adição de Anexos a um Agendamento**

- **Descrição:** O sistema deve permitir que usuários adicionem arquivos (anexos) a um registro de agendamento, tanto na criação quanto na edição.
- **Pré-condições:**
  1. O usuário está na tela de criação ou edição de um agendamento.
- **Pós-condições:**
  1. O arquivo é enviado para o servidor e associado ao agendamento.
  2. O anexo fica disponível para visualização e download na tela de detalhes do agendamento.
- **Regras de Negócio:**
  - Tipos de arquivo permitidos: PDF, DOCX, XLSX, JPG, PNG.
  - Tamanho máximo por arquivo: 10 MB.
  - Limite de 5 anexos por agendamento.

---

**RF074 - Remoção de Anexos de um Agendamento**

- **Descrição:** O sistema deve permitir que o proprietário do anexo ou um administrador remova um anexo de um agendamento.
- **Pré-condições:**
  1. O usuário tem permissão para editar o agendamento.
  2. O usuário está visualizando os anexos na tela de edição do agendamento.
- **Pós-condições:**
  1. O arquivo é desassociado do agendamento e marcado para exclusão.
- **Regras de Negócio:**
  - A exclusão só é permitida se o agendamento não estiver "Concluído" ou "Cancelado".

---

**RF075 - Registro de Observações em Agendamento**

- **Descrição:** O sistema deve permitir que usuários autorizados adicionem observações textuais a um agendamento em qualquer fase do seu ciclo de vida.
- **Pré-condições:**
  1. O usuário está na tela de detalhes de um agendamento.
- **Pós-condições:**
  1. A observação é salva e exibida no histórico do agendamento, com identificação do autor e timestamp.
- **Regras de Negócio:**
  - Observações, uma vez salvas, não podem ser editadas ou excluídas, apenas novas podem ser adicionadas.

---

### Submódulo 3.2: Calendário e Disponibilidade

---

**RF076 - Visualização do Calendário de Agendamentos (Visão Mensal)**

- **Descrição:** O sistema deve fornecer uma interface de calendário com visão mensal que exibe todos os agendamentos.
- **Pré-condições:**
  1. O usuário está autenticado e possui permissão para visualizar agendamentos.
  2. O usuário navega para a seção "Calendário".
- **Pós-condições:**
  1. O sistema exibe um calendário do mês corrente.
  2. Os dias com agendamentos são marcados visualmente.
  3. O usuário pode navegar para os meses anterior e posterior.
- **Regras de Negócio:**
  - Os agendamentos exibidos respeitam as permissões de visualização do usuário (própria OM ou todos).
  - Cada evento no calendário deve ter uma cor correspondente ao seu status.

---

**RF077 - Visualização do Calendário de Agendamentos (Visão Semanal/Diária)**

- **Descrição:** O sistema deve permitir que o usuário alterne a visualização do calendário para os modos "Semanal" e "Diário" para uma visão mais detalhada dos horários.
- **Pré-condições:**
  1. O usuário está na visualização do calendário.
- **Pós-condições:**
  1. O calendário é renderizado novamente no modo selecionado (semana ou dia).
  2. Os agendamentos são exibidos como blocos nos horários correspondentes.
- **Regras de Negócio:**
  - A visão diária deve exibir uma grade horária das 06:00 às 22:00.

---

**RF078 - Filtragem do Calendário**

- **Descrição:** O sistema deve permitir que o usuário filtre os eventos exibidos no calendário por OM, Fornecedor ou Status.
- **Pré-condições:**
  1. O usuário está na visualização do calendário.
- **Pós-condições:**
  1. O calendário é atualizado, mostrando apenas os agendamentos que correspondem aos filtros aplicados.
- **Regras de Negócio:**
  - Os filtros devem ser aplicáveis a todas as visões (mensal, semanal, diária).

---

**RF079 - Visualização Rápida de Detalhes do Agendamento no Calendário**

- **Descrição:** Ao clicar em um evento no calendário, o sistema deve exibir um pop-up ou tooltip com os detalhes essenciais do agendamento sem sair da página.
- **Pré-condições:**
  1. O usuário clica em um agendamento no calendário.
- **Pós-condições:**
  1. Um pop-up é exibido com as informações: Protocolo, OM, Fornecedor, Horário e Status.
  2. O pop-up deve conter um link para "Ver Detalhes Completos", que redireciona para a página de detalhes do agendamento (RF054).
- **Regras de Negócio:**
  - N/A

---

**RF080 - Cadastro de Janelas de Disponibilidade por Fornecedor**

- **Descrição:** O sistema deve permitir que um administrador ou gestor configure os dias da semana e horários em que um determinado fornecedor está disponível para receber agendamentos.
- **Pré-condições:**
  1. O usuário está autenticado com permissão "fornecedor:gerenciar_disponibilidade".
  2. O usuário está na tela de edição de um fornecedor.
- **Pós-condições:**
  1. As regras de disponibilidade (e.g., "Segunda a Sexta, das 08:00 às 17:00") são salvas para o fornecedor.
  2. A ação é registrada no log de auditoria.
- **Regras de Negócio:**
  - É possível cadastrar múltiplos intervalos de horários para o mesmo dia (e.g., das 08:00-12:00 e 14:00-18:00).

---

**RF081 - Cadastro de Feriados e Datas de Bloqueio**

- **Descrição:** O sistema deve permitir que um administrador cadastre feriados (nacionais, estaduais, municipais) e datas específicas em que não são permitidos agendamentos para nenhuma OM.
- **Pré-condições:**
  1. O usuário está autenticado com perfil de "Administrador".
  2. O usuário navega para "Configurações" -> "Calendário Global" -> "Datas Bloqueadas".
- **Pós-condições:**
  1. A data é marcada como indisponível no sistema.
  2. Não será possível criar novos agendamentos nessas datas.
- **Regras de Negócio:**
  - O bloqueio pode ser para um dia inteiro ou para períodos específicos.

---

**RF082 - Verificação de Conflito de Horários**

- **Descrição:** Ao tentar criar ou editar um agendamento, o sistema deve verificar automaticamente se o horário solicitado está disponível, considerando a disponibilidade do fornecedor e os agendamentos já existentes.
- **Pré-condições:**
  1. O usuário está no formulário de criação/edição de agendamento e preenche a data/hora.
- **Pós-condições:**
  1. Se o horário estiver ocupado ou fora da janela de disponibilidade, o sistema exibe uma mensagem de erro informando sobre o conflito e impede o salvamento.
- **Regras de Negócio:**
  - A verificação deve considerar uma "duração" padrão para cada agendamento (e.g., 1 hora) para calcular a sobreposição. Esta duração deve ser um parâmetro configurável do sistema.

---

### Submódulo 3.3: Histórico e Rastreamento de Agendamentos

---

**RF083 - Visualização da Linha do Tempo (Histórico) de um Agendamento**

- **Descrição:** Na tela de detalhes de um agendamento, o sistema deve exibir uma linha do tempo vertical ou horizontal, mostrando todas as mudanças de status e eventos importantes na vida do agendamento.
- **Pré-condições:**
  1. O usuário está na tela de detalhes de um agendamento (RF054).
- **Pós-condições:**
  1. Uma linha do tempo é exibida, mostrando cada evento em ordem cronológica.
- **Regras de Negócio:**
  - Cada item na linha do tempo deve registrar:
    - O que aconteceu (e.g., "Status alterado para 'Concluído'", "Observação adicionada").
    - Quem realizou a ação (Nome do usuário).
    - Quando aconteceu (Data e Hora).
  - Eventos a serem registrados incluem: Criação, Alteração de Status, Edição de Dados, Adição/Remoção de Anexos, Adição de Observações, Cancelamento.

---

**RF084 - Rastreamento de Agendamentos por Fornecedor**

- **Descrição:** O sistema deve permitir visualizar um histórico completo de todos os agendamentos (passados e futuros) associados a um fornecedor específico.
- **Pré-condições:**
  1. O usuário está na tela de detalhes de um fornecedor (RF040).
- **Pós-condições:**
  1. O sistema exibe uma lista paginada de todos os agendamentos vinculados àquele fornecedor, com as mesmas funcionalidades de visualização e filtro da tela principal de agendamentos.
- **Regras de Negócio:**
  - N/A

---

**RF085 - Rastreamento de Agendamentos por Organização Militar (OM)**

- **Descrição:** O sistema deve permitir visualizar um histórico completo de todos os agendamentos (passados e futuros) iniciados por uma OM específica.
- **Pré-condições:**
  1. O usuário está na tela de detalhes de uma OM (RF033).
- **Pós-condições:**
  1. O sistema exibe uma lista paginada de todos os agendamentos vinculados àquela OM, com as mesmas funcionalidades de visualização e filtro da tela principal de agendamentos.
- **Regras de Negócio:**
  - N/A

---

**RF086 - Rastreamento de Atividades por Usuário**

- **Descrição:** O sistema deve permitir que um administrador visualize todas as atividades de agendamento realizadas por um usuário específico.
- **Pré-condições:**
  1. O usuário está autenticado como Administrador.
  2. O usuário está na tela de detalhes de um usuário (Submódulo 2.3).
- **Pós-condições:**
  1. O sistema exibe uma lista de todas as ações relacionadas a agendamentos (criação, edição, cancelamento, etc.) que foram executadas pelo usuário selecionado.
- **Regras de Negócio:**
  - Esta funcionalidade se assemelha a uma visão pré-filtrada da trilha de auditoria (RF024), mas focada em agendamentos e apresentada no contexto do usuário.

---

## Módulo 4: Comunicações e Notificações

### Submódulo 4.1: Sistema de Notificações

---

**RF087 - Notificação por Email de Criação de Agendamento**

- **Descrição:** O sistema deve enviar automaticamente uma notificação por email para os envolvidos quando um novo agendamento for criado.
- **Pré-condições:**
  1. Um novo agendamento é criado com sucesso (RF051).
- **Pós-condições:**
  1. Um email é enviado para o usuário que criou o agendamento.
  2. Um email é enviado para um contato pré-definido do fornecedor.
  3. Um email é enviado para um grupo de gestores da OM solicitante.
- **Regras de Negócio:**
  - O conteúdo do email deve incluir os detalhes chave do agendamento: protocolo, OM, fornecedor, data, hora e um link para visualizar no sistema.
  - Os templates de email devem ser customizáveis por um administrador.

---

**RF088 - Notificação por Email de Alteração de Agendamento**

- **Descrição:** O sistema deve notificar os envolvidos por email quando um agendamento for alterado.
- **Pré-condições:**
  1. Um agendamento é editado com sucesso (RF055).
- **Pós-condições:**
  1. Emails são enviados para as mesmas partes do RF072, informando sobre a alteração.
- **Regras de Negócio:**
  - O email deve destacar quais informações foram alteradas.

---

**RF089 - Notificação por Email de Cancelamento de Agendamento**

- **Descrição:** O sistema deve notificar os envolvidos por email quando um agendamento for cancelado.
- **Pré-condições:**
  1. Um agendamento é cancelado com sucesso (RF056).
- **Pós-condições:**
  1. Emails são enviados para as mesmas partes do RF072, informando sobre o cancelamento.
- **Regras de Negócio:**
  - O email deve incluir o motivo do cancelamento informado pelo usuário.

---

**RF090 - Notificação por Email de Lembrete de Agendamento**

- **Descrição:** O sistema deve enviar um lembrete por email para as partes envolvidas antes da data do agendamento.
- **Pré-condições:**
  1. Um agendamento está com status "Agendado".
  2. A data do agendamento se aproxima.
- **Pós-condições:**
  1. Um email de lembrete é enviado automaticamente.
- **Regras de Negócio:**
  - O lembrete deve ser enviado 24 horas antes do horário agendado.
  - Esta funcionalidade deve poder ser ativada/desativada a nível de sistema por um administrador.

---

**RF091 - Central de Notificações Interna (In-App)**

- **Descrição:** O sistema deve possuir uma central de notificações dentro da aplicação (ícone de sino) onde o usuário pode ver um resumo de suas notificações recentes.
- **Pré-condições:**
  1. O usuário está autenticado no sistema.
- **Pós-condições:**
  1. Um ícone na barra de navegação superior exibe o número de notificações não lidas.
  2. Ao clicar no ícone, um painel (dropdown) é exibido com a lista de notificações recentes.
- **Regras de Negócio:**
  - As notificações in-app devem ser geradas para os mesmos eventos que disparam emails (criação, alteração, cancelamento de agendamentos, etc.).
  - Cada notificação na lista deve conter uma breve descrição e um link para o item relacionado (e.g., o agendamento específico).

---

**RF092 - Marcar Notificação como Lida**

- **Descrição:** O sistema deve permitir que o usuário marque uma notificação como lida.
- **Pré-condições:**
  1. O usuário está com o painel da central de notificações aberto.
- **Pós-condições:**
  1. A notificação selecionada tem seu estilo visual alterado para indicar que foi lida.
  2. O contador de notificações não lidas é decrementado.
- **Regras de Negócio:**
  - Clicar na notificação para navegar até o item de destino também deve marcá-la como lida automaticamente.

---

**RF093 - Marcar Todas as Notificações como Lidas**

- **Descrição:** O sistema deve fornecer uma opção para o usuário marcar todas as suas notificações como lidas de uma só vez.
- **Pré-condições:**
  1. O usuário está com o painel da central de notificações aberto.
- **Pós-condições:**
  1. Todas as notificações do usuário são marcadas como lidas.
  2. O contador de notificações não lidas é zerado.
- **Regras de Negócio:**
  - N/A

---

**RF094 - Configuração de Preferências de Notificação pelo Usuário**

- **Descrição:** O sistema deve permitir que cada usuário configure quais notificações deseja receber por email.
- **Pré-condições:**
  1. O usuário está autenticado.
  2. O usuário navega para sua página de "Perfil" -> "Preferências de Notificação".
- **Pós-condições:**
  1. O usuário pode habilitar/desabilitar (via checkboxes) o recebimento de emails para diferentes tipos de eventos (e.g., "Receber email para novos agendamentos", "Receber email de lembretes").
  2. As preferências são salvas para o usuário.
- **Regras de Negócio:**
  - Notificações críticas de segurança (como redefinição de senha e alertas de bloqueio de conta) não podem ser desabilitadas.
  - As notificações in-app não são configuráveis e sempre serão exibidas.

---

**RF095 - Gestão de Templates de Email**

- **Descrição:** O sistema deve permitir que um administrador visualize, edite e personalize o conteúdo dos templates de email enviados pelo sistema.
- **Pré-condições:**
  1. O usuário está autenticado com perfil de "Administrador".
  2. O usuário navega para "Configurações" -> "Templates de Email".
- **Pós-condições:**
  1. O sistema exibe uma lista de todos os templates de email existentes (e.g., "novo_agendamento", "lembrete_agendamento").
  2. O administrador pode editar o corpo do email (HTML/Texto) usando variáveis pré-definidas (e.g., `{protocolo}`, `{nome_usuario}`).
- **Regras de Negócio:**
  - O sistema deve ter uma opção para reverter o template para a sua versão padrão.

---

### Submódulo 4.2: Chat com Agente de IA para Consultas

---

**RF096 - Acesso à Interface de Chat com IA**

- **Descrição:** O sistema deve fornecer uma interface de chat, acessível a partir de um ícone ou menu persistente, para que o usuário possa interagir com um Agente de IA.
- **Pré-condições:**
  1. O usuário está autenticado e possui a permissão "ia:chat".
- **Pós-condições:**
  1. Ao clicar no ícone de chat, uma janela ou painel de chat é exibido na tela.
  2. O Agente de IA exibe uma mensagem de saudação inicial (e.g., "Olá! Sou o assistente virtual do SISGENDA. Como posso ajudar a consultar informações hoje?").
- **Regras de Negócio:**
  - A janela de chat pode ser minimizada ou fechada pelo usuário.

---

**RF097 - Consulta de Agendamentos via Chat (Linguagem Natural)**

- **Descrição:** O sistema deve permitir que o usuário consulte informações sobre agendamentos utilizando linguagem natural.
- **Pré-condições:**
  1. O usuário está com a interface de chat aberta.
- **Pós-condições:**
  1. O usuário digita uma pergunta (e.g., "quais os agendamentos para amanhã?", "procure o agendamento do fornecedor X na semana que vem", "qual o status do protocolo 12345?").
  2. A IA processa a pergunta, traduz em uma consulta ao banco de dados e retorna a resposta de forma clara e formatada no chat.
- **Regras de Negócio:**
  - A IA deve respeitar as permissões de visualização do usuário, retornando apenas dados que ele está autorizado a ver.
  - A IA deve ser capaz de lidar com variações de datas (e.g., "hoje", "próxima terça-feira", "no mês passado").

---

**RF098 - Consulta de Fornecedores via Chat (Linguagem Natural)**

- **Descrição:** O sistema deve permitir que o usuário consulte informações sobre fornecedores utilizando linguagem natural.
- **Pré-condições:**
  1. O usuário está com a interface de chat aberta.
- **Pós-condições:**
  1. O usuário digita uma pergunta (e.g., "qual o telefone do fornecedor Y?", "liste os fornecedores de alimentação ativos").
  2. A IA processa a pergunta e retorna os dados solicitados dentro do chat.
- **Regras de Negócio:**
  - N/A

---

**RF099 - Consulta de Organizações Militares via Chat (Linguagem Natural)**

- **Descrição:** O sistema deve permitir que o usuário consulte informações sobre OMs utilizando linguagem natural.
- **Pré-condições:**
  1. O usuário está com a interface de chat aberta.
- **Pós-condições:**
  1. O usuário digita uma pergunta (e.g., "qual o CNPJ da OM Z?", "liste todas as OMs inativas").
  2. A IA processa a pergunta e retorna os dados solicitados dentro do chat.
- **Regras de Negócio:**
  - N/A

---

**RF100 - Tratamento de Perguntas Ambíguas ou Incompreendidas**

- **Descrição:** Quando a IA não entender a pergunta ou a considerar ambígua, ela deve solicitar um esclarecimento ao usuário em vez de retornar um erro ou dados incorretos.
- **Pré-condições:**
  1. O usuário faz uma pergunta que a IA não consegue processar com segurança.
- **Pós-condições:**
  1. A IA responde com um pedido de clarificação (e.g., "Não tenho certeza do que você quis dizer com 'agendamentos antigos'. Poderia especificar um período de tempo?", "Você quis dizer o fornecedor X ou Y?").
- **Regras de Negócio:**
  - N/A

---

**RF101 - Apresentação de Resultados em Formato de Lista ou Tabela**

- **Descrição:** Quando uma consulta retornar múltiplos resultados, a IA deve apresentá-los de forma estruturada (lista ou tabela simplificada) dentro do chat para facilitar a leitura.
- **Pré-condições:**
  1. A consulta do usuário retorna mais de um registro.
- **Pós-condições:**
  1. A resposta é formatada com cabeçalhos e colunas ou como uma lista numerada/com marcadores.
- **Regras de Negócio:**
  - Se a lista for muito longa, a IA deve apresentar os primeiros N resultados (e.g., 5 resultados) e informar o total, perguntando se o usuário deseja ver mais.

---

**RF102 - Histórico da Conversa no Chat**

- **Descrição:** O sistema deve manter o histórico da conversa com a IA durante a sessão atual do usuário.
- **Pré-condições:**
  1. O usuário interagiu com o chat.
- **Pós-condições:**
  1. Ao reabrir o chat na mesma sessão, a conversa anterior ainda está visível, permitindo que o usuário tenha contexto.
- **Regras de Negócio:**
  - O histórico deve ser limpo quando o usuário fizer logout.

---

**RF103 - Feedback sobre a Resposta da IA**

- **Descrição:** O sistema deve permitir que o usuário forneça um feedback simples (positivo/negativo) sobre a utilidade da resposta fornecida pela IA.
- **Pré-condições:**
  1. A IA forneceu uma resposta.
- **Pós-condições:**
  1. Abaixo da resposta da IA, são exibidos dois ícones (e.g., polegar para cima / polegar para baixo).
  2. Ao clicar em um dos ícones, o feedback é registrado anonimamente no sistema para fins de melhoria.
- **Regras de Negócio:**
  - O registro de feedback deve armazenar a pergunta, a resposta e a avaliação do usuário.

---

## Módulo 5: Análise de Dados e BI

### Submódulo 5.1: Consultas Parametrizadas

---

**RF104 - Interface de Consulta de Agendamentos**

- **Descrição:** O sistema deve fornecer uma interface de "Construtor de Consultas" que permita ao usuário montar uma consulta customizada sobre os dados de agendamentos, selecionando os campos que deseja visualizar e as condições de filtro.
- **Pré-condições:**
  1. O usuário está autenticado e possui a permissão "consulta:criar".
  2. O usuário navega para a seção "Consultas".
- **Pós-condições:**
  1. O sistema exibe uma interface onde o usuário pode:
     a. Selecionar os campos que aparecerão como colunas no resultado (e.g., Protocolo, Data, Status, Razão Social do Fornecedor, Sigla da OM).
     b. Adicionar múltiplas regras de filtro (e.g., "Status" IGUAL A "Concluído" E "Data" ENTRE "01/01/2024" E "31/03/2024").
- **Regras de Negócio:**
  - As opções de campos e filtros devem respeitar o escopo de dados do usuário (sua OM ou todas, dependendo da permissão).

---

**RF105 - Execução e Visualização de Resultados da Consulta**

- **Descrição:** Após montar a consulta, o sistema deve permitir que o usuário a execute e visualize os resultados em uma tabela.
- **Pré-condições:**
  1. O usuário montou uma consulta na interface do RF089.
- **Pós-condições:**
  1. Ao clicar em "Executar Consulta", o sistema processa a solicitação.
  2. Os resultados são exibidos em uma tabela paginada, com as colunas e filtros definidos pelo usuário.
  3. O sistema exibe um resumo da consulta (e.g., "Mostrando 50 de 235 resultados").
- **Regras de Negócio:**
  - A consulta deve ter um timeout (e.g., 60 segundos) para não sobrecarregar o banco de dados. Se excedido, uma mensagem de erro deve ser mostrada, sugerindo filtros mais específicos.

---

**RF106 - Exportação de Resultados da Consulta**

- **Descrição:** O sistema deve permitir que o usuário exporte os resultados completos de uma consulta executada para um arquivo.
- **Pré-condições:**
  1. Uma consulta foi executada e os resultados estão sendo exibidos.
- **Pós-condições:**
  1. O usuário clica no botão "Exportar".
  2. O sistema gera um arquivo com todos os registros que satisfazem a consulta (não apenas a página visível) e inicia o download.
- **Regras de Negócio:**
  - Os formatos de exportação suportados são CSV e XLSX.

---

**RF107 - Salvamento de Consulta Customizada**

- **Descrição:** O sistema deve permitir que o usuário salve uma consulta customizada (conjunto de campos e filtros) para reutilização futura.
- **Pré-condições:**
  1. O usuário montou uma consulta na interface do RF089.
- **Pós-condições:**
  1. Ao clicar em "Salvar Consulta", o sistema solicita um nome e uma descrição para a consulta.
  2. A definição da consulta é salva e associada ao perfil do usuário.
- **Regras de Negócio:**
  - O nome da consulta salva deve ser único para aquele usuário.

---

**RF108 - Visualização e Gerenciamento de Consultas Salvas**

- **Descrição:** O sistema deve fornecer uma área onde o usuário possa ver, executar, editar ou excluir suas consultas salvas.
- **Pré-condições:**
  1. O usuário está autenticado e navegou para a seção "Minhas Consultas Salvas".
- **Pós-condições:**
  1. O sistema exibe uma lista com as consultas salvas pelo usuário, mostrando nome e descrição.
  2. O usuário pode clicar em "Executar" para rodar a consulta diretamente.
  3. O usuário pode clicar em "Editar" para carregar a definição da consulta no construtor para fazer ajustes.
  4. O usuário pode clicar em "Excluir" para remover uma consulta salva.
- **Regras de Negócio:**
  - N/A

---

**RF109 - Compartilhamento de Consulta Salva**

- **Descrição:** O sistema deve permitir que um usuário compartilhe uma consulta salva com outros usuários ou perfis de acesso.
- **Pré-condições:**
  1. O usuário está na lista de "Minhas Consultas Salvas".
- **Pós-condições:**
  1. O usuário seleciona a opção "Compartilhar" para uma consulta.
  2. O sistema abre uma interface para que o usuário selecione com quais outros usuários ou perfis deseja compartilhar a consulta.
  3. A consulta compartilhada aparecerá na lista de consultas dos usuários selecionados.
- **Regras de Negócio:**
  - O usuário que recebe a consulta compartilhada não pode editá-la ou excluí-la, apenas executá-la (a menos que o criador dê permissão de edição).

---

### Submódulo 5.2: Geração de Relatórios

---

**RF110 - Geração de Relatório Pré-definido: "Agendamentos por Período"**

- **Descrição:** O sistema deve ser capaz de gerar um relatório pré-definido com todos os agendamentos dentro de um intervalo de datas especificado pelo usuário.
- **Pré-condições:**
  1. O usuário está autenticado e possui a permissão "relatorio:gerar".
  2. O usuário navega para a seção "Relatórios" e seleciona "Agendamentos por Período".
- **Pós-condições:**
  1. O sistema solicita os parâmetros: Data de Início, Data de Fim, e (opcionalmente) status do agendamento.
  2. Ao executar, um relatório em formato PDF é gerado e disponibilizado para download.
  3. A geração do relatório é registrada no log de auditoria.
- **Regras de Negócio:**
  - O relatório deve ter um cabeçalho padrão com o nome do sistema, título do relatório, e o período consultado.
  - O conteúdo deve ser uma tabela com os dados dos agendamentos e um rodapé com a data de emissão e número da página.

---

**RF111 - Geração de Relatório Pré-definido: "Desempenho de Fornecedores"**

- **Descrição:** O sistema deve gerar um relatório que sumariza a atividade por fornecedor em um dado período, mostrando o número total de agendamentos, o percentual de concluídos e o de cancelados.
- **Pré-condições:**
  1. O usuário está autenticado e possui a permissão "relatorio:gerar".
  2. O usuário seleciona o relatório "Desempenho de Fornecedores".
- **Pós-condições:**
  1. O sistema solicita o período (Data de Início, Data de Fim) para análise.
  2. Um relatório em PDF é gerado, listando cada fornecedor e suas métricas de desempenho.
- **Regras de Negócio:**
  - O relatório pode incluir um gráfico de barras comparando o volume de agendamentos por fornecedor.

---

**RF112 - Geração de Relatório Pré-definido: "Atividade por OM"**

- **Descrição:** O sistema deve gerar um relatório que detalha a atividade de agendamentos para uma ou mais Organizações Militares em um dado período.
- **Pré-condições:**
  1. O usuário está autenticado e possui a permissão "relatorio:gerar".
  2. O usuário seleciona o relatório "Atividade por OM".
- **Pós-condições:**
  1. O sistema solicita o período e permite que o usuário selecione uma, várias ou todas as OMs.
  2. Um relatório em PDF é gerado, agrupando os agendamentos por OM.
- **Regras de Negócio:**
  - N/A

---

**RF113 - Agendamento de Geração Recorrente de Relatórios**

- **Descrição:** O sistema deve permitir que um usuário agende a geração automática e recorrente de um relatório pré-definido, com envio para uma lista de emails.
- **Pré-condições:**
  1. O usuário está na tela de um relatório pré-definido.
- **Pós-condições:**
  1. O usuário clica em "Agendar Envio".
  2. O sistema abre uma interface para definir a frequência (diária, semanal, mensal), o dia/hora, e a lista de destinatários de email.
  3. O agendamento é salvo e o sistema executará a geração e o envio automaticamente.
- **Regras de Negócio:**
  - O email enviado contém o relatório como anexo PDF.

---

**RF114 - Histórico de Relatórios Gerados**

- **Descrição:** O sistema deve manter um histórico de todos os relatórios que foram gerados manualmente ou por agendamento.
- **Pré-condições:**
  1. O usuário navega para a seção "Relatórios" -> "Histórico".
- **Pós-condições:**
  1. O sistema exibe uma lista dos relatórios gerados, com informações sobre: Nome do Relatório, Data de Geração, Usuário Solicitante (se manual) e um link para download do arquivo gerado.
- **Regras de Negócio:**
  - Os relatórios no histórico devem ser mantidos por um período configurável (e.g., 90 dias) antes de serem automaticamente removidos para economizar espaço.

---

**RF115 - Geração de Relatório a Partir de uma Consulta Salva**

- **Descrição:** O sistema deve permitir que o usuário gere um relatório formatado em PDF a partir de uma consulta customizada que ele salvou anteriormente.
- **Pré-condições:**
  1. O usuário está na sua lista de consultas salvas (RF093).
- **Pós-condições:**
  1. O usuário seleciona a opção "Gerar Relatório em PDF" para uma consulta salva.
  2. O sistema executa a consulta e formata o resultado em um relatório PDF padrão, usando o nome da consulta como título.
- **Regras de Negócio:**
  - N/A

---

### Submódulo 5.3: Dashboards Gerenciais

---

**RF116 - Acesso ao Dashboard Principal**

- **Descrição:** Ao fazer login, o usuário deve ser direcionado para um dashboard principal que apresenta uma visão geral e consolidada das informações mais relevantes para o seu perfil.
- **Pré-condições:**
  1. O usuário realiza o login com sucesso.
- **Pós-condições:**
  1. O sistema exibe o dashboard principal, composto por um conjunto de widgets.
- **Regras de Negócio:**
  - O conteúdo e os widgets do dashboard podem variar de acordo com o perfil de acesso do usuário.

---

**RF117 - Widget: "KPIs de Agendamentos"**

- **Descrição:** O dashboard deve conter um widget que exibe os principais indicadores de desempenho (KPIs) sobre agendamentos.
- **Pré-condições:**
  1. O usuário está visualizando o dashboard.
- **Pós-condições:**
  1. O widget exibe os seguintes números, referentes ao mês corrente:
     - Total de Agendamentos Criados
     - Total de Agendamentos Concluídos
     - Total de Agendamentos Cancelados
     - Taxa de Ocupação (Agendamentos / Capacidade Total, se aplicável)
- **Regras de Negócio:**
  - Os dados exibidos respeitam as permissões do usuário (visão da própria OM ou geral).
  - Clicar em um dos números redireciona o usuário para a lista de agendamentos com o filtro correspondente aplicado.

---

**RF118 - Widget: "Próximos Agendamentos"**

- **Descrição:** O dashboard deve conter um widget que lista os próximos agendamentos pendentes.
- **Pré-condições:**
  1. O usuário está visualizando o dashboard.
- **Pós-condições:**
  1. O widget exibe uma lista dos próximos 5 agendamentos (com base na data/hora) com status "Agendado".
  2. Cada item da lista mostra a Data/Hora, o Fornecedor e a OM, e é um link para os detalhes do agendamento.
- **Regras de Negócio:**
  - N/A

---

**RF119 - Widget: "Gráfico de Agendamentos por Status"**

- **Descrição:** O dashboard deve exibir um gráfico (e.g., pizza ou rosca) que mostra a distribuição percentual dos agendamentos do mês por status (Agendado, Em Andamento, Concluído, Cancelado).
- **Pré-condições:**
  1. O usuário está visualizando o dashboard.
- **Pós-condições:**
  1. Um gráfico interativo é renderizado no dashboard.
- **Regras de Negócio:**
  - Passar o mouse sobre uma fatia do gráfico exibe o número absoluto de agendamentos naquele status.

---

**RF120 - Widget: "Gráfico de Agendamentos por Fornecedor"**

- **Descrição:** O dashboard deve exibir um gráfico (e.g., barras horizontais) mostrando o top 5 fornecedores com mais agendamentos no mês.
- **Pré-condições:**
  1. O usuário está visualizando o dashboard.
- **Pós-condições:**
  1. Um gráfico de barras é renderizado, mostrando o nome do fornecedor e o número de agendamentos.
- **Regras de Negócio:**
  - N/A

---

**RF121 - Widget: "Atividade Recente da Auditoria"**

- **Descrição:** Para administradores, o dashboard deve conter um widget que mostra as últimas N ações registradas na trilha de auditoria.
- **Pré-condições:**
  1. O usuário autenticado é um Administrador.
- **Pós-condições:**
  1. O widget exibe uma lista das últimas 5-10 entradas do log de auditoria, com Usuário, Ação e Timestamp.
  2. Um link "Ver Tudo" leva para a tela completa de logs de auditoria (RF024).
- **Regras de Negócio:**
  - Este widget só é visível para perfis com a permissão "auditoria:visualizar".

---

**RF122 - Filtro de Período para o Dashboard**

- **Descrição:** O sistema deve permitir que o usuário filtre todos os widgets do dashboard por um período de tempo (e.g., "Este Mês", "Últimos 7 dias", "Este Ano", ou um intervalo customizado).
- **Pré-condições:**
  1. O usuário está visualizando o dashboard.
- **Pós-condições:**
  1. O usuário seleciona um novo período em um seletor de data no topo do dashboard.
  2. Todos os widgets são atualizados para refletir os dados do período selecionado.
- **Regras de Negócio:**
  - O período padrão ao carregar o dashboard é "Este Mês".

---

**RF123 - Personalização do Layout do Dashboard**

- **Descrição:** O sistema deve permitir que o usuário personalize o dashboard, reorganizando, adicionando ou removendo widgets.
- **Pré-condições:**
  1. O usuário está visualizando o dashboard e possui a permissão "dashboard:personalizar".
- **Pós-condições:**
  1. O usuário pode entrar em um "modo de edição".
  2. No modo de edição, o usuário pode arrastar e soltar widgets para reordená-los.
  3. O usuário pode remover um widget do seu dashboard.
  4. O usuário pode adicionar widgets a partir de uma biblioteca de widgets disponíveis.
  5. As alterações no layout são salvas e persistem para o usuário.
- **Regras de Negócio:**
  - Deve existir um botão para "Restaurar layout padrão".

---

// ... existing code ...

**RF124 - Sistema de Aprovação de Agendamentos por Administradores**

- **Descrição:** O sistema deve implementar um fluxo de aprovação onde agendamentos criados por fornecedores precisam ser aprovados por administradores antes de serem confirmados.
- **Pré-condições:**
  1. Um fornecedor cria um novo agendamento.
  2. O agendamento é criado com status "PENDING_CONFIRMATION".
- **Pós-condições:**
  1. O administrador da OM recebe uma notificação sobre o novo agendamento pendente.
  2. O administrador pode aprovar ou rejeitar o agendamento através da interface.
  3. O fornecedor é notificado sobre a decisão.
- **Regras de Negócio:**
  - Apenas administradores (ADMIN) podem aprovar ou rejeitar agendamentos.
  - Usuários comuns (USER) podem apenas visualizar agendamentos da sua OM.
  - Fornecedores não podem aprovar seus próprios agendamentos.

---

**RF125 - Solicitação de Cancelamento por Fornecedores**

- **Descrição:** O sistema deve permitir que fornecedores solicitem o cancelamento de agendamentos, que precisam ser aprovados por administradores.
- **Pré-condições:**
  1. Um agendamento está com status "CONFIRMED".
  2. O fornecedor solicita o cancelamento.
- **Pós-condições:**
  1. O status do agendamento muda para "CANCELLATION_REQUESTED".
  2. O administrador recebe uma notificação sobre a solicitação.
  3. O administrador pode aprovar ou rejeitar a solicitação.
- **Regras de Negócio:**
  - Apenas fornecedores podem solicitar cancelamento de seus próprios agendamentos.
  - Administradores podem cancelar agendamentos diretamente sem solicitação.

---

**RF126 - Solicitação de Reagendamento por Fornecedores**

- **Descrição:** O sistema deve permitir que fornecedores solicitem reagendamento de agendamentos confirmados, que precisam ser aprovados por administradores.
- **Pré-condições:**
  1. Um agendamento está com status "CONFIRMED".
  2. O fornecedor solicita o reagendamento com nova data/hora.
- **Pós-condições:**
  1. O status do agendamento muda para "RESCHEDULE_REQUESTED".
  2. O administrador recebe uma notificação sobre a solicitação.
  3. O administrador pode aprovar ou rejeitar a solicitação.
- **Regras de Negócio:**
  - A solicitação deve incluir a nova data/hora proposta.
  - O sistema deve verificar disponibilidade da nova data antes de permitir a solicitação.

---

**RF127 - Sistema de Comentários em Agendamentos**

- **Descrição:** O sistema deve permitir que usuários autorizados adicionem comentários aos agendamentos para comunicação entre as partes.
- **Pré-condições:**
  1. O usuário está na página de detalhes de um agendamento.
  2. O agendamento não está cancelado.
- **Pós-condições:**
  1. O comentário é salvo e exibido na linha do tempo de atividades.
  2. Todos os usuários autorizados veem o novo comentário.
  3. Notificações são enviadas para as partes relevantes.
- **Regras de Negócio:**
  - Comentários não podem ser editados ou excluídos após publicação.
  - Todos os usuários com acesso ao agendamento podem comentar.

---

**RF128 - Central de Notificações com Abas**

- **Descrição:** O sistema deve fornecer uma central de notificações com abas para "Caixa de Entrada" (não lidas) e "Geral" (todas).
- **Pré-condições:**
  1. O usuário navega para a página de notificações.
- **Pós-condições:**
  1. A aba "Caixa de Entrada" exibe apenas notificações não lidas.
  2. A aba "Geral" exibe todas as notificações.
  3. O contador de não lidas é exibido na aba correspondente.
- **Regras de Negócio:**
  - A aba padrão é "Caixa de Entrada".
  - O contador de não lidas é atualizado em tempo real.

---

**RF129 - Ações Diretas nas Notificações**

- **Descrição:** O sistema deve permitir que usuários executem ações diretamente nas notificações sem navegar para a página do agendamento.
- **Pré-condições:**
  1. O usuário está visualizando uma notificação com ações disponíveis.
- **Pós-condições:**
  1. Botões de ação são exibidos na notificação.
  2. O usuário pode aprovar, rejeitar, ou executar outras ações diretamente.
  3. A notificação é marcada como lida após a ação.
- **Regras de Negócio:**
  - As ações disponíveis dependem do tipo de notificação e perfil do usuário.
  - Confirmações são solicitadas para ações críticas.

---

**RF130 - Marcação em Massa de Notificações**

- **Descrição:** O sistema deve permitir que usuários marquem todas as notificações como lidas de uma só vez.
- **Pré-condições:**
  1. O usuário está na central de notificações.
  2. Existem notificações não lidas.
- **Pós-condições:**
  1. Um botão "Marcar todas como lidas" é exibido.
  2. Ao clicar, todas as notificações são marcadas como lidas.
  3. O contador de não lidas é zerado.
- **Regras de Negócio:**
  - O botão só aparece quando há notificações não lidas.

---

**RF131 - Paginação de Notificações**

- **Descrição:** O sistema deve implementar paginação na lista de notificações para melhor performance.
- **Pré-condições:**
  1. Existem mais notificações do que o limite por página.
- **Pós-condições:**
  1. As notificações são exibidas em páginas.
  2. Um botão "Carregar mais" permite carregar a próxima página.
  3. O estado de carregamento é indicado visualmente.
- **Regras de Negócio:**
  - O limite padrão é 20 notificações por página.
  - A paginação funciona independentemente para cada aba.

---

**RF132 - Filtros de Notificação por Tipo**

- **Descrição:** O sistema deve permitir filtrar notificações por tipo (criação, aprovação, cancelamento, etc.).
- **Pré-condições:**
  1. O usuário está na central de notificações.
- **Pós-condições:**
  1. Filtros por tipo de notificação são disponibilizados.
  2. A lista é atualizada para mostrar apenas notificações do tipo selecionado.
- **Regras de Negócio:**
  - Os filtros devem ser aplicáveis a ambas as abas.

---

**RF133 - Notificações Push em Tempo Real**

- **Descrição:** O sistema deve enviar notificações push em tempo real quando novas notificações forem criadas.
- **Pré-condições:**
  1. O usuário está logado no sistema.
  2. Uma nova notificação é criada para o usuário.
- **Pós-condições:**
  1. Uma notificação push é exibida no navegador.
  2. O contador de notificações é atualizado automaticamente.
- **Regras de Negócio:**
  - As notificações push devem respeitar as preferências do usuário.
  - O usuário pode desabilitar notificações push nas configurações.

---

**RF134 - Histórico de Atividades com Respostas**

- **Descrição:** O sistema deve permitir que usuários respondam a comentários em agendamentos, criando uma conversa estruturada.
- **Pré-condições:**
  1. Um comentário foi adicionado a um agendamento.
- **Pós-condições:**
  1. Outros usuários podem responder ao comentário.
  2. As respostas são exibidas de forma hierárquica.
  3. Notificações são enviadas para os participantes da conversa.
- **Regras de Negócio:**
  - As respostas são limitadas a 3 níveis de profundidade.
  - Cada resposta deve ser associada ao comentário pai.

---

**RF135 - Marcação de Agendamento como "Não Compareceu"**

- **Descrição:** O sistema deve permitir que administradores marquem agendamentos como "Não Compareceu" quando o fornecedor não comparecer.
- **Pré-condições:**
  1. Um agendamento está com status "CONFIRMED".
  2. A data/hora do agendamento já passou.
- **Pós-condições:**
  1. O administrador pode marcar como "Não Compareceu".
  2. O status é alterado e registrado no histórico.
  3. O fornecedor é notificado sobre a marcação.
- **Regras de Negócio:**
  - Apenas administradores podem marcar como "Não Compareceu".
  - Esta ação só pode ser executada após a data/hora do agendamento.

---

**RF136 - Marcação de Agendamento como Concluído**

- **Descrição:** O sistema deve permitir que administradores marquem agendamentos como concluídos após a realização do serviço.
- **Pré-condições:**
  1. Um agendamento está com status "CONFIRMED".
  2. O serviço foi realizado com sucesso.
- **Pós-condições:**
  1. O administrador marca como "Concluído".
  2. O status é alterado para "COMPLETED".
  3. O agendamento é movido para o histórico de concluídos.
- **Regras de Negócio:**
  - Apenas administradores podem marcar como concluído.
  - Agendamentos cancelados não podem ser marcados como concluídos.

---

**RF137 - Validação de Permissões por Ação**

- **Descrição:** O sistema deve validar as permissões do usuário antes de exibir ou permitir ações em agendamentos.
- **Pré-condições:**
  1. O usuário tenta acessar um agendamento ou executar uma ação.
- **Pós-condições:**
  1. O sistema verifica as permissões do usuário.
  2. Apenas ações permitidas são exibidas.
  3. Tentativas de acesso não autorizado são bloqueadas.
- **Regras de Negócio:**
  - Fornecedores só podem ver e gerenciar seus próprios agendamentos.
  - Administradores podem ver todos os agendamentos de sua OM.
  - Usuários comuns só podem visualizar agendamentos de sua OM.

---

**RF138 - Confirmações para Ações Críticas**

- **Descrição:** O sistema deve solicitar confirmação antes de executar ações críticas como cancelamento, rejeição ou exclusão.
- **Pré-condições:**
  1. O usuário tenta executar uma ação crítica.
- **Pós-condições:**
  1. Um modal de confirmação é exibido.
  2. A ação só é executada após confirmação explícita.
  3. O usuário pode cancelar a ação.
- **Regras de Negócio:**
  - Ações críticas incluem: cancelamento, rejeição, exclusão, marcação como não compareceu.
  - O modal deve explicar as consequências da ação.

---

**RF139 - Atualização em Tempo Real de Status**

- **Descrição:** O sistema deve atualizar o status dos agendamentos em tempo real sem necessidade de recarregar a página.
- **Pré-condições:**
  1. Um agendamento está sendo visualizado.
  2. O status é alterado por outro usuário.
- **Pós-condições:**
  1. O status é atualizado automaticamente na interface.
  2. Notificações são exibidas sobre a mudança.
  3. O histórico de atividades é atualizado.
- **Regras de Negócio:**
  - A atualização deve ocorrer via WebSocket ou polling.
  - Mudanças devem ser indicadas visualmente.

---

**RF140 - Exportação de Histórico de Atividades**

- **Descrição:** O sistema deve permitir exportar o histórico completo de atividades de um agendamento.
- **Pré-condições:**
  1. O usuário está na página de detalhes de um agendamento.
  2. O usuário possui permissão para visualizar o agendamento.
- **Pós-condições:**
  1. Um botão "Exportar Histórico" está disponível.
  2. Ao clicar, um arquivo PDF é gerado com todo o histórico.
  3. O arquivo inclui comentários, mudanças de status e timestamps.
- **Regras de Negócio:**
  - O arquivo deve incluir cabeçalho com informações do agendamento.
  - O formato deve ser legível e organizado cronologicamente.

---

**RF141 - Busca em Comentários e Atividades**

- **Descrição:** O sistema deve permitir buscar por texto específico nos comentários e atividades de um agendamento.
- **Pré-condições:**
  1. O usuário está na página de detalhes de um agendamento.
  2. Existem comentários e atividades no agendamento.
- **Pós-condições:**
  1. Um campo de busca é disponibilizado.
  2. Os resultados são destacados na interface.
  3. A busca é case-insensitive.
- **Regras de Negócio:**
  - A busca deve incluir comentários, respostas e descrições de atividades.
  - Resultados devem ser paginados se houver muitos matches.

---

**RF142 - Notificações por Email para Ações Críticas**

- **Descrição:** O sistema deve enviar notificações por email para ações críticas em agendamentos.
- **Pré-condições:**
  1. Uma ação crítica é executada em um agendamento.
- **Pós-condições:**
  1. Emails são enviados para todas as partes envolvidas.
  2. O email inclui detalhes da ação e link para o agendamento.
- **Regras de Negócio:**
  - Ações críticas incluem: aprovação, rejeição, cancelamento, reagendamento.
  - Os templates de email devem ser customizáveis.

---

**RF143 - Dashboard de Notificações Não Lidas**

- **Descrição:** O sistema deve exibir um resumo de notificações não lidas no dashboard principal.
- **Pré-condições:**
  1. O usuário está logado no sistema.
  2. Existem notificações não lidas.
- **Pós-condições:**
  1. Um widget exibe o número de notificações não lidas.
  2. As notificações mais recentes são listadas.
  3. Links diretos levam às notificações específicas.
- **Regras de Negócio:**
  - O widget deve ser atualizado em tempo real.
  - Notificações críticas devem ser destacadas.

---

**RF144 - Configurações de Notificação por Tipo**

- **Descrição:** O sistema deve permitir que usuários configurem quais tipos de notificação desejam receber.
- **Pré-condições:**
  1. O usuário está nas configurações de notificação.
- **Pós-condições:**
  1. Checkboxes permitem habilitar/desabilitar tipos específicos.
  2. As configurações são salvas por usuário.
  3. As notificações respeitam as configurações.
- **Regras de Negócio:**
  - Tipos incluem: novos agendamentos, aprovações, cancelamentos, reagendamentos.
  - Notificações críticas de segurança não podem ser desabilitadas.

---

**RF145 - Arquivamento de Notificações Antigas**

- **Descrição:** O sistema deve permitir arquivar notificações antigas para manter a interface organizada.
- **Pré-condições:**
  1. O usuário está na central de notificações.
  2. Existem notificações antigas já lidas.
- **Pós-condições:**
  1. Um botão "Arquivar" está disponível para notificações lidas.
  2. Notificações arquivadas são movidas para uma seção separada.
  3. Notificações arquivadas não aparecem na contagem de não lidas.
- **Regras de Negócio:**
  - Apenas notificações lidas podem ser arquivadas.
  - Notificações arquivadas podem ser desarquivadas.

---

**RF146 - Sincronização de Notificações entre Dispositivos**

- **Descrição:** O sistema deve sincronizar o status das notificações entre diferentes dispositivos do mesmo usuário.
- **Pré-condições:**
  1. O usuário está logado em múltiplos dispositivos.
  2. Uma notificação é marcada como lida em um dispositivo.
- **Pós-condições:**
  1. O status é sincronizado automaticamente.
  2. Todos os dispositivos refletem a mudança.
  3. Não há duplicação de notificações.
- **Regras de Negócio:**
  - A sincronização deve ocorrer em tempo real.
  - Conflitos devem ser resolvidos com base no timestamp mais recente.

---

**RF147 - Relatório de Notificações por Período**

- **Descrição:** O sistema deve gerar relatórios sobre notificações enviadas e lidas em um período específico.
- **Pré-condições:**
  1. O usuário está na seção de relatórios.
  2. O usuário possui permissão para gerar relatórios.
- **Pós-condições:**
  1. O sistema solicita o período de análise.
  2. Um relatório é gerado com estatísticas de notificações.
  3. O relatório é disponibilizado para download.
- **Regras de Negócio:**
  - O relatório deve incluir: total de notificações, taxa de leitura, tipos mais comuns.
  - O formato deve ser PDF ou Excel.

---

**RF148 - Integração com Sistema de Calendário**

- **Descrição:** O sistema deve integrar notificações com o calendário do usuário para lembretes automáticos.
- **Pré-condições:**
  1. O usuário configura integração com calendário.
  2. Um agendamento é criado ou confirmado.
- **Pós-condições:**
  1. O evento é adicionado ao calendário do usuário.
  2. Lembretes são configurados automaticamente.
  3. Mudanças no agendamento são refletidas no calendário.
- **Regras de Negócio:**
  - A integração deve suportar Google Calendar, Outlook e outros sistemas populares.
  - O usuário pode configurar o tempo de antecedência dos lembretes.

---

**RF149 - Sistema de Tags para Notificações**

- **Descrição:** O sistema deve permitir categorizar notificações com tags para melhor organização.
- **Pré-condições:**
  1. O usuário está na central de notificações.
- **Pós-condições:**
  1. Notificações podem ser marcadas com tags (ex: "Urgente", "Revisar", "Aguardando").
  2. Filtros por tag estão disponíveis.
  3. Tags podem ser criadas pelo usuário.
- **Regras de Negócio:**
  - Tags são pessoais por usuário.
  - Notificações podem ter múltiplas tags.

---

**RF150 - Backup e Restauração de Configurações de Notificação**

- **Descrição:** O sistema deve permitir backup e restauração das configurações de notificação do usuário.
- **Pré-condições:**
  1. O usuário está nas configurações de notificação.
- **Pós-condições:**
  1. Um botão "Exportar Configurações" gera um arquivo de backup.
  2. Um botão "Importar Configurações" restaura configurações de um arquivo.
  3. As configurações são aplicadas imediatamente.
- **Regras de Negócio:**
  - O arquivo de backup deve ser em formato JSON.
  - A importação deve validar o formato do arquivo.
  - Configurações inválidas devem ser rejeitadas co
