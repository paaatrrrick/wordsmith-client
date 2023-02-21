import { CHROME_CONSTANTS } from '../../constants.js';
import getCaretCoordinates from '../../methods/caretCoordinates.js';
import PopUpBar from './PopUpBar.js';
class HoverCircle {
    constructor() {
        this.popUp = null;
        this.goingLeft = true;
        this.top = 'none';
        this.left = 'none';
        this.listenForOtherCLicks();
        this.lisenForDeleteKeyStroke();
    }

    listenForOtherCLicks() {
        const tempThis = this;
        document.addEventListener('mousedown', (event) => {
            if (tempThis.popUp) {
                if (!tempThis.doesClickContainClass(event)) {
                    tempThis.popUp.closeClicked();
                };
            } else if (document.getElementById(CHROME_CONSTANTS.CIRCLE_ID)) {
                if (!tempThis.doesClickContainClass(event)) {
                    document.getElementById(CHROME_CONSTANTS.CIRCLE_ID).remove();
                };
            }
        });
    }

    lisenForDeleteKeyStroke() {
        document.addEventListener('input', (event) => {
            if (event.inputType === 'deleteContentBackward' || event.inputType === 'deleteContentForward') {
                if (document.getElementById(CHROME_CONSTANTS.CIRCLE_ID)) {
                    document.getElementById(CHROME_CONSTANTS.CIRCLE_ID).remove();
                }
            }
        });
    }

    doesClickContainClass(event) {
        const clickedElement = document.elementFromPoint(event.clientX, event.clientY);
        if (clickedElement.classList.contains('wordsmith-944-PopupElement')) {
            return true;
        }
        return false;
    }


    setPopUp(popUp) {
        this.popUp = popUp;
    }

    handleInputOrTextArea(text, activeElement) {
        if (text.length < CHROME_CONSTANTS.REQUIRED_LENGTH) {
            if (document.getElementById(CHROME_CONSTANTS.CIRCLE_ID)) {
                document.getElementById(CHROME_CONSTANTS.CIRCLE_ID).remove();
            }
        } else if (text.length === CHROME_CONSTANTS.REQUIRED_LENGTH) {
            const caret = getCaretCoordinates(activeElement, activeElement.selectionStart);
            this.top = caret.top;
            this.left = caret.left;
        } else {
            var caret;
            if (this.goingLeft) {
                caret = getCaretCoordinates(activeElement, activeElement.selectionStart);
                if (caret.top === this.top && caret.left === this.left) {
                    this.goingLeft = false;
                    caret = getCaretCoordinates(activeElement, activeElement.selectionEnd);
                }
            } else {
                caret = getCaretCoordinates(activeElement, activeElement.selectionEnd);
                if (caret.top === this.top && caret.left === this.left) {
                    this.goingLeft = true;
                    caret = getCaretCoordinates(activeElement, activeElement.selectionStart);
                }
            }
            this.top = caret.top;
            this.left = caret.left;

            //get fontsize of active element
            const fontSize = window.getComputedStyle(activeElement).getPropertyValue('font-size');
            const fontSizeNumber = ((this.goingLeft) ? -parseFloat(fontSize) - 5 : parseFloat(fontSize));
            //get active element positiond

            //get the scroll bar position of the active element
            const activeElementScrollTop = activeElement.scrollTop;
            const activeElementScrollLeft = activeElement.scrollLeft;


            //get the scroll bar position of the page
            const pageScrollTop = window.pageYOffset;
            const pageScrollLeft = window.pageXOffset;

            const activeElementPosition = activeElement.getBoundingClientRect();
            const posY = activeElementPosition.top + caret.top + fontSizeNumber - activeElementScrollTop + pageScrollTop;
            const posX = activeElementPosition.left + caret.left - activeElementScrollLeft + pageScrollLeft;


            const parameters = { type: 'textarea' };

            this.createOrUpdateCircle(posX, posY, text, activeElement, parameters);
        }
    }


    handleContenteditable(text, activeElement, selection) {
        if (text.length > CHROME_CONSTANTS.REQUIRED_LENGTH) {
            // Check if there is a selection (i.e. cursor in place)
            if (selection.rangeCount !== 0) {
                const range = selection.getRangeAt(0).cloneRange();
                // Collapse the range to the start, so there are not multiple chars selected
                if (selection.extentNode !== range.startContainer || selection.extentOffset !== range.startOffset) {
                    // Collapse the range to the end if selection direction is right-to-left
                    range.collapse(false);
                } else {
                    // Collapse the range to the start if selection direction is left-to-right
                    range.collapse(true);
                }
                const rect = range.getClientRects()[0];
                if (rect) {
                    const x = rect.left;
                    const y = rect.top;

                    const activeElementScrollTop = activeElement.scrollTop;
                    const activeElementScrollLeft = activeElement.scrollLeft;
                    //get the scroll bar position of the page
                    const pageScrollTop = window.pageYOffset;
                    const pageScrollLeft = window.pageXOffset;

                    const posX = x + activeElementScrollLeft + pageScrollLeft;
                    const posY = y + activeElementScrollTop + pageScrollTop;

                    const rangeForParameters = selection.getRangeAt(0);
                    console.log('handleContenteditable')
                    console.log(rangeForParameters);
                    const parameters = { type: 'contenteditable', range: rangeForParameters };

                    this.createOrUpdateCircle(posX, posY, text, activeElement, parameters);
                }
            }
        }
    }

    createOrUpdateCircle(posX, posY, text, activeElement, parameters) {
        const tempThis = this;
        var circle = document.getElementById(CHROME_CONSTANTS.CIRCLE_ID);
        if (!circle) {
            circle = document.createElement("div");
            circle.classList.add("wordsmith-944-PopupElement");
            circle.classList.add("wordsmith-944-wordCircle");
            circle.id = CHROME_CONSTANTS.CIRCLE_ID;
            const logo = document.createElement("img");
            logo.src = chrome.runtime.getURL("./images/logo.png");
            logo.classList.add("wordsmith-944-PopupElement");
            logo.classList.add("wordsmith-944-wordLogo");
            circle.appendChild(logo);
            document.body.appendChild(circle);
        }
        circle.style.top = posY + 'px';
        circle.style.left = posX + 'px';

        circle.onclick = function () {
            document.getElementById(CHROME_CONSTANTS.CIRCLE_ID).remove();
            const popUp = new PopUpBar(posX, posY, text, activeElement, parameters, tempThis);
            tempThis.popUp = popUp;
        }
    }
}


export default HoverCircle;