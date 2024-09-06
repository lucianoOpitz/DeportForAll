const domProductos= document.getElementById("my-products")
let arrayMisProductos=[]
let identificadorUser
let ofer$
let boxDelete   
class MyProductos{
    constructor(name, cantidad, description, estado, publicado, categoria, price){
        this.name = name
        this.cantidad = cantidad
        this.description = description
        this.estado = estado
        this.publicado = publicado
        this.categoria = categoria
        this.price = price
    }
    postProductos(){
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "./misproductos");
        xhr.setRequestHeader("Content-Type", "application/json");
        let userios=document.getElementById("userios")
        const body = JSON.stringify({usuarioId: userios.value})
        xhr.onload = () => {
          if (xhr.readyState == 4 && xhr.status == 200) {
            arrayMisProductos=JSON.parse(xhr.responseText)
            mostrar()
          } else {
            console.log(`Error: ${xhr.status}`);
          }
        };
        xhr.send(body);
    }
    setMostrarObjetos(){
        for(let i=arrayMisProductos.length-1;i>=0;i--){
          let categorias
          let estatus
          let siNoPublicado
          if (arrayMisProductos[i].estado==1){
              estatus = "Nuevo"
          }else{
              estatus = "Usado"
          }
          switch (parseInt(arrayMisProductos[i].categoria)){
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
          if(arrayMisProductos[i].publicado==1){
              siNoPublicado="Publicado"
          }else{
              siNoPublicado="En Pausa"
          }
          domProductos.innerHTML += `
            <section class="redirect">
              <section class="caja-title">
                Titulo:
                <output type="text" name="nameProducto${i}" id="nameProducto${i}">${arrayMisProductos[i].name}</output><br>
                <input class="inputs" type="text" name="nombreProducto${i}" id="nombresProducto${i}" placeholder="Escriba el nuevo titulo">
              </section>
              <section class="caja-estatus">
                Estado:
                <output type="text" name="estatus" id="estatus${i}">${estatus}</output>
                <section class="btn-estatus" id="btn-estatus${i}">
                  Cambiar el Estado:
                  <button onclick="estateChange(${i}, 'green', 'white')" id="new${i}">Nuevo</button>
                  <button onclick="estateChange(${i}, 'white', 'green')" id="used${i}">Usado</button>
                </section>
              </section>
              <section class="caja-cantidad">
                Cantidad:
                <output type="text" name="cantidad${i}" id="cantidad${i}">${arrayMisProductos[i].cantidad}</output>
                <section class="cambiar-cantidad">
                  <input class="inputs" type="text" name="change-cantidad${i}" id="changes-cantidad${i}" placeholder="Escriba la nueva cantidad">
                </section>
              </section>
              <section class="caja-description">
                <output type="text" name="description${i}" id="description${i}">${arrayMisProductos[i].description}</output><br>
                <input class="inputs" type="text" name="change-description${i}" id="changes-description${i}" placeholder="Escriba la nueva descripción">
              </section>
              <section class="caja-publicado">
                <output type="text" name="estadoPublicacion${i}" id="publicado${i}">${siNoPublicado}</output>
                <section class="btn-publicado" id="btn-publicado${i}">
                  Cambiar Estado:
                  <button onclick="published(${i}, 'green', 'white')" id="public${i}">Publicado</button>
                  <button onclick="published(${i}, 'white', 'green')" id="not-public${i}">En Pausa</button>
                </section>
              </section>
              <section class="caja-price">
                Precio:
                <output type="text" id="precio${i}">$${arrayMisProductos[i].price}</output><br>
                <input class="inputs" type="text" name="new-price${i}" id="new-price${i}" placeholder="Escriba el nuevo precio sin signos, sin puntos, sin comas">
              </section>
              <section class="caja-category">
                Categoria:
                <output type="text" id="category${i}">${categorias}</output><br>
                <section id="modify-category${i}">
                  Elija la nueva Categoria:
                  <section class="box-category">
                    <button onclick="cate(${i}, 1)" id="cat1${i}">Vehiculos</button><br>
                    <button onclick="cate(${i}, 2)" id="cat2${i}">Inmuebles</button><br>
                    <button onclick="cate(${i}, 3)" id="cat3${i}">Tecnología</button><br>
                    <button onclick="cate(${i}, 4)" id="cat4${i}">Hogar y Muebles</button><br>
                    <button onclick="cate(${i}, 5)" id="cat5${i}">Electrodomésticos</button><br>
                    <button onclick="cate(${i}, 6)" id="cat6${i}">Herramientas</button><br>
                    <button onclick="cate(${i}, 7)" id="cat7${i}">Construcción</button><br>
                    <button onclick="cate(${i}, 8)" id="cat8${i}">Deportes y Fitness</button><br>
                  </section>
                </section>
              </section>
              <section class="box-ofers" id="box-ofer${i}">
                <button class="ofers" id="ofer-1${i}" onclick="ofer(${i}, 1)">Sin Oferta</button>
                <button class="ofers" id="ofer-2${i}" onclick="ofer(${i}, 2)">3 cuotas sin interes</button>
                <button class="ofers" id="ofer-3${i}" onclick="ofer(${i}, 3)">6 cuotas sin interes</button>
                <button class="ofers" id="ofer-4${i}" onclick="ofer(${i}, 4)">12 cuotas sin interes</button>
                <button class="ofers" id="ofer-5${i}" onclick="ofer(${i}, 5)">10% de desc.</button>
                <button class="ofers" id="ofer-6${i}" onclick="ofer(${i}, 6)">30% de desc.</button>
                <button class="ofers" id="ofer-7${i}" onclick="ofer(${i}, 7)">50% de desc.</button>
              </section>
              <section class="caja-btn-mod">
                <button onclick="modify(${i})" class="btn-mod" id="modify${i}">Modificar</button>
                <button onclick="deletes(${i})" class="btn-del" id="deletes${i}">Eliminar</button>
                <button onclick="cancel(${i})" class="btn-can" id="cancel${i}">Cancelar</button>
                <button onclick="save(${i})" class="btn-save"id="save${i}">Guardar</button>
              </section>
              <section class="sure" id="box-del${i}">
                <output>¿Esta seguro que desea Eliminar?</output>
                <section class="btn-ac-del">
                  <button onclick="cancelDel(${i})" id="delete-cancel${i}" class="del-cancel">Cancelar</button>
                  <button onclick="delFin(${i})" id="delete-fin${i}" class="del-fin">Eliminar</button>
                </section>
              </section>
            </section>
          ` 
          ofer$=arrayMisProductos[i].idOfer
          noneFlex(i, "block","block", "none", "none", "none","none")
          noneFlexChange(i, "none")
          cambiarEstado(i)
          cambiarCategory(i)
          cambiarOferta(i)
        }
    }
}
let pila = new MyProductos()
function delFin(num){
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "./DelProduct");
  xhr.setRequestHeader("Content-Type", "application/json");
  const body = JSON.stringify({
      idProduct: arrayMisProductos[num].idProduct
  });
  xhr.onload = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
      console.log(JSON.parse(xhr.responseText));
    } else {
      console.log(`Error: ${xhr.status}`);
    }
  };
  setTimeout(recargarPag,1000)
  xhr.send(body);
}
function recargarPag(){
  location.reload()
}
function cancelDel(num){
  noneFlex(num, "block","block", "none", "none", "none","none")
}
function deletes(num){
  noneFlex(num , "none","none", "none", "none", "none","flex")
}
function ofer(num, oferta){
  ofer$=oferta
  for (let index = 1; index <= 7; index++) {
    let ofertas = document.getElementById("ofer-"+index+""+num)
    if(index==oferta){
      ofertas.style.background="green"
    }else{
      ofertas.style.background="white"
    }
    
  }
}
function cate(num, catego){
  for(i=0;i<8;i++){
    let e=i+1
    let domCategory = document.getElementById("cat"+e+num)
    if(catego==e){
      domCategory.style.background="green"
    }else{
      domCategory.style.background="white"
    }
  }
}
function cambiarOferta(num){
  for(i=1;i<=7;i++){
    let e=i
    let domCategory = document.getElementById("ofer-"+e+""+num)
    if(arrayMisProductos[num].idOfer==e){
      domCategory.style.background="green"
    }else{
      domCategory.style.background="white"
    }
  }
}
function cambiarCategory(num){
  for(i=0;i<8;i++){
    let e=i+1
    let domCategory = document.getElementById("cat"+e+num)
    if(arrayMisProductos[num].categoria==e){
      domCategory.style.background="green"
    }else{
      domCategory.style.background="white"
    }
  }
}
function published(num, color, color1){
  let public =document.getElementById("public"+num)
  let notPublic =document.getElementById("not-public"+num)
  public.style.background=color
  notPublic.style.background=color1
}
function estateChange(num, color,color1){
  let newes= document.getElementById("new"+num)
  let used= document.getElementById("used"+num)
  newes.style.background=color
  used.style.background=color1
}
function cambiarEstado(num){
  let publicado = document.getElementById("publicado"+num)
  let estatus = document.getElementById("estatus"+num)
  let public =document.getElementById("public"+num)
  let notPublic =document.getElementById("not-public"+num)
  let newes =document.getElementById("new"+num)
  let used =document.getElementById("used"+num)
  if(publicado.value=='Publicado'){
    public.style.background="green"
    notPublic.style.background="white"
  }else{
    public.style.background="white"
    notPublic.style.background="green"
  }
  if(estatus.value=='Usado'){
    newes.style.background="white"
    used.style.background="green"
  }
  else{
    newes.style.background="green"
    used.style.background="white"
  }
}
function noneFlexChange(num, noneOrBlock){
  let titulo = document.getElementById("nombresProducto"+num)
  let estado = document.getElementById("btn-estatus"+num)
  let cantiad = document.getElementById("changes-cantidad"+num)
  let descipciones = document.getElementById("changes-description"+num)
  let publicados = document.getElementById("btn-publicado"+num)
  let precios = document.getElementById("new-price"+num)
  let cate=document.getElementById("modify-category"+num)
  titulo.style.display=noneOrBlock
  estado.style.display=noneOrBlock
  cantiad.style.display=noneOrBlock
  descipciones.style.display=noneOrBlock
  publicados.style.display=noneOrBlock
  precios.style.display=noneOrBlock
  cate.style.display=noneOrBlock
}
function modify(num){
  noneFlex(num , "none","none", "block", "block", "flex","none")
  noneFlexChange(num, "block")
}
function cancel(num){
  noneFlex(num, "block","block", "none", "none", "none", "none")
  noneFlexChange(num, "none")
}
function save(num){
  let tit, estate, cant,desc,public,precio, categories
  let titulo = document.getElementById("nombresProducto"+num)
  let estado = document.getElementById("new"+num)
  let cantiad = document.getElementById("changes-cantidad"+num)
  let descipciones = document.getElementById("changes-description"+num)
  let publicados = document.getElementById("public"+num)
  let precios = document.getElementById("new-price"+num)

  for(i=0;i<8;i++){
    let e=i+1
    let domCategory = document.getElementById("cat"+e+num)
    if(domCategory.style.background=='green'){
      categories=e
    }
  }
  if(titulo.value==""){
    let title = document.getElementById("nameProducto"+num)
    tit=title.value
  }else{
    tit=titulo.value
  }
  if(estado.style.background!="green"){
    estate=0
  }else{
    estate=1
  }
  if(cantiad.value==""){
    let cantidad = document.getElementById("cantidad"+num)
    cant=cantidad.value
  }else{
    cant=cantiad.value
  }
  if(descipciones.value==""){
    let descripcion =document.getElementById("description"+num)
    desc=descripcion.value
  }else{
    desc=descipciones.value
  }
  if(publicados.style.background!="green"){
    public=0
  }else{
    public=1
  }
  if(precios.value==""){
    let valor = document.getElementById("precio"+num)
    precio=valor.value
    precio=precio.slice(1)
    let precioModify=""
    for (let index = 0; index < precio.length; index++) {
      if(precio.charAt(index)!='.'){
        precioModify=precioModify+precio.charAt(index)
      }
    }
    precio=precioModify
  }else{
    precio=precios.value
  }
  for (let index = 1; index <= 7; index++) {
    let ofertas = document.getElementById("ofer-"+index+""+num)
    if(ofertas.style.background=='green'){
      ofer$=index
    }
  }
   const xhr = new XMLHttpRequest();
    xhr.open("POST", "./modifyProduct");
    xhr.setRequestHeader("Content-Type", "application/json");
    let userios=document.getElementById("userios")
    const body = JSON.stringify({
      idProduct: arrayMisProductos[num].idProduct,
      name: tit,
      cantidad: cant,
      description: desc,
      estado: estate,
      publicado: public,
      categoria: categories,
      idUser: userios.value,
      price: precio,
      idOfer: ofer$
    })
    xhr.send(body);
    xhr.onload = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        const data = JSON.parse(xhr.responseText);
      } else {
        console.log(`Error: ${xhr.status}`);
      }
    }; 
    location.reload() 
}
function noneFlex(num, mod, del,can, sav, oferta, bxDel){
  let dele = document.getElementById("deletes"+num)
  boxDelete=document.getElementById("box-del"+num)
  let modify = document.getElementById("modify"+num)
  let cancel = document.getElementById("cancel"+num)
  let save = document.getElementById("save"+num)
  let ofer =document.getElementById("box-ofer"+num)
  dele.style.display=del
  modify.style.display=mod
  cancel.style.display=can
  save.style.display=sav
  ofer.style.display=oferta
  boxDelete.style.display=bxDel
}
function mostrar(){
  pila.setMostrarObjetos()
}
function iniciar(){
    setTimeout(pila.postProductos,500)
}
window.addEventListener("load", iniciar)