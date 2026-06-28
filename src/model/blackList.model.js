const mongooose = require("mongoose")

const tokenBlackListSchema = new mongooose.Schema({
    token: {
        type: String,
        required: [true, "Token is reqwuired to blacklist"],
        unique: [true, "Token is already blacklisted"]
    }
}, { timestamps: true })


tokenBlackListSchema.index({ createdAt: 1 }, {
    expireAfterSeconds: 60 * 60 * 24 * 3 // 3-days
})

const TokenBlackListModel = mongooose.model("tokenBlackList", tokenBlackListSchema)

module.exports = TokenBlackListModel