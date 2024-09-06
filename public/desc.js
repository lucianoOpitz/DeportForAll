let setCookies = (name, value, days) => {
  let expires = "";
  if (days) {
    let date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
};
const infoProduct=document.getElementById("info-product")
let usuarioVendedor=[]
let productio=[]
let cant
let msjs
let alertMsj
let ofers=[]
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
                productio=data
                obtenerOfertas()
              }
              if(url=="./descVendedor"){
                usuarioVendedor=data
                cargarInfo()
              }
              if(url=="./cantCart"){
                num=data
                comparar(num)
              }
              if(url=="./msjs"){
                showMsjs(data)
              }
              if(url=='./showFavs'){
                modifyFav(data)
              }
          }else{
              const data = xhr.response;
              if(url=='./showOfers'){
                ofers=data
                cant = productio[0].cantidad
                cargarInfoUserVendedor(productio[0].idUser, productio)
                upHistorial(productio[0].idProduct)
              }
          }
        } else {
          console.log(`Error: ${xhr.status}`);
        }
      }; 
  }
}
const peticion1 = new Peticions()
function iniciar(){
    setTimeout(cargarlo, 1000)
}
function buyNow(){
  let userios=document.getElementById("userios")
  if(userios.value==0){
    location.href="signIn.html"
  }else{
    setCookies("buyNow", productio[0].idProduct)
    location.href="./buy.html"
  }
}
let getCookies = name => {
  let nameEQ = name + "=";
  let ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};
