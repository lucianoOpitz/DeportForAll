const infoProduct=document.getElementById("info-product")
let userios
let mensajes=[]
let usuarioPregunta=[]
function iniciar(){
    setTimeout(pedirMsjs, 800)
}
function pedirMsjs(){
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "./showmsj");
    xhr.setRequestHeader("Content-Type", "application/json");
    userios=document.getElementById("userios")
    const body = JSON.stringify({
      idDestinatario: userios.value
    })
    xhr.send(body);
    xhr.onload = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        const data = JSON.parse(xhr.responseText);
        mensajes=data
        showMensajes(data)
      } else {
        console.log(`Error: ${xhr.status}`);
      }
    }; 
}
function showMensajes(data){
    infoProduct.innerHTML=`
        <h2>Notificaciones</h2>
    `
    for (let index = data.length-1; index >=0 ; index--) {
        productIs(data[index].idUser, data, index)
    }
}
function productIs(datos, arrayNotify, index){
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "./showProducto");
    xhr.setRequestHeader("Content-Type", "application/json");
    const body = JSON.stringify({
      idProduct: arrayNotify[index].idProduct,
    })
    xhr.send(body);
    xhr.onload = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        const data = JSON.parse(xhr.responseText);
        if(data.length!=0){
          sendedBy(datos, arrayNotify, index, data[0].name)
        }
      } else {
        console.log(`Error: ${xhr.status}`);
      }
    }; 
}
function sendedBy(datos, info, i, name){
  if(info[i].idUser!=0){
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "./showUser");
    xhr.setRequestHeader("Content-Type", "application/json");
    const body = JSON.stringify({
      usuarioId: datos,
    })
    xhr.send(body);
    xhr.onload = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        const data = JSON.parse(xhr.responseText);
        informacion(data[0].userName, info, i, name)
      } else {
        console.log(`Error: ${xhr.status}`);
      }
    };
  }else{
    informacion("", info, i, name)
  }
}
function informacion(data, info, index, namePro){
    let tipo
    if(info[index].idUser==0){
      if(info[index].visto!=1){  
        tipo="Respuesta"
        infoProduct.innerHTML+=`
        <section id="msj${index}" class="msjs">
            <section class="box-action">
                <button class="btn-desc" onclick="more(${index})"><h2 class="nameProduct">${namePro}</h2></button>
                <button class="btn-delete" onclick="del(${index})">Eliminar</button>
            </section>
            <output id="fechaEmitido">${info[index].fecha}</output><br>
            <output id="nameUser">${tipo} de buySale:</output>
            <output id="question">${info[index].mensaje}</output>
        </section>
        `
      }
    }else{
      if(info[index].idRespuesta<info[index].idMensaje && info[index].idRespuesta!=0){
          if(info[index].visto!=1){  
              tipo="Respuesta"
              infoProduct.innerHTML+=`
              <section id="msj${index}" class="msjs">
                  <section class="box-action">
                      <button class="btn-desc" onclick="more(${index})"><h2 class="nameProduct">${namePro}</h2></button>
                      <button class="btn-delete" onclick="del(${index})">Eliminar</button>
                  </section>
                  <output id="fechaEmitido">${info[index].fecha}</output><br>
                  <output id="nameUser">${tipo} de ${data}:</output>
                  <output id="question">${info[index].mensaje}</output>
              </section>
              `
          }
      }else if(info[index].idRespuesta!=0){
          tipo="Respuesta"
      }else{
          tipo="Pregunta"
          infoProduct.innerHTML+=`
          <section id="msj${index}" class="msjs">
              <button class="btn-desc" onclick="more(${index})"><h2 class="nameProduct">${namePro}</h2></button><br>
              <output id="fechaEmitido">${info[index].fecha}</output><br>
              <output id="nameUser">${tipo} de ${data}:</output>
              <output id="question">${info[index].mensaje}</output>
              <section class="box-responder">
                  <input class="responder" id="responder${index}" name="responder${index}" placeholder="Escriba su respuesta">
                  <button id="btn-responder${index}" onclick="responder(${index})" class="btn-responder">Responder</button>
              </section>
          </section>
          `
      }
    }
}
function del(num){
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "./upNotify");
    xhr.setRequestHeader("Content-Type", "application/json");
    const body = JSON.stringify({idMensaje: mensajes[num].idMensaje})
    xhr.send(body);
    xhr.onload = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        console.log(JSON.parse(xhr.responseText));
      } else {
        console.log(`Error: ${xhr.status}`);
      }
    };
    location.href="./notifications.html"
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
function more(num){
  if(mensajes[num].idUser==0){
    let msj=""
    for (let index = 0; index < 8; index++) {
      msj=msj+mensajes[num].mensaje.charAt(index)
    }
    if(msj=='Vendiste' || mensajes[num].idDestinatario==1){
      location.href="./mysolds.html"
    }else{
      location.href="./mybuys.html"
    }
  }else{
    setCookies("descProduct", mensajes[num].idProduct)
    location.href="./desc.html"
  }
}
function responder(num){
    let fecha = new Date()
    let mes = fecha.getMonth()+1
    if(mes<10){
      mes=""+0+""+mes
    }
    let newFecha = fecha.getDate() +"/"+ mes +"/"+ fecha.getFullYear()
    let responder$ = document.getElementById("responder"+num)
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "./sendmsj");
    xhr.setRequestHeader("Content-Type", "application/json");
    const body = JSON.stringify({
      idUser: userios.value,
      idProduct: mensajes[num].idProduct,
      idDestinatario: mensajes[num].idUser,
      mensaje: responder$.value,
      fecha: newFecha,
      idRespuesta: mensajes[num].idMensaje
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
window.addEventListener("load",iniciar)