var swiper = new Swiper('.swiper-container', {
  slidesPerView: 1,
  spaceBetween: 30,
  loop: true,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});

const decrementQuantityButtons = document.querySelectorAll('.decrement-quantity');
const incrementQuantityButtons = document.querySelectorAll('.increment-quantity');
const quantityInputs = document.querySelectorAll('#quantity');

decrementQuantityButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    const currentQuantity = parseFloat(quantityInputs[index].value);
    if (currentQuantity > 0.5) {
      quantityInputs[index].value = (currentQuantity - 0.5).toFixed(1);
    }
  });
});

// Dairy Section - Quantity Control
const dairyDecrementButtons = document.querySelectorAll('.dairy-decrement-quantity');
const dairyIncrementButtons = document.querySelectorAll('.dairy-increment-quantity');
const dairyQuantityInputs = document.querySelectorAll('#dairy-quantity');

dairyDecrementButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    const currentQuantity = parseInt(dairyQuantityInputs[index].value);
    if (currentQuantity > 1) {
      dairyQuantityInputs[index].value = currentQuantity - 1;
    }
  });
});

dairyIncrementButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    const currentQuantity = parseInt(dairyQuantityInputs[index].value);
    dairyQuantityInputs[index].value = currentQuantity + 1;
  });
});

incrementQuantityButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    const currentQuantity = parseFloat(quantityInputs[index].value);
    quantityInputs[index].value = (currentQuantity + 0.5).toFixed(1);
  });
});

// Function to update the cart
function updateCart(item) {
  const cartTableBody = document.querySelector('.cart-table tbody');
  const totalPriceElement = document.querySelector('.total-price');

  // Get item details
  const itemName = item.querySelector('p').textContent;
  const itemPrice = parseFloat(item.querySelector('#price').textContent.replace('Rs. ', '').replace(' LKR', ''));
  const itemQuantity = parseFloat(item.querySelector('#quantity').value);

  // Check if the item quantity is greater than 0
  if (itemQuantity > 0) {
      // Calculate total for this item
      const itemTotal = itemPrice * itemQuantity;

      // Create item object
      const cartItem = {
          name: itemName,
          price: itemPrice,
          quantity: itemQuantity,
          total: itemTotal
      };

      // Save item to localStorage
      let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      cartItems.push(cartItem);
      localStorage.setItem('cartItems', JSON.stringify(cartItems));

      // Save total price to localStorage
      const currentTotalPrice = parseFloat(localStorage.getItem('totalPrice')) || 0;
      const newTotalPrice = currentTotalPrice + itemTotal;
      localStorage.setItem('totalPrice', newTotalPrice.toFixed(2));

      // Update UI
      addItemToTable(cartItem);
      updateTotalPrice(newTotalPrice);
  }
}

function updateDairyCart(item) {
  const cartTableBody = document.querySelector('.cart-table tbody');
  const totalPriceElement = document.querySelector('.total-price');

  // Get dairy item details
  const itemName = item.querySelector('p').textContent;
  const itemPrice = parseFloat(item.querySelector('#dairy-price').textContent.replace('Rs. ', '').replace(' LKR', ''));
  const itemQuantity = parseInt(item.querySelector('#dairy-quantity').value);

  // Check if the item quantity is greater than 0
  if (itemQuantity > 0) {
      // Calculate total for this item
      const itemTotal = itemPrice * itemQuantity;

      // Create item object
      const cartItem = {
          name: itemName,
          price: itemPrice,
          quantity: itemQuantity,
          total: itemTotal
      };

      // Save item to localStorage
      let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      cartItems.push(cartItem);
      localStorage.setItem('cartItems', JSON.stringify(cartItems));

      // Save total price to localStorage
      const currentTotalPrice = parseFloat(localStorage.getItem('totalPrice')) || 0;
      const newTotalPrice = currentTotalPrice + itemTotal;
      localStorage.setItem('totalPrice', newTotalPrice.toFixed(2));

      // Update UI
      addItemToTable(cartItem);
      updateTotalPrice(newTotalPrice);
  }
}

function addItemToTable(cartItem) {
  const cartTableBody = document.querySelector('.cart-table tbody');

  const row = document.createElement('tr');

  const itemCell = document.createElement('td');
  itemCell.textContent = cartItem.name;
  row.appendChild(itemCell);

  const quantityCell = document.createElement('td');
  quantityCell.textContent = cartItem.quantity;
  row.appendChild(quantityCell);

  const priceCell = document.createElement('td');
  priceCell.textContent = `Rs. ${cartItem.price.toFixed(2)} LKR`;
  row.appendChild(priceCell);

  const totalCell = document.createElement('td');
  totalCell.textContent = `Rs. ${cartItem.total.toFixed(2)} LKR`;
  row.appendChild(totalCell);

  cartTableBody.appendChild(row);
}

