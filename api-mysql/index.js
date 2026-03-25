require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const cloudinary = require('./cloudinary');
const pool = require('./db');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

// 1. CREATE: Subir imagen e insertar datos
app.post('/motos', upload.single('imagen'), async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path);
        const { marca, modelo, cilindrada } = req.body;

        const sql = 'INSERT INTO motos (marca, modelo, cilindrada, imagen_url) VALUES (?, ?, ?, ?)';
        const [rows] = await pool.query(sql, [marca, modelo, cilindrada, result.secure_url]);

        res.status(201).json({ 
            id: rows.insertId, 
            marca, modelo, cilindrada, 
            imagen_url: result.secure_url 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. READ ALL: Obtener todas las motos
app.get('/motos', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM motos ORDER BY id DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. READ ONE: Obtener una sola moto por ID
app.get('/motos/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM motos WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: "Moto no encontrada" });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. UPDATE: Editar datos (Solo texto por ahora)
app.put('/motos/:id', async (req, res) => {
    try {
        const { marca, modelo, cilindrada } = req.body;
        const sql = 'UPDATE motos SET marca = ?, modelo = ?, cilindrada = ? WHERE id = ?';
        const [result] = await pool.query(sql, [marca, modelo, cilindrada, req.params.id]);

        if (result.affectedRows === 0) return res.status(404).json({ error: "No se encontró la moto" });
        res.json({ message: "Moto actualizada correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 5. DELETE: Eliminar moto
app.delete('/motos/:id', async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM motos WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "ID no existe" });
        res.json({ message: "Moto eliminada de MySQL" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 API MySQL lista en puerto ${PORT}`));
