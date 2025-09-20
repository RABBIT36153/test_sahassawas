const express = require("express");
const cors = require("cors");
const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

// routes
const productRoutes = require("./routes/products");
app.use("/products", productRoutes);
const categoryRoutes = require("./routes/category");
app.use("/category", categoryRoutes);

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));

