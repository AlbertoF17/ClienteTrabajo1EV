const purchaseHistoryList = document.querySelector("#purchase-history-div");
const sessionUser = JSON.parse(sessionStorage.getItem("user"));
const sessionUsername = sessionUser.username;
const localUser = localStorage.getItem(`user_${sessionUser.username}`);

async function getProductDetails(productId) {
    try {
        const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
        const productDetails = await response.json();
        return productDetails;
    } catch (error) {
        console.error('Error fetching product details:', error);
        return null;
    }
}

async function createCartItem(cart) {
    const cartItem = document.createElement("div");
    const cartDate = document.createElement("p");

    let totalPrice = 0;
    cartDate.textContent = `Date: ${cart.date}`;
    cartItem.appendChild(cartDate);
    let productTitle = "";
    let productImage = "";
    let productPrice = "";
    let productQuantity = "";
    if (localUser) {
        for (const product of cart.products) {
            const productDiv = document.createElement("div");
            productDiv.className = "cart-products";
            productTitle = document.createElement("p");
            productImage = document.createElement("img");
            productPrice = document.createElement("p");
            productQuantity = document.createElement("p");
            productTitle.textContent = `${product.title}`;
            productImage.src = `${product.image}`;
            productPrice.textContent = `${product.price} €`;
            productQuantity.textContent = `Quantity: ${product.quantity}`;
            totalPrice += parseFloat(product.price * product.quantity);
            productDiv.appendChild(productTitle);
            productDiv.appendChild(productImage);
            productDiv.appendChild(productPrice);
            productDiv.appendChild(productQuantity);
            cartItem.appendChild(productDiv);
        }

    } else {
        for (const product of cart.products) {
            try {
                const productDiv = document.createElement("div");
                productDiv.className = "cart-products";
                productTitle = document.createElement("p");
                productImage = document.createElement("img");
                productPrice = document.createElement("p");
                productQuantity = document.createElement("p");
                const productDetails = await getProductDetails(product.productId);
                productTitle.textContent = `${productDetails.title}`;
                productImage.src = `${productDetails.image}`;
                productPrice.textContent = `${productDetails.price} €`;
                productQuantity.textContent = `Quantity: ${product.quantity}`;
                totalPrice += parseFloat(productDetails.price * product.quantity);
                productDiv.appendChild(productTitle);
                productDiv.appendChild(productImage);
                productDiv.appendChild(productPrice);
                productDiv.appendChild(productQuantity);
                cartItem.appendChild(productDiv);
            } catch (productError) {
                console.error('Error fetching product details:', productError);
                // Handle the error if necessary
            }
        }
    }
    const totalPriceElement = document.createElement("p");
    totalPriceElement.textContent = `Total price: ${totalPrice.toFixed(2)} €`;
    cartItem.appendChild(totalPriceElement);
    return cartItem;
}

function displayNoHistoryMessage() {
    const noHistoryItem = document.createElement("div");
    noHistoryItem.textContent = "No purchase history available.";
    purchaseHistoryList.appendChild(noHistoryItem);
}

async function fetchAndDisplayPurchaseHistory() {
    try {
        let userCarts = []
        if (JSON.parse(localStorage.getItem(`user_${sessionUsername}`))) {
            userCarts = JSON.parse(localStorage.getItem(`user_${sessionUsername}`)).carts;
        } else {
            const userId = sessionUser.id;
            const response = await fetch('https://fakestoreapi.com/carts');
            const allCarts = await response.json();
            userCarts = allCarts.filter(cart => cart.userId === userId);
        }

        for (const cart of userCarts) {
            const cartItem = await createCartItem(cart);
            purchaseHistoryList.appendChild(cartItem);
        }
    } catch (error) {
        console.error('Error al obtener los carritos del usuario:', error);
        displayNoHistoryMessage();
    }
}

fetchAndDisplayPurchaseHistory();