import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navItems = [
  { name: '홈', path: '/' },
  { name: '회사소개', path: '/about' },
  { name: '사업분야', path: '/services' },
  { name: '포트폴리오', path: '/portfolio' },
  { name: '문의하기', path: '/contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b',
        isScrolled
          ? 'bg-background/80 backdrop-blur-md py-3 border-foreground/10'
          : 'bg-transparent py-6 border-transparent'
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-heading font-bold tracking-tighter text-luxury">
            EN <span className="text-foreground/60 font-light">electricity co.</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'text-sm font-medium transition-colors hover:text-foreground/80',
                location.pathname === item.path
                  ? 'text-foreground'
                  : 'text-foreground/60'
              )}
            >
              {item.name}
            </Link>
          ))}
          <Button variant="outline" className="border-luxury rounded-none px-6" render={<Link to="/contact" />} nativeButton={false}>
            상담신청
          </Button>
        </nav>

        {/* Mobile Nav */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon" />}>
              <Menu className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent side="right" className="bg-background border-l border-foreground/10">
              <div className="flex flex-col space-y-6 mt-12">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'text-2xl font-medium transition-colors',
                      location.pathname === item.path
                        ? 'text-foreground'
                        : 'text-foreground/60'
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
                <Button className="w-full rounded-none py-6 text-lg" render={<Link to="/contact" />} nativeButton={false}>
                  상담신청
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
