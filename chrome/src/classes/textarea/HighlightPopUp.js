import { computePosition, autoPlacement } from '@floating-ui/dom';
import { GRAMMAR_CONSTANTS } from '../../constants.js'

class HighlightPopUp {
    constructor(text, parent, id, genericParentClass) {
        this.text = text.reason;
        this.parent = parent;
        this.id = id;
        this.genericParentClass = genericParentClass;
        this.abort = new AbortController();
        this.createPopup();
    }

    createPopup() {
        const tempThis = this;

        const popup = document.createElement('div');
        popup.classList.add('wordsmith-944-g-PopUpBody');
        popup.classList.add('wordsmith-944-g-PopUp');
        popup.classList.add(`${this.id}`);


        const popUpFirstSection = document.createElement('div');
        popUpFirstSection.classList.add('wordsmith-944-g-PopUpFirstSection');
        popUpFirstSection.classList.add('wordsmith-944-g-PopUp');
        popUpFirstSection.classList.add(`${this.id}`);


        const popUpText = document.createElement('p');
        popUpText.classList.add('wordsmith-944-g-PopUpText');
        popUpText.classList.add('wordsmith-944-g-PopUp');
        popUpText.classList.add(`${this.id}`);
        popUpText.innerText = this.text;
        popUpFirstSection.appendChild(popUpText);

        popup.appendChild(popUpFirstSection);


        const popUpBottomDiv = document.createElement('div');
        popUpBottomDiv.classList.add('wordsmith-944-g-PopUpBottomDiv');
        popUpBottomDiv.classList.add('wordsmith-944-g-PopUp');
        popUpBottomDiv.classList.add(`${this.id}`);



        const popUpAcceptButton = document.createElement('button');
        popUpAcceptButton.classList.add('wordsmith-944-g-PopUpAcceptButton');
        popUpAcceptButton.classList.add('wordsmith-944-g-PopUp');
        popUpAcceptButton.classList.add(`${this.id}`);
        popUpAcceptButton.innerText = 'Apply';
        popUpAcceptButton.addEventListener('click', () => {
            tempThis.handleMouseOver();
            tempThis.parent.removeSpanAndItsContents(tempThis.parent);
        });
        popUpBottomDiv.appendChild(popUpAcceptButton);


        const popUpIgnoreButton = document.createElement('button');
        popUpIgnoreButton.classList.add('wordsmith-944-g-PopUpIgnoreButton');
        popUpIgnoreButton.classList.add('wordsmith-944-g-PopUp');
        popUpIgnoreButton.classList.add(`${this.id}`);
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
        if (!event.target.classList.contains(`${tempThis.id}`) && event.target.id !== `${tempThis.id}`) {
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
        const spanElementArr = document.querySelectorAll(`.${this.genericParentClass}`);
        console.log('ignoring');
        console.log(spanElementArr);
        for (let spanElement of spanElementArr) {
            spanElement.classList = [];
        }
        tempThis.parent.setIsIgnoring();
    }
}


export default HighlightPopUp;