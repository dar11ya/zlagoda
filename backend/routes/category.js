 const express = require("express");
const router = express.Router();
const db = require("../db");

 // Отримати всі категорії
 router.get("/category/", async (req, res) => {
     try {
         const result = await db.any('SELECT * FROM "Category"');
         res.json(result);
     } catch (err) {
         console.error(err);
         res.status(500).json({ error: "Помилка при отриманні списка категорій" });
     }
 });

 // Додати нову категорію
 router.post("/category/", async (req, res) => {
     const {category_number, category_name} = req.body;

     try {
         const result = await db.one(
             'INSERT INTO "Category" (category_number, category_name) VALUES ($1, $2) RETURNING *',
             [category_number, category_name]
         );

         res.status(201).json(result);
     } catch (err) {
         console.error(err);
         res.status(500).json({ error: "Помилка при додаванні категорії" });
     }
 });

// Видалення категорію по id
router.delete("/category/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.result(
            'DELETE FROM "Category" WHERE category_number = $1',
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Категорію не знайдено" });
        }

        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Помилка при видаленні категорії" });
    }
});


 router.get("/products-by-category", async (req, res) => {
     try {
         const result = await db.any(`
             SELECT
                 c.category_name AS "category",
                 COUNT(p.id_product) AS "total_products"
             FROM "Product" p
                      JOIN "Category" c ON p.category_number = c.category_number
             GROUP BY c.category_name
             ORDER BY COUNT(p.id_product) DESC
        `);
         res.json(result);
     } catch (err) {
         console.error("Помилка при виконанні SQL-запиту:", err);
         res.status(500).json({ error: "Помилка при отриманні статистики" });
     }
 });

module.exports = router;
