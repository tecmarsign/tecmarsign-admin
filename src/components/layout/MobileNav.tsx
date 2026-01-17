import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, ClipboardList, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { title: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { title: 'Users', icon: Users, path: '/users' },
  { title: 'Courses', icon: BookOpen, path: '/courses' },
  { title: 'Enrollments', icon: ClipboardList, path: '/enrollments' },
  { title: 'Payments', icon: CreditCard, path: '/payments' },
];

export function MobileNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="glass-strong border-t border-border/50 px-2 pb-safe">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200",
                  isActive 
                    ? "text-primary bg-primary/10" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5 transition-transform duration-200",
                  isActive && "scale-110"
                )} />
                <span className={cn(
                  "text-[10px] font-medium",
                  isActive && "text-primary"
                )}>
                  {item.title}
                </span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
