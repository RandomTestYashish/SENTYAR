import { Link } from "react-router-dom";

export default function NotFoundish({ what, back }: { what: string; back: string }) {
  return (
    <div className="container section empty">
      <h1 className="h2">We couldn’t find that {what}</h1>
      <p>It may have been renamed. Go back and pick another.</p>
      <Link to={back} className="btn">Go back</Link>
    </div>
  );
}
