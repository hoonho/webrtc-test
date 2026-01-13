package com.example.backend.config;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

/**
 * Janus Gateway HTTP 프록시
 * 프론트엔드에서 /janus/** 요청을 외부 Janus 서버로 프록시합니다.
 */
@RestController
@RequestMapping("/janus")
public class JanusProxyController {

    private static final String JANUS_SERVER_URL = "https://janus.jsflux.co.kr/janus";
    private final RestTemplate restTemplate;

    public JanusProxyController() {
        this.restTemplate = new RestTemplate();
    }

    /**
     * Janus HTTP API 프록시 (POST)
     * Janus Long Polling 및 일반 API 요청 처리
     */
    @PostMapping(value = {"", "/{sessionId}", "/{sessionId}/{handleId}"}, 
                 consumes = MediaType.APPLICATION_JSON_VALUE,
                 produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> proxyPost(
            @PathVariable(required = false) Long sessionId,
            @PathVariable(required = false) Long handleId,
            @RequestBody(required = false) String body) {
        
        String targetUrl = buildTargetUrl(sessionId, handleId);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        HttpEntity<String> entity = new HttpEntity<>(body, headers);
        
        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    targetUrl, HttpMethod.POST, entity, String.class);
            return ResponseEntity.status(response.getStatusCode())
                    .headers(filterHeaders(response.getHeaders()))
                    .body(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("{\"janus\":\"error\",\"error\":{\"code\":500,\"reason\":\"Proxy error: " + e.getMessage() + "\"}}");
        }
    }

    /**
     * Janus HTTP API 프록시 (GET) - Long Polling용
     */
    @GetMapping(value = {"/{sessionId}", "/{sessionId}/{handleId}"}, 
                produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> proxyGet(
            @PathVariable Long sessionId,
            @PathVariable(required = false) Long handleId,
            @RequestParam(required = false) Long maxev) {
        
        String targetUrl = buildTargetUrl(sessionId, handleId);
        if (maxev != null) {
            targetUrl += "?maxev=" + maxev;
        }
        
        HttpHeaders headers = new HttpHeaders();
        HttpEntity<String> entity = new HttpEntity<>(headers);
        
        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    targetUrl, HttpMethod.GET, entity, String.class);
            return ResponseEntity.status(response.getStatusCode())
                    .headers(filterHeaders(response.getHeaders()))
                    .body(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("{\"janus\":\"error\",\"error\":{\"code\":500,\"reason\":\"Proxy error: " + e.getMessage() + "\"}}");
        }
    }

    private String buildTargetUrl(Long sessionId, Long handleId) {
        StringBuilder url = new StringBuilder(JANUS_SERVER_URL);
        if (sessionId != null) {
            url.append("/").append(sessionId);
            if (handleId != null) {
                url.append("/").append(handleId);
            }
        }
        return url.toString();
    }

    private HttpHeaders filterHeaders(HttpHeaders original) {
        HttpHeaders filtered = new HttpHeaders();
        // Content-Type만 전달 (CORS 관련 헤더는 WebConfig에서 처리)
        if (original.getContentType() != null) {
            filtered.setContentType(original.getContentType());
        }
        return filtered;
    }
}
