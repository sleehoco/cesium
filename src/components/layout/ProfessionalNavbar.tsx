import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  LogOut, 
  User, 
  Shield, 
  ChevronDown, 
  Menu, 
  X,
  FileText,
  Lock,
  Cloud,
  CheckCircle,
  Award,
  Phone,
  BookOpen
} from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from '@/lib/utils';

const services = [
  {
    title: "NIST CSF 2.0",
    description: "Comprehensive cybersecurity framework implementation",
    href: "/services#nist",
    icon: Shield,
  },
  {
    title: "FedRAMP",
    description: "Federal cloud security authorization",
    href: "/services#fedramp",
    icon: Cloud,
  },
  {
    title: "SOC 2",
    description: "Service organization controls compliance",
    href: "/services#soc2",
    icon: CheckCircle,
  },
  {
    title: "FISMA",
    description: "Federal information security management",
    href: "/services#fisma",
    icon: Lock,
  },
  {
    title: "CMMC",
    description: "Cybersecurity maturity model certification",
    href: "/services#cmmc",
    icon: Award,
  },
  {
    title: "Policy Development",
    description: "Custom security policy creation",
    href: "/policy-generator",
    icon: FileText,
  },
];

const resources = [
  {
    title: "Security Hub",
    description: "Real-time threat intelligence dashboard",
    href: "/cyber-dashboard",
    icon: Shield,
  },
  {
    title: "Security Scanner",
    description: "Automated vulnerability assessment",
    href: "/security-scanner",
    icon: Lock,
  },
  {
    title: "Blog & Insights",
    description: "Expert cybersecurity articles",
    href: "/blog",
    icon: BookOpen,
  },
  {
    title: "Text Cleaner",
    description: "Hidden code detection tool",
    href: "/hidden-code-detector",
    icon: FileText,
  },
];

const ProfessionalNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showBorder, setShowBorder] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setShowBorder(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
  };

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isAuthPage = location.pathname === '/auth';

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      showBorder 
        ? "bg-background/95 border-b border-border backdrop-blur-md shadow-lg" 
        : "bg-background/80 backdrop-blur-sm"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <img 
              src="/lovable-uploads/b24b90f5-8a07-4589-821e-d614e2703fa9.png" 
              alt="CesiumCyber Security Logo" 
              className="h-8 w-8 lg:h-10 lg:w-10 transition-transform group-hover:scale-105"
            />
            <div className="flex items-baseline">
              <span className="text-primary font-bold text-lg lg:text-xl">CesiumCyber</span>
              <span className="text-foreground font-light text-lg lg:text-xl ml-1">Security</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Home
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Services</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[500px] gap-3 p-4 md:grid-cols-2">
                      {services.map((service) => (
                        <li key={service.title}>
                          <NavigationMenuLink asChild>
                            <Link
                              to={service.href}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="flex items-center gap-2">
                                <service.icon className="h-4 w-4 text-primary" />
                                <div className="text-sm font-medium leading-none">{service.title}</div>
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                                {service.description}
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/founders">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      About
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:grid-cols-2">
                      {resources.map((resource) => (
                        <li key={resource.title}>
                          <NavigationMenuLink asChild>
                            <Link
                              to={resource.href}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="flex items-center gap-2">
                                <resource.icon className="h-4 w-4 text-primary" />
                                <div className="text-sm font-medium leading-none">{resource.title}</div>
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                                {resource.description}
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/contact">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Contact
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Auth & CTA */}
            <div className="flex items-center gap-3 ml-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-foreground text-sm">
                    <User className="h-4 w-4" />
                    <span className="hidden xl:inline">{user.email}</span>
                    {isAdmin && <Shield className="h-4 w-4 text-primary" />}
                  </div>
                  <Button 
                    onClick={handleSignOut}
                    variant="outline"
                    size="sm"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : !isAuthPage && (
                <Link to="/auth">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
              )}
              <Button 
                onClick={() => navigate('/contact')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                <Phone className="h-4 w-4 mr-2" />
                Schedule Consultation
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-2">
            <Button 
              onClick={() => navigate('/contact')}
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs"
            >
              <Phone className="h-3 w-3 mr-1" />
              Consult
            </Button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground hover:text-primary focus:outline-none transition-colors p-2"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={cn(
          "lg:hidden overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-[calc(100vh-4rem)] pb-4" : "max-h-0"
        )}>
          <div className="border-t border-border pt-4 space-y-1">
            <Link 
              to="/" 
              className="block px-4 py-3 text-foreground hover:text-primary hover:bg-accent/50 rounded-md transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            
            {/* Mobile Services */}
            <div className="px-4 py-2">
              <div className="text-sm font-semibold text-muted-foreground mb-2">Services</div>
              <div className="grid grid-cols-2 gap-2">
                {services.map((service) => (
                  <Link
                    key={service.title}
                    to={service.href}
                    className="flex items-center gap-2 p-2 text-sm text-foreground hover:text-primary hover:bg-accent/50 rounded-md transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <service.icon className="h-4 w-4 text-primary" />
                    {service.title}
                  </Link>
                ))}
              </div>
            </div>

            <Link 
              to="/founders"
              className="block px-4 py-3 text-foreground hover:text-primary hover:bg-accent/50 rounded-md transition-colors"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>

            {/* Mobile Resources */}
            <div className="px-4 py-2">
              <div className="text-sm font-semibold text-muted-foreground mb-2">Resources</div>
              <div className="grid grid-cols-2 gap-2">
                {resources.map((resource) => (
                  <Link
                    key={resource.title}
                    to={resource.href}
                    className="flex items-center gap-2 p-2 text-sm text-foreground hover:text-primary hover:bg-accent/50 rounded-md transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <resource.icon className="h-4 w-4 text-primary" />
                    {resource.title}
                  </Link>
                ))}
              </div>
            </div>

            <Link 
              to="/contact"
              className="block px-4 py-3 text-foreground hover:text-primary hover:bg-accent/50 rounded-md transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>

            {/* Mobile Auth */}
            <div className="border-t border-border mt-4 pt-4 px-4">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-foreground">
                    <User className="h-4 w-4" />
                    <span className="text-sm">{user.email}</span>
                    {isAdmin && <Shield className="h-4 w-4 text-primary" />}
                  </div>
                  <Button 
                    onClick={() => {
                      handleSignOut();
                      setIsOpen(false);
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : !isAuthPage && (
                <Link 
                  to="/auth"
                  onClick={() => setIsOpen(false)}
                >
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ProfessionalNavbar;
