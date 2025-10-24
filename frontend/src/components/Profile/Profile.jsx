import { useState, useEffect } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./Profile.module.css";

export default function Profile() {
  const [token, setToken] = useLocalStorage("token", null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const onLogout = () => {
    setToken(null);
    toast.info("Du er logget ud");
    setProfile(null);
  };

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (res.ok) {
          setProfile(data.user);
          toast.success("Profil hentet!");
        } else {
          toast.error(data.message || "Fejl ved hentning af profil");
          setProfile(null);

          if (res.status === 401) {
            toast.error("Session udløbet - log ind igen");
            onLogout();
          }
        }
      } catch (err) {
        console.error("Fejl i fetchProfile:", err);
        toast.error("Kunne ikke hente profil!");
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  if (loading) return <p>Henter profil...</p>;

  return (
    <div className={styles.profile}>
      <h2>Profil</h2>

      {profile ? (
        <pre>{JSON.stringify(profile, null, 2)}</pre>
      ) : (
        <p>Ingen profil fundet</p>
      )}

      <button onClick={onLogout} className={styles.logoutBtn}>
        Log ud
      </button>

      <ToastContainer position="top-center" autoClose={2500} />
    </div>
  );
}
