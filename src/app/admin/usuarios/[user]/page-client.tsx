import { Edit, Settings } from "lucide-react";

import { Activity } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { User } from "@prisma/client";
import { IconUser } from "@tabler/icons-react";
import { format } from "date-fns";
import { Mail } from "lucide-react";

type UserPageClientProps = {
  user: User;
};

export const UserPageClient = ({ user }: UserPageClientProps) => {
  return (
    <div className="container mx-auto px-6 py-8">
      {/* User Overview */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card className="border-muted">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Contact Information
            </CardTitle>
            <Mail className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {user.email}
                </p>
                <p className="text-xs text-gray-600">Email</p>
              </div>
              {user.whatsapp && (
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {user.whatsapp}
                  </p>
                  <p className="text-xs text-gray-600">Whatsapp</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-muted">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Account Details
            </CardTitle>
            <IconUser className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {format(user.createdAt, "MMM dd, yyyy")}
                </p>
                <p className="text-xs text-gray-600">Member since</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-muted">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Account Details
            </CardTitle>
            <IconUser className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {format(user.createdAt, "MMM dd, yyyy")}
                </p>
                <p className="text-xs text-gray-600">Member since</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="activity">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100">
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Activity Log
          </TabsTrigger>
          <TabsTrigger value="edit" className="flex items-center gap-2">
            <Edit className="w-4 h-4" />
            Edit Profile
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="activity">
          {/* <UserActivityLog userId={user.id} /> */}
        </TabsContent>

        <TabsContent value="edit">
          {/* <UserEditForm user={user} onUpdate={handleUserUpdate} isLoading={updateUserMutation.isPending} /> */}
        </TabsContent>

        <TabsContent value="settings">
          {/* <UserSettingsForm
          user={user}
          onSettingsUpdate={handleSettingsUpdate}
          onPasswordReset={handlePasswordReset}
          onToggleTwoFactor={handleToggleTwoFactor}
          isLoading={updateUserMutation.isPending}
          isPasswordResetLoading={passwordResetMutation.isPending}
          isTwoFactorLoading={toggleTwoFactorMutation.isPending}
        /> */}
        </TabsContent>
      </Tabs>
    </div>
  );
};
