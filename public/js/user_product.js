// get user
async function getUser() {
    try {
        const response = await fetch('/userInfo');
        if (response.ok) {
            const data = await response.json();
            document.querySelector('#username').textContent = data.username;
        }
        else if (response.status == 500) {
            const data = await response.text();
            throw Error(data);
        }
        else {
            throw Error('Connection error');
        }
    } catch (err) {
        console.error(err.message);
        Notiflix.Report.failure('Error', err.message, 'Close');
    }
}

// get product from database
async function getProduct() {
    try {
        const response = await fetch('/user/product');
        if (response.ok) {
            const data = await response.json();
            showProduct(data);
        }
        else if (response.status == 500) {
            const data = await response.text();
            throw Error(data);
        }
        else {
            throw Error('Connection error');
        }
    } catch (err) {
        console.error(err.message);
        Notiflix.Report.failure('Error', err.message, 'Close');
    }
}

// show product table
function showProduct(data) {
    const tbody = document.querySelector('#tbody');
    let temp = '';
    data.forEach(function(product) {
        temp += `<tr>`;
        temp += `<td>${product.product_id}</td>`;
        temp += `<td>${product.name}</td>`;
        temp += `<td>${product.price}</td>`;
        // note that we can send only number or String with '' as function's parameters
        temp += `<td><button class="btn btn-success" onclick=addToCart(${JSON.stringify(product)})>Add to cart</button></td>`;
        temp += `</tr>`;
    });
    tbody.innerHTML = temp;
}

// add product to cart
function addToCart(product) {
    // console.log(product.name);
    // load products saved in localStorage
    let cart = [];
    try {
        if(localStorage.cart !== undefined) {
            // load and convert to JS object
            cart = JSON.parse(localStorage.cart);
        }
        // add product to cart array
        cart.push(product);
        // convert cart array to JSON and save to localStorage
        localStorage.cart = JSON.stringify(cart);
        Notiflix.Report.success('Success', 'product is added', 'OK');
    } catch (err) {
        Notiflix.Report.failure('Error', err.message, 'Close');
    }
}

// get user info
getUser();
// get and show product
getProduct();