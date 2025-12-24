import generateValue from "./generators/index.js";
function generateObject(schema){
    const output = {};
    for (let key in schema){
        const field = schema[key];
        if(field.type === "object"){
            output[key] = generateObject(field.fields);
        } else if(field.type === "array"){
            output[key] = Array.from({length: field.count ?? 3}, () => generateValue(field.element_type));
        } else {
            output[key] = generateValue(field);
        }
    }
    return output;
}


export default generateObject;