const descProduct = getCookies("descProduct");
function cargarlo(){
    const body = JSON.stringify({idProduct: descProduct})
    peticion1.reqRes("POST", "./desc", body)
}
function obtenerOfertas(){
  peticion1.reqRes("GET", "./showOfers")
}
function upHistorial(dato){
    let userios=document.getElementById("userios")
    if(userios.value!=0){
      const body = JSON.stringify({idUser: userios.value, idProduct: dato})
      peticion1.reqRes("POST", "./history", body)
    }
}
function cargarInfoUserVendedor(datos, product){
  const body = JSON.stringify({data:datos})
  peticion1.reqRes("POST", "./descVendedor", body)
}
function cargarInfo(){
  let data=productio
    let categorias
    switch (parseInt(data[0].categoria)){
      case 1:
        categorias="Camperas"
        break;
      case 2:
        categorias="Remeras"
        break;
      case 3:
        categorias="Pantalones"
        break;
      case 4:
        categorias="Calzados"
        break;
      case 5:
        categorias="Medias"
        break;
      case 6:
        categorias="Accesorios"
        break;
    }
    let estatus 
    if(data[0].estado==0){
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
        <section id="desc">
            <section class="box">
              <output>Categorias/${categorias}</output>
              <button id="btn-fav" onclick="fav()">🤍</button>
            </section>
            <output>${estatus}</output>
            <h2 id="pausa"></h2>
            <h2 id="hh">${data[0].name}</h2>
        </section>
        <section id="pay">
            <output>${queda} ${data[0].cantidad} ${unidad}</output><br>
            <section class="box-price">
                    <output id="price${0}">$${data[0].price}</output>
                    ${oferta}
                    <output id="price-final${0}" class="price-final"></output>
            </section>
            <section id="box-cant">
                <output>Cantidad</output><br>
                <button id="less" onclick="less()" class="btn-ml">-</button>
                <output id="cantidades"></output>
                <button id="more" onclick="more()" class="btn-ml">+</button>
            </section>
            <button id="add-cart" onclick="addCart()">Añadir al Carrito</button>
            <button id="buy-now" onclick="buyNow()">Comprar Ahora</button>
        </section>
        <output id="text-desc">Descripción:</output><br>
        <output id="descripcion">${data[0].description}</output><br><br><br><br>
        <section id="userSell">
            <output id="nameUsu">Vendedor: ${usuarioVendedor[0]}</output><br>
            <output id="barrio">Localidad: ${usuarioVendedor[1]}</output><br>
        </section>
        <section id="msjs">
          <h2 id="h-msj">Preguntas</h2>
        </section>
    `
    modifyProductUser()
    msjs=document.getElementById("msjs")
    pedirMsjs()
    let cantidades= document.getElementById("cantidades")
    cantidades.value=1
    
    if(ofersYes==true && data[0].idOfer >=5){
      let priceFinal =document.getElementById("price-final"+0)
      let descuento 
      switch (data[0].idOfer){
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
      for (let index = 0; index < data[0].price.length; index++) {
          if(data[0].price.charAt(index) != '$' && data[0].price.charAt(index) != '.'){
              precio$=precio$+data[0].price.charAt(index)
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
      let price$ =document.getElementById("price"+0)
      price$.style.textDecorationLine= "line-through"
    }
    setTimeout(desplegarFavs,500)
}
function productActive(){
  if(productio[0].publicado==0){
    body.style.background="rgba(150,150,150)"
    let boxCant=document.getElementById("box-cant")
    let addCart=document.getElementById("add-cart")
    let butNow =document.getElementById("buy-now")
    let pausa= document.getElementById("pausa")
    boxCant.style.display="none"
    addCart.style.display="none"
    butNow.style.display="none"
    msjs.style.display="none"
    pausa.innerHTML="En Pausa"
    pausa.style.color="red"
    pausa.style.background="white"
    pausa.style.textAlign="center"
    pausa.style.marginRight="1vw"
  }
}
function modifyProductUser(){
  let userios=document.getElementById("userios")
  if (productio[0].idUser==userios.value){
      let add = document.getElementById("add-cart")
      let buy = document.getElementById("buy-now")
      let boxCant =document.getElementById("box-cant")
      let cant = document.getElementById("cantidades")
      add.style.display="none"
      buy.style.display="none"
      boxCant.style.display="none"
      cant.style.display="none"
  }
}
function addCart(){
  let userios=document.getElementById("userios")
    if(userios.value==0){
        location.href="./signIn.html"
    }else{
        let cart
        verCart(cart)
    }
} 
function verCart(cart){
  const body = JSON.stringify({idUser: userios.value})
  peticion1.reqRes("POST", "./cantCart", body, cart)
}
function comparar(cart){
  let par=false
  if(cart.length!=0){
      let max=cart.length-1
      for (let index = 0; index < cart.length; index++) {
          if(cart[index].idProduct == productio[0].idProduct){
              upCart(cart[index])
              par=true
          }
          if(index==max && par==false){
              newAdd()
          }
      }
  }else{
      newAdd()
  }
}
function upCart(article){
  let cant = document.getElementById("cantidades")
  article.cantidad = parseInt(article.cantidad)+parseInt(cant.value)
  if(article.cantidad>productio[0].cantidad){
      article.cantidad=productio[0].cantidad
  }
  let userios=document.getElementById("userios")
  const body = JSON.stringify({idUser: userios.value, idProduct: productio[0].idProduct, cantidad: article.cantidad})
  peticion1.reqRes("POST", "./upCart", body)
}
function newAdd(){
  let userios=document.getElementById("userios")
  let cant = document.getElementById("cantidades")
  const body = JSON.stringify({idUser: userios.value, idProduct: productio[0].idProduct, cantidad: cant.value})
  peticion1.reqRes("POST", "./postCart", body)
  let cantCart = document.getElementById("cant-cart")
  let newNum=parseInt(cantCart.value)+1
  cantCart.value=newNum
}
function desplegarFavs(){
  let userios=document.getElementById("userios")
  const body = JSON.stringify({idUser: userios.value})
  peticion1.reqRes("POST", "./showFavs", body)
}
function modifyFav(data){
  if(data[0]!=undefined){
      for(let i=0; i<productio.length;i++){
          for (let index = 0; index < data.length; index++) {
              if(data[index].idProduct==productio[i].idProduct){
                  let favi = document.getElementById("btn-fav")
                  favi.style.background="red"
                  favi.innerHTML="💛"
              }
              
          }
      }
  }
}
function fav(){
  let favorite = document.getElementById("btn-fav")
  if(favorite.style.background=='red'){
      favorite.innerHTML="🤍"
      favorite.style.background="white"
      favNew()
  }else{
      favorite.innerHTML="💛"
      favorite.style.background="red"
      favNew()
  }
}
function favNew(){
  let userios=document.getElementById("userios")
  const body = JSON.stringify({idProduct: productio[0].idProduct, idUser: userios.value})
  peticion1.reqRes("POST", "./fav", body)
}
function pedirMsjs(){
  const body = JSON.stringify({
    idProduct: productio[0].idProduct,
    idUser: productio[0].idUser
  })
  peticion1.reqRes("POST", "./msjs", body)
}
function showMsjs(data){
  for (let i =  0; i < data.length; i++) {
    if(data[i].idDestinatario==productio[0].idUser && data[i].idUser!=0){
      let miquest$
      let sino
      let userios= document.getElementById("userios")
      if(data[i].idUser == userios.value && data[i].destinatario != userios.value){
        miquest$=`
          <output class="misPreguntas">Mi pregunta:</output>
        `
        sino=true
      }else{
        miquest$="Pregunta:"
      }
      msjs.innerHTML+=`
      <section id="msj${i}" class="msj">
        <output id="fechaMsj${i}">${data[i].fecha}</output><br><br>
        ${miquest$} <br>
        <output id="mensaje">${data[i].mensaje}</output>
      </section>
      `
      if(sino==true){
        let msj = document.getElementById("msj"+i)
        msj.style.background="#a3a800"
        msj.style.borderBottomLeftRadius="20px"
        msj.style.borderTopLeftRadius="20px"
        msj.style.borderTopRightRadius="20px"
      }else{
        let msj = document.getElementById("msj"+i)
        msj.style.background="#ffff6e"
        msj.style.borderBottomLeftRadius="20px"
        msj.style.borderTopLeftRadius="20px"
        msj.style.borderTopRightRadius="20px"
      }
      if(data[i].idRespuesta!=0){
        for (let index =  0; index < data.length; index++) {
          if(data[i].idRespuesta==data[index].idMensaje){
            msjs.innerHTML+=`
            <section id="msj${index}" class="msj">
              <output id="fechaMsj${index}">${data[index].fecha}</output><br><br>
              <output>Respuesta:</output><br>
              <output id="mensaje">${data[index].mensaje}</output>
            </section>
            `
            let msj = document.getElementById("msj"+index)
            msj.style.background="#6d6dff"
            msj.style.borderBottomLeftRadius="20px"
            msj.style.borderBottomRightRadius="20px"
            msj.style.borderTopRightRadius="20px"
          }
        }
      }
    }
  }
  let userios = document.getElementById("userios")
  if(userios.value != productio[0].idUser){
    msjs.innerHTML+=`
    <h2 id="h-msj">Haz una pregunta</h2>
    <output id="alert-msj">* Debe escribir su pregunta</output>
    <section id="youQuest">
      <input type="text" name="yourQuest" id="yourQuest" placeholder="Escriba su pregunta">
      <button id="btn-youQuest" onclick="youQuest()">Enviar</button>
    </section>
  `
  productActive()
  alertMsj = document.getElementById("alert-msj")
  alertMsj.style.display="none"
  }
}
let newFecha=""
function youQuest(){
  if(userios.value==0){
    location.href="signIn.html"
  }else{
    let fecha = new Date()
    let mes = fecha.getMonth()+1
    if(mes<10){
      mes=""+0+""+mes
    }
    newFecha = fecha.getDate() +"/"+ mes +"/"+ fecha.getFullYear()
    setTimeout(subirMsj, 500)
  }
}
function subirMsj(){
  let destinatario = productio[0].idUser
  let userios = document.getElementById("userios")
  let yourQuest = document.getElementById("yourQuest")
  if(yourQuest.value==''){
    alertMsj.style.display="flex"
  }else{
    const body = JSON.stringify({
      idProduct: productio[0].idProduct,
      idUser: userios.value,
      idDestinatario: destinatario,
      mensaje: yourQuest.value,
      fecha: newFecha,
      idRespuesta:0
    })
    peticion1.reqRes("POST", "./sendmsj",body)
    location.reload()
  }
}
function less(){
    let cantidades= document.getElementById("cantidades")
    if(cantidades.value>1){
        cantidades.value=parseInt(cantidades.value)-1
    }
}
function more(){
    let cantidades= document.getElementById("cantidades")
    if(cantidades.value<cant){
        cantidades.value=parseInt(cantidades.value)+1
    }
}
window.addEventListener("load", iniciar)