package com.example.backend.configuration;

import com.paypal.base.rest.APIContext;
import com.paypal.base.rest.OAuthTokenCredential;
import com.paypal.base.rest.PayPalRESTException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

@Configuration
public class PaypalConfig {

    @Value("${paypal.client.id}")
    private String clientId;

    @Value("${paypal.client.secret}")
    private String clientSecret;

    @Value("${paypal.mode}")
    private String mode;

    private static final Logger logger = Logger.getLogger(PaypalConfig.class.getName());

    @Bean
    public OAuthTokenCredential oAuthTokenCredential() {
        Map<String, String> configMap = new HashMap<>();
        configMap.put("mode", mode);
        return new OAuthTokenCredential(clientId, clientSecret, configMap);
    }

    @Bean
    public APIContext apiContext() {
        try {
            String accessToken = oAuthTokenCredential().getAccessToken();
            APIContext apiContext = new APIContext(accessToken);
            apiContext.setConfigurationMap(paypalSdkConfig());
            return apiContext;
        } catch (PayPalRESTException e) {
            logger.log(Level.SEVERE, "Błąd podczas uzyskiwania dostępu do API PayPal", e);
            throw new RuntimeException("Błąd podczas uzyskiwania dostępu do API PayPal", e);
        }
    }

    private Map<String, String> paypalSdkConfig() {
        Map<String, String> configMap = new HashMap<>();
        configMap.put("mode", mode);
        return configMap;
    }
}
