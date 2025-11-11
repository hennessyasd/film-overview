package hennessy.movies.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.Map;
import java.util.Optional;
import java.util.List;

@RestController
@RequestMapping("/api/v1/movies")
@CrossOrigin(origins = "*")
public class MovieController {

    @Autowired
    private MovieService movieService;

    @Value("${omdb.api.key:}")
    private String omdbApiKey;

    @GetMapping
    public ResponseEntity<?> getAllMovies() {
        return ResponseEntity.ok(movieService.allMovies());
    }

    @GetMapping("/{imdbId}")
    public ResponseEntity<?> getMovie(@PathVariable String imdbId) {
        Optional<Movie> movie = movieService.singleMovie(imdbId);
        return ResponseEntity.of(movie);
    }

    @GetMapping("/{imdbId}/rating")
    public ResponseEntity<Map<String, Object>> getRating(@PathVariable("imdbId") String imdbId) {
        if (omdbApiKey == null || omdbApiKey.isBlank()) {
            return ResponseEntity.ok(Collections.singletonMap("rating", "N/A"));
        }

        try {
            RestTemplate rt = new RestTemplate();
            String url = String.format("https://www.omdbapi.com/?i=%s&apikey=%s", imdbId, omdbApiKey);
            @SuppressWarnings("unchecked")
            Map<String, Object> resp = rt.getForObject(url, Map.class);

            if (resp != null && resp.containsKey("imdbRating")) {
                return ResponseEntity.ok(Collections.singletonMap("rating", resp.get("imdbRating")));
            } else {
                return ResponseEntity.ok(Collections.singletonMap("rating", "N/A"));
            }
        } catch (Exception ex) {
            return ResponseEntity.ok(Collections.singletonMap("rating", "N/A"));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Movie>> searchMovies(@RequestParam("title") String title) {
        List<Movie> movies = movieService.searchMovies(title);
        if (movies.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(movies);
    }
}
