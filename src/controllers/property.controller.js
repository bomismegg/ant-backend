const catchAsync = require('../helpers/catch.async');
const { OK } = require("../core/success.response");
const { PropertyService } = require("../services/property.service");

class PropertyController {
    createProperty = catchAsync(async (req, res, next) => {
        OK(res, "Create property success",
            await PropertyService.createProperty({
                ...req.body,
                hostId: req.user.userId
            }));
    });

    updateProperty = catchAsync(async (req, res) => {
        OK(res, "Update property success",
            await PropertyService.updateProperty({
                ...req.body,
                propertyId: req.params.id,
                hostId: req.user.userId
            }));
    });

    getPropertyById = catchAsync(async (req, res) => {
        OK(res, "Get property success",
            await PropertyService.getPropertyById({ propertyId: req.params.id }));
    });

    searchProperties = catchAsync(async (req, res) => {
        OK(res, "Search properties success",
            await PropertyService.searchProperties(req.query));
    });

    deleteProperty = catchAsync(async (req, res) => {
        OK(res, "Delete property success",
            await PropertyService.deleteProperty({
                propertyId: req.params.id,
                hostId: req.user.userId
            }));
    });

    checkAvailability = catchAsync(async (req, res) => {
        OK(res, "Check availability success",
            await PropertyService.checkAvailability({
                propertyId: req.params.id,
                startDate: req.body.startDate,
                endDate: req.body.endDate
            }));
    });
}

module.exports = new PropertyController();
