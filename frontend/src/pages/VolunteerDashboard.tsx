import React, { useState, useEffect, useMemo } from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileText, ShieldAlert, CheckCircle, Search, Edit, Trash2, Plus } from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

interface ReportForm {
  reporterName: string;
  reporterEmail: string;
  platform: string;
  category: string;
  severity: string;
  location: string;
  sourceLink: string;
  dateReported: string;
  description: string;
  misinformationDetected: string;
  _id: string;
}

const VolunteerDashboard = () => {
  const [reports, setReports] = useState<ReportForm[]>([]);
  const [editingReport, setEditingReport] = useState<ReportForm | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("volunteerReports");
    if (saved) {
      setReports(JSON.parse(saved));
    }
  }, []);

  const saveReports = (updatedReports: ReportForm[]) => {
    setReports(updatedReports);
    localStorage.setItem("volunteerReports", JSON.stringify(updatedReports));
  };

  const handleSubmitReport = (formData: Omit<ReportForm, '_id'>) => {
    const newReport = { ...formData, _id: Date.now().toString() };
    saveReports([...reports, newReport]);
    setIsCreateOpen(false);
  };

  const handleUpdateReport = (formData: ReportForm) => {
    const updatedReports = reports.map(r => r._id === formData._id ? formData : r);
    saveReports(updatedReports);
    setIsEditDialogOpen(false);
    setEditingReport(null);
  };

  const openEditDialog = (report: ReportForm) => {
    setEditingReport(report);
    setIsEditDialogOpen(true);
  };

  const handleDeleteReport = (reportId: string) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      saveReports(reports.filter((r) => r._id !== reportId));
    }
  };

  const filteredReports = useMemo(() =>
    reports.filter((r) =>
      Object.values(r).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase()))
    ),
    [reports, searchTerm]
  );
  
  const stats = useMemo(() => ({
    total: reports.length,
    misinfo: reports.filter(r => r.misinformationDetected === "Yes").length,
    verified: reports.filter(r => r.misinformationDetected !== "Yes").length,
  }), [reports]);


  return (
    <div className="py-12 px-4 bg-whiz-dark text-whiz-light">
      <div className="container mx-auto max-w-7xl">
        <header className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight">Volunteer Dashboard</h1>
          <p className="text-lg text-muted-foreground mt-1">
            Review community reports, identify misinformation, and help keep the digital space safe.
          </p>
        </header>

        <Tabs defaultValue="dashboard">
          <div className="flex justify-between items-center mb-6">
            <TabsList className="bg-whiz-dark/80 border-whiz-secondary/30">
              <TabsTrigger value="dashboard" className="text-whiz-light">Dashboard</TabsTrigger>
              <TabsTrigger value="management" className="text-whiz-light">Report Management</TabsTrigger>
            </TabsList>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="btn-cyber bg-whiz-primary text-whiz-dark"><Plus className="mr-2 h-4 w-4" /> Submit Report</Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl bg-whiz-dark border-whiz-secondary/30 text-whiz-light">
                <DialogHeader>
                  <DialogTitle className="text-whiz-primary">Submit a New Report</DialogTitle>
                  <CardDescription className="text-muted-foreground">Fill out the form to submit a new report for review.</CardDescription>
                </DialogHeader>
                <ReportForm onSubmit={handleSubmitReport} />
              </DialogContent>
            </Dialog>
          </div>
          
          <TabsContent value="dashboard">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard icon={<FileText className="text-whiz-primary" />} title="Total Submissions" value={stats.total} />
                <StatCard icon={<ShieldAlert className="text-red-500" />} title="Misinformation Detected" value={stats.misinfo} className="text-red-500" />
                <StatCard icon={<CheckCircle className="text-green-400" />} title="Valid/Unverified" value={stats.verified} className="text-green-400"/>
            </div>
            <AnalyticsContent reports={reports} />
          </TabsContent>

          <TabsContent value="management">
            <Card className="bg-whiz-dark/80 border-whiz-secondary/30">
              <CardHeader>
                  <CardTitle className="text-whiz-primary">Report Records</CardTitle>
                  <CardDescription className="text-muted-foreground">Search and manage all volunteer-submitted reports.</CardDescription>
                  <div className="relative mt-4">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                          placeholder="Search all fields..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 bg-whiz-dark border-whiz-secondary/50 text-whiz-light"
                      />
                  </div>
              </CardHeader>
              <CardContent>
                <ReportTable reports={filteredReports} onEdit={openEditDialog} onDelete={handleDeleteReport} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {editingReport && (
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-4xl bg-whiz-dark border-whiz-secondary/30 text-whiz-light">
                    <DialogHeader>
                        <DialogTitle className="text-whiz-primary">Edit Report</DialogTitle>
                    </DialogHeader>
                    <ReportForm
                        onSubmit={handleUpdateReport}
                        initialData={editingReport}
                        isEditMode
                        onClose={() => setIsEditDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        )}
      </div>
    </div>
  );
};

