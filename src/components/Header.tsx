import { Button } from "@/components/ui/button";
import { Wallet, Menu, X, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/logo.png";
import { notificationApi } from "@/services/api";


const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    const userId = 'user_001';
    const fetchUnreadCount = async () => {
      try {
        const data = await notificationApi.getNotifications(userId);
        if (data && data.success && Array.isArray(data.data)) {
          const unread = data.data.filter((notif: any) => !notif.read).length;
          if (isMounted) setUnreadCount(unread);
        }
      } catch {
        // ignore errors in header badge
      }
    };
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
            <img src={logo} alt="Logo" />
            
          </div>
          <span className="text-xl font-bold gradient-primary bg-clip-text text-transparent">
            APOM DApp
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="/gaming"
            className={`transition-smooth ${
              location.pathname === "/gaming"
                ? "text-gaming"
                : "text-foreground hover:text-gaming"
            }`}
          >
            Gaming
          </Link>
          <Link
            to="/defi"
            className={`transition-smooth ${
              location.pathname === "/defi"
                ? "text-defi"
                : "text-foreground hover:text-defi"
            }`}
          >
            DeFi
          </Link>
          <Link
            to="/nft-marketplace"
            className={`transition-smooth ${
              location.pathname === "/nft-marketplace"
                ? "text-nft"
                : "text-foreground hover:text-nft"
            }`}
          >
            NFT Marketplace
          </Link>
          <Link
            to="/launchpad"
            className={`transition-smooth ${
              location.pathname === "/launchpad"
                ? "text-primary"
                : "text-foreground hover:text-primary"
            }`}
          >
            Launchpad
          </Link>
          <Link
            to="/governance"
            className={`transition-smooth ${
              location.pathname === "/governance"
                ? "text-accent"
                : "text-foreground hover:text-accent"
            }`}
          >
            Governance
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Link to="/notifications" className="relative">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Button>
          </Link>

          <Button variant="wallet" size="lg" className="hidden md:flex">
            <Wallet className="w-4 h-4" />
            Connect Wallet
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-b border-border">
          <nav className="container mx-auto px-4 py-4 space-y-4">
            <Link
              to="/gaming"
              className={`block transition-smooth ${
                location.pathname === "/gaming"
                  ? "text-gaming"
                  : "text-foreground hover:text-gaming"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Gaming
            </Link>
            <Link
              to="/defi"
              className={`block transition-smooth ${
                location.pathname === "/defi"
                  ? "text-defi"
                  : "text-foreground hover:text-defi"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              DeFi
            </Link>
            <Link
              to="/nft-marketplace"
              className={`block transition-smooth ${
                location.pathname === "/nft-marketplace"
                  ? "text-nft"
                  : "text-foreground hover:text-nft"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              NFT Marketplace
            </Link>
            <Link
              to="/launchpad"
              className={`block transition-smooth ${
                location.pathname === "/launchpad"
                  ? "text-primary"
                  : "text-foreground hover:text-primary"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Launchpad
            </Link>
            <Link
              to="/governance"
              className={`block transition-smooth ${
                location.pathname === "/governance"
                  ? "text-accent"
                  : "text-foreground hover:text-accent"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Governance
            </Link>
            <Link
              to="/notifications"
              className={`flex items-center justify-between transition-smooth ${
                location.pathname === "/notifications"
                  ? "text-primary"
                  : "text-foreground hover:text-primary"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="flex items-center">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Link>
            <Button variant="wallet" size="lg" className="w-full mt-4">
              <Wallet className="w-4 h-4" />
              Connect Wallet
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
