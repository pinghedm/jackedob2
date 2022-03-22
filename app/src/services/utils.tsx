import { v4 as uuidv4 } from 'uuid'

export const cheapSlugify = (text: string) =>
    text
        .replace(/[^\w\s]|_/g, '') // remove all non ascii alphanumerics + whitespace (unlikely to have 2 qtexts meaningfully differ by a non ascii character.  for...now?  if we want real international support apparently you have to just manually specify what you don't want, JS doesnt support the unicode punctuation regex class natively.  we can pull in a dependency when it comes up)
        .replace(/\s+/g, ' ') // collapse all whitespace to one
        .trim()
        .replace(/\s/g, '-')
        .toLowerCase()

export const genPlanToken = () => `P_${uuidv4()}`
