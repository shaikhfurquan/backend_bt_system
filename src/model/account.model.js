const mongoose = require("mongoose")
const LedgerModel = require("./ledger.model")

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

accountSchema.methods.getBalance = async function () {
    const balanceData = await LedgerModel.aggregate([
        { $match: { account: this._id } },          // Filter ledger entries for this account
        {
            $group: {                               // Sum all DEBIT and CREDIT entries
                _id: null,
                totalDebit: {
                    $sum: {
                        $cond: [
                            { $eq: ["$type", "DEBIT"] },
                            "$amount",
                            0
                        ]
                    }
                },                                   // Sum all DEBIT entries
                totalCredit: {
                    $sum: {
                        $cond: [
                            { $eq: ["$type", "CREDIT"] },
                            "$amount",
                            0
                        ]
                    }
                },                                   // Sum all CREDIT entries
            }
        },
        {
            $project: {
                _id: 0,
                balance: { $subtract: ["$totalCredit", "$totalDebit"] }  // balance = credit - debit
            }
        }
    ])
    if (balanceData.length === 0) {
        return 0                                      // No transactions found, return 0
    }
    return balanceData[0].balance                     // Return calculated balance
}

const AccountModel = mongoose.model("account", accountSchema)

module.exports = AccountModel