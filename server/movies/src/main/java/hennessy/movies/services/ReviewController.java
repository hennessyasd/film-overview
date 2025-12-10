package hennessy.movies.services;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {
    @Autowired
    private ReviewService reviewService;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    @PostMapping
    public ResponseEntity<Review> createReview(@RequestBody Map<String, String> payload) {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        return new ResponseEntity<>(
                reviewService.createReview(payload.get("reviewBody"), payload.get("imdbId"), currentUsername),
                HttpStatus.CREATED
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable String id) {
        reviewService.deleteReview(new ObjectId(id));
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/movie/{imdbId}")
    public ResponseEntity<List<Review>> getReviewsForMovie(@PathVariable String imdbId) {

        Query q = Query.query(Criteria.where("imdbId").is(imdbId));
        Document movieDoc = mongoTemplate.findOne(q, Document.class, "movies");
        if (movieDoc == null) {
            return ResponseEntity.ok(Collections.emptyList());
        }

        Object raw = movieDoc.get("reviewIds");
        if (raw == null) return ResponseEntity.ok(Collections.emptyList());

        List<ObjectId> ids = new ArrayList<>();
        if (raw instanceof List) {
            List<?> list = (List<?>) raw;
            for (Object o : list) {
                if (o == null) continue;
                if (o instanceof Document) {
                    Document d = (Document) o;
                    if (d.containsKey("$oid")) {
                        ids.add(new ObjectId(d.getString("$oid")));
                    } else if (d.containsKey("$id")) {
                        Object idObj = d.get("$id");
                        if (idObj instanceof Document) {
                            Document idDoc = (Document) idObj;
                            if (idDoc.containsKey("$oid")) {
                                ids.add(new ObjectId(idDoc.getString("$oid")));
                            }
                        } else if (idObj instanceof ObjectId) {
                            ids.add((ObjectId) idObj);
                        }
                    }
                } else if (o instanceof ObjectId) {
                    ids.add((ObjectId) o);
                } else if (o instanceof String) {
                    try { ids.add(new ObjectId((String) o)); } catch (Exception ex) { /* ignore */ }
                }
            }
        }

        if (ids.isEmpty()) return ResponseEntity.ok(Collections.emptyList());

        List<Review> reviews = reviewRepository.findAllById(ids);
        Map<String, Review> map = reviews.stream().collect(Collectors.toMap(r -> r.getId().toHexString(), r -> r));
        List<Review> ordered = ids.stream().map(ObjectId::toHexString).map(map::get).filter(Objects::nonNull).collect(Collectors.toList());
            return ResponseEntity.ok(ordered);
    }
}
