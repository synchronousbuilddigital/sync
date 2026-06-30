import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import jwt from 'jsonwebtoken';

export async function GET(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");

    if (decoded.role !== "admin") {
      return NextResponse.json({ success: false, message: "Access Denied." }, { status: 403 });
    }

    const auth = new google.auth.GoogleAuth({
      keyFile: "/Users/vaasu/Desktop/ultra-path-500205-p2-f9728ef6fbce.json",
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    
    // Fetch data from Content Master
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: "1zcyEGI8TYnsj4uDCiVPEUF0BK4BX2deY0utzoIl516A",
      range: "Content Master!A2:Z",
    });

    const rows = response.data.values || [];
    
    // Map rows into an array of objects
    const marketingTasks = rows.map(row => {
      // Platform parsing
      const platforms = [];
      if (row[18] && row[18].toLowerCase() === 'yes') platforms.push('Instagram');
      if (row[19] && row[19].toLowerCase() === 'yes') platforms.push('FB');
      if (row[20] && row[20].toLowerCase() === 'yes') platforms.push('LinkedIn');

      return {
        contentId: row[1] || "",
        topic: row[8] || "",
        rawLink: row[9] || "",
        platforms: platforms
      };
    }).filter(t => t.topic !== ""); // filter out empty rows

    return NextResponse.json({ success: true, data: marketingTasks });
  } catch (error) {
    console.error("Marketing Sheet Fetch Error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch marketing data." }, { status: 500 });
  }
}
