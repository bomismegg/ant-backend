const { BusinessLogicError } = require("../core/error.response");
const { convert2ObjectId } = require("../utils");
const discountModel = require('../models/discount.model');
const { findAllProperties } = require("../models/repositories/property.repo");
const { findAllDiscountCodesUnSelect, checkDiscountExists } = require("../models/repositories/discount.repo");

class DiscountService {

    static async createDiscountCode(payload) {
        const {
            code, start_date, end_date, is_active, shopId, min_order_value,
            property_ids, applies_to, name, description, type, users_used,
            value, max_value, max_users, users_count, max_uses_per_user
        } = payload;

        // Validate date ranges
        if (new Date() > new Date(start_date) || new Date() > new Date(end_date)) {
            throw new BusinessLogicError('Discount code has expired');
        }

        if (new Date(end_date) < new Date(start_date)) {
            throw new BusinessLogicError('End date more than start date');
        }

        // Check if discount code already exists
        const foundDiscount = await discountModel.findOne({
            discountCode: code,
            discount_shop_id: convert2ObjectId(shopId)
        }).lean();

        if (foundDiscount && foundDiscount.isActive) {
            throw new BusinessLogicError('Discount exists');
        }

        // Create new discount
        return await discountModel.create({
            discountName: name,
            description: description,
            discountType: type,
            discountCode: code,
            discountValue: value,
            minOrderValue: min_order_value || 0,
            discount_max_value: max_value,
            startDate: new Date(start_date),
            endDate: new Date(end_date),
            maxUses: max_users,
            currentUses: users_count,
            discountUsersUsed: users_used,
            discount_shop_id: shopId,
            maxUsesPerUser: max_uses_per_user,
            isActive: is_active,
            appliesTo: applies_to,
            propertyIds: applies_to === 'all' ? [] : property_ids
        });
    }

    static async getAllDiscountCodeWithProperty({ code, shopId, userId, limit, page }) {
        const foundDiscount = await discountModel.findOne({
            discountCode: code,
            discount_shop_id: convert2ObjectId(shopId)
        });

        if (!foundDiscount || !foundDiscount.isActive) {
            throw new BusinessLogicError('Discount not exists');
        }

        const { appliesTo, propertyIds } = foundDiscount;
        let filter;
        if (appliesTo === 'all') {
            filter = { shopId: convert2ObjectId(shopId), isPublished: true };
        } else {
            filter = { _id: { $in: propertyIds }, isPublished: true };
        }

        return await findAllProperties({
            filter,
            limit: +limit,
            page: +page,
            sort: 'ctime',
            select: ['property_name']
        });
    }

    static async getDiscountAmount({ codeId, userId, shopId, properties }) {
        const foundDiscount = await checkDiscountExists({
            model: discountModel,
            filter: {
                discountCode: codeId,
                discount_shop_id: convert2ObjectId(shopId)
            }
        });

        if (!foundDiscount) {
            throw new BusinessLogicError('Discount not exists');
        }

        const { discount_is_active, discount_max_uses, discount_start_date, discount_end_date, discount_min_order_value, discount_type, discount_value } = foundDiscount;

        if (!discount_is_active || discount_max_uses === 0) {
            throw new BusinessLogicError('Discount expired or no longer available');
        }

        let totalOrder = 0;
        totalOrder = properties.reduce((acc, property) => acc + (property.quantity * property.price), 0);

        if (totalOrder < discount_min_order_value) {
            throw new BusinessLogicError(`Discount requires a minimum order value of ${discount_min_order_value}`);
        }

        const amount = discount_type === 'fixed_amount' ? discount_value : (totalOrder * (discount_value / 100));

        return { totalOrder, discount: amount, totalPrice: totalOrder - amount };
    }
}

module.exports = { DiscountService };
