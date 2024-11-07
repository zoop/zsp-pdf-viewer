import { promises as fs } from "fs";
import { NextResponse } from "next/server";
import path from "path";

export async function GET(){
    try{
        const uploadDir=path.join(process.cwd(),"public","uploads");
        const files=await fs.readdir(uploadDir);
        const fileDetails = await Promise.all(
            files.map(async (filename) => {
              const filePath = path.join(uploadDir, filename);
              const fileBuffer = await fs.readFile(filePath);
              const base64String = fileBuffer.toString("base64");
              return { name: filename, base64: base64String };
            })
          );
      
          return NextResponse.json({ files: fileDetails }, { status: 200 });
    }catch(error){
        console.error("Error reading upload Directory ",error);
        return NextResponse.json({error:"Failed to list files"},{status:500});
    }
}