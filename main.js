const boardItem = document.querySelectorAll('.board__row__item');
const containers = document.querySelectorAll('.board__row__items');
// const boardItemEdit = document.querySelector('.board__row__item--edit'); /*TODO: remove opacity when dragging* /


boardItem.forEach(function(item) {
    item.addEventListener('dragstart', function() {
        item.classList.add('dragging');
    });
    item.addEventListener('dragend', function() {
        item.classList.remove('dragging');
    });
})

containers.forEach(function(container) {
    container.addEventListener('dragover', function(e) {
        e.preventDefault();
        const item = document.querySelector('.dragging');
        const afterElement = getDragAfterElement(container, e.clientY);

        if (afterElement == null) {
            container.appendChild(item)
        } else {
            container.insertBefore(item, afterElement)
        }
    })
})

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.board__row__item:not(.dragging)')]

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect()
        const offset = y - box.top - box.height / 2
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child }
        } else {
            return closest
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element
}