'use strict';

var MIN_LIKES = 15;
var MAX_LIKES = 200;
var COUNT_POSTS = 25;
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;
var COMMENTS_COUNT = 2;
var COMMENTS_TEXT_COUNT = 6;

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


var pictureContainer = document.querySelector('.pictures.container');

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
