'use client';

import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import config from '@/config';
import { UserProfile } from '../user-profile';
import { Drawer } from '../ui/drawer';
import { cn } from '@/lib/utils';

// Navigation items with sections to scroll to
const navigationItems = [
  { title: 'Home', href: '#hero', section: 'hero' },
  { title: 'Benefits', href: '#benefits', section: 'features' },
  { title: 'Technologies', href: '#technologies', section: 'technologies' },
  { title: 'Pricing', href: '#pricing', section: 'pricing' },
  { title: 'FAQ', href: '#faq', section: 'faq' },
];

export default function NavBar() {
  // Auth setup
  let userId = null;
  if (config?.auth?.enabled) {
    const user = useAuth();
    userId = user?.userId;
  }

  // State for mobile menu, scroll, and active section
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // Handle scroll events for navbar appearance and active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setHasScrolled(scrollPosition > 10);

      // Determine which section is currently in view
      const sections = navigationItems.map(item => item.section);
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          const offset = 100; // Navbar height plus some buffer
          
          if (rect.top <= offset && rect.bottom >= offset) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Handle smooth scrolling to sections
  const scrollToSection = (section: string) => {
    const element = document.getElementById(section);
    if (element) {
      // Close drawer if it's open
      setDrawerOpen(false);
      
      // Get the height of the navbar
      const navbarHeight = 80; // Approx height of navbar
      
      // Calculate scroll position
      const offsetPosition = element.offsetTop - navbarHeight;
      
      // Scroll to the position
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header className={`w-full z-40 fixed top-0 left-0 transition-all duration-300 ${hasScrolled ? 'bg-black/90 backdrop-blur-sm border-b border-green-900/20' : 'bg-transparent'}`}>
      <div className="container relative mx-auto min-h-20 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold text-white">
            Titan
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center">
          <NavigationMenu>
            <NavigationMenuList className="flex gap-6">
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  <NavigationMenuLink
                    className={cn(
                      "text-sm font-medium text-white cursor-pointer relative py-2",
                      activeSection === item.section ? "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-green-500" : ""
                    )}
                    onClick={() => scrollToSection(item.section)}
                  >
                    {item.title}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          {userId ? (
            <UserProfile />
          ) : config?.auth?.enabled ? (
            <Button
              variant="outline"
              className="text-white border-green-800/40 hover:bg-green-900/20"
              onClick={() => window.location.assign('/sign-in')}
            >
              Sign in
            </Button>
          ) : null}

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" onClick={() => setDrawerOpen(true)}>
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <Drawer isOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)}>
        <div className="flex flex-col gap-6 pt-6">
          {navigationItems.map((item) => (
            <button
              key={item.title}
              className={cn(
                "flex text-left text-lg font-medium py-3 px-2 border-l-2 transition-colors",
                activeSection === item.section
                  ? "text-green-400 border-green-500 bg-green-900/10"
                  : "text-white border-transparent hover:border-green-600/30 hover:bg-green-900/5"
              )}
              onClick={() => scrollToSection(item.section)}
            >
              {item.title}
            </button>
          ))}
          
          {/* Mobile Auth Button */}
          {config?.auth?.enabled && !userId && (
            <div className="mt-6 pt-6 border-t border-gray-800">
              <Button
                variant="outline"
                className="w-full text-white border-green-800/40 hover:bg-green-900/20"
                onClick={() => window.location.assign('/sign-in')}
              >
                Sign in
              </Button>
            </div>
          )}
        </div>
      </Drawer>
    </header>
  );
}
