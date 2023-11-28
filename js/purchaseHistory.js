// Obtener el usuario actual del sessionStorage
const currentUser = JSON.parse(sessionStorage.getItem("user"));
const purchaseHistoryList = document.querySelector("#purchase-history-div");

if (currentUser && currentUser.id) {
    // Si el usuario actual tiene un ID, significa que es un usuario de la API
    // Obtener todos los carritos y filtrar solo los del usuario actual
    fetch('https://fakestoreapi.com/carts')
        .then(res => res.json())
        .then(allCarts => {
            const userCarts = allCarts.filter(cart => cart.userId === currentUser.id);

            if (userCarts.length > 0) {
                // Obtener todos los productos
                fetch('https://fakestoreapi.com/products')
                    .then(res => res.json())
                    .then(allProducts => {
                        // Llenar la lista de historial de compras
                        userCarts.forEach(cart => {
                            const cartItem = document.createElement("div");
                            const cartDate = document.createElement("p");
                            const cartProducts = cart.products;

                            // Mapear los productos del carrito a información completa de productos
                            const cartProductsInfo = cartProducts.map(cartProduct => {
                                const productInfo = allProducts.find(product => product.id === cartProduct.productId);
                                return {
                                    ...cartProduct,
                                    productInfo: productInfo
                                };
                            });

                            // Calcular el totalPrice sumando los precios de todos los productos en el carrito
                            const totalPrice = cartProductsInfo.reduce((total, product) => {
                                return total + (product.productInfo.price) * (product.quantity);
                            }, 0);

                            const cartPrice = document.createElement("p");
                            cartDate.textContent = `Date: ${cart.date}`;
                            cartPrice.textContent = `Total Price: ${totalPrice.toFixed(2)} €`;
                            cartItem.appendChild(cartDate);

                            cartProductsInfo.forEach(product => {
                                const productDiv = document.createElement("div");
                                productDiv.className = "cart-products";
                                const productTitle = document.createElement("p");
                                const productImage = document.createElement("img");
                                const productPrice = document.createElement("p");
                                const productQuantity = document.createElement("p");
                                productTitle.textContent = `${product.productInfo.title}`;
                                productImage.src = `${product.productInfo.image}`;
                                productPrice.textContent = `Price: ${product.productInfo.price} €`;
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
                    })
                    .catch(productError => {
                        console.error('Error al obtener información de productos:', productError);
                        // Manejar el error según tus necesidades
                    });
            } else {
                // Si no hay historial de compras en la API para este usuario
                const noHistoryItem = document.createElement("li");
                noHistoryItem.textContent = "No purchase history available.";
                purchaseHistoryList.appendChild(noHistoryItem);
            }
        })
        .catch(error => {
            console.error('Error al obtener los carritos del usuario:', error);
            // Manejar el error según tus necesidades
        });
} else if (user && user.carts && user.carts.length > 0) {
    // Si el usuario es del localStorage y tiene historial de compras
    user.carts.forEach(cart => {
        const cartItem = document.createElement("div");
        const cartDate = document.createElement("p");
        const cartProducts = cart.products;

        const cartPrice = document.createElement("p");
        cartDate.textContent = `Date: ${cart.date}`;
        cartPrice.textContent = `Total Price: ${cart.totalPrice.toFixed(2)} €`;
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
            productPrice.textContent = `Price: ${product.price} €`;
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
    // Si no hay historial de compras en la API ni en el objeto "user" del sessionStorage
    const noHistoryItem = document.createElement("li");
    noHistoryItem.textContent = "No purchase history available.";
    purchaseHistoryList.appendChild(noHistoryItem);
}