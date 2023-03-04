import mongoose from "mongoose";

const DeviceSchema = new mongoose.Schema(
    {
        name: String,
        type: String,
        enabled: Boolean,
        data: String,
        onAutoMode: Boolean,
    },
    {
      timestamps: true,
    }
  );
  const Device = mongoose.model("Device", DeviceSchema);
  
  export default Device;