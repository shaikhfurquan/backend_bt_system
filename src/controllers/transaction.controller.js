const UserModel = require("../model/user.model")
const AccountModel = require("../model/account.model")
const TransactionModel = require("../model/transaction.model")
const LedgerModel = require("../model/ledger.model")
const emailService = require('../services/email.service')
const mongoose = require("mongoose")


const createTransaction = async (req, res, next) => {
    try {
        // validating the request
        const { fromAccount, toAccount, amount, idempotencyKey } = req.body
        if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
            return res.status(400).json({
                message: "fromAccount , toAccount , amount & idempotencyKey is required"
            })
        }

        const fromUserAccount = await AccountModel.findOne({
            _id: fromAccount
        })
        const toUserAccount = await AccountModel.findOne({
            _id: fromAccount
        })
        if (!fromUserAccount || !toUserAccount) {
            return res.status(400).json({
                message: "Invalid fromAccount or toAccount"
            })
        }

        // validating the idempotencyKey(if trasanction happening twice)
        const isTransactionAlreadyExists = await TransactionModel.findOne({
            idempotencyKey: idempotencyKey
        })

        if (isTransactionAlreadyExists) {
            if (isTransactionAlreadyExists.status === "COMPLETED") {
                return res.status(200).json({
                    message: "Transaction already processed",
                    transaction: isTransactionAlreadyExists
                })
            }

            if (isTransactionAlreadyExists.status === "PENDING") {
                return res.status(200).json({
                    message: "Trasanction is still processing"
                })
            }

            if (isTransactionAlreadyExists.status === "FAILED") {
                return res.status(500).json({
                    message: "Transaction processing failed previously, please retry."
                })
            }

            if (isTransactionAlreadyExists.status === "REVERSED") {
                return res.status(500).json({
                    message: "Transaction was reversed , Please retry"
                })
            }
        }

        // checking account status(for new request)
        if (fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE") {
            return res.status(400).json({
                message: "Both fromAccount and toAccount must be ACTIVE to process transaction"
            })
        }

        //derive sender balance from ledger
        const balance = await fromUserAccount.getBalance()

        if (balance < amount) {
            return res.status(400).json({
                message: `Insufficient balance. Current is ==> ${balance}. Requested amount is ==> ${amount}`
            })
        }
        let transaction;
        try {
            // creating the transaction(session)
            const session = await mongoose.startSession()
            session.startTransaction()

            transaction = (await TransactionModel.create([{
                fromAccount,
                toAccount,
                amount,
                idempotencyKey,
                status: "PENDING"
            }], { session }))[0]

            const debitLedgerEntry = await LedgerModel.create([{
                account: fromAccount,
                amount: amount,
                transaction: transaction._id,
                type: "DEBIT"
            }], { session })


            await (() => {
                return new Promise((resolve) => setTimeout(resolve, 50 * 1000))
            })()


            const creditLedgerEntry = await LedgerModel.create([{
                account: toAccount,
                amount: amount,
                transaction: transaction._id,
                type: "CREDIT"
            }], { session })

            await TransactionModel.findOneAndUpdate(
                { _id: transaction._id },
                { status: "COMPLETED" },
                { session }
            )

            transaction.status = "COMPLETED"
            await transaction.save({ session })

            await session.commitTransaction()
            session.endSession()
        } catch (error) {
            return res.status(400).json({
                message: "Transaction is pending Please try again after some time",

            })
        }

        // sending email notification
        await emailService.sendRegistrationEmail(
            req.user.email,
            req.user.name,
            amount,
            toAccount
        )

        return res.status(201).json({
            message: "Transaction completed successfully",
            transaction: transaction
        })

    } catch (error) {
        next(error)
    }
}


// for initial fund transfrer
const createInitialFundsTransfer = async (req, res, next) => {
    const { toAccount, amount, idempotencyKey } = req.body

    if (!toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            message: "toAccount , amount & idempotencyKey is required"
        })
    }
    console.log(toAccount, amount, idempotencyKey);

    const toUserAccount = await AccountModel.findOne({
        _id: toAccount
    })
    // console.log("to user account" , toUserAccount);
    if (!toUserAccount) {
        return res.status(400).json({
            message: "Invalid toAccount"
        })
    }

    // from system user acccount 
    const fromSystemUserAccount = await AccountModel.findOne({
        // systemUser: true,
        user: req.user._id
    })
    if (!fromSystemUserAccount) {
        return res.status(400).json({
            message: "System user account not found"
        })
    }

    // creating session
    const session = await mongoose.startSession()
    session.startTransaction()

    // creating the client side transaction(creating on the server only not db level)
    const transaction = new TransactionModel({
        fromAccount: fromSystemUserAccount._id,
        toAccount,
        amount,
        idempotencyKey,
        status: "PENDING"
    })

    // debit ledger entry(sending the data in the form of array of object)
    const debitLedgerEntry = await LedgerModel.create([{
        account: fromSystemUserAccount._id,
        amount,
        transaction: transaction._id,
        type: "DEBIT"
    }], { session })


    // creadit ledger entry(sending the data in the form of array of object)
    const creaditLedgerEntry = await LedgerModel.create([{
        account: toAccount,
        amount,
        transaction: transaction._id,
        type: "CREDIT"
    }], { session })

    transaction.status = "COMPLETED"
    await transaction.save({ session })

    await session.commitTransaction()
    await session.endSession()

    return res.status(201).json({
        message: "Initial funds transaction completed successfully",
        transaction
    })


}

module.exports = {
    createTransaction,
    createInitialFundsTransfer
}