import { error } from '@pnotify/core';
import '@pnotify/core/dist/BrightTheme.css';
import * as basicLightbox from 'basiclightbox';

import './styles.scss';
import imageCardTpl from './tamplates/imageCardTpl.hbs';
import PicturesApiService from './apiService';

const searchFormEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const btnRef = document.querySelector('.load-more-btn');

let galleryArr = [];
let total = 0;
const inputRef = document.querySelector('#search-input');
searchFormEl.addEventListener('submit', onSearch);
btnRef.addEventListener('click', fatchAndRenderPage);

const picturesApiService = new PicturesApiService();

function onSearch(e) {
  e.preventDefault();  
  const value = inputRef.value.trim();
  if (value === ' ' || value.length === 0) {
    inputRef.focus();
    inputRef.select();
    btnRef.style.display = 'none';
    return
  }  
  cleanGallery();
  picturesApiService.resetPage();
  picturesApiService.searchQuery = value;
  fatchAndRenderPage();

}

function cleanGallery() {
  galleryEl.innerHTML = '';
}

function fatchAndRenderPage() {
  picturesApiService
    .fetchImages()
    .then(res => {
      total = res.total;
      galleryArr = res.hits;
      console.log(total, galleryArr)
      if (total = 0) {
        inputRef.focus();
        inputRef.select();
        return
      }
      renderGallery(galleryArr);
      })
    // .then(renderGallery)
    .catch(err =>
      error({
        text: err,
        mode: 'light',
        closer: true,
        hide: true,
        delay: 2000,
      }),
    );
}

function renderGallery(hits) {
  if (total = 0 || total <= 12) {
    btnRef.style.display = 'none';
  }
  if (!hits.length) {
    error({
      text: `enter correct word`,
      mode: 'light',
      closer: true,
      hide: true,
      delay: 2000,
    });
    return;
  }
  btnRef.style.display = 'inline';
  const gallery = imageCardTpl(hits);
  galleryEl.insertAdjacentHTML('beforeend', gallery);
  galleryEl.scrollIntoView({
    behavior: 'smooth',
    block: 'end',
  });

}

galleryEl.addEventListener('click', onClick);
function onClick(e) {
  if (e.target.nodeName !== 'IMG') {
    return;
  }
  const ref = e.target.dataset.ref;
  const instance = basicLightbox.create(`<img src='${ref}' alt='${1}'>`).show();
}
