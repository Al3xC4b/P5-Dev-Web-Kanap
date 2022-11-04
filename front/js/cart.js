class Product{
    constructor(jsonProduct){
        jsonProduct && Object.assign(this, jsonProduct);
    }
}

function getProductsInCart(){
    let listProductsInCart = localStorage.getItem('listProductsInCart');
    if (listProductsInCart === null){
        return [];
    }else{
        return JSON.parse(listProductsInCart);
    }
}

function saveProductsInCart(listProductsInCart){
    localStorage.setItem('listProductsInCart', JSON.stringify(listProductsInCart));
}

/**
 * 
 * @param {string} itemId 
 * @param {string} itemColor 
 */
function removeProductFromCart(itemId, itemColor){
    let listProductsInCart = getProductsInCart()
    let newList = listProductsInCart.filter(product =>
        !(product.id == itemId && product.color == itemColor)
        
    )

    saveProductsInCart(newList)
    
}

/**
 * 
 * @param {string} productId 
 * @param {string} productColor 
 * @param {number} productQuantity 
 */

function addQuantity (productId, productColor, productQuantity){
    let listProductsInCart = getProductsInCart()
    listProductsInCart.find(item => item.id==productId && item.color == productColor).quantity = productQuantity
    saveProductsInCart(listProductsInCart)
}

/**
 * 
 * @param {productInCart[]} listProductsInCart 
 */
function displayTotal (listProductsInCart){
    let totalQuantity = 0
    let totalPrice = 0

    for (let item of listProductsInCart){
        totalPrice += item.price * item.quantity
        totalQuantity += item.quantity
    }

    document.getElementById("totalPrice").innerText = totalPrice
    document.getElementById("totalQuantity").innerText = totalQuantity
}


let listProductsInCart = getProductsInCart()

if (listProductsInCart.length >= 1){
    for (let productInCart of listProductsInCart){
        
        fetch(`http://localhost:3000/api/products/${productInCart.id}`)
            .then(res=>{
                if(res.ok){
                    return res.json()
                }else{
                    throw new Error ('Erreur serveur')
                }
            })
            .then(jsonProduct =>{
                let product = new Product(jsonProduct)
                document.querySelector('#cart__items').innerHTML += 
                    `<article class="cart__item" data-id="${product._id}" data-color="${productInCart.color}">
                        <div class="cart__item__img">
                            <img src="${product.imageUrl}" alt="${product.altTxt}">
                        </div>
                        <div class="cart__item__content">
                            <div class="cart__item__content__description">
                                <h2>${product.name}</h2>
                                <p>${productInCart.color}</p>
                                <p>${product.price} €</p>
                            </div>
                            <div class="cart__item__content__settings">
                                <div class="cart__item__content__settings__quantity">
                                    <p>Qté : </p>
                                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${productInCart.quantity}">
                                </div>
                                <div class="cart__item__content__settings__delete">
                                    <p class="deleteItem">Supprimer</p>
                                </div>
                            </div>
                        </div>
                    </article>`
                document.querySelectorAll(".deleteItem").forEach(item =>{
                    item.addEventListener('click', ()=>{
                        let itemId = item.closest('article').dataset.id
                        let itemColor = item.closest('article').dataset.color
                        removeProductFromCart(itemId, itemColor)
                        item.closest('article').remove()
                        listProductsInCart = getProductsInCart()
                        displayTotal(listProductsInCart)
                    })
                })
                document.querySelectorAll('.itemQuantity').forEach(itemQuantity => {
                    itemQuantity.addEventListener('change', e => {
                        itemQuantityId = itemQuantity.closest('article').dataset.id
                        itemQuantityColor = itemQuantity.closest('article').dataset.color
                        addQuantity (itemQuantityId, itemQuantityColor, e.currentTarget.value *1 )
                        listProductsInCart = getProductsInCart()
                        displayTotal(listProductsInCart)
                    })
                })
            })
            .catch(e => alert(e.message))
    }
}

displayTotal (listProductsInCart)




document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault()
    
    inputs = new FormData(e.currentTarget)
    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    let isValide = false
    for ([input,value] of inputs.entries()){
        if (value == ''){
            document.getElementById(`${input}ErrorMsg`).innerText = "Veuillez remplir le champs s'il vous plaît"
            isValide = false
            break
        }else if (input == 'email' && !mailFormat.test(value)){
            document.getElementById(`${input}ErrorMsg`).innerText = "Veuillez entrer une adresse mail valide"
            isValide = false
            break
        }else{
            document.getElementById(`${input}ErrorMsg`).innerText = ""
            isValide = true
        }
        
    }

    if (isValide){
        const contact = {}
        contact.firstName = inputs.get('firstName')
        contact.lastName = inputs.get('lastName')
        contact.address = inputs.get('address')
        contact.city = inputs.get('city')
        contact.email = inputs.get('email')

        const productIDInCard = []
        for (let product of listProductsInCart){
            productIDInCard.push(product.id)
        }

        if (productIDInCard.length == 0){
            alert('Veuillez ajouter au moins un article au panier')
            
        }else{
            fetch (`http://localhost:3000/api/products/order`,{
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({"contact":contact, "products": productIDInCard})
            })
                .then(res=>{
                    if(res.ok){
                        return res.json()
                    }
                })
                .then(jsonOrder=>{
                   ocument.location.href=`http://127.0.0.1:5500/front/html/confirmation.html?orderId=${jsonOrder.orderId}`
                }) 
        }

       
    }
})