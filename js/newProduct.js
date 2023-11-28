fetch('https://fakestoreapi.com/products')
    .then(res => res.json())
    .then(fakeStoreProducts => {
        // Continue with the fetched products
        const productForm = document.getElementById('productForm');

        productForm.addEventListener('submit', function (event) {
            event.preventDefault();

            // Get existing products from localStorage
            const localStorageProducts = JSON.parse(localStorage.getItem('products')) || [];

            // Combine product IDs from FakeStoreAPI and localStorage
            const allProductIds = [
                ...fakeStoreProducts.map(product => product.id),
                ...localStorageProducts.map(product => product.id)
            ];

            // Find the next available ID
            const nextAvailableId = findNextAvailableId(allProductIds);

            // Create a new product object with form values
            const newProduct = {
                id: nextAvailableId,
                title: document.getElementById('title').value,
                price: document.getElementById('price').value,
                category: document.getElementById('category').value,
                description: document.getElementById('description').value,
                image: document.getElementById('image').value
            };

            // Add the new product to localStorage
            localStorageProducts.push(newProduct);
            localStorage.setItem("products", JSON.stringify(localStorageProducts));

            // Optionally, you can reset the form
            productForm.reset();

            // Make a request to the API to add the new product
            fetch('https://fakestoreapi.com/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newProduct)
            })
                .then(apiRes => apiRes.json())
                .then(apiJson => console.log('New product added to API:', apiJson))
                .catch(apiError => console.error('Error adding product to API:', apiError));

            console.log('New product added to localStorage:', newProduct);
        });
    })
    .catch(error => console.error('Error fetching products:', error));

// Function to find the next available ID
function findNextAvailableId(existingIds) {
    const sortedIds = existingIds.sort((a, b) => a - b);

    for (let i = 1; i <= sortedIds.length; i++) {
        if (sortedIds[i - 1] !== i) {
            return i;
        }
    }

    return sortedIds.length + 1;
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

async function populateCategoryDropdown() {
    const categories = await fetchCategories();
    const categoryDropdown = document.getElementById('category');

    const placeholderOption = document.createElement('option');
    placeholderOption.value = '';
    placeholderOption.textContent = 'Select a category';
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

populateCategoryDropdown();