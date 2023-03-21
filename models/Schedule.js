import mongoose from "mongoose";

const ScheduleSchema = new mongoose.Schema(
    {
        deviceId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Device'},
        creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        action: Boolean,
        status: {type: Boolean, default: true},
        timeSchedule: Date,
    },
    {
      timestamps: true,
    }
  );
  const Schedule = mongoose.model("Schedule", ScheduleSchema);
  
  export default Schedule;