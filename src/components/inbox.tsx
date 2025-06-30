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
} from "lucide-react";

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
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "archived">(
    "all",
  );
  const [page, setPage] = useState(1);

  // Determine status filter based on active tab
  const statusFilter = useMemo(() => {
    switch (activeTab) {
      case "unread":
        return "UNREAD" as const;
      case "archived":
        return "ARCHIVED" as const;
      default:
        return undefined;
    }
  }, [activeTab]);

  // Fetch notifications
  const {
    data: notificationsData,
    isLoading,
    isError,
    refetch,
  } = useNotifications({
    page,
    limit: 20,
    status: statusFilter,
  });

  // Mutations
  const markAsReadMutation = useMarkAsRead();
  const markAsArchivedMutation = useMarkAsArchived();
  const markAllAsReadMutation = useMarkAllAsRead();

  const notifications = notificationsData?.notifications || [];
  const pagination = notificationsData?.pagination;

  const handleMarkAsRead = (notificationId: string) => {
    markAsReadMutation.mutate(notificationId);
  };

  const handleMarkAsArchived = (notificationId: string) => {
    markAsArchivedMutation.mutate(notificationId);
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
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <InboxIcon className="h-5 w-5" />
            Notificações
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Ações
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ações em massa</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleMarkAllAsRead}
                  disabled={markAllAsReadMutation.isPending}
                >
                  <CheckCheck className="h-4 w-4 mr-2" />
                  Marcar todas como lidas
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value as "all" | "unread" | "archived");
          setPage(1); // Reset page when changing tabs
        }}
      >
        <div className="px-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <InboxIcon className="h-4 w-4" />
              Todas
            </TabsTrigger>
            <TabsTrigger value="unread" className="flex items-center gap-2">
              <CircleDot className="h-4 w-4" />
              Não lidas
            </TabsTrigger>
            <TabsTrigger value="archived" className="flex items-center gap-2">
              <Archive className="h-4 w-4" />
              Arquivadas
            </TabsTrigger>
          </TabsList>
        </div>

        <CardContent className="p-0">
          <TabsContent value={activeTab} className="mt-0">
            <ScrollArea className="h-[600px]">
              {isLoading ? (
                <div className="p-6 space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-start space-x-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <InboxIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground mb-2">
                      Nenhuma notificação
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {activeTab === "unread" &&
                        "Você não tem notificações não lidas"}
                      {activeTab === "archived" &&
                        "Você não tem notificações arquivadas"}
                      {activeTab === "all" && "Você não tem notificações"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={handleMarkAsRead}
                      onMarkAsArchived={handleMarkAsArchived}
                      isMarkingAsRead={markAsReadMutation.isPending}
                      isArchiving={markAsArchivedMutation.isPending}
                    />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Página {pagination.page} de {pagination.totalPages}(
                    {pagination.total} notificações)
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page - 1)}
                      disabled={page <= 1 || isLoading}
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page + 1)}
                      disabled={page >= pagination.totalPages || isLoading}
                    >
                      Próxima
                    </Button>
                  </div>
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
  onMarkAsRead: (id: string) => void;
  onMarkAsArchived: (id: string) => void;
  isMarkingAsRead: boolean;
  isArchiving: boolean;
}

function NotificationItem({
  notification,
  onMarkAsRead,
  onMarkAsArchived,
  isMarkingAsRead,
  isArchiving,
}: NotificationItemProps) {
  const getNotificationIcon = (type: string) => {
    const IconComponent =
      notificationIcons[type as keyof typeof notificationIcons] || Bell;
    return IconComponent;
  };

  const getNotificationColor = (type: string) => {
    return (
      notificationColors[type as keyof typeof notificationColors] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    );
  };

  const IconComponent = getNotificationIcon(notification.type);
  const colorClass = getNotificationColor(notification.type);
  const isUnread = notification.status === "UNREAD";

  return (
    <div
      className={`p-4 hover:bg-muted/50 transition-colors ${isUnread ? "bg-muted/30" : ""}`}
    >
      <div className="flex items-start space-x-4">
        <Avatar className={`h-10 w-10 ${colorClass}`}>
          <AvatarFallback className={colorClass}>
            <IconComponent className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4
                  className={`text-sm font-medium ${isUnread ? "font-semibold" : ""}`}
                >
                  {notification.title}
                </h4>
                {isUnread && (
                  <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                    Nova
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {notification.content}
              </p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <span className="sr-only">Abrir menu</span>
                  <span className="text-lg">⋯</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isUnread && (
                  <DropdownMenuItem
                    onClick={() => onMarkAsRead(notification.id)}
                    disabled={isMarkingAsRead}
                  >
                    {isMarkingAsRead ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4 mr-2" />
                    )}
                    Marcar como lida
                  </DropdownMenuItem>
                )}
                {notification.status !== "ARCHIVED" && (
                  <DropdownMenuItem
                    onClick={() => onMarkAsArchived(notification.id)}
                    disabled={isArchiving}
                  >
                    {isArchiving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Archive className="h-4 w-4 mr-2" />
                    )}
                    Arquivar
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>
              {formatDistanceToNow(new Date(notification.createdAt), {
                addSuffix: true,
                locale: ptBR,
              })}
            </span>
            {notification.appointment && (
              <>
                <Separator orientation="vertical" className="h-3" />
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {notification.appointment.internalId}
                </span>
              </>
            )}
            {notification.readAt && (
              <>
                <Separator orientation="vertical" className="h-3" />
                <span className="flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  Lida{" "}
                  {formatDistanceToNow(new Date(notification.readAt), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
