function checkLoggedIn() {
    const currentUser = sessionStorage.getItem("user");
    return currentUser;
}

if (checkLoggedIn() === null) {
    if (window.location.href.endsWith("index.html")){
        window.location.href = "pages/session.html";
    } else {
        window.location.href = "session.html";
    }   
}

const cartButton = document.querySelector("#cart-dropdown-btn");
const cartDropdown = document.querySelector("#cart-dropdown");

document.getElementById("logout-button").addEventListener("click", function () {
    sessionStorage.removeItem("user");
    window.location.reload();
});

if (!window.location.href.endsWith("index.html")) {
    const returnButton = document.querySelector("#return");
    returnButton.addEventListener("click", function (event) {
        console.log("sexo");
        window.location.href = "../index.html";
    });

}

cartButton.addEventListener("click", function () {
    cartDropdown.classList.toggle("active");
    const cartItems = JSON.parse(sessionStorage.getItem("cart"));
    cartDropdown.innerHTML = '';

    let totalCartPrice = 0; // Initialize the total cart price

    if (cartItems && cartItems.length > 0) {
        cartItems.forEach(product => {
            const productDiv = document.createElement("div");
            const quantityDiv = document.createElement("div");
            const buttonPlus = document.createElement("button");
            const buttonMinus = document.createElement("button");
            const productImg = document.createElement("img");
            const productName = document.createElement("p");
            const productPrice = document.createElement("p");
            const productQuantity = document.createElement("p");

            productName.textContent = product.title;
            productName.style.fontWeight = "bold";
            productPrice.textContent = `Price: ${product.price} €`;
            productQuantity.textContent = `${product.quantity}`;
            productImg.src = product.image;

            // Calculate and display the total price for each product
            const totalPriceForProduct = product.price * product.quantity;
            totalCartPrice += totalPriceForProduct;

            quantityDiv.style.display = "flex";
            quantityDiv.style.flexDirection = "column";
            quantityDiv.style.alignItems = "center";
            quantityDiv.style.textAlign = "center";

            buttonPlus.textContent = "+";
            buttonPlus.style.width = "1.5rem";
            buttonPlus.addEventListener("click", () => updateQuantity(product.id, 1));
            buttonPlus.className = "quantity-button";

            buttonMinus.textContent = "-";
            buttonMinus.style.width = "1.5rem";
            buttonMinus.addEventListener("click", () => updateQuantity(product.id, -1));
            buttonMinus.className = "quantity-button";

            productDiv.appendChild(productImg);
            productDiv.appendChild(productName);
            productDiv.appendChild(productPrice);
            quantityDiv.appendChild(buttonPlus);
            quantityDiv.appendChild(productQuantity);
            quantityDiv.appendChild(buttonMinus);
            productDiv.appendChild(quantityDiv);

            productDiv.className = "cart-product";
            productDiv.style.display = "flex";

            cartDropdown.appendChild(productDiv);
        });

        // Add the total cart price at the end
        const totalCartPriceElement = document.createElement("p");
        totalCartPriceElement.textContent = `Total: ${totalCartPrice} €`;
        cartDropdown.appendChild(totalCartPriceElement);

        const confirmPurchase = document.createElement("button");
        confirmPurchase.id = "confirm-purchase-btn";
        confirmPurchase.textContent = "Confirm Purchase";
        confirmPurchase.addEventListener("click", function () {
            handleConfirmPurchase(cartItems, totalCartPrice);
        });
        cartDropdown.appendChild(confirmPurchase);
    } else {
        cartDropdown.textContent = "Empty Cart";
    }
});

function handleConfirmPurchase(cartItems, totalCartPrice) {
    const currentUser = JSON.parse(sessionStorage.getItem("user"));

    if (currentUser) {
        const currentDate = new Date();
        const newCart = {
            date: currentDate.toISOString(),
            products: cartItems,
            totalPrice: totalCartPrice
        };

        // Verificar si el usuario ya tiene carritos confirmados en localStorage
        const localStorageUser = JSON.parse(localStorage.getItem(`user_${currentUser.username}`));

        if (localStorageUser && localStorageUser.carts) {
            localStorageUser.carts.push(newCart);
        } else {
            // Si no hay carritos confirmados, crea uno nuevo
            localStorageUser.carts = [newCart];
        }

        // Actualizar el perfil del usuario en localStorage
        localStorage.removeItem(`user_${currentUser.username}`);
        localStorage.setItem(`user_${currentUser.username}`, JSON.stringify(localStorageUser));

        // Añadir un nuevo carrito a la API
        fetch('https://fakestoreapi.com/carts', {
            method: "POST",
            body: JSON.stringify({
                userId: currentUser.id,
                date: currentDate.toISOString(),
                products: cartItems.map(item => ({
                    productId: item.id,
                    quantity: item.quantity
                }))
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(json => console.log(json))
            .catch(error => console.error('Error al añadir un nuevo carrito a la API:', error));

        // Limpiar el carrito en sessionStorage
        sessionStorage.removeItem("cart");

        // Redirigir u realizar otras acciones según sea necesario
        window.location.href = "../index.html";
    } else {
        console.error("Usuario no ha iniciado sesión.");
    }
}

function updateQuantity(productId, quantityChange) {
    try {
        const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
        const existingProductIndex = cart.findIndex(p => p.id === productId);

        if (existingProductIndex !== -1) {

            cart[existingProductIndex].quantity += quantityChange;

            if (cart[existingProductIndex].quantity === 0) {
                cart.splice(existingProductIndex, 1);
            }

            sessionStorage.setItem("cart", JSON.stringify(cart));

            cartButton.click();
            cartButton.click();
        }
    } catch (error) {
        console.error("Error al actualizar la cantidad:", error);
    }
}

const dropdownContent = document.querySelector("#profile-dropdown");
const profileImage = document.querySelector(".profile-image");

profileImage.addEventListener("click", function (event) {
    event.stopPropagation(); // Prevent the click event from reaching the window.onclick handler
    dropdownContent.classList.toggle("show");
});

function goToProfile() {
    window.location.href = "pages/profile.html";
}

// Close the dropdown if the user clicks outside of it
window.onclick = function (event) {
    const profileDropdown = document.querySelector("#profile-dropdown");
    if (profileDropdown.classList.contains("show")) {
        profileDropdown.classList.remove("show");
    }
};