export const agendaKeys = {
  all: ["appointments"] as const,
  lists: () => [...agendaKeys.all, "list"] as const,
  list: (filters: string) => [...agendaKeys.lists(), { filters }] as const,
  details: () => [...agendaKeys.all, "detail"] as const,
  detail: (id: string) => [...agendaKeys.details(), id] as const,
};
