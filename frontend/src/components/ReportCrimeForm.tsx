import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface ReportCrimeFormProps {
  onSubmit: (formData: any) => void;
  onSaveDraft: (formData: any) => void;
  initialData?: any;
}

const ReportCrimeForm = ({ onSubmit, onSaveDraft, initialData }: ReportCrimeFormProps) => {
  const [formData, setFormData] = useState(initialData || {
    incidentType: "",
    description: "",
    dateTime: "",
    location: "",
    anonymous: false,
  });

  const [errors, setErrors] = useState<any>({});

  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.incidentType)
      newErrors.incidentType = "Incident type is required.";
    if (!formData.description || formData.description.trim().length < 15)
      newErrors.description =
        "Description must be at least 15 characters long.";
    if (!formData.dateTime)
      newErrors.dateTime = "Date and time are required.";
    else if (new Date(formData.dateTime) > new Date())
      newErrors.dateTime = "Date/time cannot be in the future.";
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-4">
      <div className="space-y-2">
        <Label className="text-whiz-light">Incident Type *</Label>
        <Select
          value={formData.incidentType}
          onValueChange={(value) =>
            setFormData({ ...formData, incidentType: value })
          }
        >
          <SelectTrigger
            className={`${errors.incidentType ? "border-red-500" : "border-whiz-secondary/50"} bg-whiz-dark text-whiz-light`}
          >
            <SelectValue placeholder="Select incident type" />
          </SelectTrigger>
          <SelectContent className="bg-whiz-dark border-whiz-secondary/50 text-whiz-light">
            <SelectItem value="phishing">Phishing</SelectItem>
            <SelectItem value="identity-theft">Identity Theft</SelectItem>
            <SelectItem value="cyberbullying">Cyberbullying</SelectItem>
            <SelectItem value="financial-fraud">Financial Fraud</SelectItem>
            <SelectItem value="data-breach">Data Breach</SelectItem>
            <SelectItem value="ransomware">Ransomware</SelectItem>
          </SelectContent>
        </Select>
        {errors.incidentType && (
          <p className="text-red-400 text-sm">{errors.incidentType}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-whiz-light">Description *</Label>
        <Textarea
          placeholder="Describe the incident..."
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className={`${errors.description ? "border-red-500" : "border-whiz-secondary/50"} bg-whiz-dark text-whiz-light`}
          rows={5}
        />
        {errors.description && (
          <p className="text-red-400 text-sm">{errors.description}</p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-whiz-light">Date & Time *</Label>
          <Input
            type="datetime-local"
            value={formData.dateTime}
            onChange={(e) =>
              setFormData({ ...formData, dateTime: e.target.value })
            }
            className={`${errors.dateTime ? "border-red-500" : "border-whiz-secondary/50"} bg-whiz-dark text-whiz-light`}
          />
          {errors.dateTime && (
            <p className="text-red-400 text-sm">{errors.dateTime}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label className="text-whiz-light">Location</Label>
          <Input
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            className="bg-whiz-dark border-whiz-secondary/50 text-whiz-light"
          />
        </div>
      </div>

      <div className="flex items-start space-x-3 bg-whiz-dark/50 p-4 rounded-lg border border-whiz-secondary/30">
        <Checkbox
          checked={formData.anonymous}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, anonymous: checked as boolean })
          }
          className="border-whiz-secondary/50"
        />
        <div>
          <Label className="font-medium text-whiz-light">Report Anonymously</Label>
          <p className="text-sm text-muted-foreground">
            Your identity will be protected.
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" size="lg" className="flex-1 btn-cyber bg-whiz-primary text-whiz-dark">
          Submit Report
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => onSaveDraft(formData)}
          className="border-whiz-primary text-whiz-primary hover:bg-whiz-primary/10 hover:text-whiz-primary"
        >
          Save Draft
        </Button>
      </div>
    </form>
  )
}

export default ReportCrimeForm;
