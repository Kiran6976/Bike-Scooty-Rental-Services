import React, { useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import apiFetch from "../utils/apiFetch";
import { UserContext } from "../App";

const Signout = () => {
  const history = useHistory();
  const { dispatch } = useContext(UserContext);

  useEffect(() => {
    const logoutUser = async () => {
      try {
        await apiFetch("/signout", {
          method: "GET",
        });

        // clear auth state
        dispatch({ type: "USER", payload: false });
        localStorage.removeItem("User");

        // redirect to signin
        history.replace("/signin");

        // optional hard refresh (if you rely on cookies heavily)
        window.location.reload();
      } catch (error) {
        console.error(error.message);
      }
    };

    logoutUser();
  }, [dispatch, history]);

  return (
    <>
      <h1>Logging out...</h1>
    </>
  );
};

export default Signout;
