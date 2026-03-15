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

## ```node:buffer```

> 🌏 https://nodejs.org/docs/latest/api/buffer.html#buffer

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

‼️ ``createServer`` es una función que existe en dos librerías: ésta (`net`) y en `http`. 
El servidor generado por ambas librerías soportan los protocolos `TCP` y `UDP`

> 💁🏻‍♂️ ¿Cuál es la diferencia entre el protocolo TCP y el protocolo UDP?
> 🌏 https://www.avast.com/es-es/c-tcp-vs-udp-difference
> Básicamente, el TCP es un protocolo que, cuando envía los datos, escucha al receptor para saber si estos datos **llegaron bien**, mientras que el UDP se desentiende de ello.
> Eso hace que el protocolo TCP sea **más lento** y que el UDP sea **más rápido**, pero a la vez ocasiona que algún paquete de información no llega cuando usamos el protocolo UDP, éste se pierda, mientras
> que en el TCP se vuelve a enviar.

> 💁🏻‍️ ¿Cuál es la diferencia entre usar ``createServer`` desde la librería `net` y usarla desde `http`?
> 
> La diferencia es que ``net`` crea un servidor **que no usa protocolo http**, por lo que todas las acciones que quieras **hacer desde un navegador, no funcionarán**. Para que funcionen,
> debes crear un servidor que **tenga** protocolo http.
> 
> ☝️ Es cierto que podrías configurar manualmente el protocolo con ``createSerer`` de `net`, pero `http` ya realiza esa acción y resulta más sencillo de usar.
> 
> Además, si te fijas en la documentación y los parámetros que reciben:
> 
> `createServer` de 🔗 [`http`](https://nodejs.org/docs/v24.13.1/api/http.html#httpcreateserveroptions-requestlistener) => ``http.createServer([options][, requestListener])``
> `createServer` de 🔗 [`net`](https://nodejs.org/docs/v24.13.1/api/net.html#netcreateserveroptions-connectionlistener) => ``net.createServer([options][, connectionListener])``
 

🧏🏻‍♂️ Para la librería de testing, como lo que buscamos es un servidor con protocolo ``http``, necesitamos usar la de la librería `http`:

````javascript
let node_childProcess = require("node:child_process");
let node_http = require("node:http");

let server = null;
let client = null;

const { readComponents: c, readEnvs: e } = require('./funcs');

(async function Start() {
    await e.Prepare__Environment();
    const clientComponents = await c.Prepare__Components();
    server = node_http.createServer((req, res) => {

    });
    await server.listen(4998);
    node_childProcess.exec("open http://localhost:4998")
})();
````


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
node ssr/readComponents.js --env-file=.env
```

Obtendrías algo como:

````bash
[
  '[directorio]/node_modules/node/bin/node',
  '[directorio]/ssr/readComponents.js',
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

# Renderizar un componente React en el browser con esbuild

> ‼️ **IMPORTANTE** ‼️

Para que un componente React aparezca en el browser hay **dos requisitos que deben cumplirse a la vez**. Si falta cualquiera de los dos, el componente no se renderiza.

## 1. El HTML necesita un nodo donde montar React

React no pinta nada en el `<body>` por sí solo. Necesita un elemento del DOM como punto de entrada:

```html
<body>
    <div id="root"></div>
</body>
```

Sin este `<div>`, `createRoot(document.getElementById('root'))` devuelve `null` y React lanza un error.

> ‼️ **IMPORTANTE**: la etiqueta `<script>` debe tener `type="javascript"`. Sin él, el browser puede interpretarla como un módulo ES (`type="module"`) y activar resolución de imports nativa, lo que provocaría el error `Failed to resolve module specifier` incluso con el bundle correctamente generado:
>
> ```html
> <script type="javascript">{{COMPONENT_SCRIPT}}</script>
> ```

## 2. El bundle debe incluir el código de mounting

Cuando esbuild transpila un componente con `entryPoints`, **solo exporta el componente** — no lo monta.
Si el script resultante no llama a `createRoot().render(...)`, el componente nunca aparece aunque el `<div id="root">` exista.

**Solución:** usar la opción `stdin` de esbuild para inyectar el código de mounting dentro del propio bundle:

```javascript
const mountCode = `
import Component from '.';
import { createRoot } from 'react-dom/client';
import React from 'react';
createRoot(document.getElementById('root')).render(React.createElement(Component.default ?? Component, null));
`;

const transpiledCode = await esBuild.build({
    stdin: {
        contents: mountCode,
        resolveDir: componentFolder, // carpeta del componente, resuelve el import '.'
        loader: 'jsx',
    },
    loader: { '.js': 'jsx' },
    bundle: true,
    write: false,
    platform: 'browser',
    format: 'iife',
});
```

Con `resolveDir: componentFolder`, el `import Component from '.'` resuelve al `index.js` de esa carpeta.
El bundle resultante contiene React + el componente + el mounting en un único IIFE listo para el browser.

> ☝️ `Component.default ?? Component` cubre tanto exports `default` como `module.exports` directos.

## ☝️ El `loader` en esbuild aplica por fichero, no globalmente

El `loader` le dice a esbuild **en qué formato está escrito el código de entrada** para que sepa cómo parsearlo.

Cuando se usa `stdin`, pueden coexistir **dos loaders distintos** que aplican a ficheros distintos:

```javascript
const transpiledCode = await esBuild.build({
    stdin: {
        contents: mountCode,
        resolveDir: componentFolder,
        loader: 'js',        // ← el mountCode no tiene JSX, solo require() y createElement
    },
    loader: { '.js': 'jsx' }, // ← los .js que se encuentren al resolver dependencias sí son JSX
    ...
});
```

- **`stdin.loader: 'js'`** — aplica únicamente al código del `stdin`. Si ese código no tiene JSX, `js` es suficiente.
- **`loader: { '.js': 'jsx' }`** — aplica a cualquier fichero `.js` que esbuild encuentre al resolver los `require`/`import` del bundle (es decir, los componentes). Como esos sí están escritos en JSX, necesitan este loader.

Los dos conviven sin conflicto porque cada uno aplica a su propia entrada.

## ☝️ El transform de JSX depende de la versión de React

esbuild tiene dos modos de transformar JSX:

| Opción `jsx` | React | Comportamiento |
|---|---|---|
| `'transform'` | < 17 | Transform clásico. Convierte JSX en `React.createElement(...)`. **Requiere `import React` en cada fichero que use JSX.** |
| `'automatic'` | ≥ 17 | Nuevo transform. Usa `react/jsx-runtime` internamente. **No requiere `import React` en los componentes.** |

Para detectar la versión en tiempo de ejecución y aplicar la configuración correcta:

```javascript
const React = require('react');

const g__reactMajorVersion = parseInt(React.version.split('.')[0], 10);
const g__jsxTransform = g__reactMajorVersion >= 17 ? 'automatic' : 'transform';

esBuild.build({
    // ...
    jsx: g__jsxTransform,
});
```

> ⚠️ Con `'transform'` (React < 17), si un componente usa JSX sin `import React from 'react'`, fallará en runtime con `React is not defined`.

## ⚠️ Warning: inyectar el bundle en un template HTML con `String.replace`

Al insertar el código transpilado por esbuild en un template HTML usando `String.replace`, pueden darse **dos errores silenciosos** que hacen que el placeholder no se reemplace:

### 1. Los strings son inmutables en JavaScript

`String.replace` **no muta** el string original, devuelve uno nuevo. Si no asignas el resultado, el cambio se pierde:

```javascript
// ❌ Mal — el resultado se descarta
template.replace("{{COMPONENT_SCRIPT}}", code);
return template; // sigue con el placeholder sin reemplazar

// ✅ Bien — se encadena o se asigna
const html = template.replace("{{COMPONENT_SCRIPT}}", () => code);
return html;
```

### 2. El bundle de esbuild contiene `$` y rompe el reemplazo

Cuando el segundo argumento de `replace` es un **string**, JavaScript interpreta secuencias como `$&`, `$'` o `$$` como patrones especiales de reemplazo. El output de esbuild contiene `$` habitualmente, lo que corrompe o trunca el resultado.

La solución es pasar una **función** como replacer — las funciones no tienen esa interpretación especial:

```javascript
// ❌ Mal — el $ del bundle se interpreta como patrón
template.replace("{{COMPONENT_SCRIPT}}", code);

// ✅ Bien — la función evita la interpretación de $
template.replace("{{COMPONENT_SCRIPT}}", () => code);
```

---

## ☝️ Cómo depurar que el bundle llega al browser

Cuando el componente no se renderiza y no hay error visible, el problema puede estar en cualquier punto del pipeline. La estrategia es añadir `console.log` en cada capa para aislar dónde falla:

**Lado servidor** — confirmar que el bundle se genera y llega al template:
```javascript
// En react__mount.js
console.info("[react__mount] Bundle generado. Tamaño:", bundleText.length, "chars");
console.info("[react__mount] Preview:", bundleText.slice(0, 300));

// En renderComponents.js
console.info("[renderComponents] Nº de componentes:", script.length);
console.info("[renderComponents] HTML generado. ¿Contiene bundle?", !html.includes("{{COMPONENT_SCRIPT}}"));
```

**Lado browser** — añadir logs dentro del propio `mountCode` para que se ejecuten dentro del bundle:
```javascript
const mountCode = `
// ...
console.log('[cluebee] Component:', Component);
console.log('[cluebee] Root element:', document.getElementById('root'));
createRoot(document.getElementById('root')).render(React.createElement(Component, null));
console.log('[cluebee] render() llamado');
`;
```

> ☝️ Los logs del servidor aparecen en la terminal. Los del browser aparecen en **DevTools > Console**.

## ⚠️ Warning: `readdir` devuelve ficheros en orden alfabético

`fs.readdir` no garantiza ningún orden concreto, pero en la práctica devuelve los directorios **por orden alfabético**. Esto significa que `script[0]` no es necesariamente el componente que esperas — si `Accordion` existe junto a `Button`, será siempre el primero.

Acceder a un índice fijo (`script[0]`, `script[1]`) es frágil. La solución es **iterar sobre todos los scripts** y generar un string concatenado:

```javascript
const allScripts = script.map(s => s.code).join('\n');
return template.replace("{{COMPONENT_SCRIPT}}", () => allScripts);
```

Cada bundle es un IIFE autocontenido, por lo que concatenarlos no genera conflictos de variables entre componentes.

---

# Protocolos IPC vs IPC




