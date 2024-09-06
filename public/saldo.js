let domSaldo=document.getElementById("saldo")
function sumarSignosPrice(precioFinish){
    let count = 1
    let precioReves=""
    for (let index = precioFinish.length; index >=0 ; index--) {
        count++
        if(count%3==0 && count>=3 && index != precioFinish.length-1){
            precioReves=precioReves+"."
        }
        precioReves=precioReves+precioFinish.charAt(index)
    }
    let precioConSigno=""
    for (let index = precioReves.length; index >=0 ; index--) {
        precioConSigno = precioConSigno + precioReves.charAt(index)
    }
    return precioConSigno
}
function pedirSaldo(){
    let userios=document.getElementById("userios")
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "./showSaldo");
    xhr.setRequestHeader("Content-Type", "application/json");
    const body = JSON.stringify({idUser:userios.outerText})
    xhr.send(body);
    xhr.onload = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        const data = JSON.parse(xhr.responseText);
        let saldo$="$"+sumarSignosPrice(data[0].saldo.toString())
        mostrarSaldo(saldo$)
      } else {
        console.log(`Error: ${xhr.status}`);
      }
    }; 
}
function mostrarSaldo(data){
    domSaldo.innerHTML=`
        <h2 id="saldo-actual">${data}</h2>
    `
}
function iniciar(){
    setTimeout(pedirSaldo, 1000)
}
window.addEventListener("load",iniciar)