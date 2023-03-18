import mongoose from "mongoose";

const DeviceLogSchema = new mongoose.Schema(
    {
      userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },
      name: String,
      images: [String],
    },
    {
      timestamps: true,
    }
  );
  const DeviceLog = mongoose.model("DeviceLog", DeviceLogSchema);
  
  export default DeviceLog;