
import './styles/content.css';
import { messageListener } from './methods/authentication.js';
import Writeable from './classes/Writeable.js';
import HoverCircle from './classes/HoverCircle';


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
    const contenteditableElements = document.querySelectorAll('[contenteditable="true"]');
    contenteditableElements.forEach((element) => {
        addElementToWriteable(element);
    });
    // const inputAndTextAreaElements = document.querySelectorAll('input, textarea');
    // console.log('inputAndTextAreaElements', inputAndTextAreaElements);
}

document.addEventListener('input', (event) => {
    detectContenteditable(event.target);
});

document.addEventListener('click', function (event) {
    detectContenteditable(event.target);
});


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


const addElementToWriteable = (element) => {
    var id = element.id;
    if (idsToWriteable[id]) {
        return;
    }
    if (id) {
        id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        element.id = id;
    }
    idsToWriteable[element.id] = new Writeable(element, id);
}



window.addEventListener("message", (event) => {
    messageListener(event);
}, false);

