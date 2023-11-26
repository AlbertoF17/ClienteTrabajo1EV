// Clases
class User {
    constructor(username, password, email, firstname, lastname, phone, address) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.name = {
            firstname: firstname,
            lastname: lastname
        };
        this.phone = phone;
        this.address = {
            city: address.city,
            street: address.street,
            number: address.number,
            zipcode: address.zipcode,
            geolocation: address.geolocation
        };
    }
}

class Address {
    constructor(city, village, street, number, zipcode, geolocation) {
        this.city = city;
        this.village = village;
        this.street = street;
        this.number = number;
        this.zipcode = zipcode;
        this.geolocation = geolocation;
    }
}

class Geolocation {
    constructor(lat, long) {
        this.lat = lat,
            this.long = long
    }
}

class Product {
    constructor(id, title, price, category, description, image) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.category = category;
        this.description = description;
        this.image = image;
    }
}

if (window.location.pathname.endsWith("index.html")) {
    checkLoggedIn();

    const categorySelector = document.querySelector("#category-select");
    const productsContainer = document.querySelector("#products-container");
    const cartButton = document.querySelector("#cart-dropdown-btn");
    const cartDropdown = document.querySelector("#cart-dropdown");


    cartButton.addEventListener("click", function () {
        cartDropdown.classList.toggle("active");
        const cartItems = JSON.parse(sessionStorage.getItem("cart"));
        cartDropdown.innerHTML = '';
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
                productPrice.textContent = product.price;
                productQuantity.textContent = product.quantity;
                productImg.src = product.image;
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
            })
            const confirmPurchase = document.createElement("button");
            confirmPurchase.id = "confirm-purchase-btn";
            confirmPurchase.textContent = "Confirm Purchase";
            cartDropdown.appendChild(confirmPurchase);
        } else {
            cartDropdown.textContent = "Empty Cart";
        }
    });

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

    function toggleDropdown() {
        var dropdownContent = document.getElementById("dropdown-content");
        dropdownContent.classList.toggle("show");
    }

    function goToProfile() {
        // Implementar la lógica para redirigir al perfil
        console.log("Ir al perfil");
    }

    // Cerrar el menú desplegable si el usuario hace clic fuera de él
    window.onclick = function (event) {
        if (!event.target.matches('.profile-image')) {
            var dropdowns = document.getElementsByClassName("dropdown-content");
            var i;
            for (i = 0; i < dropdowns.length; i++) {
                var openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        }
    }

    categorySelector.addEventListener("change", filterProductsByCategory);

    displayCategories(categorySelector);
    filterProductsByCategory();

    function checkLoggedIn() {
        const currentUser = sessionStorage.getItem("user");
        if (!currentUser) {
            window.location.href = "pages/session.html";
        }
    }

    async function fetchProducts() {
        try {
            const response = await fetch("https://fakestoreapi.com/products");
            const apiProducts = await response.json();

            const localProducts = localStorage.getItem("localProducts") || [];

            const formattedLocalProducts = localProducts.map(product =>
                new Product(product.id, product.title, product.price, product.category, product.description, product.image)
            );

            const uniqueApiProducts = apiProducts.filter(apiProduct =>
                !formattedLocalProducts.some(localProduct => localProduct.id === apiProduct.id)
            );

            const allProducts = [...uniqueApiProducts, ...formattedLocalProducts];

            return allProducts;
        } catch (error) {
            console.error("Error fetching products:", error);
            return [];
        }
    }

    async function displayProducts(products) {
        productsContainer.innerHTML = "";
        products.forEach(product => {
            const productDiv = document.createElement("div");
            const productName = document.createElement("h3");
            const productImg = document.createElement("img");
            const productDesc = document.createElement("p");
            const btnDiv = document.createElement("div");
            const addToCartBtn = document.createElement("button");
            const viewProductBtn = document.createElement("button");

            productDiv.className = "product";
            productName.textContent = product.title;
            productImg.src = product.image;
            productDesc.textContent = product.description;
            addToCartBtn.textContent = "Add to Cart";
            viewProductBtn.textContent = "View Product";
            btnDiv.className = "product-btns";
            addToCartBtn.addEventListener("click", () => addToCart(product));
            viewProductBtn.addEventListener("click", () => viewProduct(product.id));

            btnDiv.appendChild(addToCartBtn);
            btnDiv.appendChild(viewProductBtn);
            productDiv.appendChild(productName);
            productDiv.appendChild(productImg);
            productDiv.appendChild(productDesc);
            productDiv.appendChild(btnDiv);

            productsContainer.appendChild(productDiv);
        });
    }

    async function fetchCategories() {
        const response = await fetch('https://fakestoreapi.com/products/categories');
        const apiCategories = await response.json();
        const localCategories = localStorage.getItem("localCategories") || [];
        const uniqueApiCategories = apiCategories.filter(apiCategory =>
            !localCategories.some(localCategory => localCategory.id === apiCategory.id)
        );

        const allCategories = [...uniqueApiCategories, ...localCategories];
        return allCategories;
    }

    async function displayCategories(categorySelector) {
        const categoriesList = await fetchCategories();
        categoriesList.forEach(category => {
            const categoryOption = document.createElement("option");
            categoryOption.value = category;
            categoryOption.textContent = category;
            categorySelector.appendChild(categoryOption);
        });
    }

    async function filterProductsByCategory() {
        const selectedCategory = categorySelector.value;
        const products = await fetchProducts();
        const filteredProducts = [];

        products.forEach(product => {
            if (selectedCategory === "all") {
                filteredProducts.push(product);
            } else if (product.category === selectedCategory) {
                filteredProducts.push(product);
            }
        });

        displayProducts(filteredProducts);
    }

    async function viewProduct(productId) {
        try {
            const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
            const product = await response.json();
    
            sessionStorage.setItem('currentProduct', JSON.stringify(product));
            window.location.href = `pages/product.html?id=${productId}`;
        } catch (error) {
            console.error("Error fetching product:", error);
        }
    }

    function addToCart(product) {
        try {
            const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
            const existingProductIndex = cart.findIndex(p => p.id === product.id);

            if (existingProductIndex !== -1) {
                cart[existingProductIndex].quantity += 1;
            } else {
                // Agrega el producto al carrito con cantidad 1
                cart.push({ ...product, quantity: 1 });
            }

            sessionStorage.setItem("cart", JSON.stringify(cart));
            console.log(`Producto "${product.title}" agregado al carrito.`);
        } catch (error) {
            console.error("Error al añadir al carrito:", error);
        }
    }


    document.getElementById("logout-button").addEventListener("click", function () {
        // Eliminar al usuario del sessionStorage
        sessionStorage.removeItem("user");

        // Redirigir a la página de inicio de sesión u otra acción después de cerrar sesión
        window.location.href = "pages/session.html";
    });

}

