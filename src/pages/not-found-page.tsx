import { Link } from 'react-router'

const NotFoundPage = () => {
  return (
    <section className="page">
      <p className="eyebrow">404</p>
      <h1>That path wandered off.</h1>
      <Link to="/">Return to stays</Link>
    </section>
  );
};

export default NotFoundPage;
