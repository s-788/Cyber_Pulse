import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Edit, Trash2, FileText, CheckCircle, AlertCircle, BarChart3, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const API_BASE = "http://localhost:5000/api/verifications";

export default function CheckMisinformation() {
  const [tab, setTab] = useState("text");
  const [textInput, setTextInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [result, setResult] = useState(null);
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [editInput, setEditInput] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCheckDialogOpen, setIsCheckDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_BASE}/history`);
      const data = await res.json();
      if (data.success) setRecords(data.data);
    } catch (err) {
      console.error("Error fetching:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // ---------------------------------------
  // VERIFY (POST)
  // ---------------------------------------
  const handleVerify = async (inputType, content) => {
    if (!content || content.trim() === "") {
      alert("Please enter content to verify");
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputType, content }),
      });

      const data = await res.json();
      if (data.success) {
        setResult(data.data);
        fetchHistory();
        // Clear inputs after successful verification
        if (inputType === "text") setTextInput("");
        if (inputType === "url") setUrlInput("");
      } else {
        alert(data.message || "Verification failed");
      }
    } catch (err) {
      console.error("Error verifying:", err);
      alert("Error during verification. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------------------------------
  // VERIFY IMAGE (POST with FormData)
  // ---------------------------------------
  const handleImageVerify = async (file) => {
    if (!file) {
      alert("Please select an image file");
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      alert("Please upload a JPG, JPEG, or PNG image file.");
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    console.log("📤 Uploading image:", file.name, "Type:", file.type, "Size:", (file.size / 1024).toFixed(2), "KB");

    setIsLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      console.log("📡 Sending request to:", `${API_BASE}/image`);

      const res = await fetch(`${API_BASE}/image`, {
        method: "POST",
        body: formData,
      });

      console.log("📥 Response status:", res.status);

      const data = await res.json();
      console.log("📊 Response data:", data);

      if (data.success) {
        console.log("✅ Image verification successful");
        setResult(data.data);
        fetchHistory();
        setImageFile(null); // Reset file input
        // Reset the file input element
        const fileInput = document.getElementById("image-upload");
        if (fileInput instanceof HTMLInputElement) {
        fileInput.value = "";
      }


      } else {
        console.error("❌ Verification failed:", data.message);
        alert(data.message || "Image verification failed. Please try again.");
      }
    } catch (err) {
      console.error("❌ Error verifying image:", err);
      alert(`Error verifying image: ${err.message}. Please check your internet connection and try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------------------------------
  // UPDATE
  // ---------------------------------------
  const openEditDialog = (record) => {
    setEditingRecord(record);
    setEditInput(record.content);
    setIsEditDialogOpen(true);
  };

  const handleEdit = async () => {
    if (!editingRecord || !editInput.trim()) return;

    try {
      const res = await fetch(`${API_BASE}/${editingRecord._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editInput }),
      });

      const data = await res.json();
      if (data.success) {
        setIsEditDialogOpen(false);
        setEditingRecord(null);
        setEditInput("");
        fetchHistory();
      }
    } catch (err) {
      console.error("Error editing:", err);
    }
  };

  // ---------------------------------------
  // DELETE
  // ---------------------------------------
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record?")) return;

    await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    fetchHistory();
  };

  // ---------------------------------------
  // SEARCH
  // ---------------------------------------
  const filteredRecords = records.filter(
    (r) =>
      r.content?.toLowerCase().includes(search.toLowerCase()) ||
      String(r.status).toLowerCase().includes(search.toLowerCase())
  );

  // ---------------------------------------
  // CHARTS FIXED FOR NEW SCHEMA
  // ---------------------------------------
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

  const statusCount = {
    true: records.filter((r) => r.status === true).length,
    false: records.filter((r) => r.status === false).length,
  };

  const barData = {
    labels: ["True", "False"],
    datasets: [
      {
        label: "Count",
        data: [statusCount.true, statusCount.false],
        backgroundColor: ["#22c55e", "#ef4444"],
      },
    ],
  };

  const lineData = {
    labels: records.map((r) =>
      new Date(r.createdAt).toLocaleDateString("en-GB")
    ),
    datasets: [
      {
        label: "Credibility Score",
        data: records.map((r) => r.credibility),
        borderColor: "#3b82f6",
        backgroundColor: isDark ? "#bfdbfe" : "#dbeafe",
        tension: 0.3,
      },
    ],
  };

  // ======================================================================
  // UI START
  // ======================================================================
  return (
    <div className="min-h-screen py-6 sm:py-8 md:py-12 px-3 sm:px-4 bg-whiz-dark text-whiz-light">
      <div className="container mx-auto max-w-7xl">
        <header className="mb-6 sm:mb-8 md:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Misinformation Verification</h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground mt-1">
            Verify text, URLs, and images for misinformation using AI-powered analysis.
          </p>
        </header>

        <Tabs defaultValue="dashboard">
          <TabsList className="mb-4 sm:mb-6 bg-whiz-dark/80 border-whiz-secondary/30 w-full sm:w-auto grid grid-cols-1 sm:grid-cols-3 h-auto sm:h-10 gap-1 sm:gap-0">
            <TabsTrigger value="dashboard" className="text-whiz-light text-xs sm:text-sm">Dashboard</TabsTrigger>
            <TabsTrigger value="management" className="text-whiz-light text-xs sm:text-sm">Verification</TabsTrigger>
            <TabsTrigger value="check" className="text-whiz-light text-xs sm:text-sm">Check</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <StatCard icon={<FileText className="text-whiz-primary" />} title="Total Verifications" value={records.length} />
              <StatCard icon={<CheckCircle className="text-green-400" />} title="Credible Content" value={statusCount.true} className="text-green-400" />
              <StatCard icon={<AlertCircle className="text-red-500" />} title="Misinformation" value={statusCount.false} className="text-red-500" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              <Card className="bg-whiz-dark/80 border-whiz-secondary/30">
                <CardHeader>
                  <CardTitle className="text-whiz-primary text-base sm:text-lg md:text-xl">Status Distribution</CardTitle>
                </CardHeader>
                <CardContent className="h-64 sm:h-72 md:h-80">
                  <Bar data={barData} options={chartOptions} />
                </CardContent>
              </Card>
              <Card className="bg-whiz-dark/80 border-whiz-secondary/30">
                <CardHeader>
                  <CardTitle className="text-whiz-primary text-base sm:text-lg md:text-xl">Credibility Over Time</CardTitle>
                </CardHeader>
                <CardContent className="h-64 sm:h-72 md:h-80">
                  <Line data={lineData} options={chartOptions} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="management">
            <Card className="bg-whiz-dark/80 border-whiz-secondary/30">
              <CardHeader>
                <CardTitle className="text-whiz-primary text-base sm:text-lg md:text-xl">Verification Records</CardTitle>
                <CardDescription className="text-muted-foreground text-xs sm:text-sm">View, search, edit, and delete verification history.</CardDescription>
                <div className="relative mt-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search verifications..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 sm:pl-10 bg-whiz-dark border-whiz-secondary/50 text-whiz-light text-xs sm:text-sm h-9 sm:h-10"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto -mx-6 sm:mx-0">
                <Table className="min-w-[600px]">
                  <TableHeader>
                    <TableRow className="border-whiz-secondary/30">
                      <TableHead className="text-whiz-light text-xs sm:text-sm">Type</TableHead>
                      <TableHead className="text-whiz-light text-xs sm:text-sm">Content</TableHead>
                      <TableHead className="text-whiz-light text-xs sm:text-sm">Status</TableHead>
                      <TableHead className="text-whiz-light text-xs sm:text-sm">Credibility</TableHead>
                      <TableHead className="text-right text-whiz-light text-xs sm:text-sm">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.length > 0 ? filteredRecords.map((r) => (
                      <TableRow key={r._id} className="hover:bg-whiz-dark/50 border-whiz-secondary/30">
                        <TableCell className="font-medium text-whiz-light capitalize text-xs sm:text-sm">{r.inputType}</TableCell>
                        <TableCell className="text-muted-foreground truncate max-w-[200px] sm:max-w-[300px] text-xs sm:text-sm">{r.content}</TableCell>
                        <TableCell>
                          <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-semibold ${r.status ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {r.status ? "TRUE" : "FALSE"}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs sm:text-sm">{(r.credibility * 100).toFixed(1)}%</TableCell>
                        <TableCell className="text-right">
                          <Button size="icon" variant="ghost" onClick={() => openEditDialog(r)} className="text-whiz-primary hover:bg-whiz-primary/10 h-7 w-7 sm:h-8 sm:w-8">
                            <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => handleDelete(r._id)} className="text-red-500 hover:bg-red-500/10 h-7 w-7 sm:h-8 sm:w-8">
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center h-24 text-muted-foreground text-xs sm:text-sm">No records found.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="check">
            <Card className="bg-whiz-dark/80 border-whiz-secondary/30">
              <CardHeader>
                <CardTitle className="text-whiz-primary text-base sm:text-lg md:text-xl">Verify Content</CardTitle>
                <CardDescription className="text-muted-foreground text-xs sm:text-sm">
                  Submit text, URLs, or images to verify for misinformation using AI-powered analysis.
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-2 sm:mt-4">
          <Tabs defaultValue="text" onValueChange={setTab}>
            <TabsList className="bg-whiz-dark/50 border-whiz-secondary/30 w-full sm:w-auto grid grid-cols-3 sm:flex">
              <TabsTrigger value="text" className="text-whiz-light text-xs sm:text-sm">Text</TabsTrigger>
              <TabsTrigger value="url" className="text-whiz-light text-xs sm:text-sm">URL</TabsTrigger>
              <TabsTrigger value="image" className="text-whiz-light text-xs sm:text-sm">Image</TabsTrigger>
            </TabsList>

            {/* TEXT VERIFY */}
            <TabsContent value="text">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleVerify("text", textInput);
                }}
                className="space-y-3"
              >
                <Textarea
                  placeholder="Enter text to verify..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  disabled={isLoading}
                  rows={4}
                  className="bg-whiz-dark border-whiz-secondary/50 text-whiz-light text-xs sm:text-sm"
                />
                <Button type="submit" disabled={isLoading || !textInput.trim()} className="btn-cyber bg-whiz-primary text-whiz-dark w-full sm:w-auto text-xs sm:text-sm h-9 sm:h-10">
                  {isLoading ? "Analyzing..." : "Verify Text"}
                </Button>
              </form>
            </TabsContent>

            {/* URL VERIFY */}
            <TabsContent value="url">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleVerify("url", urlInput);
                }}
                className="space-y-3"
              >
                <Input
                  placeholder="Enter URL to verify..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  disabled={isLoading}
                  className="bg-whiz-dark border-whiz-secondary/50 text-whiz-light text-xs sm:text-sm h-9 sm:h-10"
                />
                <Button type="submit" disabled={isLoading || !urlInput.trim()} className="btn-cyber bg-whiz-primary text-whiz-dark w-full sm:w-auto text-xs sm:text-sm h-9 sm:h-10">
                  {isLoading ? "Analyzing..." : "Verify URL"}
                </Button>
              </form>
            </TabsContent>

            {/* IMAGE VERIFY */}
            <TabsContent value="image">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleImageVerify(imageFile);
                }}
                className="space-y-3"
              >
                <div className="space-y-2">
                  <Input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    disabled={isLoading}
                    id="image-upload"
                    className="bg-whiz-dark border-whiz-secondary/50 text-whiz-light text-xs sm:text-sm h-9 sm:h-10"
                  />
                  <p className="text-[10px] sm:text-xs text-muted-foreground">
                    Accepted formats: JPG, JPEG, PNG (Max 10MB)
                  </p>
                </div>

                {imageFile && !isLoading && (
                  <div className="p-3 bg-whiz-primary/10 border border-whiz-primary/30 rounded-md">
                    <p className="text-sm font-medium text-whiz-light">
                      📎 Selected: {imageFile.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Size: {(imageFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                )}

                {isLoading && (
                  <div className="p-4 bg-whiz-primary/10 border border-whiz-primary/30 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-whiz-primary"></div>
                      <div>
                        <p className="text-sm font-medium text-whiz-light">
                          Analyzing image with AI...
                        </p>
                        <p className="text-xs text-muted-foreground">
                          This may take 10-30 seconds depending on image complexity
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <Button type="submit" disabled={!imageFile || isLoading} className="w-full btn-cyber bg-whiz-primary text-whiz-dark text-xs sm:text-sm h-9 sm:h-10">
                  {isLoading ? "Analyzing..." : "Verify Image"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {result && (
            <div className="mt-4 p-4 border border-whiz-secondary/50 rounded bg-whiz-dark/50 space-y-3">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg text-whiz-light">
                  Status:
                </h3>
                <span className={`font-bold text-lg ${result.status ? 'text-green-400' : 'text-red-400'}`}>
                  {result.status ? "TRUE (Credible)" : "FALSE (Misinformation)"}
                </span>
              </div>

              <div className="space-y-1">
                <p className="font-medium text-whiz-light">Credibility Score:</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-whiz-secondary/30 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${result.credibility >= 0.7 ? 'bg-green-500' : result.credibility >= 0.4 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${result.credibility * 100}%` }}
                    ></div>
                  </div>
                  <span className="font-semibold text-whiz-light">{(result.credibility * 100).toFixed(1)}%</span>
                </div>
              </div>

              <div>
                <p className="font-medium text-whiz-light">Analysis:</p>
                <p className="text-muted-foreground">{result.message}</p>
              </div>

              {result.explanation && (
                <div>
                  <p className="font-medium text-whiz-light">Detailed Explanation:</p>
                  <p className="text-muted-foreground text-sm">{result.explanation}</p>
                </div>
              )}

              {result.confidenceScore && (
                <p className="text-sm text-muted-foreground">
                  AI Confidence: <b className="text-whiz-light">{(result.confidenceScore * 100).toFixed(1)}%</b>
                </p>
              )}

              {result.sources?.length > 0 && (
                <div>
                  <p className="font-medium text-whiz-light">Sources:</p>
                  <ul className="list-disc ml-6 mt-1 text-sm">
                    {result.sources.map((s, i) => (
                      <li key={i} className="text-whiz-primary">{s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-whiz-dark border-whiz-secondary/30 text-whiz-light">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-whiz-primary">
                <Edit className="w-5 h-5" />
                Edit Verification Record
              </DialogTitle>
            </DialogHeader>

            {editingRecord && (
              <div className="space-y-4 mt-4">
                <div>
                  <Label className="text-whiz-light">Type</Label>
                  <Input value={editingRecord.inputType} disabled className="bg-whiz-dark/50 border-whiz-secondary/30 text-muted-foreground" />
                </div>

                <div>
                  <Label className="text-whiz-light">Content *</Label>
                  <Textarea
                    value={editInput}
                    onChange={(e) => setEditInput(e.target.value)}
                    placeholder="Enter content..."
                    rows={4}
                    className="bg-whiz-dark border-whiz-secondary/50 text-whiz-light"
                  />
                </div>

                <div>
                  <Label className="text-whiz-light">Status</Label>
                  <Input value={editingRecord.status ? "TRUE" : "FALSE"} disabled className="bg-whiz-dark/50 border-whiz-secondary/30 text-muted-foreground" />
                </div>

                <div>
                  <Label className="text-whiz-light">Credibility</Label>
                  <Input value={editingRecord.credibility} disabled className="bg-whiz-dark/50 border-whiz-secondary/30 text-muted-foreground" />
                </div>

                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditDialogOpen(false);
                      setEditingRecord(null);
                      setEditInput("");
                    }}
                    className="border-whiz-secondary/50 text-whiz-light"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleEdit} className="btn-cyber bg-whiz-primary text-whiz-dark">
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

const StatCard = ({ icon, title, value, className = "" }: { icon: React.ReactNode, title: string, value: string | number, className?: string }) => (
  <Card className="bg-whiz-dark/80 backdrop-blur-sm border-whiz-secondary/30 hover:border-whiz-primary/50 transition-all duration-300 group glowing-border">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <div className="transition-transform group-hover:scale-110">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className={`text-2xl sm:text-3xl md:text-4xl font-bold ${className}`}>{value}</div>
    </CardContent>
  </Card>
);
