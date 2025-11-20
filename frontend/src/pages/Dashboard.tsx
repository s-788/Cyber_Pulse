import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Clock, CheckCircle, BarChart3, TrendingUp, AlertTriangle } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartData = [
  { month: "January", reports: 186 },
  { month: "February", reports: 305 },
  { month: "March", reports: 237 },
  { month: "April", reports: 273 },
  { month: "May", reports: 209 },
  { month: "June", reports: 214 },
];

const chartConfig = {
  reports: {
    label: "Reports",
    color: "#00c2ff",
  },
};

const Dashboard = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0 });

  useEffect(() => {
    // Mock data fetching, using localStorage as in the original component
    const storedReports = localStorage.getItem("crimeReports");
    if (storedReports) {
      const parsed = JSON.parse(storedReports);
      const formatted = parsed.map((r: any, i: number) => ({
        id: r.id || `CP-${String(Date.now()).slice(-4)}-${i}`,
        type: r.incidentType.replace(/-/g, ' '),
        status: i % 3 === 0 ? "Resolved" : (i % 2 === 0 ? "In Review" : "Submitted"),
        date: new Date(r.dateTime).toLocaleDateString(),
        description: r.description,
      }));
      setReports(formatted);
      setStats({
        total: formatted.length,
        pending: formatted.filter((r: any) => r.status === "In Review").length,
        resolved: formatted.filter((r: any) => r.status === "Resolved").length,
      });
    }
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Submitted": return <Badge variant="outline" className="border-whiz-primary/50 text-whiz-primary">Submitted</Badge>;
      case "In Review": return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30">In Review</Badge>;
      case "Resolved": return <Badge className="bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30">Resolved</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="py-6 sm:py-8 md:py-12 px-3 sm:px-4 bg-whiz-dark text-whiz-light">
      <div className="container mx-auto max-w-7xl">
        <header className="mb-6 sm:mb-8 md:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">User Dashboard</h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground mt-1">
            Here's an overview of your reports and recent activity.
          </p>
        </header>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8 md:mb-10">
          <StatCard icon={<FileText className="text-whiz-primary" />} title="Total Reports" value={stats.total} />
          <StatCard icon={<Clock className="text-whiz-primary" />} title="Pending Review" value={stats.pending} />
          <StatCard icon={<CheckCircle className="text-whiz-primary" />} title="Cases Resolved" value={stats.resolved} />
        </div>

        <Tabs defaultValue="reports" className="space-y-4 sm:space-y-6">
          <TabsList className="bg-whiz-dark/80 border-whiz-secondary/30 w-full sm:w-auto">
            <TabsTrigger value="reports" className="text-whiz-light text-xs sm:text-sm flex-1 sm:flex-initial">My Reports</TabsTrigger>
            <TabsTrigger value="analytics" className="text-whiz-light text-xs sm:text-sm flex-1 sm:flex-initial">Analytics</TabsTrigger>
          </TabsList>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <Card className="bg-whiz-dark/80 border-whiz-secondary/30">
              <CardHeader>
                <CardTitle className="text-whiz-primary text-base sm:text-lg md:text-xl">My Submitted Reports</CardTitle>
                <CardDescription className="text-muted-foreground text-xs sm:text-sm">Track the status and details of all your submitted reports.</CardDescription>
              </CardHeader>
              <CardContent>
                {reports.length > 0 ? (
                  <div className="overflow-x-auto -mx-6 sm:mx-0">
                  <Table className="min-w-[600px]">
                    <TableHeader>
                      <TableRow className="border-whiz-secondary/30">
                        <TableHead className="text-whiz-light text-xs sm:text-sm">Case ID</TableHead>
                        <TableHead className="text-whiz-light text-xs sm:text-sm">Type</TableHead>
                        <TableHead className="text-whiz-light text-xs sm:text-sm">Date Filed</TableHead>
                        <TableHead className="text-whiz-light text-xs sm:text-sm">Status</TableHead>
                        <TableHead className="text-right text-whiz-light text-xs sm:text-sm">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reports.map((report) => (
                        <TableRow key={report.id} className="hover:bg-whiz-dark border-whiz-secondary/30">
                          <TableCell className="font-mono text-[10px] sm:text-xs text-muted-foreground">{report.id}</TableCell>
                          <TableCell className="font-medium capitalize text-whiz-light text-xs sm:text-sm">{report.type}</TableCell>
                          <TableCell className="text-muted-foreground text-xs sm:text-sm">{report.date}</TableCell>
                          <TableCell>{getStatusBadge(report.status)}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" className="text-whiz-primary hover:bg-whiz-primary/10 text-xs sm:text-sm h-7 sm:h-8 px-2 sm:px-3">View</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                    <p className="text-lg font-medium text-whiz-light">You haven't filed any reports yet.</p>
                    <p className="text-sm text-muted-foreground mb-6">
                      Click the button below to file your first report.
                    </p>
                    <Button className="btn-cyber bg-whiz-primary text-whiz-dark" onClick={() => window.location.href = '/report-crime'}>
                      File a New Report
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card className="bg-whiz-dark/80 border-whiz-secondary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-whiz-primary text-base sm:text-lg md:text-xl"><TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" /> Monthly Report Trends</CardTitle>
                <CardDescription className="text-muted-foreground text-xs sm:text-sm">Reports filed over the last 6 months.</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] sm:h-[350px] md:h-[400px] w-full p-3 sm:p-4 md:p-6">
                <ChartContainer config={chartConfig} className="w-full h-full">
                  <BarChart accessibilityLayer data={chartData}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                    <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} stroke="#f0f2f5" />
                    <YAxis tickLine={false} axisLine={false} tickMargin={10} stroke="#f0f2f5" />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent contentStyle={{ backgroundColor: '#0a0f1f', border: '1px solid #00c2ff' }} />} />
                    <Bar dataKey="reports" fill="#00c2ff" radius={8} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value }: { icon: React.ReactNode, title: string, value: string | number }) => (
  <Card className="bg-whiz-dark/80 backdrop-blur-sm border-whiz-secondary/30 hover:border-whiz-primary/50 transition-all duration-300 group glowing-border">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <div className="transition-transform group-hover:scale-110">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-whiz-light">{value}</div>
      <p className="text-[10px] sm:text-xs text-muted-foreground">This month</p>
    </CardContent>
  </Card>
);

export default Dashboard;
