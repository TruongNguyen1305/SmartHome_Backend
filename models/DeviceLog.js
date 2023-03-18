import mongoose from "mongoose";

const DeviceLogSchema = new mongoose.Schema(
    {
        deviceID: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        creatorID: mongoose.Schema.Types.ObjectId,
        value: Number,
    },
    {
      timestamps: true,
    }
  );
  const DeviceLog = mongoose.model("DeviceLog", DeviceLogSchema);
  
  export default DeviceLog;