// Función principal asincrónica autoinvocada
(async function () {
    // Manejar el evento de carga del documento
    const productId = getProductIdFromQueryString();
    const product = await fetchProductById(productId);

    if (product) {
        // Llenar el formulario con los datos del producto
        populateEditForm(product);
        // Configurar el listener para el formulario de edición
        setupEditFormListener(productId);
        // Llenar el dropdown de categorías
        await populateCategoryDropdown();
    } else {
        console.error('Producto no encontrado.');
    }

    // Función asincrónica para obtener información de un producto por su ID
    async function fetchProductById(productId) {
        try {
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


    // Llenar el formulario con los valores del producto
    function populateEditForm(product) {
        document.getElementById('productId').value = product.id;
        document.getElementById('title').value = product.title;
        document.getElementById('price').value = product.price;
        document.getElementById('category').value = product.category;
        document.getElementById('description').value = product.description;
        document.getElementById('image').value = product.image;
    }

    // Configurar el listener para el formulario de edición
    function setupEditFormListener(productId) {
        const editProductForm = document.getElementById('editProductForm');

        editProductForm.addEventListener('submit', function (event) {
            event.preventDefault();

            // Crear un objeto con los nuevos valores del producto
            const editedProduct = {
                id: productId,
                title: document.getElementById('title').value,
                price: document.getElementById('price').value,
                category: document.getElementById('category').value,
                description: document.getElementById('description').value,
                image: document.getElementById('image').value
            };

            // Actualizar el producto en el localStorage
            updateProductInLocalStorage(editedProduct);
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

    // Llenar el dropdown de categorías
    async function populateCategoryDropdown() {
        const categories = await fetchCategories();
        const categoryDropdown = document.getElementById('category');

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
    


    function updateProductInLocalStorage(product) {
        // Obtener productos existentes del localStorage
        const localStorageProducts = JSON.parse(localStorage.getItem('products')) || [];
    
        // Encontrar y actualizar el producto específico
        let productFound = false;
    
        for (let i = 0; i < localStorageProducts.length; i++) {
            if (localStorageProducts[i].id === product.id) {
                localStorageProducts[i] = product;
                productFound = true;
                break;
            }
        }
    
        // Si el producto no se encontró, agregarlo al final del array
        if (!productFound) {
            localStorageProducts.push(product);
        }
    
        // Guardar los productos actualizados en el localStorage
        localStorage.setItem('products', JSON.stringify(localStorageProducts));
    }
    
    
    
})();