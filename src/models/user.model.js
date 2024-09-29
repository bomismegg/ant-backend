const { Schema, mongoose } = require('mongoose')

const DOCUMENT_NAME = 'User';
const COLLECTION_NAME = 'Users';

const userSchema = new Schema({
  usr_id: { type: String, required: true },
  usr_slug: { type: String, required: true },
  usr_name: { type: String, required: true },
  usr_email: { type: String, required: true },
  usr_password: { type: String, required: true },
  usr_role: { type: Schema.Types.ObjectId, ref: 'Role', required: true },  // Role Reference
  usr_properties: [{ type: Schema.Types.ObjectId, ref: 'Property' }], // Properties listed by host
  usr_location: {
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null }
  },  // Guest location
  usr_status: { type: String, default: 'pending', enum: ['pending', 'active', 'block'] }
}, {
  collection: COLLECTION_NAME
});

module.exports = mongoose.model(DOCUMENT_NAME, userSchema);
