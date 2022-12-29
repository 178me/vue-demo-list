export interface TipProps {
  id?: string
  message?: string
  hdl?: (payload: MouseEvent) => void
  show?: boolean
}
