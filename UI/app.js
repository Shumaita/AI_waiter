const foodItem = [
  {
    id: 1,
    name: "burger",
    time: 5,
  },
  {
    id: 2,
    name: "pizza",
    time: 7,
  },
  {
    id: 3,
    name: "pasta",
    time: 8,
  },
  {
    id: 4,
    name: "sandwich",
    time: 4,
  },
  {
    id: 5,
    name: "sushi",
    time: 6,
  },
];
const orderStorage = [];

// submit order to an API endpoint
function submitOrder() {
  let data;
  // Check if there is an order
  if (orderStorage.length > 0) {
    // Send the order to the API endpoint and get the response of details
    fetch("http://127.0.0.1:5000/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderStorage),
    })
      .then((response) => response.json())
      .then((responseData) => {
        data = responseData.details;
        startAnimations(data, 0);
        // clear the orderStorage
        orderStorage.length = 0;
        const orderList = document.getElementById("orderList");
        orderList.innerHTML = "";
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } else {
    console.log("No orders to submit.");
  }
}

// Add order to the orderStorage
function addOder(tableNumber, foodItemId) {
  // Check if the table already has an order
  const order = orderStorage.find((order) => order.tableNumber === tableNumber);

  if (order) {
    // Check if the food item is already in the order
    const foodItem = order.foodItems.find((item) => item.id === foodItemId);
    if (foodItem) {
      foodItem.quantity++;
    } else {
      // push the food item to the same table order
      order.foodItems.push({ id: foodItemId, quantity: 1 });
    }
  } else {
    orderStorage.push({
      tableNumber,
      foodItems: [{ id: foodItemId, quantity: 1 }],
    });
  }

  // clear the order list and re-render
  const orderList = document.getElementById("orderList");
  orderList.innerHTML = "";
  orderStorage.forEach((order) => {
    order.foodItems.forEach((item) => {
      const food = foodItem.find((food) => food.id === Number(item.id));

      const li = document.createElement("li");
      li.textContent = `${food.name} x ${item.quantity} - ${order.tableNumber}`;
      orderList.appendChild(li);
    });
  });

  // console.log(orderStorage);
}

document.addEventListener("DOMContentLoaded", function () {
  const chessboard = document.querySelector(".chessboard");
  const rows = 9;
  const cols = 9;
  let tableNumber = 1;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const square = document.createElement("div");
      square.classList.add("square");
      // add data attributes to the square
      square.dataset.row = i;
      square.dataset.col = j;

      // Add additional classes based on the square position
      if (i === 0 && (j === 0 || j === 5 || j === 8)) {
        square.classList.add("food");
        square.id = `t${tableNumber}`;
        tableNumber++;
      } else if (i === 2 && (j === 0 || j === 8)) {
        square.classList.add("food");
        square.id = `t${tableNumber}`;
        tableNumber++;
      } else if (i === 5 && j === 0) {
        square.classList.add("food");
        square.id = `t${tableNumber}`;
        tableNumber++;
      } else if (i === 6 && j === 7) {
        square.classList.add("food");
        square.id = `t${tableNumber}`;
        tableNumber++;
      } else if (i === 8 && (j === 0 || j === 2 || j === 6)) {
        square.classList.add("food");
        square.id = `t${tableNumber}`;
        tableNumber++;
      } else if (i === 4 && j === 4) {
        square.classList.add("kitchen");
        square.id = "kit";
      } else if (i % 2 === j % 2) {
        square.classList.add("white");
      } else {
        square.classList.add("black");
      }

      if (i === 1 || i === 2 || i == 3 || i == 4 || i >= 6) {
        if (i == 1 && (j == 4 || j == 5)) {
          square.classList.add("wall");
        }
        if (i == 2 && j == 2) {
          square.classList.add("wall");
        }
        if (i == 3 && (j <= 3 || j == 6 || j == 7)) {
          square.classList.add("wall");
        }
        if (i == 4 && j <= 1) {
          square.classList.add("wall");
        }
        if (i == 6 && j == 6) {
          square.classList.add("wall");
        }
        if (i == 7 && j >= 6) {
          square.classList.add("wall");
        }
        if (i == 8 && (j == 1 || j == 3 || j == 4 || j >= 7)) {
          square.classList.add("wall");
        }
      }

      chessboard.appendChild(square);
    }
  }

  // Add click event listener to food squares
  const foodSquares = document.querySelectorAll(".food");
  foodSquares.forEach((square) => {
    square.addEventListener("click", (e) => {
      const tableNumber = square.id;
      console.log(`Table ${tableNumber} clicked!`);
      openModal(tableNumber);
    });
  });
});

function openModal(tableNumber) {
  const modal = document.createElement("div");
  modal.classList.add("modal", "fade");

  modal.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Table ${tableNumber}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
         
            ${foodItem
              .map((item) => {
                return `<span class="badge bg-primary mx-1 selectBadge p-3" onClick="addOder('${tableNumber}','${item.id}')">${item.name}</span>`;
              })
              .join("")} 
            
          </div>
          <div class="modal-body">
            <h5>Order List</h5>
            <ul id="orderList">
              ${orderStorage
                .map((order) => {
                  return order.foodItems
                    .map((item) => {
                      const food = foodItem.find(
                        (food) => food.id === Number(item.id)
                      );
                      return `<li>${food.name} x ${item.quantity} - ${order.tableNumber} </li>`;
                    })
                    .join("");
                })
                .join("")}
            </ul>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            
          </div>
        </div>
      </div>
    `;

  document.body.appendChild(modal);
  const modalInstance = new bootstrap.Modal(modal);
  modalInstance.show();

  // Add event listener to close the modal when the close button is clicked
  const closeButton = modal.querySelector(".btn-close");
  closeButton.addEventListener("click", () => {
    modalInstance.hide();
    document.body.removeChild(modal);
  });
}

function startAnimations(data, index) {
  if (index >= data.length) {
    // All animations have been started
    return;
  }

  const path = data[index].path;
  const reversePath = [...path].reverse();

  startAnimation(path, 500, () => {
    startAnimation(reversePath, 500, () => {
      // Start the next animation after the current one is complete
      startAnimations(data, index + 1);
    });
  });
}

const startAnimation = (path, timeDelay = 1000, callback) => {
  // get row+col+1 th square and add class active and remove it after 1s and go to next path
  let i = 0;
  const interval = setInterval(() => {
    const square = document.querySelector(
      `.square[data-row="${path[i].row}"][data-col="${path[i].col}"]`
    );
    square.classList.add("active-waiter");
    setTimeout(() => {
      square.classList.remove("active-waiter");
    }, timeDelay);
    i++;
    if (i === path.length) {
      clearInterval(interval);
      // Call the callback function when the animation is complete
      callback();
    }
  }, timeDelay);
};