function updateTotalPrice(newTotalPrice) {
  const totalPriceElement = document.querySelector('.total-price');
  totalPriceElement.textContent = `Rs. ${newTotalPrice.toFixed(2)} LKR`;
}

// Event listeners remain the same
document.querySelectorAll('.addCart').forEach((button) => {
  button.addEventListener('click', function(event) {
      event.preventDefault();  // Prevents the default action of the anchor tag
      const item = this.closest('.item');
      updateCart(item);
  });
});

// Event listener for all "Add to Cart" buttons in the dairy section
document.querySelectorAll('.dairy-addCart').forEach((button) => {
  button.addEventListener('click', function(event) {
    event.preventDefault();  // Prevents the default action of the anchor tag
    const item = this.closest('.item');
    updateDairyCart(item);
  });
});

// Function to save the current order to favourites
function saveToFavourites() {
  const cartItems = [];
  const cartTableBody = document.querySelector('.cart-table tbody');
  
  // Loop through each row in the cart table to gather item details
  cartTableBody.querySelectorAll('tr').forEach(row => {
    const itemName = row.querySelector('td:nth-child(1)').textContent;
    const itemQuantity = parseFloat(row.querySelector('td:nth-child(2)').textContent);
    const itemPrice = parseFloat(row.querySelector('td:nth-child(3)').textContent.replace('Rs. ', '').replace(' LKR', ''));
    
    cartItems.push({ name: itemName, quantity: itemQuantity, price: itemPrice });
  });

  // Save the cart items to local storage as a favourite
  localStorage.setItem('favouriteOrder', JSON.stringify(cartItems));
  alert('Order has been saved as favourite!');
}

// Function to apply the favourite order to the cart
function applyFavourites() {
  const favouriteOrder = localStorage.getItem('favouriteOrder');
  const cartTableBody = document.querySelector('.cart-table tbody');
  
  // Clear the existing cart in the UI
  cartTableBody.innerHTML = '';
  
  // Clear the current cart items in localStorage
  localStorage.removeItem('cartItems');
  localStorage.removeItem('totalPrice');

  let totalPrice = 0;

  if (favouriteOrder) {
    const items = JSON.parse(favouriteOrder);
    let cartItems = [];

    // Add each item from the favourite order to the cart table
    items.forEach(item => {
      const row = document.createElement('tr');

      const itemCell = document.createElement('td');
      itemCell.textContent = item.name;
      row.appendChild(itemCell);

      const quantityCell = document.createElement('td');
      quantityCell.textContent = item.quantity;
      row.appendChild(quantityCell);

      const priceCell = document.createElement('td');
      priceCell.textContent = `Rs. ${item.price.toFixed(2)} LKR`;
      row.appendChild(priceCell);

      const totalCell = document.createElement('td');
      const itemTotal = item.price * item.quantity;
      totalCell.textContent = `Rs. ${itemTotal.toFixed(2)} LKR`;
      row.appendChild(totalCell);

      cartTableBody.appendChild(row);

      // Update the total price
      totalPrice += itemTotal;

      // Save item back to localStorage
      cartItems.push({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        total: itemTotal
      });
    });

    // Update total price in the UI
    const totalPriceElement = document.querySelector('.total-price');
    totalPriceElement.textContent = `Rs. ${totalPrice.toFixed(2)} LKR`;

    // Save the updated cart back to localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    localStorage.setItem('totalPrice', totalPrice.toFixed(2));

    alert('Favourite order has been applied!');
  } else {
    alert('No favourite order found!');
  }
}


// Event listener for "Add to Favourites" button
document.getElementById('add-to-favourites').addEventListener('click', saveToFavourites);

// Event listener for "Apply Favourites" button
document.getElementById('apply-favourites').addEventListener('click', applyFavourites);

// Function to clear the cart
function clearCart() {
  const cartTableBody = document.querySelector('.cart-table tbody');
  const totalPriceElement = document.querySelector('.total-price');
  
  // Clear all rows from the cart table
  cartTableBody.innerHTML = '';

  // Reset the total price
  totalPriceElement.textContent = 'Rs. 0.00 LKR';

  alert('Cart has been cleared!');
}

// Event listener for "Clear Cart" button
function clearCart() {
  // Clear localStorage items related to the cart
  localStorage.removeItem('cartItems');
  localStorage.removeItem('totalPrice');

  // Clear the cart table in the UI
  const cartTableBody = document.querySelector('.cart-table tbody');
  cartTableBody.innerHTML = '';

  // Reset the total price display
  const totalPriceElement = document.querySelector('.total-price');
  totalPriceElement.textContent = 'Rs. 0.00 LKR';
}

document.getElementById('clear-cart').addEventListener('click', clearCart);

document.getElementById("buy-now").addEventListener("click", function(event) {
  event.preventDefault(); // Prevent the default link action

  const cartTableBody = document.querySelector('.cart-table tbody');

  // Check if the cart is empty
  if (cartTableBody.querySelectorAll('tr').length === 0) {
      alert("Your cart is empty. Please add items to your cart before proceeding to payment.");
  } else {
      // Redirect to the payment page
      window.location.href = "./paymentpage.html";
  }
});

