class Product{
    constructor(jsonProduct){
        jsonProduct && Object.assign(this, jsonProduct);
    }
}

/**
 * @typedef {Object} productInCart
 * @property {string} id
 * @property {number} quantity
 * @property {string} color
 * @property {number} price
 */

/**
 * 
 * @param {string} url 
 * @returns {string} L'url avec l'id du produit pour effectuer la requête
 */

function urlWithId (url){
    const productUrl = new URL(url);
    return `http://localhost:3000/api/products/${productUrl.searchParams.get("id")}`;
}


/**
 * 
 * @param {string} productId 
 * @param {number} productQuantity 
 * @param {string} productColor
 * @param {number} productPrice
 * 
 */
function parseProductForCart (productId, productQuantity, productColor, productPrice){
    return {"id" : productId, "quantity" : productQuantity, "color" : productColor, "price": productPrice}
}

/**
 * 
 * @param {productInCart} productAdded 
 * @param {productInCart} productInCart 
 * 
 */

function isAlreadyInCart(productAdded, productInCart){
    if (productAdded.id == productInCart.id && productAdded.color == productInCart.color){
        return true
    }else{
        return false
    }
}

/**
 * 
 * @param {productInCart} product 
 */

function addToCard(product){
    let listProductsInCart = getProductsInCart();
    let productAlreadyInCart = false
    if(listProductsInCart.length === 0){
        listProductsInCart.push(product);
    }else{
        for (let productInCart of listProductsInCart){
            if (isAlreadyInCart(product, productInCart)){
                productInCart.quantity += product.quantity;
                productAlreadyInCart = true
                break
            }
        }
        if (!productAlreadyInCart){
        listProductsInCart.push(product);
        }        
     }  
    saveProductsInCart(listProductsInCart);
}

/**
 * 
 * @returns {[] | productInCart[]}
 */
function getProductsInCart(){
    let listProductsInCart = localStorage.getItem('listProductsInCart');
    if (listProductsInCart === null){
        return [];
    }else{
        return JSON.parse(listProductsInCart);
    }
}

/**
 * 
 * @param {productInCart[]} listProductsInCart 
 */
function saveProductsInCart(listProductsInCart){
    localStorage.setItem('listProductsInCart', JSON.stringify(listProductsInCart));
}


fetch(urlWithId(window.location.href))
    .then(res => {
        if (res.ok){
            return res.json();
        }
    })
    .then(jsonProduct =>{
        let product = new Product (jsonProduct);
        document.querySelector(".item__img").innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
        document.querySelector("#title").innerHTML = `${product.name}`;
        document.querySelector("#price").innerHTML = `${product.price}`;
        document.querySelector("#description").innerHTML = `${product.description}`;
        for (let color of product.colors){
            document.querySelector('#colors').innerHTML +=`
            <option value="${color}">${color}</option>`
        }

        document.querySelector('#addToCart').addEventListener('click', function(){
            const productQuantity = document.querySelector('#quantity').value * 1
            const productColor = document.querySelector('#colors').value
            
            if(productColor && productQuantity > 0){
                addToCard (parseProductForCart(product._id, productQuantity, productColor, product.price))
                alert('Votre article a été ajouté au panier')
            }else{
                alert('Veuillez renseigner un quantité et une couleur')
            }
            
            
        })


    })
