import {SET_MESSAGE, SET_CLASS_LIST, SET_GRADE_LIST, SET_ORG_LIST} from '../types/message';

/**
 * action
 * @param message
 * @returns {Function}
 */
export const setMessage = (message) => {
    return dispatch => {
        dispatch({
            type: SET_MESSAGE,
            payload: {
                message
            }
        })
    }
};

export const setOrgList = (orgList) => {
    return dispatch => {
        dispatch({
            type: SET_ORG_LIST,
            payload: {
                orgList
            }
        })
    }
};

export const setClassList = (classList) => {
    return dispatch => {
        dispatch({
            type: SET_CLASS_LIST,
            payload: {
                classList
            }
        })
    }
};


export const setGradeList = (gradeList) => {
    return dispatch => {
        dispatch({
            type: SET_GRADE_LIST,
            payload: {
                gradeList
            }
        })
    }
};

