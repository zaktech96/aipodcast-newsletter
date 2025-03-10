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
  { title: 'Features', href: '#features', section: 'features' },
  { title: 'Technologies', href: '#stack', section: 'stack' },
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
      
      // Find all sections and their positions
      const sectionPositions = sections.map(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return { 
            section, 
            top: rect.top,
            bottom: rect.bottom,
            height: rect.height
          };
        }
        return null;
      }).filter(Boolean);
      
      // Find the current active section
      const viewportHeight = window.innerHeight;
      const viewportCenter = viewportHeight / 3; // Use the top third as the detection point
      
      // Find the section that occupies the center of the screen
      const currentSection = sectionPositions.find(section => {
        if (section && typeof section.top === 'number' && typeof section.bottom === 'number') {
          return section.top <= viewportCenter && section.bottom >= viewportCenter;
        }
        return false;
      });
      
      // Default to hero if no section is active or we're at the top of the page
      if (currentSection) {
        setActiveSection(currentSection.section);
      } else if (scrollPosition < 100) {
        setActiveSection('hero');
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Initial call to set the active section on page load
    handleScroll();
    
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
      
      // Get the height of the navbar (slightly larger buffer for better spacing)
      const navbarHeight = 100; // Add more buffer to avoid content being hidden under navbar
      
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
          ) : (
            <Button
              variant="outline"
              className="text-white border-green-800/40 hover:bg-green-900/20"
              onClick={() => window.location.assign('/sign-in')}
              disabled={!config?.auth?.enabled}
            >
              Sign in
            </Button>
          )}

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
        <div className="flex flex-col gap-6 pt-4">
          <h2 className="text-xl font-bold text-white mb-4">Menu</h2>
          {navigationItems.map((item) => (
            <button
              key={item.title}
              className={cn(
                "flex text-left text-lg font-medium py-3 px-4 border-l-2 transition-colors w-full",
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
          <div className="mt-6 pt-6 border-t border-gray-800">
            <Button
              variant="outline"
              className="w-full text-white border-green-800/40 hover:bg-green-900/20"
              onClick={() => window.location.assign('/sign-in')}
            >
              Sign in
            </Button>
          </div>
        </div>
      </Drawer>
    </header>
  );
}
