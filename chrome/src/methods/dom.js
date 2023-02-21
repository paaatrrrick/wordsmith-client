const deleteOuterElement = (element) => {
    let parentElement = element.parentNode;
    let spanElementInnerHTML = element.innerHTML;
    let startIndex = Array.prototype.indexOf.call(parentElement.childNodes, element);
    let textNode = document.createTextNode(spanElementInnerHTML);
    parentElement.removeChild(element);
    parentElement.insertBefore(textNode, parentElement.childNodes[startIndex]);
};

const replaceSelection = (text, activeElement, parameters) => {
    // Replace the selection with the given text in input and textarea elements
    if (parameters.type === 'textarea') {
        const start = activeElement.selectionStart;
        const end = activeElement.selectionEnd;
        activeElement.value = activeElement.value.substring(0, start) + text + activeElement.value.substring(end);
        activeElement.selectionStart = start;
        activeElement.selectionEnd = start + text.length;
    } else if (parameters.type === 'contenteditable') {
        const range = parameters.range;
        const replacementText = document.createTextNode(text);
        range.deleteContents();
        range.insertNode(replacementText);
    }
}

const deleteTextWriteable = (element, start, end, parameters) => {
    // Replace the selection with the given text in input and textarea elements
    if (parameters.type === 'textarea') {
        const text = element.value.substring(start, end);
        if (text.substring(0) === ' ' && text.substring(-1) === ' ') {
            element.value = element.value.substring(0, start) + element.value.substring(end);
        } else {
            element.value = element.value.substring(0, start - 1) + element.value.substring(end);
        }

    } else if (parameters.type === 'contenteditable') {
        const range = parameters.range;
        range.deleteContents();
    }
}


export { deleteOuterElement, replaceSelection, deleteTextWriteable };