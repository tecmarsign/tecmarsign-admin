import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, ClipboardList, CreditCard, TrendingUp, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const metrics = [
  {
    title: 'Total Users',
    value: '-',
    description: 'Active students & tutors',
    icon: Users,
    trend: null,
    color: 'from-blue-500/20 to-blue-600/20',
    iconColor: 'text-blue-500',
  },
  {
    title: 'Courses',
    value: '-',
    description: 'Published courses',
    icon: BookOpen,
    trend: null,
    color: 'from-purple-500/20 to-purple-600/20',
    iconColor: 'text-purple-500',
  },
  {
    title: 'Enrollments',
    value: '-',
    description: 'Active enrollments',
    icon: ClipboardList,
    trend: null,
    color: 'from-emerald-500/20 to-emerald-600/20',
    iconColor: 'text-emerald-500',
  },
  {
    title: 'Revenue',
    value: 'KES -',
    description: 'Total revenue',
    icon: CreditCard,
    trend: null,
    color: 'from-amber-500/20 to-amber-600/20',
    iconColor: 'text-amber-500',
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Welcome back
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your academy today.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <Card 
            key={metric.title} 
            className={cn(
              "relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm",
              "hover:shadow-glow-sm transition-all duration-300"
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={cn(
              "absolute inset-0 bg-gradient-to-br opacity-50",
              metric.color
            )} />
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <div className={cn(
                "h-8 w-8 rounded-lg flex items-center justify-center",
                "bg-background/50"
              )}>
                <metric.icon className={cn("h-4 w-4", metric.iconColor)} />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {metric.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Overview */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Revenue Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              <p className="text-sm">Charts coming in Phase 6</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowUpRight className="h-5 w-5 text-accent" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              <p className="text-sm">Activity feed coming in Phase 6</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
