
let setCookie = (name, value, days) => {
    let expires = "";
    if (days) {
      let date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}; 
let getCookie = name => {
    let nameEQ = name + "=";
    let ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    setCookie("userBUYSELL", Math.random(), 30);
    return null;
};
const userBUYSELL = getCookie("userBUYSELL");
function domHtml(valor){
    return document.getElementById(valor)
}
let header = domHtml("cabeza")
const footer = domHtml("foter")
const subCabeza = domHtml("sub-cabeza")
const subCabeza2 = domHtml("sub-cabeza2")
const subCabeza3 = domHtml("sub-cabeza3")
let boxNewDir
let log=""
let dir=[]
let ipUsers
let alertDir
class HeadFooter{
    constructor(idUser, usuario, ubi){
        this.idUser=idUser
        this.user=usuario
        this.ubi=ubi
        this.cambiarUbi()
    }
    cambiarUbi(){
        this.ubi=""
    }
    comprobar(){
        ipUsers=userBUYSELL
        const body = JSON.stringify({name:1, ok:userBUYSELL});
        peticion.setPeticion("./comprobarIp", body)
    }
    functionHeader(){
        let vender=""
        if(this.user!=undefined){
            if(this.user.idUser==1){vender=`
                    <a class="dinamic" href="published.html" id="publisheds"><h5>Vender</h5></a>
                `   
            }
        }
        header.innerHTML = `
        <section id="firstHeader">
            <a href="./index.html" id="logo-home" class="modify-a">
                <img src="./image/logo.png" alt="logo" id="logo-header">
                <h1>DeportsForAlls</h1>
            </a>
            <button id="logo-point" onclick="showDire()">
                <img src="./image/point.png" alt="logo" id="logo-ubi">
                <h4>Enviar a</h4>
                <h7 id="loc">${this.ubi}</h7>
            </button>
        </section>
        <section id="secondHeader">
            <section id="menu-dinamico">
                <button class="dinamic" id="categories" onclick="categories()">Categorias
                    <img src="./image/desplegar.png" alt="logo" class="desplegar">
                </button>
                <a class="dinamic" href="ofers.html"><h5>Ofertas</h5></a>
                <a class="dinamic" href="history.html"><h5>Historial</h5></a>
                ${vender}
            </section>
        </section>
        `
        if(log!='abc'){
            header.innerHTML += `
            <section id="threeHeader">
                <a href="./log.html" id="log" class="modify-a">
                    <h4 id="log-one">Creá tu cuenta</h4>
                </a>
                <a href="./signIn.html" id="sign" class="modify-a">
                    <h4 id="sign">Ingresar</h4>
                </a>
            </section>
            `
        }else{
            header.innerHTML +=`
            <section id="usuario-registrado">
                <h3 id="hello">Hola ${this.user.name}!</h3>
                <section id="box-user">
                    <a href="./notifications.html" id="notify" class="modify-a">
                        <output id="cant-notify"></output>
                        <img src="./image/notify.png" alt="logo" class="firstLogs">
                    </a>
                    <a href="./favorits.html" id="favorite" class="modify-a">
                        <img src="./image/favorit.png" alt="logo" class="firstLog">
                    </a>
                    <a href="./cart.html" id="cart" class="modify-a">
                        <output id="cant-cart"></output>
                        <img src="./image/cart.png" alt="logo" class="firstLogs">
                    </a>
                    <button id="user" class="modify-a" onclick="menuUser()">
                        <img src="./image/user.png" alt="logo" class="firstLog">
                    </button>
                </section>
            </section>
            `
            if(this.idUser!=undefined){
                if(this.idUser==1){
                    let logoPoint=document.getElementById("logo-point")
                    logoPoint.style.display="none"
                    let cart=document.getElementById("cart")
                    cart.style.display="none"
                }
            }
            this.showNotifys()
            if(this.user!=undefined){
                if(this.user.idUser!=1){
                    this.showCart()
                }
            }
        }
    }
    direcciones(){
        const body = JSON.stringify({idUser: this.idUser})
        peticion.setPeticion("./address", body)
    }
    showCart(){
        const body = JSON.stringify({idUser: this.idUser})
        peticion.setPeticion("./cantCart",body)
    }
    showNotifys(){
        const body = JSON.stringify({idDestinatario: this.idUser})
        peticion.setPeticion("./showmsj", body)
    }
    subCabezaUser(){
        subCabeza.innerHTML=`
            <section id="user-main">
                <a href="./user.html" id="myuser" class="modify-a">
                    <h5 class="h-burger">Mi Cuenta</h5>
                </a>
                <a href="./mysolds.html" id="mysolds" class="modify-a">
                    <h5 class="h-burger">Mis Ventas</h5>
                </a>
                <a href="./mybuys.html" id="mybuys" class="modify-a">
                    <h5 class="h-burger">Mis Compras</h5>
                </a>
                <a href="./edit.html" id="sellings" class="modify-a">
                    <h5 class="h-burger">Publicaciones</h5>
                </a>
                <button id="closes" onclick="closed()">Cerrar Sesión</button>
            </section>
        `
        let categorys = ["Camperas", "Remeras", "Pantalones", "Calzado", "Medias", "Accesorios"]
        subCabeza2.innerHTML=`<section id="categories-main"></section>`
        let categoMain=domHtml("categories-main")
        for (let index = 0; index < categorys.length; index++) {
            let i=index+1
            categoMain.innerHTML+=`
                <section class="modify-a">
                    <button id="category${i}" onclick="catego(${i})" class="categoria"><h5 class="h-burger">${categorys[index]}</h5></button>
                </section>
            `
        }
        subCabeza.style.display="none"
        subCabeza2.style.display="none"
        subCabeza3.innerHTML=`<h5>Enviar a</h5>`
        verificarUsuario()
        for (let index = 0; index < dir.length; index++) {
            subCabeza3.innerHTML+=`
            <section class="box-dir">
                <button id="name-dir${index}" onclick="changeDir(${index})" class="name-dir">${dir[index].direccion}</button>
                <button id="del-dir${index}" onclick="delDir(${index})" class="del-dir">Eliminar</button>
            </section>
            `
        }
        if(dir.length < 5 && userios.value!=0){
            subCabeza3.innerHTML+=`
            <section id="box-dir">
                <section id="box-new-dir">
                    <input id="new-address" name="new-address" placeholder="Escriba la nueva Dirección">
                    <button id="btn-accion" onclick="addDire()">Añadir</button>
                </section>
                <output id="alert-dir">*Introduzca la Dirección</output>
                <section id="more-dir">
                    <button id="btn-add" onclick="moreDire()">Nueva Dirección</button>
                    <button id="btn-more" onclick="moreDire()">+</button>
                </section>
            </section>
            `
            alertDir=domHtml("alert-dir")
            alertDir.style.display="none"
            boxNewDir=domHtml("box-new-dir")
            boxNewDir.style.display="none"
        }
        subCabeza3.style.display="none"
        subCabeza2.style.background= "#d8d8d8";
        subCabeza3.style.background= "#d8d8d8";
    }
}
class Peticiones{
    getPeticion(url){
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.send();
        xhr.responseType = "json";
        xhr.onload = () => {
          if (xhr.readyState == 4 && xhr.status == 200) {
            const data = xhr.response;
            products=data
            obtenerOfertas(data)
          } else {
            console.log(`Error: ${xhr.status}`);
          }
        };
    }
    setPeticion(url, body){
        const xhr = new XMLHttpRequest();
        xhr.open("POST", url);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = () => {
          if (xhr.readyState == 4 && xhr.status == 200) {
            let data=JSON.parse(xhr.responseText);
            if(url=='./comprobarIp'){
                hF.user=data
                log="abc"
                hF.ubi=data.direccion
                let userios=domHtml("userios")
                userios.innerHTML=data.idUser
                hF.idUser=data.idUser
                hF.functionHeader()
                hF.direcciones()
            }
            if(url=='./address'){
                dir=JSON.parse(xhr.responseText);
            }
            if(url=='./cantCart'){  
                const data = JSON.parse(xhr.responseText);
                let cantCart=domHtml("cant-cart")
                cantCart.value=data.length
            }
            if(url=='./showmsj'){
                const data = JSON.parse(xhr.responseText);
                let cantNotify=domHtml("cant-notify")
                let contador=0
                for (let index = 0; index < data.length; index++) {
                    if(data[index].idRespuesta<data[index].idMensaje && data[index].idRespuesta!=0 && data[index].visto==0){
                        contador++
                    }else if(data[index].idRespuesta!=0){
                        undefined
                    }else if(data[index].idUser==0 && data[index].visto==1){
                        undefined
                    }else{
                        contador++
                    }
                }
                cantNotify.value=contador 
            }
          } else {
            console.log(`Error: ${xhr.status}`);
          }
        };
        xhr.send(body);
    }
}
document.addEventListener("keypress", e=>{
    let browse=domHtml("browse")
    if (e.key === 'Enter') {
        if(e.target.matches("#browse")){
            console.log(browse.value)
        }
    }
})
function verificarUsuario(){
    if(hF.user!=undefined){
        if(parseInt(hF.user.idUser)!=1){
            let mySolds=domHtml("mysolds")
            let sellings=domHtml("sellings")
            mySolds.style.display="none"
            sellings.style.display="none"
        }else{
            let myBuys=domHtml("mybuys")
            myBuys.style.display="none"
        }
    }
}
function browses(){
    let browse=domHtml("browse")
    console.log(browse.value)
}
const hF=new HeadFooter()
const peticion=new Peticiones()
function iniciar(){
    hF.comprobar()
    hF.functionHeader()
    setTimeout(hF.subCabezaUser,1000)
}
function showDire(){
    if(subCabeza3.style.display=='none' && hF.idUser!=0){
        subCabeza3.style.display="flex"
    }else{
        subCabeza3.style.display="none"
    }
    if(hF.idUser==0){
        location.href="./signIn.html"
    }
}
function moreDire(){
    boxNewDir.style.display="flex"
}
function addDire(){
    let newDireccion = domHtml("new-address")
    if(newDireccion.value==''){
        alertDir.style.display="flex"
    }else{
        const body = JSON.stringify({
            idUser: hF.idUser,
            direccion: newDireccion.value,
        })
        peticion.setPeticion("./newAddress", body)
        location.reload()
    }
}
function delDir(direABorrar){
    const body = JSON.stringify({idDireccion: dir[direABorrar].idDireccion, idUser: hF.idUser})
    peticion.setPeticion("./dirBorrar", body)
    location.reload() 
}
function changeDir(direNueva){
    const body = JSON.stringify({
        newDire: dir[direNueva].direccion, 
        idUser: userios.value, 
        dire: hF.user.direccion, 
        idDireccion: dir[direNueva].idDireccion,
        ipUser: ipUsers
    })
    peticion.setPeticion("./dirChange", body)
    location.reload() 
}
let setCookis = (name, value, days) => {
    let expires = "";
    if (days) {
      let date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
};
function catego(num){
    setCookis("categoriaView", num)
    location.href="./category.html"
}
function categories(){
    if(subCabeza2.style.display=='none'){
        subCabeza2.style.display='flex'
    }else{
        subCabeza2.style.display='none'
    }
}
function menuUser(){
    if(subCabeza.style.display=='none'){
        subCabeza.style.display='flex'
    }else{
        subCabeza.style.display='none'
    }
}
function closed(){
    const body = JSON.stringify({name:1, ok:hF.user});
    peticion.setPeticion("./closed", body)
    window.location.href = './index.html'
}
window.addEventListener("load",iniciar)