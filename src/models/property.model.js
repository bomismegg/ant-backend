const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = 'Property';
const COLLECTION_NAME = 'Properties';

const propertySchema = new Schema({
    propertyType: {
        type: String,
        enum: [
            'house',
            'apartment',
            'villa'
        ],
        required: true
    },

    location: {
        address: {
            type: String,
            required: true
        },

        city: {
            type: String,
            required: true
        },

        country: {
            type: String,
            required: true
        },

        latitude: {
            type: Number,
            required: true
        },

        longitude: {
            type: Number,
            required: true
        }
    },

    pricePerNight: {
        type: Number,
        required: true
    },

    amenities: [String],
    // e.g., WiFi, parking
    host: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Host reference
    images: [String]
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, propertySchema);