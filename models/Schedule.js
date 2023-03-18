import mongoose from "mongoose";

const ScheduleSchema = new mongoose.Schema(
    {
        deviceID: {type: mongoose.Schema.Types.ObjectId, required: true},
        creator: mongoose.Schema.Types.ObjectId,
        status: Boolean,
        timeSchedule: Date,
    },
    {
      timestamps: true,
    }
  );
  const Schedule = mongoose.model("Schedule", ScheduleSchema);
  
  export default Schedule;