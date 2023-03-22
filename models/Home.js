import mongoose from "mongoose";

const HomeSchema = new mongoose.Schema(
    {
    },
    {
        timestamps: true,
    }
  );
  const Home = mongoose.model("Home", HomeSchema);
  
  export default Home;