import { CHROME_CONSTANTS, dropDownPillData } from '../../constants.js';
import { messageListener, logout, postRequest } from '../../methods/authentication.js';
import { replaceSelection } from '../../methods/dom.js';


class PopUpBar {
    constructor(posX, posY, text, activeElement, parameters, parent) {
        this.posX = posX;
        this.posY = posY;
        this.text = text;
        this.activeElement = activeElement;
        this.parameters = parameters;
        this.parent = parent;
        this.currentlySelectedPills = [];
        this.createPopUpBar(posX, posY, text, activeElement, parameters);
    }



    createPopUpBar(x, y, textSelection, activeElement, parameters) {
        const popUpBodyDiv = document.createElement('div');
        popUpBodyDiv.classList.add('wordsmith-944-PopupElement');
        popUpBodyDiv.classList.add('wordsmith-944-PopupBodyDiv');
        popUpBodyDiv.style.left = x + 'px';
        popUpBodyDiv.style.top = y + 'px';

        const firstRowDiv = document.createElement('div');
        firstRowDiv.classList.add('wordsmith-944-PopupElement');
        firstRowDiv.classList.add('wordsmith-944-PopupFirstRowDiv');


        //First Row Div Left


        const firstRowDivLeft = document.createElement('div');
        firstRowDivLeft.classList.add('wordsmith-944-PopupElement');
        firstRowDivLeft.classList.add('wordsmith-944-PopupFirstRowDivLeft');


        dropDownPillData.forEach((pill) => {
            const pillDiv = document.createElement('div');
            pillDiv.classList.add('wordsmith-944-PopupElement');
            pillDiv.classList.add('wordsmith-944-PopupPill');
            pillDiv.id = pill.uniqueId;

            const pillImg = document.createElement('img');
            pillImg.classList.add('wordsmith-944-PopupElement');
            pillImg.classList.add('wordsmith-944-PopupPillImg');
            pillImg.src = chrome.runtime.getURL(pill.image);
            pillDiv.appendChild(pillImg);


            pillDiv.addEventListener('mouseover', () => {
                const hoverDiv = document.createElement('div');
                hoverDiv.classList.add('wordsmith-944-PopupElement');
                hoverDiv.classList.add('wordsmith-944-PopupHoverDiv');
                hoverDiv.textContent = pill.hoverText;
                hoverDiv.style.left = pillDiv.offsetLeft + 'px';
                hoverDiv.style.top = -18 + 'px';
                pillDiv.appendChild(hoverDiv);
            });


            pillDiv.addEventListener('mouseout', () => {
                document.querySelectorAll('.wordsmith-944-PopupHoverDiv').forEach((div) => {
                    div.remove();
                });
            });


            pillDiv.addEventListener('click', () => this.pillClicked(pill));
            firstRowDivLeft.appendChild(pillDiv);
        });

        firstRowDiv.appendChild(firstRowDivLeft);




        //First Row Div Right

        const firstRowDivRight = document.createElement('div');
        firstRowDivRight.classList.add('wordsmith-944-PopupElement');
        firstRowDivRight.classList.add('wordsmith-944-PopupFirstRowDivRight');


        const submitDiv = document.createElement('div');
        submitDiv.classList.add('wordsmith-944-PopupElement');
        submitDiv.classList.add('wordsmith-944-PopupSubmitDiv');

        const submitImg = document.createElement('img');
        submitImg.classList.add('wordsmith-944-PopupElement');
        submitImg.classList.add('wordsmith-944-PopupSubmitImg');
        submitImg.src = chrome.runtime.getURL('images/check.svg');
        submitDiv.appendChild(submitImg);


        submitDiv.addEventListener('click', () => this.submitClicked(textSelection, activeElement, popUpBodyDiv, parameters));
        firstRowDivRight.appendChild(submitDiv);

        const closeDiv = document.createElement('div');
        closeDiv.classList.add('wordsmith-944-PopupElement');
        closeDiv.classList.add('wordsmith-944-PopupCloseDiv');

        const closeImg = document.createElement('img');
        closeImg.classList.add('wordsmith-944-PopupElement');
        closeImg.classList.add('wordsmith-944-PopupCloseImg');
        closeImg.src = chrome.runtime.getURL('images/xmark.svg');
        closeDiv.appendChild(closeImg);

        closeDiv.addEventListener('click', () => this.closeClicked());
        firstRowDivRight.appendChild(closeDiv);


        firstRowDiv.appendChild(firstRowDivRight);

        popUpBodyDiv.appendChild(firstRowDiv);
        document.body.appendChild(popUpBodyDiv);

    }

