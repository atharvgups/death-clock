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

  const handleBrowserNotificationsToggle = async (val: boolean) => {
    if (val && (typeof Notification !== 'undefined') && Notification.permission !== 'granted') {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        toast.error('You must allow notifications in your browser to receive reminders.');
        return;
      }
    }
    handleSave({ browser_notifications: val });
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
        
        <Tabs defaultValue="account" className="mt-6">
          <TabsList className="mb-6 bg-vaporwave-charcoal">
            <TabsTrigger value="account" className="data-[state=active]:bg-vaporwave-neonPink">
              Account
            </TabsTrigger>
          </TabsList>
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
