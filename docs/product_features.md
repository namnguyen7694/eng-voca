# LingoCards - Product Features & Roadmap

## 1. Core Features (Hiện tại)
- **Hệ thống dữ liệu (JSON-based Data):** Tự động tải từ vựng từ nhiều tệp JSON (`chap_1` đến `chap_5`), chia thành các chủ đề (Topics) trên trang chủ.
- **Thẻ Flashcard 3D:** Hiệu ứng lật thẻ vật lý (Framer Motion) mượt mà để hiển thị cả từ vựng, loại từ, phát âm, ý nghĩa và câu ví dụ tiếng Anh lẫn tiếng Việt.
- **Tính năng Swipe (Vuốt):** Hỗ trợ vuốt ngang sang trái/phải để chuyển thẻ trên các thiết bị di động, kèm theo hiệu ứng trượt mượt mà (Slide Transition).
- **Phát âm (Text-to-Speech):** Tích hợp công cụ phát âm từ vựng cơ bản thông qua SpeechSynthesis API.
- **Quản lý học tập (Zustand & LocalStorage):** 
  - Đánh dấu **Learned (Đã học)**: Tính toán tự động tiến trình học tập của từng Topic lên thanh ProgressBar.
  - Đánh dấu **Save (Lưu để ôn lại)**: Các từ khó hoặc quan trọng sẽ được lưu vào một trang **Review** riêng biệt để dễ dàng kiểm tra lại.
- **Học ngẫu nhiên (Daily Study):** 
  - Giao diện chọn số lượng từ tùy chỉnh (10, 15, 20, 30 hoặc nhập số bất kỳ) để tạo ra một danh sách học nhanh.
  - Tự động quét toàn bộ cơ sở dữ liệu và **loại trừ các từ đã học**, sau đó trộn ngẫu nhiên (Shuffle) phần còn lại để mang đến danh sách từ vựng mới mẻ mỗi ngày.

## 2. Product Roadmap (Kế hoạch phát triển)

### Phase 1: Nâng cấp cốt lõi
- [ ] **Spaced Repetition System (SRS)**: Xây dựng thuật toán lặp lại ngắt quãng để nhắc nhở người dùng ôn lại các từ trong danh sách "Saved" dựa trên biểu đồ quên Ebbinghaus.
- [ ] **Data Scalability**: Chuyển đổi dữ liệu JSON tĩnh sang hệ thống Database (như Supabase hoặc Firebase) khi lượng từ vựng đạt mức độ lớn hơn.

### Phase 2: Tăng tính tương tác (Interactive & Gamification)
- [ ] **Mini-games & Quizzes**: Tích hợp các trò chơi nhỏ (Multiple choice, Điền từ vào chỗ trống, Nghe và chọn) để kiểm tra kiến thức sau khi học thẻ flashcard.
- [ ] **Streaks & Daily Goals**: Hệ thống theo dõi chuỗi ngày học tập liên tiếp và phần thưởng huy hiệu ảo để tạo động lực.
- [ ] **Phát âm nâng cao (Advanced Audio)**: Thay vì dùng Text-to-speech mặc định của trình duyệt, sử dụng API phát âm chuẩn từ Google TTS hoặc từ điển Oxford/Cambridge.

### Phase 3: Cá nhân hoá & Cộng đồng
- [ ] **Tự tạo Flashcard**: Cho phép người dùng nhập từ vựng của riêng mình để tạo bộ bài cá nhân.
- [ ] **Thống kê chi tiết**: Biểu đồ phân tích độ thông thạo từ vựng theo thời gian.
- [ ] **Chia sẻ bộ bài**: Chia sẻ topic học với bạn bè qua đường dẫn.
