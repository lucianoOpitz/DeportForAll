const dom = document.getElementById("show-compra-venta")
let msjs
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
const myBuySell = getCookies("myBuy");
class Mdom{
    constructor(compra, vendedor, comprador){
        this.compra=compra
        this.vendedor=vendedor
        this.comprador=comprador
    }
    setCompra(data){
        this.compra=data[0]
        pila.cargarVendedor()
    }
    setVendedor(data){
        this.vendedor=data
        pila.cargarComprador()
    }
    setComprador(data){
        this.comprador=data
        pila.cargarDom()
    }
    cargarCompra(){
        const body=JSON.stringify({idCompra: myBuySell})
        peticion1.reqRes("POST", "./showCompra", body)
    }
    cargarVendedor(){
        const body=JSON.stringify({data: this.compra.idVendedor})
        peticion1.reqRes("POST", "./descVendedor", body, "vendedor")
    }
    cargarComprador(){
        const body=JSON.stringify({data: this.compra.idComprador})
        peticion1.reqRes("POST", "./descVendedor", body, "comprador")
    }
    cargarDom(){
        let comunicationWith
        let sendQuien=""
        let status=""
        let confirmEntrega=""
        if(this.compra.idComprador==userios.value){
            comunicationWith=pila.comprador
            sendQuien="Comprador"
            confirmEntrega=`
            <section id="confirm-entrega">
                <button id="btn-entregado" onclick="entregado()">Apelar</button>
                <output id="alert-confirm">Atención: Este botón es para cancelar la compra o para devoluciones</output>
            </section>
            `
        }else{
            comunicationWith=pila.vendedor
            confirmEntrega=`
            <section id="confirm-entrega">
                <button id="btn-entregado" onclick="entregado()">Confirmar Entrega</button>
                <output id="alert-confirm">Atención: Este botón solo lo debe apretar una vez el producto haya sido entregado</output>
            </section>
            `
            sendQuien="Vendedor"
        }
        if(this.compra.estado==0){
            status="Entrega Pendiente"
        }else{
            status="Entregado"
        }
        dom.innerHTML=`
        <section id="desc-confi">
            <section id="compra">
                <h2 id="name-product">${this.compra.nameProduct}</h2>
                <output id="text-cantidad">Cantidad:</output>
                <output id="cantidad">${this.compra.cantidad}</output><br>
                <output id="text-price">Precio:</output>
                <output id="precio">${this.compra.precio}</output><br>
                <output id="text-status">Estado:</output>
                <output id="estado">${status}</output><br>
            </section>
            ${confirmEntrega}
        </section>
        <section id="chat-compra">
            <section id="chat">
                <section id="desc-vendedor">
                    <output id="name-vendedor">${comunicationWith[0]}</output>
                    <output id="location-vendedor">${comunicationWith[1]}</output>
                </section>
                <section id="msj"></section>
                <section id="add-msj">
                    <input name="new-msj" id="new-msj" placeholder="Escribale al ${sendQuien}">
                    <button id="send" onclick="send()">Enviar</button>
                </section>
            </section>
        </section>
        `
        this.cargarMsjs()
    }
    cargarMsjs(){
        const body=JSON.stringify({idCompra:this.compra.idCompra})
        peticion1.reqRes("POST", "./show-msj-compra", body)
    }
    setMsj(data){
        let valor
        for (let index = 0; index < data.length; index++) {
            let domMsj=document.getElementById("msj")
            if(data[index].idUser==userios.value){
                valor="mio"
            }else{
                valor="tuyo"
            }
            domMsj.innerHTML+=`
                <output class="${valor}">${data[index].msj}</output>
            `
        }
    }
}
const pila=new Mdom
class Peticions{
    reqRes(tipo, url,body, valor){
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
                if(url=='./showCompra'){
                    pila.setCompra(data)
                }
                if(url=='./descVendedor' && valor=='vendedor'){
                    pila.setVendedor(data)
                }
                if(url=='./descVendedor' && valor=='comprador'){
                    pila.setComprador(data)
                }
                if(url=='./show-msj-compra'){
                    pila.setMsj(data)
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
    setTimeout(pila.cargarCompra,1000)
}
function send(){
    let newMsj=document.getElementById("new-msj")
    let hellod = document.getElementById("hello")
    let user=hellod.outerText
    user=user.slice(5,-1)
    console.log(user)
    const body = JSON.stringify({
        idCompra: pila.compra.idCompra,
        msj: newMsj.value,
        idUser: userios.value
    })
    let comunicationWith
        if(pila.compra.idComprador==userios.value){
            comunicationWith=pila.compra.idVendedor
        }else{
            comunicationWith=pila.compra.idComprador
        }
    let fecha = new Date()
    let mes = fecha.getMonth()+1
    if(mes<10){
      mes=""+0+""+mes
    }
    let newFecha = fecha.getDate() +"/"+ mes +"/"+ fecha.getFullYear()
    const body1 = JSON.stringify({
        idUser: 0,
        idProduct: pila.compra.idProduct,
        idDestinatario:comunicationWith,
        mensaje:"Tenes un nuevo mensaje de: "+ user,
        fecha:newFecha,
        idRespuesta:0
    })
    peticion1.reqRes("POST", "./newMsjCompra", body)
    peticion1.reqRes("POST", "./sendmsj", body1)
    location.reload()
}
window.addEventListener("load",iniciar)