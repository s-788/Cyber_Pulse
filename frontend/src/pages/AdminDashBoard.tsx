import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Pie, Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
} from "chart.js";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Clock, AlertCircle, ShieldCheck, Users, Search, Edit, Trash2, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement
);

interface Report {
  _id?: string;
  incidentType: string;
  description: string;
  dateTime: string;
  location: string;
  anonymous: boolean;
  status: string;
  createdAt?: string;
}

const API_URL = "http://localhost:5000/api/reports";

const AdminDashboard = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchReports = async () => {
    try {
      const { data } = await axios.get(API_URL);
      setReports(data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleCreateReport = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    try {
      await axios.post(API_URL, data);
      fetchReports();
      e.currentTarget.reset();
      setIsCreateOpen(false);
    } catch (err) {
      console.error("Error creating report:", err);
    }
  };

  const handleUpdateReport = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingReport?._id) return;

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    try {
      await axios.put(`${API_URL}/${editingReport._id}`, data);
      setIsEditOpen(false);
      setEditingReport(null);
      fetchReports();
    } catch (err) {
      console.error("Error updating report:", err);
    }
  };

  const openEditDialog = (report: Report) => {
    setEditingReport(report);
    setIsEditOpen(true);
  };

  const handleDeleteReport = async (id?: string) => {
    if (!id || !window.confirm("Are you sure you want to delete this report?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchReports();
    } catch (err) {
      console.error("Error deleting report:", err);
    }
  };

  const filteredReports = useMemo(() =>
    reports.filter((r) =>
      Object.values(r).some(val =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    ), [reports, searchTerm]);

  const stats = useMemo(() => ({
    total: reports.length,
    pending: reports.filter(r => r.status === 'Submitted').length,
    inReview: reports.filter(r => r.status === 'In Review').length,
    resolved: reports.filter(r => r.status === 'Resolved').length,
  }), [reports]);

  return (
    <div className="py-6 sm:py-8 md:py-12 px-3 sm:px-4 md:px-6 bg-whiz-dark text-whiz-light">
      <div className="container mx-auto max-w-7xl">
        <header className="mb-6 sm:mb-8 md:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground mt-1 sm:mt-2">
            Monitor and manage citizen crime reports from across the platform.
          </p>
        </header>

        <Tabs defaultValue="dashboard">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-4 sm:mb-6">
            <TabsList className="bg-whiz-dark/80 border-whiz-secondary/30 w-full sm:w-auto">
              <TabsTrigger value="dashboard" className="text-whiz-light text-xs sm:text-sm flex-1 sm:flex-none">Dashboard</TabsTrigger>
              <TabsTrigger value="management" className="text-whiz-light text-xs sm:text-sm flex-1 sm:flex-none">Report Management</TabsTrigger>
            </TabsList>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="btn-cyber bg-whiz-primary text-whiz-dark w-full sm:w-auto text-sm sm:text-base h-9 sm:h-10">
                  <Plus className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Create New Report
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] sm:max-w-[85vw] md:max-w-4xl max-h-[90vh] overflow-y-auto bg-whiz-dark border-whiz-secondary/30 text-whiz-light mx-2">
                <DialogHeader>
                  <DialogTitle className="text-whiz-primary">Create a New Report</DialogTitle>
                  <CardDescription className="text-muted-foreground">Manually add a new crime report to the system.</CardDescription>
                </DialogHeader>
                <CreateReportForm onSubmit={handleCreateReport} onClose={() => setIsCreateOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>

          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <StatCard icon={<FileText className="text-whiz-primary" />} title="Total Reports" value={stats.total} />
                <StatCard icon={<Clock className="text-amber-400"/>} title="Submitted" value={stats.pending} className="text-amber-400" />
                <StatCard icon={<AlertCircle className="text-blue-400" />} title="In Review" value={stats.inReview} className="text-blue-400" />
                <StatCard icon={<ShieldCheck className="text-green-400" />} title="Resolved" value={stats.resolved} className="text-green-400" />
            </div>
            <AnalyticsContent reports={reports} />
          </TabsContent>

          <TabsContent value="management">
            <Card className="bg-whiz-dark/80 border-whiz-secondary/30">
              <CardHeader>
                <CardTitle className="text-whiz-primary text-lg sm:text-xl">Citizen Crime Reports</CardTitle>
                <CardDescription className="text-muted-foreground text-sm sm:text-base">View, update status, and manage citizen-submitted reports.</CardDescription>
                <div className="relative mt-3 sm:mt-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search all fields..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 sm:pl-10 bg-whiz-dark border-whiz-secondary/50 text-whiz-light text-sm sm:text-base"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <ReportTable reports={filteredReports} onEdit={openEditDialog} onDelete={handleDeleteReport} />
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>

      {editingReport && (
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-[95vw] sm:max-w-[85vw] md:max-w-4xl max-h-[90vh] overflow-y-auto bg-whiz-dark border-whiz-secondary/30 text-whiz-light mx-2">
            <DialogHeader>
              <DialogTitle className="text-whiz-primary text-lg sm:text-xl">Update Report Status</DialogTitle>
            </DialogHeader>
            <ReportForm
              onSubmit={handleUpdateReport}
              initialData={editingReport}
              isEditMode
              onClose={() => setIsEditOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

// Sub-components for better organization

const StatCard = ({ icon, title, value, className = "" }: { icon: React.ReactNode, title: string, value: string | number, className?: string }) => (
    <Card className="bg-whiz-dark/80 backdrop-blur-sm border-whiz-secondary/30 hover:border-whiz-primary/50 transition-all duration-300 group glowing-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">{title}</CardTitle>
            <div className="transition-transform group-hover:scale-110">{icon}</div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
            <div className={`text-2xl sm:text-3xl md:text-4xl font-bold ${className}`}>{value}</div>
        </CardContent>
    </Card>
);

const ReportTable = ({ reports, onEdit, onDelete }: { reports: Report[], onEdit: (r: Report) => void, onDelete: (id?: string) => void }) => (
  <Table>
    <TableHeader>
      <TableRow className="border-whiz-secondary/30">
        <TableHead className="text-whiz-light">Incident Type</TableHead>
        <TableHead className="text-whiz-light">Description</TableHead>
        <TableHead className="text-whiz-light">Location</TableHead>
        <TableHead className="text-whiz-light">Date/Time</TableHead>
        <TableHead className="text-whiz-light">Status</TableHead>
        <TableHead className="text-right text-whiz-light">Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {reports.length > 0 ? reports.map((r) => (
        <TableRow key={r._id} className="hover:bg-whiz-dark/50 border-whiz-secondary/30">
          <TableCell className="capitalize text-whiz-light">{r.incidentType?.replace(/-/g, ' ')}</TableCell>
          <TableCell className="text-muted-foreground max-w-[200px] truncate">{r.description}</TableCell>
          <TableCell className="text-muted-foreground">{r.location || 'N/A'}</TableCell>
          <TableCell className="text-muted-foreground">{new Date(r.dateTime).toLocaleDateString()}</TableCell>
          <TableCell>
            <Badge
              variant={r.status === 'Resolved' ? 'default' : r.status === 'In Review' ? 'secondary' : 'outline'}
              className={
                r.status === 'Resolved' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                r.status === 'In Review' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                'bg-amber-500/20 text-amber-400 border-amber-500/30'
              }
            >
              {r.status}
            </Badge>
          </TableCell>
          <TableCell className="text-right">
            <Button variant="ghost" size="icon" onClick={() => onEdit(r)} className="text-whiz-primary hover:bg-whiz-primary/10"><Edit className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(r._id)} className="text-red-500 hover:bg-red-500/10"><Trash2 className="h-4 w-4" /></Button>
          </TableCell>
        </TableRow>
      )) : (
        <TableRow><TableCell colSpan={6} className="text-center h-24 text-muted-foreground">No reports found.</TableCell></TableRow>
      )}
    </TableBody>
  </Table>
);

const CreateReportForm = ({ onSubmit, onClose }: { onSubmit: (e: React.FormEvent<HTMLFormElement>) => void, onClose?: () => void }) => {
  return (
    <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2 p-1 text-whiz-light">
      <div className="space-y-2">
        <Label htmlFor="incidentType">Incident Type *</Label>
        <Select name="incidentType" required>
          <SelectTrigger className="bg-whiz-dark border-whiz-secondary/50"><SelectValue placeholder="Select type" /></SelectTrigger>
          <SelectContent className="bg-whiz-dark border-whiz-secondary/50 text-whiz-light">
            <SelectItem value="phishing">Phishing</SelectItem>
            <SelectItem value="identity-theft">Identity Theft</SelectItem>
            <SelectItem value="cyberbullying">Cyberbullying</SelectItem>
            <SelectItem value="financial-fraud">Financial Fraud</SelectItem>
            <SelectItem value="data-breach">Data Breach</SelectItem>
            <SelectItem value="ransomware">Ransomware</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Status *</Label>
        <Select name="status" defaultValue="Submitted">
          <SelectTrigger className="bg-whiz-dark border-whiz-secondary/50"><SelectValue /></SelectTrigger>
          <SelectContent className="bg-whiz-dark border-whiz-secondary/50 text-whiz-light">
            <SelectItem value="Submitted">Submitted</SelectItem>
            <SelectItem value="In Review">In Review</SelectItem>
            <SelectItem value="Resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="md:col-span-2 space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Detailed description of the incident..."
          required
          className="bg-whiz-dark border-whiz-secondary/50"
          rows={4}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          placeholder="City, State"
          className="bg-whiz-dark border-whiz-secondary/50"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="dateTime">Date/Time *</Label>
        <Input
          id="dateTime"
          name="dateTime"
          type="datetime-local"
          required
          className="bg-whiz-dark border-whiz-secondary/50"
        />
      </div>
      <div className="md:col-span-2 flex items-center space-x-3 bg-whiz-dark/50 p-4 rounded-lg border border-whiz-secondary/30">
        <input
          type="checkbox"
          id="anonymous"
          name="anonymous"
          value="true"
          className="h-4 w-4"
        />
        <div>
          <Label htmlFor="anonymous" className="font-medium text-whiz-light cursor-pointer">Anonymous Report</Label>
          <p className="text-sm text-muted-foreground">Mark this report as anonymous</p>
        </div>
      </div>
      <div className="md:col-span-2 flex justify-end gap-2 mt-4">
        {onClose && <DialogClose asChild><Button type="button" variant="outline" onClick={onClose} className="border-whiz-secondary/50 text-whiz-light">Cancel</Button></DialogClose>}
        <Button type="submit" className="btn-cyber bg-whiz-primary text-whiz-dark">Create Report</Button>
      </div>
    </form>
  );
};

const ReportForm = ({ onSubmit, initialData, isEditMode = false, onClose }: { onSubmit: (e: React.FormEvent<HTMLFormElement>) => void, initialData?: Report, isEditMode?: boolean, onClose?: () => void }) => {
  return (
    <form onSubmit={onSubmit} className="grid gap-4 p-1 text-whiz-light">
      <div className="space-y-2">
        <Label htmlFor="incidentType">Incident Type</Label>
        <Input
          id="incidentType"
          name="incidentType"
          defaultValue={initialData?.incidentType}
          disabled
          className="bg-whiz-dark/50 border-whiz-secondary/50 opacity-60"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={initialData?.description}
          disabled
          className="bg-whiz-dark/50 border-whiz-secondary/50 opacity-60"
          rows={3}
        />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            defaultValue={initialData?.location}
            disabled
            className="bg-whiz-dark/50 border-whiz-secondary/50 opacity-60"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dateTime">Date/Time</Label>
          <Input
            id="dateTime"
            name="dateTime"
            defaultValue={initialData?.dateTime ? new Date(initialData.dateTime).toISOString().slice(0, 16) : ''}
            disabled
            className="bg-whiz-dark/50 border-whiz-secondary/50 opacity-60"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Status *</Label>
        <Select name="status" defaultValue={initialData?.status || 'Submitted'}>
          <SelectTrigger className="bg-whiz-dark border-whiz-secondary/50"><SelectValue /></SelectTrigger>
          <SelectContent className="bg-whiz-dark border-whiz-secondary/50 text-whiz-light">
            <SelectItem value="Submitted">Submitted</SelectItem>
            <SelectItem value="In Review">In Review</SelectItem>
            <SelectItem value="Resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        {onClose && <DialogClose asChild><Button type="button" variant="outline" onClick={onClose} className="border-whiz-secondary/50 text-whiz-light">Cancel</Button></DialogClose>}
        <Button type="submit" className="btn-cyber bg-whiz-primary text-whiz-dark">Update Status</Button>
      </div>
    </form>
  );
};

const AnalyticsContent = ({ reports }: { reports: Report[] }) => {
    const isDark = document.documentElement.classList.contains('dark');
    const textColor = isDark ? '#f0f2f5' : '#1f2937';
    const gridColor = isDark ? 'rgba(0, 194, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: textColor,
                    font: { size: 12 }
                }
            },
            tooltip: {
                backgroundColor: isDark ? '#0a0f1f' : '#ffffff',
                titleColor: textColor,
                bodyColor: textColor,
                borderColor: isDark ? '#00c2ff' : '#2563eb',
                borderWidth: 1
            }
        },
        scales: {
            x: { ticks: { color: textColor }, grid: { color: gridColor } },
            y: { ticks: { color: textColor }, grid: { color: gridColor } },
        },
    };

    const statusData = {
        labels: ['Submitted', 'In Review', 'Resolved'],
        datasets: [{
            data: [
                reports.filter(r => r.status === 'Submitted').length,
                reports.filter(r => r.status === 'In Review').length,
                reports.filter(r => r.status === 'Resolved').length,
            ],
            backgroundColor: ['#f59e0b', '#3b82f6', '#10b981'],
            borderColor: isDark ? '#0a0f1f' : '#ffffff',
            borderWidth: 2,
        }],
    };

    const incidentTypeData = {
        labels: ['Phishing', 'Identity Theft', 'Cyberbullying', 'Financial Fraud', 'Data Breach', 'Ransomware'],
        datasets: [{
            label: 'Reports by Incident Type',
            data: [
                reports.filter(r => r.incidentType === 'phishing').length,
                reports.filter(r => r.incidentType === 'identity-theft').length,
                reports.filter(r => r.incidentType === 'cyberbullying').length,
                reports.filter(r => r.incidentType === 'financial-fraud').length,
                reports.filter(r => r.incidentType === 'data-breach').length,
                reports.filter(r => r.incidentType === 'ransomware').length,
            ],
            backgroundColor: '#00c2ff',
        }],
    };

    return (
        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
            <Card className="bg-whiz-dark/80 border-whiz-secondary/30">
                <CardHeader>
                    <CardTitle className="text-whiz-primary text-base sm:text-lg">Status Distribution</CardTitle>
                </CardHeader>
                <CardContent className="h-64 sm:h-72 md:h-80">
                    <Pie data={statusData} options={chartOptions} />
                </CardContent>
            </Card>
            <Card className="bg-whiz-dark/80 border-whiz-secondary/30">
                <CardHeader>
                    <CardTitle className="text-whiz-primary text-base sm:text-lg">Reports by Incident Type</CardTitle>
                </CardHeader>
                <CardContent className="h-64 sm:h-72 md:h-80">
                    <Bar data={incidentTypeData} options={chartOptions} />
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminDashboard;