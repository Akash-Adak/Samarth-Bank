package com.banking.kyc.util;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.nio.file.Files;
import java.util.Map;

@Component
public class EmailTemplateUtil {

    public String loadTemplate(
            String templateName,
            Map<String, String> values
    ) {
        try {
            String html = Files.readString(
                    new ClassPathResource(
                            "email-templates/" + templateName
                    ).getFile().toPath()
            );

            for (Map.Entry<String, String> entry : values.entrySet()) {
                html = html.replace(
                        "{{" + entry.getKey() + "}}",
                        entry.getValue()
                );
            }
            return html;

        } catch (Exception e) {
            throw new RuntimeException(
                    "Failed to load email template", e
            );
        }
    }
}
