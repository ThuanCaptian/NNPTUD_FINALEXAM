const poolPromise = require('../config/db');
const sql = require('mssql');


// ================= GET ALL =================
exports.getAll = async (req, res) => {
    try {
        const db = await poolPromise;

        const result = await db.request()
            .query("SELECT * FROM Products");

        res.status(200).json(result.recordset);

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
            .query("SELECT * FROM Products WHERE Id = @Id");

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(result.recordset[0]);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// ================= CREATE =================
exports.create = async (req, res) => {
    try {
        const { name, description, price, stock, categoryId } = req.body;
        const image = req.file ? req.file.filename : null;

        const db = await poolPromise;

        await db.request()
            .input('Name', sql.NVarChar, name)
            .input('Description', sql.NVarChar(sql.MAX), description)
            .input('Price', sql.Decimal(18, 2), price)
            .input('Stock', sql.Int, stock)
            .input('Image', sql.NVarChar, image)
            .input('CategoryId', sql.Int, categoryId)
            .query(`
                INSERT INTO Products (Name, Description, Price, Stock, Image, CategoryId)
                VALUES (@Name, @Description, @Price, @Stock, @Image, @CategoryId)
            `);

        res.status(201).json({ message: "Product created" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// ================= UPDATE =================
exports.update = async (req, res) => {
    try {
        const { name, description, price, stock, categoryId } = req.body;
        const image = req.file ? req.file.filename : null;

        const db = await poolPromise;

        const result = await db.request()
            .input('Id', sql.Int, req.params.id)
            .input('Name', sql.NVarChar, name)
            .input('Description', sql.NVarChar(sql.MAX), description)
            .input('Price', sql.Decimal(18, 2), price)
            .input('Stock', sql.Int, stock)
            .input('Image', sql.NVarChar, image)
            .input('CategoryId', sql.Int, categoryId)
            .query(`
                UPDATE Products
                SET Name=@Name,
                    Description=@Description,
                    Price=@Price,
                    Stock=@Stock,
                    Image=ISNULL(@Image, Image),
                    CategoryId=@CategoryId
                WHERE Id=@Id
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product updated" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// ================= DELETE =================
exports.delete = async (req, res) => {
    try {
        const db = await poolPromise;

        const result = await db.request()
            .input('Id', sql.Int, req.params.id)
            .query("DELETE FROM Products WHERE Id=@Id");

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product deleted" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};