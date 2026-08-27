import { Link, useParams } from 'react-router'
import styles from './static-page.module.css'

const StayPage = () => {
  const { stayId } = useParams()
  return (
    <section className={styles.page}>
      <p className={styles.eyebrow}>Stay details</p>
      <h1>{stayId?.split('-').join(' ')}</h1>
      <p>The complete property and review experience is the next milestone.</p>
      <Link to="/">Back to all stays</Link>
    </section>
  )
};
export default StayPage;
