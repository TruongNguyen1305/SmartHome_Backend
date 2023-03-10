import mongoose from "mongoose";

const ScheduleSchema = new mongoose.Schema(
    {
        deviceId: {type: String, required: true},
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        status: Boolean,
        timeSchedule: Date,
    },
    {
      timestamps: true,
    }
  );
  const Schedule = mongoose.model("Schedule", ScheduleSchema);
  
  export default Schedule;