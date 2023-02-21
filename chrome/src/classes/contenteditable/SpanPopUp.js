import { computePosition, autoPlacement } from '@floating-ui/dom';
import { GRAMMAR_CONSTANTS } from '../../constants.js'

class SpanPopUp {
    constructor(text, parent, id) {
        this.text = text.reason;
        this.parent = parent;
        this.id = id;
        this.abort = new AbortController();
        this.createPopup();
    }

    createPopup() {
        const tempThis = this;

        const popup = document.createElement('div');
        const popupId = `${this.id}-popup`;
        popup.id = popupId;
        popup.classList.add(GRAMMAR_CONSTANTS.CLASS_NAME);
        popup.classList.add(`${GRAMMAR_CONSTANTS.CLASS_NAME}-${this.id}`);
        popup.classList.add('wordsmith-944-g-PopUpBody');
        popup.classList.add('wordsmith-944-g-PopUp');


        const popUpFirstSection = document.createElement('div');
        popUpFirstSection.classList.add(GRAMMAR_CONSTANTS.CLASS_NAME);
        popUpFirstSection.classList.add(`${GRAMMAR_CONSTANTS.CLASS_NAME}-${this.id}`);
        popUpFirstSection.classList.add('wordsmith-944-g-PopUpFirstSection');
        popUpFirstSection.classList.add('wordsmith-944-g-PopUp');


        const popUpText = document.createElement('p');
        popUpText.classList.add(GRAMMAR_CONSTANTS.CLASS_NAME);
        popUpText.classList.add(`${GRAMMAR_CONSTANTS.CLASS_NAME}-${this.id}`);
        popUpText.classList.add('wordsmith-944-g-PopUpText');
        popUpText.classList.add('wordsmith-944-g-PopUp');
        popUpText.innerText = this.text;
        popUpFirstSection.appendChild(popUpText);

        popup.appendChild(popUpFirstSection);


        const popUpBottomDiv = document.createElement('div');
        popUpBottomDiv.classList.add(GRAMMAR_CONSTANTS.CLASS_NAME);
        popUpBottomDiv.classList.add(`${GRAMMAR_CONSTANTS.CLASS_NAME}-${this.id}`);
        popUpBottomDiv.classList.add('wordsmith-944-g-PopUpBottomDiv');
        popUpBottomDiv.classList.add('wordsmith-944-g-PopUp');



        const popUpAcceptButton = document.createElement('button');
        popUpAcceptButton.classList.add(GRAMMAR_CONSTANTS.CLASS_NAME);
        popUpAcceptButton.classList.add(`${GRAMMAR_CONSTANTS.CLASS_NAME}-${this.id}`);
        popUpAcceptButton.classList.add('wordsmith-944-g-PopUpAcceptButton');
        popUpAcceptButton.classList.add('wordsmith-944-g-PopUp');
        popUpAcceptButton.innerText = 'Apply';
        popUpAcceptButton.addEventListener('click', () => {
            tempThis.handleMouseOver();
            tempThis.parent.removeSpanAndItsContents();
        });
        popUpBottomDiv.appendChild(popUpAcceptButton);


        const popUpIgnoreButton = document.createElement('button');
        popUpIgnoreButton.classList.add(GRAMMAR_CONSTANTS.CLASS_NAME);
        popUpIgnoreButton.classList.add(`${GRAMMAR_CONSTANTS.CLASS_NAME}-${this.id}`);
        popUpIgnoreButton.classList.add('wordsmith-944-g-PopUpIgnoreButton');
        popUpIgnoreButton.classList.add('wordsmith-944-g-PopUp');
        popUpIgnoreButton.innerText = 'Ignore';
        popUpIgnoreButton.addEventListener('click', () => {
            tempThis.handleMouseOver();
            tempThis.ignore(tempThis);
        });
        popUpBottomDiv.appendChild(popUpIgnoreButton);


        popup.appendChild(popUpBottomDiv);


        const span = document.getElementById(`${this.id}`);
        if (span) {
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


        document.addEventListener('mouseover', (event) => {
            tempThis.handleMouseOverChecks(event, tempThis);
        }, { signal: this.abort.signal });
    }



    handleMouseOverChecks(event, tempThis) {
        if (!event.target.classList.contains(`${GRAMMAR_CONSTANTS.CLASS_NAME}-${tempThis.id}`)) {
            tempThis.handleMouseOver();
        };
    }

    handleMouseOver() {
        const popups = document.getElementsByClassName('wordsmith-944-g-PopUp');
        for (let i = 0; i < popups.length; i++) {
            popups[i].remove();
        }
        this.abort.abort();
        this.parent.setPopUp(null);
    }

    ignore(tempThis) {
        tempThis.parent.setIgnoring(true);
        tempThis.parent.removeIdFromParent();
        const spanElement = document.getElementById(`${this.id}`);
        if (spanElement) {
            spanElement.classList = [];
        }
    }
}


export default SpanPopUp;