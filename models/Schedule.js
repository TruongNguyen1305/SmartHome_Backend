import mongoose from "mongoose";

const ScheduleSchema = new mongoose.Schema(
    {
        deviceID: {type: String, required: true},
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        status: Number,
        timeSchedule: Date,
    },
    {
      timestamps: true,
    }
  );
  const Schedule = mongoose.model("Schedule", ScheduleSchema);
  
  export default Schedule;