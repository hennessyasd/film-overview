package hennessy.movies.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MovieService {

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private S3Service s3Service;

    public List<Movie> allMovies() {
        return movieRepository.findAll();
    }

    public Optional<Movie> singleMovie(String imdbId) {
        Optional<Movie> movie = movieRepository.findMovieByImdbId(imdbId);

        if (movie.isPresent()) {
            Movie m = movie.get();
            if (m.getVideoPath() != null && !m.getVideoPath().isEmpty()) {
                String url = s3Service.generatePresignedUrl(m.getVideoPath());
                m.setStreamingUrl(url);
            }
        }

        return movie;
    }

    public List<Movie> searchMovies(String title) {
        return movieRepository.findByTitleContainingIgnoreCase(title);
    }
}
