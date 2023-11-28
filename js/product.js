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
    const productDescription = document.createElement("p");
    const divButtons = document.createElement("div");
    const productEditButton = document.createElement("button");
    const productDeleteButton = document.createElement("button");
    productTitle.textContent = `${product.title}`;
    productImage.src = `${product.image}`;
    productPrice.textContent = `Price: ${product.price} €`;
    productCategory.textContent = `Category: ${product.category}`;
    productDescription.textContent = `${product.description}`;
    productEditButton.textContent = `Edit`;
    productDeleteButton.textContent = `Delete`;
    divButtons.appendChild(productEditButton);
    divButtons.appendChild(productDeleteButton);
    productInfo.appendChild(productTitle);
    productInfo.appendChild(productImage);
    productInfo.appendChild(productPrice);
    productInfo.appendChild(productCategory);
    productInfo.appendChild(productDescription);
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

    });
}