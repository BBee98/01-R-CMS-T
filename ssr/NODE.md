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

### Lista de funciones de ``node:child_process``

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

## ``fs`` y ``fs/promises``

> 🌏 https://nodejs.org/docs/latest/api/fs.html

Esta librería nos permite hacer operaciones sobre ficheros: abrirlos, leerlos, escribirlos, modificarlos...
La librería ``fs`` lo hace manera síncrona (sin bloquear el hilo de ejecución), y `fs/promises` lo hace de manera asíncrona.


### Lista de funciones de ``fs``

### Lista de funciones de ``fs/promises``

#### ``readFile``

````javascript
export function readFile(
    path: PathLike | FileHandle,
    options: ({encoding: BufferEncoding, flag?: OpenMode | undefined} & Abortable) | BufferEncoding,
): Promise<string>
````

> 🌏 https://nodejs.org/docs/latest/api/fs.html#filehandlereadfileoptions

Permite leer un fichero y devolvernos el contenido:

> _Returns: <Promise> Fulfills upon a successful read with the contents of the file. If no encoding is specified (using options.encoding), the data is returned as a <Buffer> object. Otherwise, the data will be a string._

Podemos enviarle como parámetro qué tipo de **codificación** queremos utilizar para leer el fichero.

> 🌏 https://stackoverflow.com/questions/14551608/list-of-encodings-that-node-js-supports

#### Anexo

Si quieres saber la fuente original, en la propia librería de ``node``: 🌏 https://github.com/nodejs/node/blob/main/lib/buffer.js#L750, en esa función llamada
``getEncodingOptions`` nos aparece la lista completa de posibilidades.


------

En caso de que **no mandemos ninguna opción codificadora**, los datos del fichero serán devueltos de tipo ``buffer``.

Por ejemplo:

Caso 1️⃣: añadimos una opción de codificación

```javascript
    let contentFromEnvFile = await node_asyncFs.readFile(envFile, "utf-8");
```

El contenido obtenido del fichero en cuestión estará en formato ``utf-8``. Podría ser algo como esto:

```.dotenv
REPOSITORY_COMPONENTS_FOLDER="components";
REPOSITORY_COMPONENTS_FILE="index"
```

Caso 2️⃣: Sin añadir una opción de codificación

Si la instrucción la mandamos sin una codificación, tal que así:


````javascript
    let contentFromEnvFile = await node_asyncFs.readFile(envFile);
````

Se nos devolverá la data contenida dentro del fichero en formato ``buffer``:

````javascript
FileHandle {
    _events: [Object: null prototype] {},
    _eventsCount: 0,
        _maxListeners: undefined,
        close: [Function: close],
    Symbol(shapeMode): false,
        Symbol(kCapture): false,
        Symbol(kHandle): FileHandle {},
    Symbol(kFd): 11,
        Symbol(kRefs): 1,
        Symbol(kClosePromise): null
}
````

Y para poder leerlo necesitaríamos utilizar la librería ``Buffer`` (también está en node)

> 🌏 https://nodejs.org/docs/latest/api/buffer.html

## ``net``

Esta librería nos permite crear conexiones desde lado cliente y desde lado servidor.

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

## ``node:process``

> ‼️No confundir con node:child_process

> 🌏 https://nodejs.org/docs/latest/api/process.html

Nos permiten controlar **procesos de node** que **se encuentran en ejecución**. Esto se utiliza frecuentemente en la instrucción ``process.env`` para leer las variables de entorno de los repositorios
con node, pero también puede importarse localmente mediante ``require("node:process")`` o ``import from "node:process"``.

Algunas de las acciones que te permiten hacer son:

- Obtener las variables de entorno (como dijimos antes)
- Obtener la información del sistema (como qué sistema operativo usa la máquina, y en los casos de linux y mac podemos saber qué distribución se está utilizando).
- La versión de node instalada en el sistema del usuario
- La memoria en uso  

### Lista de funciones de ```node:process```

#### argv

Permite obtener **todos los argumentos** mandados por la terminal. Llegan en forma de ``Array``.
Por ejemplo:

```bash
node ssr/compileComponents.js --env-file=.env
```

Obtendrías algo como:

````bash
[
  '[directorio]/node_modules/node/bin/node',
  '[directorio]/ssr/compileComponents.js',
  '--env-file=.env'
]
````

- El primer argumento sería la propia instrucción ``node``. Está enviando la ruta en la que reside `node` en el proyecto.
- El segundo, el fichero de ejecución. Al igual que en el primer argumento, se envía la ruta en la que reside el fichero.
- El tercero, la opción extra (o `flag`). Cada opción o `flag` añade un argumento más.

#### ``cwd``

Nos retorna la ruta raíz del proyecto:

```javascript
let node_process = require("node:process");
let rootFile = process.cwd();
```

# Desarrollo de la herramienta de Testing


# Protocolos IPC vs IPC




