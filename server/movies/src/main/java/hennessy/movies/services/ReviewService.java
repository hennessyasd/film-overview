package hennessy.movies.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.bson.types.ObjectId;

@Service
public class ReviewService {
    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    public Review createReview(String reviewBody, String imdbId, String username) {
        Review review = reviewRepository.insert(new Review(reviewBody, username));

        mongoTemplate.update(Movie.class)
                .matching(Criteria.where("imdbId").is(imdbId))
                .apply(new Update().push("reviewIds", review.getId()))
                .first();
        return review;
    }

    public void deleteReview(ObjectId reviewId) {
        reviewRepository.deleteById(reviewId);
        mongoTemplate.update(Movie.class)
                .matching(Criteria.where("reviewIds").is(reviewId))
                .apply(new Update().pull("reviewIds", reviewId))
                .first();
    }
}