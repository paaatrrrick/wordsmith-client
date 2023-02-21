import { GRAMMAR_CONSTANTS } from '../../constants.js'
import getCaretCoordinates from '../../methods/caretCoordinates.js';
import HighlightPopUp from './HighlightPopUp.js';
import { deleteTextWriteable } from '../../methods/dom.js';


class Highlight {
    constructor(element, error, parent, id, key, isTextarea) {
        console.log('creating highlight');
        this.element = element;
        this.parent = parent;
        this.error = error;
        this.id = id;
        this.key = key;
        this.isTextarea = isTextarea;
        this.popUp = null;
        this.isIgnoring = false;
        this.params = {}
        this.addHighlight(error);

    }

    setIsIgnoring() {
        this.isIgnoring = true;
        this.parent.addToIgnore(this.key);
    };

    setPopUp(popUp) {
        this.popUp = popUp;
    }

    removeSpanAndItsContents(tempThis) {
        deleteTextWriteable(tempThis.element, this.error.index, this.error.index + this.error.offset, tempThis.params);
        this.parent.removeAllHighlights();
    }


    addHighlight(error) {
        if (this.isTextarea) {
            this.params = { type: 'textarea' }
            this.createTextAreaHighlight(error);
        } else {
            this.createContentEditableHighlight(error);
        }
    }

    createContentEditableHighlight(error) {
        const startIndex = error.index;
        const endIndex = error.offset + startIndex + 1;
        var range = document.createRange();
        var startNode = this.getTextNodeAtPositionContentEditable(startIndex);
        var endNode = this.getTextNodeAtPositionContentEditable(endIndex);

        if (startNode.node === null || endNode.node === null || typeof startNode.node === 'number' || typeof endNode.node === 'number') {
            return;
        }
        range.setStart(startNode.node, startNode.position);
        range.setEnd(endNode.node, endNode.position);

        const rect = range.getClientRects()[0];
        if (rect) {
            const coordinates = {
                left: rect.left,
                top: rect.top,
                right: rect.right,
                bottom: rect.bottom
            };
            this.coordinatesToElement(coordinates);
        }
    }


    getTextNodeAtPositionContentEditable(position) {
        const element = this.element;
        var treeWalker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
        var node;
        var lastIndex = 0;
        while ((node = treeWalker.nextNode())) {
            var nodeLength = node.textContent.length;
            if (lastIndex + nodeLength > position) {
                return {
                    node: node,
                    position: position - lastIndex
                };
            }
            lastIndex += nodeLength;
        }
        return { node: null, position: 0 };
    }


    createTextAreaHighlight(error) {
        const startIndex = error.index;
        const endIndex = startIndex + error.offset;
        const caretStart = getCaretCoordinates(this.element, startIndex);
        const caretEnd = getCaretCoordinates(this.element, endIndex);
        console.log('caretStart', caretStart);
        console.log('caretEnd', caretEnd);
        const coordinates = {
            left: caretStart.left,
            top: caretStart.top,
            right: caretEnd.left,
            bottom: caretEnd.top
        };
        this.coordinatesToElement(coordinates);
    };

    coordinatesToElement(coordinates) {
        console.log('coordinatesToElement')
        console.log(coordinates);
        const fontSize = parseFloat(window.getComputedStyle(this.element).getPropertyValue('font-size'));


        const activeElementScrollTop = this.element.scrollTop;
        const activeElementScrollLeft = this.element.scrollLeft
        console.log(activeElementScrollLeft);


        //get the scroll bar position of the page
        const pageScrollTop = window.pageYOffset;
        const pageScrollLeft = window.pageXOffset;

        const activeElementPosition = this.element.getBoundingClientRect();
        const posY = activeElementPosition.top + coordinates.top - activeElementScrollTop + pageScrollTop;
        const posX = activeElementPosition.left + coordinates.left - activeElementScrollLeft + pageScrollLeft;


        if (coordinates.top < coordinates.bottom) {
            //get this.element position in the page right and left and its padding
            const elementPosition = this.element.getBoundingClientRect();
            const elementPositionRightWithPadding = elementPosition.right - parseFloat(window.getComputedStyle(this.element).getPropertyValue('padding-right'));
            this.createDiv(posX, posY, elementPositionRightWithPadding - posX, fontSize);


            const elementPositionLeftWithPadding = elementPosition.left; + parseFloat(window.getComputedStyle(this.element).getPropertyValue('padding-left'));
            const posXBottom = activeElementPosition.left + coordinates.right - activeElementScrollLeft + pageScrollLeft;
            const posYBottom = activeElementPosition.top + coordinates.bottom - activeElementScrollTop + pageScrollTop;
            this.createDiv(elementPositionLeftWithPadding, posYBottom, posXBottom - elementPositionLeftWithPadding, fontSize);

        } else {
            this.createDiv(posX, posY, coordinates.right - coordinates.left, fontSize);
        }

    }

    createDiv(x, y, width, height) {
        const tempThis = this
        const uniqueID = this.id + `-${parseInt(y)}`;
        const div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.left = `${x}px`;
        div.style.top = `${y}px`;
        div.style.width = `${width}px`;
        div.style.height = `${height}px`;
        div.style.marginTop = '3px';
        div.classList.add('wordsmith-944-g-spanUnderline');
        div.classList.add(`${this.parent.getElementId()}`);
        div.classList.add(`${this.id}`);
        div.id = uniqueID;
        div.addEventListener('mouseenter', () => {
            if (tempThis.popUp === null && !tempThis.isIgnoring) {
                tempThis.createPopup(tempThis.error, tempThis, uniqueID, tempThis.id);
            }
        });
        document.body.appendChild(div);
    }

    createPopup(error, parent, uniqueIDForPositioning, genericParentClass) {
        this.popUp = new HighlightPopUp(error, parent, uniqueIDForPositioning, genericParentClass);
    };

}


export default Highlight;