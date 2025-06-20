const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());


const productRoutes = require("./routes/products");
const employeeRoutes = require("./routes/employee");
const categoryRoutes = require("./routes/category");

app.use("/api", [
       productRoutes,
       employeeRoutes,
       categoryRoutes
  ]);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
