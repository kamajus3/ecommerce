import dynamicIconImports from 'lucide-react/dynamicIconImports'

export default interface Category {
  label: string
  icon: keyof typeof dynamicIconImports
}
