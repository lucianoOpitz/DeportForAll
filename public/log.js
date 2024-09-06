const names = document.getElementById("name")
const secondNames = document.getElementById("secondName")
const mails = document.getElementById("mail")
const dnis = document.getElementById("dni")
const codePostals = document.getElementById("codePostal")
const telefons = document.getElementById("telefon")
const direccions = document.getElementById("direccion")
const userNames = document.getElementById("userName")
const userPasss = document.getElementById("userPass")
const localidads =document.getElementById("barrio")
const alertName = document.getElementById("aname")
const alertSecondName = document.getElementById("asecondName")
const alertMail = document.getElementById("amail")
const alertDni = document.getElementById("adni")
const alertCodePostal = document.getElementById("acodePostal")
const alertTelefon = document.getElementById("atelefon")
const alertDireccion = document.getElementById("adireccion")
const alertUserName = document.getElementById("auserName")
const alertUserPass = document.getElementById("auserPass")
const alertLocalidad =document.getElementById("abarrio")
function iniciar(){
    alertName.style.display="none"
    alertSecondName.style.display="none"
    alertMail.style.display="none"
    alertDni.style.display="none"
    alertCodePostal.style.display="none"
    alertTelefon.style.display="none"
    alertDireccion.style.display="none"
    alertUserName.style.display="none"
    alertUserPass.style.display="none"
    alertLocalidad.style.display="none"
}
function registrar(){
    if(names.value==''){
        alertName.style.display="block"
    }else if(secondNames.value==''){
        alertSecondName.style.display="block"
    }else if(dnis.value==''){
        alertDni.style.display="block"
    }else if(mails.value==''){
        alertMail.style.display="block"
    }else if(telefons.value==''){
        alertTelefon.style.display="block"
    }else if(direccions.value==''){
        alertDireccion.style.display="block"
    }else if(codePostals.value==''){
        alertCodePostal.style.display="block"
    }else if(localidads.value==''){
        alertLocalidad.style.display="block"
    }else if(userNames.value==''){
        alertUserName.style.display="block"
    }else if(userPasss.value==''){
        alertUserPass.style.display="block"
    }else{
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "./registrar");
        xhr.setRequestHeader("Content-Type", "application/json");
        const body = JSON.stringify({
            name: names.value,
            secondName: secondNames.value,
            mail: mails.value,
            dni: dnis.value,
            codePostal: codePostals.value,
            telefon: telefons.value,
            direccion: direccions.value,
            userName: userNames.value,
            userPass: userPasss.value,
            barrio: localidads.value
        })
        xhr.onload = () => {
          if (xhr.readyState == 4 && xhr.status == 200) {
            location.href="./index.html"
          } else {
            console.log(`Error: ${xhr.status}`);
          }
        };
        xhr.send(body);
    }
}
window.addEventListener("load", iniciar)