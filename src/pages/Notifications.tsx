import React from 'react';
import NotificationSystem from '@/components/NotificationSystem';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const NotificationsPage: React.FC = () => {
  return (
    <div className="min-h-screen relative z-10">
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-12 px-4 animated-bg">
          <div className="container mx-auto text-center">
            <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Notification Center
          </h1>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto">
            Stay updated with all your gaming rewards, DeFi opportunities, NFT activities, 
            governance proposals, and launchpad announcements in one centralized place.
          </p>
            </div>
          </div>
        </section>

        {/* Notifications List */}
        <section className="py-6 px-4">
          <div className="container mx-auto">
            <div className="relative z-10">
              <NotificationSystem />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default NotificationsPage;

