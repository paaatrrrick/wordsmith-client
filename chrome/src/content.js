
import './styles/content.css';
import './styles/Grammar.css'
import { messageListener } from './methods/authentication.js';
import Writeable from './classes/writeable/Writeable.js';
import HoverCircle from './classes/highlight/HoverCircle';

const myHoverCircle = new HoverCircle();


document.addEventListener("selectionchange", function () {
    var selection = window.getSelection();
    const text = selection.toString();
    const activeElement = document.activeElement;
    if (selection.rangeCount > 0) {
        if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
            myHoverCircle.handleInputOrTextArea(text, activeElement);
        } else if (activeElement.isContentEditable) {
            myHoverCircle.handleContenteditable(text, activeElement, selection);
        }
    }
});



window.onload = function () {
    let contenteditable = document.querySelectorAll('[contenteditable="true"]');
    contenteditable.forEach((element) => {
        detectContenteditable(element);
    });
    const inputAndTextAreaElements = document.querySelectorAll('input, textarea');
    inputAndTextAreaElements.forEach((element) => {
        addElementToWriteable(element, 'textarea');
    });
}

document.addEventListener('input', (event) => {
    detectContenteditable(event.target);
    detectTextarea(event.target);
});

document.addEventListener('click', function (event) {
    detectContenteditable(event.target);
    detectTextarea(event.target);
});

const detectTextarea = (eventTarget) => {
    if (eventTarget.tagName === 'TEXTAREA') {
        addElementToWriteable(eventTarget, 'textarea');
    }
}


const detectContenteditable = (eventTarget) => {
    if (eventTarget.isContentEditable) {
        const recursive = (element) => {
            if (element.getAttribute('contenteditable') === 'true') {
                return element;
            } else {
                return recursive(element.parentElement);
            }
        }
        addElementToWriteable(recursive(eventTarget));
    }
}

const idsToWriteable = {};


const addElementToWriteable = (element, type = 'contenteditbale') => {
    var id = element.id;
    //detect if the element has an id
    if (idsToWriteable[id] && element.id && element.id !== '' && element.id !== ' ') {
        return;
    }
    //set id to the id with trimmed whitespace 
    if (!id || id.trim() === '' || !id.trim()) {
        id = `w${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}`;
        element.id = id
    }
    if (type === 'textarea') {
        idsToWriteable[element.id] = new Writeable(element, true);
    } else {
        idsToWriteable[element.id] = new Writeable(element, false);
    }
}



window.addEventListener("message", (event) => {
    messageListener(event);
}, false);

