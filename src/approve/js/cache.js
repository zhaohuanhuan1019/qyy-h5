/**
 * Created by yangjiali on 2017/9/13.
 */
import storage from 'good-storage'

const SEARCH_KEY = '__search__';
const SEARCH_MAX_LEN = 5;


function insertArray(arr, val, compare, maxLen) {
    let index;
    if (Array.prototype.findIndex) {
        index = arr.findIndex(compare);
    } else {
        index = arr.indexOf(val);
    }
    if (index === 0) {
        return
    }
    if (index > 0) {
        arr.splice(index, 1)
    }
    arr.unshift(val)
    if (maxLen && arr.length > maxLen) {
        arr.pop()
    }
}

function deleteFromArray(arr, compare) {
    let index;
    if (Array.prototype.findIndex) {
        index = arr.findIndex(compare);
    } else {
        index = arr.indexOf(val);
    }
    if (index > -1) {
        arr.splice(index, 1)
    }
}

export function saveSearch(query) {
    let searches = storage.get(SEARCH_KEY, []);
    insertArray(searches, query, (item) => {
        return item === query
    }, SEARCH_MAX_LEN);
    storage.set(SEARCH_KEY, searches);
    return searches
}

export function deleteSearch(query) {
    let searches = storage.get(SEARCH_KEY, []);
    deleteFromArray(searches, (item) => {
        return item === query
    })
    storage.set(SEARCH_KEY, searches);
    return searches
}

export function clearSearch() {
    storage.remove(SEARCH_KEY);
    return []
}

export function loadSearch() {
    return storage.get(SEARCH_KEY, [])
}


