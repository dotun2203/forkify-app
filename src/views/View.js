import icons from '../img/icons.svg';

export default class View {
  _data;

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();
    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const currentELements = Array.from(
      this._parentElement.querySelectorAll('*')
    );

    newElements.forEach((newEl, i) => {
      const curEl = currentELements[i];
      // UPDATE CHANGE TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }
      // UPDATE CHANGE ATTRIBUTES
      if (!newEl.isEqualNode(curEl)) {
        const newAtributes = Array.from(newEl.attributes);
        newAtributes.forEach(attribute =>
          curEl.setAttribute(attribute.name, attribute.nodeValue)
        );
      }
    });
  }

  _clear() {
    console.log(this._parentElement);
    this._parentElement.innerHTML = '';
  }

  renderSpinner = function () {
    const markup = `
   <div class="spinner">
          <svg>
            <use href="src/img/icons.svg#icon-loader"></use>
          </svg>
        </div>
        `;

    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  };

  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p> ${message} </p>
          </div> 
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderSuccessMessage(message = this._successMessage) {
    const markup = `
      <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p> ${message} </p>
          </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
