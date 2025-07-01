"use client";

import { useState, useMemo } from "react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Bell,
  Archive,
  Check,
  CheckCheck,
  Filter,
  Inbox as InboxIcon,
  Calendar,
  Package,
  AlertCircle,
  CircleDot,
  Loader2,
  RefreshCw,
  MoreHorizontal,
  Settings,
  CircleAlertIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import {
  useNotifications,
  useMarkAsRead,
  useMarkAsArchived,
  useMarkAllAsRead,
  useUnreadCount,
  useApproveAppointment,
  useRejectAppointment,
  useApproveCancellation,
  useRejectCancellation,
  useApproveReschedule,
  useRejectReschedule,
  type Notification,
} from "@/hooks/use-notifications";
import { useSession } from "next-auth/react";
import { getNotificationActionButtons } from "@/lib/utils/notification-actions";
import type { AppointmentStatus } from "@prisma/client";
import Link from "next/link";

// Notification type icons mapping
const notificationIcons = {
  APPOINTMENT_CREATED: Package,
  APPOINTMENT_CONFIRMED: Check,
  APPOINTMENT_REJECTED: AlertCircle,
  APPOINTMENT_CANCELLED: AlertCircle,
  APPOINTMENT_RESCHEDULE_REQUESTED: Calendar,
  APPOINTMENT_RESCHEDULED: Calendar,
  APPOINTMENT_COMPLETED: CheckCheck,
  APPOINTMENT_UPDATED: Bell,
  APPOINTMENT_SUPPLIER_NO_SHOW: AlertCircle,
} as const;

// Notification type colors
const notificationColors = {
  APPOINTMENT_CREATED:
    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  APPOINTMENT_CONFIRMED:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  APPOINTMENT_REJECTED:
    "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  APPOINTMENT_CANCELLED:
    "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  APPOINTMENT_RESCHEDULE_REQUESTED:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  APPOINTMENT_RESCHEDULED:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  APPOINTMENT_COMPLETED:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  APPOINTMENT_UPDATED:
    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  APPOINTMENT_SUPPLIER_NO_SHOW:
    "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
} as const;

interface InboxProps {
  className?: string;
}

