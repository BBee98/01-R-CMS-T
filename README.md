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

# Desarrollo de la herramienta de Testing

## Arquitectura: cliente y servidor

La herramienta se divide en dos partes con responsabilidades claramente separadas:

**Servidor (Node.js)**
- Orquesta el proceso de testing
- Lee los ficheros `.clue.js` del proyecto del cliente
- Transpila los componentes React a JavaScript vanilla
- Envía las instrucciones al cliente
- Recibe los datos en crudo del cliente y aplica la lógica de comparación
- Determina PASS o FAIL y muestra los resultados

**Cliente (browser)**
- Actúa como _thin client_: ejecuta lo mínimo necesario
- Renderiza los componentes (cuando es necesario, por ejemplo para hooks)
- Ejecuta las queries al DOM
- Reporta los datos en crudo al servidor — nunca decide si un test pasa o falla

El cliente **no contiene lógica de testing**. Solo recolecta y reporta.

## Cluebee: la librería de testing

La herramienta de testing se llamará provisionalmente **Cluebee** y será una librería **instalable vía npm** por cualquier proyecto cliente.

El proyecto cliente la integrará como dependencia de desarrollo:

```bash
npm install --save-dev cluebee
```

Una vez instalada, el proyecto cliente crea ficheros `.clue.js` que declaran **qué** se quiere testear, sin necesidad de saber **cómo** funciona la librería internamente:

```js
// src/components/Button/Button.clue.js
export default {
  component: Button,
  tests: [
    { action: { type: 'click', selector: 'button' }, expect: { selector: '#result', text: 'Enviado' } }
  ]
}
```

La lógica del _cómo_ (ejecutar el click, comparar el resultado, determinar PASS/FAIL) la resuelve Cluebee, no el proyecto cliente.

## Tests genéricos

Los tests genéricos viven dentro de **Cluebee**, no en el proyecto cliente. Son tests reutilizables que cubren los casos comunes de cualquier componente:

- Comprobar que un botón contiene un texto o icono determinado
- Comprobar que los handlers (`onClick`, `onChange`...) existen y se ejecutan
- Comprobar que elementos de contenido (`p`, `h1`-`h6`) contienen el texto correcto
- Comprobar que elementos se muestran u ocultan según el estado

El proyecto cliente **no reimplementa** estos tests: simplemente declara qué quiere verificar en sus `.clue.js` y Cluebee aplica el test genérico correspondiente.

### Separación por tipo de test

Dentro de Cluebee, los tests genéricos se separan según lo que necesitan para ejecutarse:

| Módulo | Qué testea | Necesita React runtime |
|---|---|---|
| `tests/Events.js` | Handlers (`onClick`, etc.) sobre el elemento transpilado | No |
| `tests/Hooks.js` | Efectos de hooks observados en el DOM renderizado | Sí |
