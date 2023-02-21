import '../../styles/Grammar.css'
import { GRAMMAR_CONSTANTS } from '../../constants.js'
import './SpanPopUp'
import SpanPopUp from './SpanPopUp';
import { deleteOuterElement } from '../../methods/dom'

class Span {
    constructor(element, elementId, error, parent, id) {
        this.element = element;
        this.elementId = elementId;
        this.error = error;
        this.parent = parent;
        this.id = id;
        this.text = element.textContent;
        this.addHighlight(error);
        this.PopUp = null;
        this.ignoringBool = false;
    }


    createPopup() {
        this.PopUp = new SpanPopUp(this.error, this, this.id);
    }


    setPopUp(popUp) {
        this.PopUp = popUp;
    }

    setIgnoring(bool) {
        this.ignoringBool = bool;
    }


    removeSpanAndItsContents() {
        const spanElement = document.getElementById(`${this.id}`);
        if (spanElement) {
            spanElement.remove();
            this.removeIdFromParent();
        }
    }


    deleteOuterSpan(remove = true) {
        const spanElement = document.getElementById(`${this.id}`);
        if (spanElement) {
            deleteOuterElement(spanElement);
            if (remove) {
                this.removeIdFromParent();
            }
        };
    };




    addHighlight(error) {
        const startIndex = error.index;
        const endIndex = error.offset + startIndex + 1;
        var range = document.createRange();
        var startNode = this.getTextNodeAtPosition(startIndex);
        var endNode = this.getTextNodeAtPosition(endIndex);

        //check if either the start or node is null or an integer
        if (startNode.node === null || endNode.node === null || typeof startNode.node === 'number' || typeof endNode.node === 'number') {
            return;
        }
        range.setStart(startNode.node, startNode.position);
        range.setEnd(endNode.node, endNode.position);

        var span = document.createElement("span");
        span.classList.add(GRAMMAR_CONSTANTS.CLASS_NAME);
        span.classList.add(`${GRAMMAR_CONSTANTS.CLASS_NAME}-${this.id}`);
        span.classList.add('wordsmith-944-g-spanUnderline');
        span.id = this.id;
        span.addEventListener('mouseenter', () => {
            if (this.PopUp === null) {
                this.createPopup();
            }
        });
        try {
            range.surroundContents(span);
            //TODO: in the situation that the range containt the endining half of an element or the starting half, then this will throw an error
        } catch (e) {
            if (!this.ignoringBool) {
                this.removeIdFromParent();
            }
        }
    }

    removeIdFromParent() {
        this.parent.removeSpan(this.id);
    }

    getTextNodeAtPosition(position) {
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
}

export default Span;
