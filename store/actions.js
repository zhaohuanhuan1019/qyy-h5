/**
 * Created by yangjiali on 2017/9/13.
 */

import * as types from './mutations-types.js';
import {saveSearch, clearSearch, deleteSearch} from 'approve/js/cache';

export const saveSearchHistory = ({commit}, query) => {
    commit(types.SET_SEARCH_HISTORY, saveSearch(query))
};

export const deleteSearchHistory = ({commit}, query) => {
    commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
};

export const clearSearchHistory = ({commit}) => {
    commit(types.SET_SEARCH_HISTORY, clearSearch())
};
