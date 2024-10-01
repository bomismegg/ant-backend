const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'User';
const COLLECTION_NAME = 'Users';

const userSchema = new Schema({
  usr_name: { type: String, required: true },
  usr_email: { type: String, required: true },
  usr_password: { type: String, required: true },
  usr_role: { type: Schema.Types.ObjectId, ref: 'Role', required: true },  // Role Reference (guest, host, admin)
  usr_properties: [{ type: Schema.Types.ObjectId, ref: 'Property' }],  // Properties listed by host
  usr_verified: { type: Boolean, default: false },  
  usr_profilePicture: { type: String, default: null },
  usr_phone: { type: String, default: null },
  usr_status: { type: String, default: 'pending', enum: ['pending', 'active', 'block'] }
}, {
  collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, userSchema);
