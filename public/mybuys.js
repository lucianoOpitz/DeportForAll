const domCompras = document.getElementById("show-compras")
let setCookies = (name, value, days) => {
    let expires = "";
    if (days) {
      let date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}; 
let compras=[]
let vendedor
class Dom{
    cargar(){
        let userios=document.getElementById("userios")
        const body = JSON.stringify({idUser:parseInt(userios.value)})
        peticion1.reqRes("POST", "./showCompras", body)
    }
    cargarInfoUserVendedor(){
        for (let index = 0; index < compras.length; index++) {
            const body = JSON.stringify({data:compras[index].idVendedor})
            peticion1.reqRes("POST", "./descVendedor", body, index)
        }
    }
    cargarDom(vendedor, i){
        let estado=""
        if(compras[i].estado==1){
            estado="Entregado"
        }else{
            estado="Pendiente de entrega"
        }
        domCompras.innerHTML+=`
            <section id="buy${i}" class="productos">
                <button onclick="more(${i})" id="title"><h2>${compras[i].nameProduct}</h2></button>
                <section class="desc">
                    <output>Estado: ${estado}</output>
                    <output>Vendedor: ${vendedor[0]}</output>
                    <output>Cantidad: ${compras[i].cantidad}</output>
                    <output>Precio: $${compras[i].precio}</output>
                    <button id="chat" onclick="chatear(${i})">Comunicarse</button>
                </section>
            </section>
        `
    }
}
const pila = new Dom()
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
                if(url=='./showCompras'){
                    compras=data
                    pila.cargarInfoUserVendedor()
                }
                if(url=='./descVendedor'){
                    vendedor=data
                    pila.cargarDom(vendedor,num)
                } 
            }else{
                const data = xhr.response;
            }
          } else {
            console.log(`Error: ${xhr.status}`);
          }
        }; 
    }
}
const peticion1=new Peticions()
function iniciar(){
    setTimeout(pila.cargar, 1000)
}
function chatear(num){
    setCookies("myBuy", compras[num].idCompra);
    location.href="./mybuySell.html"
}
window.addEventListener("load", iniciar)