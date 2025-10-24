import { useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import styles from "./Unauthorized.module.css";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className={styles.unAuthContainer}>
      <h2>Adgang nægtet!</h2>
      <p>Du har ikke tilladelse til at se denne side</p>

      <button onClick={() => navigate("/profile")} className={styles.returnBtn}>
        <IoIosArrowRoundBack /> tilbage til profil
      </button>
    </div>
  );
}
