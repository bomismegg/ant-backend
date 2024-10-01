const { findPropertyById, updateProperty, searchProperties } = require("../models/repositories/property.repo");
const { Api404Error, BusinessLogicError } = require("../core/error.response");

class PropertyService {

    // 1. Create a property
    static async createProperty({ propertyData, hostId }) {
        propertyData.host = hostId;
        const newProperty = await propertyRepository.create(propertyData);
        return newProperty;
    }

    // 2. Update a property
    static async updateProperty({ propertyId, hostId, propertyData }) {
        const foundProperty = await findPropertyById(propertyId);
        if (!foundProperty) throw new Api404Error("Property not found");
        if (foundProperty.host.toString() !== hostId) throw new BusinessLogicError("Unauthorized");

        const updatedProperty = await updateProperty(propertyId, propertyData);
        return updatedProperty;
    }

    // 3. Get a property by ID
    static async getPropertyById({ propertyId }) {
        const property = await findPropertyById(propertyId);
        if (!property) throw new Api404Error("Property not found");

        return property;
    }

    // 4. Search properties based on filters
    static async searchProperties(filters) {
        const properties = await searchProperties(filters);
        return properties;
    }

    // 5. Check availability for booking dates
    static async checkAvailability({ propertyId, startDate, endDate }) {
        const property = await findPropertyById(propertyId);
        if (!property) throw new Api404Error("Property not found");P

        const isAvailable = property.isAvailable && !await BookingRepository.isBooked({ propertyId, startDate, endDate });
        return isAvailable;
    }

    // 6. Delete property (host only)
    static async deleteProperty({ propertyId, hostId }) {
        const property = await findPropertyById(propertyId);
        if (!property) throw new Api404Error("Property not found");
        if (property.host.toString() !== hostId) throw new BusinessLogicError("Unauthorized");

        await propertyRepository.deleteById(propertyId);
        return { message: "Property deleted successfully" };
    }

    // 7. Handle pricing logic
    static async calculatePrice({ propertyId, nights }) {
        const property = await findPropertyById(propertyId);
        if (!property) throw new Api404Error("Property not found");

        const totalCost = property.pricePerNight * nights;
        return { totalCost };
    }
}

module.exports = PropertyService;
