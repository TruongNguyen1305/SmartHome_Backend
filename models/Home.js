import mongoose from "mongoose";

const HomeSchema = new mongoose.Schema(
    {
        devices: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Device",
        }]
    },
    {
        timestamps: true,
    }
  );
  const Home = mongoose.model("Home", HomeSchema);
  
  export default Home;