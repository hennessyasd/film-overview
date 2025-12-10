import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import MoviesGrid from "./MoviesGrid";


const Layout = (props) => {
    const { onSearch } = props;
    const location = useLocation();
    const hideGridPaths = ["/login", "/register"];
    const shouldShowGrid = !hideGridPaths.includes(location.pathname);
    
    return(
        <>
            <Header onSearch={onSearch} />
            <main id="main" style={{ minHeight: '80vh' }}>
                <Outlet />
                {shouldShowGrid && <MoviesGrid />} 
            </main>
            <Footer />
        </>
    )
}

export default Layout;