// Sub-components

const StatCard = ({ icon, title, value, className = "" }: { icon: React.ReactNode, title: string, value: string | number, className?: string }) => (
    <Card className="bg-whiz-dark/80 backdrop-blur-sm border-whiz-secondary/30 hover:border-whiz-primary/50 transition-all duration-300 group glowing-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            <div className="transition-transform group-hover:scale-110">{icon}</div>
        </CardHeader>
        <CardContent>
            <div className={`text-4xl font-bold ${className}`}>{value}</div>
        </CardContent>
    </Card>
);

const ReportTable = ({ reports, onEdit, onDelete }: { reports: ReportForm[], onEdit: (report: ReportForm) => void, onDelete: (reportId: string) => void }) => {
    const getSeverityColor = (severity: string) => {
        switch(severity) {
            case 'High': return 'bg-red-500/20 text-red-400 border-red-500/30';
            case 'Moderate': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
            case 'Low': return 'bg-green-500/20 text-green-400 border-green-500/30';
            default: return '';
        }
    };

    const getMisinfoColor = (status: string) => {
        switch(status) {
            case 'Yes': return 'bg-red-500/20 text-red-400 border-red-500/30';
            case 'No': return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'Unverified': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
            default: return '';
        }
    };

    return (
        <Table>
            <TableHeader>
                <TableRow className="border-whiz-secondary/30">
                    <TableHead className="text-whiz-light">Reporter</TableHead>
                    <TableHead className="text-whiz-light">Category</TableHead>
                    <TableHead className="text-whiz-light">Severity</TableHead>
                    <TableHead className="text-whiz-light">Misinformation</TableHead>
                    <TableHead className="text-whiz-light">Date</TableHead>
                    <TableHead className="text-right text-whiz-light">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {reports.length > 0 ? reports.map((r) => (
                    <TableRow key={r._id} className="hover:bg-whiz-dark/50 border-whiz-secondary/30">
                        <TableCell className="font-medium text-whiz-light">{r.reporterName}</TableCell>
                        <TableCell className="capitalize text-muted-foreground">{r.category}</TableCell>
                        <TableCell><Badge variant="outline" className={`capitalize ${getSeverityColor(r.severity)}`}>{r.severity}</Badge></TableCell>
                        <TableCell><Badge variant="outline" className={getMisinfoColor(r.misinformationDetected)}>{r.misinformationDetected}</Badge></TableCell>
                        <TableCell className="text-muted-foreground">{r.dateReported}</TableCell>
                        <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => onEdit(r)} className="text-whiz-primary hover:bg-whiz-primary/10"><Edit className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => onDelete(r._id)} className="text-red-500 hover:bg-red-500/10"><Trash2 className="h-4 w-4" /></Button>
                        </TableCell>
                    </TableRow>
                )) : (
                    <TableRow><TableCell colSpan={6} className="h-24 text-center text-muted-foreground">No reports found.</TableCell></TableRow>
                )}
            </TableBody>
        </Table>
    );
};

const AnalyticsContent = ({ reports }: { reports: ReportForm[] }) => {
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
    };

    const categoryData = {
        labels: ['Phishing', 'Fraud', 'Data Breach', 'Bullying', 'Fake News', 'Threats'],
        datasets: [{
            label: "Reports by Category",
            data: [
                reports.filter(r => r.category === 'Phishing').length,
                reports.filter(r => r.category === 'Financial Fraud').length,
                reports.filter(r => r.category === 'Data Breach').length,
                reports.filter(r => r.category === 'Cyberbullying').length,
                reports.filter(r => r.category === 'Fake News / Misinformation').length,
                reports.filter(r => r.category === 'Social Media Threats').length,
            ],
            backgroundColor: ['#2563eb', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#14b8a6'],
            borderColor: '#0a0f1f',
        }],
    };

    const severityData = {
        labels: ['Low', 'Moderate', 'High'],
        datasets: [{
            label: 'Reports by Severity',
            data: [
                reports.filter(r => r.severity === 'Low').length,
                reports.filter(r => r.severity === 'Moderate').length,
                reports.filter(r => r.severity === 'High').length,
            ],
            backgroundColor: ['#16a34a', '#facc15', '#dc2626'],
            borderColor: '#0a0f1f',
        }],
    };

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-whiz-dark/80 border-whiz-secondary/30"><CardHeader><CardTitle className="text-whiz-primary">Category Distribution</CardTitle></CardHeader><CardContent className="h-80"><Pie data={categoryData} options={chartOptions} /></CardContent></Card>
            <Card className="bg-whiz-dark/80 border-whiz-secondary/30"><CardHeader><CardTitle className="text-whiz-primary">Severity Distribution</CardTitle></CardHeader><CardContent className="h-80"><Pie data={severityData} options={chartOptions} /></CardContent></Card>
        </div>
    );
};

