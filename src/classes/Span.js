import { computePosition, autoPlacement } from '@floating-ui/dom';
import '../styles/Grammar.css'
import { GRAMMAR_CONSTANTS } from '../constants.js'
class Span {
    constructor(element, elementId, error, parent, id) {
        this.element = element;
        this.elementId = elementId;
        this.error = error;
        this.parent = parent;
        this.id = id
        this.text = element.textContent;
        this.addHighlight(error);
    }

    createPopup() {
        const popup = document.createElement('div');
        const popupId = `${this.id}-popup`;
        popup.id = popupId;
        popup.classList.add(GRAMMAR_CONSTANTS.CLASS_NAME);
        popup.classList.add(`${GRAMMAR_CONSTANTS.CLASS_NAME}-${this.id}`);
        popup.classList.add('wordsmith-944-g-PopUpBody');
        popup.classList.add('wordsmith-944-g-PopUp');


        const popUpButton = document.createElement('button');
        popUpButton.classList.add(GRAMMAR_CONSTANTS.CLASS_NAME);
        popUpButton.classList.add(`${GRAMMAR_CONSTANTS.CLASS_NAME}-${this.id}`);
        popUpButton.classList.add('wordsmith-944-g-PopUpButton');
        popUpButton.classList.add('wordsmith-944-g-PopUp');
        popUpButton.innerText = 'X';
        popup.appendChild(popUpButton);

        const span = document.getElementById(`${this.id}`);
        computePosition(span, popup, {
            middleware: [autoPlacement({
                allowedPlacements: ['top', 'bottom'],
                margin: 10,
            })],
        }).then((pos) => {
            const { x, y } = pos;
            popup.style.left = x + 'px';
            popup.style.top = y + 'px';
        });
        document.body.appendChild(popup);

        popUpButton.addEventListener('click', () => {
            this.parent.removeSpan(this.id);
            handleMouseOver();
            document.removeEventListener('mouseover', handleMouseOver);
            const span = document.getElementById(`${this.id}`);
            span.remove();
        });

        const handleMouseOverChecks = (event) => {
            if (!event.target.classList.contains(`${GRAMMAR_CONSTANTS.CLASS_NAME}-${this.id}`)) {
                handleMouseOver();
            };
        }

        const handleMouseOver = () => {
            const popups = document.getElementsByClassName('wordsmith-944-g-PopUp');
            if (popups.length > 0) {
                for (let i = 0; i < popups.length; i++) {
                    console.log('removing')
                    popups[i].remove();
                }
                document.removeEventListener('mouseover', handleMouseOverChecks);
            }
        }
        //add on a hover event to the page that will remove the popup if it is not hovered over the popup or the span
        document.addEventListener('mouseover', handleMouseOverChecks);
    }

    addHighlight(error) {
        console.log(error);
        const startIndex = error.index;
        const endIndex = error.offset + startIndex + 1;
        const reason = error.reason;
        const contentEditableElement = this.element;
        var textContent = contentEditableElement.textContent;
        var range = document.createRange();
        var startNode = this.getTextNodeAtPosition(startIndex);
        var endNode = this.getTextNodeAtPosition(endIndex);

        range.setStart(startNode.node, startNode.position);
        range.setEnd(endNode.node, endNode.position);
        var selectedText = range.toString();

        var span = document.createElement("span");
        span.classList.add(GRAMMAR_CONSTANTS.CLASS_NAME);
        span.classList.add(`${GRAMMAR_CONSTANTS.CLASS_NAME}-${this.id}`);
        span.classList.add('wordsmith-944-g-spanUnderline');
        var textNode = document.createTextNode(selectedText);
        span.appendChild(textNode);
        span.id = this.id;
        span.addEventListener('mouseover', () => {
            this.createPopup();
        });
        range.deleteContents();
        range.insertNode(span);

        var x = new MutationObserver(function (e) {
            if (e[0].removedNodes) {
                this.parent.removeSpan(this.id);
            }
        });

        x.observe(document.getElementById(`${this.id}`), { childList: true });
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


    toString() {
        return `Element: ${this.elementId} Text: ${this.text}`;
    }
}

export default Span;