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
    document.addEventListener("DOMContentLoaded", function () {
        const isIndex = window.location.pathname.endsWith("index.html");
        if (isIndex) {
            checkLoggedIn();
        }

        const productsContainer = document.getElementById("products-container");
        displayProducts(productsContainer);
    });

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
        const productsContainer = document.getElementById("products-container");
        products = await fetchProducts();
        products.forEach(product => {
            const productDiv = document.createElement("div");
            const productName = document.createElement("h3");
            const productImg = document.createElement("img");
            const productDesc = document.createElement("p");

            productDiv.className = "product";
            productName.textContent = product.title;
            productImg.src = product.image;
            productDesc.textContent = product.description;

            productDiv.appendChild(productName);
            productDiv.appendChild(productImg);
            productDiv.appendChild(productDesc);

            productsContainer.appendChild(productDiv);
        });
    }

    document.getElementById("logout-button").addEventListener("click", function () {
        // Eliminar al usuario del sessionStorage
        sessionStorage.removeItem("user");

        // Redirigir a la página de inicio de sesión u otra acción después de cerrar sesión
        window.location.href = "pages/session.html";
    });
}

if (window.location.pathname.endsWith("session.html")) {
    
}