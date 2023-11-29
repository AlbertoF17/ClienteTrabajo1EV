const editProfileBtn = document.getElementById("edit-profile-btn");
const profileInfo = document.getElementById("profile-info");
const currentUser = JSON.parse(sessionStorage.getItem("user"));

function fillProfileFields(user) {
    document.getElementById("username").value = user.username;
    document.getElementById("email").value = user.email;
    document.getElementById("firstname").value = user.name.firstname;
    document.getElementById("lastname").value = user.name.lastname;
    document.getElementById("phone").value = user.phone;
    document.getElementById("street").value = user.address.street;
    document.getElementById("number").value = user.address.number;
    document.getElementById("city").value = user.address.city;
    document.getElementById("zipcode").value = user.address.zipcode;
}


fillProfileFields(currentUser);

editProfileBtn.addEventListener("click", function () {
    // Habilitar la edición de los campos
    const inputFields = profileInfo.querySelectorAll("input");
    inputFields.forEach(field => {
        field.removeAttribute("disabled");
    });
    editProfileBtn.textContent = "Save Changes";
    editProfileBtn.addEventListener("click", handleSaveChangesClick);
});

function handleSaveChangesClick() {
    const inputFields = profileInfo.querySelectorAll("input");
    inputFields.forEach(field => {
        field.setAttribute("disabled", true);
    });

    editProfileBtn.textContent = "Edit Profile";
    editProfileBtn.removeEventListener("click", handleSaveChangesClick);
    updateUserInformation();
}

async function updateUserInformation() {
    const updatedUser = {
        username: document.getElementById("username").value,
        email: document.getElementById("email").value,
        name: {
            firstname: document.getElementById("firstname").value,
            lastname: document.getElementById("lastname").value
        },
        phone: document.getElementById("phone").value,
        address: {
            street: document.getElementById("street").value,
            number: document.getElementById("number").value,
            city: document.getElementById("city").value,
            zipcode: document.getElementById("zipcode").value
        }
    };

    try {
        const updatedAddressQuery = `${updatedUser.address.street} ${updatedUser.address.number}, ${updatedUser.address.zipcode}, ${updatedUser.address.city}`;
        const location = await updateLocationInfo(updatedAddressQuery);
        updatedUser.address.geolocation = new Geolocation(location.lat, location.lng);
        sessionStorage.setItem("user", JSON.stringify(updatedUser));

        const localStorageUser = localStorage.getItem(`user_${currentUser.username}`);
        if (localStorageUser) {
            localStorage.removeItem(`user_${currentUser.username}`);
            localStorage.setItem(`user_${updatedUser.username}`, JSON.stringify(updatedUser));
        }

    } catch (error) {
        console.error("Error al actualizar la información del usuario:", error);
        alert("Error al actualizar la información del usuario. Por favor, inténtelo de nuevo.");
    }
}

async function updateLocationInfo(addressQuery) {
    try {
        const apiKey = 'pk.18b245c371788af6b51f41d6006bfc25';
        const url = `https://us1.locationiq.com/v1/search.php?key=${apiKey}&format=json&q=${encodeURIComponent(addressQuery)}`;

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

function parseAddress(addressString) {
    const addressParts = addressString.split(",");
    const streetNumber = addressParts[0].trim();
    const city = addressParts[1].trim();
    const zipcode = addressParts[2].trim();

    return {
        street: streetNumber,
        city: city,
        zipcode: zipcode
    };
}

const purchaseHistoryBtn = document.querySelector("#purchase-history-btn");
purchaseHistoryBtn.addEventListener("click", function () {
    window.location.href = "purchaseHistory.html";
});