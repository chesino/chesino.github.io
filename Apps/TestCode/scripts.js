function runCode() {
    var htmlCode = document.getElementById("html-code").value;
    var cssCode = document.getElementById("css-code").value;
    var jsCode = document.getElementById("js-code").value;

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