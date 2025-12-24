import express from "express";
import generateObject from "../generateObject.js"
import validateSchema from "./validators/schemaValidator.js";
import cors from "cors";
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.post("/generate",(req,res)=>{
    try{
    const { schema, count = 1 } = req.body;
    validateSchema(schema);

    const results = [];

    for (let i = 0; i < count; i++) {
    results.push(generateObject(schema));
    }

    return res.json(results);

    
    } catch(err){
       return res.status(400).json({error:err.message});
    }
});



app.listen(3000,() => {
    console.log(`Server running on port ${port}.`);
})