import { Form } from './types';

export default function getTemplate(form: Form, figure: HTMLElement) {
  return `
    <div class="result">
      <div class="result__item">
        <strong>height:</strong>
        <i class="result-text">${form.height}</i>
        <strong>;</strong>
      </div>
      <div class="result__item">
        <strong>width:</strong>
        <i class="result-text">${form.width}</i>
        <strong>;</strong>
      </div>
      <div class="result__item">
        <strong>background:</strong>
        <i class="result-text">${form.color}</i>
        <strong>;</strong>
      </div>
      <div class="result__item">
        <strong>clip-path:</strong>
        <i class="result-text">${figure.style.clipPath}</i>
        <strong>;</strong>
      </div>
      <button type="button" class="result__close button">OK</button>
    </div>
  `;
}
