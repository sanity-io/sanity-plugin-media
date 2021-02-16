// Recursively sanitize form data:
// - convert empty strings, undefined values and empty arrays to null (to correctly unset / delete fields)
// - trim whitespace on string fleids

type FormData = Record<string, any>

const sanitizeFormData = (formData: FormData): FormData => {
  return Object.keys(formData).reduce((acc: FormData, key) => {
    const val = formData[key]

    // TODO: refactor
    if (typeof val === 'object' && val !== null && val.constructor !== Array) {
      acc[key] = sanitizeFormData(val)
    } else if (val === '' || typeof val === 'undefined' || val?.length === 0) {
      acc[key] = null
    } else if (typeof val === 'string' && val) {
      acc[key] = formData[key].trim()
    } else {
      acc[key] = formData[key]
    }

    return acc
  }, {})
}

export default sanitizeFormData
