import React, { useState, useEffect } from 'react';
import { Bell, X, Check, Trash2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { notificationApi } from '@/services/api';

interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const NotificationSystem: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const userId = 'user_001';

  // Local fallback notifications to ensure UI is never empty during demos
  const fallbackNotifications: Notification[] = [
    {
      id: 'fallback_001',
      userId,
      type: 'game_reward',
      title: '🎮 Game Reward Earned!',
      message: 'Congratulations! You earned 150 APOM tokens from completing Crypto Warriors level 5.',
      timestamp: new Date().toISOString(),
      read: false,
    },
    {
      id: 'fallback_002',
      userId,
      type: 'defi_update',
      title: '💎 High APY Alert',
      message: 'APOM-ETH liquidity pool now offers 48.5% APY! Stake your tokens now.',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      read: false,
    },
    {
      id: 'fallback_003',
      userId,
      type: 'nft_sale',
      title: '🖼️ NFT Sold Successfully',
      message: 'Your Crypto Warrior #1234 NFT sold for 2.5 ETH! Funds are now in your wallet.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: 'fallback_004',
      userId,
      type: 'governance',
      title: '🗳️ New Proposal Available',
      message: 'Vote on Proposal #42: Increase gaming rewards by 25%. Voting ends in 3 days.',
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      read: false,
    },
    {
      id: 'fallback_005',
      userId,
      type: 'achievement',
      title: '🏆 Achievement Unlocked',
      message: 'You\'ve reached "DeFi Master" status! Unlock exclusive trading features.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
  ];

  // Fetch notifications with error handling (with fallback)
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await notificationApi.getNotifications(userId);

      if (data && data.success && Array.isArray(data.data) && data.data.length > 0) {
        setNotifications(data.data as Notification[]);
      } else {
        // Use fallback if API returns empty or malformed
        setNotifications(fallbackNotifications);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      // Ensure UI is populated even on error
      setNotifications(fallbackNotifications);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read with error handling
  const markAsRead = async (notificationId: string) => {
    try {
      const data = await notificationApi.markAsRead(notificationId);
      if (data.success) {
        setNotifications(prev =>
          prev.map(notif =>
            notif.id === notificationId
              ? { ...notif, read: true, readAt: data.data.readAt }
              : notif
          )
        );
        toast({ title: 'Success', description: 'Notification marked as read' });
      } else {
        throw new Error(data.error || 'Failed to mark as read');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to mark as read';
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
    }
  };

  // Delete notification with error handling
  const deleteNotification = async (notificationId: string) => {
    try {
      const data = await notificationApi.deleteNotification(notificationId);
      if (data.success) {
        setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
        toast({ title: 'Success', description: 'Notification deleted' });
      } else {
        throw new Error(data.error || 'Failed to delete notification');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete notification';
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  // Get notification type color
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'game_reward': return 'text-green-600 bg-green-50 border-green-200';
      case 'defi_update': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'nft_sale': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'governance': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'launchpad': return 'text-pink-600 bg-pink-50 border-pink-200';
      case 'security': return 'text-red-600 bg-red-50 border-red-200';
      case 'achievement': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'market_update': return 'text-indigo-600 bg-indigo-50 border-indigo-200';
      case 'social': return 'text-cyan-600 bg-cyan-50 border-cyan-200';
      case 'system': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Create demo notification
  const createDemoNotification = async () => {
    try {
      const demoTypes = ['game_reward', 'defi_update', 'nft_sale', 'governance', 'achievement'];
      const demoTitles = [
        '🎮 New High Score!',
        '💎 Yield Farming Alert',
        '🖼️ NFT Collection Update',
        '🗳️ Governance Proposal',
        '🏆 Achievement Unlocked'
      ];
      const demoMessages = [
        'You just achieved a new high score in Crypto Warriors!',
        'New liquidity pool offers 35% APY for APOM-ETH pair.',
        'Your NFT collection value increased by 15% this week.',
        'New proposal available for voting: Reduce trading fees.',
        'Congratulations! You\'ve unlocked the "Trading Master" badge.'
      ];

      const randomIndex = Math.floor(Math.random() * demoTypes.length);
      const data = await notificationApi.createNotification(userId, {
        type: demoTypes[randomIndex],
        title: demoTitles[randomIndex],
        message: demoMessages[randomIndex],
      });

      if (data.success) {
        setNotifications(prev => [data.data, ...prev]);
        toast({ title: 'Demo Notification Created', description: 'A new notification has been added for demonstration.' });
      } else {
        throw new Error(data.error || 'Failed to create demo notification');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create demo notification';
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
    }
  };

  // Load notifications on component mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  if (loading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="text-muted-foreground">Loading notifications...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </CardTitle>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchNotifications}
              disabled={loading}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
            <Button 
              onClick={createDemoNotification}
              variant="outline" 
              size="sm"
              className="text-blue-600 hover:text-blue-700"
            >
              + Add Demo
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              {error}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchNotifications}
                className="ml-2"
              >
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No notifications yet</p>
            <p className="text-sm">You'll see important updates about your gaming, DeFi, and NFT activities here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`transition-all duration-200 hover:shadow-md ${
                  !notification.read 
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm' 
                    : 'bg-white border-gray-200'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className={`font-semibold text-sm ${
                          !notification.read ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                        )}
                      </div>
                      
                      <p className={`text-sm mb-3 ${
                        !notification.read ? 'text-gray-700' : 'text-gray-600'
                      }`}>
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(notification.type)}`}>
                          {notification.type.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className="text-gray-500">{formatTimestamp(notification.timestamp)}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-1 ml-4">
                      {!notification.read && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => deleteNotification(notification.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationSystem;
