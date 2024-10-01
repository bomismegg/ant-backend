const { Property } = require("../property.model");
const { Types } = require("mongoose");
const { BusinessLogicError } = require("../../core/error.response");
const ApiFeatures = require("./../../utils/api-feature.util");

// Publish property by host
const publishPropertyByHost = async ({ hostId, propertyId }) => {
    const foundProperty = await Property.findOne({
        host: new Types.ObjectId(hostId),
        _id: new Types.ObjectId(propertyId),
    });

    if (!foundProperty) return foundProperty;

    foundProperty.isDraft = false;
    foundProperty.isPublished = true;

    const { modifiedCount } = await foundProperty.update(foundProperty);

    return modifiedCount;
};

// Get all drafts for a host
const findAllDraftsForHost = async ({ query, limit, skip }) => {
    return await queryProperty({ query, limit, skip });
};

// Get all published properties for a host
const findAllPublishedForHost = async ({ query, limit, skip }) => {
    return await queryProperty({ query, limit, skip });
};

// Search property by user input
const searchPropertyByUser = async ({ keySearch }) => {
    const regexSearch = new RegExp(keySearch);
    return await Property.find({
        isPublished: true,
        $text: { $search: regexSearch },
    }, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } })
        .lean();
};

// Find all properties
const findAllProperties = async ({ limit, sort, page, filter, select }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
    return await Property.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(select)
        .lean();
};

// Find property by ID
const findById = async (propertyId, unSelect) => {
    return await Property.findById(propertyId).select(unSelect);
};

// Query properties
const queryProperty = async ({ query, limit, skip }) => {
    return await Property.find(query)
        .populate('host', 'name email -_id')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec();
};

// Update property by ID
const updatePropertyById = async ({ propertyId, bodyUpdate, model, isNew = true }) => {
    return await model.findByIdAndUpdate(propertyId, bodyUpdate, { new: isNew });
};

// Advanced property search
const advancedSearch = async (queryInput) => {
    const excludedFields = ['page', 'sort', 'size', 'fields'];
    excludedFields.forEach(el => delete queryInput[el]);

    let queryStr = JSON.stringify(queryInput);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    queryStr = JSON.parse(queryStr);

    let query = Property.find(queryStr);

    if (queryInput.sort) {
        const sortBy = queryInput.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    if (queryInput.fields) {
        const fields = queryInput.fields.split(',').join(' ');
        query = query.select(fields);
    } else {
        query = query.select('-__v');
    }

    const page = queryInput.page * 1 || 1;
    const size = queryInput.size * 1 || 100;
    const offset = (page - 1) * size;

    query = query.skip(offset).limit(size);

    if (queryInput.page) {
        const total = await Property.countDocuments();
        if (offset >= total) throw new BusinessLogicError('This page does not exist');
    }

    return await query;
};

// Advanced search with pagination and filters
const advancedSearchV2 = async (queryInput) => {
    const features = new ApiFeatures(Property.find(), queryInput)
        .filter()
        .sort()
        .limitFields()
        .paging();

    return await features.query;
};

module.exports = {
    findAllDraftsForHost,
    findAllPublishedForHost,
    publishPropertyByHost,
    searchPropertyByUser,
    findAllProperties,
    findById,
    updatePropertyById,
    advancedSearch,
    advancedSearchV2
};
