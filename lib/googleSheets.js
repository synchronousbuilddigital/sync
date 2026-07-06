import { google } from 'googleapis';

let cachedTrackerMap = null;
let lastFetchTime = 0;
const CACHE_TTL = 60000; // 60 seconds cache to prevent slow API responses

export async function fetchPostTrackerData() {
  if (cachedTrackerMap && Date.now() - lastFetchTime < CACHE_TTL) {
    return cachedTrackerMap;
  }

  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: "/Users/vaasu/Desktop/ultra-path-500205-p2-f9728ef6fbce.json",
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: "1zcyEGI8TYnsj4uDCiVPEUF0BK4BX2deY0utzoIl516A",
      range: "Post Tracker!A2:Z",
    });

    const rows = response.data.values || [];
    const trackerMap = {};

    rows.forEach(row => {
      const contentId = row[1];
      if (contentId && contentId.trim() !== "" && contentId.trim().toLowerCase() !== "self") {
        trackerMap[contentId.trim()] = {
          scheduledDate: row[2] || "",
          day: row[3] || "",
          month: row[4] || "",
          postType: row[5] || "",
          postingTime: row[6] || "",
          finalLink: row[7] || "",
          status: row[8] || "",
          postedLink: row[9] || "",
          clientRemarks: row[10] || "",
        };
      }
    });

    cachedTrackerMap = trackerMap;
    lastFetchTime = Date.now();
    return trackerMap;
  } catch (error) {
    console.error("Error fetching Post Tracker sheet:", error);
    return cachedTrackerMap || {};
  }
}

export async function appendPostTrackerData(data) {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: "/Users/vaasu/Desktop/ultra-path-500205-p2-f9728ef6fbce.json",
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    
    // Convert to row array based on columns
    // Columns: Company, Content ID, Scheduled Date, Day, Month, Post Type, Posting Time, Final Link, Status, Posted link, Client Remarks
    const row = [
      data.company || "",
      data.contentId || "",
      data.scheduledDate || "",
      data.day || "",
      data.month || "",
      data.postType || "",
      data.postingTime || "",
      data.finalLink || "",
      data.status || "",
      data.postedLink || "",
      data.clientRemarks || ""
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: "1zcyEGI8TYnsj4uDCiVPEUF0BK4BX2deY0utzoIl516A",
      range: "Post Tracker!A:K",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [row],
      },
    });

    // Invalidate the cache immediately so new fetches see the appended row
    cachedTrackerMap = null;
    lastFetchTime = 0;

    return { success: true };
  } catch (error) {
    console.error("Error appending to Post Tracker sheet:", error);
    throw error;
  }
}

export async function updatePostTrackerData(data) {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: "/Users/vaasu/Desktop/ultra-path-500205-p2-f9728ef6fbce.json",
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    
    // First, get all rows to find the matching contentId
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: "1zcyEGI8TYnsj4uDCiVPEUF0BK4BX2deY0utzoIl516A",
      range: "Post Tracker!A:K",
    });

    const rows = response.data.values || [];
    let targetRowIndex = -1;
    let existingRow = [];

    for (let i = 0; i < rows.length; i++) {
      if (rows[i][1] === data.contentId) {
        targetRowIndex = i;
        existingRow = rows[i];
        break;
      }
    }

    if (targetRowIndex === -1) {
      throw new Error("Content ID not found in Post Tracker");
    }

    // Prepare updated row
    // Columns: 0:Company, 1:Content ID, 2:Scheduled Date, 3:Day, 4:Month, 5:Post Type, 6:Posting Time, 7:Final Link, 8:Status, 9:Posted link, 10:Client Remarks
    const updatedRow = [...existingRow];
    
    // Fill up to length 11 just in case
    while(updatedRow.length < 11) updatedRow.push("");

    if (data.postingTime !== undefined) updatedRow[6] = data.postingTime;
    if (data.finalLink !== undefined) updatedRow[7] = data.finalLink;
    if (data.status !== undefined) updatedRow[8] = data.status;
    if (data.postedLink !== undefined) updatedRow[9] = data.postedLink;
    if (data.clientRemarks !== undefined) updatedRow[10] = data.clientRemarks;

    // Update the specific row
    const rowNumber = targetRowIndex + 1; // 1-indexed for Sheets
    await sheets.spreadsheets.values.update({
      spreadsheetId: "1zcyEGI8TYnsj4uDCiVPEUF0BK4BX2deY0utzoIl516A",
      range: `Post Tracker!A${rowNumber}:K${rowNumber}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [updatedRow],
      },
    });

    // Invalidate the cache immediately so new fetches see the updated row
    cachedTrackerMap = null;
    lastFetchTime = 0;

    return { success: true };
  } catch (error) {
    console.error("Error updating Post Tracker sheet:", error);
    throw error;
  }
}
