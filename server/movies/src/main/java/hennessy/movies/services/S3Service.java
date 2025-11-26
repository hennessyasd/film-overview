package hennessy.movies.services;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Configuration;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;

import java.net.URI;
import java.time.Duration;

@Service
public class S3Service {

    @Value("${aws.accessKeyId}")
    private String accessKey;

    @Value("${aws.secretAccessKey}")
    private String secretKey;

    @Value("${aws.region}")
    private String region;

    @Value("${aws.endpoint}")
    private String endpoint;

    @Value("${aws.bucketName}")
    private String bucketName;

    private S3Presigner presigner;

    @PostConstruct
    public void init() {
        this.presigner = S3Presigner.builder()
                .region(Region.of(region))
                .endpointOverride(URI.create(endpoint))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(accessKey, secretKey)))
                .serviceConfiguration(S3Configuration.builder()
                        .pathStyleAccessEnabled(true)
                        .build())
                .build();
    }

    public String generatePresignedUrl(String objectKey) {
        if (objectKey == null || objectKey.isEmpty()) return null;

        try {
            GetObjectPresignRequest getObjectPresignRequest = GetObjectPresignRequest.builder()
                    .signatureDuration(Duration.ofMinutes(60))
                    .getObjectRequest(b -> b.bucket(bucketName).key(objectKey))
                    .build();

            return presigner.presignGetObject(getObjectPresignRequest).url().toString();
        } catch (Exception e) {
            System.err.println("Error generating URL for key: " + objectKey);
            e.printStackTrace();
            return null;
        }
    }
}