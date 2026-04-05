const poolPromise = require('../config/db');
const sql = require('mssql');


// ================= GET ALL =================
exports.getAll = async (req, res) => {
    try {
        const db = await poolPromise;

        const result = await db.request()
            .query("SELECT * FROM Reviews");

        res.status(200).json(result.recordset);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// ================= CREATE =================
exports.create = async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;
        const userId = req.user.id;

        const db = await poolPromise;

        await db.request()
            .input('ProductId', sql.Int, productId)
            .input('UserId', sql.Int, userId)
            .input('Rating', sql.Int, rating)
            .input('Comment', sql.NVarChar(sql.MAX), comment)
            .query(`
                INSERT INTO Reviews (ProductId, UserId, Rating, Comment)
                VALUES (@ProductId, @UserId, @Rating, @Comment)
            `);

        res.status(201).json({ message: "Review added" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};