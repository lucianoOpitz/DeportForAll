const names = document.getElementById("nameUser")
const pass = document.getElementById("passUser")
const erorr= document.getElementById("text-error")
erorr.style.display="none"
let ipUser=0
let setCookies = (name, value, days) => {
  let expires = "";
  if (days) {
    let date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
};

let getCookies = name => {
  let nameEQ = name + "=";
  let ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  setCookies("userBUYSELL", Math.random());
  return null;
};

//Calling cookie



const userBUYSELLs = getCookies("userBUYSELL");
function ingresar(){
    fetch('https://api.ipify.org?format=json')
    .then(respuesta => respuesta.json())
        .then(datos => {
            const xhr = new XMLHttpRequest();
            xhr.open("POST", "./ingresar");
            xhr.setRequestHeader("Content-Type", "application/json");
            const body = JSON.stringify({
                nameUser:names.value,
                passUser:pass.value,
                ipUser:userBUYSELLs
            });
            console.log(userBUYSELLs)
            xhr.onload = () => {
              if (xhr.readyState == 4 && xhr.status == 200) {
                if(xhr.responseText=="true"){ 
                  window.location.href ="./index.html";
                }else if(xhr.responseText=="false"){
                  erorr.style.display="flex"
                }
              } else {
                console.log(`Error: ${xhr.status}`);
              }
            };
            xhr.send(body);
        })
    .catch(error => console.error('Error al obtener la dirección IP:', error));
}