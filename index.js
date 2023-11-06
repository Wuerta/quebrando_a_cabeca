const items = document.querySelectorAll(".item");
const totalItems = items.length;
const maxVisibleItems = 5;
const radius = 100;
const startAngle = 0;
const endAngle = Math.PI;

let loadingCheckItem = false;
let firstId = "01";

items.forEach((item, index) => {
  let angle;

  item.setAttribute("data-status", "show");

  if (index < maxVisibleItems) {
    angle = startAngle + (index / (maxVisibleItems - 1)) * endAngle;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    item.setAttribute("data-angle", angle);
    item.style.left = `calc(50% + ${x}px)`;
    item.style.top = `calc(50% + ${y}px)`;
  } else if (index === maxVisibleItems) {
    angle = startAngle + endAngle + Math.PI / (maxVisibleItems - 1);
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    item.setAttribute("data-angle", angle);
    item.style.left = `calc(50% + ${x}px)`;
    item.style.top = `calc(50% + ${y}px)`;

    if (index === totalItems - 1) {
      const sixthItem = items[maxVisibleItems];
      if (sixthItem) {
        const clonedItem = sixthItem.cloneNode(true);

        const cloneAngle =
          startAngle + 2 * endAngle - endAngle / (maxVisibleItems - 1);
        const x = radius * Math.cos(cloneAngle);
        const y = radius * Math.sin(cloneAngle);
        clonedItem.style.left = `calc(50% + ${x}px)`;
        clonedItem.style.top = `calc(50% + ${y}px)`;
        clonedItem.setAttribute("data-angle", angle);

        items[0].insertAdjacentElement("beforebegin", clonedItem);
      }
    }
  } else {
    if (index === totalItems - 1) {
      angle = startAngle + 2 * endAngle - endAngle / (maxVisibleItems - 1);
      console.log(angle);
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      item.setAttribute("data-angle", angle);
      item.style.left = `calc(50% + ${x}px)`;
      item.style.top = `calc(50% + ${y}px)`;
    } else {
      item.setAttribute("data-status", "hide");
    }
  }
});

let isDragging = false;
let lastTimestamp = 0;
let direction = 0;
let itemAngle = 0;
let nodeItemId = "01";
let rotation = 0;

function checkFirstIndex() {
  updateItemAngle();

  const shouldSelectNextItem =
    itemAngle > endAngle &&
    itemAngle <= startAngle + 2 * endAngle - (endAngle / (maxVisibleItems - 1));
  const shouldSelectPreviousItem =
    itemAngle < endAngle &&
    itemAngle >= startAngle + (1 / (maxVisibleItems - 1)) * endAngle;

  const items = document.querySelectorAll(".item");

  if (shouldSelectNextItem) {
    items.forEach((nodeItem, index) => {
      const itemId = nodeItem.id;

      if (itemId === nodeItemId) {
        if (index + 1 >= items.length) {
          const newItemIndex = maxVisibleItems;
          const newItem = items.item(newItemIndex);

          const diff = (startAngle + 2 * endAngle - endAngle / (maxVisibleItems - 1)) - itemAngle;

          console.log(diff);

          const dataAngle = diff + endAngle + endAngle / (maxVisibleItems - 1);
          newItem.setAttribute("data-angle", dataAngle);

          const oldItemIndex = items.length - 2;
          const oldItem = items.item(oldItemIndex);

          newItem.setAttribute("data-status", "show");
          oldItem.setAttribute("data-status", "hide");

          const nextItem = items.item(0);
          firstId = nextItem.getAttribute("data-id");
        } else {
          const newItemIndex = (index + maxVisibleItems + 1) % items.length;
          const newItem = items.item(newItemIndex);
          const diff = (startAngle + 2 * endAngle - endAngle / (maxVisibleItems - 1)) - itemAngle;

          const dataAngle = 2 * endAngle - (endAngle + diff + ( (1 / maxVisibleItems - 1) * endAngle));
          newItem.setAttribute("data-angle", dataAngle);

          const oldItemIndex = (index + (items.length - 1)) % items.length;
          const oldItem = items.item(oldItemIndex);

          newItem.setAttribute("data-status", "show");
          oldItem.setAttribute("data-status", "hide");

          const nextItem = items.item(index + 1);
          firstId = nextItem.getAttribute("data-id");
        }
      }
    });
  }

  if (shouldSelectPreviousItem) {
    items.forEach((nodeItem, index) => {
      const itemId = nodeItem.id;

      if (itemId === nodeItemId) {
        if (index === 0) {
          const newItemIndex = items.length - 2;
          const newItem = items.item(newItemIndex);
          const diff =
            itemAngle - (startAngle + (1 / (maxVisibleItems - 1)) * endAngle);

          const dataAngle =
            diff + startAngle + 2 * endAngle - endAngle / (maxVisibleItems - 1);

          newItem.setAttribute("data-angle", dataAngle);

          const oldItemIndex = index + items.length - (maxVisibleItems + 1);
          const oldItem = items.item(oldItemIndex);

          newItem.setAttribute("data-status", "show");
          oldItem.setAttribute("data-status", "hide");

          const previousItem = items.item(items.length - 1);
          firstId = previousItem.getAttribute("data-id");
        } else {
          const newItemIndex = (index - 2 + items.length) % items.length;
          const newItem = items.item(newItemIndex);

          const diff =
            itemAngle - (startAngle + (1 / (maxVisibleItems - 1)) * endAngle);

          const dataAngle =
            diff + startAngle + 2 * endAngle - endAngle / (maxVisibleItems - 1);

          newItem.setAttribute("data-angle", dataAngle);

          const oldItemIndex =
            (index - (maxVisibleItems + 1) + items.length) % items.length;
          const oldItem = items.item(oldItemIndex);

          newItem.setAttribute("data-status", "show");
          oldItem.setAttribute("data-status", "hide");

          const previousItem = items.item(index - 1);
          firstId = previousItem.getAttribute("data-id");
        }
      }
    });
  }
}

function updateItemPositions() {
  const items = document.querySelectorAll(".item");

  items.forEach((item) => {
    const dataAngle = Number(item.getAttribute("data-angle"));
    let angle = dataAngle + rotation * 0.02 * (endAngle / items.length);

    if (angle < 0) {
      angle = ((angle % (2 * endAngle)) + 2 * endAngle) % (2 * endAngle);
    }

    if (angle > 2 * endAngle) angle = angle % (2 * endAngle);

    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);

    item.setAttribute("data-angle", angle);
    item.style.left = `calc(50% + ${x}px)`;
    item.style.top = `calc(50% + ${y}px)`;
  });
}

function updateItemAngle() {
  const item = document.querySelector(`.item[data-id='${firstId}']`);
  itemAngle = Number(item.getAttribute("data-angle"));
  nodeItemId = item.id;
}

const semicircle = document.querySelector(".semicircle");

semicircle.addEventListener("mousedown", (e) => {
  isDragging = true;
});

document.body.addEventListener("mousemove", (e) => {
  if (isDragging) {
    direction = e.movementX;
    rotation = direction * -1;
    checkFirstIndex();
    updateItemPositions();
  }
});

document.body.addEventListener("mouseup", () => {
  isDragging = false;
});
