const express = require("express");
const router = express.Router();
const db = require("../db");



// Отримати всі товари
router.get("/products/", async (req, res) => {
    try {
        const result = await db.any('SELECT * FROM "Product"');
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Помилка при отриманні товарів" });
    }
});

// Додати новий товар
router.post("/products/", async (req, res) => {
    const {id_product, product_name, characteristics, category_number } = req.body;

    try {
        const result = await db.one(
            'INSERT INTO "Product" (id_product, product_name, characteristics, category_number) VALUES ($1, $2, $3, $4) RETURNING *',
            [id_product, product_name, characteristics, category_number]
        );

        res.status(201).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Помилка при додаванні товару" });
    }
});

// Видалити товар за id
router.delete("/products/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.result(
            'DELETE FROM "Product" WHERE id_product = $1',
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Товар не знайдено" });
        }

        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Помилка при видаленні товару" });
    }
});

// сортувати товар пр категорії
router.get('/products/category/:categoryNumber', async (req, res) => {
    const { categoryNumber } = req.params;
    try {
        const products = await db.any(
            'SELECT * FROM "Product" WHERE category_number = $1',
            [categoryNumber]
        );
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Помилка при отриманні товарів за категорією' });
    }
});

// товар по категоріям
router.get("/products/by-category", async (req, res) => {
    try {
        const result = await db.any(`
            SELECT p.id_product, p.product_name, p.characteristics, c.category_name
            FROM "Product" p
            LEFT JOIN "Category" c ON p.category_number = c.category_number
            ORDER BY c.category_name, p.product_name
        `);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Помилка при отриманні товарів по категоріях" });
    }
});



module.exports = router;
