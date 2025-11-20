import express from "express";
import Verification from "../models/Verification.js";
import Groq from "groq-sdk";
import multer from "multer";
import fs from "fs";
import path from "path";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "./uploads/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    console.log("File received:", file.originalname, "Type:", file.mimetype);
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png';

    if (extname && mimetype) {
      console.log("✅ File accepted");
      cb(null, true);
    } else {
      console.log("❌ File rejected - Only JPG, JPEG, and PNG are allowed");
      cb(new Error("Only JPG, JPEG, and PNG image files are allowed"));
    }
  },
});

// ----------------------
// Groq client setup
// ----------------------
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,  // Make sure your .env has GROQ_API_KEY
});

// ----------------------
// Helper: analyze input using Groq AI
// ----------------------
async function analyzeWithGroq(inputType, content) {
  const messages = [
    { role: "system", content: "You are a fact-checking assistant." },
    {
      role: "user",
      content: `
Input type: ${inputType}
Content: "${content}"

Return a JSON object ONLY with the following fields:
{
  "status": true/false,            // true = credible, false = misinformation
  "credibility": 0.0-1.0,          // numeric credibility score
  "message": "short explanation",
  "explanation": "detailed reasoning",
  "sources": ["list of references"],
  "confidenceScore": 0.0-1.0       // optional AI confidence
}

Do not add extra text outside JSON.
`
    }
  ];

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages,
    temperature: 0,
  });

  const outputText = response.choices[0].message.content;
  try {
    const parsed = JSON.parse(outputText);
    return parsed;
  } catch (err) {
    console.error("Failed to parse Groq output:", outputText, err);
    // fallback if parsing fails
    return {
      status: false,
      credibility: 0.5,
      message: "Manual review required.",
      explanation: "",
      sources: [],
      confidenceScore: null,
    };
  }
}

