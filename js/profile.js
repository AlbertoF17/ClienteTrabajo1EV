const editProfileBtn = document.getElementById("edit-profile-btn");
const profileInfo = document.getElementById("profile-info");
const confirmedCartsList = document.getElementById("confirmed-carts");
const currentUser = JSON.parse(sessionStorage.getItem("user"));
const currentUserLocal = JSON.parse(localStorage.getItem(`user_${currentUser.username}`));

// Función para llenar los campos de perfil con la información del usuario
function fillProfileFields(user) {
    document.getElementById("username").value = user.username;
    document.getElementById("email").value = user.email;
    document.getElementById("firstname").value = user.name.firstname;
    document.getElementById("lastname").value = user.name.lastname;
    document.getElementById("phone").value = user.phone;

    const address = user.address || {};
    document.getElementById("address").value = `${address.street} ${address.number}, ${address.city}, ${address.zipcode}`;
}

// Llenar los campos de perfil con la información del usuario actual
fillProfileFields(currentUserLocal);

// Manejar el clic en el botón "Editar Perfil"
editProfileBtn.addEventListener("click", function () {
    // Habilitar la edición de los campos
    const inputFields = profileInfo.querySelectorAll("input, textarea");
    inputFields.forEach(field => {
        field.removeAttribute("disabled");
    });

    // Cambiar el texto del botón a "Guardar Cambios"
    editProfileBtn.textContent = "Save Changes";

    // Desvincular el evento click del botón para evitar múltiples clics
    editProfileBtn.removeEventListener("click", handleEditProfileClick);

    // Vincular el evento click a la función de guardar cambios
    editProfileBtn.addEventListener("click", handleSaveChangesClick);
});

// Función para manejar el clic en el botón "Guardar Cambios"
function handleSaveChangesClick() {
    const inputFields = profileInfo.querySelectorAll("input, textarea");
    inputFields.forEach(field => {
        field.setAttribute("disabled", true);
    });

    editProfileBtn.textContent = "Edit Profile";
    editProfileBtn.removeEventListener("click", handleSaveChangesClick);
    editProfileBtn.addEventListener("click", handleEditProfileClick);
    updateUserInformation();
}

// Función para manejar el clic en el botón "Editar Perfil" después de guardar cambios
function handleEditProfileClick() {
    // Habilitar la edición de los campos
    const inputFields = profileInfo.querySelectorAll("input, textarea");
    inputFields.forEach(field => {
        field.removeAttribute("disabled");
    });

    editProfileBtn.textContent = "Save Changes";
    editProfileBtn.removeEventListener("click", handleEditProfileClick);
    editProfileBtn.addEventListener("click", handleSaveChangesClick);
}

// Función para actualizar la información del usuario en el sessionStorage
function updateUserInformation() {
    // Obtener los valores de los campos de perfil
    const updatedUser = {
        username: document.getElementById("username").value,
        email: document.getElementById("email").value,
        name: {
            firstname: document.getElementById("firstname").value,
            lastname: document.getElementById("lastname").value
        },
        phone: document.getElementById("phone").value,
        address: parseAddress(document.getElementById("address").value)
    };

    // Actualizar el usuario en el sessionStorage
    sessionStorage.setItem("user", JSON.stringify(updatedUser));
    const localStorageUser = localStorage.getItem(`user_${currentUser.username}`);
    if (localStorageUser) {
        localStorage.removeItem(`user_${currentUser.username}`);
        localStorage.setItem(`user_${updatedUser.username}`, JSON.stringify(updatedUser));
    }
}

// Función para analizar la dirección ingresada y devolver un objeto de dirección
function parseAddress(addressString) {
    // Implementa la lógica para analizar la cadena de dirección y devolver un objeto de dirección
    // Puedes utilizar expresiones regulares u otras técnicas según el formato esperado de la dirección
    // Por ahora, simplemente dividimos la cadena por comas
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
purchaseHistoryBtn.addEventListener("click", function() {
    window.location.href = "purchaseHistory.html";
})