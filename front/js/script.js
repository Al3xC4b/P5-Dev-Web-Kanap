fetch ('http://localhost:3000/api/products')
    .then((res)=>{
        if(res.ok){
            return res.json()
        }
    })
    .then((jsonListProducts)=>{
        for (let jsonProduct of jsonListProducts){
            let product = new Product(jsonProduct)
            console.log(product)
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

