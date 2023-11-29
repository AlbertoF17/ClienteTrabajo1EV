function checkLoggedIn() {
    const currentUser = sessionStorage.getItem("user");
    return currentUser;
}

if (checkLoggedIn() === null) {
    window.location.href = "session.html";
}

const currentProduct = JSON.parse(sessionStorage.getItem('currentProduct'));
if (currentProduct) {
    productContent(currentProduct);
} else {
    console.error("Product details not found.");
}

function productContent(product) {
    const localProducts = JSON.parse(localStorage.getItem('products')) || [];
    const matchingLocalProduct = localProducts.find(localProduct => localProduct.id == product.id);

    if (matchingLocalProduct) {
        product = matchingLocalProduct;
    }

    const productDiv = document.querySelector("#product-details");
    const productInfo = document.querySelector("#product-info");
    const productTitle = document.createElement("h3");
    const productImage = document.createElement("img");
    const productPrice = document.createElement("p");
    const productCategory = document.createElement("p");
    const productRating = document.createElement("p");
    const productDescription = document.createElement("p");
    const divButtons = document.createElement("div");
    const productEditButton = document.createElement("button");
    const productDeleteButton = document.createElement("button");
    productTitle.textContent = `${product.title}`;
    productImage.src = `${product.image}`;
    productPrice.textContent = `Price: ${product.price} €`;
    productCategory.textContent = `Category: ${product.category}`;
    productDescription.textContent = `${product.description}`;
    productRating.textContent = `Stars: ${product.rating.rate} || Opinions: ${product.rating.count}`;
    productEditButton.textContent = `Edit`;
    productDeleteButton.textContent = `Delete`;
    divButtons.appendChild(productEditButton);
    divButtons.appendChild(productDeleteButton);
    productInfo.appendChild(productTitle);
    productInfo.appendChild(productImage);
    productInfo.appendChild(productPrice);
    productInfo.appendChild(productCategory);
    productInfo.appendChild(productDescription);
    productInfo.appendChild(productRating);
    productInfo.appendChild(divButtons);
    productDiv.style.display = "flex";
    productDiv.style.flexDirection = "column";
    productDiv.style.alignItems = "center";
    productInfo.style.display = "flex";
    productInfo.style.flexDirection = "column";
    productInfo.style.alignItems = "center";
    productInfo.style.textAlign = "center";
    productInfo.style.width = "50vw";
    productImage.style.height = "40vh";
    productInfo.style.gap = "1.5rem";
    divButtons.style.display = "flex";
    divButtons.style.gap = "7rem";
    productPrice.style.margin = "0";
    productCategory.style.margin = "0";
    productDescription.style.margin = "0";
    productEditButton.addEventListener("click", function () {
        const url = new URL('/pages/editProduct.html', window.location.origin);
        url.searchParams.set('id', `${product.id}`);
        window.location.href = url.href;
    });

    productDeleteButton.addEventListener("click", function () {
        // Encontrar el ítem en el carrito correspondiente al producto
        const cartItemId = findCartItemById(product.id);
        saveDeletedItem(product);
        if (cartItemId !== null) {
            // Realizar la solicitud DELETE al endpoint del carrito
            deleteCartItem(cartItemId);
        } else {
            console.error("Product not found in the cart.");
        }
        window.location.href = "/../index.html";
    });
}

function findCartItemById(productId) {
    // Obtener el carrito desde la API
    return fetch('https://fakestoreapi.com/carts')
        .then(res => res.json())
        .then(cart => {
            // Buscar el ítem en el carrito que coincide con el producto
            const cartItem = cart.find(item => item.productId === productId);

            // Devolver el ID del ítem si se encuentra, de lo contrario, devolver null
            return cartItem ? cartItem.id : null;
        })
        .catch(error => {
            console.error('Error fetching cart:', error);
            return null;
        });
}

function deleteCartItem(cartItemId) {
    // Realizar la solicitud DELETE al endpoint del carrito
    fetch(`https://fakestoreapi.com/carts/${cartItemId}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        console.log('Product deleted successfully.');
    })
    .catch(error => {
        console.error('Error deleting product:', error);
    });
}

function saveDeletedItem(product) {
    // Obtener la lista actual de productos eliminados del localStorage
    const deletedItems = JSON.parse(localStorage.getItem('deleted_items')) || [];
    // Agregar el producto eliminado a la lista
    deletedItems.push(product);
    // Guardar la lista actualizada en el localStorage
    localStorage.setItem('deleted_items', JSON.stringify(deletedItems));
}