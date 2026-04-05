const sql = require('mssql');
const poolPromise = require('../config/db');

exports.getAll = async (req, res) => {
    try {
        const db = await poolPromise;   // ⚠ BẮT BUỘC

        const result = await db.request().query(`
            SELECT 
                u.Id,
                u.FullName,
                u.Email,
                r.Name AS RoleName,
                u.CreatedAt
            FROM Users u
            JOIN Roles r ON u.RoleId = r.Id
        `);

        res.json(result.recordset);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updateUser = async (req, res) => {
    try {
        const db = await poolPromise;
        const { id } = req.params;
        const { FullName, Email, RoleId } = req.body;

        await db.request()
            .input('Id', sql.Int, id)
            .input('FullName', sql.NVarChar, FullName)
            .input('Email', sql.NVarChar, Email)
            .input('RoleId', sql.Int, RoleId)
            .query(`
                UPDATE Users
                SET FullName = @FullName,
                    Email = @Email,
                    RoleId = @RoleId
                WHERE Id = @Id
            `);

        res.json({ message: 'User updated successfully' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};