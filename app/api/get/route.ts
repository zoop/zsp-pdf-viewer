import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET(req: Request) {
  try {
    // Extract the filename from the request query
    const { searchParams } = new URL(req.url);
    console.log("Search Params", searchParams);
    const filename = searchParams.get("filename");

    if (!filename) {
      return NextResponse.json({ error: "Filename not provided." }, { status: 400 });
    }

    // Construct the file path
    const filePath = path.join(process.cwd(), "uploads", filename);

    // Check if the file exists
    try {
      await fs.access(filePath);
    } catch {
      return NextResponse.json({ error: "File not found." }, { status: 404 });
    }

    // Read the file and convert it to binary
    const fileBuffer = await fs.readFile(filePath);
    const binaryData = fileBuffer.toString('base64'); // Convert to base64

    return NextResponse.json({ message: "File retrieved successfully!", data: binaryData }, { status: 200 });
  } catch (error) {
    console.error("Error processing file retrieval:", error);
    return NextResponse.json({ error: "Error processing file retrieval." }, { status: 500 });
  }
}
