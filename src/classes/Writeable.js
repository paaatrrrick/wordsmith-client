import WriteGood from 'write-good';
import Span from './Span.js';
import { GRAMMAR_CONSTANTS } from '../constants.js';


class Writeable {
    constructor(element, elementId) {
        this.element = element;
        this.elementId = elementId;
        this.text = element.innerText;
        this.errors = [];
        this.spans = {};
        this.i = 0;
        this.checkText();
        element.addEventListener('input', (event) => {
            console.log('updating')
            // this.checkText();
        });
    }

    removeSpan(spanId) {
        delete this.spans[spanId];
    }
    //replaceText() 
    //create a method to replace the text with the new text

    //create a method to check the text for errors
    checkText() {
        let errors = WriteGood(this.text);
        for (let error of errors) {
            error['action'] = 'delete'
            this.errors.push(error);
        }
        for (let error of this.errors) {
            this.i += 1;
            const span = new Span(this.element, this.elementId, error, this, `${this.elementId}-wordsmith-944-span-${this.i}`);
            this.spans[this.i] = span;
        }
    }
    //create a toString method for console.logs to show the text and elementId

    toString() {
        return `Element: ${this.elementId} Text: ${this.text}`;
    }
}


export default Writeable;