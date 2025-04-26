const mongoose = require('mongoose');

const DesignSchema = new mongoose.Schema({
    designerName: {
        type: String,
        required: true,
        trim: true
    },
    designerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Designer',
        required: true
    },
    ratings: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            value: {
                type: Number,
                min: 0,
                max: 5,
                required: true
            }
        }
    ],
    graphic: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Design', DesignSchema);