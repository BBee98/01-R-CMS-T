# CLAUDE TIPS

# **SKILLS**

Las skills son **ficheros** que se pueden añadir **dentro del contexto de Claude** para que realice una tarea
**siguiendo las instrucciones escritas en estos ficheros**.

Por ejemplo: Si queremos escribir una carta de presentación, podemos indicarle qué tono utilizar, qué palabras evitar, cómo estructurarla,
qué cosas añadir, qué información no dar o sobre cuál hacer más hincapié..

Una skill se compone, principalmente, de **tres secciones** o **niveles**

#### 🙋🏼‍♀️ Primer nivel: YAML Formatter**.

Es una sección pequeña donde definimos:

1. El **sobrenombre** por el cual se lanzara esta skill.
2. La **descripción**: un breve texto explicativo de lo que hace la skill que estamos creando.

🗒️ Ejemplo:

```yaml
---
name: write-presentation-card
description: Write a presentation card about myself
---
```

#### 👨🏽‍💻️ Segundo nivel: body (o cuerpo)**.

Contiene la **instrucción en sí misma**. Es donde redactamos **qué instrucciones debe seguir Claude para hacer sus tareas**.

```
- First level (YAML frontmatter): Always loaded in Claude's system prompt.
Provides just enough information for Claude to know when each skill should
be used without loading all of it into context.

- Second level (SKILL.md body): Loaded when Claude thinks the skill is
relevant to the current task. Contains the full instructions and guidance.

- Third level (Linked files): Additional files bundled within the skill directory
that Claude can choose to navigate and discover only as needed.
```

## ¿Cómo redactar una skill?


Algunos **tips** para crear skills son los siguientes:

#### 1️⃣ **Ser conciso**

Claude **es capaz por sí mismo** de entender el contexto de la gran mayoría de cosas.
Cuando Claude tiene el contexto a toda la información que se ha ido gestando
(por ejemplo: conversaciones compartidas, sesiones, caché, etc.) **no es necesario** aportarle más
información; de hecho, eso puede **provocar** un mayor gasto de tokens:

> 🌎https:t//platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices#concise-is-key

Esto significa que Claude es capaz de **discernir** _qué herramientas debe de utilizar y cómo debe utilizarlas para
realizar las tareas_

> "The Claude series of models (Opus, Sonnet, Haiku) are particularly strong at understaing what tools do and using them
> to complete tasks"
> 🌎 https://anthropic.skilljar.com/claude-code-in-action/303235

Se crean con la siguiente estructura:

```
• SKILL.md (required): Instructions in Markdown with YAML frontmatter
• scripts/ (optional): Executable code (Python, Bash, etc.)
• references/ (optional): Documentation loaded as needed
• assets/ (optional): Templates, fonts, icons used in output
```

> 🌎https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf?hsLang=en


Por ejemplo, en esta skill:

```markdown
---
name: test-basic-behaviour-components
description: Create tests for basic usages of components
---

# Basic behavior from html elements

- Inline text semantics: HTMLElements like paragraphs, buttons, links and titles **must** contain text.
- Interactive Elements: **must** display information.
- Content sections: **must** contain children elements.
- Text content: **must** contain text.
- Image and multimedia: **must** display **any source** of multimedia.
```

## Ficheros extra para definir las skills

### **REFERENCE[.md](http://Reference.md)**

**A favor de separar cada patrón en su propio REFERENCE:**

* **Context window eficiente** — En Claude Console solo inyectas el REFERENCE relevante para la tarea en curso, en lugar de enviar todos los patrones en cada llamada. Esto reduce tokens y mejora el foco del modelo.
* **Mantenimiento granular** — Puedes actualizar, versionar o deprecar un patrón sin tocar los demás.
* **Composable** — Puedes combinar varios REFERENCEs según el contexto, por ejemplo inyectar Container/Presentational \+ Custom Hook juntos cuando la tarea los requiera ambos.

# RECURSOS

| Curso de claude | https://www.anthropic.com/ |
| :---: | :---: |
|  |  |
|  |  |
|  |  |
|  |  |

