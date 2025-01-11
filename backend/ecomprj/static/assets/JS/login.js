document.addEventListener('DOMContentLoaded', () => {
    const cart = [];

    // Function to add item to cart
    function addToCart(productId, productName, productPrice) {
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity += 1;
        } else {
            cart.push({ id: productId, name: productName, price: productPrice, quantity: 1 });
        }
        console.log(cart);
        updateCartUI();
    }

    // Function to update cart UI
    function updateCartUI() {
        const cartContainer = document.querySelector('.cart__items');
        cartContainer.innerHTML = '';
        cart.forEach(item => {
            const cartItem = document.createElement('tr');
            cartItem.classList.add('cart__item');
            cartItem.setAttribute('data-product-id', item.id);
            cartItem.innerHTML = `
                <td><img src="./img/product${item.id}.png" alt="${item.name}" class="table__img"></td>
                <td>
                    <h3 class="table__title">${item.name}</h3>
                    <p class="table__description">Description of ${item.name}</p>
                </td>
                <td><span class="table__price">$${item.price}</span></td>
                <td><input type="number" class="quantity" value="${item.quantity}" data-product-id="${item.id}"></td>
                <td><span class="table__subtotal">$${(item.price * item.quantity).toFixed(2)}</span></td>
                <td><button class="remove-product" data-product-id="${item.id}"><i class="fi fi-rs-trash table__trash"></i></button></td>
            `;
            cartContainer.appendChild(cartItem);
        });
    }

    // Add event listeners to add-to-cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = event.target.getAttribute('data-product-id');
            const productName = event.target.getAttribute('data-product-name');
            const productPrice = event.target.getAttribute('data-product-price');
            addToCart(productId, productName, productPrice);
        });
    });

    // Add event listener to handle quantity change and remove item
    document.querySelector('.cart__items').addEventListener('input', (event) => {
        if (event.target.classList.contains('quantity')) {
            const productId = event.target.getAttribute('data-product-id');
            const item = cart.find(item => item.id === productId);
            if (item) {
                item.quantity = parseInt(event.target.value, 10);
                updateCartUI();
            }
        }
    });

    document.querySelector('.cart__items').addEventListener('click', (event) => {
        if (event.target.closest('.remove-product')) {
            const productId = event.target.closest('.remove-product').getAttribute('data-product-id');
            const itemIndex = cart.findIndex(item => item.id === productId);
            if (itemIndex > -1) {
                cart.splice(itemIndex, 1);
                updateCartUI();
            }
        }
    });
});