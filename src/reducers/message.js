import {SET_CLASS_LIST, SET_GRADE_LIST, SET_MESSAGE, SET_ORG_LIST} from '../types/message';

/**
 * reducer
 * @type {{message: string}}
 */

const initMessageState = {
    message: ''
};
const initOrgListState = {
    orgList: []
};
const initClassListState = {
    classList: []
};
const initGradeListState = {
    gradeList: [
        {value: '10001', label: '一年级'},
        {value: '10002', label: '二年级'},
        {value: '10003', label: '三年级'},
        {value: '10004', label: '四年级'},
        {value: '10005', label: '五年级'},
        {value: '10006', label: '六年级'}
    ]
};
export const messageReducer = (state = initMessageState, action) => {
    switch (action.type) {
        case SET_MESSAGE :
            return {...state, message: action.payload.message};
        default :
            return state
    }
};

export const orgListReducer = (state = initOrgListState, action) => {
    switch (action.type) {
        case SET_ORG_LIST :
            return {...state, orgList: action.payload.orgList};
        default :
            return state
    }
};

export const classListReducer = (state = initClassListState, action) => {
    switch (action.type) {
        case SET_CLASS_LIST :
            return {...state, classList: action.payload.classList};
        default :
            return state
    }
};

export const gradeListReducer = (state = initGradeListState, action) => {
    switch (action.type) {
        case SET_GRADE_LIST :
            return {...state, gradeList: action.payload.gradeList};
        default :
            return state
    }
};