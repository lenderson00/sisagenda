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
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  type Notification,
} from "@/hooks/use-notifications";

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
    <Card className={className}>
      <CardHeader className="p-4 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Notificações</CardTitle>
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
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="h-4 w-4" />
              <span className="sr-only">Configurações</span>
            </Button>
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
        <div className="px-4 pt-2 border-b">
          <TabsList>
            <TabsTrigger value="unread" className="flex items-center gap-2">
              Caixa de Entrada
              {unreadCount > 0 && (
                <Badge variant="destructive" className="h-5 w-auto px-1.5 ml-2">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="all" className="flex items-center gap-2">
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
                  {notifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onClick={() => handleNotificationClick(notification)}
                      isArchiving={markAsArchivedMutation.isPending}
                    />
                  ))}
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
}

function NotificationItem({
  notification,
  onClick,
  isArchiving,
}: NotificationItemProps) {
  const getNotificationIcon = (type: string) => {
    const IconComponent =
      notificationIcons[type as keyof typeof notificationIcons] || Bell;
    return IconComponent;
  };

  const IconComponent = getNotificationIcon(notification.type);
  const isUnread = notification.status === "UNREAD";

  const isActionable = notification.type === "APPOINTMENT_RESCHEDULE_REQUESTED";

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
          <Button variant="outline" size="sm">
            Recusar
          </Button>
          <Button size="sm">Aceitar</Button>
        </div>
      )}
    </div>
  );
}
