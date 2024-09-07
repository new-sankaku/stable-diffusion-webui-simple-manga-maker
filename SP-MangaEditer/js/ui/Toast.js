function createToast(title, messages) {
    return createToast(title, messages, false);
}
function createToastError(title, messages) {
    return createToast(title, messages, true);
}
function createToast(title, messages, isError) {
    const container = $('sp-manga-toastContainer');
    if (!container) {
        console.error('Toast container not found');
        return;
    }

    const toastId = `sp-manga-toast-${Date.now()}`;
    const toast = document.createElement('div');

    var className = 'sp-manga-toast';
    var progressBarClass = 'sp-manga-progress-bar';
    var header = 'sp-manga-toast-header';

    if( isError ){
        className = 'sp-manga-toast-error';
        progressBarClass = 'sp-manga-progress-bar-error';
        header = 'sp-manga-toast-header-error';
    }

    toast.className = className;
        toast.innerHTML = `
        <div class="${header}">
            <strong class="me-auto">${title}</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="sp-manga-toast-body">
            <div id="sp-manga-toastMessageContainer"></div>
            <div class="progress" style="height: 5px;">
                <div class="${progressBarClass}" role="progressbar" style="width: 100%;"></div>
            </div>
        </div>
    `;

    toast.id = toastId;
    toast.style.height = 'auto';

    container.appendChild(toast);

    const bsToast = new bootstrap.Toast(toast, {
        autohide: false
    });
    bsToast.show();

    const messageContainer = toast.querySelector('#sp-manga-toastMessageContainer');
    const lineHeight = 24;

    if (typeof messages === 'string') {
        const messageLine = document.createElement('div');
        messageLine.className = 'sp-manga-line';
        messageLine.textContent = messages;
        messageContainer.appendChild(messageLine);
        toast.style.height = `${80 + lineHeight}px`;
        startProgressBar(toast, progressBarClass);
    } else if (Array.isArray(messages)) {
        let messageIndex = 0;
        const messageInterval = 300;

        const showNextMessage = () => {
            if (messageIndex < messages.length) {
                const messageLine = document.createElement('div');
                messageLine.className = 'sp-manga-line';
                messageLine.style.animationDelay = '0s';
                messageLine.textContent = messages[messageIndex];
                messageContainer.appendChild(messageLine);
                messageIndex++;
                toast.style.height = `auto`;
                setTimeout(showNextMessage, messageInterval);
            } else {
                startProgressBar(toast,progressBarClass);
            }
        };

        showNextMessage();
    } else {
        const messageLine = document.createElement('div');
        messageLine.className = 'sp-manga-line';
        messageLine.textContent = messages;
        messageContainer.appendChild(messageLine);
        toast.style.height = `${80 + lineHeight}px`;
        startProgressBar(toast,progressBarClass);
    }

    toast.addEventListener('hidden.bs.toast', function () {
        toast.style.animation = 'sp-manga-fade-out 1s forwards';
        toast.remove();
    });
}

function startProgressBar(toast, progressBarClass) {
    const progressBar = toast.querySelector("."+progressBarClass);
    const interval = 50;
    const totalDuration = 3500;
    let width = 100;
    const timer = setInterval(() => {
        width -= (interval / totalDuration * 100);
        progressBar.style.width = `${width}%`;
        if (width <= 0) {
            clearInterval(timer);
            const bsToast = bootstrap.Toast.getInstance(toast);
            bsToast.hide();
        }
    }, interval);
}
