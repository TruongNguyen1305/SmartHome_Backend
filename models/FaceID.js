import mongoose from "mongoose";

const FaceIDSchema = new mongoose.Schema(
    {
      userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      name: String,
      images: [String],
    },
    {
      timestamps: true,
    }
  );
  const FaceID = mongoose.model("FaceID", FaceIDSchema);
  
  export default FaceID;