

function createToast(title, messages) {
    const container = document.getElementById('toastContainer');
    const toastId = `toast-${Date.now()}`;

    // トーストのHTML要素を生成
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.id = toastId;
    toast.style.height = '80px'; // 初期高さを設定
    toast.innerHTML = `
        <div class="toast-header">
            <strong class="me-auto">${title}</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
            <div id="toastMessageContainer"></div>
            <div class="progress" style="height: 5px;">
                <div class="progress-bar" role="progressbar" style="width: 100%;"></div>
            </div>
        </div>
    `;

    // トースト要素をコンテナに追加
    container.appendChild(toast);

    // トーストを初期化して表示
    const bsToast = new bootstrap.Toast(toast, {
        autohide: false
    });
    bsToast.show();

    // メッセージを1行ずつ描画
    const messageContainer = toast.querySelector('#toastMessageContainer');
    const lineHeight = 24; // 各行の高さを設定

    if (typeof messages === 'string') {
        // messages が文字列の場合
        const messageLine = document.createElement('div');
        messageLine.className = 'line';
        messageLine.textContent = messages;
        messageContainer.appendChild(messageLine);
        toast.style.height = `${80 + lineHeight}px`;
        startProgressBar(toast);
    } else if (Array.isArray(messages)) {
        // messages が配列の場合
        let messageIndex = 0;
        const messageInterval = 300; // ミリ秒

        const showNextMessage = () => {
            if (messageIndex < messages.length) {
                const messageLine = document.createElement('div');
                messageLine.className = 'line';
                messageLine.style.animationDelay = '0s'; // アニメーションディレイを0に設定
                messageLine.textContent = messages[messageIndex];
                messageContainer.appendChild(messageLine);
                messageIndex++;
                // トーストの高さを増加させ、同時にメッセージを描画
                toast.style.height = `${80 + (messageIndex * lineHeight)}px`;
                setTimeout(showNextMessage, messageInterval);
            } else {
                // 全てのメッセージが表示された後にプログレスバーを開始
                startProgressBar(toast);
            }
        };

        showNextMessage();
    } else {
        const messageLine = document.createElement('div');
        messageLine.className = 'line';
        messageLine.textContent = messages;
        messageContainer.appendChild(messageLine);
        toast.style.height = `${80 + lineHeight}px`;
        startProgressBar(toast);
    }

    toast.addEventListener('hidden.bs.toast', function () {
        toast.style.animation = 'fade-out 1s forwards';
    });
}


function startProgressBar(toast) {
    const progressBar = toast.querySelector('.progress-bar');
    const interval = 50; // ミリ秒
    const totalDuration = 3500; // ミリ秒
    let width = 100;
    const timer = setInterval(() => {
        width -= (interval / totalDuration * 100);
        progressBar.style.width = `${width}%`;
        if (width <= 0) {
            clearInterval(timer);
            // トーストを自動的に閉じる
            const bsToast = bootstrap.Toast.getInstance(toast);
            bsToast.hide();
        }
    }, interval);
}