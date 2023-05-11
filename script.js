let editedArticleId = null;
let saveButton = null;

let container = document.createElement('div');
container.className = 'container';
document.body.appendChild(container);

function getArticles() {
    showLoading();
    fetch('http://localhost:3000/articles')
        .then(
            function (response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                    return;
                }
                response.json().then(function (articlesList) {
                    refreshArticles();
                    renderArticles(articlesList);
                });
            })
        .catch(function (err) {
            console.log('Fetch Error :-S', err);
        });
}

function postArticle() {
    let title = document.getElementById('title').value;
    let tag = document.getElementById('tag').value;
    let author = document.getElementById('author').value;
    let date = document.getElementById('date').value;
    let imgUrl = document.getElementById('imgUrl').value;
    let content = document.getElementById('content').value;
    refreshArticles();
    showLoading();
    fetch('http://localhost:3000/articles', {
        method: 'post',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({title, tag, author, date, imgUrl, content})
    }).then(res => res.json())
        .then(() => {
            refreshArticles();
            getArticles();
            closeModal();
            clearModalForm();
        })
        .catch(function (error) {
            console.log('Request failed', error);
        });
}

function updateArticle() {
    let title = document.getElementById('title').value;
    let tag = document.getElementById('tag').value;
    let author = document.getElementById('author').value;
    let date = document.getElementById('date').value;
    let imgUrl = document.getElementById('imgUrl').value;
    let content = document.getElementById('content').value;
    refreshArticles();
    showLoading();
    fetch(`http://localhost:3000/articles/${editedArticleId}`, {
        method: 'put',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({title, tag, author, date, imgUrl, content})
    }).then(res => res.json())
        .then(() => {
            refreshArticles();
            getArticles();
            closeModal();
            clearModalForm();
        })
        .catch(function (error) {
            console.log('Request failed', error);
        });
}

function deleteArticle(id) {
    fetch(`http://localhost:3000/articles/${id}`, {
        method: 'delete',
    })
        .then(
            function (response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                    return;
                }
                response.json().then(function () {
                    refreshArticles();
                    getArticles();
                });
            })
        .catch(function (error) {
            console.log('Request failed', error);
        });
}

function showLoading() {
    let main = document.querySelector("main");
    let spinner = document.createElement('div');
    spinner.className = 'spinner';
    main.appendChild(spinner);
}

function refreshArticles() {
    let main = document.querySelector("main");
    while (main.firstChild) {
        main.removeChild(main.firstChild);
    }
}

function fillModalForm(article) {
    const title = document.getElementById('title');
    const tag = document.getElementById('tag');
    const author = document.getElementById('author');
    const date = document.getElementById('date');
    const imgUrl = document.getElementById('imgUrl');
    const content = document.getElementById('content');
    title.value = article.title;
    tag.value = article.tag;
    author.value = article.author;
    date.value = article.date;
    imgUrl.value = article.imgUrl;
    content.value = article.content;
    editedArticleId = article.id;
}

function clearModalForm() {
    const title = document.getElementById('title');
    const tag = document.getElementById('tag');
    const author = document.getElementById('author');
    const date = document.getElementById('date');
    const imgUrl = document.getElementById('imgUrl');
    const content = document.getElementById('content');
    title.value = '';
    tag.value = '';
    author.value = '';
    date.value = '';
    imgUrl.value = '';
    content.value = '';
    editedArticleId = null;
}