    pillClicked(pill) {
        document.getElementById(pill.uniqueId).classList.toggle('wordsmith-944-PopupPillSelected');
        const id = pill.uniqueId;
        const pillIndex = this.currentlySelectedPills.findIndex((pill) => pill.uniqueId === id);
        if (pillIndex === -1) {
            this.currentlySelectedPills.push(pill);
        } else {
            this.currentlySelectedPills.splice(pillIndex, 1);
        };
    }




    submitClicked(textSelection, activeElement, popUpBodyDiv, parameters) {
        if (this.currentlySelectedPills.length > 0) {
            const data = {
                text: textSelection,
                pills: this.currentlySelectedPills,
            };

            //if there is any wordsmith-944-PopupSecondRowDiv, remove it
            const secondRowDiv = document.getElementsByClassName('wordsmith-944-PopupSecondRowDiv');
            if (secondRowDiv.length > 0) {
                secondRowDiv[0].remove();
            }

            const popupSecondRowDiv = document.createElement('div');
            popupSecondRowDiv.classList.add('wordsmith-944-PopupElement');
            popupSecondRowDiv.classList.add('wordsmith-944-PopupSecondRowDiv');


            const spinnerDiv = document.createElement('div');
            spinnerDiv.classList.add('wordsmith-944-PopupElement');
            spinnerDiv.classList.add('wordsmith-944-PopupSpinnerDiv');
            popupSecondRowDiv.appendChild(spinnerDiv);
            popUpBodyDiv.appendChild(popupSecondRowDiv);
            postRequest(data).then((response) => {
                if (response.status === 401) {
                    spinnerDiv.remove();
                    logout();
                    const authText = document.createElement('p');
                    authText.classList.add('wordsmith-944-PopupElement');
                    authText.classList.add('wordsmith-944-PopupAuthText');
                    authText.innerText = "You're just three clicks away from getting started";
                    popupSecondRowDiv.appendChild(authText);

                    const authButtonLogin = document.createElement('button');
                    authButtonLogin.classList.add('wordsmith-944-PopupElement');
                    authButtonLogin.classList.add('wordsmith-944-PopupAuthButtonLogin');
                    authButtonLogin.innerText = 'Log in';
                    authButtonLogin.addEventListener('click', () => {
                        window.open(
                            `${CHROME_CONSTANTS.BROWSWER_LOCATION}${CHROME_CONSTANTS.BROWSER_LOGIN}`, "_blank");
                    });
                    popupSecondRowDiv.appendChild(authButtonLogin);


                    const authButtonSignUp = document.createElement('button');
                    authButtonSignUp.classList.add('wordsmith-944-PopupElement');
                    authButtonSignUp.classList.add('wordsmith-944-PopupAuthButtonSignUp');
                    authButtonSignUp.innerText = 'Sign up';
                    authButtonSignUp.addEventListener('click', () => {
                        window.open(
                            `${CHROME_CONSTANTS.BROWSWER_LOCATION}${CHROME_CONSTANTS.BROWSER_SIGNUP}`, "_blank");
                    });
                    popupSecondRowDiv.appendChild(authButtonSignUp);



                } else if (!response.ok) {
                    spinnerDiv.remove();
                    const serverErrorDiv = document.createElement('p');
                    serverErrorDiv.classList.add('wordsmith-944-PopupElement');
                    serverErrorDiv.classList.add('wordsmith-944-PopupServerErrorDiv');
                    serverErrorDiv.innerText = "Oops, it look like we had an error. Please try again later.";
                    popupSecondRowDiv.appendChild(serverErrorDiv);
                } else {
                    response.json().then((res) => {
                        spinnerDiv.remove();
                        const data = res.message;
                        const responseTextP = document.createElement('p');
                        responseTextP.classList.add('wordsmith-944-PopupElement');
                        responseTextP.classList.add('wordsmith-944-PopupResponseTextP');
                        responseTextP.innerText = data;
                        popupSecondRowDiv.appendChild(responseTextP);

                        const responseButton = document.createElement('button');
                        responseButton.classList.add('wordsmith-944-PopupElement');
                        responseButton.classList.add('wordsmith-944-PopupResponseButton');
                        responseButton.innerText = 'Accept';
                        responseButton.addEventListener('click', () => {
                            this.closeClicked();
                            replaceSelection(data, activeElement, parameters);
                        });
                        popupSecondRowDiv.appendChild(responseButton);
                    });
                }
            });
        };
    }

    closeClicked() {
        this.parent.setPopUp(null);
        this.currentlySelectedPills.length = 0;
        const elements = document.getElementsByClassName('wordsmith-944-PopupElement');
        while (elements.length > 0) {
            elements[0].parentNode.removeChild(elements[0]);
        }
    }
}

export default PopUpBar;