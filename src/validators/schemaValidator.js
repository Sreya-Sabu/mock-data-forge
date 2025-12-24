function validateSchema(schema){
    if (!schema || typeof schema !== "object") {
        throw new Error("Schema is required and must be an object");
    }
    for(let key in schema){
        const field = schema[key];
        if(!field.type) throw new Error("Type should be given");
       const allowedTypes = [
  "string",
  "integer",
  "float",
  "boolean",
  "object",
  "array",
  "name",
  "email",
  "phone",
  "date",
  "image_url",
  "file_url",
  "uuid"
];

if (!allowedTypes.includes(field.type)) {
  throw new Error(`Unsupported type: ${field.type}`);
}

        if (field.enum) {
            if (!Array.isArray(field.enum) || field.enum.length === 0) {
            throw new Error(`Field '${key}': enum must be a non-empty array`);
            }
        }

        if (field.regex && field.type !== "string") {
        throw new Error(`Field '${key}': regex is only allowed for string type`);
        }


        if (field.type === "object") {
            if (!field.fields || typeof field.fields !== "object") {
            throw new Error(`Field '${key}': object type must have fields`);
            }
        validateSchema(field.fields);
        }

        else if (field.type === "array") {
            if (!field.element_type) {
            throw new Error(`Field '${key}': array must have element_type`);
            }
        validateSchema({ temp: field.element_type });
        }

        else if(field.type==="integer"){
           if (
            field.min !== undefined &&
            field.max !== undefined &&
            field.max < field.min
            ) {
            throw new Error(`Field '${key}': min cannot be greater than max`);
        }

        }
    
        else if(field.type==="float"){
           if (
            field.min !== undefined &&
            field.max !== undefined &&
            field.max < field.min
            ) {
            throw new Error(`Field '${key}': min cannot be greater than max`);
        }

        }

        else if(field.type==="string"){
        if (field.regex) {
            try {
            new RegExp(field.regex);
            }  catch {
             throw new Error(`Field '${key}': invalid regex`);
            }
        }

    }
}
}

export default validateSchema;