// Obtener el usuario actual del sessionStorage
const currentUser = JSON.parse(sessionStorage.getItem("user"));

// Obtener la información del historial de compras del localStorage
const localStorageUser = JSON.parse(localStorage.getItem(`user_${currentUser.username}`));
const purchaseHistory = localStorageUser.carts || [];
purchaseHistory.reverse();

// Llenar la lista de historial de compras
const purchaseHistoryList = document.querySelector("#purchase-history-div");

if (purchaseHistory.length > 0) {
    purchaseHistory.forEach(cart => {
        const cartItem = document.createElement("div");
        const cartDate = document.createElement("p");
        const cartProducts = cart.products;
        const cartPrice = document.createElement("p");
        cartDate.textContent = `Date: ${cart.date}`;
        cartPrice.textContent = `Total Price: ${cart.totalPrice} €`;
        cartItem.appendChild(cartDate);
        cartProducts.forEach(product => {
            const productDiv = document.createElement("div");
            productDiv.className = "cart-products";
            const productTitle = document.createElement("p");
            const productImage = document.createElement("img");
            const productPrice = document.createElement("p");
            const productQuantity = document.createElement("p");
            productTitle.textContent = `${product.title}`;
            productImage.src = `${product.image}`;
            productPrice.textContent = `Price: ${product.price}`;
            productQuantity.textContent = `Quantity: ${product.quantity}`;
            productDiv.appendChild(productTitle);
            productDiv.appendChild(productImage);
            productDiv.appendChild(productPrice);
            productDiv.appendChild(productQuantity);
            cartItem.appendChild(productDiv);
        });
        cartItem.appendChild(cartPrice);
        purchaseHistoryList.appendChild(cartItem);
    });
} else {
    const noHistoryItem = document.createElement("li");
    noHistoryItem.textContent = "No purchase history available.";
    purchaseHistoryList.appendChild(noHistoryItem);
}