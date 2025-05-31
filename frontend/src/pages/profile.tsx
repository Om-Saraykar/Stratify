/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";

import api from "../api/axios";

import DefaultLayout from "@/layouts/default";

const Profile = () => {
  const [message, setMessage] = useState<string>("Loading...");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No token found");
        setMessage("");

        return;
      }

      try {
        const res = await api.get("/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMessage(res.data.message);
      } catch (err: any) {
        setError(err.response?.data?.error || "Unauthorized");
        setMessage("");
      }
    };

    fetchData();
  }, []);

  return (
    <DefaultLayout>
      <div>
        <h2>Profile</h2>
        {message && <p>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </DefaultLayout>
  );
};

export default Profile;
