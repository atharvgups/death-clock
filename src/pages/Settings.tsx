import React, { useState } from "react";
import Navbar from "@/components/navigation/navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useSettings } from '@/context/SettingsContext';
import { useUser } from '@/context/UserContext';
import { supabase } from '../supabaseClient';

const Settings = () => {
  const { settings, updateSettings, loading } = useSettings();
  const { user } = useUser();
  const [isSaving, setIsSaving] = useState(false);

  if (loading) return <div className="text-white p-8">Loading...</div>;

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
