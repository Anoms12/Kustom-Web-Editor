import { openDB } from "https://cdn.skypack.dev/idb";
import { strFromU8 } from "https://cdn.jsdelivr.net/npm/fflate@0.7.4/esm/browser.js";

document.addEventListener("click", function (e) {
  if (e.target.closest("#item-attribute-container")) {
    return;
  }

  if (
    e.target.classList.contains("item") ||
    e.target.classList.contains("display-item")
  ) {
    const clicked = e.target;
    const id = clicked.id;

    document
      .querySelectorAll(".item[selected], .display-item[selected]")
      .forEach((el) => {
        el.removeAttribute("selected");
      });

    clicked.setAttribute("selected", "");

    const counterpartClass = clicked.classList.contains("item")
      ? ".display-item"
      : ".item";
    const counterpart = document.querySelector(
      `${counterpartClass}#${CSS.escape(id)}`
    );
    if (counterpart) {
      counterpart.setAttribute("selected", "");
    }

    createAttributes();
    console.log("Clicked on item:", e.target);
  }
});

export async function createAttributes() {
  const attributeContainer = document.getElementById(
    "item-attribute-container"
  );
  attributeContainer.innerHTML = "";
  const item = document.querySelector(".item[selected]");
  console.log(item);

  if (item && item.getAttribute("type") === "ShapeModule") {
    console.log("Shape module selected");

    const attributes = [
      {
        attributesContainer: "SHAPE",
        attributes: [
          {
            icon: "/src/assets/shapeModule.svg",
            title: "Shape",
            jsonName: "shape_type",
            defaultValue: "Square",
            requiredVisibility: "",
            type: "a",
            options: [
              { type: "shape", value: "RECT", label: "Square" }, //TODO: Ensure this is correct
              { type: "shape", value: "CIRCLE", label: "Circle" },
              { type: "shape", value: "RECT", label: "Rectangle" },
              { type: "shape", value: "RECT", label: "Rectangle" },
              { type: "shape", value: "RECT", label: "Rectangle" },
              { type: "shape", value: "RECT", label: "Rectangle" },
              { type: "shape", value: "RECT", label: "Rectangle" },
              { type: "shape", value: "RECT", label: "Rectangle" },
              { type: "shape", value: "RECT", label: "Rectangle" },
              { type: "shape", value: "RECT", label: "Rectangle" },
              { type: "shape", value: "RECT", label: "Rectangle" },
            ],
          },
          {
            icon: "/src/assets/null.svg",
            title: "Width",
            jsonName: "shape_width",
            defaultValue: "20",
            requiredVisibility: "",
            type: "b",
          },
          {
            icon: "/src/assets/null.svg",
            title: "Height",
            jsonName: "shape_height",
            defaultValue: "20",
            requiredVisibility: "Shape == Square",
            type: "b",
          },
          {
            icon: "/src/assets/null.svg",
            title: "Corners",
            jsonName: "shape_corners",
            defaultValue: "0",
            requiredVisibility:
              "Shape =! Circle, Oval, Cirlce Slice, Arc, Path, ",
            type: "b",
          },
          {
            icon: "/src/assets/null.svg",
            title: "Angle",
            jsonName: "shape_angle",
            defaultValue: "0",
            requiredVisibility: "Shape == Cirlce Slice, Arc,",
            type: "b",
          },
          {
            icon: "/src/assets/null.svg",
            title: "Path",
            jsonName: "shape_path",
            defaultValue: "0",
            requiredVisibility: "Shape == Path",
            type: "b",
          },
          {
            icon: "/src/assets/null.svg",
            title: "Rotation",
            jsonName: "shape_rotation", //TODO: Ensure this is correct
            defaultValue: "None",
            requiredVisibility: "",
            type: "b",
          },
        ],
      },
      {
        container: "attribute-container-2",
        attributes: [
          {
            icon: "/src/assets/null.svg",
            title: "Title 3",
            jsonName: "jsonName3",
            defaultValue: "default3",
            requiredVisibility: "",
            type: "c",
          },
          {
            icon: "/src/assets/null.svg",
            title: "Title 4",
            jsonName: "jsonName4",
            defaultValue: "default4",
            requiredVisibility: "",
            type: "d",
          },
        ],
      },
      {
        container: "attribute-container-3",
        attributes: [
          {
            icon: "/src/assets/null.svg",
            title: "Title 5",
            jsonName: "jsonName5",
            defaultValue: "default5",
            requiredVisibility: "",
            type: "e",
          },
          {
            icon: "/src/assets/null.svg",

            title: "Title 6",
            jsonName: "jsonName6",
            defaultValue: "default6",
            requiredVisibility: "",
            type: "f",
          },
        ],
      },
      {
        container: "attribute-container-4",
        attributes: [
          {
            icon: "/src/assets/null.svg",
            title: "Title 7",
            jsonName: "jsonName7",
            defaultValue: "default7",
            requiredVisibility: "",
            type: "a",
          },
        ],
      },
      {
        container: "attribute-container-5",
        attributes: [
          {
            icon: "/src/assets/null.svg",
            title: "Title 8",
            jsonName: "jsonName8",
            defaultValue: "default8",
            requiredVisibility: "",
            type: "b",
          },
        ],
      },
      {
        container: "attribute-container-6",
        attributes: [
          {
            icon: "/src/assets/null.svg",
            title: "Title 9",
            jsonName: "jsonName9",
            defaultValue: "default9",
            requiredVisibility: "",
            type: "c",
          },
        ],
      },
      {
        container: "attribute-container-7",
        attributes: [
          {
            icon: "/src/assets/null.svg",
            title: "Title 10",
            jsonName: "jsonName10",
            defaultValue: "default10",
            requiredVisibility: "",
            type: "d",
          },
        ],
      },
    ];

    attributes.forEach((attributeGroup) => {
      const groupContainer = document.createElement("div");
      groupContainer.id = attributeGroup.attributesContainer;

      attributeGroup.attributes.forEach((attribute) => {
        const attributeElement = document.createElement("div");
        attributeElement.classList.add("attribute");

        const titleElement = document.createElement("label");
        titleElement.textContent = attribute.title;
        attributeElement.appendChild(titleElement);

        // Switch based on the type of the attribute (a, b, c, d, e, f)
        switch (attribute.type) {
          case "a": //Dropdown/Menus
            if (attribute.options) {
              attributeElement.innerHTML = `
              <div id="left-content-container" class="container">
                    <img class="item-attriubte-icon icon" src="${
                      attribute.icon
                    }" alt="${attribute.title}" />
                    <h3 class="item-attribute-title">${attribute.title}</h3>
                </div>
                <div id center-content-container" class="container">
                    <select class="item-attriubte-value" name="${
                      attribute.jsonName
                    }" id="${attribute.jsonName}">
                        ${attribute.options
                          .map(
                            (option) =>
                              `<option value="${option.value}">${option.label}</option>`
                          )
                          .join("")}
                    </select>
                </div>
                <div id="right-content-container" class="container">
                    <label class="button">
                        <input id="item-select" type="checkbox" />
                    </label>
                </div>    
                `;
            }
            break;
          case "b": // Slider/Range
            attributeElement.innerHTML = `
            <div id="left-content-container" class="container">
                <img class="item-attriubte-icon icon" src="${attribute.icon}" alt="${attribute.title}" />
                <h3 class="item-attribute-title">${attribute.title}</h3>
            </div>
            <div class="center-content-container">
              <input type="range" name="${attribute.jsonName}" id="${attribute.jsonName}" value="${attribute.defaultValue}" min="0" max="100" step="1" />
            </div>
            <div id="right-content-container" class="container">
                <label class="button">
                    <input id="item-select" type="checkbox" />
                </label>
            </div>    
              `;
            // Ensure the DOM is ready before initializing the color picker
            window.addEventListener("DOMContentLoaded", () => {
              initColorPicker(); // Initialize after DOM is ready
            });
            break;
          case "c": // Text input
            attributeElement.innerHTML = `
             <div id="left-content-container" class="container">
                <img class="item-attriubte-icon icon" src="${attribute.icon}" alt="${attribute.title}" />
                <h3 class="item-attribute-title">${attribute.title}</h3>
            </div>
            <div class="center-content-container">
                  <label for="${attribute.jsonName}">${attribute.title}</label>
            </div>
            <div id="right-content-container" class="container">
                <label class="button">
                    <input id="item-select" type="checkbox" />
                </label>
            </div>
              `;
            break;
          case "d": // Number Input
            attributeElement.innerHTML = `


            `;
            console.log("Created color picker for attribute:", attribute.title);
            break;
          case "e": // Color Input
            attributeElement.innerHTML = ` 
   
            `;
        }

        groupContainer.appendChild(attributeElement);
      });

      attributeContainer.appendChild(groupContainer);
    });
  }
}