if (window.location.pathname.endsWith("session.html")) {
    function register(event) {
        event.preventDefault(); // Prevenir el envío del formulario por defecto

        const regUsername = document.querySelector("#reg-username").value;
        const regPassword = document.querySelector("#reg-password").value;
        const regEmail = document.querySelector("#reg-email").value;
        const regFirstname = document.querySelector("#reg-firstname").value;
        const regLastname = document.querySelector("#reg-lastname").value;
        const regPhone = document.querySelector("#reg-phone").value;
        const regStreet = document.querySelector("#reg-street").value;
        const regNumber = document.querySelector("#reg-number").value;
        const regCity = document.querySelector("#reg-city").value || '';
        const regVillage = document.querySelector("#reg-village").value || '';
        const regZipCode = document.querySelector("#reg-zipcode").value || '';

        const locationPromise = updateLocationInfo();

        locationPromise.then(location => {
            const newGeo = new Geolocation(location.lat, location.lng)
            const newAddress = new Address(regCity, regVillage, regStreet, regNumber, regZipCode, newGeo);
            const newUser = new User(regUsername, regPassword, regEmail, regFirstname, regLastname, regPhone, newAddress);

            // Guardar en LocalStorage
            localStorage.setItem(`user_${newUser.username}`, JSON.stringify(newUser));
            alert("Registro exitoso. Inicie sesión con sus nuevas credenciales.");
        }).catch(error => {
            console.error("Error en la obtención de coordenadas:", error);
            alert("Error al obtener la ubicación. Por favor, inténtelo de nuevo.");
        });
    }


    function updateLocationInfo() {
        return new Promise((resolve, reject) => {
            const regCity = document.querySelector('#reg-city').value;
            const regVillage = document.querySelector('#reg-village').value;
            const regStreet = document.querySelector('#reg-street').value;
            const regNumber = document.querySelector('#reg-number').value;
            const regZipCode = document.querySelector('#reg-zipcode').value;

            // Utilizar el servicio de geocodificación para obtener las coordenadas
            const apiKey = 'pk.18b245c371788af6b51f41d6006bfc25'; // Reemplaza con tu clave de LocationIQ
            const addressQuery = `${regStreet} ${regNumber}, ${regZipCode}, ${regCity}, ${regVillage}`;
            const url = `https://us1.locationiq.com/v1/search.php?key=${apiKey}&format=json&q=${encodeURIComponent(addressQuery)}`;

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data.length > 0) {
                        const firstResult = data[0];
                        const location = {
                            lat: firstResult.lat,
                            lng: firstResult.lon
                        };

                        resolve(location);
                    } else {
                        reject('No se encontraron coordenadas para la dirección proporcionada.');
                    }
                })
                .catch(error => {
                    reject(`Error al obtener las coordenadas: ${error}`);
                });
        });
    }


    function login(event) {
        event.preventDefault(); // Prevenir el envío del formulario por defecto

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Verificar si el usuario existe en el LocalStorage
        const existingUser = localStorage.getItem('user_' + username);

        if (existingUser) {
            // Parsear el JSON al recuperar el usuario del localStorage
            const parsedUser = JSON.parse(existingUser);

            // Verificar si el usuario tiene la propiedad 'address'
            if ('address' in parsedUser) {
                const currentUser = new User(
                    parsedUser.username,
                    parsedUser.password,
                    parsedUser.email,
                    parsedUser.name.firstname,
                    parsedUser.name.lastname,
                    parsedUser.phone,
                    parsedUser.address,
                    parsedUser.address.geolocation.lat,
                    parsedUser.address.geolocation.long
                );
                sessionStorage.setItem('user', JSON.stringify(currentUser));
                window.location.href = "../index.html";
            } else {
                // Tratar el caso anterior sin la propiedad 'address'
                const currentUser = new User(parsedUser.username, parsedUser.password);
                sessionStorage.setItem('user', JSON.stringify(currentUser));
                window.location.href = "../index.html";
            }
        } else {
            // Si el usuario no está en el localStorage, intentar autenticar a través de la API
            authenticateUser(username, password)
                .then(user => {
                    if (user) {
                        // Autenticación exitosa, guardar en el localStorage y redirigir
                        localStorage.setItem(`user_${user.username}`, JSON.stringify(user));
                        sessionStorage.setItem('user', JSON.stringify(user));
                        window.location.href = "../index.html";
                    } else {
                        alert('Inicio de sesión fallido. Verifica tu usuario y contraseña.');
                    }
                })
                .catch(error => {
                    console.error('Error al autenticar usuario:', error);
                    alert('Error al autenticar usuario. Por favor, inténtelo de nuevo.');
                });
        }
    }

    // Función para autenticar al usuario a través de la API
    async function authenticateUser(username, password) {
        try {
            const res = await fetch('https://fakestoreapi.com/auth/login', {
                method: 'POST',
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });
            const json = await res.json();
            return json;
        } catch (error) {
            console.error('Error en la autenticación del usuario:', error);
        }
    }

    document.getElementById("login-form").addEventListener("submit", login);
    document.getElementById("register-form").addEventListener("submit", register);
}

