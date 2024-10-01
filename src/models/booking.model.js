const { Schema, mongoose } = require("mongoose");

const DOCUMENT_NAME = 'Booking';
const COLLECTION_NAME = 'Bookings';

const bookingSchema = new Schema({
    property: {
        type: Schema.Types.ObjectId,
        ref: 'Property',
        required: true
    },
    guest: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: 'pending',
        enum:
            [
                'pending',
                'confirmed',
                'completed',
                'canceled'
            ]
    },
    guestCount: {
        type: Number,
        required: true,
        default: 1
    },
    paymentStatus: {
        type: String,
        default: 'pending',  // Other values: 'paid', 'failed', etc.
        enum: ['pending', 'paid', 'failed']
    },
    paymentMethod: {
        type: String,
        default: 'credit_card',  // Could be 'credit_card', 'paypal', etc.
        enum: ['credit_card', 'paypal', 'bank_transfer']
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = mongoose.model(DOCUMENT_NAME, bookingSchema);