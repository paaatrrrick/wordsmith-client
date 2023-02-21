import WriteGood from 'write-good';
import Span from './Span.js';


class ContentEdit {
    constructor(element, elementId) {
        this.element = element;
        this.elementId = elementId;
        this.spans = {};
        this.checkText(element.textContent);
        this.inputEventListener();
    }

    inputEventListener() {
        this.element.addEventListener('input', (event) => {
            for (let span in this.spans) {
                const currentSpan = this.spans[span];
                currentSpan.deleteOuterSpan(false);
            }
            this.spans = {};
            this.checkText(this.element.textContent);
        });
    }

    removeSpan(id) {
        if (this.spans[id]) {
            delete this.spans[id];
        }
    }

    checkText(text) {
        let errors = WriteGood(text);
        for (let error of errors) {
            const id = `${this.elementId}-wordsmith-944-span-${this.generateId()}`;
            const span = new Span(this.element, this.elementId, error, this, id);
            this.spans[id] = span;
        }
    };


    //generate a random id in a fast time complexity
    generateId() {
        const id = Math.random().toString(36).substr(2, 9);
        return id;
    }


}


export default ContentEdit;