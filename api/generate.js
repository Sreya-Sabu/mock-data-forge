import express from "express";
import generateObject from "../generateObject.js";
import validateSchema from "../validators/schemaValidator.js";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/generate", (req, res) => {
  try {
    const { schema, count = 1 } = req.body;
    validateSchema(schema);

    const results = [];
    for (let i = 0; i < count; i++) {
      results.push(generateObject(schema));
    }

    res.json(results);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🚨 NO app.listen()
export default app;
