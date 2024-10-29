import { promises as fs } from "fs";
import { NextResponse } from "next/server";
import path from "path";

export async function GET(){
    try{
        const uploadDir=path.join(process.cwd(),"/public/uploads");
        const files=await fs.readdir(uploadDir);
        return NextResponse.json({files},{status:200});
    }catch(error){
        console.error("Error reading upload Directory ",error);
        return NextResponse.json({error:"Failed to list files"},{status:500});
    }
}