function openModal() {
    let modalOverlay = document.querySelector('.modal__overlay');
    modalOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    let modalOverlay = document.querySelector('.modal__overlay');
    modalOverlay.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function renderNavbar() {
    let nav = document.createElement('nav');
    nav.className = 'nav';

    let navContainer = document.createElement('ul');
    navContainer.className = 'nav__container';

    let navItems = ['Travel updates', 'Reviews', 'About', 'Contact'];

    navItems.forEach(item => {
        let li = document.createElement('li');
        li.className = 'nav__item';

        let a = document.createElement('a');
        a.href = '';
        a.className = 'nav__link';
        a.textContent = item;

        li.appendChild(a);
        navContainer.appendChild(li);
    });

    nav.appendChild(navContainer);
    container.appendChild(nav);
}

function renderAddArticleButton() {
    let addContainer = document.createElement('div');
    addContainer.className = 'add__container';

    let addButton = document.createElement('button');
    addButton.type = 'button';
    addButton.className = 'button';
    addButton.textContent = ' + Add Article';
    addButton.addEventListener('click', function () {
        openModal();
        saveButton.removeEventListener('click', updateArticle);
        saveButton.addEventListener('click', postArticle);
    })

    addContainer.appendChild(addButton);
    container.appendChild(addContainer);
}

function renderFooter() {
    let footer = document.createElement('footer');
    footer.className = 'footer';

    let footerLinks = ['previous', 'next'];

    footerLinks.forEach(link => {
        let a = document.createElement('a');
        a.href = '#';
        a.className = 'footer__link';
        a.textContent = link;

        footer.appendChild(a);
    });

    container.appendChild(footer);
}

function renderModal() {
    let modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal__overlay';

    let modal = document.createElement('div');
    modal.className = 'modal';

    let modalContent = document.createElement('div');
    modalContent.className = 'modal__content';

    let modalTitle = document.createElement('h2');
    modalTitle.className = 'title';
    modalTitle.textContent = 'Add/Edit article';
    modalContent.appendChild(modalTitle);

    let inputsContainer = document.createElement('div');
    inputsContainer.className = 'inputs__container';

    let inputs = [
        {
            id: 'title',
            type: 'text',
            className: 'input',
            placeholder: 'Please enter title'
        },
        {
            id: 'tag',
            type: 'text',
            className: 'input',
            placeholder: 'Please enter tag'
        },
        {
            id: 'author',
            type: 'text',
            className: 'input',
            placeholder: 'Please enter author'
        },
        {
            id: 'date',
            type: 'text',
            className: 'input',
            placeholder: 'Please enter date'
        },
        {
            id: 'imgUrl',
            type: 'text',
            className: 'input',
            placeholder: 'Please enter image url'
        },
    ]

    inputs.forEach(input => {
        let inputElement = document.createElement('input');
        inputElement.id = input.id;
        inputElement.type = input.type;
        inputElement.className = input.className;
        inputElement.placeholder = input.placeholder;
        inputsContainer.appendChild(inputElement);
    });

    modalContent.appendChild(inputsContainer);

    let textarea = document.createElement('textarea');
    textarea.id = 'content';
    textarea.className = 'textarea';
    textarea.name = 'content';
    textarea.cols = 28;
    textarea.rows = 7;
    textarea.placeholder = 'Please enter content';
    modalContent.appendChild(textarea);

    let modalButtons = document.createElement('div');
    modalButtons.className = 'modal__buttons';

    let buttons = [
        {
            id: 'cancel',
            type: 'button',
            className: 'button',
            textContent: 'Cancel',
            listener: () => {
                closeModal();
                clearModalForm();
            },
        },
        {
            id: 'save',
            type: 'button',
            className: 'button button--pink',
            textContent: 'Save',
            listener: null,
        },
    ]

    buttons.forEach(button => {
        let buttonElement = document.createElement('button');
        buttonElement.id = button.id;
        buttonElement.type = button.type;
        buttonElement.className = button.className;
        buttonElement.textContent = button.textContent;
        buttonElement.addEventListener('click', button.listener);
        modalButtons.appendChild(buttonElement);

        if (button.id === 'save') {
            saveButton = buttonElement;
        }
    })

    modalContent.appendChild(modalButtons);
    modal.appendChild(modalContent);
    modalOverlay.appendChild(modal);

    container.appendChild(modalOverlay);
}

function renderArticles(articlesList) {
    let main = document.querySelector('main');

    articlesList.sort((a, b) => b.id - a.id);
    articlesList.forEach((article) => {
        let articleElement = document.createElement('article');

        let h2 = document.createElement('h2');
        h2.className = 'title';
        h2.textContent = article.title;

        let infoContainer = document.createElement('ul');
        infoContainer.className = 'info__container';
        let infoItems = [article.tag, 'Added by ', article.date];
        infoItems.forEach((item, index) => {
            let li = document.createElement('li');
            li.className = 'info__item';
            if (index === 1) {
                let span = document.createElement('span');
                span.className = 'info__mark';
                span.textContent = article.author;
                li.textContent = item;
                li.appendChild(span);
            } else {
                li.textContent = item;
            }
            infoContainer.appendChild(li);
        });

        let actionsContainer = document.createElement('div');
        actionsContainer.className = 'actions__container';

        let editButton = document.createElement('button');
        editButton.type = 'button';
        editButton.className = 'actions__btn';
        editButton.textContent = "Edit";
        editButton.addEventListener('click', function () {
            fillModalForm(article);
            openModal();
            saveButton.removeEventListener('click', postArticle);
            saveButton.addEventListener('click', updateArticle);
        })

        let deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.className = 'actions__btn';
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener('click', function () {
            deleteArticle(article.id);
        })

        actionsContainer.appendChild(editButton);
        actionsContainer.appendChild(deleteButton);

        let img = document.createElement('img');
        img.setAttribute('src', article.imgUrl);
        img.setAttribute('alt', article.title);

        let contentContainer = document.createElement('div');
        contentContainer.className = 'content__container';
        let p = document.createElement('p');
        p.textContent = article.content;
        contentContainer.appendChild(p);

        articleElement.appendChild(h2);
        articleElement.appendChild(infoContainer);
        articleElement.appendChild(actionsContainer);
        articleElement.appendChild(img);
        articleElement.appendChild(contentContainer);

        main.appendChild(articleElement);
    })
}

function init() {
    renderNavbar();
    renderAddArticleButton();
    let main = document.createElement('main');
    container.appendChild(main);
    getArticles();
    renderFooter();
    renderModal();
}

init();
