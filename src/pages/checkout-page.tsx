import styles from "./static-page.module.css";

const CheckoutPage = () => {
  return (
    <section className={styles.page}>
      <p className={styles.eyebrow}>Secure checkout</p>
      <h1>Confirm your stay</h1>
      <p>
        Guest details, mock payment, and a transparent total will live here.
      </p>
    </section>
  );
};

export default CheckoutPage;
