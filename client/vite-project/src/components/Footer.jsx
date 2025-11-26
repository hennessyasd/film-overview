import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faTwitter, faInstagram, faYoutube, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import "../static/CSS/Footer.css"

const Footer = () => {
    const navigate = useNavigate();

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section" onClick={() => { navigate("/") }}>
                    <h1 className="footer-logo">FilmOverview</h1>
                </div>
                <div className="footer-section">
                    <ul className="footer-list">
                        <li><a href="#">Home</a></li>
                        <li><a href="#">About</a></li>
                        <li><a href="#">Join Us</a></li>
                        <li><a href="#">Help</a></li>
                        <li><a href="#">Support</a></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <ul className="footer-list">
                        <li><a href="#">Legal</a></li>
                        <li><a href="#">Privacy Center</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Cookies</a></li>
                        <li><a href="#">Ads</a></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <ul className="social-list">
                        <li><a href="#" className="social-icon"><FontAwesomeIcon icon={faFacebook} /></a></li>
                        <li><a href="#" className="social-icon"><FontAwesomeIcon icon={faTwitter} /></a></li>
                        <li><a href="#" className="social-icon"><FontAwesomeIcon icon={faInstagram} /></a></li>
                        <li><a href="#" className="social-icon"><FontAwesomeIcon icon={faYoutube} /></a></li>
                        <li><a href="#" className="social-icon"><FontAwesomeIcon icon={faLinkedin} /></a></li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2025-2026 FilmOverview</p>
            </div>
        </footer>
    )
}

export default Footer;
