class Product{
    constructor(jsonProduct){
        jsonProduct && Object.assign(this, jsonProduct);
    }
}

fetch ('http://localhost:3000/api/products')
.then((res)=>{
    if(res.ok){
        return res.json()
    }else{
        throw new Error('Erreur serveur')
    }
    
})
.then((jsonListProducts)=>{
    for (let jsonProduct of jsonListProducts){
        let product = new Product(jsonProduct)
        document.querySelector("#items").innerHTML += 
            `<a href="./product.html?id=${product._id}">
                <article>
                    <img src="${product.imageUrl}" alt="${product.altTxt}">
                    <h3 class="productName">${product.name}</h3>
                    <p class="productDescription">${product.description}</p>
                </article>
            </a>`
    }
        
})
.catch(e=>{
    document.querySelector("#items").innerHTML = e.message
})