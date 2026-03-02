const onClick = (element) => {
  const handler = element.props?.onClick

  if (typeof handler !== 'function') {
    return { pass: false, reason: 'No onClick handler found on element' }
  }

  try {
    handler()
    return { pass: true }
  } catch (error) {
    return { pass: false, reason: error.message }
  }
}