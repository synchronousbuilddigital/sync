import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import jwt from 'jsonwebtoken';
import { getGoogleAuth } from '@/lib/googleSheets';

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

    const auth = getGoogleAuth();

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
      if (row[18] && row[18].toLowerCase() === 'yes' || row[18] === 'TRUE') platforms.push('Instagram');
      if (row[19] && row[19].toLowerCase() === 'yes' || row[19] === 'TRUE') platforms.push('FB');
      if (row[20] && row[20].toLowerCase() === 'yes' || row[20] === 'TRUE') platforms.push('LinkedIn');

      return {
        companyName: row[0] || "",
        contentId: row[1] || "",
        contentType: row[2] || "",
        contentFor: row[3] || "",
        creatorName: row[4] || "",
        creationDate: row[5] || "",
        creationMonth: row[6] || "",
        day: row[7] || "",
        topic: row[8] || "",
        rawLink: row[9] || "",
        firstEditDate: row[10] || "",
        editorName: row[11] || "",
        editorRemarks: row[12] || "",
        editedLink: row[13] || "",
        reviewDate: row[14] || "",
        reviewStatus: row[15] || "",
        reviewRemarks: row[16] || "",
        reviewBy: row[17] || "",
        platforms: platforms,
        postingStatus: row[21] || "",
        postedDate: row[22] || "",
        firstEdit: row[24] || "",
        finalApproval: row[25] || ""
      };
    }).filter(t => t.topic !== "" || t.contentId !== "" || t.companyName !== ""); // filter out completely empty rows

    return NextResponse.json({ success: true, data: marketingTasks });
  } catch (error) {
    console.error("Marketing Sheet Fetch Error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch marketing data." }, { status: 500 });
  }
}
