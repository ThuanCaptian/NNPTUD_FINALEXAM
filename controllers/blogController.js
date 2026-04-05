const poolPromise = require('../config/db');
const sql = require('mssql');
const fs = require('fs');
const path = require('path');

// ================= GET ALL =================
exports.getAll = async (req, res) => {
    try {
        const db = await poolPromise;
        const result = await db.request().query("SELECT * FROM Blogs");
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
            .query("SELECT * FROM Blogs WHERE Id = @Id");

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Blog not found" });
        }

        res.json(result.recordset[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ================= CREATE =================
exports.create = async (req, res) => {
    try {
        const { title, content } = req.body;
        const image = req.file ? req.file.filename : null;
        const authorId = req.user.id;

        const db = await poolPromise;

        await db.request()
            .input('Title', sql.NVarChar, title)
            .input('Content', sql.NVarChar(sql.MAX), content)
            .input('Image', sql.NVarChar, image)
            .input('AuthorId', sql.Int, authorId)
            .query(`
                INSERT INTO Blogs (Title, Content, Image, AuthorId)
                VALUES (@Title, @Content, @Image, @AuthorId)
            `);

        res.json({ message: "Blog created" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ================= UPDATE =================
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        const db = await poolPromise;

        // Lấy blog hiện tại
        const blog = await db.request()
            .input('Id', sql.Int, id)
            .query("SELECT * FROM Blogs WHERE Id = @Id");

        if (blog.recordset.length === 0) {
            return res.status(404).json({ message: "Blog not found" });
        }

        const oldImage = blog.recordset[0].Image;
        const newImage = req.file ? req.file.filename : oldImage;

        // Nếu có ảnh mới, xóa ảnh cũ
        if (req.file && oldImage) {
            const oldPath = path.join(__dirname, '../uploads', oldImage);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }

        await db.request()
            .input('Id', sql.Int, id)
            .input('Title', sql.NVarChar, title)
            .input('Content', sql.NVarChar(sql.MAX), content)
            .input('Image', sql.NVarChar, newImage)
            .query("UPDATE Blogs SET Title = @Title, Content = @Content, Image = @Image WHERE Id = @Id");

        res.json({ message: "Blog updated" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ================= DELETE =================
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const db = await poolPromise;

        // Lấy blog hiện tại
        const blog = await db.request()
            .input('Id', sql.Int, id)
            .query("SELECT * FROM Blogs WHERE Id = @Id");

        if (blog.recordset.length === 0) {
            return res.status(404).json({ message: "Blog not found" });
        }

        const image = blog.recordset[0].Image;

        // Xóa khỏi database
        await db.request()
            .input('Id', sql.Int, id)
            .query("DELETE FROM Blogs WHERE Id = @Id");

        // Xóa ảnh cũ
        if (image) {
            const imgPath = path.join(__dirname, '../uploads', image);
            if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
        }

        res.json({ message: "Blog deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};