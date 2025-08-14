export interface SimpleFieldBase<T> {
  admin?: {
    description?: string
    hidden?: boolean
    placeholder?: string
  }
  defaultValue?: T
  name: string
  required?: boolean
}

export interface SimpleTextField extends SimpleFieldBase<string> {
  maxLength?: number
  minLength?: number
  type: 'text'
}

export interface SimpleTextareaField extends SimpleFieldBase<string> {
  maxLength?: number
  minLength?: number
  type: 'textarea'
}

export interface SimpleNumberField extends SimpleFieldBase<number> {
  max?: number
  min?: number
  type: 'number'
}

export interface SimpleCheckboxField extends SimpleFieldBase<boolean> {
  type: 'checkbox'
}

export interface SimpleSelectField extends SimpleFieldBase<string | string[]> {
  hasMany?: boolean
  options: Array<{ label: string; value: string }>
  type: 'select'
}

export interface SimpleDateField extends SimpleFieldBase<Date> {
  type: 'date'
}

export interface SimpleEmailField extends SimpleFieldBase<string> {
  type: 'email'
}

export type SimpleField =
  | SimpleCheckboxField
  | SimpleDateField
  | SimpleEmailField
  | SimpleNumberField
  | SimpleSelectField
  | SimpleTextareaField
  | SimpleTextField

export interface SimpleAccess {
  create?: boolean
  delete?: boolean
  read?: boolean
  update?: boolean
}

export interface SimpleSchema {
  access?: SimpleAccess
  admin?: {
    description?: string
    useAsTitle?: string
  }
  fields: SimpleField[]
  slug: string
}
