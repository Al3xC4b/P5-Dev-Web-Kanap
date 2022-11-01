/**
 * 
 * @returns {}
 */

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
    console.log(newList)

    saveProductsInCart(newList)
    
}

class Product{
    constructor(jsonProduct){
        jsonProduct && Object.assign(this, jsonProduct);
    }
}


let listProductsInCart = getProductsInCart()

if (listProductsInCart.length >= 1){
    for (let product of listProductsInCart){
        fetch(`http://localhost:3000/api/products/${product.id}`)
            .then(res=>{
                if(res.ok){
                    return res.json()
                }
            })
            .then(jsonProduct =>{
                let _product = new Product(jsonProduct)
                document.querySelector('#cart__items').innerHTML += 
                    `<article class="cart__item" data-id="${_product._id}" data-color="${product.color}">
                        <div class="cart__item__img">
                            <img src="${_product.imageUrl}" alt="${_product.altTxt}">
                        </div>
                        <div class="cart__item__content">
                            <div class="cart__item__content__description">
                                <h2>${_product.name}</h2>
                                <p>${product.color}</p>
                                <p>${_product.price} €</p>
                            </div>
                            <div class="cart__item__content__settings">
                                <div class="cart__item__content__settings__quantity">
                                    <p>Qté : </p>
                                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
                                </div>
                                <div class="cart__item__content__settings__delete">
                                    <p class="deleteItem">Supprimer</p>
                                </div>
                            </div>
                        </div>
                    </article>`
                document.querySelectorAll(".deleteItem").forEach(item =>{
                    item.addEventListener('click', ()=>{
                        itemId = item.closest('article').dataset.id
                        itemColor = item.closest('article').dataset.color
                        removeProductFromCart(itemId, itemColor)
                        item.closest('article').remove()
                    })
                })

                document.querySelectorAll('.itemQuantity').forEach(itemQuantity => {
                    itemQuantity.addEventListener('change', e => {
                        product.quantity = e.currentTarget.value
                        console.log(product.quantity)
                        console.log(listProductsInCart)
                        saveProductsInCart(listProductsInCart)
                    })
                })

            })
    }
}


document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault()
    inputFirstName = new FormData(e.currentTarget)
    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    let isValide = false
    for ([input,value] of inputFirstName.entries()){
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

        //récupérer le form plus les id pour faire un fetce et récupérer l'id de la commande pour le passer dans la redirection
        
    }
    
    
    
})