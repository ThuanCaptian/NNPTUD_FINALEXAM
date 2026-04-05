const poolPromise = require('../config/db');
const sql = require('mssql');


// ================= GET ALL =================
exports.getAll = async (req, res) => {
    try {
        const db = await poolPromise;

        const result = await db.request()
            .query("SELECT * FROM Payments");

        res.json(result.recordset);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// ================= CREATE =================
exports.create = async (req, res) => {
    try {
        const { orderId, paymentMethod, paymentStatus } = req.body;

        const db = await poolPromise;

        await db.request()
            .input('OrderId', sql.Int, orderId)
            .input('PaymentMethod', sql.NVarChar, paymentMethod)
            .input('PaymentStatus', sql.NVarChar, paymentStatus)
            .query(`
                INSERT INTO Payments (OrderId, PaymentMethod, PaymentStatus)
                VALUES (@OrderId, @PaymentMethod, @PaymentStatus)
            `);

        res.json({ message: "Payment created" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};