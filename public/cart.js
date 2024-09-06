let preferenceMP
const mp = new MercadoPago('TEST-7ac01961-1696-4f05-b7f3-bcc1db32e64e', {
    locale: 'es-AR'
});
function domHtml(valor){
    return document.getElementById(valor)
}
const domProductos=document.getElementById("product-cart")
const boxPay=document.getElementById("box-pay")
const delCart=document.getElementById("del-cart")
boxPay.style.display="none"
delCart.style.display="none"
let products=[]
let ofers=[]
let ipUser
let cart=[]
let precios=[]
class Peticions{
    reqRes(tipo, url,body,num){
        const xhr = new XMLHttpRequest();
        xhr.open(tipo, url);
        if(tipo=='POST'){
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(body);
        }else{
            xhr.responseType = "json";
            xhr.send();
        }
        xhr.onload = () => {
          if (xhr.readyState == 4 && xhr.status == 200) {
            if(tipo=='POST'){
                const data = JSON.parse(xhr.responseText);
                if(url=='./cantCart' && num!=undefined){
                    cart=data
                    comparar(cart, num)
                }
                if(url=='./cantCart' && num==undefined){
                    cart=data
                    pedirProductos()
                }
                if(url=="./create_payment"){
                    preferenceMP = data
                    createCheckoutButton(preferenceMP.id)
                }
            }else{
                const data = xhr.response;
                if(url=='./showProductos'){
                    obtenerOfertas(filtrar(data))
                }
                if(url=='./showOfers'){
                    ofers=data
                    desplegar()
                }
            }
          } else {
            console.log(`Error: ${xhr.status}`);
          }
        }; 
    }
}
const peticion1 = new Peticions()
function createCheckoutButton(preferenceId){
    let precioFinal=0
    for (let index = 0; index < precios.length; index++) {
        precioFinal=precioFinal+precios[index]
    }
    const bricksBuilder = mp.bricks();
    const renderCardPaymentBrick = async (bricksBuilder) => {
        if(window.paymentBrickController){
            window.paymentBrickController.unmount()
        }
        const settings = {
        initialization: {
            /*
              "amount" es el monto total a pagar por todos los medios de pago con excepción de la Cuenta de Mercado Pago y Cuotas sin tarjeta de crédito, las cuales tienen su valor de procesamiento determinado en el backend a través del "preferenceId"
            */
            amount: precioFinal,
            preferenceId: preferenceId,
            payer: {
              email: "",
            },
        },
        customization: {
            visual: {
                style: {
                theme: "default",
                },
            },
            paymentMethods: {
                maxInstallments: 12
            },
        },
        callbacks: {
          onReady: () => {
            /*
             Callback llamado cuando el Brick está listo.
             Aquí puede ocultar cargamentos de su sitio, por ejemplo.
            */
          },
          onSubmit: (cardformData) => {
            // callback llamado al hacer clic en el botón de envío de datos
            return new Promise((resolve, reject) => {
              fetch("/proccess_payment", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(cardformData),
              }).then((response) => {
                    if(response.status=='approved'){
                        for (let i = 0; i < products.length; i++) {
                            console.log(products)
                            let precio$=sacarSignosPrice(products, i)
                            let cantidades=document.getElementById("cantidad"+i)
                            if(parseInt(products[i].cantidad)==1){
                                const body=JSON.stringify({
                                    name: products[i].name,
                                    cantidad: 1,
                                    description: products[i].description,
                                    estado: products[i].estado,
                                    publicado:0,
                                    categoria: products[i].categoria,
                                    price:  precio$,
                                    idOfer: products[i].idOfer,
                                    idProduct: products[i].idProduct
                                })
                                peticion1.reqRes("POST", "./modifyProduct", body)
                                crearCompra(i)
                            }else{
                                let cant=parseInt(products[i].cantidad)-parseInt(cantidades.value)
                                let publi=1
                                if(cant==0){
                                    cant=1
                                    publi=0
                                }
                                console.log(cant)
                                const body=JSON.stringify({
                                    name: products[i].name,
                                    cantidad: cant,
                                    description: products[i].description,
                                    estado: products[i].estado,
                                    publicado:publi,
                                    categoria: products[i].categoria,
                                    price: precio$,
                                    idOfer: products[i].idOfer,
                                    idProduct: products[i].idProduct
                                })
                                console.log(body)
                                peticion1.reqRes("POST", "./modifyProduct", body)
                                crearCompra(i)
                            } 
                            if(i==products.length-1){
                                location.href="./mybuys.html" 
                            } 
                        }
                        let userios= document.getElementById("userios")
                        const body=JSON.stringify({idUser: userios.value})
                        peticion1.reqRes("POST", "./delCart", body)
                    }else{
                        let pay= document.getElementById("paymentBrick_container")
                        let boxPay=document.getElementById("box-pay")
                        let boxCart=document.getElementById("box-cart")
                        boxCart.style.display="none"
                        boxPay.style.display="none"
                        pay.style.display="none"
                        let fail=document.getElementById("fail")
                        fail.style.display="flex"
                        domProductos.style.display="none"
                    }
                })
                .catch((error) => {
                  // manejar la respuesta de error al intentar crear el pago
                  console.log(error)
                  reject();
                });
            });
          },
          onError: (error) => {
            // callback llamado para todos los casos de error de Brick
            console.error(error);
          },
        },
    };
    window.cardPaymentBrickController = await bricksBuilder.create('cardPayment', 'cardPaymentBrick_container', settings);
    };
    renderCardPaymentBrick(bricksBuilder);
}
function crearCompra(num){
    let userios= document.getElementById("userios")
    let cant = document.getElementById("cantidad"+num)
    const body=JSON.stringify({
        idVendedor: products[num].idUser,
        idComprador: parseInt(userios.value),
        idProduct: products[num].idProduct,
        nameProduct:products[num].name,
        cantidad: parseInt(cant.value),
        precio: precios[num]
    })
    let fecha = new Date()
    let mes = fecha.getMonth()+1
    if(mes<10){
      mes=""+0+""+mes
    }
    newFecha = fecha.getDate() +"/"+ mes +"/"+ fecha.getFullYear()
    const body1=JSON.stringify({
        idUser: 0,
        idProduct: products[num].idProduct,
        idDestinatario:products[num].idUser,
        mensaje:"Vendiste "+ products[num].name,
        fecha:newFecha,
        idRespuesta:0
    })
    const bodySaldo=JSON.stringify({dato: precios[num], idUser: products[num].idUser})
    peticion1.reqRes("POST", "./createCompra", body)
    peticion1.reqRes("POST", "./upSaldo", bodySaldo)
    peticion1.reqRes("POST", "./sendmsj", body1)
}
function pedirCart(){
    let userios=document.getElementById("userios")
    const body = JSON.stringify({
      idUser: userios.value
    })
    peticion1.reqRes("POST","./cantCart", body)
}
function filtrar(data){
    for (let i = 0; i < cart.length; i++) {
        for (let index = 0; index < data.length; index++) {
            if(data[index].idProduct==cart[i].idProduct){
                products.push(data[index])
            }
        }
    }
    return products
}
function pedirProductos(){
    peticion1.reqRes("GET","./showProductos")
}
function obtenerOfertas(){
    peticion1.reqRes("GET","./showOfers")
}
function desplegar(){
    let productos=products
    for(let i =  0; i<productos.length; i++){
        let estatus
        if(productos[i].estado==1){
            estatus="nuevo"
        }else{
            estatus="usado"
        }
        let ofersYes=false
        let oferta=``
        for(let indexx = 0; indexx<ofers.length;indexx++){
            if(productos[i].idOfer==ofers[indexx].idOfer && productos[i].idOfer != 0  && productos[i].idOfer != 1 ){
                oferta=`
                    <output>${ofers[indexx].name}</output>
                `
                ofersYes=true
            }
        }
        let queda ="Cantidad"
        let unidad ="unidad"
        if(productos[i].cantidad>1){
            queda ="Quedan"
            unidad = "unidades"
        }
        domProductos.innerHTML+=`
            <section id="caja-product${i}" class=caja-producto>
                <section id="info-product">
                    <button onclick="moreProduct(${i})" class="btn-link"><h2>${productos[i].name}</h2></button>
                    <output>${estatus}</output>
                </section>
                <section class="box-price-and-del">
                    <button id="del${i}" onclick="del(${i})" class="del">eliminar</button>
                    <section class="box">
                        <section class="modify-carts">
                            <section class="count-cart" id="count-cart${i}">
                                <output>Cantidad:</output>
                                <output id="cantidad${i}">${cart[i].cantidad}</output>
                            </section>
                            <section class="caja-botones" id="box-moless${i}">
                                <section class="solo-moless">
                                    <button id="less${i}" onclick="less(${i})" class="btn-ml">-</button>
                                    <button id="more${i}" onclick="more(${i})" class="btn-ml">+</button>
                                </section>
                                <button id="add-cart${i}" onclick="addCart(${i})" class="add">Cambiar</button>
                            </section>
                            <section class="caja-call-accion">
                                <button id="add-carts${i}" onclick="addCarts(${i})" class="add">Cambiar</button>
                            </section>
                        </section>
                        <section class="box-price">
                            <output id="price${i}" class="prices">Precio por Unidad: $${productos[i].price}</output>
                            ${oferta}
                            <output id="price-final${i}" class="precio-final"></output>
                            <section class="box-price-multi">
                                <output class="total">Total:</output>
                                <output id="precio-final${i}" class="price-final"></output>
                            </section>
                        </section>
                    </section>
                </section>
            </section>
        `
        if(parseInt(productos[i].cantidad)==1){
            let ania = document.getElementById("add-carts"+i)
            ania.style.display="none"
            let counCart =document.getElementById("count-cart"+i)
            counCart.style.borderTopRightRadius="20px"
        }
        let boxMoreLess=document.getElementById("box-moless"+i)
        boxMoreLess.style.display="none"
        if(ofersYes==true && productos[i].idOfer >=5){
            let priceFinal =document.getElementById("price-final"+i)
            let precio$ = sacarSignosPrice(productos, i)
            let valorDescuento= (precio$ / 100)*descuent$(i)
            let precioFinal = parseInt(precio$) - valorDescuento
            let precioMulti = parseInt(precioFinal)*parseInt(cart[i].cantidad)
            let precioFinish = precioFinal.toString()
            let precioDesc = sumarSignosPrice(precioFinish)
            let precioMultiplicado = sumarSignosPrice(precioMulti.toString())
            let precioFinalMulti = document.getElementById("precio-final"+i)
            precios.push(precioMulti)
            precioFinalMulti.innerHTML = "$"+precioMultiplicado
            priceFinal.value="$"+precioDesc
            let price$ =document.getElementById("price"+i)
            price$.style.textDecorationLine= "line-through"
        }else{
            let precio$ = sacarSignosPrice(productos, i)
            let precioMulti = parseInt(precio$)*parseInt(cart[i].cantidad)
            let precioMultiplicado = sumarSignosPrice(precioMulti.toString())
            let precioFinalMulti = document.getElementById("precio-final"+i)
            precios.push(precioMulti)
            precioFinalMulti.innerHTML = "$"+precioMultiplicado
        }
    }
    if(cart.length!=0){
        delCart.style.display="block"
        boxPay.style.display="flex"
    }
    precioPagars()
}
function payCart(){
    let userios=document.getElementById("hello")
    let nameUser=userios.innerText.toString()
    let precioFinal=0
    for (let index = 0; index < precios.length; index++) {
        precioFinal=precioFinal+precios[index]
    }
    try{
        //ARMADO DE DATOS QUE NECESITA MERCADO PAGO PARA PROCESAR EL PAGO: titulo del producto, cantidad del mismo, y precioFinal
        const orderData =JSON.stringify({
            title: "Compra de"+nameUser.slice(5,-1),
            quantity: cart.length,
            price: precioFinal
        })
        //Se lo mandamos al backend
        peticion1.reqRes("POST", "./create_payment", orderData)
    }catch(error){
        console.log('error')
    }
}
function sacarSignosPrice(productos, i){
    let precio$=""
    for (let index = 0; index < productos[i].price.length; index++) {
        if(productos[i].price.charAt(index) != '$' && productos[i].price.charAt(index) != '.'){
            precio$=precio$+productos[i].price.charAt(index)
        }
    }
    return precio$
}
function sumarSignosPrice(precioFinish){
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
    return precioConSigno
}
function addCarts(num){
    let boxMoreLess=document.getElementById("box-moless"+num)
    boxMoreLess.style.display="flex"
    let addCart = document.getElementById("add-carts"+num)
    addCart.style.display="none"
} 
function addCart(num){
    let addCart = document.getElementById("add-carts"+num)
    addCart.style.display="block"
    verCart(num)
} 
function verCart(num){
    const body = JSON.stringify({idUser: userios.value})
    peticion1.reqRes("POST","./cantCart", body, num)
}
function comparar(cart, num){
    if(cart.length!=0){
        for (let index = 0; index < cart.length; index++) {
            if(cart[index].idProduct == products[num].idProduct){
                upCart(num)
            }
        }
    }
}
function upCart(num){
    let boxMoreLess=document.getElementById("box-moless"+num)
    boxMoreLess.style.display="none"
    let cant = document.getElementById("cantidad"+num)
    let userios=document.getElementById("userios")
    const body = JSON.stringify({idUser: userios.value, idProduct: products[num].idProduct, cantidad: cant.value})
    peticion1.reqRes("POST","./upCart", body)
}
let setCookies = (name, value, days) => {
    let expires = "";
    if (days) {
      let date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
};
function moreProduct(num){
    setCookies("descProduct", products[num].idProduct)
    location.href="./desc.html"
}
function saveLessOrMore(num){
    let precioFinalMulti = document.getElementById("precio-final"+num)
    precioFinalMulti.innerHTML = "$"+sumarSignosPrice(precios[num].toString())
    precioPagars()
}
function less(num){
    let cantidades= document.getElementById("cantidad"+num)
    if(cantidades.value>1){
        cantidades.value=parseInt(cantidades.value)-1 
        if(products[num].idOfer>=5){
            let precio$ = sacarSignosPrice(products, num)
            let valorDescuento= (precio$ / 100)*descuent$(num)
            let precioFinal = parseInt(precio$) - valorDescuento
            precios[num]= precios[num]-precioFinal
            saveLessOrMore(num)
        }else{
            precios[num]= precios[num]-parseInt(sacarSignosPrice(products, num))
            saveLessOrMore(num)
        }
    }
}
function descuent$(num){
    let descuento 
    switch (products[num].idOfer){
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
    return descuento
}
function more(num){
    let cantidades = document.getElementById("cantidad"+num)
    if(cantidades.value<products[num].cantidad){
        cantidades.value=parseInt(cantidades.value)+1
        if(products[num].idOfer>=5){
            let precio$ = sacarSignosPrice(products, num)
            let valorDescuento= (precio$ / 100)*descuent$(num)
            let precioFinal = parseInt(precio$) - valorDescuento
            precios[num]= precios[num]+precioFinal
            saveLessOrMore(num)
        }else{
            precios[num]= precios[num]+parseInt(sacarSignosPrice(products, num))
            saveLessOrMore(num)
        }
    }
}
function precioPagars(){
    let payPrice=document.getElementById("tot-pay")
    let totPrice=0
    for (let index = 0; index < precios.length; index++) {
        totPrice=totPrice+precios[index]
    }
    payPrice.value="$"+sumarSignosPrice(totPrice.toString())
}
function delCarrito(){
    let userios=document.getElementById("userios")
    const body = JSON.stringify({idUser: userios.value})
    peticion1.reqRes("POST","./delCart", body)
    location.href="./index.html"
}
function del(num){
    let userios=document.getElementById("userios")
    const body = JSON.stringify({idUser: userios.value, idProduct: cart[num].idProduct})
    peticion1.reqRes("POST","./delProductCart", body)
    location.reload()
}
function iniciar(){
    setTimeout(pedirCart,1000)
}
window.addEventListener("load",iniciar)