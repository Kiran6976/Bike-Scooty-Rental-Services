import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { apiFetch } from "../utils/apiFetch";

const AdminSignout = () => {
  const history = useHistory();

  useEffect(() => {
    const logoutAdmin = async () => {
      try {
        await apiFetch("/adminsignout", {
          method: "GET",
          credentials: "include",
        });

        // clear admin state/storage
        localStorage.removeItem("Admin");

        // redirect to signin
        history.replace("/signin");
      } catch (error) {
        console.error("Admin logout failed:", error.message);
      }
    };

    logoutAdmin();
  }, [history]);

  return <h1>Logging out...</h1>;
};

export default AdminSignout;
