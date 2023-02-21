import WriteGood from 'write-good';
import Highlight from "./Highlight";

class Textarea {
    constructor(element, elementId, isTextarea) {
        console.log('creating textarea: ' + isTextarea);
        this.element = element;
        this.elementId = elementId;
        this.ignore = {};
        this.isTextarea = isTextarea;
        if (isTextarea) {
            this.checkText(element.value);
        } else {
            this.checkText(element.textContent);
        }
        this.inputEventListener();

    }


    addToIgnore(id) {
        this.ignore[id] = true;
    }

    getElementId() {
        return this.elementId;
    }

    inputEventListener() {
        this.element.addEventListener('input', (event) => {
            this.removeAllHighlights();
        });
    }



    removeAllHighlights() {
        const highlights = document.querySelectorAll(`.${this.elementId}`);
        for (let highlight of highlights) {
            highlight.remove();
        };
        if (this.isTextarea) {
            this.checkText(this.element.value);
        } else {
            this.checkText(this.element.textContent);
        }
    }

    checkText(text) {
        let errors = this.removeOverlappingErrors(WriteGood(text));
        console.log('this point 2');
        for (let error of errors) {
            let sentence = this.getCompleteSentence(text, error.index, error.index + error.offset);
            const ignoreKey = `${sentence}-${error.reason}`;
            if (!this.ignore[ignoreKey]) {
                const id = `${this.elementId}-${this.generateId()}`;
                const highlight = new Highlight(this.element, error, this, id, ignoreKey, this.isTextarea);
            }
        }
    };

    //remove errors with overlapping indexes
    removeOverlappingErrors(errors) {
        let newErrors = [];
        for (let error of errors) {
            let overlapping = false;
            for (let newError of newErrors) {
                if (error.index >= newError.index && error.index <= newError.index + newError.offset) {
                    overlapping = true;
                }
            }
            if (!overlapping) {
                newErrors.push(error);
            }
        }
        return newErrors;
    };

    //given text, a start and end index, return a complete sentence that contains both indexes. start from the start of the first sentence to the end of the last sentece
    getCompleteSentence(text, start, end) {
        let startSentence = text.substring(0, start).lastIndexOf('.');
        let endSentence = text.substring(end).indexOf('.');
        if (startSentence === -1) {
            startSentence = 0;
        } else {
            startSentence += 1;
        }
        if (endSentence === -1) {
            endSentence = text.length;
        } else {
            endSentence += end;
        }
        return text.substring(startSentence, endSentence);
    }



    //generate a random id in a fast time complexity
    generateId() {
        let id = Math.random().toString(36).slice(2, 8);
        return id;
    }
}

export default Textarea;