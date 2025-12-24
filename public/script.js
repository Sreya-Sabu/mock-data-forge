const btn = document.getElementById("generateBtn");
const countBox = document.getElementById("countInput");
const output = document.getElementById("outputBox");
const copyBtn = document.getElementById("copyBtn");

// Mode Switching Elements
const jsonModeBtn = document.getElementById("jsonModeBtn");
const formModeBtn = document.getElementById("formModeBtn");
const jsonContainer = document.getElementById("jsonContainer");
const formContainer = document.getElementById("formContainer");

// Input Elements
const jsonInput = document.getElementById("schemaInput");
const fieldsContainer = document.getElementById("fieldsContainer");
const addFieldBtn = document.getElementById("addFieldBtn");

let currentMode = "json"; // Default mode

// --- 1. Mode Switching ---
jsonModeBtn.addEventListener("click", () => {
  currentMode = "json";
  jsonContainer.classList.remove("hidden");
  formContainer.classList.add("hidden");
  jsonModeBtn.classList.add("active");
  formModeBtn.classList.remove("active");
});

formModeBtn.addEventListener("click", () => {
  currentMode = "form";
  jsonContainer.classList.add("hidden");
  formContainer.classList.remove("hidden");
  jsonModeBtn.classList.remove("active");
  formModeBtn.classList.add("active");
});

// --- 2. Generate Logic ---
btn.addEventListener("click", async () => {
  let count = Number(countBox.value) || 1;
  let schema;

  btn.textContent = "Generating...";
  btn.disabled = true;

  try {
    if (currentMode === "json") {
      const text = jsonInput.value.trim();
      if (!text) throw new Error("Please enter a JSON schema.");
      schema = JSON.parse(text);
    } else {
      schema = buildSchemaFromForm(fieldsContainer);
      if (Object.keys(schema).length === 0)
        throw new Error("Please add at least one field to the form.");
    }

    const response = await fetch("http://localhost:3000/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ schema, count })
    });

    const data = await response.json();

    output.textContent = response.ok
      ? JSON.stringify(data, null, 2)
      : "Error: " + (data.error || "Unknown error");
  } catch (err) {
    output.textContent = "Error: " + err.message;
  }

  resetButton();
});

function resetButton() {
  btn.textContent = "Generate Data";
  btn.disabled = false;
}

// --- 3. Form Builder ---
addFieldBtn.addEventListener("click", () => {
  fieldsContainer.appendChild(createFieldRow());
});

function createFieldRow() {
  const row = document.createElement("div");
  row.className = "field-row";

  row.innerHTML = `
    <input class="field-name" placeholder="field_name" />
    <select class="field-type">
      <option value="string">string</option>
      <option value="date">date</option>
      <option value="uuid">uuid</option>
      <option value="integer">integer</option>
      <option value="float">float</option>
      <option value="boolean">boolean</option>
      <option value="name">name</option>
      <option value="email">email</option>
      <option value="image_url">image_url</option>
      <option value="file_url">file_url</option>
      <option value="array">array</option>
      <option value="object">object</option>
    </select>
    <div class="constraints"></div>
    <button class="remove-btn">✖</button>
    <div class="object-fields hidden">
      <button class="add-nested-field secondary-btn">+ Add Object Field</button>
      <div class="nested-fields"></div>
    </div>
  `;

  const typeSelect = row.querySelector(".field-type");
  const constraintsDiv = row.querySelector(".constraints");
  const objectFields = row.querySelector(".object-fields");
  const nestedFields = row.querySelector(".nested-fields");

  typeSelect.addEventListener("change", () => {
    renderConstraints(typeSelect.value, constraintsDiv);
    if (typeSelect.value === "object") objectFields.classList.remove("hidden");
    else {
      objectFields.classList.add("hidden");
      nestedFields.innerHTML = "";
    }
  });

  row.querySelector(".add-nested-field").addEventListener("click", () => {
    nestedFields.appendChild(createFieldRow());
  });

  row.querySelector(".remove-btn").onclick = () => row.remove();

  return row;
}

