document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('[data-target]'),
        tabContents = document.querySelectorAll('[content]');

    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            const target = document.querySelector(tab.dataset.target);
            tabContents.forEach((tabContent) => {
                tabContent.classList.remove('active-tab');
            });

            target.classList.add('active-tab');

            tabs.forEach((tab) => {
                tab.classList.remove('active-tab');
            });

            tab.classList.add('active-tab');
        });
    });
});

// --------------------IMAGE GALLERY--------------------------
function imgGallery() {
    const mainImg = document.querySelector('.details__img'),
    smallImg = document.querySelectorAll('.details__small-img');

    smallImg.forEach((img) => {
        img.addEventListener('click', function(){
            mainImg.src = this.src;
        });
    });
}

imgGallery();

// --------------------CART--------------------------
// Add product to cart
function addToCart(button) {
    // Get product details
    const product = {
      id: button.getAttribute("data-id"),
      name: button.getAttribute("data-name"),
      image: button.getAttribute("data-image"),
      price: button.getAttribute("data-price"),
      quantity: 1, // Default quantity
    };
  
    // Get the existing cart from localStorage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
  
    // Check if the product is already in the cart
    const existingProduct = cart.find((item) => item.id === product.id);
  
    if (existingProduct) {
      // Increase quantity if the product is already in the cart
      existingProduct.quantity++;
    } else {
      // Add new product to the cart
      cart.push(product);
    }
  
    // Save updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
  
    // Update cart count
    updateCartCount();
  }
  window.addToCart = addToCart;
  console.log("Script loaded") 
  // Update cart count
  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    document.querySelector(".header__action-btn_Cart .count").textContent = cart.length;
  }
  
  // Initialize cart count on page load
  document.addEventListener("DOMContentLoaded", updateCartCount);


// --------------------CHECKOUT--------------------------
document.addEventListener("DOMContentLoaded", function () {
    // Get cart data from localStorage
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Check if the cart is empty
    if (cart.length === 0) {
      document.getElementById("cart").innerHTML = "<p>Your cart is empty.</p>";
      return;
    }
  
    let cartHTML = '';
    let subtotal = 0;
  
    // Loop through cart items and build HTML
    cart.forEach(item => {
      const { name, image, price, quantity } = item;
      const itemTotal = parseFloat(price) * quantity;
  
      subtotal += itemTotal;
  
      cartHTML += `
        <div class="cart-item">
          <img src="${image}" alt="${name}">
          <div>
            <h3>${name}</h3>
            <p>Price: $${parseFloat(price).toFixed(2)}</p>
            <p>Quantity: ${quantity}</p>
            <p>Total: $${itemTotal.toFixed(2)}</p>
          </div>
        </div>
      `;
    });
  
    // Insert cart items into the DOM
    document.getElementById("cart").innerHTML = cartHTML;
  
    // Calculate totals
    const shipping = 10; // Example flat shipping fee
    const total = subtotal + shipping;
  
    // Update totals in the DOM
    document.getElementById("subtotal").textContent = `Subtotal: $${subtotal.toFixed(2)}`;
    document.getElementById("shipping").textContent = `Shipping: $${shipping.toFixed(2)}`;
    document.getElementById("total").textContent = `Total: $${total.toFixed(2)}`;
  });
  
  // --------------------WISHLIST--------------------------
// Add product to wishlist
function addToWishlist(button) {
    // Get product details
    const product = {
        id: button.getAttribute("data-id"),
        name: button.getAttribute("data-name"),
        image: button.getAttribute("data-image"),
        price: button.getAttribute("data-price"),
    };

    // Get the existing wishlist from localStorage
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    // Check if the product is already in the wishlist
    const existingProduct = wishlist.find((item) => item.id === product.id);

    if (!existingProduct) {
        // Add new product to the wishlist
        wishlist.push(product);
    }

    // Save updated wishlist to localStorage
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

// Add product to cart from wishlist
function addToCartFromWishlist(button) {
    // Get product details
    const product = {
        id: button.getAttribute("data-id"),
        name: button.getAttribute("data-name"),
        image: button.getAttribute("data-image"),
        price: button.getAttribute("data-price"),
        quantity: 1, // Default quantity
    };

    // Get the existing cart from localStorage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Check if the product is already in the cart
    const existingProduct = cart.find((item) => item.id === product.id);

    if (existingProduct) {
        // Increase quantity if the product is already in the cart
        existingProduct.quantity++;
    } else {
        // Add new product to the cart
        cart.push(product);
    }

    // Save updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Update cart count
    updateCartCount();
}

// Remove product from wishlist
function removeFromWishlist(button) {
    // Get the product ID
    const productId = button.getAttribute("data-id");

    // Get the existing wishlist from localStorage
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    // Filter out the product to be removed
    wishlist = wishlist.filter((item) => item.id !== productId);

    // Save updated wishlist to localStorage
    localStorage.setItem("wishlist", JSON.stringify(wishlist));

    // Reload the wishlist to update the UI
    location.reload();
}

// Load wishlist items on page load
document.addEventListener("DOMContentLoaded", function () {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const wishlistContainer = document.querySelector("#wishlistContainer");

    wishlist.forEach((item) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>
                <img src="${item.image}" alt="${item.name}" class="table__img">
            </td>
            <td>
                <h3 class="table__title">${item.name}</h3>
                <p class="table__description">It is a long established fact that a reader will be distracted by the readable.</p>
            </td>
            <td><span class="table__price">$${item.price}</span></td>
            <td><span class="table__stock">In Stock</span></td>
            <td><a href="#" class="btn btn--sm" data-id="${item.id}" data-name="${item.name}" data-image="${item.image}" data-price="${item.price}" onclick="addToCartFromWishlist(this)">Add to Cart</a></td>
            <td><i class="fi fi-rs-trash table__trash" data-id="${item.id}" onclick="removeFromWishlist(this)"></i></td>
        `;

        wishlistContainer.appendChild(row);
    });
});

// --------------------SWIPER CATEGORY--------------------------

var swiperCategories = new Swiper(".categories__container", {
  spaceBetween: 24,
  loop: true,
  navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
  },
  breakpoints: {
      640: {
          slidesPerView: 2,
          spaceBetween: 20,
      },
      768: {
          slidesPerView: 4,
          spaceBetween: 40,
      },
      1400: {
          slidesPerView: 6,
          spaceBetween: 24,
      },
  },
});