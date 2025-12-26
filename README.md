# Mock Data Forge

Mock Data Forge is a web-based tool that generates realistic mock data from a user-defined schema.  
It supports both JSON-based schema input and an interactive form builder, making it useful for developers, students, and testers who need sample data quickly.

🔗 **Live Demo:**  
https://mock-data-forge-gamma.vercel.app/

---

##  Features

- Generate mock data from a custom schema
- Two input modes:
  - **JSON Mode** – paste a schema directly
  - **Form Mode** – build schema visually
- Supports nested objects and arrays
- Field constraints:
  - `min`, `max`
  - `enum`
  - `regex`
- Supported data types:
  - `string`, `integer`, `float`, `boolean`
  - `date`, `uuid`
  - `name`, `email`, `phone`
  - `image_url`, `file_url`
  - `object`, `array`
- Copy generated JSON to clipboard
- Fully deployed using **Vercel Serverless Functions**

---

## 🛠 Tech Stack

### Frontend
- HTML
- CSS
- Vanilla JavaScript

### Backend
- Node.js
- Vercel Serverless Functions (`/api/generate`)

### Deployment
- GitHub
- Vercel

---

## 📁 Project Structure

```text
mock_data_forge/
│
├── api/
│   └── generate.js          # Vercel serverless API endpoint
│
├── public/
│   ├── index.html           # Frontend UI
│   ├── script.js
│   └── style.css
│
├── src/
│   ├── cli.js               # CLI interface
│   ├── index.js             # CLI entry point
│   └── validators/
│       └── schemaValidator.js
│
├── generateObject.js        # Core mock data generator (shared logic)
├── generators/              # Field-type generators
├── utils/                   # Helper utilities
├── schema.json              # Sample schema
├── test.js                  # Tests
├── package.json
└── README.md
```
###  How It Works

1️⃣ Schema Input

The user defines a schema either by:

Pasting JSON (JSON Mode), or

Visually adding fields (Form Mode)

Example schema (JSON Mode)
```json
{
  "age": { "type": "integer", "min": 18, "max": 60 },
  "name": { "type": "string" },
  "email": { "type": "email" },
  "isActive": { "type": "boolean" }
}
```
🔹 Object Type (fields required)
```json
{
  "user": {
    "type": "object",
    "fields": {
      "id": { "type": "uuid" },
      "username": { "type": "string" },
      "joinedAt": { "type": "date" }
    }
  }
}
```
```json
🔹 Array Type (element_type required)
{
  "scores": {
    "type": "array",
    "element_type": {
      "type": "integer",
      "min": 0,
      "max": 100
    }
  }
}
```
2️⃣ Frontend Request

When the Generate button is clicked:

The schema and count are collected

A POST request is sent to the API
```js
fetch("/api/generate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ schema, count })
});
```
3️⃣ Serverless API (Vercel)

The API:

Validates the schema

Generates mock objects

Returns JSON data
```js
export default function handler(req, res) {
  validateSchema(schema);
  const results = [];

  for (let i = 0; i < count; i++) {
    results.push(generateObject(schema));
  }

  res.json(results);
}
```
4️⃣ Output

Generated data is displayed as formatted JSON

Users can copy it with one click

🧪 Local Development

Install dependencies:

npm install


Run locally using Vercel:

vercel dev


App runs at:
http://localhost:3000

API endpoint:
http://localhost:3000/api/generate

🚀 Deployment

The project is deployed on Vercel.

To deploy manually:

vercel --prod


Every push to the linked GitHub repository automatically triggers a new deployment.
