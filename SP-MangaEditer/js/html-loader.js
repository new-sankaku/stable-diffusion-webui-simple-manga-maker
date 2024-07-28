// 詳細なログを出力する関数
function log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    console[type](`[${timestamp}] ${message}`);
}

function loadContent(scriptId, targetId) {
    const script = document.createElement('script');
    script.src = 'js/html-component/' + scriptId + '.js';

    script.onload = function() {
        if (typeof window.html === 'function') {
            const content = window.html();
            if( targetId ){
                document.getElementById(targetId).innerHTML = content;
            }else{
                document.getElementById("head-id").innerHTML = document.getElementById("head-id").innerHTML + content;
            }
            delete window.html;
            // console.log( "innerHTML:", document.getElementById("head-id").innerHTML );
        } else {
            document.getElementById("head-id").innerHTML = `<p style="color: red;">Error: Content for ${scriptId} could not be loaded.</p>`;
        }
    };

    script.onerror = function() {
        document.getElementById("head-id").innerHTML = `<p style="color: red;">Error: Script ${scriptId}.js could not be loaded.</p>`;
    };

    document.head.appendChild(script);
}

function loadCSS(href) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;

    link.onload = function() {
        log(`CSS ${href} loaded successfully`);
    };

    link.onerror = function() {
        log(`Failed to load CSS: ${href}`, 'error');
    };

    document.head.appendChild(link);
}

log('app.js executed');

loadContent('menu-html', 'desu-nav');
loadContent('sidebar-html');
loadContent('canvas-html');
loadContent('layer-html');
loadContent('controle-html');
