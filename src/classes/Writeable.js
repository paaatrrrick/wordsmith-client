import WriteGood from 'write-good';
import Span from './Span.js';
import { GRAMMAR_CONSTANTS } from '../constants.js';


class Writeable {
    constructor(element, elementId) {
        console.log('being created');
        this.element = element;
        this.elementId = elementId;
        this.i = 0;
        this.spans = {};
        this.checkText(element.textContent);
        element.addEventListener('input', (event) => {
            if (this.i > 1) {
                console.log('removing spans from writeable');
                for (let span in this.spans) {
                    const currentSpan = this.spans[span];
                    currentSpan.deleteOuterSpan(false);
                }
                this.spans = {};
            }
            this.checkText(element.textContent);
        });
    }

    removeSpan(id) {
        if (this.spans[id]) {
            delete this.spans[id];
        }
        console.log('updated');
        console.log(this.spans);
    }
    //replaceText() 
    //create a method to replace the text with the new text

    //create a method to check the text for errors
    checkText(text) {
        let errors = WriteGood(text);
        for (let error of errors) {
            this.i += 1;
            const id = `${this.elementId}-wordsmith-944-span-${this.i}`;
            const span = new Span(this.element, this.elementId, error, this, id);
            console.log('updated checkText');
            this.spans[id] = span;
            console.log(this.spans);
        }
    };
    //create a toString method for console.logs to show the text and elementId
}


export default Writeable;