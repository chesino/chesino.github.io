document.addEventListener("DOMContentLoaded", function () {
    htmlCodeMirror = CodeMirror.fromTextArea(document.getElementById("html-code"), {
        mode: "htmlmixed",
        theme: "dracula",
        lineNumbers: true,
        lineWrapping: true,
        autofocus: true,
        styleActiveLine: true,
        styleSelectedText: true
    });

    cssCodeMirror = CodeMirror.fromTextArea(document.getElementById("css-code"), {
        mode: "css",
        theme: "dracula",
        lineNumbers: true,
        lineWrapping: true,
        autofocus: true,
        styleActiveLine: true,
        styleSelectedText: true
    });

    jsCodeMirror = CodeMirror.fromTextArea(document.getElementById("js-code"), {
        mode: "javascript",
        theme: "dracula",
        lineNumbers: true,
        lineWrapping: true,
        autofocus: true,
        styleActiveLine: true,
        styleSelectedText: true
    });
});

function runCode() {
    var htmlCode = htmlCodeMirror.getValue();
    var cssCode = cssCodeMirror.getValue();
    var jsCode = jsCodeMirror.getValue();

    var resultFrame = document.getElementById("result-frame");
    var resultDocument = resultFrame.contentDocument || resultFrame.contentWindow.document;

    resultDocument.open();
    resultDocument.write(`
        <html>
            <head>
                <style>${cssCode}</style>
            </head>
            <body>${htmlCode}</body>
            <script>${jsCode}</script>
        </html>
    `);
    resultDocument.close();
}