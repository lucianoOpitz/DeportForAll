const infoHistory = document.getElementById("info-history")
let userios=document.getElementById("userios")
let historialProductos=[]
let arrayProductosFav=[]
function iniciar(){
    setTimeout(cargar,500)
}
function cargar(){
  if(userios.value==0){
    location.href="./signIn.html"
  }else{
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "./showHistory");
    xhr.setRequestHeader("Content-Type", "application/json");
    let userios=document.getElementById("userios")
    xhr.send(JSON.stringify({idUser: userios.value}));
    xhr.onload = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
          historialProductos=JSON.parse(xhr.responseText)
          desplegarHistorial(historialProductos)
      } else {
          console.log(`Error: ${xhr.status}`);
      }
    };
  }
}
function desplegarHistorial(hi$){
const xhr = new XMLHttpRequest();
  xhr.open("GET", "./showProductos");
  xhr.send();
  xhr.responseType = "json";
  xhr.onload = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
      const data = xhr.response;
        for (let i = 0; i < hi$.length; i++) {
            for (let index = 0; index < data.length; index++) {
                if(data[index].idProduct==hi$[i].idProduct){
                arrayProductosFav.push(data[index])
                }
            }
        }
      mostrarHistorial(arrayProductosFav)
    } else {
      console.log(`Error: ${xhr.status}`);
    }
  };
}
function mostrarHistorial(data){
    let num
    if(data.length>30){
       num=30 
    }else{
        num=data.length-1
    }
    for(let i = num; i>=0;i--){
        infoHistory.innerHTML+=`
            <section id="product${i}" class="modyA">
                <button id="op${i}" class="op" onclick="desc(${i})"><h2 class="h-pro">${data[i].name}</h2></button>
                <output class="price-pro">$${data[i].price}</output>
            </section>
        `
    }
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
function desc(num){
    setCookies("descProduct", arrayProductosFav[num].idProduct)
    location.href="./desc.html"
}
window.addEventListener("load",iniciar)