function renderConstraints(type, container) {
  container.innerHTML = "";
  const enumHTML = `<input class="enum" placeholder="choices (comma separated)" />`;

  if (["boolean", "name", "email", "date", "uuid"].includes(type)) container.innerHTML = enumHTML;
  if (type === "integer" || type === "float") container.innerHTML = `
    <input class="min" type="number" placeholder="min" />
    <input class="max" type="number" placeholder="max" />
    ${enumHTML}
  `;
  if (type === "string") container.innerHTML = `
    <input class="regex" placeholder="regex (optional)" />
    ${enumHTML}
  `;
  if (type === "array") {
    container.innerHTML = `
      <div class="array-config">
        <select class="element-type">
          <option value="string">string</option>
          <option value="date">date</option>
          <option value="uuid">uuid</option>
          <option value="integer">integer</option>
          <option value="float">float</option>
          <option value="boolean">boolean</option>
          <option value="name">name</option>
          <option value="email">email</option>
          <option value="image_url">image_url</option>
          <option value="file_url">file_url</option>
          <option value="object">object</option>
          <option value="array">array</option>
        </select>
        <div class="element-constraints"></div>
        <div class="element-object-fields hidden">
          <button class="add-nested-field secondary-btn">+ Add Object Field</button>
          <div class="nested-fields"></div>
        </div>
      </div>
    `;

    const elTypeSelect = container.querySelector(".element-type");
    const elConstraints = container.querySelector(".element-constraints");
    const elObjectFields = container.querySelector(".element-object-fields");
    const elNestedFields = container.querySelector(".nested-fields");

    renderConstraints(elTypeSelect.value, elConstraints);

    elTypeSelect.addEventListener("change", () => {
      elConstraints.innerHTML = "";
      elObjectFields.classList.add("hidden");
      elNestedFields.innerHTML = "";
      renderConstraints(elTypeSelect.value, elConstraints);
      if (elTypeSelect.value === "object") elObjectFields.classList.remove("hidden");
    });

    container.querySelector(".add-nested-field")?.addEventListener("click", () => {
      elNestedFields.appendChild(createFieldRow());
    });
  }
}

// --- 4. Build JSON Schema ---
function buildSchemaFromForm(container = document) {
  const schema = {};
  const rows = Array.from(container.children).filter(c => c.classList.contains("field-row"));

  rows.forEach(row => {
    const name = row.querySelector(".field-name").value.trim();
    const type = row.querySelector(".field-type").value;
    const constraints = row.querySelector(".constraints");
    if (!name) return;

    const fieldSchema = { type };

    // Enum
    const enumInput = constraints.querySelector(".enum")?.value;
    if (enumInput?.trim()) {
      fieldSchema.enum = enumInput.split(",").map(v => v.trim()).filter(Boolean).map(v => {
        if (type === "integer" || type === "float") return Number(v);
        if (type === "boolean") return v === "true";
        return v;
      });
    }

    // Number constraints
    if (!fieldSchema.enum && (type === "integer" || type === "float")) {
      const min = constraints.querySelector(".min")?.value;
      const max = constraints.querySelector(".max")?.value;
      if (min !== "") fieldSchema.min = Number(min);
      if (max !== "") fieldSchema.max = Number(max);
    }

    // String regex
    if (!fieldSchema.enum && type === "string") {
      const regex = constraints.querySelector(".regex")?.value;
      if (regex?.trim()) fieldSchema.regex = regex.trim();
    }

    // Array
    if (type === "array") {
      const elType = constraints.querySelector(".element-type")?.value;
      if (!elType) return;
      const elConstraints = constraints.querySelector(".element-constraints");
      const elementSchema = { type: elType };

      const elEnumInput = elConstraints.querySelector(".enum")?.value;
      if (elEnumInput?.trim()) {
        elementSchema.enum = elEnumInput.split(",").map(v => v.trim()).filter(Boolean).map(v => {
          if (elType === "integer" || elType === "float") return Number(v);
          if (elType === "boolean") return v === "true";
          return v;
        });
      }

      if (!elementSchema.enum && (elType === "integer" || elType === "float")) {
        const min = elConstraints.querySelector(".min")?.value;
        const max = elConstraints.querySelector(".max")?.value;
        if (min !== "") elementSchema.min = Number(min);
        if (max !== "") elementSchema.max = Number(max);
      }

      if (!elementSchema.enum && elType === "string") {
        const regex = elConstraints.querySelector(".regex")?.value;
        if (regex?.trim()) elementSchema.regex = regex.trim();
      }

      if (elType === "object") {
        const nestedContainer = constraints.querySelector(".nested-fields");
        elementSchema.fields = buildSchemaFromForm(nestedContainer);
      }

      if (elType === "array") {
        elementSchema.element_type = readArrayElementSchema(elConstraints);
      }

      fieldSchema.element_type = elementSchema;
    }

    // Object
    if (type === "object") {
      const nestedContainer = row.querySelector(".nested-fields");
      fieldSchema.fields = buildSchemaFromForm(nestedContainer);
    }

    schema[name] = fieldSchema;
  });

  return schema;
}

// --- 5. Copy to Clipboard ---
copyBtn.addEventListener("click", () => {
  const text = output.textContent;
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    const orig = copyBtn.textContent;
    copyBtn.textContent = "Copied!";
    setTimeout(() => (copyBtn.textContent = orig), 2000);
  });
});

// Initialize with one empty field in form mode
document.addEventListener("DOMContentLoaded", () => {
  if (fieldsContainer.children.length === 0) addFieldBtn.click();
});
