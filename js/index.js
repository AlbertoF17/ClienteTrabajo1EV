function checkLoggedIn() {
    const currentUser = sessionStorage.getItem("user");
    return currentUser;
}

if (checkLoggedIn() === null) {
    window.location.href = "pages/session.html";
}

const categorySelector = document.querySelector("#category-select");
const productsContainer = document.querySelector("#products-container");

categorySelector.addEventListener("change", filterProductsByCategory);

displayCategories(categorySelector);
filterProductsByCategory();

async function fetchProducts() {
    try {
        const response = await fetch("https://fakestoreapi.com/products");
        const apiProducts = await response.json();

        const localProducts = JSON.parse(localStorage.getItem("products")) || [];
        const deletedItems = JSON.parse(localStorage.getItem("deleted_items")) || [];

        // Filtrar productos eliminados antes de la combinación
        const filteredLocalProducts = localProducts.filter(localProduct => !deletedItems.some(deletedItem => deletedItem.id === localProduct.id));
        const filteredApiProducts = apiProducts.filter(apiProduct => !deletedItems.some(deletedItem => deletedItem.id === apiProduct.id));

        // Crear un conjunto para mantener un registro de los IDs de productos eliminados
        const deletedItemsSet = new Set(deletedItems.map(deletedItem => deletedItem.id));

        // Combinar productos locales y filtrados de la API, evitando duplicados
        const combinedProducts = [
            ...filteredLocalProducts,
            ...filteredApiProducts.filter(apiProduct => !deletedItemsSet.has(apiProduct.id))
        ];

        return combinedProducts.sort((a, b) => a.id - b.id);
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}

async function displayProducts(products) {
        productsContainer.textContent = "";
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
            // Intentar obtener el producto del localStorage
            const localProducts = JSON.parse(localStorage.getItem('products')) || [];
            const localProduct = localProducts.find(product => product.id === productId);
    
            if (localProduct) {
                // Si se encuentra en el localStorage, usarlo directamente
                sessionStorage.setItem('currentProduct', JSON.stringify(localProduct));
                window.location.href = `pages/product.html?id=${productId}`;
                return;
            }
    
            // Si no se encuentra en el localStorage, hacer una solicitud a la API
            const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const contentType = response.headers.get('content-type');
            const responseBody = await response.text();
    
            if (responseBody.trim() === '') {
                throw new Error('Empty response body. No JSON data.');
            }
    
            if (contentType && contentType.includes('application/json')) {
                const apiProduct = JSON.parse(responseBody);
                sessionStorage.setItem('currentProduct', JSON.stringify(apiProduct));
                window.location.href = `pages/product.html?id=${productId}`;
            } else {
                throw new Error('Invalid content type. Expected JSON.');
            }
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
                cart.push({ ...product, quantity: 1 });
            }

            sessionStorage.setItem("cart", JSON.stringify(cart));
        } catch (error) {
            console.error("Error al añadir al carrito:", error);
        }
    }

    const addButton = document.querySelector("#addButton");

    addButton.addEventListener("click", function () {
        window.location.href = "pages/newProduct.html";
    })