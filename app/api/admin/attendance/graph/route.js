import dbConnect from "@/lib/mongodb";
import Attendance from "@/models/Attendance";
import Leave from "@/models/Leave";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const decoded = verifyToken(req);
    if (!decoded || decoded.role !== "admin") {
      return Response.json({ success: false, message: "Admin only" }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const daysParamRaw = searchParams.get("days") || "7";
    const monthParam = searchParams.get("month"); // e.g. "2026-08"
    const internIdParam = searchParams.get("internId");

    const now = new Date();
    // Normalize today to midnight UTC
    const todayUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    
    // Calculate 11 AM IST for current date (today)
    const todayElevenAmUtc = todayUtc.getTime() + (5.5 * 60 * 60 * 1000);
    const isPastCutoffToday = Date.now() >= todayElevenAmUtc;

    // Fetch interns
    let internQuery = { role: "intern" };
    if (internIdParam && internIdParam !== "all") {
      internQuery._id = internIdParam;
    }
    const interns = await User.find(internQuery).select("_id").lean();
    if (interns.length === 0) {
      return Response.json({ success: true, graphData: [] });
    }

    const internIds = interns.map(i => i._id.toString());

    let startDate, endDate, daysParam;

    if (monthParam) {
      const [yyyy, mm] = monthParam.split("-");
      startDate = new Date(Date.UTC(parseInt(yyyy), parseInt(mm) - 1, 1));
      endDate = new Date(Date.UTC(parseInt(yyyy), parseInt(mm), 0)); // Last day of month
      
      // If the month is the current month or in the future, cap it to today
      if (endDate > todayUtc) {
        endDate = new Date(todayUtc);
      }
      
      // If the selected month is completely in the future, return empty
      if (startDate > todayUtc) {
        return Response.json({ success: true, graphData: [] });
      }

      daysParam = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    } else {
      daysParam = parseInt(daysParamRaw);
      startDate = new Date(todayUtc);
      startDate.setUTCDate(startDate.getUTCDate() - (daysParam - 1));
      endDate = new Date(todayUtc);
    }
    
    const nextDate = new Date(endDate);
    nextDate.setUTCDate(nextDate.getUTCDate() + 1);

    const attendanceRecords = await Attendance.find({
      internId: { $in: internIds },
      date: { $gte: startDate, $lt: nextDate }
    }).lean();

    const approvedLeaves = await Leave.find({
      internId: { $in: internIds },
      status: "Approved",
      startDate: { $lte: nextDate },
      endDate: { $gte: startDate }
    }).lean();

    // Group by Date -> InternId -> Record
    const attMap = {}; // { 'YYYY-MM-DD': { internId: record } }
    attendanceRecords.forEach(a => {
      const dStr = new Date(a.date).toISOString().split("T")[0];
      if (!attMap[dStr]) attMap[dStr] = {};
      attMap[dStr][a.internId.toString()] = a;
    });

    const leaveMap = {}; // { internId: [leave records] }
    approvedLeaves.forEach(l => {
      const id = l.internId.toString();
      if (!leaveMap[id]) leaveMap[id] = [];
      leaveMap[id].push(l);
    });

    const graphData = [];
    
    for (let i = 0; i < daysParam; i++) {
      const currDate = new Date(startDate);
      currDate.setUTCDate(currDate.getUTCDate() + i);
      const dStr = currDate.toISOString().split("T")[0];
      
      let present = 0;
      let onLeave = 0;
      let absent = 0;
      let pending = 0;

      const isToday = currDate.getTime() === todayUtc.getTime();
      const isPastCutoff = isToday ? isPastCutoffToday : true; // Past days are always past cutoff

      interns.forEach(intern => {
        const id = intern._id.toString();
        const hasAtt = attMap[dStr] && attMap[dStr][id];
        
        let hasLeave = false;
        if (leaveMap[id]) {
          hasLeave = leaveMap[id].some(l => {
            const lStart = new Date(l.startDate);
            const lEnd = new Date(l.endDate);
            const normStart = new Date(Date.UTC(lStart.getUTCFullYear(), lStart.getUTCMonth(), lStart.getUTCDate())).getTime();
            const normEnd = new Date(Date.UTC(lEnd.getUTCFullYear(), lEnd.getUTCMonth(), lEnd.getUTCDate())).getTime();
            return currDate.getTime() >= normStart && currDate.getTime() <= normEnd;
          });
        }

        if (hasAtt) {
          present++;
        } else if (hasLeave) {
          onLeave++;
        } else {
          if (isPastCutoff) {
            absent++;
          } else {
            pending++;
          }
        }
      });

      graphData.push({
        date: dStr,
        present,
        onLeave,
        absent,
        pending,
        total: interns.length,
        // Short format for chart e.g., "Mon 03"
        displayDate: currDate.toLocaleDateString('en-US', { weekday: 'short', day: '2-digit' })
      });
    }

    return Response.json({ success: true, graphData });
  } catch (err) {
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
