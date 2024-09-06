let preferenceMP
const mp = new MercadoPago('TEST-7ac01961-1696-4f05-b7f3-bcc1db32e64e', {
    locale: 'es-AR'
});
function domHtml(valor){
    return document.getElementById(valor)
}
let usuarioVendedor=[]
let ofers=[]
let precios=0
const infoProduct=domHtml("productos")
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
const buyNow=getCookis("buyNow")
class Dom{
    constructor(products, idUser, cantidad, oferta){
        this.products=products
        this.idUser=idUser
        this.cantidad=cantidad
        this.oferta=oferta
    }
    cargarlo(){
        const body = JSON.stringify({idProduct: buyNow})
        peticion1.reqRes("POST", "./desc", body)
    }
    mostrarProducto(){
        let data=this.products
        let categorias
        switch (parseInt(data[0].categoria)){
            case 1:
              categorias="Vehiculos"
              break;
            case 2:
              categorias="Inmuebles"
              break;
            case 3:
              categorias="Tecnología"
              break;
            case 4:
              categorias="Hogar y Muebles"
              break;
            case 5:
              categorias="Electrodomésticos"
              break;
            case 6:
              categorias="Herramientas"
              break;
            case 7:
              categorias="Construcción"
              break;
            case 8:
              categorias="Deportes y Fitness"
              break;  
        }
        let estatus 
        if(data[0].estatus==0){
            estatus="Usado"
        }else{
            estatus="Nuevo"
        }
        let ofersYes=false
        let oferta=``
        for(let indexx = 0; indexx<ofers.length;indexx++){
            if(data[0].idOfer==ofers[indexx].idOfer && data[0].idOfer != 0  && data[0].idOfer != 1 ){
                oferta=`
                    <output>${ofers[indexx].name}</output>
                `
                ofersYes=true
            }
        }
        let queda ="Queda"
        let unidad ="unidad"
        if(data[0].cantidad>1){
            queda ="Quedan"
            unidad = "unidades"
        }
        infoProduct.innerHTML=`
        <section id="first-parte">
            <section id="desc">
                <output>${estatus}</output>
                <h2 id="pausa"></h2>
                <h2 id="hh">${data[0].name}</h2>
            </section>
            <section id="pay">
                <output>${queda} ${data[0].cantidad} ${unidad}</output><br>
                <section class="box-price">
                        <output id="price">$${data[0].price}</output>
                        ${oferta}
                        <output id="price-final" class="price-final"></output>
                </section>
                <section id="box-cant">
                    <output id="text-cant">Cantidad</output><br>
                    <button id="less" onclick="less()" class="btn-ml">-</button>
                    <output id="cantidad"></output>
                    <button id="more" onclick="more()" class="btn-ml">+</button>
                </section>
            </section>
        </section>
            <section class="box-price-multi">
                <section>
                    <output class="total">Total:</output>
                    <output id="precio-final" class="price-final"></output>
                </section>
                <button id="buy-now" onclick="buyNows()">Comprar</button>
            </section>
            <section id="userSell">
                <output id="nameUsu">Vendedor: ${usuarioVendedor[0]}</output><br>
                <output id="barrio">Localidad: ${usuarioVendedor[1]}</output><br>
            </section>
            <div id="paymentBrick_container"></div>
        `
        let cantidades= document.getElementById("cantidad")
        cantidades.value=1
        if(ofersYes==true && data[0].idOfer >=5){
            let priceFinal =document.getElementById("price-final")
            let precio$ = this.sacarSignosPrice()
            let valorDescuento= (precio$ / 100)*this.descuent$()
            let precioFinal = parseInt(precio$) - valorDescuento
            let precioMulti = parseInt(precioFinal)*parseInt(cantidades.value)
            precios=precios+precioMulti
            let precioFinish = precioFinal.toString()
            let precioDesc = this.sumarSignosPrice(precioFinish)
            let precioMultiplicado = this.sumarSignosPrice(precioMulti.toString())
            let precioFinalMulti = document.getElementById("precio-final")
            precioFinalMulti.innerHTML = "$"+precioMultiplicado
            priceFinal.value="$"+precioDesc
            let price$ =document.getElementById("price")
            price$.style.textDecorationLine= "line-through"
        }else{
            let precio$ = this.sacarSignosPrice()
            let precioMulti = parseInt(precio$)*parseInt(cantidades.value)
            let precioMultiplicado = this.sumarSignosPrice(precioMulti.toString())
            let precioFinalMulti = document.getElementById("precio-final")
            precioFinalMulti.innerHTML = "$"+precioMultiplicado
            precios=precios+precioMulti
        }
        this.productActive()
    }
    sacarSignosPrice(){
        let precio$=""
        for (let index = 0; index < this.products[0].price.length; index++) {
            if(this.products[0].price.charAt(index) != '$' && this.products[0].price.charAt(index) != '.'){
                precio$=precio$+this.products[0].price.charAt(index)
            }
        }
        return precio$
    }
    sumarSignosPrice(precioFinish){
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
    descuent$(){
        let descuento 
        switch (this.products[0].idOfer){
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
    obtenerOfertas(){
        peticion1.reqRes("GET", "./showOfers")
    }
    cargarInfoUserVendedor(datos){
        const body = JSON.stringify({data:datos})
        peticion1.reqRes("POST", "./descVendedor", body)
    }
    productActive(){
        if(this.products[0].publicado==0){
          body.style.background="rgba(150,150,150)"
          let boxCant=document.getElementById("box-cant")
          let butNow =document.getElementById("buy-now")
          let pausa= document.getElementById("pausa")
          boxCant.style.display="none"
          butNow.style.display="none"
          pausa.innerHTML="En Pausa"
          pausa.style.color="red"
          pausa.style.background="white"
          pausa.style.textAlign="center"
          pausa.style.marginRight="1vw"
        }
    }
    saveLessOrMore(){
        let precioFinalMulti = document.getElementById("precio-final")
        precioFinalMulti.innerHTML = "$"+this.sumarSignosPrice(precios.toString())
    }
    createCheckoutButton(preferenceId){
        const bricksBuilder = mp.bricks();
        const renderPaymentBrick = async (bricksBuilder) => {
            if(window.paymentBrickController){
                window.paymentBrickController.unmount()
            }
            const settings = {
            initialization: {
                /*
                  "amount" es el monto total a pagar por todos los medios de pago con excepción de la Cuenta de Mercado Pago y Cuotas sin tarjeta de crédito, las cuales tienen su valor de procesamiento determinado en el backend a través del "preferenceId"
                */
                amount: parseInt(precios),
                preferenceId: preferenceId,
                payer: {
                  firstName: "",
                  lastName: "",
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
                    creditCard: "all",
                    debitCard: "all",
                    onboarding_credits: "all",
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
              onSubmit: ({formData}) => {
                // callback llamado al hacer clic en el botón de envío de datos
                return new Promise((resolve, reject) => {
                  fetch("/proccess_payment", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                  })
                    .then((response) => response.json())
                    .then((response) => {
                        console.log(response.status)
                        if(response.status=='approved'){
                            let precio$=this.sacarSignosPrice(this.products[0].price)
                            console.log(precio$)
                            if(parseInt(this.products[0].cantidad)==1){
                                const body=JSON.stringify({
                                    name: this.products[0].name,
                                    cantidad: this.products[0].cantidad,
                                    description: this.products[0].description,
                                    estado: this.products[0].estado,
                                    publicado:0,
                                    categoria: this.products[0].categoria,
                                    price: precio$,
                                    idOfer: this.products[0].idOfer,
                                    idProduct: this.products[0].idProduct
                                })
                                peticion1.reqRes("POST", "./modifyProduct", body)
                                this.crearCompra()
                            }else{
                                let cantidades=document.getElementById("cantidad")
                                let cant=parseInt(this.products[0].cantidad)-parseInt(cantidades.value)
                                let publi=1
                                if(cant==0){
                                    publi=0
                                }
                                const body=JSON.stringify({
                                    name: this.products[0].name,
                                    cantidad: cant,
                                    description: this.products[0].description,
                                    estado: this.products[0].estado,
                                    publicado:publi,
                                    categoria: this.products[0].categoria,
                                    price: precio$,
                                    idOfer: this.products[0].idOfer,
                                    idProduct: this.products[0].idProduct
                                })
                                peticion1.reqRes("POST", "./modifyProduct", body)
                                this.crearCompra()
                            }
                        }else{  
                        fail=document.getElementById("fail")
                            fail.style.display="flex"
                            infoProduct.style.display="none"
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                        // manejar la respuesta de error al intentar crear el pago
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
            window.paymentBrickController = await bricksBuilder.create(
                "payment",
                "paymentBrick_container",
                settings
            );
        }; 
        renderPaymentBrick(bricksBuilder); 
    }
    crearCompra(){
        let userios= document.getElementById("userios")
        let cant = document.getElementById("cantidad")
        const body=JSON.stringify({
            idVendedor: this.products[0].idUser,
            idComprador: parseInt(userios.value),
            idProduct: this.products[0].idProduct,
            nameProduct:this.products[0].name,
            cantidad: parseInt(cant.value),
            precio: precios
        })
        let fecha = new Date()
        let mes = fecha.getMonth()+1
        if(mes<10){
          mes=""+0+""+mes
        }
        let newFecha = fecha.getDate() +"/"+ mes +"/"+ fecha.getFullYear()
        const body1=JSON.stringify({
            idUser: 0,
            idProduct: this.products[0].idProduct,
            idDestinatario:this.products[0].idUser,
            mensaje:"Vendiste "+ this.products[0].name,
            fecha:newFecha,
            idRespuesta:0
        })
        const body2=JSON.stringify({
            idUser: 0,
            idProduct: this.products[0].idProduct,
            idDestinatario:parseInt(userios.value),
            mensaje:"Compraste "+ this.products[0].name,
            fecha:newFecha,
            idRespuesta:0
        })
        const bodySaldo=JSON.stringify({dato: precios, idUser: this.products[0].idUser})
        peticion1.reqRes("POST", "./upSaldo", bodySaldo)
        peticion1.reqRes("POST", "./createCompra", body)
        peticion1.reqRes("POST", "./sendmsj", body1)
        peticion1.reqRes("POST", "./sendmsj", body2)
        location.href="./mybuys.html"
    }
}
const pila=new Dom()
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
                if(url=='./desc'){
                    pila.products=data
                    pila.obtenerOfertas()
                }
                if(url=="./descVendedor"){
                  usuarioVendedor=data
                  pila.mostrarProducto()
                }
                if(url=="./create_payment"){
                    preferenceMP = data
                    pila.createCheckoutButton(preferenceMP.id)
                }
            }else{
                const data = xhr.response;
                if(url=='./showOfers'){
                    ofers=data
                    pila.cargarInfoUserVendedor(pila.products[0].idUser)
                }
            }
          } else {
            console.log(`Error: ${xhr.status}`);
          }
        }; 
    }
}
const peticion1=new Peticions()
function iniciar(){
    setTimeout(pila.cargarlo,500)
}
function buyNows(){
    let userios=document.getElementById("userios")
    if(userios.value==0){
        location.href="./signIn.html"
    }else{
        try{
            let cant = document.getElementById("cantidad")
            //ARMADO DE DATOS QUE NECESITA MERCADO PAGO PARA PROCESAR EL PAGO: titulo del producto, cantidad del mismo, y precioFinal
            const orderData =JSON.stringify({
                title: pila.products[0].name,
                quantity: parseInt(cant.value),
                price: parseInt(precios)
            })
            //Se lo mandamos al backend
            peticion1.reqRes("POST", "./create_payment", orderData)
        }catch(error){
            console.log('error')
        }
    }
}
function less(){
    let cantidades= document.getElementById("cantidad")
    if(cantidades.value>1){
        cantidades.value=parseInt(cantidades.value)-1 
        if(pila.products[0].idOfer>=5){
            let precio$ = pila.sacarSignosPrice(pila.products)
            let valorDescuento= (precio$ / 100)*pila.descuent$()
            let precioFinal = parseInt(precio$) - valorDescuento
            precios= parseInt(precios)-parseInt(precioFinal)
            pila.saveLessOrMore()
        }else{
            precios= parseInt(precios)-parseInt(pila.sacarSignosPrice())
            pila.saveLessOrMore()
        }
    }
}
function more(){
    let cantidades = document.getElementById("cantidad")
    if(cantidades.value<pila.products[0].cantidad){
        cantidades.value=parseInt(cantidades.value)+1
        if(pila.products[0].idOfer>=5){
            let precio$ = pila.sacarSignosPrice()
            let valorDescuento= (precio$ / 100)*pila.descuent$()
            let precioFinal = parseInt(precio$) - valorDescuento
            precios=parseInt(precios)+parseInt(precioFinal)
            pila.saveLessOrMore()
        }else{
            precios= parseInt(precios)+parseInt(pila.sacarSignosPrice())
            pila.saveLessOrMore()
        }
    }
}
window.addEventListener("load",iniciar)