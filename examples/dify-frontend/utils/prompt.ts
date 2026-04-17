import type { PromptVariable, UserInputFormItem } from '@/types/app'

export const userInputsFormToPromptVariables = (useInputs: UserInputFormItem[] | null) => {
  if (!useInputs)
    return []
  const promptVariables: PromptVariable[] = []
  useInputs.forEach((item: any) => {
    const isParagraph = !!item.paragraph
    const [type, content] = (() => {
      if (isParagraph)
        return ['paragraph', item.paragraph]

      if (item['text-input'])
        return ['string', item['text-input']]

      if (item.number)
        return ['number', item.number]

      return ['select', item.select]
    })()
    const base = {
      key: content.variable,
      name: content.label,
      required: content.required,
      type,
    }
    if (type === 'string' || type === 'paragraph')
      promptVariables.push({ ...base, max_length: content.max_length, options: [] })
    else if (type === 'number')
      promptVariables.push({ ...base, options: [] })
    else
      promptVariables.push({ ...base, type: 'select', options: content.options })
  })
  return promptVariables
}
