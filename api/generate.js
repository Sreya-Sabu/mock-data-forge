// // /api/generate.js
// import generateObject from "../generateObject.js";
// import validateSchema from "..src/validators/schemaValidator.js";

// export default function handler(req, res) {
//   if (req.method === "POST") {
//     try {
//       const { schema, count = 1 } = req.body;

//       // Validate schema
//       validateSchema(schema);

//       // Generate data
//       const results = [];
//       for (let i = 0; i < count; i++) {
//         results.push(generateObject(schema));
//       }

//       // Return JSON
//       res.status(200).json(results);
//     } catch (err) {
//       res.status(400).json({ error: err.message });
//     }
//   } else {
//     res.setHeader("Allow", "POST");
//     res.status(405).json({ error: `Method ${req.method} not allowed` });
//   }
// }
 
 import generateObject from "../generateObject.js";
 import validateSchema from "../src/validators/schemaValidator.js";
export default function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { schema, count = 1 } = req.body;

      console.log("Schema received:", schema); // Log incoming schema

      validateSchema(schema);
      const results = [];
      for (let i = 0; i < count; i++) {
        results.push(generateObject(schema));
      }

      console.log("Results generated:", results); // Log generated data
      res.status(200).json(results);
    } catch (err) {
      console.error("Error in API:", err); // Log error
      res.status(400).json({ error: err.message });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}

