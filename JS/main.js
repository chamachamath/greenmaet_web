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
  let totalPrice = 0;

  // Get item details
  const itemName = item.querySelector('p').textContent;
  const itemPrice = parseFloat(item.querySelector('#price').textContent.replace('Rs. ', '').replace(' LKR', ''));
  const itemQuantity = parseFloat(item.querySelector('#quantity').value);

  // Check if the item quantity is greater than 0
  if (itemQuantity > 0) {
    // Calculate total for this item
    const itemTotal = itemPrice * itemQuantity;

    // Create a new row for this item in the cart table
    const row = document.createElement('tr');

    const itemCell = document.createElement('td');
    itemCell.textContent = itemName;
    row.appendChild(itemCell);

    const quantityCell = document.createElement('td');
    quantityCell.textContent = itemQuantity;
    row.appendChild(quantityCell);

    const priceCell = document.createElement('td');
    priceCell.textContent = `Rs. ${itemPrice.toFixed(2)} LKR`;
    row.appendChild(priceCell);

    const totalCell = document.createElement('td');
    totalCell.textContent = `Rs. ${itemTotal.toFixed(2)} LKR`;
    row.appendChild(totalCell);

    cartTableBody.appendChild(row);

    // Update total price in the cart
    totalPriceElement.textContent = `Rs. ${(parseFloat(totalPriceElement.textContent.replace('Rs. ', '').replace(' LKR', '')) + itemTotal).toFixed(2)} LKR`;
  }
}

// Event listener for all "Add to Cart" buttons
document.querySelectorAll('.addCart').forEach((button) => {
  button.addEventListener('click', function(event) {
    event.preventDefault();  // Prevents the default action of the anchor tag
    const item = this.closest('.item');
    updateCart(item);
  });
});

// Function to update the cart for dairy products
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

    // Create a new row for this item in the cart table
    const row = document.createElement('tr');

    const itemCell = document.createElement('td');
    itemCell.textContent = itemName;
    row.appendChild(itemCell);

    const quantityCell = document.createElement('td');
    quantityCell.textContent = itemQuantity;
    row.appendChild(quantityCell);

    const priceCell = document.createElement('td');
    priceCell.textContent = `Rs. ${itemPrice.toFixed(2)} LKR`;
    row.appendChild(priceCell);

    const totalCell = document.createElement('td');
    totalCell.textContent = `Rs. ${itemTotal.toFixed(2)} LKR`;
    row.appendChild(totalCell);

    cartTableBody.appendChild(row);

    // Update total price in the cart
    const currentTotalPrice = parseFloat(totalPriceElement.textContent.replace('Rs. ', '').replace(' LKR', ''));
    totalPriceElement.textContent = `Rs. ${(currentTotalPrice + itemTotal).toFixed(2)} LKR`;
  }
}

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
  const totalPriceElement = document.querySelector('.total-price');
  
  // Clear the existing cart
  cartTableBody.innerHTML = '';
  let totalPrice = 0;
  
  if (favouriteOrder) {
    const items = JSON.parse(favouriteOrder);
    
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
    });

    totalPriceElement.textContent = `Rs. ${totalPrice.toFixed(2)} LKR`;
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


