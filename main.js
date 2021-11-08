let lists = document.querySelectorAll(".list");
let items = document.querySelectorAll(".list__item");
const button = document.querySelector(".button");
let boardIdNo = 4;
let cardNo = 5;
let draggedItem = null;
let boards = document.querySelector(".boards");

let cards = {
  card1: {
    id: "card1",
    xList: 0,
    xPos: 0,
    text: "Demo1",
  },
  card2: {
    id: "card2",
    xList: 1,
    xPos: 0,
    text: "Demo2",
  },
  card3: {
    id: "card3",
    xList: 2,
    xPos: 0,
    text: "Demo3",
  },
  card4: {
    id: "card4",
    xList: 3,
    xPos: 0,
    text: "Demo4",
  },
};

const deleteBtn = document.querySelector(".delete__board");

function isNullOrWhitespace(input) {
  return !input || !input.trim();
}

function deleteBoard(i) {
  for (let card in cards) {
    if (cards[card]["xList"] == i) {
      document.getElementById(cards[card]["id"]).remove();
      delete cards[card];
    }
  }
  document.getElementById(`no${i}`).classList.add("notvisible");
}

const modal = document.querySelector(".modal");
const modalClose = document.querySelector(".modal__close");

const openModal = function (e) {
  const modalText = document.querySelector(".modal__text");
  const modalDelete = document.querySelector(".modal__delete");
  const lists = document.querySelectorAll(".list");
  modal.style.display = "block";
  modalText.value = e.textContent.trim();
  modalText.focus();

  modalText.onchange = (event) => {
    e.textContent = event.target.value;
  };
  modalDelete.onclick = () => {
    let tmpPos, tmpList;
    if (cards[`${e.id}`]) {
      tmpPos = cards[`${e.id}`]["xPos"];
      tmpList = cards[`${e.id}`]["xList"];
      let newPos = tmpPos;
      tmpListLength = lists[tmpList].getElementsByTagName("div").length;
      if (tmpListLength > tmpPos + 1) {
        for (let e in items)
          if (cards[e]) {
            if (cards[e]["xList"] == tmpList) {
              if (cards[e]["xPos"] >= tmpPos) {
                cards[e]["xPos"] = newPos - 1;
                newPos += 1;
              }
            }
          }
      }
      delete cards[`${e.id}`];
      e.remove();
      modal.style.display = "none";
    }
  };
  modalText.onkeydown = (e) => {
    if (e.code === "Enter" || e.code === "NumpadEnter") {
      modal.style.display = "none";
    }
  };
};
modalClose.onclick = function () {
  modal.style.display = "none";
};
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

items.forEach((item) =>
  item.addEventListener("click", (e) => openModal(e.target))
);

function addTask(i) {
  const btn = document.querySelectorAll(".add__btn");
  const addBtn = document.querySelectorAll(".add__item-btn");
  const cancelBtn = document.querySelectorAll(".cancel__item-btn");
  const textarea = document.querySelectorAll(".textarea");
  const form = document.querySelectorAll(".form");
  let value;
  form[i].style.display = "block";
  btn[i].style.display = "none";
  addBtn[i].style.display = "none";
  textarea[i].focus();
  textarea[i].addEventListener("input", (e) => {
    value = e.target.value;
    if (value) {
      addBtn[i].style.display = "block";
    } else {
      addBtn[i].style.display = "none";
    }
  });
  let tmpLength;
  const addItem = function (value, listNo) {
    lists = document.querySelectorAll(".list");
    const newItem = document.createElement("div");
    newItem.classList.add("list__item");
    newItem.onclick = (e) => openModal(e.target);
    newItem.setAttribute("id", `card${cardNo}`);
    newItem.draggable = true;
    newItem.textContent = value;
    tmpLength = lists[i].getElementsByTagName("div").length;
    lists[i].append(newItem);
    textarea[i].value = "";
    value = "";
    form[i].style.display = "none";
    btn[i].style.display = "flex";
    dragNdrop();
    // all_list_items = document.querySelectorAll(".list__item");
    cards[`card${cardNo}`] = {
      id: `card${cardNo}`,
      xList: listNo,
      xPos: tmpLength,
      text: newItem.textContent,
    };
    cardNo += 1;
    // console.log(cards);
  };
  let listNo = i;

  cancelBtn[i].addEventListener("click", () => {
    textarea[i].value = "";
    value = "";
    form[i].style.display = "none";
    btn[i].style.display = "flex";
  });
  addBtn[i].onclick = () => addItem(value, listNo);
  form[i].onkeydown = function (e) {
    if (!isNullOrWhitespace(value))
      if (e.code === "Enter" || e.code === "NumpadEnter") {
        if (!isNullOrWhitespace(value)) addItem(value, listNo);
      }
  };
}

