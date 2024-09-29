const { Schema, mongoose } = require('mongoose')

const DOCUMENT_NAME = 'Role';
const COLLECTION_NAME = 'Roles';

const modelSchema = new Schema({
    role_name: { type: String, default: 'guest', enum: ['guest', 'host', 'admin'] },
    role_slug: { type: String, required: true },
    role_status: { type: String, default: 'pending', enum: ['pending', 'active', 'block'] },
    role_description: { type: String, default: '' },
    role_grants: [
        {
            resource: { type: String, required: true },  // e.g., 'Property', 'Booking'
            actions: [{ type: String, required: true }], // e.g., 'create', 'read', 'update', 'delete'
            attributes: { type: String, default: '*' }
        }
    ]
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});


module.exports = mongoose.model(DOCUMENT_NAME, modelSchema);
