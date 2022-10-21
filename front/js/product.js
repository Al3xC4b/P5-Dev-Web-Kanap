function urlWithId (Url){
    const productUrl = new URL(window.location.href);
    return 'http://localhost:3000/api/products/' + productUrl.searchParams.get("id");
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
    })


