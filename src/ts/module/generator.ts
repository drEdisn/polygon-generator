import Figure from './figure';
import getTemplate from './getTemplate';
import { Form } from './types';

export default class Generator {
  values: Form;

  constructor() {
    this.values = {
      width: 0,
      height: 0,
      corners: 0,
      color: '',
    };
  }

  init() {
    this.setEvent();
  }

  private setEvent() {
    const form = document.querySelector('#form') as HTMLFormElement;
    const getButton = document.querySelector('.get') as HTMLElement;
    form.onsubmit = (e) => this.formEvent(e, form);

    getButton.addEventListener('click', () => {
      this.createResult();
      this.changeButton();
      this.cleanAll();
    });
  }

  private formEvent(e: Event, form: HTMLFormElement) {
    e.preventDefault();
    this.values = this.checkInputs(form);
    if (this.checkValues(this.values)) {
      const figure = new Figure({
        width: this.values.width,
        height: this.values.height,
        corners: this.values.corners,
        color: this.values.color,
      });
      figure.createFigure();
      this.changeButton();
    }
  }

  private checkInputs(form: HTMLFormElement): Form {
    const formData = new FormData(form);

    return {
      width: Number(formData.get('width')) as unknown as number,
      height: Number(formData.get('height')) as unknown as number,
      corners: Number(formData.get('corners')) as unknown as number,
      color: formData.get('color') as unknown as string,
    };
  }

  private checkValues(form: Form): boolean {
    const content = document.querySelector('.figure-content') as HTMLElement;

    return form.width < content.clientWidth && form.width >= 100
      && form.height < content.clientHeight && form.height >= 100
      && form.corners >= 3 && form.corners < 100;
  }

  private changeButton() {
    const createButton = document.querySelector('.create') as HTMLElement;
    const getButton = document.querySelector('.get') as HTMLElement;

    createButton.classList.toggle('_no-active');
    getButton.classList.toggle('_no-active');
  }

  private cleanAll() {
    const content = document.querySelector('.figure-content') as HTMLElement;
    const inputs = document.querySelectorAll('.value');

    inputs.forEach((input) => {
      (input as HTMLInputElement).value = '';
    });
    content.innerHTML = '';
  }

  private createResult() {
    const main = document.querySelector('.main') as HTMLElement;
    const figure = document.querySelector('.figure') as HTMLElement;
    const result = document.createElement('div');

    result.innerHTML = getTemplate(this.values, figure);
    main.append(result);

    this.setResultEvents(result);
  }

  private setResultEvents(result: HTMLElement) {
    const close = document.querySelector('.result__close') as HTMLElement;
    result.onclick = (e) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('result-text')) {
        window.getSelection()?.selectAllChildren(target);
        document.execCommand('copy');
        window.getSelection()?.removeAllRanges();
        alert('text copied');
      }
    };
    close.onclick = () => {
      const res = document.querySelector('.result');
      res?.remove();
    };
  }
}
