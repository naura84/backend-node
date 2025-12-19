// model/Article.js
import mongoose from "mongoose";
const { Schema } = mongoose;

const ArticleSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    publicationDate: {
        type: Date,
        default: Date.now
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "Author",
        required: true
    }
});

export default mongoose.model("Article", ArticleSchema);
