---
name: test-components
description: Add test to basic usage for a component
---

# Components

## Rules

### Buttons

- **Must** contain text or images (any format).
- Property ``onclick`` **only is optional when button belongs to a form**

```javascript
/** Interface for ButtonComponent
 * @interface
 * @prop {onclick} [onClick]
 * @prop {string} [data-variant=primary]
 * @prop {string} type
 * @prop {string} type
 */
```
