// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

// инициализация всплывающих подсказок и окон

// ----------------------------------------------------------------------------

// инициализация всплывающих подсказок и окон при загрузке страницы
window.addEventListener('load', () => {

    // инициализация всплывающих подсказок
    let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        .concat([].slice.call(document.querySelectorAll('[data-bs-toggle-second="tooltip"]')));
    let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });

    // инициализация всплывающих окон
    let popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
        .concat([].slice.call(document.querySelectorAll('[data-bs-toggle-second="popover"]')));
    let popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

}); // window.addEventListener

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------