package com.example.backend.quality;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class QualityServiceImpl implements QualityService {

    private final QualityRepository qualityRepository;

    @Autowired
    public QualityServiceImpl(QualityRepository qualityRepository) {
        this.qualityRepository = qualityRepository;
    }

    @Override
    public List<Quality> getAllQualities() {
        return qualityRepository.findAll();
    }

    @Override
    public Quality getQualityById(UUID id) {
        Optional<Quality> optionalQuality = qualityRepository.findById(id);
        return optionalQuality.orElse(null);
    }

    @Override
    public Quality saveQuality(Quality quality) {
        return qualityRepository.save(quality);
    }
    public Quality updateQuality(Quality quality) {
        return qualityRepository.save(quality);
    }

    @Override
    public void deleteQuality(UUID id) {
        qualityRepository.deleteById(id);
    }
}
