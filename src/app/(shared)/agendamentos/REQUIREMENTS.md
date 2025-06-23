Perfeito. Aqui está a **Matriz de Permissões limpa, sem emojis nos títulos**, mantendo ✅ e ❌ no corpo da tabela para facilitar a leitura.

---

# **Matriz de Permissões da Página de Agendamentos**

| Ação                                                            | ADMIN (OM) | USER (OM) | FORNECEDOR | COMRJ/COMIMSUP |
| --------------------------------------------------------------- | :--------: | :-------: | :--------: | :------------: |
| Visualizar Agendamentos                                         |     ✅     |    ✅     |     ✅     |       ✅       |
| Criar Agendamento (Agendar)                                     |     ❌     |    ❌     |     ✅     |       ❌       |
| Editar (Enquanto Pendente)                                      |     ❌     |    ❌     |     ✅     |       ❌       |
| Aprovar Agendamento                                             |     ✅     |    ❌     |     ❌     |       ❌       |
| Rejeitar Agendamento                                            |     ✅     |    ❌     |     ❌     |       ❌       |
| Confirmar Agendamento                                           |     ✅     |    ❌     |     ❌     |       ❌       |
| Cancelar Agendamento (Direto)                                   |     ✅     |    ❌     |     ❌     |       ❌       |
| Reagendar Agendamento (Direto)                                  |     ✅     |    ❌     |     ❌     |       ❌       |
| Solicitar Cancelamento                                          |     ❌     |    ❌     |     ✅     |       ❌       |
| Solicitar Reagendamento                                         |     ❌     |    ❌     |     ✅     |       ❌       |
| Aprovar ou Rejeitar Solicitação (Cancelamento ou Reagendamento) |     ✅     |    ❌     |     ❌     |       ❌       |
| Comentar no Agendamento                                         |     ✅     |    ✅     |     ✅     |       ❌       |
| Marcar como "Fornecedor Não Compareceu"                         |     ✅     |    ❌     |     ❌     |       ❌       |
| Marcar como Concluído                                           |     ✅     |    ❌     |     ❌     |       ❌       |
| Visualizar Histórico de Atividades                              |     ✅     |    ✅     |     ✅     |       ✅       |
| Visualizar Detalhes do Agendamento                              |     ✅     |    ✅     |     ✅     |       ✅       |

## **Fluxo Operacional**

| Ação do Fornecedor          | Gera Status               | Ação do ADMIN                                                         |
| --------------------------- | ------------------------- | --------------------------------------------------------------------- |
| Criar Agendamento           | `PENDING_CONFIRMATION`    | Aprova ➝ `CONFIRMED` <br> Rejeita ➝ `REJECTED`                        |
| Solicitar Cancelamento      | `CANCELLATION_REQUESTED`  | Aprova ➝ `CANCELLED` <br> Rejeita ➝ Mantém status atual               |
| Solicitar Reagendamento     | `RESCHEDULE_REQUESTED`    | Aprova ➝ `RESCHEDULED` + nova data <br> Rejeita ➝ Mantém status atual |
| ADMIN quer cancelar direto  | `CANCELLED`               | Sem solicitação                                                       |
| ADMIN quer reagendar direto | `RESCHEDULED` + nova data | Sem solicitação                                                       |

---
