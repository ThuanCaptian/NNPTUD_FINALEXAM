const pool = require('../config/db');
const sql = require('mssql');

// ================= GET ALL =================
exports.getAll = async (req, res) => {
    try {
        const db = await pool;
        const result = await db.request().query("SELECT * FROM Categories");
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching categories" });
    }
};

// ================= GET BY ID =================
exports.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const db = await pool;
        const result = await db.request()
            .input('Id', sql.Int, id)
            .query("SELECT * FROM Categories WHERE Id = @Id");

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.json(result.recordset[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching category" });
    }
};

// ================= CREATE =================
exports.create = async (req, res) => {
    try {
        const { name, description } = req.body;
        const db = await pool;

        await db.request()
            .input('Name', sql.NVarChar, name)
            .input('Description', sql.NVarChar, description)
            .query("INSERT INTO Categories (Name, Description) VALUES (@Name, @Description)");

        res.json({ message: "Category created" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error creating category" });
    }
};

// ================= UPDATE =================
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const db = await pool;

        // Kiểm tra tồn tại
        const existing = await db.request()
            .input('Id', sql.Int, id)
            .query("SELECT * FROM Categories WHERE Id = @Id");

        if (existing.recordset.length === 0) {
            return res.status(404).json({ message: "Category not found" });
        }

        await db.request()
            .input('Id', sql.Int, id)
            .input('Name', sql.NVarChar, name)
            .input('Description', sql.NVarChar, description)
            .query("UPDATE Categories SET Name = @Name, Description = @Description WHERE Id = @Id");

        res.json({ message: "Category updated" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error updating category" });
    }
};

// ================= DELETE =================
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const db = await pool;

        // Kiểm tra tồn tại
        const existing = await db.request()
            .input('Id', sql.Int, id)
            .query("SELECT * FROM Categories WHERE Id = @Id");

        if (existing.recordset.length === 0) {
            return res.status(404).json({ message: "Category not found" });
        }

        await db.request()
            .input('Id', sql.Int, id)
            .query("DELETE FROM Categories WHERE Id = @Id");

        res.json({ message: "Category deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error deleting category" });
    }
};