export function Inbox({ className }: InboxProps) {
  const [activeTab, setActiveTab] = useState<"unread" | "all">("unread");
  const [page, setPage] = useState(1);
  const router = useRouter();
  const { data: session } = useSession();

  // Determine status filter based on active tab
  const statusFilter = useMemo(() => {
    switch (activeTab) {
      case "unread":
        return "UNREAD" as const;
      case "all":
        return undefined;
      default:
        return "UNREAD" as const;
    }
  }, [activeTab]);

  // Fetch notifications
  const {
    data: notificationsData,
    isLoading,
    isError,
    refetch,
  } = useNotifications(
    {
      page,
      limit: 20,
      status: statusFilter,
    },
    { enabled: true },
  );

  const { data: unreadData } = useUnreadCount();
  const unreadCount = unreadData?.count || 0;

  // Mutations
  const markAsReadMutation = useMarkAsRead();
  const markAsArchivedMutation = useMarkAsArchived();
  const markAllAsReadMutation = useMarkAllAsRead();

  // Appointment action mutations
  const approveAppointmentMutation = useApproveAppointment();
  const rejectAppointmentMutation = useRejectAppointment();
  const approveCancellationMutation = useApproveCancellation();
  const rejectCancellationMutation = useRejectCancellation();
  const approveRescheduleMutation = useApproveReschedule();
  const rejectRescheduleMutation = useRejectReschedule();

  const notifications = notificationsData?.notifications || [];
  const pagination = notificationsData?.pagination;

  const handleMarkAsRead = (notificationId: string) => {
    markAsReadMutation.mutate(notificationId);
  };

  const handleNotificationClick = (notification: Notification) => {
    if (notification.status === "UNREAD") {
      handleMarkAsRead(notification.id);
    }
    if (notification.appointmentId) {
      router.push(`/agendamentos/${notification.appointmentId}`);
    } else {
      router.push("/notifications");
    }
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const handleRefresh = () => {
    refetch();
  };

  if (isError) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Erro ao carregar notificações
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="mt-2"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className} !py-2 gap-1`}>
      <CardHeader className=" border-b !pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold !py-0">
            Notificações
          </CardTitle>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button
                variant="link"
                size="sm"
                className="text-primary pr-2"
                onClick={handleMarkAllAsRead}
                disabled={markAllAsReadMutation.isPending}
              >
                Marcar todas como lidas
              </Button>
            )}
            <Link href="/configuracoes/notificacoes">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings className="h-4 w-4" />
                <span className="sr-only">Configurações</span>
              </Button>
            </Link>
          </div>
        </div>
      </CardHeader>

      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value as "unread" | "all");
          setPage(1); // Reset page when changing tabs
        }}
      >
        <div className="px-4 border-b !pt-0">
          <TabsList className="text-foreground h-auto gap-2 rounded-none border-b bg-transparent p-0">
            <TabsTrigger
              value="unread"
              className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-px after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none flex items-center gap-2"
            >
              Caixa de Entrada
              {unreadCount > 0 && (
                <Badge variant="destructive" className="h-5 w-auto px-1.5 ml-2">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="all"
              className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-px after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none flex items-center gap-2"
            >
              Geral
            </TabsTrigger>
          </TabsList>
        </div>

        <CardContent className="p-0">
          <TabsContent value={activeTab} className="mt-0">
            <ScrollArea className="h-[550px]">
              {isLoading && notifications.length === 0 ? (
                <div className="p-4 space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 p-2">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="p-3 rounded-full bg-muted mb-4">
                    <InboxIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-1">
                    Nenhuma notificação por aqui
                  </h3>
                  <p className="text-sm text-muted-foreground px-4">
                    {activeTab === "unread"
                      ? "Você está em dia com suas notificações."
                      : "Quando houver novas notificações, elas aparecerão aqui."}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {notifications.map((notification) => {
                    // Get appointment status from notification data
                    const appointmentStatus = (notification.appointment
                      ?.status || "PENDING_CONFIRMATION") as AppointmentStatus;
                    const userRole = session?.user?.role;

                    // Determine available actions for this notification
                    const actionButtons = getNotificationActionButtons(
                      notification.type,
                      appointmentStatus,
                      userRole,
                      notification.appointment?.date
                        ? new Date(notification.appointment.date)
                        : undefined,
                    );

                    return (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onClick={() => handleNotificationClick(notification)}
                        isArchiving={markAsArchivedMutation.isPending}
                        onApprove={() => {
                          if (notification.appointmentId) {
                            approveAppointmentMutation.mutate(
                              notification.appointmentId,
                            );
                          }
                          // Mark notification as read
                          if (notification.status === "UNREAD") {
                            handleMarkAsRead(notification.id);
                          }
                        }}
                        onReject={() => {
                          if (notification.appointmentId) {
                            rejectAppointmentMutation.mutate(
                              notification.appointmentId,
                            );
                          }
                          // Mark notification as read
                          if (notification.status === "UNREAD") {
                            handleMarkAsRead(notification.id);
                          }
                        }}
                        onApproveCancellation={() => {
                          if (notification.appointmentId) {
                            approveCancellationMutation.mutate(
                              notification.appointmentId,
                            );
                          }
                          // Mark notification as read
                          if (notification.status === "UNREAD") {
                            handleMarkAsRead(notification.id);
                          }
                        }}
                        onRejectCancellation={() => {
                          if (notification.appointmentId) {
                            rejectCancellationMutation.mutate(
                              notification.appointmentId,
                            );
                          }
                          // Mark notification as read
                          if (notification.status === "UNREAD") {
                            handleMarkAsRead(notification.id);
                          }
                        }}
                        onApproveReschedule={() => {
                          if (notification.appointmentId) {
                            approveRescheduleMutation.mutate(
                              notification.appointmentId,
                            );
                          }
                          // Mark notification as read
                          if (notification.status === "UNREAD") {
                            handleMarkAsRead(notification.id);
                          }
                        }}
                        onRejectReschedule={() => {
                          if (notification.appointmentId) {
                            rejectRescheduleMutation.mutate(
                              notification.appointmentId,
                            );
                          }
                          // Mark notification as read
                          if (notification.status === "UNREAD") {
                            handleMarkAsRead(notification.id);
                          }
                        }}
                        showActions={actionButtons.showActions}
                        actions={actionButtons.actions}
                        approveAppointmentMutation={approveAppointmentMutation}
                        rejectAppointmentMutation={rejectAppointmentMutation}
                        approveCancellationMutation={
                          approveCancellationMutation
                        }
                        rejectCancellationMutation={rejectCancellationMutation}
                        approveRescheduleMutation={approveRescheduleMutation}
                        rejectRescheduleMutation={rejectRescheduleMutation}
                      />
                    );
                  })}
                </div>
              )}

              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center px-4 py-3 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={page >= pagination.totalPages || isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Carregar mais"
                    )}
                  </Button>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}

interface NotificationItemProps {
  notification: Notification;
  onClick: () => void;
  isArchiving: boolean;
  onApprove?: () => void;
  onReject?: () => void;
  onApproveCancellation?: () => void;
  onRejectCancellation?: () => void;
  onApproveReschedule?: () => void;
  onRejectReschedule?: () => void;
  showActions?: boolean;
  actions?: {
    approve?: boolean;
    reject?: boolean;
    approveCancellation?: boolean;
    rejectCancellation?: boolean;
    approveReschedule?: boolean;
    rejectReschedule?: boolean;
  };
  approveAppointmentMutation: any;
  rejectAppointmentMutation: any;
  approveCancellationMutation: any;
  rejectCancellationMutation: any;
  approveRescheduleMutation: any;
  rejectRescheduleMutation: any;
}

function NotificationItem({
  notification,
  onClick,
  isArchiving,
  onApprove,
  onReject,
  onApproveCancellation,
  onRejectCancellation,
  onApproveReschedule,
  onRejectReschedule,
  showActions = false,
  actions = {},
  approveAppointmentMutation,
  rejectAppointmentMutation,
  approveCancellationMutation,
  rejectCancellationMutation,
  approveRescheduleMutation,
  rejectRescheduleMutation,
}: NotificationItemProps) {
  const getNotificationIcon = (type: string) => {
    const IconComponent =
      notificationIcons[type as keyof typeof notificationIcons] || Bell;
    return IconComponent;
  };

  const IconComponent = getNotificationIcon(notification.type);
  const isUnread = notification.status === "UNREAD";

  const isActionable = showActions && Object.values(actions).some(Boolean);

  return (
    <div
      className="group transition-colors hover:bg-muted/50"
      aria-hidden="true"
    >
      <button
        type="button"
        className="flex w-full items-center gap-3 p-4 text-left cursor-pointer"
        onClick={onClick}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
          <IconComponent className="h-5 w-5" />
        </div>

        <div className="flex-1 space-y-1">
          <p className="text-sm text-foreground">{notification.content}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>
              {formatDistanceToNow(new Date(notification.createdAt), {
                addSuffix: true,
                locale: ptBR,
              })}
            </span>
            <span className="text-muted-foreground/50">•</span>
            <span>{notification.title}</span>
          </div>
        </div>

        {isUnread && (
          <div
            className="h-2 w-2 bg-blue-500 rounded-full ml-auto self-start mt-1"
            aria-label="Notificação não lida"
          />
        )}
      </button>

      {isActionable && (
        <div className="flex justify-end gap-2 pb-3 px-4">
          {actions.reject && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => e.stopPropagation()}
                  disabled={rejectAppointmentMutation.isPending}
                >
                  Recusar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
                  <div
                    className="flex size-9 shrink-0 items-center justify-center rounded-full border"
                    aria-hidden="true"
                  >
                    <CircleAlertIcon className="opacity-80" size={16} />
                  </div>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar Rejeição</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja rejeitar este agendamento? Esta
                      ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={(e) => {
                      e.stopPropagation();
                      onReject?.();
                    }}
                    disabled={rejectAppointmentMutation.isPending}
                  >
                    Confirmar Rejeição
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {actions.approve && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  onClick={(e) => e.stopPropagation()}
                  disabled={approveAppointmentMutation.isPending}
                >
                  Aprovar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
                  <div
                    className="flex size-9 shrink-0 items-center justify-center rounded-full border"
                    aria-hidden="true"
                  >
                    <Check className="opacity-80" size={16} />
                  </div>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar Aprovação</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja aprovar este agendamento? O
                      fornecedor será notificado da confirmação.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={(e) => {
                      e.stopPropagation();
                      onApprove?.();
                    }}
                    disabled={approveAppointmentMutation.isPending}
                  >
                    Confirmar Aprovação
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {actions.approveCancellation && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  onClick={(e) => e.stopPropagation()}
                  disabled={approveCancellationMutation.isPending}
                >
                  Aprovar Cancelamento
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
                  <div
                    className="flex size-9 shrink-0 items-center justify-center rounded-full border"
                    aria-hidden="true"
                  >
                    <CircleAlertIcon className="opacity-80" size={16} />
                  </div>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Confirmar Aprovação do Cancelamento
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja aprovar o cancelamento deste
                      agendamento? O agendamento será cancelado permanentemente.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={(e) => {
                      e.stopPropagation();
                      onApproveCancellation?.();
                    }}
                    disabled={approveCancellationMutation.isPending}
                  >
                    Confirmar Cancelamento
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {actions.rejectCancellation && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => e.stopPropagation()}
                  disabled={rejectCancellationMutation.isPending}
                >
                  Rejeitar Cancelamento
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
                  <div
                    className="flex size-9 shrink-0 items-center justify-center rounded-full border"
                    aria-hidden="true"
                  >
                    <Check className="opacity-80" size={16} />
                  </div>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Confirmar Rejeição do Cancelamento
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja rejeitar o pedido de cancelamento?
                      O agendamento permanecerá ativo.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={(e) => {
                      e.stopPropagation();
                      onRejectCancellation?.();
                    }}
                    disabled={rejectCancellationMutation.isPending}
                  >
                    Confirmar Rejeição
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {actions.approveReschedule && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  onClick={(e) => e.stopPropagation()}
                  disabled={approveRescheduleMutation.isPending}
                >
                  Aprovar Reagendamento
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
                  <div
                    className="flex size-9 shrink-0 items-center justify-center rounded-full border"
                    aria-hidden="true"
                  >
                    <Calendar className="opacity-80" size={16} />
                  </div>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Confirmar Aprovação do Reagendamento
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja aprovar o reagendamento? O
                      agendamento será movido para a nova data solicitada.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={(e) => {
                      e.stopPropagation();
                      onApproveReschedule?.();
                    }}
                    disabled={approveRescheduleMutation.isPending}
                  >
                    Confirmar Reagendamento
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {actions.rejectReschedule && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => e.stopPropagation()}
                  disabled={rejectRescheduleMutation.isPending}
                >
                  Rejeitar Reagendamento
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
                  <div
                    className="flex size-9 shrink-0 items-center justify-center rounded-full border"
                    aria-hidden="true"
                  >
                    <CircleAlertIcon className="opacity-80" size={16} />
                  </div>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Confirmar Rejeição do Reagendamento
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja rejeitar o pedido de reagendamento?
                      O agendamento permanecerá na data original.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={(e) => {
                      e.stopPropagation();
                      onRejectReschedule?.();
                    }}
                    disabled={rejectRescheduleMutation.isPending}
                  >
                    Confirmar Rejeição
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      )}
    </div>
  );
}
