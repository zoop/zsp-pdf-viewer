import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    // Parse the form data using the built-in formData method
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    // Create a buffer from the file contents
    const buffer = Buffer.from(await file.arrayBuffer());

    // Sanitize and prepare the filename
    // const filename = file.name.replace(/\s+/g, "_"); // Replace spaces with underscores
    const filename = `${file.name}.pdf`;

    // Define the upload path (Ensure the 'uploads' folder exists)
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const uploadPath = path.join(uploadDir, filename);
    console.log("Helo")
    console.log(buffer);

  
    // Save the file to the local system
    await fs.writeFile(uploadPath, buffer);
    
    return NextResponse.json({ message: "File uploaded successfully!" }, { status: 200 });
  } catch (error) {
    console.error("Error processing file upload:", error);
    return NextResponse.json({ error: "Error processing file upload." }, { status: 500 });
  }
}
