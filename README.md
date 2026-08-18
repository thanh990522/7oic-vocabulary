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
- Teacher Dashboard đăng nhập bằng mật khẩu Firebase, quản lý lớp và theo dõi tiến độ Theme 1.
- Dữ liệu lớp học được tổ chức sẵn cho đủ 9 themes trên Cloud Firestore.
- Giao diện responsive, hỗ trợ bàn phím và chế độ giảm chuyển động.

## Teacher Dashboard

Dashboard nằm tại `teacher.html`. Giao diện chỉ yêu cầu nhập mật khẩu; email giáo viên `hachithanh2251999@gmail.com` được cố định trong `firebase-config.js` và không cần nhập lại.

Để bật đăng nhập và dữ liệu lớp học:

1. Trong **Firebase Console → Authentication → Sign-in method**, bật **Email/Password**.
2. Trong **Authentication → Users**, tạo tài khoản `hachithanh2251999@gmail.com` và đặt mật khẩu riêng cho giáo viên.
3. Trong **Firestore Database**, tạo database nếu chưa có.
4. Mở tab **Rules**, dán toàn bộ nội dung `firestore.rules`, sau đó chọn **Publish**.

Không lưu mật khẩu trong repository. Dashboard gửi mật khẩu trực tiếp tới Firebase Authentication và chỉ cho phép tài khoản giáo viên đã cấu hình truy cập dữ liệu.

## Thêm theme mới

Metadata của 9 themes nằm trong mảng `THEMES`, còn dữ liệu từ vựng đang nằm trong `VOCABULARY` của `app.js`. Các theme chưa có nội dung được hiển thị ở trạng thái “Sắp cập nhật”, giúp bổ sung dần mà không phải thay đổi cấu trúc giao diện chính.

## Chạy cục bộ

Mở `index.html` trực tiếp hoặc chạy một static server trong thư mục repository.

## GitHub Pages

Workflow trong `.github/workflows/deploy-pages.yml` tự động triển khai website khi có thay đổi trên nhánh `main`.
