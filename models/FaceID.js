import mongoose from "mongoose";

const DeviceLogSchema = new mongoose.Schema(
    {
      userid: String,
      name: String,
      images: [String],
    },
    {
      timestamps: true,
    }
  );
  const DeviceLog = mongoose.model("DeviceLog", DeviceLogSchema);
  
  export default DeviceLog;