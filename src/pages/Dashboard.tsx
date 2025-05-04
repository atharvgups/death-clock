import React, { useState } from "react";
import Navbar from "@/components/navigation/navbar";
import StatsOverview from "@/components/dashboard/stats-overview";
import SubscriptionCard from "@/components/subscriptions/subscription-card";
import { useSubscription } from "@/context/subscription-context";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SubscriptionForm from "@/components/subscriptions/subscription-form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Search, Skull, Clock } from "lucide-react";
import { useUser } from '@/context/UserContext';
import LoginPage from '@/components/LoginPage';

const Dashboard = () => {
  const { user, loading } = useUser();
  if (loading) return null;
  if (!user) return <LoginPage />;

  const { subscriptions } = useSubscription();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editSubscriptionId, setEditSubscriptionId] = useState<string | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter out deleted subscriptions only from living
  const activeSubscriptions = subscriptions.filter(sub => 
    sub.status !== 'expired' && !sub.deleted
  );
  // Show all expired subscriptions, regardless of deleted flag
  const expiredSubscriptions = subscriptions.filter(sub => sub.status === 'expired');
  
  const filteredActive = activeSubscriptions.filter(sub => 
    sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredExpired = expiredSubscriptions.filter(sub => 
    sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Sort so liked subscriptions appear first
  const sortedActive = [...filteredActive].sort((a, b) => (b.liked ? 1 : 0) - (a.liked ? 1 : 0));
  const sortedExpired = [...filteredExpired].sort((a, b) => (b.liked ? 1 : 0) - (a.liked ? 1 : 0));
  
  const handleEditSubscription = (id: string) => {
    setEditSubscriptionId(id);
    setIsAddDialogOpen(true);
  };
  
  const handleDialogClose = () => {
    setIsAddDialogOpen(false);
    setEditSubscriptionId(undefined);
  };
  
  return (
    <div className="bg-vaporwave-darkPurple min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-28 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-display mb-2 text-white glow">
            Death<span className="text-vaporwave-neonPink">Clock</span> Dashboard
          </h1>
          <p className="text-gray-400 font-mono glow">
            Track your subscriptions as they march toward their inevitable demise
          </p>
        </div>
        
        <StatsOverview />
        
        <div className="mt-10 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search subscriptions..." 
              className="pl-9 vaporwave-card"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Button 
            className="vaporwave-btn w-full sm:w-auto"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Subscription
          </Button>
        </div>
        
        <Tabs defaultValue="living" className="mt-6">
          <TabsList className="mb-6 bg-vaporwave-charcoal">
            <TabsTrigger value="living" className="data-[state=active]:bg-vaporwave-neonPink flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Living ({activeSubscriptions.length})
            </TabsTrigger>
            <TabsTrigger value="expired" className="data-[state=active]:bg-vaporwave-neonPink flex items-center gap-2">
              <Skull className="h-4 w-4" />
              Cemetery ({expiredSubscriptions.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="living">
            {sortedActive.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedActive.map(subscription => (
                  <SubscriptionCard 
                    key={subscription.id} 
                    subscription={subscription}
                    onEdit={handleEditSubscription}
                  />
                ))}
              </div>
            ) : searchTerm ? (
              <div className="text-center py-16">
                <p className="text-gray-400">No results found for "{searchTerm}"</p>
              </div>
            ) : (
              <div className="text-center py-16 space-y-4">
                <Clock className="h-12 w-12 text-vaporwave-neonPink mx-auto" />
                <h3 className="text-xl font-bold">No Living Subscriptions</h3>
                <p className="text-gray-400">Add your first subscription to start tracking</p>
                <Button 
                  className="bg-vaporwave-neonPink hover:bg-vaporwave-neonPink/80 mt-2"
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Subscription
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="expired">
            <div className="text-center py-16 space-y-6">
              <div className="relative">
                <Skull className="h-16 w-16 text-gray-500 mx-auto mb-4 animate-float" />
                <div className="absolute inset-0 bg-gradient-radial from-transparent to-black/20 pointer-events-none" />
              </div>
              <h3 className="text-xl font-bold text-gray-400">Digital Cemetery</h3>
              <p className="text-gray-500 font-mono max-w-md mx-auto">
                {expiredSubscriptions.length === 0 
                  ? "The cemetery awaits its first resident..." 
                  : `${expiredSubscriptions.length} subscription${expiredSubscriptions.length === 1 ? '' : 's'} laid to rest`}
              </p>
              <Button 
                variant="outline" 
                className="border-gray-700 text-gray-400 hover:text-gray-100 hover:border-gray-500"
                onClick={() => window.location.href = '/cemetery'}
              >
                <Skull className="h-4 w-4 mr-2" />
                Visit Cemetery
              </Button>
              </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Dialog open={isAddDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[600px] glass-card border-vaporwave-neonPink/30">
          <DialogHeader>
            <DialogTitle>
              {editSubscriptionId ? "Edit Subscription" : "Add New Subscription"}
            </DialogTitle>
          </DialogHeader>
          
          <SubscriptionForm 
            subscriptionId={editSubscriptionId}
            onSuccess={handleDialogClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
