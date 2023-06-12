// // Реалізуйте функціонал отримання даних з API по кліку на кнопку "BUTTON" і виведення їх
// // на сторінку при кожному кліку по кнопці. Кожен факт має мати свій порядковий номер.
// // https://catfact.ninja/

// const btn = document.querySelector('button');
// const info = document.querySelector('.info');
// let count = 0;

// const URL = 'https://catfact.ninja/fact';

// btn.addEventListener('click', onClick);

// function fetchFact() {
//   return fetch(URL).then(res => {
//     if (!res.ok) {
//       throw new Error(res.status);
//     }
//     return res.json();
//   });
// }
// function onClick() {
//   fetchFact().then(res => {
//     return markup(res.fact);
//   }).catch(er=>console.log(er));
// }
// function markup(text) {
//   count += 1;
//   const markup = `<li></li><p>FACT №${count}</p>
// <p>ABOUT CAT:${text}</p></li>`;
//   return info.insertAdjacentHTML('beforeend', markup);
// }

// Реалізуйте функціонал пошуку даних по юзеру з API при сабміті форми і виведення їх на сторінку
// https://agify.io/

// const URL = 'https://api.agify.io';
// const formRef = document.querySelector('form');
// const infoRef = document.querySelector('.info');

// formRef.addEventListener('submit', onFormSubmit);

// function onFormSubmit(evt) {
//   evt.preventDefault();
//   const userName = evt.target.elements.name.value.trim();
//   fetchUser(userName).then(renderMarkup);
// }

// function fetchUser(userName) {
//   return fetch(`${URL}?name=${userName}`).then(res => {
//     if (!res.ok) {
//       throw new Error(res.status);
//     }
//     return res.json();
//   });
// }

// function renderMarkup({ name, count, age }) {
//   const markup = `<p>NAME: ${name}</p>
//       <p>COUNT: ${count}</p>
//       <p>AGE: ${age}</p>`;
//   infoRef.innerHTML = markup;
// }
import Notiflix from 'notiflix';

const data = [];

const refs = {
  addTask: document.querySelector('.add'),
  backdrop: document.querySelector('.js-modal'),
  modal: document.querySelector('.modal'),
  closeModal: document.querySelector('.js-close'),
  modalForm: document.querySelector('.modal-form'),
  listOfTasks: document.querySelector('.list'),
  textarea: document.querySelector('.text'),
};

refs.addTask.addEventListener('click', onOpenModal);
refs.closeModal.addEventListener('click', onCloseModal);
refs.backdrop.addEventListener('click', onBackdropClick);
refs.modalForm.addEventListener('submit', onModalFormClick);
refs.listOfTasks.addEventListener('click', onListClick);

let tasks = JSON.parse(localStorage.getItem('task'));
console.log(tasks);

renderMarkup(tasks);
data.push(...tasks);

function onOpenModal() {
  refs.backdrop.classList.remove('is-hidden');
  refs.modal.classList.remove('is-hidden');
  window.addEventListener('keydown', onEscPress);
}
function onCloseModal() {
  refs.backdrop.classList.add('is-hidden');
  refs.modal.classList.add('is-hidden');
  window.removeEventListener('keydown', onEscPress);
}
function onBackdropClick(evt) {
  if (evt.currentTarget === evt.target) {
    onCloseModal();
  }
}
function onEscPress(evt) {
  if (evt.code === 'Escape') {
    onCloseModal();
  }
}
function onModalFormClick(evt) {
  evt.preventDefault();

  const task = evt.target.elements.task.value;
  if (task === '') {
    Notiflix.Report.warning('Attention', 'Please, enter your task', 'OK');
    return;
  }
  addTask(task);
  onCloseModal();
  refs.modalForm.reset();
}

function addTask(task) {
  refs.textarea.value = '';
  const newTask = {
    id: `${Date.now()}`,
    task: task,
  };
  data.push(newTask);
  renderMarkup([newTask]);

  console.log(data);

  localStorage.setItem('task', JSON.stringify(data));
}

function renderMarkup(array) {
  const markup = array
    .map(
      ({ id, task }) =>
        `<li id=${id} class="item"><p class="task-text">${task}</p>
         <div class="task-buttons">
        <button type="button" class="button delete">Delete</button>
        <button class="button edit">Edit</button>
        </div>
      </li>`
    )
    .join('');

  return refs.listOfTasks.insertAdjacentHTML('beforeend', markup);
}

function onListClick(evt) {
  const elem = evt.target.parentNode;
  const id = elem.parentNode.getAttribute('id');
  if (evt.target.textContent === 'Delete') {
    deleteTask(id);
  }
  if (evt.target.textContent === 'Edit') {
    editTask(id);
  }
}

function deleteTask(taskId) {
  tasks = JSON.parse(localStorage.getItem('task'));
  const newTasks = tasks.filter(({ id }) => id !== taskId);
  localStorage.setItem('task', JSON.stringify(newTasks));
  refs.listOfTasks.innerHTML = '';
  renderMarkup(newTasks);
}
function editTask(taskId) {
  const taskIndex = data.findIndex(task => task.id === taskId);

  if (taskIndex !== -1) {
    const currentTask = data[taskIndex].task;
    const newText = prompt('Редактировать задачу', currentTask);

    if (newText !== null) {
      data[taskIndex].task = newText;
      localStorage.setItem('task', JSON.stringify(data));
      refs.listOfTasks.innerHTML = '';
      renderMarkup(data);
    }
  }
}
