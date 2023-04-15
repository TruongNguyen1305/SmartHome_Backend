import mongoose from "mongoose";

const DeviceSchema = new mongoose.Schema(
    {
        name: String,
        type: String,
        homeID: {
          type: mongoose.Schema.Types.ObjectId,
          // ref: 'Home',
          required: true,
        },
        auto: {
          type: Boolean,
          default: false,
        },
        onValue: Number,
        offValue: Number
    },
    {
      timestamps: true,
    }
  );
  const Device = mongoose.model("Device", DeviceSchema);
  
  export default Device;