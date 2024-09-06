const formulario = document.getElementById("formulario")
let userios=document.getElementById("userios")
let nuevo 
let usado 
let cantidad
let descripcion
let nombre
let estadoProducto
let numeroCategoria
let identificadorUser
let price
let alertName
let alertPrice
let alertCategoria
function iniciar(){
    setTimeout(cargarForm,1000)
}
function cargarForm(){
    if(userios.value==0){
        location.href="./signIn.html"
    }else{
        formulario.innerHTML=`
                <section class="form-caj">
                    <label for="names">Nombre del Producto</label> 
                    <input type="text" name="names" id="names" placeholder="Escribalo aqui">
                    <output id="alert-name" class="alert-red">* Introduzca un Titulo</output><br><br>
                    <label for="cantidad">Cantidad</label> 
                    <input type="text" name="cantidad" id="cantidad" placeholder="cant de unidades"><br><br>
                    <label for="description">Descripción de tu producto</label> 
                    <input type="text" name="description" id="description" placeholder="Escribalo aqui"><br><br>
                    Cual es el estado de tu producto?
                    <button class="estatus" id="new" onclick="estatus(1)">Nuevo</button>
                    <button class="estatus" id="used" onclick="estatus(0)">Usado</button>
                    <output id="alert-estatus" class="alert-red">* Elija el estado de su producto</output><br><br><br><br>
                    En que categoria se ubica?
                    <button class="estatus" onclick="category(1)" id="num-cat1">Camperas</button>
                    <button class="estatus" onclick="category(2)" id="num-cat2">Remeras</button>
                    <button class="estatus" onclick="category(3)" id="num-cat3">Pantalones</button>
                    <button class="estatus" onclick="category(4)" id="num-cat4">Calzado</button>
                    <button class="estatus" onclick="category(5)" id="num-cat5">Medias</button>
                    <button class="estatus" onclick="category(6)" id="num-cat6">Accesorios</button>
                    <output id="alert-categoria" class="alert-red">* Introduzca una Categoria</output><br><br>
                    <label for="price">Precio</label> 
                    <input type="text" name="price" id="price" placeholder="Escriba el precio">
                    <output id="alert-price" class="alert-red">* Introduzca un Precio</output>
                </section>
                <button id="publicar" onclick="pushed()">Publicar</button>
        `
        $fileInput1=document.getElementById("fileInput1")
        alertCategoria=document.getElementById("alert-categoria")
        alertCategoria.style.display="none"
        alertEstado=document.getElementById("alert-estatus")
        alertEstado.style.display="none"
        alertName = document.getElementById("alert-name")
        alertName.style.display="none"
        alertPrice = document.getElementById("alert-price")
        alertPrice.style.display="none"
        nuevo = document.getElementById("new")
        usado = document.getElementById("used")
        descripcion = document.getElementById("description")
        nombre = document.getElementById("names")
        price = document.getElementById("price")
        cantidad =document.getElementById("cantidad")
    }
}
function estatus(num){
    if(num==1){
        estadoProducto=1
        nuevo.style.background="green"
        nuevo.style.color="white"
        usado.style.background="white"
        usado.style.color="black"
    }else if(num==0){
        estadoProducto=0
        nuevo.style.background="white"
        nuevo.style.color="black"
        usado.style.background="green"
        usado.style.color="white"
    }
}
function category(num){
    for(let i=1;i<=6;i++){
        let numCat=document.getElementById("num-cat"+i)
        if(i==num){
            numCat.style.background="green"
            numCat.style.color="white"
            numeroCategoria=num
        }else{
            numCat.style.background="white"
            numCat.style.color="black"
        }
    }
}
const esLetra = (caracter) => {
	let ascii = caracter.toUpperCase().charCodeAt(0);
	return ascii > 64 && ascii < 91;
};
function pushed(){
    if(cantidad.value==''){
        cantidad.value=1
    }
    if(nombre.value == ''){
        alertName.style.display="block"
    }else if(nuevo.style.background=='' && usado.style.background==''){
        alertEstado.style.display="block"
    }else if(numeroCategoria==undefined){
        alertCategoria.style.display="block"
    }else if(price.value==''){
        alertPrice.style.display="block"
    }else{
        let precio=price.value.toString()
        let precio$=""
        for (let index = 0; index < precio.length; index++) {
            if(precio.charAt(index)!='$' && precio.charAt(index)!='.'){
                if(esLetra(precio.charAt(index))==false){
                    precio$=precio$+precio.charAt(index)
                }
            }
        }
        console.log(parseInt(precio$))
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "./publicarProducto");
        xhr.setRequestHeader("Content-Type", "application/json");
        const body = JSON.stringify({
            name: nombre.value,
            cantidad: cantidad.value,
            description: descripcion.value,
            estado: estadoProducto,
            publicado: 1,
            categoria: numeroCategoria,
            idUser: userios.value,
            price: precio$
        });
        xhr.onload = () => {
          if (xhr.readyState == 4 && xhr.status == 200) {
            console.log(JSON.parse(xhr.responseText));
          } else {
            console.log(`Error: ${xhr.status}`);
          }
        };
        xhr.send(body);  
        location.href="./edit.html" 
    }
}
window.addEventListener("load",iniciar)