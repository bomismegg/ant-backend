const express = require('express');
const router = express.Router();
const bookingController = require('../../controllers/booking.controller');
const { authenticationV2 } = require("../../auth/authUtils");

/**
 * @swagger
 *   /api/v1/booking/:
 *     post:
 *       summary: Create a new booking
 *       tags: [Booking]
 *       security: []
 *       responses:
 *         "400":
 *           $ref: '#/components/responses/400'
 *         "401":
 *           $ref: '#/components/responses/401'
 *         "200":
 *           description: Booking info
 *           contents:
 *             application/json
 */
router.post('', authenticationV2, bookingController.createBooking);

/**
 * @swagger
 *   /api/v1/booking/guest:
 *     get:
 *       summary: Get bookings for a guest
 *       tags: [Booking]
 *       security: []
 *       responses:
 *         "400":
 *           $ref: '#/components/responses/400'
 *         "401":
 *           $ref: '#/components/responses/401'
 *         "200":
 *           description: Bookings info
 *           contents:
 *             application/json
 */
router.get('/guest', authenticationV2, bookingController.getBookingsByGuest);

/**
 * @swagger
 *   /api/v1/booking/:id:
 *     get:
 *       summary: Get booking by ID
 *       tags: [Booking]
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: string
 *           required: true
 *           description: Booking ID
 *       responses:
 *         "400":
 *           $ref: '#/components/responses/400'
 *         "401":
 *           $ref: '#/components/responses/401'
 *         "200":
 *           description: Booking info
 *           contents:
 *             application/json
 */
router.get('/:id', authenticationV2, bookingController.getBookingById);

/**
 * @swagger
 *   /api/v1/booking/:id/cancel:
 *     post:
 *       summary: Cancel a booking
 *       tags: [Booking]
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: string
 *           required: true
 *           description: Booking ID
 *       responses:
 *         "400":
 *           $ref: '#/components/responses/400'
 *         "401":
 *           $ref: '#/components/responses/401'
 *         "200":
 *           description: Booking cancellation info
 *           contents:
 *             application/json
 */
router.post('/:id/cancel', authenticationV2, bookingController.cancelBooking);

module.exports = router;
