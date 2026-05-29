let lastPickedElement: Element | null = null;

export function storeLastPickedElement(element: Element): void {
  lastPickedElement = element;
}

export function getLastPickedElement(): Element | null {
  if (!lastPickedElement?.isConnected) {
    lastPickedElement = null;
    return null;
  }
  return lastPickedElement;
}

export function clearLastPickedElement(): void {
  lastPickedElement = null;
}
