package com.trendledger.service;

import java.time.Duration;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class OgImageExtractor {

	private static final Pattern OG_IMAGE_PATTERN = Pattern.compile(
			"<meta[^>]+property=[\"']og:image[\"'][^>]+content=[\"']([^\"']+)[\"']",
			Pattern.CASE_INSENSITIVE
	);
	private static final Pattern OG_IMAGE_PATTERN_REVERSED = Pattern.compile(
			"<meta[^>]+content=[\"']([^\"']+)[\"'][^>]+property=[\"']og:image[\"']",
			Pattern.CASE_INSENSITIVE
	);

	private final RestClient restClient;

	public OgImageExtractor() {
		SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
		requestFactory.setConnectTimeout((int) Duration.ofMillis(1500).toMillis());
		requestFactory.setReadTimeout((int) Duration.ofMillis(1500).toMillis());
		this.restClient = RestClient.builder()
				.requestFactory(requestFactory)
				.build();
	}

	public String extract(String articleUrl) {
		try {
			String html = restClient.get()
					.uri(articleUrl)
					.retrieve()
					.body(String.class);

			if (html == null) {
				return null;
			}

			Matcher matcher = OG_IMAGE_PATTERN.matcher(html);
			if (matcher.find()) {
				return unescapeHtmlEntities(matcher.group(1));
			}
			Matcher reversedMatcher = OG_IMAGE_PATTERN_REVERSED.matcher(html);
			if (reversedMatcher.find()) {
				return unescapeHtmlEntities(reversedMatcher.group(1));
			}
			return null;
		} catch (Exception e) {
			return null;
		}
	}

	private String unescapeHtmlEntities(String value) {
		return value
				.replace("&#x3D;", "=")
				.replace("&#x2F;", "/")
				.replace("&amp;", "&")
				.replace("&quot;", "\"");
	}

}
