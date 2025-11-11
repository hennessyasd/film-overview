import { Outlet } from "react-router-dom";
import Header from "./Header"
import MoviesGrid from "./MoviesGrid";
import Footer from "./Footer";

const Layout = (props) => {
    const { onSearch } = props;
    
    return(
        <>
        <Header onSearch={onSearch} />
        <main id="main">
            <Outlet />
            <MoviesGrid />
            <Footer />
        </main>
        <footer id="footer"></footer>
        </>
    )
}

export default Layout;