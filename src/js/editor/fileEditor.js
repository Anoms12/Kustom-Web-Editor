import { openDB } from "https://cdn.skypack.dev/idb";
import { strFromU8 } from "https://cdn.jsdelivr.net/npm/fflate@0.7.4/esm/browser.js";

// Handle click events
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

// Function for setting up item preferences
function titlePrefrencesSetup() {
  document.addEventListener("click", function(event) {
    console.log("---Title Preferences Click Event---");
    
    const clickedTitle = event.target.closest(".item-prefrences-title");
    if (!clickedTitle) {
      console.log("No title element found in click path");
      return;
    }
    
    // Log state before changes
    console.log("Before changes:", {
      clickedId: clickedTitle.id,
      hasSelected: clickedTitle.hasAttribute("selected"),
      allSelected: Array.from(document.querySelectorAll(".item-prefrences-title[selected]"))
        .map(el => el.id)
    });

    // Remove selected from all titles
    document.querySelectorAll(".item-prefrences-title[selected]")
      .forEach(el => {
        console.log(`Removing selected from: ${el.id}`);
        el.removeAttribute("selected");
      });

    // Set selected on clicked title
    clickedTitle.setAttribute("selected", "");
    console.log(`Added selected to: ${clickedTitle.id}`);

    // Show the corresponding attribute group and hide others
    const attributeGroups = document.querySelectorAll("#item-attribute-container > div");
    attributeGroups.forEach(group => {
      if (group.id === clickedTitle.id) {
        group.style.display = "block";
      } else {
        group.style.display = "none";
      }
    });
  });
}

// Your single createAttributes function
export async function createAttributes() {
  const attributeContainer = document.getElementById(
    "item-attribute-container"
  );
  attributeContainer.innerHTML = "";
  const item = document.querySelector(".item[selected]");
  console.log(item);

  if (item && item.getAttribute("type") === "ShapeModule") {
    console.log("Shape module selected");

    const attributes = {
      type: "ShapeModule",
      sections: [
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
                { type: "shape", value: "RECT", label: "Square" },
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
              requiredVisibility: "Shape =! Circle, Oval, Cirlce Slice, Arc, Path, ",
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
          attributesContainer: "attribute-container-2",
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
          attributesContainer: "attribute-container-3",
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
          attributesContainer: "attribute-container-4",
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
          attributesContainer: "attribute-container-5",
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
          attributesContainer: "attribute-container-6",
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
          attributesContainer: "attribute-container-7",
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
      ],
    };

    // Setup before we loop
    const itemPrefrencesTitleContainer = document.getElementById(
      `item-prefrences-title-container`
    );
    itemPrefrencesTitleContainer.innerHTML = "";
    if (itemPrefrencesTitleContainer) {
      console.log(`Found ${itemPrefrencesTitleContainer}`);
      attributes.sections.forEach((section) => {
        const containerInfo = section.attributesContainer;

        const itemPreferencesTitle = document.createElement("h2");
        itemPreferencesTitle.classList.add("item-prefrences-title");
        itemPreferencesTitle.id = containerInfo;
        itemPreferencesTitle.textContent = containerInfo;

        itemPrefrencesTitleContainer.appendChild(itemPreferencesTitle);
        console.log(`created element at ${itemPrefrencesTitleContainer}`);
      });

      // Add this: Select the first title by default
      const firstTitle = itemPrefrencesTitleContainer.querySelector('.item-prefrences-title');
      if (firstTitle) {
        firstTitle.setAttribute('selected', '');
      }
    } else {
      console.warn(`No item-prefrences-title-container was found`);
    }

    titlePrefrencesSetup();

    attributes.sections.forEach((attributeGroup) => {
      try {
        const containerId = attributeGroup.attributesContainer;

        const preferencesTitle = document.querySelector(
          `.item-prefrences-title#${CSS.escape(containerId)}[selected]`
        );

        if (!preferencesTitle) {
          console.warn(
            `No preferences title found for container: ${containerId}`
          );
          return;
        }

        const groupContainer = document.createElement("div");
        groupContainer.id = containerId;

        if (attributeGroup && attributeGroup.attributes && Array.isArray(attributeGroup.attributes)) {
          createAttriubteItems(attributeGroup, groupContainer);
        } else {
          console.warn(`Invalid attributeGroup structure: ${JSON.stringify(attributeGroup)}`);
        }
        

        attributeContainer.appendChild(groupContainer);
      } catch (groupError) {
        console.error(
          `Error processing attribute group: ${attributeGroup?.attributesContainer}`,
          groupError
        );
      }
    });
  }
}

// Function to create the attribute items
async function createAttriubteItems(attributeGroup, groupContainer) {
  if (!attributeGroup || !attributeGroup.attributes) {
    console.error("attributeGroup or attributes are undefined", attributeGroup);
    return;
  }

  attributeGroup.attributes.forEach((attribute) => {
    try {
      const attributeElement = document.createElement("div");
      attributeElement.classList.add("attribute");

      const titleElement = document.createElement("label");
      titleElement.textContent = attribute.title;
      attributeElement.appendChild(titleElement);

      switch (attribute.type) {
        case "a":
          if (attribute.options) {
            attributeElement.innerHTML = `
          <div id="left-content-container" class="container">
              <img class="item-attriubte-icon icon" src="${
                attribute.icon
              }" alt="${attribute.title}" />
              <h3 class="item-attribute-title">${attribute.title}</h3>
          </div>
          <div class="center-content-container">
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
          </div>`;
          } else {
            console.warn(
              `No options provided for attribute type "a": ${attribute.title}`
            );
          }
          break;

        case "b":
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
        </div>`;
          break;

        case "c":
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
        </div>`;
          break;

        default:
          console.warn(`Unsupported attribute type: ${attribute.type}`);
          break;
      }

      groupContainer.appendChild(attributeElement);
    } catch (attributeError) {
      console.error(
        `Error creating attribute item: ${attribute.title}`,
        attributeError
      );
    }
  });
}
