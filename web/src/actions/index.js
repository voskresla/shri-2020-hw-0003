// import API
import api from "../api/schoolcicerver";

// CONST
export const SAVE_SETTINGS_TO_REDUX = "SAVE_SETTINGS_TO_REDUX";
export const FETCH_SETTINGS_BEGIN = "FETCH_SETTINGS_BEGIN";
export const FETCH_SETTINGS_SUCCESS = "FETCH_SETTINGS_SUCCESS";
export const FETCH_SETTINGS_ERROR = "FETCH_SETTINGS_ERROR";
export const SAVE_SETTINGS_TO_YNDX = "SAVE_SETTINGS_TO_YNDX";
export const POST_SETTINGS_BEGIN = "POST_SETTINGS_BEGIN";
export const POST_SETTINGS_SUCCESS = "POST_SETTINGS_SUCCESS";
export const POST_SETTINGS_ERROR = "POST_SETTINGS_ERROR";

export const SAVE_BUILDS_TO_REDUX = "SAVE_BUILDS_TO_REDUX";
export const SAVE_CURRENT_BUILD_TO_REDUX = "SAVE_CURRENT_BUILD_TO_REDUX";

export const saveSettings = (payload) => {
  return {
    type: SAVE_SETTINGS_TO_REDUX,
    payload: payload,
  };
};

export const saveSettingsYndx = (settings) => async (dispatch) => {
  // console.log("fire get from YNDX");
  // START POSTING
  dispatch({ type: POST_SETTINGS_BEGIN });

  try {
    const response = await api.post("/settings", settings);

    dispatch({ type: POST_SETTINGS_SUCCESS });
    dispatch({ type: saveSettings, payload: response.data });
    // это нужно мне для того чтобы в компоненте что-то показывать если хорошо и плохо
    return Promise.resolve();
  } catch (e) {
    dispatch({ type: POST_SETTINGS_ERROR });
    // это нужно мне для того чтобы в компоненте что-то показывать если хорошо и плохо
    return Promise.reject(e);
  }
};

export const getSettingsFromYNDX = () => async (dispatch) => {
  // console.log("fire get from YNDX");
  // START FETCHING
  dispatch({ type: FETCH_SETTINGS_BEGIN });
  // SUCCESS FETCHING
  try {
    // NOTE: не напиши сюда dispatch:SAVE_SETTINGS, считаю что плохо размазывать, вызови лучше функцию в логике компонента
    // хотя в доке Redux Reddit они вызывают dispatch внутри dispatch. Может и можно.
    const response = await api.get("/settings");
    dispatch({ type: FETCH_SETTINGS_SUCCESS });
    // это нужно мне для того чтобы в компоненте что-то показывать если хорошо и плохо
    return Promise.resolve(response);
  } catch (e) {
    // это нужно мне для того чтобы в компоненте что-то показывать если хорошо и плохо
    dispatch({ type: FETCH_SETTINGS_ERROR });
    return Promise.reject();
  }
};

export const saveBuildsToRedux = (payload) => {
  return {
    type: SAVE_BUILDS_TO_REDUX,
    payload: payload,
  };
};

export const saveCurrentBuildToRedux = (payload) => {
  return {
    type: SAVE_CURRENT_BUILD_TO_REDUX,
    payload: payload,
  };
};
