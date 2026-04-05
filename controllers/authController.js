const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sql = require('mssql');
const poolPromise = require('../config/db');


// ================= REGISTER =================
exports.register = async (req, res) => {
    try {
        const { fullName, email, password, roleId } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        const db = await poolPromise;

        await db.request()
            .input('FullName', sql.NVarChar, fullName)
            .input('Email', sql.NVarChar, email)
            .input('PasswordHash', sql.NVarChar, hashedPassword)
            .input('RoleId', sql.Int, roleId || 3) // mặc định User
            .query(`
                INSERT INTO Users (FullName, Email, PasswordHash, RoleId)
                VALUES (@FullName, @Email, @PasswordHash, @RoleId)
            `);

        res.status(201).json({ message: 'Register success' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// ================= LOGIN =================
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const db = await poolPromise;

        const result = await db.request()
            .input('Email', sql.NVarChar, email)
            .query(`
                SELECT 
                    u.Id,
                    u.FullName,
                    u.Email,
                    u.PasswordHash,
                    r.Name AS RoleName
                FROM Users u
                JOIN Roles r ON u.RoleId = r.Id
                WHERE u.Email = @Email
            `);

        if (result.recordset.length === 0) {
            return res.status(400).json({ message: 'User not found' });
        }

        const user = result.recordset[0];

        const isMatch = await bcrypt.compare(password, user.PasswordHash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Wrong password' });
        }

        const token = jwt.sign(
            {
                id: user.Id,            // sửa đúng Id
                role: user.RoleName,    // lấy từ r.Name AS RoleName
                email: user.Email
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            message: 'Login success',
            token
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};