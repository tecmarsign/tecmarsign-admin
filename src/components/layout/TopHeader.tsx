import { useLocation } from 'react-router-dom';
import { LogOut, GraduationCap } from 'lucide-react';
import { useGetIdentity, useLogout } from '@refinedev/core';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface UserIdentity {
  id: string;
  name: string;
  email: string;
  role: string;
}

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/users': 'Users',
  '/courses': 'Courses',
  '/enrollments': 'Enrollments',
  '/payments': 'Payments',
};

export function TopHeader() {
  const { data: identity } = useGetIdentity<UserIdentity>();
  const { mutate: logout } = useLogout();
  const location = useLocation();
  const currentTitle = pageTitles[location.pathname] || 'Dashboard';

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="glass-strong border-b border-border/50">
        <div className="flex h-14 items-center justify-between px-4 md:px-6">
          {/* Mobile Logo */}
          <div className="flex items-center gap-3 md:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary shadow-glow-sm">
              <GraduationCap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">Tecmarsign</span>
          </div>

          {/* Desktop Page Title */}
          <div className="hidden md:block">
            <h1 className="text-lg font-semibold text-foreground">{currentTitle}</h1>
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 gap-2 px-2">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-primary/20 text-primary text-xs font-medium">
                    {identity?.name?.charAt(0).toUpperCase() || 'A'}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden text-sm font-medium md:inline-block">
                  {identity?.name?.split(' ')[0] || 'Admin'}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 glass-strong">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{identity?.name || identity?.email}</p>
                  <p className="text-xs text-muted-foreground capitalize">{identity?.role || 'Administrator'}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()} className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
