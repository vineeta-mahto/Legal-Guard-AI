import React, { useState } from "react";
import {
  useListNotifications,
  useMarkNotificationRead,
  getListNotificationsQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  CheckSquare,
  MessageSquare,
  ShieldAlert,
  History,
  CheckCircle2,
  ArrowRight
} from "lucide-react";

export default function Notifications() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("all");
  const [, setLocation] = useLocation();

  const { data: notifications, isLoading } = useListNotifications({
    category: activeTab !== "all" ? activeTab : undefined
  });

  const markReadMutation = useMarkNotificationRead();

  const handleMarkRead = (id: number) => {
    markReadMutation.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListNotificationsQueryKey() });
      }
    });
  };

  const handleMarkAllRead = () => {
    const unread = notifications?.filter(n => !n.isRead) || [];
    unread.forEach(n => handleMarkRead(n.id));
  };

  const handleAction = (notification: { id: number; isRead: boolean; ctaLink?: string | null }) => {
    if (!notification.isRead) {
      handleMarkRead(notification.id);
    }
    if (notification.ctaLink) {
      setLocation(notification.ctaLink);
    }
  };

  const getIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "approvals": return <CheckSquare className="h-5 w-5 text-amber-500" />;
      case "ai": return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case "security": return <ShieldAlert className="h-5 w-5 text-destructive" />;
      case "audit": return <History className="h-5 w-5 text-green-500" />;
      default: return <Bell className="h-5 w-5 text-primary" />;
    }
  };

  const getStatusDot = (status: string) => {
    const colors: Record<string, string> = {
      urgent: "bg-red-500",
      warning: "bg-amber-500",
      blocked: "bg-red-600",
      success: "bg-green-500",
      info: "bg-blue-500",
    };
    return colors[status] || "bg-muted-foreground";
  };

  const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Notifications</h1>
          <p className="text-muted-foreground mt-1">Stay updated on your workspace activities.</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={handleMarkAllRead} className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4 flex flex-wrap h-auto">
          <TabsTrigger value="all">All {unreadCount > 0 && <span className="ml-1.5 bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-px">{unreadCount}</span>}</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
          <TabsTrigger value="ai">AI Insights</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="audit">Audit</TabsTrigger>
        </TabsList>

        <Card className="shadow-sm">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-20 w-full" />)}
              </div>
            ) : !notifications?.length ? (
              <div className="p-16 text-center flex flex-col items-center">
                <Bell className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-1">You are all caught up</h3>
                <p className="text-muted-foreground">No notifications found.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 flex gap-4 transition-colors ${
                      !notification.isRead ? "bg-primary/5 hover:bg-primary/10" : "bg-card hover:bg-muted/50"
                    }`}
                  >
                    <div className="mt-1 shrink-0 relative">
                      {getIcon(notification.category)}
                      {!notification.isRead && (
                        <span className={`absolute -top-1 -right-1 h-2 w-2 rounded-full ${getStatusDot(notification.status || "info")}`} />
                      )}
                    </div>
                    <div className="flex-1 space-y-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`font-medium ${!notification.isRead ? "text-foreground" : "text-foreground/80"}`}>
                          {notification.title}
                        </p>
                        <span className="text-xs text-muted-foreground shrink-0 whitespace-nowrap">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.description}</p>
                      {notification.cta && (
                        <div className="mt-3">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="h-8 gap-1.5"
                            onClick={() => handleAction(notification)}
                          >
                            {notification.cta}
                            {notification.ctaLink && <ArrowRight className="h-3 w-3" />}
                          </Button>
                        </div>
                      )}
                    </div>
                    {!notification.isRead && (
                      <div className="shrink-0 flex items-start">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          onClick={() => handleMarkRead(notification.id)}
                          title="Mark as read"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}
