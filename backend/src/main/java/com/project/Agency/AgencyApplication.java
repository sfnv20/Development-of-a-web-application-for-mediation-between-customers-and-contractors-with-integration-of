package com.project.Agency;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import javax.sql.DataSource;

@SpringBootApplication
public class AgencyApplication implements CommandLineRunner {

	private final DataSource dataSource;

	public AgencyApplication(DataSource dataSource) {
		this.dataSource = dataSource;
	}

	public static void main(String[] args) {
		SpringApplication.run(AgencyApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		System.out.println("Підключено до бази даних: " + dataSource.getConnection().getMetaData().getURL());
	}
}