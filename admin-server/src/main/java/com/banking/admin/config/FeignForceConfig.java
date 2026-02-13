package com.banking.admin.config;

import feign.RequestInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Configuration
public class FeignForceConfig {

    @Bean
    public RequestInterceptor requestInterceptor() {

        return template -> {

            ServletRequestAttributes attrs =
                    (ServletRequestAttributes)
                            RequestContextHolder.getRequestAttributes();

            if (attrs != null) {

                String token =
                        attrs.getRequest().getHeader("Authorization");

                if (token != null) {
                    template.header("Authorization", token);
                }
            }
        };
    }
}
