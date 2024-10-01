const {model, Schema} = require("mongoose");

const DOCUMENT_NAME = 'Comment';
const COLLECTION_NAME = 'Comments';

const commentSchema = new Schema({
    property: { type: Schema.Types.ObjectId, ref: 'Property', required: true },  // Links comment to the property
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },  // Links comment to the user (guest)
    content: { type: String, required: true },  // The comment or review content
    rating: { type: Number, required: true, min: 1, max: 5 },  // Rating given by the user (1-5 stars)
    parentComment: { type: Schema.Types.ObjectId, ref: 'Comment', default: null },  // For replies or nested comments
    is_deleted: { type: Boolean, default: false }  // Soft delete functionality
}, {
    timestamps: true,  // Automatically manages createdAt and updatedAt fields
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, commentSchema);