function clearCartStorage() {
  localStorage.removeItem('cartItems');
  localStorage.removeItem('totalPrice');
}

function loadCart() {
  clearCartStorage(); // Clear previous items in localStorage
  updateCartDisplay(); // Load the cart with items from the current session
}

function updateCart(item) {
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

  const itemName = item.querySelector('p').textContent;
  const itemPrice = parseFloat(item.querySelector('#price').textContent.replace('Rs. ', '').replace(' LKR', ''));
  const itemQuantity = parseFloat(item.querySelector('#quantity').value);

  if (itemQuantity > 0) {
      const itemTotal = itemPrice * itemQuantity;

      const cartItem = {
          name: itemName,
          price: itemPrice,
          quantity: itemQuantity,
          total: itemTotal
      };

      cartItems.push(cartItem);
      localStorage.setItem('cartItems', JSON.stringify(cartItems));

      // Recalculate the total price from scratch based on current cart items
      updateCartDisplay();
  }
}

function updateDairyCart(item) {
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

  const itemName = item.querySelector('p').textContent;
  const itemPrice = parseFloat(item.querySelector('#dairy-price').textContent.replace('Rs. ', '').replace(' LKR', ''));
  const itemQuantity = parseInt(item.querySelector('#dairy-quantity').value);

  if (itemQuantity > 0) {
      const itemTotal = itemPrice * itemQuantity;

      const cartItem = {
          name: itemName,
          price: itemPrice,
          quantity: itemQuantity,
          total: itemTotal
      };

      cartItems.push(cartItem);
      localStorage.setItem('cartItems', JSON.stringify(cartItems));

      // Recalculate the total price from scratch based on current cart items
      updateCartDisplay();
  }
}

function updateCartDisplay() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const cartTableBody = document.querySelector('.cart-table tbody');
  cartTableBody.innerHTML = '';

  let totalPrice = 0;

  cartItems.forEach(cartItem => {
      const row = document.createElement('tr');

      const itemCell = document.createElement('td');
      itemCell.textContent = cartItem.name;
      row.appendChild(itemCell);

      const quantityCell = document.createElement('td');
      quantityCell.textContent = cartItem.quantity;
      row.appendChild(quantityCell);

      const priceCell = document.createElement('td');
      priceCell.textContent = `Rs. ${cartItem.price.toFixed(2)} LKR`;
      row.appendChild(priceCell);

      const totalCell = document.createElement('td');
      totalCell.textContent = `Rs. ${cartItem.total.toFixed(2)} LKR`;
      row.appendChild(totalCell);

      cartTableBody.appendChild(row);

      totalPrice += cartItem.total;
  });

  const totalPriceElement = document.querySelector('.total-price');
  totalPriceElement.textContent = `Rs. ${totalPrice.toFixed(2)} LKR`;

  localStorage.setItem('totalPrice', totalPrice.toFixed(2));
}

window.onload = function() {
  loadCart();
};

// Function to load cart items from local storage and display them
function loadCart() {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const cartTableBody = document.querySelector('.cart-table tbody');
  let totalPrice = 0;

  cartTableBody.innerHTML = '';  // Clear the table body

  // Iterate over each item and add it to the cart display
  cartItems.forEach(cartItem => {
      const row = document.createElement('tr');

      const itemCell = document.createElement('td');
      itemCell.textContent = cartItem.name;
      row.appendChild(itemCell);

      const quantityCell = document.createElement('td');
      quantityCell.textContent = cartItem.quantity;
      row.appendChild(quantityCell);

      const priceCell = document.createElement('td');
      priceCell.textContent = `Rs. ${cartItem.price.toFixed(2)} LKR`;
      row.appendChild(priceCell);

      const totalCell = document.createElement('td');
      totalCell.textContent = `Rs. ${cartItem.total.toFixed(2)} LKR`;
      row.appendChild(totalCell);

      cartTableBody.appendChild(row);

      // Add to the total price
      totalPrice += cartItem.total;
  });

  // Update the total price in the UI
  const totalPriceElement = document.querySelector('.total-price');
  totalPriceElement.textContent = `Rs. ${totalPrice.toFixed(2)} LKR`;
}

// Function to clear the cart (including local storage)
function clearCart() {
  localStorage.removeItem('cartItems');
  localStorage.removeItem('totalPrice');

  // Clear the cart table in the UI
  const cartTableBody = document.querySelector('.cart-table tbody');
  cartTableBody.innerHTML = '';

  // Reset the total price display
  const totalPriceElement = document.querySelector('.total-price');
  totalPriceElement.textContent = 'Rs. 0.00 LKR';

  alert('Cart has been cleared!');
}

// Event listener for "Clear Cart" button
document.getElementById('clear-cart').addEventListener('click', clearCart);

// Load the cart when the page loads
window.onload = function() {
  loadCart();
};


