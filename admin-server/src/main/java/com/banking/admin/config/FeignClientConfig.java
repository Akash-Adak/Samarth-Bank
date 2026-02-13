package com.banking.admin.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FeignClientConfig {

    @Bean
    public feign.Client feignClient() {
        return new feign.okhttp.OkHttpClient();
    }
}
