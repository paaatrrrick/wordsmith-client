import { computePosition, autoPlacement } from '@floating-ui/dom';
import '../styles/Grammar.css'
import { GRAMMAR_CONSTANTS } from '../constants.js'
class Span {
    constructor(element, elementId, error, parent, id) {
        this.element = element;
        this.elementId = elementId;
        this.error = error;
        this.parent = parent;
        this.id = id;
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

        const spanArray = document.getElementsByClassName(`${this.id}`);
        if (spanArray.length >= 0) {
            const span = spanArray[0];
            computePosition(span, popup, {
                middleware: [autoPlacement({
                    allowedPlacements: ['top-end', 'bottom-start'],
                    crossAxis: true,
                    margin: 10,
                })],
            }).then((pos) => {
                const { x, y } = pos;
                popup.style.left = x + 'px';
                popup.style.top = y + 'px';
            });
            document.body.appendChild(popup);
        }


        popUpButton.addEventListener('click', () => {
            handleMouseOver();
            this.removeSpanAndItsContents();
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
                    popups[i].remove();
                }
            }
            document.removeEventListener('mouseover', handleMouseOverChecks);
        }
        //add on a hover event to the page that will remove the popup if it is not hovered over the popup or the span
        document.addEventListener('mouseover', handleMouseOverChecks);
    }


    removeSpanAndItsContents() {
        const spanArrary = document.getElementsByClassName(`${this.id}`);
        if (spanArrary.length >= 0) {
            const span = spanArrary[0];
            span.remove();
            this.removeIdFromParent();
        }
    }


    deleteOuterSpan(remove = true) {
        const spanArray = document.getElementsByClassName(`${this.id}`);
        console.log('id: ' + String(this.id));
        console.log('deteting outer span:');
        console.log(spanArray);
        if (spanArray.length > 0) {
            const spanElement = spanArray[0];
            let parentElement = spanElement.parentNode;
            let spanElementInnerHTML = spanElement.innerHTML;
            let startIndex = Array.prototype.indexOf.call(parentElement.childNodes, spanElement);
            let textNode = document.createTextNode(spanElementInnerHTML);
            parentElement.removeChild(spanElement);
            parentElement.insertBefore(textNode, parentElement.childNodes[startIndex]);
            // const spanElement = spanArray[0];
            // let parentElement = spanElement.parentNode;
            // let spanElementInnerHTML = spanElement.innerHTML;
            // let parentInnerHTML = parentElement.innerHTML;
            // let startIndex = parentInnerHTML.indexOf(spanElement.outerHTML);
            // let endIndex = startIndex + spanElement.outerHTML.length;
            // parentElement.innerHTML = parentInnerHTML.slice(0, startIndex) + spanElementInnerHTML + parentInnerHTML.slice(endIndex);
            if (remove) {
                this.removeIdFromParent();
            }
        };
    };




    addHighlight(error) {
        const startIndex = error.index;
        const endIndex = error.offset + startIndex + 1;
        const reason = error.reason;
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
        span.classList.add(this.id);
        span.addEventListener('mouseenter', () => {
            this.createPopup();
        });


        try {
            range.surroundContents(span);
            //TODO: in the situation that the range containt the endining half of an element or the starting half, then this will throw an error
        } catch (e) {
            console.log('error on making span surround contents errror');
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

    // toString() {
    //     return this.id;
    // }
}

export default Span;