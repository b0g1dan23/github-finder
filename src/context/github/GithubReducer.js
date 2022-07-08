import { data } from "autoprefixer";

const githubReducer = (state, action) => {
  switch (action.type) {
    case "GET_USERS":
      return {
        ...state,
        users: action.payload,
        loader: false,
      };
    case "GET_USER_AND_REPOS":
      return {
        ...state,
        user: action.payload.user,
        repos: action.payload.repos,
        loader: false,
      };
    case "SET_LOADING":
      return {
        ...state,
        loader: true,
      };
    case "DEL_USERS":
      return {
        ...state,
        users: [],
      };

    default:
      return state;
  }
};

export default githubReducer;
