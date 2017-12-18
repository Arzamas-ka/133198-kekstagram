'use strict';

var MIN_LIKES = 15;
var MAX_LIKES = 200;
var COUNT_POSTS = 25;
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;
var COMMENTS_COUNT = 2;
var COMMENTS_TEXT_COUNT = 6;
var STEP = 25;

var urlImages = [
  './photos/1.jpg', './photos/2.jpg', './photos/3.jpg', './photos/4.jpg',
  './photos/5.jpg', './photos/6.jpg', './photos/7.jpg', './photos/8.jpg',
  './photos/9.jpg', './photos/10.jpg', './photos/11.jpg', './photos/12.jpg',
  './photos/13.jpg', './photos/14.jpg', './photos/15.jpg', './photos/16.jpg',
  './photos/17.jpg', './photos/18.jpg', './photos/19.jpg', './photos/20.jpg',
  './photos/21.jpg', './photos/22.jpg', './photos/23.jpg', './photos/24.jpg',
  './photos/25.jpg'
];

var comments = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.'
];

var template = document.querySelector('#picture-template').content;
var templateCopies = [];
var posts = [];
var gallery = document.querySelector('.gallery-overlay');
var pictureContainer = document.querySelector('.pictures.container');
var filterPopup = document.querySelector('.upload-overlay');
var crossPopup = document.querySelector('.upload-form-cancel');
var btn = document.querySelector('.upload-form-submit');
var imgPreview = filterPopup.querySelector('.effect-image-preview');
var decrementBtn = filterPopup.querySelector('.upload-resize-controls-button-dec');
var incrementBtn = filterPopup.querySelector('.upload-resize-controls-button-inc');
var totalSize = filterPopup.querySelector('.upload-resize-controls-value');
var minPercent = STEP;
var maxPercent = STEP * 4;

function generateDataObj() {
  for (var i = 0; i < COUNT_POSTS; i++) {
    var commentsCount = Math.ceil(Math.random() * COMMENTS_COUNT);
    var randomComments = [];

    if (commentsCount === 1) {
      randomComments = [comments[Math.floor(Math.random() * COMMENTS_TEXT_COUNT)]];
    } else {
      randomComments = [comments[Math.floor(Math.random() * COMMENTS_TEXT_COUNT)], comments[Math.floor(Math.random() * COMMENTS_TEXT_COUNT)]];
    }

    var randomLikes = Math.floor(Math.random() * MAX_LIKES);
    randomLikes = randomLikes >= MIN_LIKES ? randomLikes : randomLikes + MIN_LIKES;

    var post = {
      likes: randomLikes,
      commentsCount: commentsCount,
      comments: randomComments
    };

    posts.push(post);
  }
}

function fillTemplates() {
  for (var i = 0; i < COUNT_POSTS; i++) {
    var copyTemplate = template.cloneNode(true);
    var post = posts[i];

    copyTemplate.querySelector('img').src = urlImages[i];
    copyTemplate.querySelector('.picture-likes').textContent = post.likes;
    copyTemplate.querySelector('.picture-comments').textContent = post.commentsCount;
    templateCopies[i] = copyTemplate;
  }
}

function renderTemplate() {
  var fragment = document.createDocumentFragment();

  for (var j = 0; j < COUNT_POSTS; j++) {
    fragment.appendChild(templateCopies[j]);
  }

  document.querySelector('.pictures').appendChild(fragment);
}

function fillGallery(post, imageUrl) {
  gallery.querySelector('img').src = imageUrl;
  gallery.querySelector('.likes-count').textContent = post.likes;
  gallery.querySelector('.comments-count').textContent = post.commentsCount;
  showPopup();
}

function getFirstItem(items) {
  return items[0];
}

function showPopup() {
  gallery.classList.remove('hidden');
}

function hidePopup() {
  gallery.classList.add('hidden');
  document.removeEventListener('keydown', popupEscHandler);
}

generateDataObj();
fillTemplates();
renderTemplate();
fillGallery(getFirstItem(posts), getFirstItem(urlImages));
hidePopup();

function popupEscHandler(evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    hidePopup();
  }
}

function popupEnterHandler(evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    hidePopup();
  }
}

function fillDataPopup(evt) {
  var parentLink = evt.target.parentElement;
  var sourceImage = evt.target.src;
  var likesCount = parseInt(parentLink.querySelector('.picture-likes').textContent, 10);
  var commentsCount = parentLink.querySelector('.picture-comments').textContent;

  gallery.querySelector('.gallery-overlay-image').src = sourceImage;
  gallery.querySelector('.likes-count').textContent = likesCount;
  gallery.querySelector('.comments-count').textContent = commentsCount;
}

