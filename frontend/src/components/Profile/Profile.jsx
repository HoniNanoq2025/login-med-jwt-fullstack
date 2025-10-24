import { useLocalStorage } from "@uidotdev/usehooks";
import { useState, useEffect } from "react";

export default function Profile() {
  const [token] = useLocalStorage("token", null);
  const [profile, setProfile] = useState(null);

  const API_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      const res = await fetch(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setProfile(data.user);
    };
    fetchProfile();
  }, [token]);

  return (
    <div>
      <h2>Profil</h2>
      {profile && <pre>{JSON.stringify(profile, null, 2)}</pre>}
    </div>
  );
}
