package com.trendledger;

import java.sql.Connection;

import javax.sql.DataSource;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

	private final DataSource dataSource;

	public HealthController(DataSource dataSource) {
		this.dataSource = dataSource;
	}

	@GetMapping("/health")
	public String health() {
		return "OK";
	}

	@GetMapping("/health/db")
	public String healthDb() throws Exception {
		try (Connection connection = dataSource.getConnection()) {
			return "DB OK: " + connection.getMetaData().getURL();
		}
	}

}
