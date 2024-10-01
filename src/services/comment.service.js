const Comment = require('../models/comment.model');
const { convert2ObjectId } = require("../utils");
const { Api404Error } = require("../core/error.response");
const { PropertyService } = require("./property.service");

class CommentService {
    static async createComment({ propertyId, userId, content, parentCommentId = null }) {
        await this.validatePropertyExists(propertyId);

        const comment = new Comment({
            property: propertyId,
            user: userId,
            content: content,
            parentComment: parentCommentId
        });

        let rightValue = 0;
        if (parentCommentId) {
            const parentComment = await Comment.findById(parentCommentId);
            if (!parentComment) throw new Api404Error('Parent comment not found');

            rightValue = parentComment.comment_right;

            await Comment.updateMany({
                property: convert2ObjectId(propertyId),
                comment_right: { $gte: rightValue }
            }, { $inc: { comment_right: 2 } });

            await Comment.updateMany({
                property: convert2ObjectId(propertyId),
                comment_left: { $gt: rightValue }
            }, { $inc: { comment_left: 2 } });
        } else {
            const maxRightValue = await Comment.findOne({
                property: convert2ObjectId(propertyId)
            }, 'comment_right', { sort: { comment_right: -1 } });

            rightValue = maxRightValue ? maxRightValue.comment_right + 1 : 1;
        }

        comment.comment_left = rightValue;
        comment.comment_right = rightValue + 1;

        await comment.save();
        return comment;
    }

    static async getCommentsByParentId({ propertyId, parentCommentId = null, limit = 50, offset = 0 }) {
        if (parentCommentId) {
            const parent = await Comment.findById(parentCommentId);
            if (!parent) throw new Api404Error('Not found comment for property');

            return Comment.find({
                property: convert2ObjectId(propertyId),
                comment_left: { $gt: parent.comment_left },
                comment_right: { $lte: parent.comment_right }
            }).select({
                comment_left: 1,
                comment_right: 1,
                content: 1,
                parentComment: 1
            }).sort({ comment_left: 1 });
        }

        return Comment.find({
            property: convert2ObjectId(propertyId),
            parentComment: parentCommentId
        }).select({
            comment_left: 1,
            comment_right: 1,
            content: 1,
            parentComment: 1
        }).sort({ comment_left: 1 });
    }

    static async validatePropertyExists(propertyId) {
        const foundProperty = await PropertyService.getPropertyById({ propertyId });
        if (!foundProperty) throw new Api404Error('Property not found');
    }

    static async deleteComment({ propertyId, commentId }) {
        await this.validatePropertyExists(propertyId);

        const comment = await Comment.findById(commentId);
        if (!comment) throw new Api404Error('Comment not found');

        const leftValue = comment.comment_left;
        const rightValue = comment.comment_right;
        const width = rightValue - leftValue + 1;

        await Comment.deleteMany({
            property: convert2ObjectId(propertyId),
            comment_left: { $gte: leftValue, $lte: rightValue }
        });

        await Comment.updateMany({
            property: convert2ObjectId(propertyId),
            comment_right: { $gt: rightValue }
        }, { $inc: { comment_right: -width } });

        await Comment.updateMany({
            property: convert2ObjectId(propertyId),
            comment_left: { $gt: leftValue }
        }, { $inc: { comment_left: -width } });

        return true;
    }
}

module.exports = { CommentService };
