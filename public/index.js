//Este es el JS de la página principal 

//Necesitamos Cookies para cuando el usuario da click en algun producto poder redirigirlo al mismo
let setCookies = (name, value, days) => {
    let expires = "";
    if (days) {
      let date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
};
let getCookis = name => {
    let nameEQ = name + "=";
    let ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
};
const categoriaView = getCookis("categoriaView")
function domHtml(valor){//Para no escribir siempre document.getElementById
    return document.getElementById(valor)
}
const domProductos=domHtml("productos")//Es el section donde vamos a cargar los productos
class SistemDom{
    constructor(productos,ofers, cart, idUser){
        this.products=productos//Vamos a guardar todos los productos
        this.ofers=ofers //Vamos a guardar todas las ofertas
        this.cart=cart //Vamos a guardar los productos añadidos al carrito
        this.idUser=idUser //Vamos a guardar el id del usuario
    }
    //Cambiamos el valor de Cart
    cargarCart(data){
        this.cart=data
    }
    //solicitamos productos mediante el objeto peticion1 de la clase Peticions
    solicitarProductos(){
        let show=domHtml("show")
        if(show.value==0){
            peticion1.getPeticion("./showProductos")
        }else if(show.value==1){
            const body = JSON.stringify({idCategoria: categoriaView})
            peticion1.setPeticion("./cate",body)
        }else if(show.value==2){
            peticion1.getPeticion("./showProductosOfers")
        }
    }
    //comparar(): 
    //Me ayuda a encontrar si el producto ya fue subido al carrito previamente
    //Si fue sumado previamente llama a upCart() el cual, actualiza la cantidad
    //Sino agrega el nuevo producto al carrito
    comparar(num){
        let par=false
        let cart=this.cart
        if(cart.length!=0){
            let max=cart.length-1
            for (let index = 0; index < cart.length; index++) {
                if(cart[index].idProduct == this.products[num].idProduct){
                    this.upCart(index, num)
                    par=true
                }
                if(index==max && par==false){
                    this.newAdd(num)
                }
            }
        }else{
            this.newAdd(num)
        }
    }
    //upCart() actualiza la cantidad de un producto en el carrito
    upCart(index, num){
        let cart=this.cart
        let cant = domHtml("cantidad"+num)
        cart[index].cantidad = parseInt(cart[index].cantidad)+parseInt(cant.value)
        if(cart[index].cantidad>this.products[num].cantidad){
            cart[index].cantidad=this.products[num].cantidad
        }
        const body = JSON.stringify({idUser: this.idUser, idProduct: this.products[num].idProduct, cantidad: cart[index].cantidad})
        peticion1.setPeticion("./upCart", body, 0)
    }
    //newAdd() Suma un producto al carrito
    newAdd(num){
        let cant = domHtml("cantidad"+num)
        const body = JSON.stringify({idUser: this.idUser, idProduct: this.products[num].idProduct, cantidad: cant.value})
        peticion1.setPeticion("./postCart", body, 0)
        let cantCart = domHtml("cant-cart")
        let newNum=parseInt(cantCart.value)+1
        cantCart.value=newNum
    }
    //Para mostrar los productos en la página
    desplegar(){
        let productos=this.products
        for(let i = productos.length-1 ; i>=0; i--){
            let estatus
            if(productos[i].estado==1){
                estatus="nuevo"
            }else{
                estatus="usado"
            }
            let ofersYes=false
            let oferta=``
            for(let indexx = 0; indexx<this.ofers.length;indexx++){
                if(productos[i].idOfer==this.ofers[indexx].idOfer && productos[i].idOfer != 0  && productos[i].idOfer != 1 ){
                    oferta=`
                        <output>${this.ofers[indexx].name}</output>
                    `
                    ofersYes=true
                }
            }
            let queda ="Queda"
            let unidad ="unidad"
            if(productos[i].cantidad>1){
                queda ="Quedan"
                unidad = "unidades"
            }
            domProductos.innerHTML+=`
                <section id="caja-product${i}" class=caja-producto>
                    <section id="info-product">
                        <button onclick="moreProduct(${i})" class="btn-link"><h3>${productos[i].name}</h3></button>
                    </section>
                    <output>${estatus}</output>
                    <output>${queda} ${productos[i].cantidad} ${unidad}</output>
                    <section class="box-price">
                        <output id="price${i}">$${productos[i].price}</output>
                        ${oferta}
                        <output id="price-final${i}" class="price-final"></output>
                    </section>
                    <section class="caja-botones">
                        <button id="less${i}" onclick="less(${i})" class="btn-ml">-</button>
                        <output id="cantidad${i}">1</output>
                        <button id="more${i}" onclick="more(${i})" class="btn-ml">+</button>
                    </section>
                    <section class="caja-call-accion">
                        <button id="add-cart${i}" onclick="addCart(${i})" class="add">Añadir al Carrito</button>
                        <button id="fav${i}" onclick="fav(${i})" class="fav">🤍</button>
                        <button id="buy-now${i}" onclick="buyNow(${i})" class="buy-now">Comprar Ahora</button>
                    </section>
                </section>
            `
            this.modifyProductUser(i)
            if(ofersYes==true && productos[i].idOfer >=5){
                let priceFinal =domHtml("price-final"+i)
                let descuento 
                switch (productos[i].idOfer){
                    case 5:
                        descuento=10
                        break;
                    case 6:
                        descuento=30
                        break;
                    case 7:
                        descuento=50
                        break;
                }
                let precio$=""
                for (let index = 0; index < productos[i].price.length; index++) {
                    if(productos[i].price.charAt(index) != '$' && productos[i].price.charAt(index) != '.'){
                        precio$=precio$+productos[i].price.charAt(index)
                    }
                }
                let valorDescuento= (precio$ / 100)*descuento 
                let precioFinal = parseInt(precio$) - valorDescuento
                let precioFinish = precioFinal.toString()
                let count = 1
                let precioReves=""
                for (let index = precioFinish.length; index >=0 ; index--) {
                    count++
                    if(count%3==0 && count>=3 && index != precioFinish.length-1){
                        precioReves=precioReves+"."
                    }
                    precioReves=precioReves+precioFinish.charAt(index)
                }
                let precioConSigno=""
                for (let index = precioReves.length; index >=0 ; index--) {
                    precioConSigno = precioConSigno + precioReves.charAt(index)
                }
                priceFinal.value="$"+precioConSigno
                let price$ =domHtml("price"+i)
                price$.style.textDecorationLine= "line-through"
            }
        }
        this.desplegarFavs()
    }
    //Para no permitir agregar ni comprar productos que sean del mismo usuario
    modifyProductUser(num){
        let userios=domHtml("userios")
        this.idUser=userios.value
        if (this.products[num].idUser==this.idUser){
            let add = domHtml("add-cart"+num)
            let buy = domHtml("buy-now"+num)
            let less =  domHtml("less"+num)
            let more = domHtml("more"+num)
            let cant = domHtml("cantidad"+num)
            add.style.display="none"
            buy.style.display="none"
            less.style.display="none"
            more.style.display="none"
            cant.style.display="none"
        }
    }
    //Para a cada producto que haya sido faveado se muestre faveado
    desplegarFavs(){
        let userios=domHtml("userios")
        this.idUser=userios.value
        const body = JSON.stringify({idUser: this.idUser})
        peticion1.setPeticion("./showFavs", body, 0)
    }
    //Si el usuario tiene algun fav lo mostrara en el respectivo producto
    modifyFav(data){
        if(data[0]!=undefined){
            for(let i=0; i<this.products.length;i++){
                for (let index = 0; index < data.length; index++) {
                    if(data[index].idProduct==this.products[i].idProduct){
                        let favi = domHtml("fav"+i)
                        favi.style.background="red"
                        favi.innerHTML="💛"
                    }
                    
                }
            }
        }
    }
    //Sube a la BD el nuevo Fav
    favNew(num){
        const body = JSON.stringify({idProduct: this.products[num].idProduct, idUser: this.idUser})
        peticion1.setPeticion("./fav", body,0)
    }
    //Pide a una url el carrito del usuario
    verCart(num){
        const body = JSON.stringify({idUser: this.idUser})
        peticion1.setPeticion("./cantCart", body, num)
    }
    //Pide a una url las ofertas
    obtenerOfertas(){
        peticion1.getPeticion("./showOfers")
    }
    //Modifica el estado del boton "favorito" si el usuario da click 
    changeFav(favorite, num ,cora,color){
        favorite.innerHTML=cora
        favorite.style.background=color
        this.favNew(num)
    }
}
class Peticions{
    //Pide a una url ciertos datos, por otro lado el controlador le proporciona los datos
    getPeticion(url){
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.send();
        xhr.responseType = "json";
        xhr.onload = () => {
          if (xhr.readyState == 4 && xhr.status == 200) {
            const data = xhr.response;
            if(url=='./showProductos' || url=='./showProductosOfers'){
                sisDom.products=data
                sisDom.obtenerOfertas(data)
            }
            if(url=='./showOfers'){
                sisDom.ofers=data
                sisDom.desplegar()
            }
          } else {
            console.log(`Error: ${xhr.status}`);
          }
        };
    }
    //Pide y manda a una url datos, el controlador otorga respuesta y recibe datos los cuales procesa
    setPeticion(url,body, num){
        const xhr = new XMLHttpRequest();
        xhr.open("POST", url);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(body);
        xhr.onload = () => {
          if (xhr.readyState == 4 && xhr.status == 200) {
            const data = JSON.parse(xhr.responseText);
            if(url=='./cantCart'){
                sisDom.cargarCart(data)
                sisDom.comparar(num)
            }
            if(url=='./showFavs'){
                sisDom.modifyFav(data)
            }
            if(url=='./cate'){
                sisDom.products=data
                sisDom.obtenerOfertas(data)
            }
          } else {
            console.log(`Error: ${xhr.status}`);
          }
        };
    }
}
//Creo los objetos que necesito para el buen funcionamiento de la pág
const peticion1=new Peticions()
const sisDom=new SistemDom()
//Iniciar() Cuando la persona inicie o recarge la página se ejectuará esta función
function iniciar(){
    setTimeout(sisDom.solicitarProductos, 500)
}
function buyNow(num){
    if(sisDom.idUser==0){
        location.href="./signIn.html"
    }else{
        setCookies("buyNow", sisDom.products[num].idProduct)
        location.href="./buy.html"
    }
}
//Boton add cart, si la persona no se logueo lo manda a la pagina de logueo
//sino se cita verCart() para realizar analisis del carrito
function addCart(num){
    if(sisDom.idUser==0){
        location.href="./signIn.html"
    }else{
        sisDom.verCart(num)
    }
} 
//Boton Fav, se fija si el producto ya estaba faviado o no
//Si esta faviado llama a changeFav() para desfavearlo
//Si no esta faviado llama a changeFav() para faviarlo
function fav(num){
    let favorite = domHtml("fav"+num)
    if(favorite.style.background=='red'){
        sisDom.changeFav(favorite, num, "🤍", "white")
    }else{
        sisDom.changeFav(favorite, num, "💛", "red")
    }
}
//Boton el cual si se le da click vamos a la descripcion del producto en especifico
function moreProduct(num){
    setCookies("descProduct", sisDom.products[num].idProduct)
    location.href="./desc.html"
}
//Boton para restar cantidades de un producto
function less(num){
    let cantidades= domHtml("cantidad"+num)
    if(cantidades.value>1){
        cantidades.value=parseInt(cantidades.value)-1
    }
}
//Boton para sumar cantidades de un producto
function more(num){
    let cantidades = domHtml("cantidad"+num)
    if(cantidades.value<sisDom.products[num].cantidad){
        cantidades.value=parseInt(cantidades.value)+1
    }
}
window.addEventListener("load", iniciar)