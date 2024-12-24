document.getElementById('publish-btn').addEventListener('click', async function (event) {
    event.preventDefault();
    const messageInput = document.getElementById('message-text');
    const messageText = messageInput.value.trim();

    if (messageText) {
        // Добавляем текст в list-group
        const postList = document.getElementById('post-list');
        const newPost = document.createElement('li');
        newPost.className = 'list-group-item p-4';
        newPost.style.wordWrap = 'break-word';
        newPost.textContent = messageText;
        postList.appendChild(newPost);

        // Создаем кнопку для удаления с изображением
        const deleteButton = createDeleteButton();
        
        // Добавляем кнопку к элементу списка
        newPost.style.position = 'relative';
        newPost.appendChild(deleteButton);

        // Вставляем новую статью в начало списка
        postList.insertBefore(newPost, postList.firstChild);

        // Очищаем текстовое поле
        messageInput.value = '';

        // Закрываем модальное окно
        const modal = bootstrap.Modal.getInstance(document.getElementById('exampleModal'));
        modal.hide();


        // Отправляем данные на сервер
        const response = await fetch("http://127.0.0.1:8000/article", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ article: messageText }),
        });

        if (response.ok) {
            console.log("Post published successfully!");
            const result = await response.json();
            newPost.dataset.id = result.id;
        } else {
            console.log("Failed to publish post.");
        }
    }
});

document.addEventListener('DOMContentLoaded', async function () {
    // Получаем список статей с сервера
    const response = await fetch("http://127.0.0.1:8000/article");
    if (response.ok) {
        const data = await response.json();
        const articles = data.articles; // Массив статей
        
        // Отображаем статьи на странице
        const postList = document.getElementById('post-list');
        postList.innerHTML = ''; // Очищаем существующий список

        // Добавляем каждую статью в список
        articles.forEach(article => {
            const newPost = document.createElement('li');
            newPost.className = 'list-group-item p-4';
            newPost.style.wordWrap = 'break-word';
            newPost.textContent = article.article; // Печатаем только текст статьи
            newPost.dataset.id = article.id
            postList.appendChild(newPost);

            // Создаем кнопку для удаления с изображением
            const deleteButton = createDeleteButton();

            // Добавляем кнопку к элементу списка
            newPost.style.position = 'relative';
            newPost.appendChild(deleteButton);
        });
    } else {
        console.error('Failed to load articles.');
    }
});

function createDeleteButton() {
    // Создаём кнопку для удаления с изображением
    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-sm position-absolute bottom-0 end-0 m-2';

    // Добавляем картинку в кнопку
    const deleteImage = document.createElement('img');
    deleteImage.src = '../img/bin.png'; // Укажите путь к вашему изображению
    deleteImage.alt = 'Delete';
    deleteImage.style.width = '20px'; // Размер изображения
    deleteImage.style.height = 'auto'; // Автоматическая высота изображения

    // Вставляем картинку в кнопку
    deleteButton.appendChild(deleteImage);

    // Обработчик события для удаления
    deleteButton.addEventListener('click', async function () {
        // Удаляем пост из списка на странице
        const postItem = deleteButton.closest('li');
        const postId = postItem.dataset.id;

        // Отправляем запрос на сервер для удаления статьи
        const response = await fetch(`http://127.0.0.1:8000/article/${postId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            // Удаляем статью из списка на клиенте, если сервер успешно удалил её
            postItem.remove();
            console.log('Post deleted successfully!');
        } else {
            console.log('Failed to delete post.');
        }
    });

    return deleteButton
}


