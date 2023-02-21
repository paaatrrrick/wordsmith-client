
import './styles/content.css';
import { messageListener } from './methods/authentication.js';
import ContentEdit from './classes/contenteditable/ContentEdit.js';
import Textarea from './classes/textarea/Textarea.js';
import HoverCircle from './classes/highlight/HoverCircle';
import { GRAMMAR_CONSTANTS } from './constants.js';

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
        addElementToWriteable(element);
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
    if (idsToWriteable[id]) {
        return;
    }
    if (id) {
        id = `w${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}`;
        element.id = id
    }
    if (type === 'textarea') {
        idsToWriteable[element.id] = new Textarea(element, id, true);
    } else {
        idsToWriteable[element.id] = new Textarea(element, id, false);
    }
}



window.addEventListener("message", (event) => {
    messageListener(event);
}, false);

