import mongoose from "mongoose";

const ScheduleSchema = new mongoose.Schema(
    {
        deviceID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        value: Boolean,
        timeSchedule: Date,
    },
    {
      timestamps: true,
    }
  );
  const Schedule = mongoose.model("Schedule", ScheduleSchema);
  
  export default Schedule;