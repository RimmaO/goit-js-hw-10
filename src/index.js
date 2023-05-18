import './css/styles.css';
import { fetchCountries } from './fetchCountries';
/**
 * import library
 */
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const searchBox = document.getElementById('search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchBox.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput() {
  const name = searchBox.value.trim();

  if (name === '') {
    (countryList.innerHTML = ''), (countryInfo.innerHTML = '');
    return;
  }

  fetchCountries(name)
    .then(countries => {
      countryList.innerHTML = '';
      countryInfo.innerHTML = '';
      if (countries.length === 1) {
        countryInfo.insertAdjacentHTML(
          'beforeend',
          createMarkupInfo(countries)
        );
      } else if (countries.length >= 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else {
        countryList.insertAdjacentHTML(
          'beforeend',
          createMarkupList(countries)
        );
      }
    })
    .catch(Notiflix.Notify.failure('Oops, there is no country with that name'));
}

function createMarkupList(countries) {
  const markupList = countries
    .map(({ name, flags }) => {
      return `
    <li class="country-list-item">
      <img src="${flags.svg}" alt="flag" width = 30px height = 50px class="country-list-img" />
      <p class="country-list-text">${name.official}</p>
    </li>
  `;
    })
    .join('');
  return markupList;
}

function createMarkupInfo(countries) {
  const markupInfo = countries
    .map(({ name, capital, population, flags, languages }) => {
      return `<div class="country-flag">
        <img src="${
          flags.svg
        }" alt="flag" width = 30px height = 50pxclass="country-info-img"  />
        <p class="country-info-text"> <b>${name.official}</b></p>
      </div>
          <ul class="country-info-list list">
      <li class="country-info-item"><p class="country-info-text">Capital: ${capital}</p></li>
      <li class="country-info-item"><p class="country-info-text">Population: ${population}</p></li>
      <li class="country-info-item"><p class="country-info-text">Languages: ${Object.values(
        languages
      )}</p></li>
    </ul>
      `;
    })
    .join('');
  return markupInfo;
}

// 2nd option
// const BASE_URL = 'https://restcountries.com/v3.1/name';
// const params = new URLSearchParams({
//   fields: name,capital,population,flags,languages
// });
// return fetch(`${BASE_URL}/${name}?${params}`);
