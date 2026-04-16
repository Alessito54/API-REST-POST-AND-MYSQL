require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const cloudinary = require('./cloudinary');
const { Moto } = require('./models');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

app.post('/motos', upload.single('imagen'), async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path);
        const nuevaMoto = await Moto.create({
            marca: req.body.marca,
            modelo: req.body.modelo,
            cilindrada: req.body.cilindrada,
            imagen_url: result.secure_url
        });
        res.status(201).json(nuevaMoto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/motos', async (req, res) => {
    const motos = await Moto.findAll();
    res.json(motos);
});

app.get('/motos/:id', async (req, res) => {
    try {
        const moto = await Moto.findByPk(req.params.id);
        if (!moto) return res.status(404).json({ error: "Moto no encontrada" });
        res.json(moto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/motos/:id', upload.single('imagen'), async (req, res) => {
    try {
        const moto = await Moto.findByPk(req.params.id);
        if (!moto) return res.status(404).json({ error: "No existe la moto" });

        if (req.file) {
            try {
                const result = await cloudinary.uploader.upload(req.file.path);
                req.body.imagen_url = result.secure_url;
            } catch (uploadErr) {
                console.error('Error subiendo imagen a Cloudinary:', uploadErr.message);
                return res.status(500).json({ error: 'Error subiendo imagen' });
            }
        }

        await moto.update(req.body);
        res.json(moto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/motos/:id', async (req, res) => {
    try {
        await Moto.destroy({ where: { id: req.params.id } });
        res.json({ message: "Moto eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.use(express.static(path.join(__dirname, 'frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

const PORT = process.env.PORT || 3000;

const db = require('./models');

db.sequelize.sync({ alter: true })
  .then(() => console.log("Tablas sincronizadas con Aiven (Postgres)"))
  .catch(err => console.log(" Error al sincronizar: " + err.message));

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 API Motos lista en puerto ${PORT}`);
});
