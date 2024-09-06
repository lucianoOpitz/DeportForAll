const favoritos =document.getElementById("show-favorits")
let arrayProductosFav=[]
function iniciar(){
    setTimeout(cargarFavoritos,1000)
}
function cargarFavoritos(){
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "./showFavsDesc");
    xhr.setRequestHeader("Content-Type", "application/json");
    let userios=document.getElementById("userios")
    const body = JSON.stringify({idUser: userios.value})
    xhr.send(body);
    xhr.onload = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        favs(JSON.parse(xhr.responseText))
      } else {
        console.log(`Error: ${xhr.status}`);
      }
    };
}
function favs(fav$){
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "./showProductos");
  xhr.send();
  xhr.responseType = "json";
  xhr.onload = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
      const data = xhr.response;
        for (let i = fav$.length-1; i >=0 ; i--) {
          for (let index = 0; index < data.length; index++) {
            if(data[index].idProduct==fav$[i].idProduct){
              arrayProductosFav.push(data[index])
            }
          }
        }
      postFavs(arrayProductosFav)
    } else {
      console.log(`Error: ${xhr.status}`);
    }
  };
}
function postFavs(data){
    let num
    if(data.length>30){
        num=30
    }else{
        num=parseInt(data.length)-1
    }
    for (let i = 0; i < data.length; i++) {
        favoritos.innerHTML+=`
        <section class="box-fav">
            <section class="box-button-fav">
                <button id="redirec${i}" onclick="redirect(${i})" class="btn-tit"><h3 id="titulo${i}">${data[i].name}</h3></button>
                <button id="fav${i}" onclick="fav(${i})" class="favi">💛</button>
            </section>
            <section class="datos">
                <output id="price${i}" class="price">$${data[i].price}</output>
            </section>
        </section>
        `
    }
}
function fav(num){
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "./fav");
    xhr.setRequestHeader("Content-Type", "application/json");
    let userios=document.getElementById("userios")
    const body = JSON.stringify({idProduct: arrayProductosFav[num].idProduct, idUser: userios.value})
    xhr.send(body);
    xhr.onload = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        console.log(JSON.parse(xhr.responseText));
      } else {
        console.log(`Error: ${xhr.status}`);
      }
    };
    location.reload()
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
function redirect(num){
  setCookies("descProduct", arrayProductosFav[num].idProduct)
  location.href="./desc.html"
}
window.addEventListener("load", iniciar)