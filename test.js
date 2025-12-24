import generateValue from "./generators/index.js";
import generateObject from "./generateObject.js";

const schema = {
    id :"string",
    num : "integer",
    price: "float",
    yn: "boolean"
};

console.log(generateValue({
  type: "integer",
  min: 10,
  max: 100
})
);