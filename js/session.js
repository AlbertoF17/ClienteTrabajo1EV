async function register(event) {
    event.preventDefault(); // Prevenir el envío del formulario por defecto

    try {
        // Obtener la lista de usuarios de la API
        const usersResponse = await fetch('https://fakestoreapi.com/users');
        const users = await usersResponse.json();

        // Encontrar el primer ID libre
        const newUserId = findAvailableUserId(users);

        // Obtener los datos del formulario
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

        // Obtener la ubicación y crear el nuevo usuario
        const location = await updateLocationInfo();
        const newGeo = new Geolocation(location.lat, location.lng);
        const newAddress = new Address(regCity, regVillage, regStreet, regNumber, regZipCode, newGeo);
        const newUser = new User(newUserId, regUsername, regPassword, regEmail, regFirstname, regLastname, regPhone, newAddress);

        // Guardar el nuevo usuario en la API
        const addUserResponse = await fetch('https://fakestoreapi.com/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: regEmail,
                username: regUsername,
                password: regPassword,
                name: {
                    firstname: regFirstname,
                    lastname: regLastname
                },
                address: {
                    city: regCity,
                    street: regStreet,
                    number: regNumber,
                    zipcode: regZipCode,
                    geolocation: {
                        lat: location.lat.toString(),
                        long: location.lng.toString()
                    }
                },
                phone: regPhone
            })
        });

        if (!addUserResponse.ok) {
            throw new Error(`HTTP error! Status: ${addUserResponse.status}`);
        }
        newUser.carts = [];
        // Guardar el nuevo usuario en el localStorage
        localStorage.setItem(`user_${newUser.username}`, JSON.stringify(newUser));
        alert("Registro exitoso. Inicie sesión con sus nuevas credenciales.");
    } catch (error) {
        console.error("Error en el registro:", error);
        alert("Error en el registro. Por favor, inténtelo de nuevo.");
    }
}


function findAvailableUserId(users) {
    // Buscar el primer ID libre
    for (let i = 1; i <= users.length + 1; i++) {
        const userWithId = users.find(user => user.id === i);
        if (!userWithId) {
            return i;
        }
    }
    return null; // Si no hay IDs libres
}

async function updateLocationInfo() {
    const regCity = document.querySelector('#reg-city').value;
    const regVillage = document.querySelector('#reg-village').value;
    const regStreet = document.querySelector('#reg-street').value;
    const regNumber = document.querySelector('#reg-number').value;
    const regZipCode = document.querySelector('#reg-zipcode').value;

    // Utilizar el servicio de geocodificación para obtener las coordenadas
    const apiKey = 'pk.18b245c371788af6b51f41d6006bfc25'; // Reemplaza con tu clave de LocationIQ
    const addressQuery = `${regStreet} ${regNumber}, ${regZipCode}, ${regCity}, ${regVillage}`;
    const url = `https://us1.locationiq.com/v1/search.php?key=${apiKey}&format=json&q=${encodeURIComponent(addressQuery)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.length > 0) {
            const firstResult = data[0];
            const location = {
                lat: firstResult.lat,
                lng: firstResult.lon
            };
            return location;
        } else {
            throw new Error('No se encontraron coordenadas para la dirección proporcionada.');
        }
    } catch (error) {
        throw new Error(`Error al obtener las coordenadas: ${error}`);
    }
}


async function login(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const localStorageUser = JSON.parse(localStorage.getItem(`user_${username}`));

    if (localStorageUser) {
        sessionStorage.setItem("user", JSON.stringify(localStorageUser));
        window.location.href = "../index.html";
    } else {
        try {
            // Paso 1: Autenticarse para obtener el token
            const tokenData = await authenticateUser(username, password);

            // Verificar si se obtuvo un token
            if (tokenData && tokenData.token) {
                // Paso 2: Obtener los detalles del usuario utilizando el token
                const userDetails = await fetchUserInfo(tokenData.token);

                // Verificar si se obtuvieron los detalles del usuario
                if (userDetails) {
                    // Guardar la información del usuario en sessionStorage
                    sessionStorage.setItem('user', JSON.stringify(userDetails));

                    // Redirigir o realizar otras acciones según tus necesidades
                    window.location.href = "../index.html";
                } else {
                    alert('Error al obtener detalles del usuario.');
                }
            } else {
                alert('Inicio de sesión fallido. Verifica tu usuario y contraseña.');
            }
        } catch (error) {
            console.error('Error en el proceso de login:', error);
            alert('Error en el proceso de login. Por favor, inténtelo de nuevo.');
        }
    }
}

async function authenticateUser(username, password) {
    try {
        const res = await fetch('https://fakestoreapi.com/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const tokenData = await res.json();
        return tokenData;
    } catch (error) {
        console.error('Error en la autenticación del usuario:', error);
        throw error;
    }
}

async function fetchUserInfo(token) {
    try {
        // Intentar obtener la información del usuario desde la API
        const apiRes = await fetch('https://fakestoreapi.com/users', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (apiRes.ok) {
            const userDetails = await apiRes.json();
            console.log(userDetails);
            const username = document.getElementById('username').value;
            const realUser = userDetails.find(user => user.username === username);
            if (realUser) {
                return realUser;
            }
        } else {
            throw new Error(`HTTP error! Status: ${apiRes.status}`);
        }
    } catch (apiError) {
        console.error('Error al obtener detalles del usuario desde la API:', apiError);
    }
}



document.getElementById("login-form").addEventListener("submit", login);
document.getElementById("register-form").addEventListener("submit", register);