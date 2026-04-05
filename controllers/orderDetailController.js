const poolPromise = require('../config/db');
const sql = require('mssql');

// ================= GET ALL =================
exports.getAll = async (req, res) => {
    try {
        const db = await poolPromise;
        const result = await db.request().query("SELECT * FROM OrderDetails");
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ================= GET BY ID =================
exports.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const db = await poolPromise;

        const result = await db.request()
            .input('Id', sql.Int, id)
            .query("SELECT * FROM OrderDetails WHERE Id = @Id");

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "OrderDetail not found" });
        }

        res.json(result.recordset[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ================= CREATE =================
exports.create = async (req, res) => {
    try {
        const { orderId, productId, quantity, price } = req.body;
        const db = await poolPromise;

        await db.request()
            .input('OrderId', sql.Int, orderId)
            .input('ProductId', sql.Int, productId)
            .input('Quantity', sql.Int, quantity)
            .input('Price', sql.Decimal(18, 2), price)
            .query(`
                INSERT INTO OrderDetails (OrderId, ProductId, Quantity, Price)
                VALUES (@OrderId, @ProductId, @Quantity, @Price)
            `);

        res.json({ message: "OrderDetail created" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ================= UPDATE =================
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { orderId, productId, quantity, price } = req.body;
        const db = await poolPromise;

        // Kiểm tra tồn tại
        const existing = await db.request()
            .input('Id', sql.Int, id)
            .query("SELECT * FROM OrderDetails WHERE Id = @Id");

        if (existing.recordset.length === 0) {
            return res.status(404).json({ message: "OrderDetail not found" });
        }

        await db.request()
            .input('Id', sql.Int, id)
            .input('OrderId', sql.Int, orderId)
            .input('ProductId', sql.Int, productId)
            .input('Quantity', sql.Int, quantity)
            .input('Price', sql.Decimal(18, 2), price)
            .query(`
                UPDATE OrderDetails
                SET OrderId = @OrderId, ProductId = @ProductId, Quantity = @Quantity, Price = @Price
                WHERE Id = @Id
            `);

        res.json({ message: "OrderDetail updated" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ================= DELETE =================
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const db = await poolPromise;

        // Kiểm tra tồn tại
        const existing = await db.request()
            .input('Id', sql.Int, id)
            .query("SELECT * FROM OrderDetails WHERE Id = @Id");

        if (existing.recordset.length === 0) {
            return res.status(404).json({ message: "OrderDetail not found" });
        }

        await db.request()
            .input('Id', sql.Int, id)
            .query("DELETE FROM OrderDetails WHERE Id = @Id");

        res.json({ message: "OrderDetail deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};