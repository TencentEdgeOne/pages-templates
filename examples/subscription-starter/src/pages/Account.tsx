
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import { toast } from 'sonner';

interface Subscription {
  id: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  prices: {
    products: {
      name: string;
    };
    unit_amount: number;
  };
}

const AccountPage = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const isLoggedIn = localStorage.getItem("sb-user-id");
      if (!isLoggedIn) {
        return navigate('/signin');
      }
      fetchSubscriptions()
    };

    checkUser();
  }, [navigate]);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      fetch("/auth/subscriptions", {
        credentials: "include",
      }).then(async (resp) => {
        console.log("resp", resp);
        if (resp.status === 403) {
          return (window.location.href = "/signin");
        }
        setSubscriptions(await resp.json());
      });
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      toast.error('Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  };

  // Format date to readable format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Format price from cents to dollars
  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };
  
  return (
    <div className="min-h-screen flex flex-col" style={{overflow: "hidden"}}>
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">My Account</h1>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Subscription Information</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-orange-500 border-t-transparent"></div>
                  <p className="mt-2 text-sm text-muted-foreground">Loading subscription data...</p>
                </div>
              ) : subscriptions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Plan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Current Period</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscriptions.map((subscription) => (
                      <TableRow key={subscription.id}>
                        <TableCell className="font-medium">{subscription.prices?.products?.name || 'Unknown Plan'}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            subscription.status === 'active' ? 'bg-green-100 text-green-800' :
                            subscription.status === 'trialing' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>{subscription.prices?.unit_amount ? formatPrice(subscription.prices.unit_amount) : 'N/A'}</TableCell>
                        <TableCell>
                          {formatDate(subscription.current_period_start)} to {formatDate(subscription.current_period_end)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">You don't have any active subscriptions.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AccountPage;