function getClicks() {
  function photoClickHandler(evt) {
    evt.preventDefault();
    evt.stopPropagation();

    if (evt.target.tagName === 'IMG') {
      fillDataPopup(evt);
    }

    showPopup();
    gallery.querySelector('.gallery-overlay-close').focus();
    document.addEventListener('keydown', popupEscHandler);
    document.addEventListener('keydown', popupEnterHandler);
  }

  pictureContainer.addEventListener('click', photoClickHandler);
  gallery.querySelector('.gallery-overlay-close').addEventListener('click', function () {
    hidePopup();
  });
  gallery.querySelector('.gallery-overlay-close').addEventListener('keydown', popupEnterHandler);
}

getClicks();

// Показ/скрытие формы кадрирования
function hideFilter() {
  filterPopup.classList.add('hidden');
}

function filterEscHandler(evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    hideFilter();
  }
}

function filterEnterHandler(evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    hideFilter();
  }
}

function openFilter() {
  document.querySelector('#upload-file').addEventListener('change', function () {
    filterPopup.classList.remove('hidden');
  });
}

// Добавить обработчики для альтернативного ввода с клавиатуры
function handleUserActions() {
  crossPopup.addEventListener('click', function () {
    hideFilter();
  });

  crossPopup.addEventListener('keydown', filterEnterHandler);
  document.addEventListener('keydown', filterEscHandler);
  btn.addEventListener('keydown', filterEnterHandler);
  // Если фокус находится на форме ввода комментария, то форма закрываться не должна
  var commentInput = document.querySelector('.upload-form-description');

  commentInput.addEventListener('focus', function () {
    document.removeEventListener('keydown', filterEscHandler);
  });

  commentInput.addEventListener('blur', function () {
    document.addEventListener('keydown', filterEscHandler);
  });
}

openFilter();
handleUserActions();

// Работа с фильтрами
function changeEffect(evt) {
  if (evt.target.tagName === 'INPUT') {
    evt.stopPropagation();

    var effectName = evt.target.id;
    // обрезаем класс
    effectName = effectName.split('-').slice(1).join('-');
    // удаляем старый
    imgPreview.className = 'effect-image-preview';
    // вешаем новый
    imgPreview.classList.add(effectName);
  }
}

filterPopup.querySelector('.upload-effect-controls').addEventListener('click', changeEffect, true);

// Изменение масштаба изображения
function setSize(size) {
  var transformScale = size / 100;
  totalSize.value = size + '%';
  imgPreview.style.transform = 'scale(' + transformScale + ')';
}

// уменьшение изображения
decrementBtn.addEventListener('click', function () {
  var size = parseInt(totalSize.value, 10) - STEP;
  if (size < minPercent) {
    size = minPercent;
  }
  setSize(size);
});

// увеличение изображения
incrementBtn.addEventListener('click', function () {
  var size = parseInt(totalSize.value, 10) + STEP;
  if (size > maxPercent) {
    size = maxPercent;
  }
  setSize(size);
});

// Хэш-теги
var hashTagInput = filterPopup.querySelector('.upload-form-hashtags');
var submitPopup = filterPopup.querySelector('.upload-form-submit');
var lengthTag = 20;
var maxLenghtHashtag = 5;

function hasStartHash(str) {
  return str[0] !== '#';
}

function setInvalidBorder(str, color) {
  hashTagInput.setCustomValidity(str);
  hashTagInput.style.outlineColor = color;
}

function validateHashTags(hashTagValue) {
  var selected = [];
  hashTagValue = hashTagValue.toLowerCase().trim().replace(/\s{2,}/g, ' ');
  if (hashTagValue.match(/\S#/) !== null) {
    setInvalidBorder('Хештеги должны быть разделены пробелами', 'red');
  } else {
    setInvalidBorder('', 'none');
    var parts = hashTagValue.split(' ');

    if (parts.length > 0) {
      if (parts.length > maxLenghtHashtag) {
        setInvalidBorder('Нельзя указать больше пяти хэш-тегов', 'red');
      }
      parts.forEach(function (item, i, arr) {
        if (hasStartHash(item)) {
          setInvalidBorder('Хэш-тег начинается с символа #', 'red');
        }
        if (item.length > lengthTag) {
          setInvalidBorder('Максимальная длина одного хэш-тега 20 символов', 'red');
        }
        selected = arr.filter(function (a) {
          return a === item;
        });
        if (selected.length > 1) {
          setInvalidBorder('Хештеги не должны повторяться', 'red');
        }
      });
    }
  }
}

submitPopup.addEventListener('click', function () {
  validateHashTags(hashTagInput.value);
});
