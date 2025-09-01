import Image from 'next/image'
import styles from './personalInfo.module.css'

export default function PersonalInfo() {
  return (
    <form className={styles.profileForm}>
      <div className={styles.avatarEditRow}>
        <Image
          src="https://api.builder.io/api/v1/image/assets/TEMP/e6affc0737515f664c7d8288ba0b3068f64a0ade?width=80"
          alt="Profile"
          width={80}
          height={80}
          className={styles.avatar}
        />
        <div className={styles.profileActions}>
          <button type="button" className={styles.updateProfileBtn}>Update Profile</button>
          <button type="button" className={styles.logoutBtn}>Log Out</button>
        </div>
      </div>
      <div className={styles.editLabel}>Edit</div>
      <div className={styles.inputsGrid}>
        <input className={styles.inputField} type="text" value="Ama" disabled />
        <input className={styles.inputField} type="text" value="Cruize" disabled />
        <input className={styles.inputField} type="email" value="example@gmail.com" disabled />
        <input className={styles.inputField} type="tel" value="+971 555 4587" disabled />
      </div>
      <div className={styles.loginSection}>
        <div className={styles.loginTitle}>Login & Security</div>
        <div className={styles.loginGrid}>
          <input className={styles.inputField} type="text" placeholder="Username" />
          <input className={styles.inputField} type="password" placeholder="Password" />
        </div>
      </div>
      <div className={styles.actionRow}>
        <button type="button" className={styles.changePasswordBtn}>Change Password</button>
        <button type="button" className={styles.deleteAccountBtn}>Delete Account</button>
      </div>
    </form>
  )
}
