import Hero from "../components/Hero";

const Home = (props) => {
    const { movies } = props;

    return(
        <Hero movies={movies}/>
    )
}

export default Home