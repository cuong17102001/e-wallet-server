import mongoose from "mongoose"

const HistorySchema = mongoose.Schema(
    {
        userId: {
            type: String
        },
        service : {
            type : String
        },
        money : {
            type: Number
        },
        sodu : {
            type : Number
        },
        reciverId : {
            type : String
        }
    },
    {
        timestamps: true
    }
)

const HistoryModel = mongoose.model("History" , HistorySchema)
export default HistoryModel