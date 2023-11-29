const purchaseHistoryList = document.querySelector("#purchase-history-div");

function createCartItem(cart, totalPrice) {
    const cartItem = document.createElement("div");
    const cartDate = document.createElement("p");
    const cartProducts = cart.products;

    cartDate.textContent = `Date: ${cart.date}`;
    cartItem.appendChild(cartDate);

    cartProducts.forEach(product => {
        const productDiv = document.createElement("div");
        productDiv.className = "cart-products";
        const productTitle = document.createElement("p");
        const productImage = document.createElement("img");
        const productPrice = document.createElement("p");
        const productQuantity = document.createElement("p");

        productTitle.textContent = `${product.title || product.productInfo.title}`;
        productImage.src = `${product.image || product.productInfo.image}`;
        productPrice.textContent = `Price: ${product.price || product.productInfo.price} €`;
        productQuantity.textContent = `Quantity: ${product.quantity}`;

        productDiv.appendChild(productTitle);
        productDiv.appendChild(productImage);
        productDiv.appendChild(productPrice);
        productDiv.appendChild(productQuantity);
        cartItem.appendChild(productDiv);
    });

    const cartPrice = document.createElement("p");
    cartPrice.textContent = `Total Price: ${totalPrice.toFixed(2)} €`;
    cartItem.appendChild(cartPrice);

    return cartItem;
}

function displayNoHistoryMessage() {
    const noHistoryItem = document.createElement("div");
    noHistoryItem.textContent = "No purchase history available.";
    purchaseHistoryList.appendChild(noHistoryItem);
}

// Obtener el nombre del usuario actual del localStorage
const username = JSON.parse(sessionStorage.getItem("user")).username;
const currentUserKey = `user_${username}`;
const currentUser = JSON.parse(localStorage.getItem(currentUserKey));

if (currentUser) {
    if (currentUser.carts && currentUser.carts.length > 0) {
        currentUser.carts.reverse();

        // Si el usuario del localStorage tiene historial de compras en la propiedad "carts"
        currentUser.carts.forEach(cart => {
            const totalPrice = cart.totalPrice || calculateTotalPrice(cart.products);
            const cartItem = createCartItem(cart, totalPrice);
            purchaseHistoryList.appendChild(cartItem);
        });

    }
} else {
    fetch('https://fakestoreapi.com/carts')
    .then(res => res.json())
    .then(allCarts => {
        console.log(allCarts);
        const userCarts = allCarts.forEach(cart => {
            if (cart.userId == currentUser.id) {
                userCarts.push(cart);
            }
        });

        if (userCarts.length > 0) {
            // Obtener todos los productos
            fetch('https://fakestoreapi.com/products')
                .then(res => res.json())
                .then(allProducts => {
                    userCarts.forEach(cart => {
                        const totalPrice = calculateTotalPrice(cart.products, allProducts);
                        const cartItem = createCartItem(cart, totalPrice);
                        purchaseHistoryList.appendChild(cartItem);
                        console.log(cartItem);
                    });
                })
                .catch(productError => {
                    console.error('Error al obtener información de productos:', productError);
                    displayNoHistoryMessage();
                });
        } else {
            // Si no hay historial de compras en la API para este usuario
            displayNoHistoryMessage();
        }
    })
    .catch(error => {
        console.error('Error al obtener los carritos del usuario:', error);
        displayNoHistoryMessage();
    });
}


function calculateTotalPrice(cartProducts, allProducts) {
    return cartProducts.reduce((total, product) => {
        const productInfo = allProducts.find(p => p.id === product.productId);
        const price = productInfo ? productInfo.price : 0;
        return total + price * product.quantity;
    }, 0);
}