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
                //parsedUser.address.geolocation.lat,
                //parsedUser.address.geolocation.long
                //TODO ARREGLAR
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