// Función principal asincrónica autoinvocada
(async function () {
    // Manejar el evento de carga del documento
    const productId = getProductIdFromQueryString();
    const product = await fetchProductById(productId);
    let deletedItems = JSON.parse(localStorage.getItem("deleted_items")) || [];
    deletedItems.push(product);
    localStorage.setItem("deleted_items", JSON.stringify(deletedItems));

    if (product) {
        // Llenar el formulario con los datos del producto
        populateEditForm(product);
        // Configurar el listener para el formulario de edición
        setupEditFormListener(productId);
        // Llenar el dropdown de categorías
        await populateCategoryDropdown(product.category);  // Pasar la categoría del producto como argumento
    } else {
        console.error('Producto no encontrado.');
    }

    // Función asincrónica para obtener información de un producto por su ID
    async function fetchProductById(productId) {
        try {
            const localProducts = JSON.parse(localStorage.getItem("products")) || [];
            const matchingLocalProduct = localProducts.find(localProduct => localProduct.id === productId);

            if (matchingLocalProduct) {
                return matchingLocalProduct;
            }

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
                const product = JSON.parse(responseBody);
                return product;
            } else {
                throw new Error('Invalid content type. Expected JSON.');
            }
        } catch (error) {
            console.error('Error fetching product:', error);
            throw error; // Rethrow the error to propagate it to the caller
        }
    }

    // Configurar el listener para el formulario de edición
    function setupEditFormListener(productId) {
        const editProductForm = document.querySelector('#editProductForm');

        editProductForm.addEventListener('submit', function (event) {
            event.preventDefault();

            // Crear un objeto con los nuevos valores del producto
            const editedProduct = {
                id: productId,
                title: document.querySelector('#title').value,
                price: document.querySelector('#price').value,
                category: document.querySelector('#category').value,
                description: document.querySelector('#description').value,
                image: document.querySelector('#image').value,
                rating: {
                    rate: document.querySelector('#ratingRate').value,
                    count: document.querySelector('#ratingCount').value
                }
            };
            

            // Actualizar el producto en el localStorage
            updateProductInLocalStorage(editedProduct);

            window.location.href = "/pages/product.html";
        });
    }

    // Función asincrónica para obtener las categorías
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

    function getProductIdFromQueryString() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const productId = urlParams.get('id');

        if (!productId) {
            console.error('Product ID not found in the query string.');
        }

        return productId;
    }

    // Llenar el dropdown de categorías
    async function populateCategoryDropdown(productCategory) {
        const categories = await fetchCategories();
        const categoryDropdown = document.querySelector('#category');

        const placeholderOption = document.createElement('option');
        placeholderOption.value = '';
        placeholderOption.textContent = 'Selecciona una categoría';
        placeholderOption.disabled = true;
        placeholderOption.selected = true;
        categoryDropdown.appendChild(placeholderOption);

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryDropdown.appendChild(option);
        });

        // Seleccionar la categoría del producto por defecto
        if (productCategory) {
            categoryDropdown.value = productCategory;
        }
    }

    function populateEditForm(product) {
        document.querySelector('#productId').value = parseInt(product.id);
        document.querySelector('#title').value = product.title;
        document.querySelector('#price').value = product.price;
        document.querySelector('#description').value = product.description;
        document.querySelector('#image').value = product.image;
        document.querySelector('#ratingRate').value = product.rating.rate;
        document.querySelector('#ratingCount').value = product.rating.count;
    }

    function updateProductInLocalStorage(product) {
        const localStorageProducts = JSON.parse(localStorage.getItem('products')) || [];
        let productFound = false;

        for (let i = 0; i < localStorageProducts.length; i++) {
            if (localStorageProducts[i].id === product.id) {
                localStorageProducts[i] = product;
                productFound = true;
                break;
            }
        }

        if (!productFound) {
            localStorageProducts.push(product);
        }

        // Guardar los productos actualizados en el localStorage
        localStorage.setItem('products', JSON.stringify(localStorageProducts));
    }
})();