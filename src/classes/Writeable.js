import WriteGood from 'write-good';
import Span from './Span.js';


class Writeable {
    constructor(element, elementId) {
        this.element = element;
        this.elementId = elementId;
        this.text = element.innerText;
        this.errors = [];
        this.spans = [];
        console.log('Writeable is being created');
        this.checkText();
        console.log(this.errors)
        var i = 0
        for (let error of this.errors) {
            const span = new Span(this.element, this.elementId, error, this);
            this.spans.push(span);
        }
    }

    //create a method to check the text for errors
    checkText() {
        let errors = WriteGood(this.text);
        for (let error of errors) {
            error['action'] = 'delete'
            this.errors.push(error);
        }
        return errors;
    }
    //create a toString method for console.logs to show the text and elementId

    toString() {
        return `Element: ${this.elementId} Text: ${this.text}`;
    }
}


export default Writeable;