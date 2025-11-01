package uknowklp.secondbrain.global.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.elasticsearch.client.ClientConfiguration;
import org.springframework.data.elasticsearch.client.elc.ElasticsearchConfiguration;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;
import org.springframework.util.StringUtils;

@Configuration
@EnableElasticsearchRepositories(basePackages = "uknowklp.secondbrain.api.note.repository")
public class ElasticsearchConfig extends ElasticsearchConfiguration {

	@Value("${spring.elasticsearch.uris}")
	private String uris;

	@Value("${spring.elasticsearch.username:}")
	private String username;

	@Value("${spring.elasticsearch.password:}")
	private String password;

	@Override
	public ClientConfiguration clientConfiguration() {
		// 기본 설정
		if (StringUtils.hasText(username) && StringUtils.hasText(password)) {
			// 인증이 있는 경우
			return ClientConfiguration.builder()
				.connectedTo(uris)
				.withBasicAuth(username, password)
				.build();
		} else {
			// 인증이 없는 경우 (로컬 개발)
			return ClientConfiguration.builder()
				.connectedTo(uris)
				.build();
		}
	}
}