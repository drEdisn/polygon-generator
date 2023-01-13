export type Num = number | null;

export interface Form {
  width: number,
  height: number,
  corners: number,
  color: string
}

export interface DotSetting {
  width: number,
  height: number,
  id: string,
  top: number,
  left: number,
  element: HTMLElement,
  costLeft: number,
  costTop: number,
}
