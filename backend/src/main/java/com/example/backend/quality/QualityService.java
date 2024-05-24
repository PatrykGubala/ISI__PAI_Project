package com.example.backend.quality;

import java.util.List;
import java.util.UUID;

public interface QualityService {
    List<Quality> getAllQualities();
    Quality getQualityById(UUID id);
    Quality saveQuality(Quality quality);
    Quality updateQuality(Quality quality);
    void deleteQuality(UUID id);
}