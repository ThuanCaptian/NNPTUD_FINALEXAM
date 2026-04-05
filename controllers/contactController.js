const poolPromise = require('../config/db');
const sql = require('mssql');

// ================= GET ALL =================
exports.getAll = async (req, res) => {
    try {
        const db = await poolPromise;
        const result = await db.request().query("SELECT * FROM Contacts");
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
            .query("SELECT * FROM Contacts WHERE Id = @Id");

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Contact not found" });
        }

        res.json(result.recordset[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ================= CREATE =================
exports.create = async (req, res) => {
    try {
        const { fullName, email, message } = req.body;
        const db = await poolPromise;

        await db.request()
            .input('FullName', sql.NVarChar, fullName)
            .input('Email', sql.NVarChar, email)
            .input('Message', sql.NVarChar(sql.MAX), message)
            .query(`
                INSERT INTO Contacts (FullName, Email, Message)
                VALUES (@FullName, @Email, @Message)
            `);

        res.json({ message: "Contact sent" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ================= UPDATE =================
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, email, message } = req.body;
        const db = await poolPromise;

        // Kiểm tra tồn tại
        const existing = await db.request()
            .input('Id', sql.Int, id)
            .query("SELECT * FROM Contacts WHERE Id = @Id");

        if (existing.recordset.length === 0) {
            return res.status(404).json({ message: "Contact not found" });
        }

        await db.request()
            .input('Id', sql.Int, id)
            .input('FullName', sql.NVarChar, fullName)
            .input('Email', sql.NVarChar, email)
            .input('Message', sql.NVarChar(sql.MAX), message)
            .query("UPDATE Contacts SET FullName = @FullName, Email = @Email, Message = @Message WHERE Id = @Id");

        res.json({ message: "Contact updated" });
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
            .query("SELECT * FROM Contacts WHERE Id = @Id");

        if (existing.recordset.length === 0) {
            return res.status(404).json({ message: "Contact not found" });
        }

        await db.request()
            .input('Id', sql.Int, id)
            .query("DELETE FROM Contacts WHERE Id = @Id");

        res.json({ message: "Contact deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};