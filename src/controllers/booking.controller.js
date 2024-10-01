const catchAsync = require('../helpers/catch.async');
const { OK } = require("../core/success.response");
const { BookingService } = require("../services/booking.service");

class BookingController {
    createBooking = catchAsync(async (req, res, next) => {
        OK(res, "Booking created successfully", 
            await BookingService.createBooking({
                ...req.body,
                guestId: req.user.userId
            })
        );
    });

    getBookingsByGuest = catchAsync(async (req, res) => {
        OK(res, "Retrieved bookings successfully", 
            await BookingService.getBookingsByGuest(req.user.userId)
        );
    });

    getBookingById = catchAsync(async (req, res) => {
        OK(res, "Booking retrieved successfully", 
            await BookingService.getBookingById(req.params.bookingId)
        );
    });

    cancelBooking = catchAsync(async (req, res) => {
        OK(res, "Booking canceled successfully", 
            await BookingService.cancelBooking({
                bookingId: req.params.bookingId,
                guestId: req.user.userId
            })
        );
    });
}

module.exports = new BookingController();
