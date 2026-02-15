# Configurar script en ``package.json``

Para lanzar el script de node, necesitamos escribir un script que se compone, principalmente, de dos partes:

1. El ``engine`` que arranca el script (node)
2. La ubicación del fichero a ejecutar.

En este caso, por ejemplo, el script que vamos a crear es el siguiente:

```json
{
  "scripts": {
    "scrapping": "node ssr/index.js"
  }
}
```

Lo llamaremos scrapping porque vamos a crearlo con la intención de hacer _scrapping_ (es decir, recorrer los contenidos reales de la aplicación para volcarlos en los componentes y comprobar que están correctos) en nuestro propio contenido, para hacer una mezcla entre ``cypress`` y `react-testing`.

# Funciones de node

## ``node:child_process``

Esta librería nos permite **ejecutar instrucciones de terminal**, tales como ``ls``, `mkdir`, etc.

> _The node:child_process module provides the ability to spawn subprocesses in a manner that is similar, but not identical, to popen(3). This capability is primarily provided by the child_process.spawn() function._

Para ejecutar estas funciones tenemos **dos maneras de hacerlo**:

1. De manera **síncrona** 🏃🏻‍♀️ 🏃🏼‍♂️ ==> **No bloquea** el hilo principal de Node.
2. De manera **asíncrona** 🕒 ==> **Bloquea** el hilo principal de Node.

### Lista de funciones de ``child_process``

#### ``exec``

🌏 [Documentación oficial](https://nodejs.org/docs/v24.13.1/api/child_process.html#child_processexeccommand-options-callback)

Esta función nos permite **ejecutar** acciones desde la terminal de la máquina (es decir, como si abriéramos la terminal y escribiéramos ``ls`` porque quisiéramos listar
los ficheros que hay en el directorio actual).

``exec`` recibe varios parámetros:

- El comando
- Las opciones posibles dentro del comando
- El callback

El comando **depende** del **sistema operativo** en el que nos encontremos, pues **no se trata de una lista de comandos propias de Node, sino de los comandos disponibles en tu
sistema operativo**. Por ejemplo, en ``macOS`` podemos escribir ``mkdir myNewDirectory`` en la terminal, pero en Windows **no podemos**.

☝️ Aquí dejo una lista de comandos disponibles en ``macOs``:

> 🌏 https://graphite.com/guides/mac-terminal-commands-cheat-sheet

#### exec "open"

> ☝️ https://scriptingosx.com/2017/02/the-macos-open-command/

El comando **open** es una instrucción que nos permite abrir (literalmente):

- 📁 Directorios y 📗 ficheros
- 👨🏽‍💻 Aplicaciones
- 📝 Editores de texto
- 🌏 Urls

> 🌏 https://graphite.com/guides/mac-terminal-commands-cheat-sheet#working-with-files
> 🌏 https://scriptingosx.com/2017/02/the-macos-open-command/

### Lista de funciones de ``net``
 
#### createServer y createConnection

> 🌏 createServer: https://nodejs.org/docs/v24.13.1/api/net.html#netcreateserveroptions-connectionlistener
> 🌏 createConnection: https://nodejs.org/docs/v24.13.1/api/net.html#netcreateconnection

Las funciones ``createServer`` y ``createConnection`` permiten crear y escuchar, consecuentemente, un servidor. Mediante la función `createServer` podemos crear (o levantar) un servidor, utilizando para ello un
puerto de la máquina. 

> 💭 Piensa en ello como si fuera la función ``server.listen()`` que se utiliza cuando creamos un backend con nodejs + express o fastify.

‼️ ``createServer`` es una función que existe en dos librerías: ésta (`net`) y en `http`. La diferencia entre una y otra reside en el **segundo argumento**. 

`createServer` de 🔗 [`http`](https://nodejs.org/docs/v24.13.1/api/http.html#httpcreateserveroptions-requestlistener) => ``http.createServer([options][, requestListener])``
`createServer` de 🔗 [`net`](https://nodejs.org/docs/v24.13.1/api/net.html#netcreateserveroptions-connectionlistener) => ``net.createServer([options][, connectionListener])``

☝️ Para la librería de testing, como lo que buscamos es crear una comunicación entre cliente-servidor (desde cliente, darle instrucciones; desde servidor, escucharlas) necesitamos utilizar la función proveniente de la librería
``net``, porque ``createClient`` es quien nos da un objeto de tipo ``connectionListener``.

# Desarrollo de la herramienta de Testing


# Protocolos IPC vs IPC




