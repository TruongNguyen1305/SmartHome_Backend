import mongoose from "mongoose";

const DeviceLogSchema = new mongoose.Schema(
    {
      type: String,
      name: String,
      value: Number,
    },
    {
      timestamps: true,
    }
  );
  const DeviceLog = mongoose.model("DeviceLog", DeviceLogSchema);
  
  export default DeviceLog;