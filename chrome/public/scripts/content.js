const dropDownPillData = [
    { image: "images/scholar.svg", value: 'Scholarly', aiTextPrompt: ' sounds very scholarly', hoverText: 'Scholarly Tone', uniqueId: 'wordsmith-944-grammarPill4' },
    { image: "images/proff.svg", value: 'Professional', aiTextPrompt: ' sounds very professional', hoverText: 'Professional Tone', uniqueId: 'wordsmith-944-grammarPill5' },
    { image: "images/voab.svg", value: 'Vocabulary', aiTextPrompt: ' has an immense vocabulary', hoverText: 'Broaden Vocabulary', uniqueId: 'wordsmith-944-grammarPill6' },
    { image: "images/active.svg", value: 'Active Voice', aiTextPrompt: ' is in an active voice', hoverText: 'Active Voice', uniqueId: 'wordsmith-944-grammarPill2' },
    { image: "images/vivid.svg", value: 'Vivid descriptions', aiTextPrompt: ' written vividly through descriptive language', hoverText: 'Vividly', uniqueId: 'wordsmith-944-grammarPill7' },
    { image: "images/backwards.svg", value: 'Consice', aiTextPrompt: ' is very concise', hoverText: 'Concise', uniqueId: 'wordsmith-944-grammarPill9' },
    { image: "images/forward.svg", value: 'Lengthen', aiTextPrompt: ' is lengthy', hoverText: 'Lengthen', uniqueId: 'wordsmith-944-grammarPill8' },
];

const stateManagment = {
    isPopupOpen: false,
    goingLeft: true,
    top: 'none',
    left: 'none',
}


const REQUIRED_LENGTH = 15;
const currentlySelectedPills = [];
const PRODUCTION_API_ENDPOINT = 'https://wordsmith-api-production.up.railway.app';
const DEVELOPMENT_API_ENDPOINT = 'http://localhost:3000';
const chrome_signup = 'wordsmith-chrome-signup-944';
const chrome_login = 'wordsmith-chrome-login-944';
const chrome_logout = 'wordsmith-chrome-logout-944';
const jwt_chrome = 'wordsmith_944_jwt_chrome'
const circle_id = 'wordsmith-944-wordCircle';


const CONSTANTS = {
    API_ENDPOINT: PRODUCTION_API_ENDPOINT,
    BROWSWER_LOCATION: 'http://localhost:3006',
    BROWSER_LOGIN: '/signin',
    BROWSER_SIGNUP: '/signup',
    WORK_MAGIC: '/chrome/workmagic',
}


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
    if (text.length > REQUIRED_LENGTH) {
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
                x = rect.left; // since the caret is only 1px wide, left == right
                y = rect.top; // top edge of the caret

                const activeElementScrollTop = activeElement.scrollTop;
                const activeElementScrollLeft = activeElement.scrollLeft;


                //get the scroll bar position of the page
                const pageScrollTop = window.pageYOffset;
                const pageScrollLeft = window.pageXOffset;

                const posX = x + activeElementScrollLeft + pageScrollLeft;
                const posY = y + activeElementScrollTop + pageScrollTop;

                rangeForParameters = selection.getRangeAt(0);
                //update position to match changes in the page scroll bar and the active element scroll bar

                parameters = { type: 'contenteditable', range: rangeForParameters };


                createOrUpdateCircle(posX, posY, text, activeElement, parameters);
            }
        }
    }
}


const createOrUpdateCircle = (posX, posY, text, activeElement, parameters) => {
    var circle = document.getElementById(circle_id);
    if (!circle) {
        circle = document.createElement("div");
        circle.classList.add("wordsmith-944-PopupElement");
        circle.classList.add("wordsmith-944-wordCircle");
        circle.id = circle_id;
        const logo = document.createElement("img");
        logo.src = chrome.runtime.getURL("images/logo.png");
        logo.classList.add("wordsmith-944-PopupElement");
        logo.classList.add("wordsmith-944-wordLogo");
        circle.appendChild(logo);
        document.body.appendChild(circle);
    }
    circle.style.top = posY + 'px';
    circle.style.left = posX + 'px';

    circle.onclick = function () {
        document.getElementById(circle_id).remove();
        stateManagment.isPopupOpen = true;
        createEverything(posX, posY, text, activeElement, parameters);
    }
    return circle;
}



const handleInputOrTextArea = (text, activeElement) => {
    if (text.length < REQUIRED_LENGTH) {
        if (document.getElementById(circle_id)) {
            document.getElementById(circle_id).remove();
        }
    } else if (text.length === REQUIRED_LENGTH) {
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
    } else if (document.getElementById(circle_id)) {
        if (!doesClickContainClass(event)) {
            document.getElementById(circle_id).remove();
        };
    }
});





