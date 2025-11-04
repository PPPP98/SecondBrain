# BlockNote 백엔드 API 호환성 분석 보고서

> **작성일**: 2025-11-05
> **분석 대상**: Note CRUD API (Spring Boot + PostgreSQL)
> **참고 문서**: BlockNote 공식 문서, Notion 아키텍처

---

## 📋 목차

1. [현재 구조 분석](#현재-구조-분석)
2. [호환성 문제점](#호환성-문제점)
3. [BlockNote 공식 권장사항](#blocknote-공식-권장사항)
4. [개선 방안](#개선-방안)
5. [마이그레이션 전략](#마이그레이션-전략)
6. [권장 조치](#권장-조치)

---

## 현재 구조 분석

### 데이터 모델

**파일**: `backend/secondbrain/src/main/java/uknowklp/secondbrain/api/note/domain/Note.java`

```java
@Entity
@Table(name = "notes")
public class Note {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "note_id")
    private Long id;

    @Length(max = 64)
    @Column(nullable = false, length = 64)
    private String title;

    @Length(max = 2048)  // ⚠️ 문제: BlockNote JSON은 훨씬 클 수 있음
    @Column(nullable = false, length = 2048)
    private String content;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
```

### API 엔드포인트

**파일**: `backend/secondbrain/src/main/java/uknowklp/secondbrain/api/note/controller/NoteController.java`

| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | `/api/notes` | 노트 생성 (multipart/form-data) |
| GET | `/api/notes/{noteId}` | 노트 조회 |
| PUT | `/api/notes/{noteId}` | 노트 수정 |
| DELETE | `/api/notes` | 노트 삭제 (다중 지원) |
| GET | `/api/notes/recent` | 최근 노트 목록 조회 |

### 현재 데이터 형식

**Request/Response DTO**:
```json
{
  "title": "노트 제목",
  "content": "노트 내용"
}
```

---

## 호환성 문제점

### 🔴 1. 데이터 구조 불일치 (치명적)

#### 현재 구조
```json
{
  "title": "노트 제목",
  "content": "노트 내용"
}
```

#### BlockNote 권장 구조
```json
[
  {
    "id": "705d9221-6180-4794-ae06-229a74c9fb96",
    "type": "heading",
    "props": {
      "level": 1,
      "textColor": "default",
      "textAlignment": "left",
      "backgroundColor": "default"
    },
    "content": [
      {
        "type": "text",
        "text": "노트 제목",
        "styles": {}
      }
    ],
    "children": []
  },
  {
    "id": "1b0438c6-ea54-4f72-935d-5ce7a3b73dcc",
    "type": "paragraph",
    "props": {
      "textColor": "default",
      "textAlignment": "left",
      "backgroundColor": "default"
    },
    "content": [
      {
        "type": "text",
        "text": "노트 내용",
        "styles": {}
      }
    ],
    "children": []
  }
]
```

**문제점**:
- 현재는 평문 문자열만 저장
- BlockNote는 구조화된 JSON Block 배열 필요
- 블록 타입, 속성, 스타일 정보 손실

---

### 🔴 2. 용량 제한 (치명적)

```java
@Length(max = 2048)
@Column(nullable = false, length = 2048)
private String content;
```

**문제점**:
- 현재: `VARCHAR(2048)` - 약 2KB 제한
- BlockNote JSON: 일반적으로 수십~수백 KB
- 복잡한 문서 (이미지, 테이블, 코드 블록 등)는 저장 불가능

**예시**:
```json
// 간단한 BlockNote 문서도 쉽게 2KB 초과
[
  {"id":"...","type":"heading","props":{...},"content":[...],"children":[]},
  {"id":"...","type":"paragraph","props":{...},"content":[...],"children":[]},
  {"id":"...","type":"bulletListItem","props":{...},"content":[...],"children":[
    {"id":"...","type":"bulletListItem","props":{...},"content":[...],"children":[]}
  ]},
  {"id":"...","type":"image","props":{"url":"...","caption":"..."},"content":[],"children":[]},
  {"id":"...","type":"codeBlock","props":{"language":"javascript"},"content":[...],"children":[]}
]
```

---

### 🟡 3. 정보 손실

현재 구조로는 다음 정보를 저장할 수 없습니다:

| 항목 | 설명 | 영향 |
|------|------|------|
| ❌ 블록 타입 | heading, paragraph, list, code, table 등 | 문서 구조 손실 |
| ❌ 블록 속성 | 색상, 정렬, 레벨, 배경색 등 | 시각적 스타일 손실 |
| ❌ 텍스트 스타일 | bold, italic, underline, strikethrough 등 | 포맷팅 손실 |
| ❌ 중첩 구조 | 리스트 하위 항목, 토글 블록 등 | 계층 구조 손실 |
| ❌ 블록 ID | UUID 기반 고유 식별자 | 협업, 동기화 불가 |
| ❌ 링크 | URL, 텍스트 링크 정보 | 하이퍼링크 손실 |
| ❌ 이미지/파일 | 임베드 정보, 캡션 | 미디어 콘텐츠 손실 |

---

### 🟡 4. 제목 처리 방식

**현재**:
```java
private String title;  // 별도 필드
private String content;  // 본문
```

**BlockNote**:
- 제목도 블록의 일부 (보통 첫 번째 `heading` 블록)
- 별도 필드 없이 블록 배열에 포함

**문제점**:
- 제목과 본문을 분리하여 저장
- BlockNote 문서 구조와 불일치
- 프론트엔드에서 수동 변환 필요

---

## BlockNote 공식 권장사항

### 저장 방법 (Non-Lossy)

**공식 문서**: [BlockNote - Saving & Loading](https://www.blocknotejs.org/examples/backend/saving-loading)

#### 프론트엔드 → 백엔드
```typescript
// BlockNote 에디터에서 JSON 추출
const jsonDocument = JSON.stringify(editor.document);

// 백엔드로 전송
await fetch('/api/notes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    content: jsonDocument  // JSON 문자열
  })
});
```

#### 백엔드 → 프론트엔드
```typescript
// 백엔드에서 JSON 문자열 수신
const response = await fetch('/api/notes/123');
const { content } = await response.json();

// BlockNote 에디터에 로드
const blocks = JSON.parse(content);
editor.replaceBlocks(editor.document, blocks);
```

---

### Notion 아키텍처 참고

**출처**: [Exploring Notion's Data Model](https://www.notion.com/blog/data-model-behind-notion)

Notion의 백엔드 구조:
- **데이터베이스**: PostgreSQL (Amazon RDS)
- **저장 방식**: 각 블록을 JSON으로 저장
- **식별자**: UUID v4로 각 블록 식별
- **확장성**: 워크스페이스 ID로 파티셔닝 (96개 서버로 확장)

**핵심 원칙**:
1. 모든 것은 블록 (텍스트, 이미지, 페이지 모두)
2. JSON 형식으로 블록 속성 저장
3. TEXT 또는 JSON 컬럼 타입 사용
4. 무손실 형식 유지

---

## 개선 방안

### 방안 1: 데이터베이스 스키마 변경 (권장)

#### A. TEXT 컬럼 사용

**PostgreSQL**:
```sql
-- content 컬럼을 TEXT 타입으로 변경 (무제한 크기)
ALTER TABLE notes
ALTER COLUMN content TYPE TEXT;
```

**장점**:
- ✅ 크기 제한 없음
- ✅ JSON 문자열 저장 가능
- ✅ 인덱싱 가능 (GIN 인덱스)

**단점**:
- ❌ JSON 타입 전용 함수 사용 불가

---

#### B. JSONB 컬럼 사용 (PostgreSQL 권장)

```sql
-- 새로운 JSONB 컬럼 추가
ALTER TABLE notes
ADD COLUMN blocks JSONB;

-- 기존 content 컬럼 유지 (호환성)
ALTER TABLE notes
ALTER COLUMN content TYPE TEXT;

-- JSONB 인덱스 생성 (성능 최적화)
CREATE INDEX idx_notes_blocks_gin ON notes USING GIN (blocks);
```

**장점**:
- ✅ JSON 전용 쿼리 가능 (블록 타입별 검색 등)
- ✅ 효율적인 저장 (압축)
- ✅ 인덱싱 성능 우수
- ✅ JSON 유효성 자동 검증

**단점**:
- ❌ PostgreSQL 전용 (다른 DB 마이그레이션 어려움)

**예시 쿼리**:
```sql
-- 특정 블록 타입 검색
SELECT * FROM notes
WHERE blocks @> '[{"type": "codeBlock"}]'::jsonb;

-- 특정 텍스트 포함 블록 검색
SELECT * FROM notes
WHERE blocks::text LIKE '%특정 키워드%';
```

---

### 방안 2: Note 엔티티 수정

#### 옵션 A: TEXT 컬럼 사용

**파일**: `Note.java`

```java
@Entity
@Table(name = "notes")
public class Note {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "note_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // 제목: 검색/표시용 (첫 번째 블록에서 자동 추출)
    @Length(max = 255)
    @Column(nullable = false, length = 255)
    private String title;

    // BlockNote JSON 저장 (크기 제한 제거)
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "remind_at")
    private LocalDateTime remindAt;

    @Column(name = "remind_count", nullable = false)
    @Builder.Default
    private Integer remindCount = 0;

    /**
     * 노트 내용 수정 (BlockNote JSON)
     *
     * @param content BlockNote JSON 문자열
     */
    public void update(String content) {
        this.content = content;
        // title은 Service 레이어에서 자동 추출
    }
}
```

---

#### 옵션 B: JSONB 컬럼 사용 (PostgreSQL)

```java
@Entity
@Table(name = "notes")
public class Note {
    // ... 기존 필드 ...

    // BlockNote JSON 저장 (JSONB 타입)
    @Type(JsonBinaryType.class)
    @Column(nullable = false, columnDefinition = "jsonb")
    private String blocks;

    // 또는 JsonNode 사용
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false, columnDefinition = "jsonb")
    private JsonNode blocks;
}
```

**필요한 의존성** (`pom.xml`):
```xml
<dependency>
    <groupId>io.hypersistence</groupId>
    <artifactId>hypersistence-utils-hibernate-63</artifactId>
    <version>3.7.0</version>
</dependency>
```

---

### 방안 3: DTO 수정

#### NoteRequest.java

```java
/**
 * 노트 생성/수정 요청 DTO
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NoteRequest {

    @Schema(
        description = "노트 내용 (BlockNote JSON 문자열)",
        example = "[{\"id\":\"...\",\"type\":\"heading\",\"props\":{\"level\":1},\"content\":[{\"type\":\"text\",\"text\":\"제목\"}],\"children\":[]}]",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    @NotBlank(message = "내용은 필수입니다.")
    private String content; // BlockNote JSON 문자열

    /**
     * BlockNote JSON 유효성 검증
     */
    @AssertTrue(message = "올바른 BlockNote JSON 형식이 아닙니다.")
    public boolean isValidBlockNoteJson() {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode blocks = mapper.readTree(content);
            return blocks.isArray();
        } catch (JsonProcessingException e) {
            return false;
        }
    }
}
```

---

#### NoteResponse.java

```java
/**
 * 노트 조회 응답 DTO
 */
@Getter
@Builder
public class NoteResponse {

    private Long noteId;

    @Schema(description = "노트 제목 (첫 번째 블록에서 추출)")
    private String title;

    @Schema(description = "노트 내용 (BlockNote JSON 문자열)")
    private String content;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime remindAt;
    private Integer remindCount;

    public static NoteResponse from(Note note) {
        return NoteResponse.builder()
            .noteId(note.getId())
            .title(note.getTitle())
            .content(note.getContent())
            .createdAt(note.getCreatedAt())
            .updatedAt(note.getUpdatedAt())
            .remindAt(note.getRemindAt())
            .remindCount(note.getRemindCount())
            .build();
    }
}
```

---

### 방안 4: Service 레이어 수정

#### NoteServiceImpl.java

```java
@Service
@RequiredArgsConstructor
public class NoteServiceImpl implements NoteService {

    private final NoteRepository noteRepository;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public void createNote(Long userId, NoteRequest request) {
        // BlockNote JSON에서 title 추출
        String title = extractTitleFromBlockNoteJson(request.getContent());

        Note note = Note.builder()
            .user(User.builder().id(userId).build())
            .title(title)
            .content(request.getContent()) // BlockNote JSON 저장
            .build();

        noteRepository.save(note);
    }

    @Override
    @Transactional
    public NoteResponse updateNote(Long noteId, Long userId, NoteRequest request) {
        Note note = noteRepository.findById(noteId)
            .orElseThrow(() -> new NoteNotFoundException("노트를 찾을 수 없습니다."));

        // 권한 검증
        if (!note.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("노트 수정 권한이 없습니다.");
        }

        // BlockNote JSON에서 title 추출
        String title = extractTitleFromBlockNoteJson(request.getContent());

        // 노트 업데이트
        note.update(title, request.getContent());

        return NoteResponse.from(note);
    }

    /**
     * BlockNote JSON에서 제목 추출
     * 첫 번째 heading 블록의 텍스트를 제목으로 사용
     *
     * @param blockNoteJson BlockNote JSON 문자열
     * @return 추출된 제목 (없으면 "제목 없음")
     */
    private String extractTitleFromBlockNoteJson(String blockNoteJson) {
        try {
            JsonNode blocks = objectMapper.readTree(blockNoteJson);

            if (!blocks.isArray() || blocks.size() == 0) {
                return "제목 없음";
            }

            // 첫 번째 블록 확인
            JsonNode firstBlock = blocks.get(0);
            String blockType = firstBlock.get("type").asText();

            // heading 블록인 경우 텍스트 추출
            if ("heading".equals(blockType)) {
                JsonNode content = firstBlock.get("content");
                if (content != null && content.isArray() && content.size() > 0) {
                    JsonNode textNode = content.get(0);
                    if ("text".equals(textNode.get("type").asText())) {
                        String text = textNode.get("text").asText();
                        // 최대 64자로 제한
                        return text.length() > 64 ? text.substring(0, 64) : text;
                    }
                }
            }

            // heading 블록이 아닌 경우 첫 블록의 텍스트 사용
            return extractTextFromBlock(firstBlock);

        } catch (JsonProcessingException e) {
            return "제목 없음";
        }
    }

    /**
     * 블록에서 텍스트 추출 (재귀적으로 content 탐색)
     */
    private String extractTextFromBlock(JsonNode block) {
        JsonNode content = block.get("content");
        if (content == null || !content.isArray() || content.size() == 0) {
            return "제목 없음";
        }

        StringBuilder text = new StringBuilder();
        for (JsonNode item : content) {
            if ("text".equals(item.get("type").asText())) {
                text.append(item.get("text").asText());
            }
        }

        String result = text.toString().trim();
        if (result.isEmpty()) {
            return "제목 없음";
        }

        // 최대 64자로 제한
        return result.length() > 64 ? result.substring(0, 64) : result;
    }
}
```

---

### 방안 5: Controller 수정

#### NoteController.java

```java
@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
public class NoteController {

    private final NoteService noteService;

    /**
     * 새로운 노트 생성 (BlockNote JSON)
     * Content-Type: application/json
     *
     * @param userDetails Spring Security 인증 정보
     * @param request BlockNote JSON 포함 요청
     * @return 201 Created
     */
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<BaseResponse<Void>> createNote(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @Valid @RequestBody NoteRequest request) {

        User user = userDetails.getUser();
        log.info("Creating note for userId: {} - Content length: {}",
            user.getId(), request.getContent().length());

        noteService.createNote(user.getId(), request);

        BaseResponse<Void> response = new BaseResponse<>(BaseResponseStatus.CREATED);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * 노트 수정 (BlockNote JSON)
     * Content-Type: application/json
     *
     * @param userDetails Spring Security 인증 정보
     * @param noteId 수정할 노트 ID
     * @param request BlockNote JSON 포함 요청
     * @return 200 OK + 수정된 노트 정보
     */
    @PutMapping(value = "/{noteId}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<BaseResponse<NoteResponse>> updateNote(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @PathVariable Long noteId,
        @Valid @RequestBody NoteRequest request) {

        User user = userDetails.getUser();
        log.info("Updating note for userId: {} - NoteId: {}, Content length: {}",
            user.getId(), noteId, request.getContent().length());

        NoteResponse noteResponse = noteService.updateNote(noteId, user.getId(), request);

        BaseResponse<NoteResponse> response = new BaseResponse<>(noteResponse);
        return ResponseEntity.ok(response);
    }

    // 조회, 삭제 엔드포인트는 변경 없음
}
```

---

## 마이그레이션 전략

### 1단계: 데이터베이스 스키마 변경

#### PostgreSQL 마이그레이션 스크립트

**파일**: `V2__alter_notes_for_blocknote.sql`

```sql
-- Step 1: content 컬럼을 TEXT 타입으로 변경
ALTER TABLE notes
ALTER COLUMN content TYPE TEXT;

-- Step 2: (선택) JSONB 컬럼 추가
ALTER TABLE notes
ADD COLUMN blocks JSONB;

-- Step 3: JSONB 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_notes_blocks_gin
ON notes USING GIN (blocks);

-- Step 4: title 컬럼 크기 조정 (선택)
ALTER TABLE notes
ALTER COLUMN title TYPE VARCHAR(255);

-- Step 5: 코멘트 추가
COMMENT ON COLUMN notes.content IS 'BlockNote JSON 문자열 (TEXT 타입)';
COMMENT ON COLUMN notes.blocks IS 'BlockNote JSON 구조 (JSONB 타입, 선택)';
```

---

### 2단계: 기존 데이터 변환

#### 평문 데이터 → BlockNote JSON 변환 스크립트

**파일**: `DataMigrationService.java`

```java
@Service
@RequiredArgsConstructor
public class DataMigrationService {

    private final NoteRepository noteRepository;
    private final ObjectMapper objectMapper;

    /**
     * 기존 평문 노트를 BlockNote JSON 형식으로 변환
     */
    @Transactional
    public void migrateNotesToBlockNoteFormat() {
        List<Note> notes = noteRepository.findAll();

        for (Note note : notes) {
            // 이미 JSON 형식인지 확인
            if (isBlockNoteJson(note.getContent())) {
                continue;
            }

            // 평문 → BlockNote JSON 변환
            String blockNoteJson = convertPlainTextToBlockNoteJson(
                note.getTitle(),
                note.getContent()
            );

            // 업데이트
            note.update(note.getTitle(), blockNoteJson);
        }

        noteRepository.saveAll(notes);
    }

    /**
     * BlockNote JSON 형식인지 확인
     */
    private boolean isBlockNoteJson(String content) {
        try {
            JsonNode node = objectMapper.readTree(content);
            return node.isArray() &&
                   node.size() > 0 &&
                   node.get(0).has("type") &&
                   node.get(0).has("id");
        } catch (JsonProcessingException e) {
            return false;
        }
    }

    /**
     * 평문 텍스트를 BlockNote JSON으로 변환
     */
    private String convertPlainTextToBlockNoteJson(String title, String content) {
        List<Map<String, Object>> blocks = new ArrayList<>();

        // 제목 블록 (heading)
        blocks.add(createHeadingBlock(title, 1));

        // 본문 블록 (paragraph)
        // 줄바꿈 기준으로 분리
        String[] paragraphs = content.split("\n+");
        for (String paragraph : paragraphs) {
            if (!paragraph.trim().isEmpty()) {
                blocks.add(createParagraphBlock(paragraph.trim()));
            }
        }

        try {
            return objectMapper.writeValueAsString(blocks);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("BlockNote JSON 변환 실패", e);
        }
    }

    /**
     * Heading 블록 생성
     */
    private Map<String, Object> createHeadingBlock(String text, int level) {
        Map<String, Object> block = new HashMap<>();
        block.put("id", UUID.randomUUID().toString());
        block.put("type", "heading");
        block.put("props", Map.of(
            "level", level,
            "textColor", "default",
            "backgroundColor", "default",
            "textAlignment", "left"
        ));
        block.put("content", List.of(
            Map.of("type", "text", "text", text, "styles", Map.of())
        ));
        block.put("children", List.of());
        return block;
    }

    /**
     * Paragraph 블록 생성
     */
    private Map<String, Object> createParagraphBlock(String text) {
        Map<String, Object> block = new HashMap<>();
        block.put("id", UUID.randomUUID().toString());
        block.put("type", "paragraph");
        block.put("props", Map.of(
            "textColor", "default",
            "backgroundColor", "default",
            "textAlignment", "left"
        ));
        block.put("content", List.of(
            Map.of("type", "text", "text", text, "styles", Map.of())
        ));
        block.put("children", List.of());
        return block;
    }
}
```

**실행 방법**:
```java
@Component
@RequiredArgsConstructor
public class MigrationRunner implements ApplicationRunner {

    private final DataMigrationService migrationService;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        // 환경변수 또는 프로필로 실행 제어
        if (shouldRunMigration()) {
            migrationService.migrateNotesToBlockNoteFormat();
        }
    }

    private boolean shouldRunMigration() {
        return "true".equals(System.getenv("RUN_BLOCKNOTE_MIGRATION"));
    }
}
```

---

### 3단계: API 버전 관리 (선택)

기존 API와의 호환성 유지를 위해 버전 관리 적용:

```java
// V1: 기존 평문 API (레거시)
@RestController
@RequestMapping("/api/v1/notes")
public class NoteControllerV1 {
    // 기존 multipart/form-data 방식 유지
}

// V2: BlockNote JSON API (신규)
@RestController
@RequestMapping("/api/v2/notes")
public class NoteControllerV2 {
    // BlockNote JSON 방식
}
```

---

## 권장 조치

### ✅ 즉시 수행 (필수)

1. **데이터베이스 스키마 변경**
   ```sql
   ALTER TABLE notes ALTER COLUMN content TYPE TEXT;
   ```

2. **Note 엔티티 수정**
   ```java
   @Column(nullable = false, columnDefinition = "TEXT")
   private String content;
   ```

3. **DTO 크기 제한 제거**
   ```java
   // @Size(max = 2048) 제거
   private String content;
   ```

4. **Controller Content-Type 변경**
   ```java
   @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
   ```

---

### 📈 단계적 개선 (권장)

1. **JSON 유효성 검증 추가**
   - `@AssertTrue` 커스텀 검증 로직
   - BlockNote JSON 형식 확인

2. **title 자동 추출 로직 구현**
   - Service 레이어에서 첫 번째 블록 파싱
   - 검색/표시용 title 필드 자동 업데이트

3. **기존 데이터 마이그레이션**
   - 평문 → BlockNote JSON 변환 스크립트
   - 단계적 마이그레이션 실행

4. **JSONB 컬럼 도입** (PostgreSQL)
   - 고급 JSON 쿼리 기능 활용
   - 성능 최적화

---

### 🚀 장기 개선 (선택)

1. **전문 검색 (Full-Text Search)**
   ```sql
   -- PostgreSQL GIN 인덱스
   CREATE INDEX idx_notes_content_gin ON notes USING GIN (to_tsvector('korean', content));
   ```

2. **버전 관리**
   - 노트 수정 이력 저장
   - 롤백 기능 구현

3. **실시간 협업**
   - WebSocket 기반 동기화
   - Operational Transform 또는 CRDT 적용

4. **성능 최적화**
   - 블록별 캐싱
   - Lazy Loading

---

## 결론

현재 백엔드 API는 BlockNote 라이브러리와 **호환되지 않습니다**.

### 핵심 문제
- 평문 문자열 저장 구조
- 2KB 용량 제한
- 블록 구조/스타일 정보 손실

### 해결 방법
1. ✅ `content` 컬럼을 `TEXT` 타입으로 변경
2. ✅ BlockNote JSON 문자열 저장
3. ✅ title 자동 추출 로직 구현

위 개선사항을 적용하면 BlockNote의 모든 기능을 활용할 수 있습니다.

---
