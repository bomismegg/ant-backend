const express = require('express');
const router = express.Router();
const propertyController = require('../../controllers/property.controller');
const { authenticationV2 } = require("../../auth/authUtils");

/**
 * @swagger
 *   /api/v1/property/:
 *     post:
 *       summary: Create property
 *       tags: [Property]
 *       security: []
 *       responses:
 *         "400":
 *           $ref: '#/components/responses/400'
 *         "401":
 *           $ref: '#/components/responses/401'
 *         "200":
 *           description: Property info
 *           contents:
 *             application/json
 */
router.post('', authenticationV2, propertyController.createProperty);

/**
 * @swagger
 *   /api/v1/property/{id}:
 *     put:
 *       summary: Update property
 *       tags: [Property]
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: string
 *           required: true
 *           description: Property ID
 *       security: []
 *       responses:
 *         "400":
 *           $ref: '#/components/responses/400'
 *         "401":
 *           $ref: '#/components/responses/401'
 *         "200":
 *           description: Property info
 *           contents:
 *             application/json
 */
router.put('/:id', authenticationV2, propertyController.updateProperty);

/**
 * @swagger
 *   /api/v1/property/{id}:
 *     get:
 *       summary: Get property by ID
 *       tags: [Property]
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: string
 *           required: true
 *           description: Property ID
 *       responses:
 *         "400":
 *           $ref: '#/components/responses/400'
 *         "401":
 *           $ref: '#/components/responses/401'
 *         "200":
 *           description: Property info
 *           contents:
 *             application/json
 */
router.get('/:id', propertyController.getPropertyById);

/**
 * @swagger
 *   /api/v1/property/search:
 *     get:
 *       summary: Search properties
 *       tags: [Property]
 *       responses:
 *         "400":
 *           $ref: '#/components/responses/400'
 *         "401":
 *           $ref: '#/components/responses/401'
 *         "200":
 *           description: List of properties
 *           contents:
 *             application/json
 */
router.get('/search', propertyController.searchProperties);

/**
 * @swagger
 *   /api/v1/property/{id}/availability:
 *     post:
 *       summary: Check property availability
 *       tags: [Property]
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: string
 *           required: true
 *           description: Property ID
 *       responses:
 *         "400":
 *           $ref: '#/components/responses/400'
 *         "401":
 *           $ref: '#/components/responses/401'
 *         "200":
 *           description: Availability info
 *           contents:
 *             application/json
 */
router.post('/:id/availability', propertyController.checkAvailability);

module.exports = router;
