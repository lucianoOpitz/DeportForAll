const https = require('https');
var http = require("http");
const fs = require('fs');
const mysql = require('mysql') 
var express = require('express');
const cors = require('cors')
// SDK de Mercado Pago
const mercadopago = require('mercadopago');
const client = new mercadopago.MercadoPagoConfig({accessToken: "TEST-1329238472145791-090208-dad04714e9d851f0b15d43fa6b881f7c-235859240"})
class Key{
    encripted(password){
        let encriptText=""
        for (let index = 0; index < password.length; index++) {
            let letra=password.charAt(index)
            let letraByte=letra.charCodeAt()
            letraByte=letraByte*5
            encriptText=encriptText+String.fromCharCode(letraByte)
        }
        return encriptText
    }
    decencripted(password){
        let decencript=""
        for (let index = 0; index < password.length; index++) {
            let letra=password.charAt(index)
            let numByte=letra.charCodeAt();
            numByte=numByte/5
            decencript=decencript+String.fromCharCode(numByte)
        }
        return decencript.toString()
    }
}
const upClose = new Key()
const options = {
    key: fs.readFileSync("./localhost-key.pem"), // Reemplaza con la ruta de tu llave generada
    cert: fs.readFileSync("./localhost.pem"), // Reemplaza con la ruta de tu certificado generado
};
let usuarios=[]
const usuariosLibres=[]
class Usuarios{
    constructor(idUser, name, secondName, mail, dni, codePostal, telefon, userName, userPass, direccion, reputacionBuy, reputacionSell, barrio, ip){ 
        this.idUser = idUser
        this.name = name
        this.secondName=secondName
        this.mail=mail
        this.dni=dni
        this.codePostal=codePostal
        this.telefon=telefon
        this.userName=userName
        this.userPass=userPass
        this.direccion=direccion
        this.reputacionBuy=reputacionBuy
        this.reputacionSell=reputacionSell
        this.barrio = barrio
        this.ip = ip
    }
}
class UsuariosLibres{
    constructor(id, ip){
        this.id=id
        this.ip=ip
    }
}
class Productos{
    constructor(idProduct, name, cantidad, description, estado, publicado, categoria, idUser, price, idOfer){
        this.idProduct = idProduct
        this.cantidad = cantidad
        this.name = name
        this.description = description
        this.estado = estado
        this.publicado = publicado
        this.categoria = categoria
        this.idUser = idUser
        this.price = price
        this.idOfer = idOfer
    }
}
var app = express()
app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())
const connection = mysql.createConnection({
    host:'127.0.0.1',
    user:'mercadolibre',
    password:'lucho12arg',
    database:'buysell'
})
/* connection.connect((err)=>{
    if(err) throw err
    console.log('connect')
})
connection.query('SELECT * from productos', (err,rows)=>{
    if(err) throw err
    console.log('Los datos son:')
    console.log(rows)
}) */
app.get("/unirse",function(req,res){
    const id = `${Math.random()}`
    const user = new UsuariosLibres (id, 0)
    usuariosLibres.push(user)
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.send(id)
    cargarProductos()
})
app.post("/comprobarIp", function(req,res){
    for(let i=0;i<usuarios.length;i++){
        if(req.body.ok == usuarios[i].ip){
            res.send(usuarios[i])
        }
    }
})
function convertir(data){
    let precio=""
    let count = 1
    let valor= data.toString()
    for(let index=valor.length; index>=0;index--){
        count++
        if(count%3==0 && count>=3 && index != valor.length-1){
            precio=precio+"."
        }
        precio=precio + valor.charAt(index)
    }
    let precioConComa=""
    for (let index = precio.length; index >= 0; index--) {
        precioConComa= precioConComa+precio.charAt(index)
    }
    return precioConComa
}
app.get("/showProductos", function(req,res){
    let productos=[]
    connection.query('SELECT * from productos WHERE publicado=1', (err,rows)=>{
        if(err) throw err
        for(i=0;i<rows.length;i++){
            let newProducto=new Productos(rows[i].idProduct, rows[i].name, rows[i].cantidad, rows[i].description, rows[i].estado, rows[i].publicado, rows[i].categoria, rows[i].idUser, convertir(rows[i].price), rows[i].idOfer)
            productos.push(newProducto)
        }
        res.send(productos)
    }) 
})
app.post("/address", function(req,res){
    connection.query('SELECT * from direcciones WHERE idUser="'+req.body.idUser+'"', (err,rows)=>{
        if(err) throw err
        res.send(rows)
    }) 
})
app.post("/newAddress", function(req,res){
    connection.query('INSERT INTO direcciones (idUser, direccion) values ("'+req.body.idUser+'", "'+req.body.direccion+'")', (err,rows)=>{
        if(err) throw err
    })
})
app.post("/dirBorrar", function(req,res){
    connection.query('DELETE FROM direcciones WHERE idUser="'+req.body.idUser+'" AND idDireccion="'+req.body.idDireccion+'"', (err,rows)=>{
        if(err) throw err
    })
})
app.post("/dirChange", function(req,res){
    connection.query('UPDATE usuarios SET direccion="'+req.body.newDire+'" WHERE idUser="'+req.body.idUser+'"', (err,rows)=>{
        if(err) throw err
        for(let i=0;i<usuarios.length;i++){
            if(req.body.ipUser == usuarios[i].ip){
                usuarios[i].direccion=req.body.newDire
            }
        }
    })
    connection.query('UPDATE direcciones SET direccion="'+req.body.dire+'" WHERE idUser="'+req.body.idUser+'" AND idDireccion="'+req.body.idDireccion+'"', (err,rows)=>{
        if(err) throw err
    })
})
app.get("/showProductosOfers", function(req,res){
    connection.query('SELECT * from productos WHERE publicado=1 AND idOfer>1', (err,rows)=>{
        if(err) throw err
        for(i=0;i<rows.length;i++){
            rows[i].price=convertir(rows[i].price)
        }
        res.send(rows)
    }) 
})
app.post("/ingresar", function(req,res){
    const nameUser = req.body.nameUser
    const passUser = req.body.passUser
    const ipUser = req.body.ipUser
    connection.query('SELECT * from usuarios WHERE userName="'+nameUser+'"', (err,rows)=>{
        if(err) throw err
        if(rows.length!=0){
            if(upClose.decencripted(rows[0].userPass)==passUser){
                if(rows[0]!=undefined){
                    let newUsuario= new Usuarios(rows[0].idUser, rows[0].name, rows[0].secondName, rows[0].mail, rows[0].dni, rows[0].codePostal, rows[0].telefon, rows[0].userName, rows[0].userPass, rows[0].direccion, rows[0].reputacionBuy, rows[0].reputacionSell, rows[0].barrio, ipUser)
                    usuarios.push(newUsuario)
                    res.send("true")
                }else{
                    res.send("false")
                }
            }else{
                res.send("false")
            }
        }else{
            res.send("false")
        }
    }) 
})
app.post("/registrar", function(req,res){
    connection.query('INSERT INTO usuarios (name, secondName, mail, dni, codePostal, telefon, userName, userPass, direccion, reputacionBuy, reputacionSell, barrio) values ("'+req.body.name+'", "'+req.body.secondName+'", "'+req.body.mail+'", '+req.body.dni+', "'+req.body.codePostal+'", "'+req.body.telefon+'", "'+req.body.userName+'", "'+upClose.encripted(req.body.userPass)+'", "'+req.body.direccion+'", 0, 0, "'+req.body.barrio+'")', (err,rows)=>{
        if(err) throw err
    })
    res.redirect("./index.html")
})
app.post("/modifyProduct", function(req,res){
    connection.query('UPDATE productos SET name="'+req.body.name+'", cantidad="'+req.body.cantidad+'", description="'+req.body.description+'", estado="'+req.body.estado+'", publicado="'+req.body.publicado+'", categoria="'+req.body.categoria+'", price="'+req.body.price+'", idOfer="'+req.body.idOfer+'" WHERE idProduct="'+req.body.idProduct+'"', (err,rows)=>{
        if(err) throw err
    })
    if(req.body.publicado!=1){ 
        connection.query('DELETE FROM carrito WHERE idProduct="'+req.body.idProduct+'"', (err,rows)=>{
        if(err) throw err
        })
    }
})
app.post("/showUser", function(req,res){
    connection.query('SELECT * from usuarios WHERE idUser="'+req.body.usuarioId+'"', (err,rows)=>{
        if(rows!=undefined && rows[0]!=undefined){
            rows[0].userPass=upClose.decencripted(rows[0].userPass)
            res.send(rows)
        }
    }) 
})
app.post("/upUser",function(req,res){
    if(req.body.cambios=='userPass'){
        req.body.dato=upClose.encripted(req.body.dato)
    }
    connection.query('UPDATE usuarios SET '+req.body.cambios+'="'+req.body.dato+'" WHERE idUser='+req.body.idUser, (err,rows)=>{
        if(err) throw err
        if(req.body.cambios=='direccion'){
            for(let i=0;i<usuarios.length;i++){
                if(req.body.idUser == usuarios[i].idUser){
                    usuarios[i].direccion=req.body.dato
                }
            }
        }
    })
})
app.post("/upSaldo",function(req,res){
    connection.query('UPDATE usuarios SET saldo=saldo+'+parseInt(req.body.dato)+' WHERE idUser='+req.body.idUser, (err,rows)=>{
        if(err) throw err
    })
})
app.post("/misproductos",function(req,res){
    connection.query('SELECT * from productos WHERE idUser="'+req.body.usuarioId+'"', (err,rows)=>{
        for (let index = 0; index < rows.length; index++) {
            rows[index].price=convertir(rows[index].price)
        }
        res.send(rows)
    }) 
})
app.post("/publicarProducto",function(req,res){
    connection.query('INSERT INTO productos (name, cantidad, description, estado, publicado, categoria, idUser, price) values ("'+req.body.name+'", "'+req.body.cantidad+'", "'+req.body.description+'", '+req.body.estado+', "'+req.body.publicado+'", "'+req.body.categoria+'", "'+req.body.idUser+'", "'+req.body.price+'")', (err,rows)=>{
        if(err) throw err
    })
})
app.post("/desc", function(req,res){
    connection.query('SELECT * from productos WHERE idProduct="'+req.body.idProduct+'"', (err,rows)=>{
        for (let index = 0; index < rows.length; index++) {
            rows[index].price=convertir(rows[index].price)
        }
        res.send(rows)
    }) 
})
app.post("/showProducto", function(req,res){
    connection.query('SELECT * from productos WHERE idProduct="'+req.body.idProduct+'"', (err,rows)=>{
        for (let index = 0; index < rows.length; index++) {
            rows[index].price=convertir(rows[index].price)
        }
        res.send(rows)
    }) 
})
app.get("/showOfers", function(req,res){
    connection.query('SELECT * from ofertas', (err,rows)=>{
        res.send(rows)
    }) 
})
app.post("/descVendedor", function(req,res){
    connection.query('SELECT * from usuarios WHERE idUser="'+req.body.data+'"', (err,rows)=>{
        let array=[]
        array.push(rows[0].userName)
        array.push(rows[0].barrio)
        res.send(array)
    }) 
})
app.post("/history", function(req,res){
    connection.query('SELECT * from historial WHERE idUser="'+req.body.idUser+'"', (err,rows)=>{  
        if(rows.length!=0){
            if (rows[rows.length-1].idProduct != req.body.idProduct){
                connection.query('INSERT INTO historial (idUser, idProduct) values ("'+req.body.idUser+'", "'+req.body.idProduct+'")', (err,rows)=>{
                    if(err) throw err
                })
            }
        }else{
            connection.query('INSERT INTO historial (idUser, idProduct) values ("'+req.body.idUser+'", "'+req.body.idProduct+'")', (err,rows)=>{
                if(err) throw err
            })
        }
    })
})
app.post("/showHistory", function(req,res){
    connection.query('SELECT * from historial WHERE idUser="'+req.body.idUser+'"', (err,rows)=>{
        res.send(rows)
    })
})
app.post("/showFavsDesc", function(req,res){
    connection.query('SELECT * from favoritos WHERE idUser="'+req.body.idUser+'"', (err,rows)=>{
        res.send(rows)
    })
})
app.post("/showFavs", function(req,res){
    connection.query('SELECT * from favoritos WHERE idUser="'+req.body.idUser+'"', (err,rows)=>{
        res.send(rows)
    })
})
app.post("/fav",function(req,res){
    if(req.body.idUser!=0){
        connection.query('SELECT * from favoritos WHERE idUser="'+req.body.idUser+'" AND idProduct="'+req.body.idProduct+'"', (err,rows)=>{
            if(rows[0]==undefined){
                connection.query('INSERT INTO favoritos (idUser, idProduct) values ("'+req.body.idUser+'", "'+req.body.idProduct+'")', (err,rows)=>{
                    if(err) throw err
                })
            }else{
                connection.query('DELETE FROM favoritos WHERE idUser="'+req.body.idUser+'" AND idProduct="'+req.body.idProduct+'"', (err,rows)=>{
                    if(err) throw err
                })
            }
        })
    }
})
app.post("/cate", function(req,res){
    connection.query('SELECT * from productos WHERE categoria="'+req.body.idCategoria+'" AND publicado=1', (err,rows)=>{
        for (let index = 0; index < rows.length; index++) {
            rows[index].price=convertir(rows[index].price)
        }
        res.send(rows)
    }) 
})
app.post("/msjs", function(req,res){
    connection.query('SELECT * from mensajes WHERE idProduct="'+req.body.idProduct+'"', (err,rows)=>{
        res.send(rows)
    }) 
})
app.post("/showmsj", function(req,res){
    connection.query('SELECT * from mensajes WHERE idDestinatario="'+req.body.idDestinatario+'"', (err,rows)=>{
        res.send(rows)
    }) 
})
app.post("/sendmsj", function(req,res){
    connection.query('INSERT INTO mensajes (idUser, idProduct, idDestinatario, mensaje, fecha, idRespuesta) values ("'+req.body.idUser+'", "'+req.body.idProduct+'", "'+req.body.idDestinatario+'", "'+req.body.mensaje+'", "'+req.body.fecha+'", "'+req.body.idRespuesta+'")', (err,rows)=>{
        if(err) throw err
        if(req.body.idRespuesta!=0){
            connection.query('UPDATE mensajes SET idRespuesta="'+rows.insertId+'" WHERE idMensaje="'+req.body.idRespuesta+'"', (err,rows)=>{
                if(err) throw err
            })
        }
    })
})
app.post("/upNotify", function(req,res){
    connection.query('UPDATE mensajes SET visto="1" WHERE idMensaje="'+req.body.idMensaje+'"', (err,rows)=>{
        if(err) throw err
    })
})
app.post("/delProduct", function(req,res){
    connection.query('DELETE FROM productos WHERE idProduct="'+req.body.idProduct+'"', (err,rows)=>{
        if(err) throw err
    })
    connection.query('DELETE FROM mensajes WHERE idProduct="'+req.body.idProduct+'"', (err,rows)=>{
        if(err) throw err
    })
    connection.query('DELETE FROM historial WHERE idProduct="'+req.body.idProduct+'"', (err,rows)=>{
        if(err) throw err
    })
    connection.query('DELETE FROM carrito WHERE idProduct="'+req.body.idProduct+'"', (err,rows)=>{
        if(err) throw err
    })
    connection.query('DELETE FROM favoritos WHERE idProduct="'+req.body.idProduct+'"', (err,rows)=>{
        if(err) throw err
    })
})
app.post("/closed", function(req,res){
    let newUsuarios=[]
    for(let i=0;i<usuarios.length;i++){
        if(req.body.ok.idUser != usuarios[i].idUser){
            newUsuarios.push(usuarios[i])
        }
    }
    usuarios=newUsuarios
})
app.post("/cantCart", function(req,res){
    connection.query('SELECT * from carrito WHERE idUser="'+req.body.idUser+'"', (err,rows)=>{
        res.send(rows)
    })
})
app.post("/upCart", function(req,res){
    connection.query('UPDATE carrito SET cantidad="'+req.body.cantidad+'" WHERE idProduct="'+req.body.idProduct+'" AND idUser="'+req.body.idUser+'"', (err,rows)=>{
        if(err) throw err
    })
})
app.post("/postCart", function(req,res){
    connection.query('INSERT INTO carrito (idUser, idProduct, cantidad) values ("'+req.body.idUser+'", "'+req.body.idProduct+'", "'+req.body.cantidad+'")', (err,rows)=>{
        if(err) throw err
    })
})
app.post("/delCart", function(req,res){
    connection.query('DELETE FROM carrito WHERE idUser="'+req.body.idUser+'"', (err,rows)=>{
        if(err) throw err
    })
})
app.post("/delProductCart", function(req,res){
    connection.query('DELETE FROM carrito WHERE idUser="'+req.body.idUser+'" AND idProduct="'+req.body.idProduct+'"', (err,rows)=>{
        if(err) throw err
    })
})
app.post("/proccess_payment",  async (req,res)=>{
    const payment = new mercadopago.Payment(client);
    payment.create({ 
        body: {
            token: req.body.token,
            issuer_id: req.body.issuer_id,
            transaction_amount: req.body.transaction_amount,
            description: req.body.token,
            payment_method_id: req.body.payment_method_id,
            installments:req.body.installments,
            payer: {
                email: req.body.payer.email,
                identification: {
                    type:req.body.payer.identification.type,
                    number:req.body.payer.identification.number
                }
            }
        }
    })
    .then((response) => {
        res.send(response)
    })
    .catch(console.log);
})
app.post("/create_payment", async (req,res)=>{
    try{
        const body={
            items:[{
                title: req.body.title,
                quantity: Number(req.body.quantity),
                unit_price: Number(req.body.price),
                currency_id: "ARS"
            }],
        }
        const preference = new mercadopago.Preference(client) 
        const result = await preference.create({body})
        res.json({
            id: result.id
        })
    }catch(error){
        console.log(error)
        res.status(500).json({
            error: "Error al crear la preferencia"
        })
    }
})
app.post("/createCompra", (req,res)=>{
    connection.query('INSERT INTO compras (idVendedor, idComprador, idProduct, nameProduct, cantidad, precio) values ("'+req.body.idVendedor+'", "'+req.body.idComprador+'","'+req.body.idProduct+'","'+req.body.nameProduct+'" ,"'+req.body.cantidad+'", "'+req.body.precio+'")', (err,rows)=>{
        if(err) throw err
    })
})
app.post("/showCompras", (req,res)=>{
    connection.query('SELECT * from compras WHERE idComprador="'+req.body.idUser+'"', (err,rows)=>{
        res.send(rows)
    })
})
app.post("/showCompra", (req,res)=>{
    connection.query('SELECT * from compras WHERE idCompra="'+req.body.idCompra+'"', (err,rows)=>{
        res.send(rows)
    })
})
app.post("/showVentas", (req,res)=>{
    connection.query('SELECT * from compras WHERE idVendedor="'+req.body.idUser+'"', (err,rows)=>{
        res.send(rows)
    })
})
app.post("/newMsjCompra", (req,res)=>{
    connection.query('INSERT INTO mensajescompras (idCompra, msj, idUser) values ("'+req.body.idCompra+'", "'+req.body.msj+'","'+req.body.idUser+'")', (err,rows)=>{
        if(err) throw err
    })
})
app.post("/show-msj-compra", (req,res)=>{
    connection.query('SELECT * from mensajescompras WHERE idCompra="'+req.body.idCompra+'"', (err,rows)=>{
        res.send(rows)
    })
})
app.post("/showSaldo", (req,res)=>{
    connection.query('SELECT saldo from usuarios WHERE idUser="'+req.body.idUser+'"', (err,rows)=>{
        res.send(rows)
    })
})
const port = 3000;
https.createServer(options, app).listen(port, () => {
    console.log("Server listening on port " + port);
});