function addBoard() {
  boards = document.querySelector(".boards");
  const board = document.createElement("div");
  board.classList.add("boards__item");
  board.setAttribute("id", `no${boardIdNo}`);
  board.innerHTML = `<span class="title" contenteditable="true">New Board</span>
    <div  class="list">     
    </div>
    <div class="form">
      <textarea
        class="textarea"
        placeholder="Name your card..."
      ></textarea>
      <div class="buttons">
        <button class="add__item-btn">Add card</button>
        <button class="cancel__item-btn">Cancel</button>
      </div>
    </div>
    <div class="add__btn" onclick="addTask(${boardIdNo})">
      <span class="add__btn-plus"> + </span> Add card
    </div>
    <div class="delete__board" onclick='deleteBoard(${boardIdNo})'>
    <span><i class="fas fa-trash"></i></span>Delete board
</div>
  </div>`;
  boardIdNo += 1;
  boards.append(board);
  dragNdrop();
  lists = document.querySelectorAll(".list");
  boards.scrollLeft += 250;
  boards = document.querySelector(".boards");

  const title = document.querySelectorAll(".title");
  title.forEach(function (t) {
    t.onkeydown = function (e) {
      if (e.code === "Enter" || e.code === "NumpadEnter") {
        console.log("stop");
        t.blur();
      }
    };
  });
}

function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll(".list__item:not(.dragging)"),
  ];
  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

const dragNdrop = function () {
  const listItems = document.querySelectorAll(".list__item");
  const lists = document.querySelectorAll(".list");

  listItems.forEach(function (item) {
    item.addEventListener("dragstart", function () {
      draggedItem = item;
      item.classList.add("dragging");
    });
    item.addEventListener("dragend", function () {
      item.classList.remove("dragging");
    });
  });

  let newList;
  let afterElementID, xnewPos, xtmpPos, insertValue, tmpItemId, tmpItemValue;
  lists.forEach(function (container) {
    container.addEventListener("dragover", function (e) {
      e.preventDefault();
      const item = document.querySelector(".dragging");
      const afterElement = getDragAfterElement(container, e.clientY);
      newList = Number(container.id.slice(4, Infinity));
      if (afterElement == null) {
        container.appendChild(item);
        cards[item.id]["xPos"] =
          lists[newList].getElementsByTagName("div").length - 1;
        cards[item.id]["xList"] = newList;
        insertValue = false;
        /*TODO: update old list*/
      } else {
        insertValue = true;
        container.insertBefore(item, afterElement);
        if (String(afterElement.id).startsWith("card")) {
          afterElementID = afterElement.id;
        }
        xnewPos = cards[afterElementID]["xPos"];
        cards[item.id]["xPos"] = xnewPos;
        cards[item.id]["xList"] = newList;
        xtmpPos = xnewPos + 1;
        tmpItemId = item.id;
        tmpItemValue = xnewPos;
      }
    });

    container.addEventListener("drop", function (e) {
      this.style.backgroundColor = "rgba(0,0,0, 0)";
      if (insertValue) {
        for (let card in cards) {
          if (
            cards[card]["xList"] == newList &&
            cards[card]["xPos"] >= xnewPos
          ) {
            cards[card]["xPos"] = cards[card]["xPos"] + 1;
          }
        }
        cards[tmpItemId]["xPos"] = tmpItemValue;
      }
    });

    container.addEventListener("dragenter", function (e) {
      e.preventDefault();
      //   this.style.backgroundColor = "rgba(0,0,0,.3)";
    });

    container.addEventListener("dragleave", function (e) {
      this.style.backgroundColor = "rgba(0,0,0, 0)";
    });
  });
};

const title = document.querySelectorAll(".title");
title.forEach(function (t) {
  t.onkeydown = function (e) {
    if (e.code === "Enter" || e.code === "NumpadEnter") {
      console.log("stop");
      t.blur();
    }
  };
});

dragNdrop();
button.addEventListener("click", addBoard);

function savedValues() {
  // lists = localStorage.getItem('LISTS');
}
document.addEventListener("loadedmetadata", savedValues);
