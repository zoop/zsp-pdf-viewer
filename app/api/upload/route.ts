import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    // Parse the form data using the built-in formData method
    const formData = await req.formData();
    const base64String = formData.get("file") as string | null;

    if (!base64String) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    const base64Data = base64String.replace(/^data:.+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    // Sanitize and prepare the filename
    // const filename = file.name.replace(/\s+/g, "_"); // Replace spaces with underscores
    const filename = formData.get("filename") as string || `uploaded_file_.pdf`;  // Fallback to dynamic name if no filename provided

    // Define the upload path (Ensure the 'uploads' folder exists)
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const uploadPath = path.join(uploadDir, filename);
  
    // Save the file to the local system
    await fs.writeFile(uploadPath, buffer);
    return NextResponse.json({ message: "File uploaded successfully!" }, { status: 200 });
  } catch (error) {
    console.error("Error processing file upload:", error);
    return NextResponse.json({ error: "Error processing file upload." }, { status: 500 });
  }
}
