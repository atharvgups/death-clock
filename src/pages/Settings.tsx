import React, { useState, useEffect } from "react";
import Navbar from "@/components/navigation/navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Bell, Mail, Trash2 } from "lucide-react";
import { useSubscription } from "@/context/subscription-context";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useSettings } from '@/context/SettingsContext';
import { useUser } from '@/context/UserContext';
import { supabase } from '../supabaseClient';

const Settings = () => {
  const { subscriptions } = useSubscription();
  const { settings, updateSettings, loading } = useSettings();
  const { user } = useUser();
  const [isSaving, setIsSaving] = useState(false);

  if (loading) return <div className="text-white p-8">Loading...</div>;

  const handleSave = async (updates: any) => {
    setIsSaving(true);
    await updateSettings(updates);
    setIsSaving(false);
    toast.success('Settings saved!');
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <div className="bg-vaporwave-darkPurple min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-28 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-display mb-2 text-white">
            Settings
          </h1>
          <p className="text-gray-400 font-mono">
            Configure your DeathClock experience
          </p>
        </div>
        
        <Tabs defaultValue="notifications" className="mt-6">
          <TabsList className="mb-6 bg-vaporwave-charcoal">
            <TabsTrigger value="notifications" className="data-[state=active]:bg-vaporwave-neonPink">
              Notifications
            </TabsTrigger>
            <TabsTrigger value="account" className="data-[state=active]:bg-vaporwave-neonPink">
              Account
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="notifications">
            <Card className="glass-card mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" /> 
                  Browser Notifications
                </CardTitle>
                <CardDescription>
                  Receive notifications in your browser about expiring subscriptions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="browser-notifications" 
                    checked={!!settings?.browser_notifications}
                    onCheckedChange={val => handleSave({ browser_notifications: val })}
                  />
                  <Label htmlFor="browser-notifications">Enable browser notifications</Label>
                </div>
                
                <div className="pt-2">
                  <Label htmlFor="reminder-days">Reminder days before expiration</Label>
                  <div className="flex items-center gap-3 mt-2">
                    <Select 
                      value={String(settings?.reminder_days ?? 7)}
                      onValueChange={val => handleSave({ reminder_days: Number(val) })}
                      disabled={!settings?.browser_notifications}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Select days" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 day</SelectItem>
                        <SelectItem value="3">3 days</SelectItem>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="14">14 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="account">
            <Card className="glass-card mb-6">
              <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>Manage your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="mb-4">
                  <Label>Email</Label>
                  <Input value={user?.email || ''} disabled readOnly className="mt-1" />
                </div>
                <Button onClick={handleSignOut} variant="destructive">Sign out</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Settings;
