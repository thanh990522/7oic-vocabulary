# 7OIC Vocabulary

Vocabulary Hub dành cho toàn bộ **9 themes của Oxford Discover Futures 2**. Nội dung được mở dần theo từng theme; hiện tại **Theme 1: What is identity?** đã sẵn sàng với 60 từ.

## Tính năng

- Bảng từ vựng theo bài học với nghĩa tiếng Việt, câu ví dụ, IPA và audio Anh-Anh.
- Lộ trình 9 themes, trạng thái nội dung và khu vực theme đang học rõ ràng.
- Tìm kiếm, lọc theo lesson, điều chỉnh tốc độ nghe và xáo trộn thứ tự.
- Flashcards hai mặt không hiển thị câu ví dụ.
- Xáo trộn bộ thẻ, lọc theo lesson, đánh dấu “Đã nhớ” / “Cần ôn”.
- Thanh tiến độ flashcards hiển thị số thẻ đã luyện và tỷ lệ ghi nhớ.
- Lưu tiến độ trên thiết bị bằng `localStorage`.
- Giao diện responsive, hỗ trợ bàn phím và chế độ giảm chuyển động.

## Thêm theme mới

Metadata của 9 themes nằm trong mảng `THEMES`, còn dữ liệu từ vựng đang nằm trong `VOCABULARY` của `app.js`. Các theme chưa có nội dung được hiển thị ở trạng thái “Sắp cập nhật”, giúp bổ sung dần mà không phải thay đổi cấu trúc giao diện chính.

## Chạy cục bộ

Mở `index.html` trực tiếp hoặc chạy một static server trong thư mục repository.

## GitHub Pages

Workflow trong `.github/workflows/deploy-pages.yml` tự động triển khai website khi có thay đổi trên nhánh `main`.
