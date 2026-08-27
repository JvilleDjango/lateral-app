import { Link, useParams } from 'react-router'

const StayPage = () => {
  const { stayId } = useParams()
  return (
    <section className="page">
      <p className="eyebrow">Stay details</p>
      <h1>{stayId?.split('-').join(' ')}</h1>
      <p>The complete property and review experience is the next milestone.</p>
      <Link to="/">Back to all stays</Link>
    </section>
  )
};
export default StayPage;
