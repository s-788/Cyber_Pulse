import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  FileText,
  PieChart as PieChartIcon,
  BarChart3,
  Edit,
  Trash2,
  Plus,
  Search,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import ReportCrimeForm from "@/components/ReportCrimeForm";
import { Input } from "@/components/ui/input";

const API_URL = `${import.meta.env.VITE_API_URL}/api/reports`;


const ReportCrime = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [isLoading, setIsLoading] = useState(false);

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(API_URL);
      setReports(data);
    } catch (error) {
      console.error("Error fetching reports:", error);
      setMessageType("error");
      setMessage("❌ Failed to fetch reports");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleSubmit = async (formData: any) => {
    try {
      setIsLoading(true);
      const response = await axios.post(API_URL, formData);
      setMessageType("success");
      setMessage("✅ Report submitted successfully!");
      setIsSubmitDialogOpen(false);
      fetchReports();
    } catch (error) {
      console.error("Error submitting report:", error);
      setMessageType("error");
      setMessage("❌ Failed to submit report");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (formData: any) => {
    try {
      setIsLoading(true);
      await axios.put(`${API_URL}/${formData._id}`, formData);
      setMessageType("success");
      setMessage("✏️ Report updated successfully!");
      setIsEditDialogOpen(false);
      setEditingReport(null);
      fetchReports();
    } catch (error) {
      console.error("Error updating report:", error);
      setMessageType("error");
      setMessage("❌ Failed to update report");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (reportId: string) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;
    try {
      setIsLoading(true);
      await axios.delete(`${API_URL}/${reportId}`);
      setMessageType("success");
      setMessage("🗑️ Report deleted successfully!");
      fetchReports();
    } catch (error) {
      console.error("Error deleting report:", error);
      setMessageType("error");
      setMessage("❌ Failed to delete report");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = (formData: any) => {
    localStorage.setItem("draftReport", JSON.stringify(formData));
    setMessageType("success");
    setMessage("💾 Draft saved successfully!");
  };

  const openEditDialog = (report: any) => {
    setEditingReport(report);
    setIsEditDialogOpen(true);
  }

  const filteredReports = reports.filter((r) => {
    const combined = `${r.incidentType} ${r.description} ${r.location}`.toLowerCase();
    return combined.includes(searchTerm.toLowerCase());
  });

  const isDark = document.documentElement.classList.contains('dark');
  const textColor = isDark ? '#f0f2f5' : '#1f2937';
  const gridColor = isDark ? 'rgba(0, 194, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';
  const COLORS = ["#2563eb", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#14b8a6"];

  const categoryData = useMemo(() => {
    const categoryCounts: Record<string, number> = {};
    reports.forEach((report) => {
      const type = report.incidentType || "Unknown";
      categoryCounts[type] = (categoryCounts[type] || 0) + 1;
    });

    return Object.entries(categoryCounts).map(([category, reports], index) => ({
      category: category.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      reports,
      fill: COLORS[index % COLORS.length],
    }));
  }, [reports]);

  return (
    <div className="min-h-screen py-6 sm:py-8 md:py-12 px-3 sm:px-4 md:px-6 bg-whiz-dark text-whiz-light">
      <div className="container mx-auto max-w-7xl">
        {message && (
          <div
            className={`mb-4 p-3 sm:p-4 rounded text-sm sm:text-base ${
              messageType === "success"
                ? "bg-green-900/50 text-green-300 border border-green-700"
                : "bg-red-900/50 text-red-300 border border-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <header className="mb-6 sm:mb-8 md:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Cyber Crime Reporting</h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground mt-1 sm:mt-2">
            File a detailed complaint with supporting evidence. All reports are handled confidentially.
          </p>
        </header>

        <Tabs defaultValue="dashboard">
          <TabsList className="mb-6 bg-whiz-dark/80 border-whiz-secondary/30">
            <TabsTrigger value="dashboard" className="text-whiz-light">Dashboard</TabsTrigger>
            <TabsTrigger value="management" className="text-whiz-light">Report Management</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <StatCard icon={<FileText className="text-whiz-primary" />} title="Total Reports" value={reports.length} />
              <StatCard icon={<AlertCircle className="text-amber-500" />} title="Pending Reports" value={reports.length} className="text-amber-500" />
              <StatCard icon={<CheckCircle className="text-green-400" />} title="Categories Tracked" value={categoryData.length} className="text-green-400" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              <Card className="bg-whiz-dark/80 border-whiz-secondary/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-whiz-primary">
                    <PieChartIcon className="w-5 h-5" /> Category Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {reports.length === 0 ? (
                    <p className="text-center text-muted-foreground py-16">No reports yet.</p>
                  ) : (
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ category, percent }) => `${category}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="reports"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill || COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: isDark ? '#0a0f1f' : '#ffffff',
                            border: `1px solid ${isDark ? '#2563eb' : '#e5e7eb'}`,
                            color: textColor
                          }}
                        />
                        <Legend wrapperStyle={{ color: textColor }} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
              <Card className="bg-whiz-dark/80 border-whiz-secondary/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-whiz-primary">
                    <BarChart3 className="w-5 h-5" /> Reports per Category
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {reports.length === 0 ? (
                    <p className="text-center text-muted-foreground py-16">No reports yet.</p>
                  ) : (
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={categoryData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                        <XAxis dataKey="category" stroke={textColor} tick={{ fill: textColor, fontSize: 12 }} />
                        <YAxis stroke={textColor} tick={{ fill: textColor, fontSize: 12 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: isDark ? '#0a0f1f' : '#ffffff',
                            border: `1px solid ${isDark ? '#2563eb' : '#e5e7eb'}`,
                            color: textColor
                          }}
                        />
                        <Legend wrapperStyle={{ color: textColor }} />
                        <Bar dataKey="reports">
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill || COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="management">
            <Card className="bg-whiz-dark/80 border-whiz-secondary/30">
              <CardHeader>
                <CardTitle className="text-whiz-primary text-lg sm:text-xl">Report Records</CardTitle>
                <CardDescription className="text-muted-foreground text-sm sm:text-base">Search, view, edit, and delete your submitted reports.</CardDescription>
                <div className="relative mt-3 sm:mt-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 sm:pl-10 bg-whiz-dark border-whiz-secondary/50 text-whiz-light text-sm sm:text-base"
                  />
                </div>
              </CardHeader>
              <CardContent>
                 <div className="overflow-x-auto -mx-4 sm:-mx-6 px-4 sm:px-0">
                    <table className="min-w-[640px] w-full border-collapse rounded-lg">
                      <thead className="bg-whiz-dark/50">
                        <tr>
                          <th className="p-2 sm:p-3 text-left border-b border-whiz-secondary/30 text-xs sm:text-sm">#</th>
                          <th className="p-2 sm:p-3 text-left border-b border-whiz-secondary/30 text-xs sm:text-sm">Incident Type</th>
                          <th className="p-2 sm:p-3 text-left border-b border-whiz-secondary/30 text-xs sm:text-sm">Description</th>
                          <th className="p-2 sm:p-3 text-left border-b border-whiz-secondary/30 text-xs sm:text-sm">Date</th>
                          <th className="p-2 sm:p-3 text-left border-b border-whiz-secondary/30 text-xs sm:text-sm">Location</th>
                          <th className="p-2 sm:p-3 text-center border-b border-whiz-secondary/30 text-xs sm:text-sm">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredReports.length > 0 ? filteredReports.map((r, i) => (
                          <tr key={r._id} className="border-t border-whiz-secondary/30 hover:bg-whiz-dark/50">
                            <td className="p-2 sm:p-3 text-xs sm:text-sm">{i + 1}</td>
                            <td className="p-2 sm:p-3 capitalize text-xs sm:text-sm">{r.incidentType?.replace(/-/g, ' ')}</td>
                            <td className="p-2 sm:p-3 truncate max-w-[150px] sm:max-w-[200px] text-xs sm:text-sm">{r.description}</td>
                            <td className="p-2 sm:p-3 text-xs sm:text-sm whitespace-nowrap">{r.dateTime ? new Date(r.dateTime).toLocaleDateString() : "-"}</td>
                            <td className="p-2 sm:p-3 text-xs sm:text-sm">{r.location || "-"}</td>
                            <td className="p-2 sm:p-3 text-center">
                              <div className="flex gap-1 sm:gap-2 justify-center">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => openEditDialog(r)}
                                  className="border-whiz-primary text-whiz-primary hover:bg-whiz-primary/10 h-7 w-7 sm:h-8 sm:w-8 p-0"
                                  disabled={isLoading}
                                >
                                  <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDelete(r._id)}
                                  className="bg-red-500/20 text-red-400 hover:bg-red-500/30 h-7 w-7 sm:h-8 sm:w-8 p-0"
                                  disabled={isLoading}
                                >
                                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan={6} className="text-center p-6 sm:p-8 text-muted-foreground text-sm sm:text-base">
                              {isLoading ? "Loading reports..." : "No reports found."}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Floating Action Button */}
        <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
            <DialogTrigger asChild>
                <button
                className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 bg-whiz-primary hover:bg-whiz-primary/90 text-whiz-dark rounded-full p-3 sm:p-4 shadow-lg hover:shadow-xl transition-all duration-300 z-40 group"
                aria-label="Submit New Report"
                >
                <Plus className="h-5 w-5 sm:h-6 sm:w-6 group-hover:rotate-90 transition-transform duration-300" />
                </button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] sm:max-w-[85vw] md:max-w-4xl max-h-[90vh] overflow-y-auto bg-whiz-dark border-whiz-secondary/30 text-whiz-light mx-2">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-whiz-primary">
                        <FileText className="h-6 w-6" />
                        Submit a New Report
                    </DialogTitle>
                </DialogHeader>
                <ReportCrimeForm onSubmit={handleSubmit} onSaveDraft={handleSaveDraft} />
            </DialogContent>
        </Dialog>

        {/* --- Edit Dialog --- */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-whiz-dark border-whiz-secondary/50 text-whiz-light">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-whiz-primary">
                <Edit className="h-5 w-5" />
                Edit Report
              </DialogTitle>
            </DialogHeader>
            <ReportCrimeForm onSubmit={handleUpdate} onSaveDraft={handleSaveDraft} initialData={editingReport} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

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

export default ReportCrime;
