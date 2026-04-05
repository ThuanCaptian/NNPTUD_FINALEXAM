const poolPromise = require('../config/db');
const sql = require('mssql');


// ================= GET ALL =================
exports.getAll = async (req, res) => {
    try {
        const db = await poolPromise;

        const result = await db.request()
            .query("SELECT * FROM Orders");

        res.json(result.recordset);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// ================= GET BY ID =================
exports.getById = async (req, res) => {
    try {
        const db = await poolPromise;

        const result = await db.request()
            .input('Id', sql.Int, req.params.id)
            .query("SELECT * FROM Orders WHERE Id=@Id");

        if (result.recordset.length === 0)
            return res.status(404).json({ message: "Order not found" });

        res.json(result.recordset[0]);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// ================= CREATE =================
exports.create = async (req, res) => {
    try {
        const { userId, totalAmount, status } = req.body;

        const db = await poolPromise;

        await db.request()
            .input('UserId', sql.Int, userId)
            .input('TotalAmount', sql.Decimal(18, 2), totalAmount)
            .input('Status', sql.NVarChar, status)
            .query(`
                INSERT INTO Orders (UserId, TotalAmount, Status)
                VALUES (@UserId, @TotalAmount, @Status)
            `);

        res.json({ message: "Order created" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// ================= UPDATE =================
exports.update = async (req, res) => {
    try {
        const { totalAmount, status } = req.body;

        const db = await poolPromise;

        await db.request()
            .input('Id', sql.Int, req.params.id)
            .input('TotalAmount', sql.Decimal(18, 2), totalAmount)
            .input('Status', sql.NVarChar, status)
            .query(`
                UPDATE Orders
                SET TotalAmount=@TotalAmount,
                    Status=@Status
                WHERE Id=@Id
            `);

        res.json({ message: "Order updated" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// ================= DELETE =================
exports.delete = async (req, res) => {
    try {
        const db = await poolPromise;

        await db.request()
            .input('Id', sql.Int, req.params.id)
            .query("DELETE FROM Orders WHERE Id=@Id");

        res.json({ message: "Order deleted" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};