// Sanitize form data:
// - convert empty strings and undefined values to null (to correctly unset / delete fields)
// - trim whitespace on string fleids

type FormData = Record<string, any>

const sanitizeFormData = (formData: FormData): FormData => {
  return Object.keys(formData).reduce((acc: FormData, key) => {
    if (formData[key] === '' || typeof formData[key] === 'undefined') {
      acc[key] = null
    } else if (typeof formData[key] === 'string' && formData[key]) {
      acc[key] = formData[key].trim()
    } else {
      acc[key] = formData[key]
    }

    return acc
  }, {})
}

export default sanitizeFormData
