const mainDiv = document.getElementById('product-div')

function reduceToThreeSentences(text){
    if (!text) return '';

    const sentences = text.split(/(?<=[.!?])\s+/);

    return sentences.slice(0,3).join(' ');

}

window.onload = async () => {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        const products = await response.json();
    
        
        for (const product of products){
            
            const description = reduceToThreeSentences(product.description);

            mainDiv.innerHTML += `
            <div class="products">

                <div class="img-div">
                    <img src="${product.image}">
                </div>

            <h5 class="title">${product.title}</h5>
            
                <div class="priceDiv">
                    <span><i class="fa-solid fa-star"></i> ${product.rating.rate}(${product.rating.count} Reviews)</span>
                    <span>$${product.price}</span>
                </div>

                <div class="btn-div">
                    <button type="button" class="add2Cart-btn">Add To Cart</button>
                    <button type="button" class="buyNow-btn">Buy Now</button>
                </div>
            </div>
            `
           
        }
    } catch (error) {
        
    }
}