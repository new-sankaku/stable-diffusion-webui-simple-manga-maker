function createToast(title, message) {
    const container = document.getElementById('toastContainer');
    const toastId = `toast-${Date.now()}`;

    // トーストのHTML要素を生成
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.id = toastId;
    toast.innerHTML = `
        <div class="toast-header">
            <strong class="me-auto">${title}</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
            ${message}
            <div class="progress" style="height: 5px;">
                <div class="progress-bar" role="progressbar" style="width: 100%;"></div>
            </div>
        </div>
    `;

    // トースト要素をコンテナに追加
    container.appendChild(toast);

    // トーストを初期化して表示
    const bsToast = new bootstrap.Toast(toast, {
        autohide: true,
        delay: 3500
    });
    bsToast.show();

    // プログレスバーのアニメーション
    const progressBar = toast.querySelector('.progress-bar');
    const interval = 50; // ミリ秒
    const totalDuration = 3500; // ミリ秒
    let width = 100;
    const timer = setInterval(() => {
        width -= (interval / totalDuration * 100);
        progressBar.style.width = `${width}%`;
        if (width <= 0) clearInterval(timer);
    }, interval);

    toast.addEventListener('hidden.bs.toast', function () {
        clearInterval(timer);
    });
}


function createErrorToast(title, message) {
    const container = document.getElementById('toastContainer');
    const toastId = `toast-${Date.now()}`;

    const toast = document.createElement('div');
    toast.className = 'toast bg-danger text-white';
    toast.id = toastId;
    toast.innerHTML = `
        <div class="toast-header bg-danger text-white">
            <strong class="me-auto">${title}</strong>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
            ${message}
            <div class="progress" style="height: 5px;">
                <div class="progress-bar bg-warning" role="progressbar" style="width: 100%;"></div>
            </div>
        </div>
    `;

    container.appendChild(toast);
    const bsToast = new bootstrap.Toast(toast, {
        autohide: true,
        delay: 3500
    });
    bsToast.show();

    const progressBar = toast.querySelector('.progress-bar');
    const interval = 50;
    const totalDuration = 3500;
    let width = 100;
    const timer = setInterval(() => {
        width -= (interval / totalDuration * 100);
        progressBar.style.width = `${width}%`;
        if (width <= 0) clearInterval(timer);
    }, interval);

    toast.addEventListener('hidden.bs.toast', function () {
        clearInterval(timer);
    });
}
