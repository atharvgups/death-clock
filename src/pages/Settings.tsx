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

const Settings = () => {
  const { subscriptions } = useSubscription();
  const [emailReminders, setEmailReminders] = useState(() => {
    return localStorage.getItem('deathClock_emailReminders') === 'true';
  });
  const [browserNotifications, setBrowserNotifications] = useState(() => {
    return localStorage.getItem('deathClock_browserNotifications') === 'true';
  });
  const [email, setEmail] = useState(() => {
    return localStorage.getItem('deathClock_email') || '';
  });
  const [reminderDays, setReminderDays] = useState(() => {
    return localStorage.getItem('deathClock_reminderDays') || '7';
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Request browser notification permission
  useEffect(() => {
    if (browserNotifications && Notification && Notification.permission !== 'granted') {
      Notification.requestPermission().then(permission => {
        if (permission !== 'granted') {
          setBrowserNotifications(false);
          toast.error('Browser notifications not enabled.');
        }
      });
    }
  }, [browserNotifications]);

  // Persist settings
  useEffect(() => {
    localStorage.setItem('deathClock_emailReminders', String(emailReminders));
    localStorage.setItem('deathClock_browserNotifications', String(browserNotifications));
    localStorage.setItem('deathClock_email', email);
    localStorage.setItem('deathClock_reminderDays', reminderDays);
  }, [emailReminders, browserNotifications, email, reminderDays]);
  
  // Sync settings from localStorage on mount and when tab regains focus
  useEffect(() => {
    const syncSettings = () => {
      setEmailReminders(localStorage.getItem('deathClock_emailReminders') === 'true');
      setBrowserNotifications(localStorage.getItem('deathClock_browserNotifications') === 'true');
      setEmail(localStorage.getItem('deathClock_email') || '');
      setReminderDays(localStorage.getItem('deathClock_reminderDays') || '7');
    };
    syncSettings();
    window.addEventListener('focus', syncSettings);
    return () => window.removeEventListener('focus', syncSettings);
  }, []);
  
  const handleSaveNotifications = () => {
    toast.success("Notification settings saved");
  };
  
  const handleSaveEmail = async () => {
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }
    // Send to backend (to be implemented)
    try {
      await fetch('/api/subscribe-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, reminderDays }),
      });
    toast.success("Email settings saved");
    } catch (e) {
      toast.error("Failed to save email settings");
    }
  };
  
  const handleDeleteAllData = () => {
    // Clear subscriptions from localStorage
    localStorage.removeItem('deathClock_subscriptions');
    toast.success("All subscription data has been deleted");
    
    // Reload the page to reset the state
    window.location.reload();
  };
  
  // Write to localStorage immediately on toggle
  const handleBrowserNotificationsToggle = (checked: boolean) => {
    setBrowserNotifications(checked);
    localStorage.setItem('deathClock_browserNotifications', String(checked));
    console.log('Browser notifications set to:', checked);
  };
  const handleEmailRemindersToggle = (checked: boolean) => {
    setEmailReminders(checked);
    localStorage.setItem('deathClock_emailReminders', String(checked));
    console.log('Email reminders set to:', checked);
  };
  const handleReminderDaysChange = (val: string) => {
    setReminderDays(val);
    localStorage.setItem('deathClock_reminderDays', val);
    console.log('Reminder days set to:', val);
  };

  // Test Notification
  const handleTestNotification = () => {
    if (!('Notification' in window)) {
      toast.error('Notifications are not supported in this browser.');
      return;
    }
    if (Notification.permission !== 'granted') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('Test Notification', { body: 'This is a test notification from DeathClock!' });
        } else {
          toast.error('Notification permission not granted.');
        }
      });
    } else {
      new Notification('Test Notification', { body: 'This is a test notification from DeathClock!' });
    }
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
            <TabsTrigger value="data" className="data-[state=active]:bg-vaporwave-neonPink">
              Data Management
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
                    checked={browserNotifications}
                    onCheckedChange={handleBrowserNotificationsToggle}
                  />
                  <Label htmlFor="browser-notifications">Enable browser notifications</Label>
                </div>
                
                <div className="pt-2">
                  <Label htmlFor="reminder-days">Reminder days before expiration</Label>
                  <div className="flex items-center gap-3 mt-2">
                    <Select 
                      value={reminderDays} 
                      onValueChange={handleReminderDaysChange}
                      disabled={!browserNotifications}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Select days" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 day</SelectItem>
                        <SelectItem value="3">3 days</SelectItem>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="14">14 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button 
                      onClick={handleSaveNotifications}
                      disabled={!browserNotifications}
                    >
                      Save
                    </Button>
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={handleTestNotification}
                    >
                      Test Notification
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" /> 
                  Email Notifications
                </CardTitle>
                <CardDescription>
                  Get email reminders about your dying subscriptions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="email-notifications" 
                    checked={emailReminders}
                    onCheckedChange={handleEmailRemindersToggle}
                  />
                  <Label htmlFor="email-notifications">Enable email notifications</Label>
                </div>
                
                <div className="pt-2">
                  <Label htmlFor="email">Email address</Label>
                  <div className="flex items-center gap-3 mt-2">
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="your@email.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={!emailReminders}
                    />
                    <Button 
                      onClick={handleSaveEmail}
                      disabled={!emailReminders}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="account">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Your DeathClock account details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-400 italic">
                  Account management features will be available in a future update.
                </p>
                <div className="text-sm text-vaporwave-neonPink">
                  In the full version, this is where you would:
                </div>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-300">
                  <li>Update your account details</li>
                  <li>Change your password</li>
                  <li>Connect to Gmail for automatic subscription detection</li>
                  <li>Set funeral preferences</li>
                  <li>Manage your subscription to DeathClock Pro</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="data">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-400">
                  <Trash2 className="h-5 w-5" /> 
                  Data Management
                </CardTitle>
                <CardDescription>
                  Clear or export your subscription data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Subscription Data</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    You currently have {subscriptions.length} subscriptions tracked in DeathClock.
                  </p>
                  
                  <div className="flex gap-3">
                    <Button 
                      variant="outline"
                      onClick={() => {
                        const dataStr = JSON.stringify(subscriptions, null, 2);
                        const dataBlob = new Blob([dataStr], { type: 'application/json' });
                        const url = URL.createObjectURL(dataBlob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'deathclock-subscriptions.json';
                        a.click();
                        URL.revokeObjectURL(url);
                        toast.success("Subscription data exported");
                      }}
                    >
                      Export Data
                    </Button>
                    
                    <Button 
                      variant="destructive"
                      onClick={() => setIsDeleteDialogOpen(true)}
                    >
                      Delete All Data
                    </Button>
                  </div>
                </div>
                
                <div className="text-sm text-gray-400 border-t border-gray-800 pt-4">
                  <p>Your data is stored locally in your browser.</p>
                  <p className="mt-2 text-xs text-gray-500">
                    In the full version, this section would include cloud backup options and 
                    data synchronization settings.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="glass-card border-red-500/30">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all your subscription data.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteAllData}
            >
              Delete All Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Settings;
