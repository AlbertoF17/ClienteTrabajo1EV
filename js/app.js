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
    const productsContainer = document.getElementById("products-container");
    displayProducts(productsContainer);

    async function fetchCategories() {
        try {
            const response = await fetch("https://fakestoreapi.com/products/categories");
            const categories = await response.json();
    
            const selectElement = document.getElementById("category-select");
    
            categories.forEach(category => {
                const option = document.createElement("option");
                option.value = category;
                option.text = category;
                selectElement.appendChild(option);
            });
    
            // Agregar el evento de cambio después de crear las opciones
            selectElement.addEventListener("change", function() {
                const selectedCategory = selectElement.value;
    
                fetch(`https://fakestoreapi.com/products/category/${selectedCategory}`)
                    .then(res => res.json())
                    .then(json => console.log(json))
                    .catch(error => console.error("Error fetching products:", error));
            });
    
            return categories; // Devuelve las categorías
        } catch (error) {
            console.error("Error fetching categories:", error);
            return []; // Devuelve un array vacío en caso de error
        }
    }

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