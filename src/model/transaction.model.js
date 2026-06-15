const mongoose = require("mongoose")

const transactionSchema = new mongoose.Schema({

    fromAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [true, "Trasanction must be associated with a from account"],
        index: true
    },
    toAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [true, "Trasanction must be associated with a to account"],
        index: true
    },
    status: {
        type: String,
        enum: {
            values: ["PENDING", "COMPLETED", "FAILED", "REVERSED"],
            message: "Status either be PENDING , COMPLETED, FAILED OR REVERSED"
        },
        default: "PENDING"
    },
    amount: {
        type: Number,
        required: [true, "Amount is required for creating a transaction"],
        min: [0, "Transaction amount cannot be negative"],
    },
    // unique identifier to avoid the twice transaction
    idempotencyKey: {
        type: String,
        required: [true, "Idempotency key is required for creating the transaction"],
        index: true,
        unique: true
    },

}, { timestamps: true })

// Compound index to optimize queries filtering by both user and status both
transactionSchema.index({ user: 1, status: 1 })

const TransactionModel = mongoose.model("transaction", transactionSchema)

module.exports = TransactionModel