const currentProduct = JSON.parse(sessionStorage.getItem('currentProduct'));
if (currentProduct) {
    productContent(currentProduct);
} else {
    console.error("Product details not found.");
}

function productContent(product) {
    const productDiv = document.querySelector("#product-details");
    const productInfo = document.querySelector("#product-info");
    const productTitle = document.createElement("h3");
    const productImage = document.createElement("img");
    const productPrice = document.createElement("p");
    const productCategory = document.createElement("p");
    const productDescription = document.createElement("p");
    const productEditButton = document.createElement("button");
    const productDeleteButton = document.createElement("button");
    productTitle.textContent = `${product.title}`;
    productImage.src = `${product.image}`;
    productPrice.textContent = `${product.price} €`;
    productCategory.textContent = `${product.category}`;
    productDescription.textContent = `${product.description}`;
    productEditButton.textContent = `Edit`;
    productDeleteButton.textContent = `Delete`;
    productInfo.appendChild(productTitle);
    productInfo.appendChild(productImage);
    productInfo.appendChild(productPrice);
    productInfo.appendChild(productCategory);
    productInfo.appendChild(productDescription);
    productInfo.appendChild(productButton);
    productDiv.style.display="flex";
    productDiv.style.flexDirection = "column";
    productDiv.style.alignItems = "center";
    productInfo.style.display="flex";
    productInfo.style.flexDirection = "column";
    productInfo.style.alignItems = "center";
    productInfo.style.textAlign = "center";
    productInfo.style.width = "70vw";
    productImage.style.height = "50vh";
}