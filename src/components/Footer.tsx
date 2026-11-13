import { Link } from "react-router-dom";
import { useApp } from "../app/store";
import { Emblem, Wordmark } from "./Logo";

export function Footer() {
  const { setTourStep } = useApp();
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__crest">
          <Emblem size={56} stroke={2} color="#a8844f" />
          <Wordmark size="lg" descriptor />
          <p className="small">From raw ingredients to a scent that is entirely yours. An interactive prototype of a personal perfumery studio.</p>
        </div>
        <div className="site-footer__top site-footer__top--center">
          <nav aria-label="Footer" className="site-footer__cols">
            <div>
              <p className="eyebrow">Studio</p>
              <ul role="list">
                <li><Link to="/kits">Explore Kits</Link></li>
                <li><Link to="/kits/creator-kit-v1/unbox">Interactive kit</Link></li>
                <li><Link to="/lab">Perfume Lab</Link></li>
                <li><Link to="/nature-lab">Nature Lab</Link></li>
                <li><Link to="/prefer">Prefer taste quiz</Link></li>
              </ul>
            </div>
            <div>
              <p className="eyebrow">Library</p>
              <ul role="list">
                <li><Link to="/ingredients">Ingredients</Link></li>
                <li><Link to="/creations">My Creations</Link></li>
                <li><Link to="/marketplace">Marketplace</Link></li>
              </ul>
            </div>
            <div>
              <p className="eyebrow">Learn</p>
              <ul role="list">
                <li><Link to="/how-it-works">How It Works</Link></li>
                <li><button className="footer-btn" onClick={() => setTourStep(0)}>Take the guided tour</button></li>
                <li><Link to="/brand">Brand system</Link></li>
              </ul>
            </div>
          </nav>
        </div>
        <div className="site-footer__legal">
          <p>
            <strong>Prototype notice.</strong> SENTYAR is a design prototype. Ingredients, prices, formula values and the extraction
            simulation are illustrative demo data. Nothing here is a skin-use recipe, a validated formulation or a live offer, and no
            orders or payments are taken. Commercial formulations require validation by a qualified perfumer and relevant specialists.
          </p>
          <p>Concept bottles: silhouettes and labelling are design direction, not finished products. SENTYAR is a working brand name; trademark and name clearance has not been completed.</p>
        </div>
      </div>
    </footer>
  );
}
