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


function downloadCode(type) {
    let code;
    switch (type) {
        case 'html':
            code = htmlCodeMirror.getValue();
            break;
        case 'css':
            code = cssCodeMirror.getValue();
            break;
        case 'js':
            code = jsCodeMirror.getValue();
            break;
        default:
            return;
    }

    const blob = new Blob([code], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${type}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Function để tải lên các mã nguồn
function uploadCode(type) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = `.${type}`;

    input.onchange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (readerEvent) => {
            const content = readerEvent.target.result;

            switch (type) {
                case 'html':
                    htmlCodeMirror.setValue(content);
                    break;
                case 'css':
                    cssCodeMirror.setValue(content);
                    break;
                case 'js':
                    jsCodeMirror.setValue(content);
                    break;
                default:
                    return;
            }
        };

        reader.readAsText(file);
    };

    input.click();
}

// Gán các hàm vào các nút tương ứng
document.getElementById('download-html').onclick = () => downloadCode('html');
document.getElementById('download-css').onclick = () => downloadCode('css');
document.getElementById('download-js').onclick = () => downloadCode('js');
document.getElementById('upload-html').onclick = () => uploadCode('html');
document.getElementById('upload-css').onclick = () => uploadCode('css');
document.getElementById('upload-js').onclick = () => uploadCode('js');
