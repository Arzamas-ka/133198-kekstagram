'use strict';

var MIN_LIKES = 15;
var MAX_LIKES = 200;
var COUNT_POSTS = 25;

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

function generateDataObj() {
  for (var i = 0; i < COUNT_POSTS; i++) {
    var randomComment = comments[Math.floor(Math.random() * 6)];
    var randomLikes = Math.floor(Math.random() * MAX_LIKES);
    randomLikes = randomLikes > MIN_LIKES ? randomLikes : randomLikes + MIN_LIKES;

    var post = {
      comment: randomComment,
      likes: randomLikes
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
    copyTemplate.querySelector('.picture-comments').textContent = post.comment;
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

function fillGallery(postData, imageUrl) {
  var gallery = document.querySelector('.gallery-overlay');
  gallery.querySelector('img').src = imageUrl;
  gallery.querySelector('.likes-count').textContent = postData.likes;
  gallery.querySelector('.comments-count').textContent = 1;
  gallery.classList.remove('hidden');
}

function getFirstItem(items) {
  return items[0];
}

generateDataObj();
fillTemplates();
renderTemplate();
fillGallery(getFirstItem(posts), getFirstItem(urlImages));
