import expandCharSet from "../utils/expandCharSet.js";
import generateObject from "../generateObject.js";
import RandExp from "randexp";
import { faker } from '@faker-js/faker';


function generateValue(config){
    
     if(config.enum && config.enum.length){
        const values = config.enum;
        return values[Math.floor(Math.random() * values.length)];
    }

     if (config.type === "object") {
      return generateObject(config.fields);
    }

    if (config.type === "array") {
      return Array.from(
          { length: config.count ?? 5 },
          () => generateValue(config.element_type)
      );
    }

    


    const {type} = config;
   
    if(type==="string" && config.regex){
    return new RandExp(config.regex).gen();
    }

    // if(type==="string"&&config.regex){
    //     const charSetMatch = config.regex.match(/\[([^\]]+)\]/);
    //     const lengthMatch = config.regex.match(/\{(\d+)(?:,(\d+))?\}/);
    //     const minLen = Number(lengthMatch[1]);
    //     const maxLen = lengthMatch[2] ? Number(lengthMatch[2]) : minLen;

    //     const chars = expandCharSet(charSetMatch);
    //     const length =
    //     minLen === maxLen
    //     ? minLen
    //     : Math.floor(Math.random() * (maxLen - minLen + 1)) + minLen;

    //     let result = "";
    //     for (let i = 0; i < length; i++) {
    //     result += chars[Math.floor(Math.random() * chars.length)];
    // }
    // return result;


    //}
    switch(type){
       
        case "name": return faker.person.fullName();
        case "email": return faker.internet.email();
        case "phone": return faker.phone.number();
        case "date": return faker.date.anytime().toISOString();

        case "boolean": return Math.random()>0.5;
        case "uuid": return faker.string.uuid();
        
        case "integer": {
            const min = config.min?? 0;
            const max = config.max?? 100;
            return Math.floor(Math.random()*(max-min+1)) + min;
        }
       
        case "float" :{ 
            const min = config.min?? 0;
            const max = config.max?? 100;
            return parseFloat((Math.random()*(max-min)+min).toFixed(2));

        }
        case "image_url":
        return `https://picsum.photos/seed/${Math.random().toString(36).slice(2)}/400/300`;

        case "file_url" :
        return `https://example.com/file_${Math.random().toString(36).substring(2)}.pdf`;


        case "string" :{
        if (config.regex && config.regex.trim() !== "") {
        return new RandExp(config.regex).gen();
        }
        return faker.lorem.word(); 
        }

        default :
            throw new Error (`Unsupported data type : ${type}`);
            
    }
}

export default generateValue;