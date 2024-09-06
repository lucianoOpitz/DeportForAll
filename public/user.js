const names = document.getElementById("name")
const secondName = document.getElementById("secondName")
const mail = document.getElementById("mail")
const dni = document.getElementById("dni")
const codePostal = document.getElementById("codePostal")
const telefon = document.getElementById("telefon")
const direccion = document.getElementById("direccion")
const userName = document.getElementById("userName")
const userPass = document.getElementById("userPass")
userPass.style.webkitTextSecurity= "disc"
const localidad =document.getElementById("barrio")
let users=[]
function iniciar(){
    setTimeout(cargarProductos,700)
}
function view(){
    let ver=document.getElementById("ver")
    if(userPass.style.webkitTextSecurity=='disc'){
        userPass.style.webkitTextSecurity= "unset"
        ver.innerHTML="Ocultar"
    }else{
        userPass.style.webkitTextSecurity= "disc"
        ver.innerHTML="Ver"
    }
}
function cargarProductos(){
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "./showUser");
    xhr.setRequestHeader("Content-Type", "application/json");
    let userios=document.getElementById("userios")
    const body = JSON.stringify({usuarioId: userios.value})
    xhr.send(body);
    xhr.onload = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        const data = JSON.parse(xhr.responseText);
        users=data
      } else {
        console.log(`Error: ${xhr.status}`);
      }
      cargarDatos()
      noneFlex(0)
    };
}
function cargarDatos(){
    names.innerHTML=users[0].name
    secondName.innerHTML=users[0].secondName
    mail.innerHTML=users[0].mail
    dni.innerHTML=users[0].dni
    codePostal.innerHTML=users[0].codePostal
    telefon.innerHTML=users[0].telefon
    direccion.innerHTML=users[0].direccion
    userName.innerHTML=users[0].userName
    userPass.innerHTML=users[0].userPass
    localidad.innerHTML=users[0].barrio
}
function noneFlex(num){
    if(num==0){
        for(let i=1;i<=7;i++){
            let inputs = document.getElementById("input"+i)
            let btnsModify = document.getElementById("modify"+i)
            let btnsCancel = document.getElementById("cancel"+i)
            let btnsSave = document.getElementById("save"+i)
            let alertInput = document.getElementById("alert-input"+i)
            alertInput.style.display="none"
            btnsCancel.style.display="none"
            btnsSave.style.display="none"
            btnsModify.style.display="block"
            inputs.style.display="none"
        }
    }else{
        let alertInput = document.getElementById("alert-input"+num)
        let inputs = document.getElementById("input"+num)
        let btnsModify = document.getElementById("modify"+num)
        let btnsCancel = document.getElementById("cancel"+num)
        let btnsSave = document.getElementById("save"+num)
        if(btnsModify.style.display=="block"){
            btnsCancel.style.display="block"
            btnsSave.style.display="block"
            btnsModify.style.display="none"
            inputs.style.display="block"
        }else{
            btnsCancel.style.display="none"
            btnsSave.style.display="none"
            btnsModify.style.display="block"  
            alertInput.style.display="none"
            inputs.style.display="none"  
        }
    }
}
function modify(num){
    noneFlex(num)
}
function cancel(num){
    noneFlex(num)
}
function save(num){
    let inputs = document.getElementById("input"+num)
    if(inputs.value==''){
        let alertInput = document.getElementById("alert-input"+num)
        alertInput.style.display="flex"
    }else{
        let change
        switch (num) {
            case 1:
                change = "mail"
                users[0].mail=inputs.value
                break;
            case 2:
                change = "codePostal"
                users[0].codePostal=inputs.value
                break;
            case 3:
                change = "telefon"
                users[0].telefon=inputs.value
                break;
            case 4:
                change = "direccion"
                users[0].direccion=inputs.value
                break;
            case 5: 
                change = "userName"
                users[0].userName=inputs.value
                break;
            case 6:
                change = "userPass"
                users[0].userPass=inputs.value
                break;
            case 7:
                change="barrio"
                users[0].barrio=inputs.value
        }
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "./upUser");
        xhr.setRequestHeader("Content-Type", "application/json");
        const body = JSON.stringify({
            name: users[0].name,
            idUser: users[0].idUser,
            dni: users[0].dni,
            cambios: change,
            dato: inputs.value,
            usuario1: users[0]
        });
        xhr.onload = () => {
          if (xhr.readyState == 4 && xhr.status == 200) {
            console.log(JSON.parse(xhr.responseText));
          } else {
            console.log(`Error: ${xhr.status}`);
          }
        };
        window.location.href ="./user.html";
        xhr.send(body);
    }
}
window.addEventListener("load", iniciar)