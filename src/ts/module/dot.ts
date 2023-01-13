import checkLimit from './checkLimit';
import { DotSetting } from './types';

export default class Dot {
  dot: DotSetting;

  constructor(dot: DotSetting) {
    this.dot = dot;
  }

  setDot() {
    const dot = document.createElement('div');
    this.createDotStyle(dot);
    dot.addEventListener('mousedown', (e) => {
      const shiftX = e.clientX - dot.getBoundingClientRect().left;
      const shiftY = e.clientY - dot.getBoundingClientRect().top;
      const activeMove = (ev: MouseEvent) => this.move(ev, shiftX, shiftY, dot);

      document.addEventListener('mousemove', activeMove);
      document.onmouseup = () => {
        document.removeEventListener('mousemove', activeMove);
        document.onmouseup = null;
      };
    });
    dot.ondragstart = () => false;
    return dot;
  }

  createDotStyle(dot: HTMLElement) {
    dot.classList.add('dot');
    dot.setAttribute('side', this.dot.id);
    dot.style.top = `${this.dot.top / this.dot.costTop}px`;
    dot.style.left = `${this.dot.left / this.dot.costLeft}px`;
  }

  move(e: MouseEvent, shiftX: number, shiftY: number, dot: HTMLElement) {
    const incurr = 10;
    const left = checkLimit(
      e.clientX - shiftX - this.dot.element.getBoundingClientRect().left + incurr,
      this.dot.width,
    );
    const top = checkLimit(
      e.clientY - shiftY - this.dot.element.getBoundingClientRect().top + incurr,
      this.dot.height,
    );
    const id = dot.getAttribute('side') as string;

    dot.style.left = `${left}px`;
    dot.style.top = `${top}px`;
    this.dot.element.style.clipPath = this.changePolygon(this.dot.element, +id, left, top);
  }

  changePolygon(element: HTMLElement, id: number, left: number, top: number) {
    const digits = element.style.clipPath.replace(/[a-z)(]/g, '').split(',');
    digits[id] = ` ${Math.floor(left * this.dot.costLeft)}% ${Math.floor(top * this.dot.costTop)}%`;
    return `polygon(${digits.join(',')})`;
  }
}
