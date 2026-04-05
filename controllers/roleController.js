const sql = require('mssql');
const poolPromise = require('../config/db');


// =========================
// GET ALL ROLES
// =========================
exports.getAllRoles = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query('SELECT * FROM Roles');

        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// =========================
// GET ROLE BY ID
// =========================
exports.getRoleById = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('RoleId', sql.Int, req.params.id)
            .query('SELECT * FROM Roles WHERE RoleId = @RoleId');

        if (result.recordset.length === 0)
            return res.status(404).json({ message: 'Role not found' });

        res.json(result.recordset[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// =========================
// CREATE ROLE
// =========================
exports.createRole = async (req, res) => {
    try {
        const { RoleName, Description } = req.body;

        const pool = await poolPromise;
        await pool.request()
            .input('RoleName', sql.NVarChar, RoleName)
            .input('Description', sql.NVarChar, Description)
            .query(`
                INSERT INTO Roles (RoleName, Description)
                VALUES (@RoleName, @Description)
            `);

        res.status(201).json({ message: 'Role created successfully' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// =========================
// UPDATE ROLE
// =========================
exports.updateRole = async (req, res) => {
    try {
        const { RoleName, Description } = req.body;

        const pool = await poolPromise;
        const result = await pool.request()
            .input('RoleId', sql.Int, req.params.id)
            .input('RoleName', sql.NVarChar, RoleName)
            .input('Description', sql.NVarChar, Description)
            .query(`
                UPDATE Roles
                SET RoleName = @RoleName,
                    Description = @Description
                WHERE RoleId = @RoleId
            `);

        if (result.rowsAffected[0] === 0)
            return res.status(404).json({ message: 'Role not found' });

        res.json({ message: 'Role updated successfully' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// =========================
// DELETE ROLE
// =========================
exports.deleteRole = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('RoleId', sql.Int, req.params.id)
            .query('DELETE FROM Roles WHERE RoleId = @RoleId');

        if (result.rowsAffected[0] === 0)
            return res.status(404).json({ message: 'Role not found' });

        res.json({ message: 'Role deleted successfully' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};