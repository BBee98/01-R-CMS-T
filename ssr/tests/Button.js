const test__Button = (element) => {
  const children = element.props?.children

  const hasText = (child) => typeof child === 'string' || typeof child === 'number'
  const hasImage = (child) => child?.type === 'img' || child?.type === 'svg'
  const isValid = (child) => hasText(child) || hasImage(child)

  const hasContent = Array.isArray(children)
    ? children.some(isValid)
    : isValid(children)

  if (!hasContent) {
    return { pass: false, reason: 'Button has no text or image content' }
  }

  return onClick(element)
}
