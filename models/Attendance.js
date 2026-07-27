import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema({
  internId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  date: { 
    type: Date, 
    required: true 
    // stored as midnight UTC for the calendar day (YYYY-MM-DD 00:00:00Z)
  },
  markedAt: { 
    type: Date, 
    default: Date.now 
    // exact timestamp when intern clicked "Mark Present"
  }
}, { timestamps: true });

// Prevent double-marking: one record per intern per day
AttendanceSchema.index({ internId: 1, date: 1 }, { unique: true });

export default mongoose.models.Attendance || mongoose.model("Attendance", AttendanceSchema);
