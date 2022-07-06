import { createContext, useReducer } from "react";
import { FaWindows } from "react-icons/fa";
import githubReducer from "./GithubReducer";

const GithubContext = createContext();

const GITHUB_URL = process.env.REACT_APP_GITHUB_URL;
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

export const GithubProvider = ({ children }) => {
  const initialState = {
    users: [],
    user: {},
    repos: [],
    loader: false,
  };

  const [state, dispatch] = useReducer(githubReducer, initialState);

  // Get search results
  const searchUsers = async (text) => {
    setLoader();

    const params = new URLSearchParams({
      q: text,
    });

    const res = await fetch(`${GITHUB_URL}/search/users?${params}`, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
      },
    });

    const { items } = await res.json();

    dispatch({
      type: "GET_USERS",
      payload: items,
    });
  };

  // Get single user
  const getUser = async (login) => {
    setLoader();

    const res = await fetch(`${GITHUB_URL}/users/${login}`, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
      },
    });

    if (res.status === 404) {
      window.location = "/notfound";
    } else {
      const data = await res.json();

      dispatch({
        type: "GET_USER",
        payload: data,
      });
    }
  };

  // Get user repos
  const getRepos = async (login) => {
    setLoader();

    const res = await fetch(
      `${GITHUB_URL}/users/${login}/repos?_sort=updated_at&_order=desc`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
        },
      }
    );
    const data = await res.json();
    dispatch({
      type: "GET_REPOS",
      payload: data.slice(0, 8),
    });
  };

  const setLoader = () => {
    dispatch({ type: "SET_LOADING" });
  };

  const handleDelete = () => {
    dispatch({ type: "DEL_USERS" });
  };

  return (
    <GithubContext.Provider
      value={{
        users: state.users,
        loader: state.loader,
        user: state.user,
        repos: state.repos,
        searchUsers,
        handleDelete,
        getUser,
        getRepos,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export default GithubContext;
