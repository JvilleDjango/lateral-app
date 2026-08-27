import { useParams } from "react-router";

const ConfirmationPage = () => {
  const { bookingId } = useParams();
  return (
    <section className="page">
      <p className="eyebrow">Booking confirmed</p>
      <h1>You are going.</h1>
      <p>Confirmation reference: {bookingId}</p>
    </section>
  );
};
export default ConfirmationPage;
