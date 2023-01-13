import { Form } from './types';
import Dot from './dot';

export default class Figure {
  costLeft: number;
  costTop: number;
  figure: Form;

  constructor(figure: Form) {
    this.figure = figure;
    this.costLeft = 100 / this.figure.width;
    this.costTop = 100 / this.figure.height;
  }

  createFigure() {
    const container = document.querySelector('.figure-content') as Element;
    const element = document.createElement('div');
    const fone = document.createElement('div');
    fone.classList.add('background');
    fone.style.width = `${this.figure.width + 20}px`;
    fone.style.height = `${this.figure.height + 20}px`;
    element.classList.add('figure');
    element.style.width = `${this.figure.width}px`;
    element.style.height = `${this.figure.height}px`;
    element.style.backgroundColor = this.figure.color;
    const polygon = this.createPolygon(fone, element);
    element.style.clipPath = polygon;
    fone.append(element);
    container.append(fone);
  }

  createPolygon(fone: Element, element: HTMLElement) {
    let polygon = 'polygon(';
    const r = (this.figure.width / 2) * this.costLeft;

    for (let i = 0; i < this.figure.corners; i += 1) {
      const angle = (2 * Math.PI * i) / this.figure.corners;
      const x = Math.round((Math.cos(angle) * r) + r);
      const y = Math.round((Math.sin(angle) * r) + r);
      const dot = new Dot({
        width: this.figure.width,
        height: this.figure.height,
        id: `${i}`,
        top: y,
        left: x,
        element,
        costLeft: this.costLeft,
        costTop: this.costTop,
      });
      fone.append(dot.setDot());
      polygon += `${x}% ${y}%,\n`;
    }

    polygon = polygon.replace(/,\n$/, '');
    return `${polygon})`;
  }
}