const ReportForm = ({ onSubmit, initialData, isEditMode = false, onClose }: {
    onSubmit: (data: ReportForm | Omit<ReportForm, '_id'>) => void;
    initialData?: ReportForm;
    isEditMode?: boolean;
    onClose?: () => void;
}) => {
    const [formData, setFormData] = useState(initialData || {
        reporterName: "", reporterEmail: "", platform: "", category: "", severity: "",
        location: "", sourceLink: "", dateReported: "", description: "", misinformationDetected: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const handleSelectChange = (name: keyof Omit<ReportForm, '_id'>, value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        if (!isEditMode) {
            setFormData({
                reporterName: "", reporterEmail: "", platform: "", category: "", severity: "",
                location: "", sourceLink: "", dateReported: "", description: "", misinformationDetected: ""
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 p-1 text-whiz-light">
            <div className="space-y-2">
                <Label htmlFor="reporterName">Reporter Name</Label>
                <Input id="reporterName" name="reporterName" value={formData.reporterName} onChange={handleChange} required className="bg-whiz-dark border-whiz-secondary/50" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="reporterEmail">Reporter Email</Label>
                <Input id="reporterEmail" name="reporterEmail" type="email" value={formData.reporterEmail} onChange={handleChange} required className="bg-whiz-dark border-whiz-secondary/50" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="location">Location / Region</Label>
                <Input id="location" name="location" value={formData.location} onChange={handleChange} className="bg-whiz-dark border-whiz-secondary/50" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="dateReported">Date Reported</Label>
                <Input id="dateReported" name="dateReported" type="date" value={formData.dateReported} onChange={handleChange} required className="bg-whiz-dark border-whiz-secondary/50" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select name="category" value={formData.category} onValueChange={(v) => handleSelectChange('category', v)} required>
                    <SelectTrigger className="bg-whiz-dark border-whiz-secondary/50"><SelectValue placeholder="Select Category" /></SelectTrigger>
                    <SelectContent className="bg-whiz-dark border-whiz-secondary/50 text-whiz-light">
                        <SelectItem value="Phishing">Phishing</SelectItem>
                        <SelectItem value="Financial Fraud">Financial Fraud</SelectItem>
                        <SelectItem value="Data Breach">Data Breach</SelectItem>
                        <SelectItem value="Cyberbullying">Cyberbullying</SelectItem>
                        <SelectItem value="Fake News / Misinformation">Fake News / Misinformation</SelectItem>
                        <SelectItem value="Social Media Threats">Social Media Threats</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <div className="space-y-2">
                <Label htmlFor="platform">Platform Involved</Label>
                <Select name="platform" value={formData.platform} onValueChange={(v) => handleSelectChange('platform', v)} required>
                    <SelectTrigger className="bg-whiz-dark border-whiz-secondary/50"><SelectValue placeholder="Select Platform" /></SelectTrigger>
                    <SelectContent className="bg-whiz-dark border-whiz-secondary/50 text-whiz-light">
                        <SelectItem value="Facebook">Facebook</SelectItem>
                        <SelectItem value="Twitter / X">Twitter / X</SelectItem>
                        <SelectItem value="Instagram">Instagram</SelectItem>
                        <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                        <SelectItem value="Telegram">Telegram</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="severity">Severity Level</Label>
                <Select name="severity" value={formData.severity} onValueChange={(v) => handleSelectChange('severity', v)} required>
                    <SelectTrigger className="bg-whiz-dark border-whiz-secondary/50"><SelectValue placeholder="Select Severity" /></SelectTrigger>
                    <SelectContent className="bg-whiz-dark border-whiz-secondary/50 text-whiz-light">
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Moderate">Moderate</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="misinformationDetected">Misinformation Detected?</Label>
                <Select name="misinformationDetected" value={formData.misinformationDetected} onValueChange={(v) => handleSelectChange('misinformationDetected', v)} required>
                    <SelectTrigger className="bg-whiz-dark border-whiz-secondary/50"><SelectValue placeholder="Select Status" /></SelectTrigger>
                    <SelectContent className="bg-whiz-dark border-whiz-secondary/50 text-whiz-light">
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                        <SelectItem value="Unverified">Unverified</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="md:col-span-2 space-y-2">
                 <Label htmlFor="sourceLink">Source Link (URL)</Label>
                <Input id="sourceLink" name="sourceLink" type="url" value={formData.sourceLink} onChange={handleChange} placeholder="http://example.com/source" className="bg-whiz-dark border-whiz-secondary/50" />
            </div>
             <div className="md:col-span-2 space-y-2">
                 <Label htmlFor="description">Incident Description</Label>
                <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required className="bg-whiz-dark border-whiz-secondary/50" />
            </div>

            <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                {isEditMode && <DialogClose asChild><Button type="button" variant="outline" onClick={onClose} className="border-whiz-secondary/50 text-whiz-light">Cancel</Button></DialogClose>}
                <Button type="submit" className="btn-cyber bg-whiz-primary text-whiz-dark">{isEditMode ? "Save Changes" : "Submit Report"}</Button>
            </div>
        </form>
    );
}

export default VolunteerDashboard;