const mongoose = require("mongoose")

const accountSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "Account must be associated with a user"],
        index: true // Single field index for user only queries
    },
    status: {
        type: String,
        enum: {
            values: ["ACTIVE", "FROZEN", "CLOSED"],
            message: "Status can be either ACTIVE, FROZEN or CLOSED",
        },
        default: "ACTIVE"
    },
    currency: {
        type: String,
        required: [true, "Currency is required for creating an account"],
        default: "INR"
    }

}, { timestamps: true })

// Compound index to optimize queries filtering by both user and status both
accountSchema.index({ user: 1, status: 1 })

const AccountModel = mongoose.model("account", accountSchema)

module.exports = AccountModel