function createEverything(x, y, textSelection, activeElement, parameters) {
    const popUpBodyDiv = document.createElement('div');
    popUpBodyDiv.classList.add('wordsmith-944-PopupElement');
    popUpBodyDiv.classList.add('wordsmith-944-PopupBodyDiv');
    popUpBodyDiv.style.left = x + 'px';
    popUpBodyDiv.style.top = y + 'px';


    firstRowDiv = document.createElement('div');
    firstRowDiv.classList.add('wordsmith-944-PopupElement');
    firstRowDiv.classList.add('wordsmith-944-PopupFirstRowDiv');


    //First Row Div Left


    firstRowDivLeft = document.createElement('div');
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

    firstRowDivRight = document.createElement('div');
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
                    `${CONSTANTS.BROWSWER_LOCATION}${CONSTANTS.BROWSER_LOGIN}`, "_blank");
            });
            popupSecondRowDiv.appendChild(authButtonLogin);


            const authButtonSignUp = document.createElement('button');
            authButtonSignUp.classList.add('wordsmith-944-PopupElement');
            authButtonSignUp.classList.add('wordsmith-944-PopupAuthButtonSignUp');
            authButtonSignUp.innerText = 'Sign up';
            authButtonSignUp.addEventListener('click', () => {
                window.open(
                    `${CONSTANTS.BROWSWER_LOCATION}${CONSTANTS.BROWSER_SIGNUP}`, "_blank");
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




const postRequest = async (data) => {
    try {
        const result = await window.chrome.storage.sync.get([jwt_chrome]);
        if (result.wordsmith_944_jwt_chrome) {
            const jwt = result.wordsmith_944_jwt_chrome;
            response = await fetch(`${CONSTANTS.API_ENDPOINT}${CONSTANTS.WORK_MAGIC}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "x-access'wordsmith-auth-token": jwt
                },
                body: JSON.stringify(data),
            });
            return response;
        } else {
            return { ok: false, status: 401 };
        };
    } catch (error) {
        return { ok: false };
    }

};

const logout = () => {
    chrome.storage.sync.set({ wordsmith_944_jwt_chrome: "" }, function () {
        // console.log("JWT token saved to chrome.storage logout");
    });
};





//AUTH


window.addEventListener("message", (event) => {
    if (event.source != window) {
        return;
    }
    if (event.data) {
        const type = event.data.wordsmithType;
        const jwt = event.data.jwtToken;
        if (type) {
            if (type === chrome_signup) {
                chrome.storage.sync.set({ wordsmith_944_jwt_chrome: jwt }, function () {
                    // console.log("JWT token saved to chrome.storage signup");
                });
                // chrome.storage.sync.get(['wordsmith_944_jwt_chrome'], function (result) {
                //     console.log('Value currently is ' + result.wordsmith_944_jwt_chrome);
                // });
            } else if (type === chrome_logout) {
                logout();
            }
        }
    }
}, false);








/* jshint browser: true */

// We'll copy the properties below into the mirror div.
// Note that some browsers, such as Firefox, do not concatenate properties
// into their shorthand (e.g. padding-top, padding-bottom etc. -> padding),
// so we have to list every single property explicitly.
var properties = [
    'direction',  // RTL support
    'boxSizing',
    'width',  // on Chrome and IE, exclude the scrollbar, so the mirror div wraps exactly as the textarea does
    'height',
    'overflowX',
    'overflowY',  // copy the scrollbar for IE

    'borderTopWidth',
    'borderRightWidth',
    'borderBottomWidth',
    'borderLeftWidth',
    'borderStyle',

    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',

    // https://developer.mozilla.org/en-US/docs/Web/CSS/font
    'fontStyle',
    'fontVariant',
    'fontWeight',
    'fontStretch',
    'fontSize',
    'fontSizeAdjust',
    'lineHeight',
    'fontFamily',

    'textAlign',
    'textTransform',
    'textIndent',
    'textDecoration',  // might not make a difference, but better be safe

    'letterSpacing',
    'wordSpacing',

    'tabSize',
    'MozTabSize'

];

function getCaretCoordinates(element, position, options) {

    // The mirror div will replicate the textarea's style
    var div = document.createElement('div');
    div.id = 'input-textarea-caret-position-mirror-div';
    document.body.appendChild(div);

    var style = div.style;
    var computed = window.getComputedStyle ? window.getComputedStyle(element) : element.currentStyle;  // currentStyle for IE < 9
    var isInput = element.nodeName === 'INPUT';

    // Default textarea styles
    style.whiteSpace = 'pre-wrap';
    if (!isInput)
        style.wordWrap = 'break-word';  // only for textarea-s

    // Position off-screen
    style.position = 'absolute';  // required to return coordinates properly
    style.visibility = 'hidden';  // not 'display: none' because we want rendering

    // Transfer the element's properties to the div
    properties.forEach(function (prop) {
        if (isInput && prop === 'lineHeight') {
            // Special case for <input>s because text is rendered centered and line height may be != height
            style.lineHeight = computed.height;
        } else {
            style[prop] = computed[prop];
        }
    });

    style.overflow = 'hidden';  // for Chrome to not render a scrollbar; IE keeps overflowY = 'scroll'

    div.textContent = element.value.substring(0, position);
    // The second special handling for input type="text" vs textarea:
    // spaces need to be replaced with non-breaking spaces - http://stackoverflow.com/a/13402035/1269037
    if (isInput)
        div.textContent = div.textContent.replace(/\s/g, '\u00a0');

    var span = document.createElement('span');
    // Wrapping must be replicated *exactly*, including when a long word gets
    // onto the next line, with whitespace at the end of the line before (#7).
    // The  *only* reliable way to do that is to copy the *entire* rest of the
    // textarea's content into the <span> created at the caret position.
    // For inputs, just '.' would be enough, but no need to bother.
    span.textContent = element.value.substring(position) || '.';  // || because a completely empty faux span doesn't render at all
    div.appendChild(span);
    var coordinates = {
        top: span.offsetTop + parseInt(computed['borderTopWidth']),
        left: span.offsetLeft + parseInt(computed['borderLeftWidth']),
        height: parseInt(computed['lineHeight'])
    };

    document.body.removeChild(div);

    return coordinates;
}