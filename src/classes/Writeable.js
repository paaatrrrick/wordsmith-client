import WriteGood from 'write-good';
import Span from './Span.js';
import { GRAMMAR_CONSTANTS } from '../constants.js';


class Writeable {
    constructor(element, elementId) {
        this.element = element;
        this.elementId = elementId;
        this.i = 0;
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
            this.i = 0;
            // this.i = 0;
            this.checkText(this.element.textContent);
        });
    }

    removeSpan(id) {
        if (this.spans[id]) {
            delete this.spans[id];
        }
    }

    checkText(text) {
        // console.log('checking text');
        // console.log(text);
        let errors = WriteGood(text);
        console.log(errors);
        for (let error of errors) {
            this.i += 1;
            const id = `${this.elementId}-wordsmith-944-span-${this.i}`;
            const span = new Span(this.element, this.elementId, error, this, id);
            console.log('creating span: ' + span);
            this.spans[id] = span;
        }
    };
}


export default Writeable;