// ----------------------
// Helper: analyze image using Groq Vision AI
// ----------------------
async function analyzeImageWithGroq(imageBase64, imageName) {
  console.log("🔍 Starting image analysis with Groq Vision AI...");

  try {
    const messages = [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `You are an expert image fact-checker. Analyze this image for misinformation, fake news, or manipulated content.

Check for:
1. Signs of image manipulation or photo editing
2. Misleading captions or text overlays
3. Out-of-context usage
4. Deep fakes or AI-generated content
5. Any false claims visible in the image

Return ONLY a valid JSON object with these exact fields:
{
  "status": true,
  "credibility": 0.75,
  "message": "Brief summary of your findings",
  "explanation": "Detailed analysis explaining what you found",
  "sources": ["List any relevant sources"],
  "confidenceScore": 0.8,
  "imageContent": "Description of what the image shows"
}

IMPORTANT: Return ONLY valid JSON, no extra text.`
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${imageBase64}`
            }
          }
        ]
      }
    ];

    console.log("📤 Sending request to Groq Vision API...");

    const response = await groq.chat.completions.create({
      model: "llama-3.2-90b-vision-preview",
      messages,
      temperature: 0.3,
      max_tokens: 2048,
    });

    console.log("📥 Received response from Groq");

    const outputText = response.choices[0].message.content;
    console.log("Raw response:", outputText);

    // Try to parse JSON
    let parsed;
    try {
      // Remove markdown code blocks if present
      let cleanedText = outputText.trim();
      if (cleanedText.startsWith("```json")) {
        cleanedText = cleanedText.replace(/```json\n?/g, "").replace(/```\n?/g, "");
      } else if (cleanedText.startsWith("```")) {
        cleanedText = cleanedText.replace(/```\n?/g, "");
      }

      parsed = JSON.parse(cleanedText);
      console.log("✅ Successfully parsed AI response");
    } catch (parseErr) {
      console.error("❌ Failed to parse JSON, using fallback:", parseErr);
      // Extract key information manually if JSON parsing fails
      parsed = {
        status: !outputText.toLowerCase().includes("fake") && !outputText.toLowerCase().includes("manipulated"),
        credibility: 0.6,
        message: outputText.substring(0, 200),
        explanation: outputText,
        sources: [],
        confidenceScore: 0.5,
        imageContent: "Image analysis completed"
      };
    }

    return parsed;
  } catch (err) {
    console.error("❌ Groq Vision API error:", err.message);
    console.error("Full error:", err);

    // Return a more helpful fallback
    return {
      status: false,
      credibility: 0.5,
      message: "AI analysis encountered an issue. The image has been received but requires manual review.",
      explanation: `Image "${imageName}" was uploaded successfully. However, the automated analysis could not be completed. Common reasons: API limits, image format issues, or temporary service unavailability. Please try again or have a human reviewer check this image.`,
      sources: [],
      confidenceScore: 0.5,
      imageContent: `Uploaded image: ${imageName}`
    };
  }
}

// ----------------------------------------------------
// POST /image — Upload and verify image
// ----------------------------------------------------
router.post("/image", upload.single("image"), async (req, res) => {
  console.log("📸 Image upload endpoint hit");

  try {
    if (!req.file) {
      console.error("❌ No file received");
      return res.status(400).json({
        success: false,
        message: "No image file uploaded. Please select a JPG, JPEG, or PNG image.",
      });
    }

    console.log("✅ File uploaded:", req.file.originalname);
    console.log("📁 File path:", req.file.path);
    console.log("📊 File size:", (req.file.size / 1024).toFixed(2), "KB");

    // Read the uploaded file and convert to base64
    const imageBuffer = fs.readFileSync(req.file.path);
    const imageBase64 = imageBuffer.toString("base64");
    console.log("✅ Image converted to base64");

    // Analyze image with Groq Vision AI
    console.log("🤖 Starting AI analysis...");
    const result = await analyzeImageWithGroq(imageBase64, req.file.originalname);
    console.log("✅ AI analysis completed");

    // Save to database
    const verification = new Verification({
      inputType: "image",
      content: req.file.originalname,
      credibility: result.credibility,
      status: result.status,
      message: result.message,
      explanation: result.explanation,
      sources: result.sources || [],
      confidenceScore: result.confidenceScore,
      analysisRaw: JSON.stringify(result),
    });

    await verification.save();
    console.log("💾 Saved to database");

    // Clean up uploaded file after processing
    fs.unlinkSync(req.file.path);
    console.log("🗑️ Cleaned up temporary file");

    res.status(200).json({ success: true, data: verification });
  } catch (err) {
    console.error("❌ Image verification error:", err.message);
    console.error("Stack:", err.stack);

    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
        console.log("🗑️ Cleaned up file after error");
      } catch (cleanupErr) {
        console.error("Failed to cleanup file:", cleanupErr);
      }
    }

    res.status(500).json({
      success: false,
      message: err.message || "Failed to verify image. Please try again.",
      error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

// ----------------------------------------------------
// POST — Create a new verification entry (text/url)
// ----------------------------------------------------
router.post("/", async (req, res) => {
  try {
    const { inputType, content } = req.body;

    if (!inputType || !content) {
      return res.status(400).json({
        success: false,
        message: "inputType and content are required",
      });
    }

    // Call Groq AI
    const result = await analyzeWithGroq(inputType, content);

    const verification = new Verification({
      inputType,
      content,
      credibility: result.credibility,
      status: result.status,
      message: result.message,
      explanation: result.explanation,
      sources: result.sources,
      confidenceScore: result.confidenceScore,
      analysisRaw: JSON.stringify(result),
    });

    await verification.save();

    res.status(200).json({ success: true, data: verification });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ----------------------------------------------------
// GET — Fetch all verification records (history)
// ----------------------------------------------------
router.get("/history", async (req, res) => {
  try {
    const history = await Verification.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: history });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ----------------------------------------------------
// PUT — Update a verification record
// ----------------------------------------------------
router.put("/:id", async (req, res) => {
  try {
    const updated = await Verification.findByIdAndUpdate(
      req.params.id,
      { content: req.body.content },
      { new: true }
    );
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ----------------------------------------------------
// DELETE — Delete a record
// ----------------------------------------------------
router.delete("/:id", async (req, res) => {
  try {
    await Verification.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Record deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
