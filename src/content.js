
import './styles/content.css';
import { CHROME_CONSTANTS, dropDownPillData } from './constants.js';
import getCaretCoordinates from './methods/caretCoordinates.js';
import { messageListener, logout, postRequest } from './methods/authentication.js';
import Writeable from './classes/Writeable.js';


const currentlySelectedPills = [];
const stateManagment = {
    isPopupOpen: false,
    goingLeft: true,
    top: 'none',
    left: 'none',
}


const idsToWriteable = {};


const addElementToWriteable = (element) => {
    var id = element.id;
    //check if idsToWriteable already has the element
    if (idsToWriteable[id]) {
        return;
    }
    if (id) {
        id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        element.id = id;
    }
    idsToWriteable[element.id] = new Writeable(element, id);
    return;
}

//create an onmouse click event listener for the page that checks if the click on a contenteditable element. if so, call addElementToWriteable
document.addEventListener('click', function (event) {
    console.log('click event');
    if (event.target.isContentEditable) {
        addElementToWriteable(event.target);
    }
});


window.onload = function () {
    console.log('window loaded');
    //get every contenteditable element on the page
    const contenteditableElements = document.querySelectorAll('[contenteditable="true"]');
    console.log('contenteditableElements', contenteditableElements);
    //for each contenteditable element, check if it has an id, if not, give it one that is random
    contenteditableElements.forEach((element) => {
        addElementToWriteable(element);
    });
    //get every input and textarea element on the page
    // const inputAndTextAreaElements = document.querySelectorAll('input, textarea');
    // console.log('inputAndTextAreaElements', inputAndTextAreaElements);
}


// 
  


document.addEventListener("selectionchange", function () {
    var selection = window.getSelection();
    const text = selection.toString();
    const activeElement = document.activeElement;
    //check if the selection is a contenteditable element
    if (selection.rangeCount > 0) {
        if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
            handleInputOrTextArea(text, activeElement);
        } else if (activeElement.isContentEditable) {
            handleContenteditable(text, activeElement, selection);
        }
    }
});

function handleContenteditable(text, activeElement, selection) {
    if (text.length > CHROME_CONSTANTS.REQUIRED_LENGTH) {
        // Check if there is a selection (i.e. cursor in place)
        if (selection.rangeCount !== 0) {
            // Clone the range
            const range = selection.getRangeAt(0).cloneRange();
            // Collapse the range to the start, so there are not multiple chars selected
            if (selection.extentNode !== range.startContainer || selection.extentOffset !== range.startOffset) {
                // Collapse the range to the end if selection direction is right-to-left
                range.collapse(false);
            } else {
                // Collapse the range to the start if selection direction is left-to-right
                range.collapse(true);
            }
            // getCientRects returns all the positioning information we need
            const rect = range.getClientRects()[0];
            if (rect) {
                const x = rect.left; // since the caret is only 1px wide, left == right
                const y = rect.top; // top edge of the caret

                const activeElementScrollTop = activeElement.scrollTop;
                const activeElementScrollLeft = activeElement.scrollLeft;


                //get the scroll bar position of the page
                const pageScrollTop = window.pageYOffset;
                const pageScrollLeft = window.pageXOffset;

                const posX = x + activeElementScrollLeft + pageScrollLeft;
                const posY = y + activeElementScrollTop + pageScrollTop;

                const rangeForParameters = selection.getRangeAt(0);
                //update position to match changes in the page scroll bar and the active element scroll bar

                const parameters = { type: 'contenteditable', range: rangeForParameters };


                createOrUpdateCircle(posX, posY, text, activeElement, parameters);
            }
        }
    }
}


const createOrUpdateCircle = (posX, posY, text, activeElement, parameters) => {
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
        stateManagment.isPopupOpen = true;
        createEverything(posX, posY, text, activeElement, parameters);
    }
    return circle;
}



const handleInputOrTextArea = (text, activeElement) => {
    if (text.length < CHROME_CONSTANTS.REQUIRED_LENGTH) {
        if (document.getElementById(CHROME_CONSTANTS.CIRCLE_ID)) {
            document.getElementById(CHROME_CONSTANTS.CIRCLE_ID).remove();
        }
    } else if (text.length === CHROME_CONSTANTS.REQUIRED_LENGTH) {
        const caret = getCaretCoordinates(activeElement, activeElement.selectionStart);
        stateManagment.top = caret.top;
        stateManagment.left = caret.left;
    } else {
        var caret;
        if (stateManagment.goingLeft) {
            caret = getCaretCoordinates(activeElement, activeElement.selectionStart);
            if (caret.top === stateManagment.top && caret.left === stateManagment.left) {
                stateManagment.goingLeft = false;
                caret = getCaretCoordinates(activeElement, activeElement.selectionEnd);
            }
        } else {
            caret = getCaretCoordinates(activeElement, activeElement.selectionEnd);
            if (caret.top === stateManagment.top && caret.left === stateManagment.left) {
                stateManagment.goingLeft = true;
                caret = getCaretCoordinates(activeElement, activeElement.selectionStart);
            }
        }
        stateManagment.top = caret.top;
        stateManagment.left = caret.left;


        //get fontsize of active element
        const fontSize = window.getComputedStyle(activeElement).getPropertyValue('font-size');
        const fontSizeNumber = ((stateManagment.goingLeft) ? -parseFloat(fontSize) - 5 : parseFloat(fontSize));
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

        createOrUpdateCircle(posX, posY, text, activeElement, parameters);

    }
}


