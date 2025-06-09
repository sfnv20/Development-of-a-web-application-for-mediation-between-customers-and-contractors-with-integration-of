package com.project.Agency;

import org.ini4j.Ini;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import javax.sql.DataSource;
import java.io.File;

@SpringBootApplication
public class AgencyApplication implements CommandLineRunner {

    private final DataSource dataSource;

    public AgencyApplication(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public static void main(String[] args) {
        // Читаем config.ini рядом с JAR
        File iniFile = new File("config.ini");
        if (iniFile.exists()) {
            try {
                Ini ini = new Ini(iniFile);
                String url = ini.get("database", "url");
                String username = ini.get("database", "username");
                String password = ini.get("database", "password");
                String driver = ini.get("database", "driver");

                if (url != null) System.setProperty("spring.datasource.url", url);
                if (username != null) System.setProperty("spring.datasource.username", username);
                if (password != null) System.setProperty("spring.datasource.password", password);
                if (driver != null) System.setProperty("spring.datasource.driver-class-name", driver);
            } catch (Exception e) {
                System.err.println("Не удалось прочитать config.ini: " + e.getMessage());
            }
        } else {
            System.out.println("config.ini не найден, используются стандартные настройки Spring Boot.");
        }

        SpringApplication.run(AgencyApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Підключено до бази даних: " + dataSource.getConnection().getMetaData().getURL());
    }
}
