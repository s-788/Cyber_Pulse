import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Report from "./models/Report.js";

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const incidentTypes = [
  "phishing",
  "identity-theft",
  "ransomware",
  "cyberbullying",
  "hacking",
  "online-fraud",
  "data-breach",
  "malware",
];

const statuses = ["Submitted", "In Review", "Resolved"];

const locations = [
  "Mumbai, Maharashtra",
  "Delhi",
  "Bangalore, Karnataka",
  "Hyderabad, Telangana",
  "Chennai, Tamil Nadu",
  "Kolkata, West Bengal",
  "Pune, Maharashtra",
  "Ahmedabad, Gujarat",
  "Jaipur, Rajasthan",
  "Lucknow, Uttar Pradesh",
  "Coimbatore, Tamil Nadu",
  "Kochi, Kerala",
  "Indore, Madhya Pradesh",
  "Chandigarh",
  "Bhopal, Madhya Pradesh",
];

const descriptions = [
  "Received suspicious email asking for bank credentials and personal information",
  "My social media account was hacked and unauthorized posts were made",
  "Fell victim to online shopping scam, paid but never received the product",
  "Experiencing continuous harassment and threats through social media platforms",
  "Computer infected with ransomware demanding payment in cryptocurrency",
  "Credit card details stolen and unauthorized transactions detected",
  "Personal data leaked in recent data breach incident",
  "Unknown person created fake profile using my photos and identity",
  "Received phishing SMS claiming to be from my bank",
  "Email account compromised, spam being sent to all contacts",
  "Cyberstalking and blackmail threats received via email",
  "UPI fraud - money debited without authorization",
  "Received threatening messages demanding money",
  "Investment scam promising unrealistic returns",
  "Job scam asking for upfront payment for fake job offer",
  "Romance scam on dating app, person asking for money",
  "Fake lottery winner notification demanding processing fee",
  "Cryptocurrency investment scam",
  "Online gaming account hacked and items stolen",
  "Business email compromise leading to financial loss",
  "Sextortion attempt with fake video threat",
  "SIM swap fraud attempted on mobile number",
  "Online auction fraud - paid but item not delivered",
  "Tech support scam claiming computer has virus",
  "Fake charity scam collecting donations fraudulently",
  "Domain name hijacking of business website",
  "Cloud storage account unauthorized access",
  "Mobile banking app unauthorized access attempt",
  "Social engineering attack targeting company data",
  "Fake government website collecting personal data",
  "Messenger account hacked sending malicious links",
  "Online education platform credential theft",
  "Healthcare data breach exposing patient information",
  "Corporate espionage through malware infection",
];

// Generate random date within last 6 months
function randomDate() {
  const end = new Date();
  const start = new Date();
  start.setMonth(start.getMonth() - 6);
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Generate 34 dummy reports
async function seedReports() {
  try {
    // Clear existing reports (optional - comment out if you want to keep existing ones)
    await Report.deleteMany({});
    console.log("🗑️ Cleared existing reports");

    const reports = [];

    for (let i = 0; i < 34; i++) {
      const report = {
        incidentType: incidentTypes[Math.floor(Math.random() * incidentTypes.length)],
        description: descriptions[i % descriptions.length],
        dateTime: randomDate(),
        location: locations[Math.floor(Math.random() * locations.length)],
        anonymous: Math.random() > 0.7, // 30% anonymous
        status: statuses[Math.floor(Math.random() * statuses.length)],
        evidenceFiles: [],
      };

      reports.push(report);
    }

    // Insert all reports
    const result = await Report.insertMany(reports);
    console.log(`✅ Successfully created ${result.length} dummy reports`);

    // Show breakdown by incident type
    const breakdown = {};
    result.forEach((r) => {
      breakdown[r.incidentType] = (breakdown[r.incidentType] || 0) + 1;
    });

    console.log("\n📊 Reports by Incident Type:");
    Object.entries(breakdown).forEach(([type, count]) => {
      console.log(`   ${type}: ${count}`);
    });

    // Show breakdown by status
    const statusBreakdown = {};
    result.forEach((r) => {
      statusBreakdown[r.status] = (statusBreakdown[r.status] || 0) + 1;
    });

    console.log("\n📊 Reports by Status:");
    Object.entries(statusBreakdown).forEach(([status, count]) => {
      console.log(`   ${status}: ${count}`);
    });

    mongoose.connection.close();
    console.log("\n✅ Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding reports:", error);
    mongoose.connection.close();
    process.exit(1);
  }
}

seedReports();
