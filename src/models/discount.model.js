const {model, Schema} = require("mongoose");

const DOCUMENT_NAME = 'Discount';
const COLLECTION_NAME = 'Discounts';

const discountSchema = new Schema({
    discountName: { type: String, required: true },
    description: { type: String, required: true },
    discountType: { type: String, default: 'fixed_amount', enum: ['fixed_amount', 'percentage'] },  // Type of discount
    discountValue: { type: Number, required: true },
    discountCode: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    maxUses: { type: Number, required: true },  // Maximum number of uses
    currentUses: { type: Number, default: 0 },  // Track the number of uses
    maxUsesPerUser: { type: Number, default: 1 },  // Limit how many times a user can use the discount
    minOrderValue: { type: Number, default: 0 },  // Minimum order value to use the discount
    isActive: { type: Boolean, default: true },  // Is the discount currently active?
    appliesTo: { type: String, enum: ['all', 'specific'], required: true },  // Applies to all properties or specific ones
    propertyIds: [{ type: Schema.Types.ObjectId, ref: 'Property' }],  // Specific properties if applicable
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, discountSchema);
