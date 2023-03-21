import mongoose from "mongoose";

const HomeSchema = new mongoose.Schema(
    {
        name: 'String',
    },
    {
        timestamps: true,
    }
  );
  const Home = mongoose.model("Home", HomeSchema);
  
  export default Home;