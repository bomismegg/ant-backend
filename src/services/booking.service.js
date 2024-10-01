const Booking = require('../models/booking.model');
const { Api404Error } = require("../core/error.response");
const { PropertyService } = require("./property.service");

class BookingService {
    // 1. Create a new booking
    static async createBooking({ propertyId, guestId, startDate, endDate, guestCount, paymentMethod }) {
        await this.validatePropertyExists(propertyId);
        
        const totalPrice = await this.calculateTotalPrice(propertyId, startDate, endDate, guestCount);

        const booking = new Booking({
            property: propertyId,
            guest: guestId,
            startDate,
            endDate,
            guestCount,
            totalPrice,
            paymentMethod,
            status: 'pending',
            paymentStatus: 'pending'
        });

        await booking.save();
        return booking;
    }

    // 2. Get bookings for a specific user (guest)
    static async getBookingsByGuest(guestId) {
        return await Booking.find({ guest: guestId }).populate('property').exec();
    }

    // 3. Get a booking by ID
    static async getBookingById(bookingId) {
        const booking = await Booking.findById(bookingId).populate('property').exec();
        if (!booking) throw new Api404Error('Booking not found');
        return booking;
    }

    // 4. Cancel a booking
    static async cancelBooking({ bookingId, guestId }) {
        const booking = await Booking.findById(bookingId);
        if (!booking) throw new Api404Error('Booking not found');
        if (booking.guest.toString() !== guestId) throw new Api404Error('Unauthorized to cancel this booking');

        booking.status = 'canceled';
        await booking.save();
        return booking;
    }

    // 5. Validate if property exists
    static async validatePropertyExists(propertyId) {
        const foundProperty = await PropertyService.getPropertyById({ propertyId });
        if (!foundProperty) throw new Api404Error('Property not found');
    }

    // 6. Calculate total price for booking
    static async calculateTotalPrice(propertyId, startDate, endDate, guestCount) {
        const property = await PropertyService.getPropertyById({ propertyId });
        const nights = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);
        const totalPrice = property.pricePerNight * nights * guestCount;
        return totalPrice;
    }
}

module.exports = { BookingService };
