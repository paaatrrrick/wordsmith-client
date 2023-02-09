class Span {
    constructor(element, elementId, error, parent) {
        this.error = error;
        this.element = element;
        this.elementId = elementId;
        this.text = element.textContent;
        this.addHighlight(error);
    }

    addHighlight(error) {
        console.log('adding highlight');
        console.log(error);
        const startIndex = error.index;
        const endIndex = error.offset + startIndex;
        const reason = error.reason;
        const contentEditableElement = this.element;
        var textContent = contentEditableElement.textContent;
        var range = document.createRange();
        var startNode = this.getTextNodeAtPosition(startIndex);
        console.log(startNode);
        var endNode = this.getTextNodeAtPosition(endIndex);
        console.log(endNode);

        range.setStart(startNode.node, startNode.position);
        range.setEnd(endNode.node, endNode.position);
        var selectedText = range.toString();

        var span = document.createElement("span");
        span.style.backgroundColor = "blue";
        span.style.color = "white";
        var textNode = document.createTextNode(selectedText);
        span.appendChild(textNode);

        range.deleteContents();
        range.insertNode(span);
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

    //create a toString method for console.logs to show the text and elementId

    toString() {
        return `Element: ${this.elementId} Text: ${this.text}`;
    }
}

export default Span;