const doesClickContainClass = (event) => {
    const clickedElement = document.elementFromPoint(event.clientX, event.clientY);
    if (clickedElement.classList.contains('wordsmith-944-PopupElement')) {
        return true;
    }
    return false;
}

document.addEventListener('mousedown', (event) => {
    //this gets you to the background.js
    // chrome.runtime.sendMessage({ request_token: true });
    if (stateManagment.isPopupOpen) {
        if (!doesClickContainClass(event)) {
            closeClicked();
        };
    } else if (document.getElementById(CHROME_CONSTANTS.CIRCLE_ID)) {
        if (!doesClickContainClass(event)) {
            document.getElementById(CHROME_CONSTANTS.CIRCLE_ID).remove();
        };
    }
});





function createEverything(x, y, textSelection, activeElement, parameters) {
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


        pillDiv.addEventListener('click', () => pillClicked(pill));
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


    submitDiv.addEventListener('click', () => submitClicked(textSelection, activeElement, popUpBodyDiv, parameters));
    firstRowDivRight.appendChild(submitDiv);

    const closeDiv = document.createElement('div');
    closeDiv.classList.add('wordsmith-944-PopupElement');
    closeDiv.classList.add('wordsmith-944-PopupCloseDiv');

    const closeImg = document.createElement('img');
    closeImg.classList.add('wordsmith-944-PopupElement');
    closeImg.classList.add('wordsmith-944-PopupCloseImg');
    closeImg.src = chrome.runtime.getURL('images/xmark.svg');
    closeDiv.appendChild(closeImg);

    closeDiv.addEventListener('click', () => closeClicked());
    firstRowDivRight.appendChild(closeDiv);


    firstRowDiv.appendChild(firstRowDivRight);

    popUpBodyDiv.appendChild(firstRowDiv);
    document.body.appendChild(popUpBodyDiv);

}


const pillClicked = (pill) => {
    document.getElementById(pill.uniqueId).classList.toggle('wordsmith-944-PopupPillSelected');
    const id = pill.uniqueId;
    const pillIndex = currentlySelectedPills.findIndex((pill) => pill.uniqueId === id);
    if (pillIndex === -1) {
        currentlySelectedPills.push(pill);
    } else {
        currentlySelectedPills.splice(pillIndex, 1);
    };
}

const closeClicked = () => {
    stateManagment.isPopupOpen = false;
    currentlySelectedPills.length = 0;
    const elements = document.getElementsByClassName('wordsmith-944-PopupElement');
    while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}




const submitClicked = async (textSelection, activeElement, popUpBodyDiv, parameters) => {
    if (currentlySelectedPills.length > 0) {
        const data = {
            text: textSelection,
            pills: currentlySelectedPills,
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
        const response = await postRequest(data);

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
            const res = await response.json();
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
                closeClicked();
                replaceSelection(data, activeElement, parameters);
            });
            popupSecondRowDiv.appendChild(responseButton);
        }
        // replaceSelection(json.message, activeElement);
    };
}


function replaceSelection(text, activeElement, parameters) {
    // Replace the selection with the given text in input and textarea elements
    if (parameters.type === 'textarea') {
        const start = activeElement.selectionStart;
        const end = activeElement.selectionEnd;
        activeElement.value = activeElement.value.substring(0, start) + text + activeElement.value.substring(end);
        activeElement.selectionStart = start;
        activeElement.selectionEnd = start + text.length;
    } else if (parameters.type === 'contenteditable') {
        const range = parameters.range;
        // Create a new text node with the replacement text
        const replacementText = document.createTextNode(text);
        // Replace the selected text with the replacement text
        range.deleteContents();
        range.insertNode(replacementText);

    }
}



window.addEventListener("message", (event) => {
    messageListener(event);
}, false);





// const observer = new MutationObserver(function (mutations) {
//     mutations.forEach(function (mutation) {
//       if (mutation.type === 'childList') {
//         mutation.addedNodes.forEach(function (node) {
//           if (node.contentEditable === 'true') {
//             console.log('New contenteditable element added to the DOM');
//           }
//         });
//       }
//     });
//   });
  
//   // Observe the body element
//   observer.observe(document.body, {
//     childList: true,
//     subtree: true
//   });




// const observer = new MutationObserver(function (mutations) {
    //     mutations.forEach(function (mutation) {
    //       if (mutation.type === 'childList') {
    //         mutation.addedNodes.forEach(function (node) {
    //           if (node.contentEditable === 'true') {
    //             console.log('New contenteditable element added to the DOM');
    //           }
    //         });
    //         mutation.removedNodes.forEach(function (node) {
    //           if (node.contentEditable === 'true') {
    //             console.log('Contenteditable element removed from the DOM');
    //           }
    //         });
    //       }
    //     });
    //   });
      
    //   // Observe the body element
    //   observer.observe(document.body, {
    //     childList: true,
    //     subtree: true
    //   });
    //   In this example, the mutation observer's callback function loops through the added nodes and checks the contentEditable property of each node. If the contentEditable property is set to true, it means that the node is a contenteditable HTML element and a message is logged to the console indicating that a new contenteditable element has been added to the DOM.
      
    //   The callback function also loops through the removed nodes and checks the contentEditable property of each node. If the contentEditable property is set to true, it means that the node was a contenteditable HTML element and a message is logged to the console indicating that a contenteditable element has been removed from the DOM.
      
      
      