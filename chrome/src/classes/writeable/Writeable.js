import WriteGood from 'write-good';
import Highlight from "./Highlight";

class Writeable {
    constructor(element, isTextarea) {
        this.element = element;
        this.elementId = `w${this.generateId()}`;
        this.ignore = {};
        this.isTextarea = isTextarea;
        if (isTextarea) {
            this.checkText(element.value);
        } else {
            this.checkText(element.textContent);
        }
        this.addEventListeners();

    }


    addToIgnore(id) {
        this.ignore[id] = true;
    }

    getElementId() {
        return this.elementId;
    }

    addEventListeners() {
        this.inputEventListener();
        this.scrollEventListener();
        this.mutationObserver();
    }

    inputEventListener() {
        this.element.addEventListener('input', (event) => {
            this.refresh();
        });
    }

    scrollEventListener() {
        this.element.addEventListener('scroll', (event) => {
            this.refresh();
        });
    }


    mutationObserver() {
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                this.refresh();
            }
        });
        resizeObserver.observe(this.element);
    };

    isElementVisible(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }



    refresh(rebuild = true) {
        const highlights = document.querySelectorAll(`.${this.elementId}`);
        for (let highlight of highlights) {
            highlight.remove();
        };
        if (rebuild) {
            if (this.isTextarea) {
                this.checkText(this.element.value);
            } else {
                this.checkText(this.element.textContent);
            }
        }
    }

    checkText(text) {
        // let errors = this.removeOverlappingErrors(WriteGood(text));
        let errors = this.removeOverlappingErrors(WriteGood(text, { passive: false }));
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

export default Writeable;