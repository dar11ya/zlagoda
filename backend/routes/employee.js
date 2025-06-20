const express = require("express");
const router = express.Router();
const db = require("../db");

// Отримати всих працівників
router.get("/employee/", async (req, res) => {
    try {
        const result = await db.any('SELECT * FROM "Employee"');
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Помилка при отриманні співробітників" });
    }
});

// Додати нового працівника
router.post("/employee/", async (req, res) => {
    const {
        id_employee,
        empl_surname,
        empl_name,
        empl_patronymic,
        empl_role,
        salary,
        date_of_birth,
        date_of_start,
        phone_number,
        city,
        street,
        zip_code
    } = req.body;

    try {
        const result = await db.one(
            `INSERT INTO "Employee" (
                id_employee,
                empl_surname,
                empl_name,
                empl_patronymic,
                empl_role,
                salary,
                date_of_birth,
                date_of_start,
                phone_number,
                city,
                street,
                zip_code
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
            ) RETURNING *`,
            [
                id_employee,
                empl_surname,
                empl_name,
                empl_patronymic,
                empl_role,
                salary,
                date_of_birth,
                date_of_start,
                phone_number,
                city,
                street,
                zip_code
            ]
        );

        res.status(201).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Помилка при додаванні працівника" });
    }
});

// Видалення співробітника по id
router.delete("/employee/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.result(
            'DELETE FROM "Employee" WHERE id_employee = $1',
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Працівника не знайдено" });
        }

        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Помилка при видаленні працівника" });
    }
});

// сортувати по ролях
router.get("/employees/by-role", async (req, res) => {
    try {
        const result = await db.any(`
            SELECT 
                id_employee, empl_surname, empl_name, empl_patronymic,
                empl_role, phone_number, date_of_birth
            FROM "Employee"
            ORDER BY empl_role, empl_surname
        `);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Помилка при отриманні співробітників" });
    }
});



module.exports = router;
