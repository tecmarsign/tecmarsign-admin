import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldX } from 'lucide-react';
import { useLogout } from '@refinedev/core';

export default function AccessDenied() {
  const { mutate: logout } = useLogout();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-bl from-destructive/5 to-transparent rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md text-center relative glass border-border/50">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 border border-destructive/20">
            <ShieldX className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold">Access Denied</CardTitle>
          <CardDescription className="text-muted-foreground">
            You don't have permission to access the admin dashboard.
            Only administrators can access this area.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => logout()} 
            variant="outline" 
            className="w-full h-11 border-border/50 hover:bg-secondary/50"
          >
            Sign Out & Try Different Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
