const productDiv = document.getElementById('product-div')

let products = [];
let cart =[];

window.onload = async () => {
    try {
        const response = await fetch('https://fakestoreapi.com/products');

        if (!response.ok){
             throw new Error ("Failed to fetch products.")
        }
        const data = await response.json();

        products = data;

        for (const product of products){
            

            productDiv.innerHTML += `
            <div class="products">

                <div class="img-div">
                    <img src="${product.image}">
                </div>

            <h5 class="title">${product.title}</h5>
            
                <div class="priceDiv">
                    <span><i class="fa-solid fa-star"></i>${product.rating.rate} (${product.rating.count} Reviews)</span>
                    <span>$${product.price}</span>
                </div>

                <div class="btn-div">
                    <button type="button" class="add2Cart-btn" onclick="addToCart(${product.id})">Add To Cart</button>
                    <button type="button" class="buyNow-btn">Buy Now</button>
                </div>
            </div>
            `
           
        }
    } catch (error) {
        console.error('error fetching products: ', error);
        productDiv.innerText("Could not find the products. Try again");
    }
}

//displaying cart, adding items , deleting items all the cart logic

const cartIcon = document.getElementById('cartIcon');
const cartContainer = document.getElementById('cart-container');

console.log(cart)
cartIcon.addEventListener('click', toggleCart);

//show and hide cart
function toggleCart(){
    
    const isHidden = window.getComputedStyle(cartContainer).display === 'none';

    if(isHidden){
        cartContainer.style.display = 'flex';
        productDiv.style.display = 'none';
        renderCart();
    }else{
        cartContainer.style.display = 'none'; 
        productDiv.style.display= 'flex';
     }
}


//render the items in the cart 
function renderCart(){
    const cartItemsDiv = document.getElementById('cart-items');
    const cartTotalDiv = document.getElementById('cart-total');

    if(cartItemsDiv) cartItemsDiv.innerHTML = '';
    if(cartTotalDiv) cartTotalDiv.innerHTML = '';

    if(cart.length === 0){
        cartItemsDiv.innerHTML = `<p > Your cart is empty❗</p>`
        return;
    }

    let html = '';
    let totalPrice = 0 ;

    for(const item of cart){
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;

        html += `
         <div id="itemDiv">
         
          <div class="productDiv">
            <div class="cartImg">
                <img src="${item.image}">
            </div>
            <div class="itemTitle"> 
                <h4>${item.title}</h4>
                <button onclick="removeFromCart(${item.id})"> Remove </button>
            </div>
          </div>

            <div class="cartDetails">
                
                <p>$${item.price}</p>
            </div>
            <div>
               <button onclick="decreaseQty(${item.id})"> - </button> 
               <span>${item.quantity}</span> 
               <button onclick="increaseQty(${item.id})"> + </button>
            </div>
            <div>
            <span>$${itemTotal.toFixed(2)}</span>
            </div>
         </div>
        `;
    }

    if(cartItemsDiv) cartItemsDiv.innerHTML =html;
    if(cartTotalDiv){
        cartTotalDiv.innerHTML = `
            <h3>Total : </h3><h3>$ ${totalPrice.toFixed(2)} </h3>
             `
    }
}



const addToCart = (productId) => {
    //products have the data fetched from the api initiated on line 45
    const productToAdd = products.find(p => p.id === productId);
    
    if(!productToAdd){
        console.error("Product not found");
        return;
    }
    const existingItem = cart.find( item => item.id === productId);

    if(existingItem){
        existingItem.quantity += 1;
    }else{
        cart.push({...productToAdd, quantity: 1});
    }
    saveToStorage();
    renderCart();

    console.log("Cart Updated:", cart);
}

//removing item from the cart with the correct product id 
const removeFromCart = (productId) => {
    //keep the item that doesn't matches the productId 
    cart = cart.filter(item => item.id != productId);

    console.log("Item is removed. Cart: ", cart);
    saveToStorage();
    renderCart();
    
}


//increasing item quantity from the cart
const increaseQty = (productId) => {
    const existingItem = cart.find(item => item.id === productId )
    if(existingItem){
        existingItem.quantity += 1;
        saveToStorage();
        renderCart();
    }else{
        console.log('item not found1')
    }
}


//decreasing item quantity from the cart
const decreaseQty = (productId) => {
    const existingItem = cart.find(item => item.id === productId);
    if(existingItem){
        if(existingItem.quantity <= 1){
         removeFromCart(productId);        
    }else{
        existingItem.quantity -= 1;
        saveToStorage();
        renderCart();
    }
}else{
    console.log('item not found');
}
}

//clearing the cart 
const clearCart = () =>{
    cart.length = 0;
    saveToStorage();
    renderCart();
    console.log('cart cleared!')
}



//saving it local Storage
function saveToStorage(){
    localStorage.setItem('myCart', JSON.stringify(cart));
}

//fetching data from localStorage

function loadFromStorage(){
    const saved = localStorage.getItem('myCart');
    if(saved){
        cart = JSON.parse(saved);
        renderCart();
        console.log(cart);
    }
}

loadFromStorage();
