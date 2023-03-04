import mongoose from "mongoose";

const DeviceLogSchema = new mongoose.Schema(
    {
        deviceID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        value: Number,
    },
    {
      timestamps: true,
    }
  );
  const DeviceLog = mongoose.model("DeviceLog", DeviceLogSchema);
  
  export default DeviceLog;