# Inicializando el proyecto

## Configuración de la aplicación

- React 19
- Node

- Parcel

## Instalación

- Instalamos el proyecto utilizando `npx create-react-app my-app`

> 👉 <u>Recordatorio de que el proyecto está basado en React 19</u>

- Para crear el ``bundle`` del proyecto, utilizaremos **Parcel**.

## El bundle y su función

> _A web bundler is a tool or software utility used in web development whose primary purpose is to improve the performance of web applications._
> 🌏 [Harshit Kumar](https://medium.com/@geraharshitkumar/parcel-js-a-bundler-to-fall-in-love-with-b08203760054)# 01-R-CMS-T

---

# Arquitectura de testing de componentes (`ssr/`)

Su objetivo es testear componentes web (React y JavaScript vanilla) sin dependencias externas ni frameworks de testing.

## Principio fundamental de la librería

Todo lo que es **genérico o core** vive en el servidor (Node). El navegador actúa únicamente como ejecutor mínimo de DOM.

| Capa | Responsabilidad |
|---|---|
| **Librería (servidor Node)** | Define los tipos de test, genera los scripts del navegador, compara resultados, reporta PASS/FAIL |
| **Proyecto (`.clue.js`)** | Declara de forma descriptiva qué se quiere testear |
| **Navegador** | Ejecuta queries de DOM, recoge datos crudos, los envía al servidor |

## Flujo de un test

```
1. Servidor lee el componente y su archivo .clue.js
2. Servidor genera el HTML: componente montado + script mínimo de recogida de datos
3. Navegador recibe el HTML y lo renderiza
4. Script ejecuta la acción (click, input...) y recoge el dato crudo del DOM
5. Navegador envía el dato crudo al servidor via POST /test-result
6. Servidor aplica la lógica del tipo de test y compara con el valor esperado
7. Servidor imprime el resultado: PASS o FAIL
```

## Rutas del servidor

No existe una ruta por test ni por componente. Las rutas son genéricas:

```
GET  /component/:nombre   →  sirve el HTML con el componente + script de recogida
POST /test-result         →  recibe datos crudos del navegador y determina el veredicto
```

El nombre del test y el tipo de aserción viajan dentro del body del POST, no en la URL.

## Cómo se define un test en el proyecto

Los archivos `.clue.js` son **declarativos**: solo describen qué testear. No contienen lógica de cómo hacerlo, eso lo resuelve la librería.

```js
// src/components/Accordion/Accordion.clue.js
module.exports = [
  {
    type: "checkText",           // tipo genérico definido en la librería
    action: { click: ".accordion-header" },
    selector: ".accordion-body",
    expected: "foo"
  },
  {
    type: "isClickable",         // otro tipo genérico de la librería
    selector: ".btn-close"
  }
]
```

## Tipos de test genéricos (definidos en la librería)

>>> POR CORREGIR 
Los tipos de test son responsabilidad de `ssr/`. Cada tipo sabe:
- Qué query de DOM hay que hacer en el navegador para recoger el dato
- Cómo comparar el dato recibido con el valor esperado
<<<<

Ejemplos de tipos previstos:

| Tipo | Qué recoge el navegador | Qué compara el servidor |
|---|---|---|
| `checkText` | `element.textContent` | igualdad de cadenas (trim) |
| `isClickable` | `!element.disabled && element.offsetParent !== null` | booleano |
| `isVisible` | `element.offsetParent !== null` | booleano |
| `checkAttribute` | `element.getAttribute(attr)` | igualdad de cadenas |

## Separación cliente / librería

El script que corre en el navegador lo **genera la librería en el servidor**. El proyecto nunca escribe código que vaya al navegador: solo escribe archivos `.clue.js` declarativos.

```
src/components/Accordion/
  Accordion.jsx        ← el componente
  Accordion.clue.js    ← la declaración del test (qué, no cómo)

ssr/
  core/               ← tipos de test, lógica de comparación, generador de scripts
  funcs/              ← lectura de componentes, lectura de tests, renderizado
  index.js            ← servidor HTTP
```

## Problemas encontrados

### ``exports is not defined`` y ``require is not defined``

👩🏼‍🏫‍ **Esto ocurre** porque ``react 19`` está basado en **CommonJS**, lo cual **no es comprensible por el navegador**.
Añadir ``type module`` a la etiqueta `script` no servirá, porque el código de react está en formato `CommonJS` (como mencionamos antes), y `module` solo sirve
para javascript basado en ``node``.


💁🏻‍♂️ **Cómo arreglarlo**: hay que **parsear el código javascript**, ya sea con ``parcel``, `webkit` o `babel` para crear un código comprensible para el navegador.

### El directorio UMD: React version > v18

React siempre ha dividido sus módulos de uso en 2 carpetas principales: ``umd`` y ``cjs``.

- ``umd`` es la carpeta utilizada en el entorno de **desarrollo**.
- ``cjs`` es la carpeta utilizada en el entorno de **producción**.

> ☝️ Cuando implementamos React en nuestros proyectos, la propia librería utiliza una u otra dependiendo del entorno que detecta en las variables de entorno.
> Sin embargo, en este proyecto, donde buscamos minimizar el número de dependencias lo máximo posible, encontraremos un "problema".

Las versiones de react superiores a v18 **no incluyen** el directorio de ``umd``, puesto que éste se eliminó en favor de un desarrollo más **homogéneo**. 
Como la librería de testing pretende tener el mínimo de dependencias, la solución ideal sería importar la librería de react en los ``scripts`` del html generado para servir en el servidor,
pero se utilizan términos como ``export`` o `process` que dan los siguientes problemas:

☝️ [Aquí se explica más en profundidad](#exports-is-not-defined-y-require-is-not-defined)

