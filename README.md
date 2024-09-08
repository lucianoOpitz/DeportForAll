# DeportsForAll

In main: "Code" 🟢 
>Dowload zip
>Extract
>Open Visual Studio Code
>File>OpenFolder>folder_where_zip_unzipped
>Terminal>NewTerminal
>In Terminal write:
  npm init -y
  npm i express morgan mysql cors mercadopago
  mkcert localhost
>Outside of Vs Code, execute XAMPP start APACHE, start MYSQL, admin MYSQL
>In Vs Code, in terminal:
  node index.js


ATENTION
(must count with a BD with tables specifics, in admin MYSQL or in PHPmyAdmin create BD "buysell", in the BD "buysell":
    import
    select file
    folder_where_zip_unzipped>buysell (3).sql
)
(In home of phpmyadmin:
  user accounts
  add user account 
    username: mercadolibre
    hostname: 127.0.0.1
    password: lucho12arg
)
if start MYSQL not function must open a terminal with "execute as admin", in terminal write:
>netstat -nao|findstr 0.0:3306
example of response of terminal
  "TCP    0.0.0.0:3306           0.0.0.0:0              LISTENING       572"
  in the example, 572 is the process that use the port 3306
  must finalization for that mysql of xampp use sayed port, in terminal write:
>taskkill /pid 572 /f

Now Yes!!

>In Vs Code, in terminal:
  node index.js
