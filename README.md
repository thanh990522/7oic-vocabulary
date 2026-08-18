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
- Giáo viên tạo username và mật khẩu riêng cho từng học sinh ngay trong dashboard.
- Có thể mở từng lớp để xem toàn bộ thành viên, số học sinh hoạt động và tiến độ trung bình.
- Hồ sơ từng học sinh hiển thị thông tin tài khoản, tiến độ đủ 9 themes và lịch sử luyện flashcards.
- Giáo viên có thể xóa hồ sơ, tiến độ và lịch sử của học sinh bằng hộp xác nhận an toàn.
- Trang học yêu cầu đăng nhập bắt buộc; không có chức năng học sinh tự đăng ký.
- Tiến độ flashcards đồng bộ theo tài khoản học sinh trên Firestore và hiển thị theo thời gian thực cho giáo viên.
- Dữ liệu lớp học được tổ chức sẵn cho đủ 9 themes trên Cloud Firestore.
- Giao diện responsive, hỗ trợ bàn phím và chế độ giảm chuyển động.

## Teacher Dashboard

Dashboard nằm tại `teacher.html`. Giao diện chỉ yêu cầu nhập mật khẩu; email giáo viên `hachithanh2251999@gmail.com` được cố định trong `firebase-config.js` và không cần nhập lại.

Khi tạo học sinh, dashboard dùng username để tạo một tài khoản Firebase Authentication nội bộ. Mật khẩu chỉ hiển thị một lần để giáo viên sao chép và gửi cho học sinh; mật khẩu không được ghi vào Firestore hay repository.

Khi xóa học sinh, dashboard xóa hồ sơ Firestore và subcollection lịch sử nên tài khoản đó không thể mở trang học. Vì website tĩnh không sử dụng Firebase Admin SDK, bản ghi Firebase Authentication cũ vẫn còn và username cũ không thể tự động dùng lại.

Để bật đăng nhập và dữ liệu lớp học:

1. Trong **Firebase Console → Authentication → Sign-in method**, bật **Email/Password**.
2. Trong **Authentication → Users**, tạo tài khoản `hachithanh2251999@gmail.com` và đặt mật khẩu riêng cho giáo viên.
3. Trong **Firestore Database**, tạo database nếu chưa có.
4. Mở đúng **Firestore Database → Rules** (không phải Realtime Database), dán toàn bộ nội dung `firestore.rules`, sau đó chọn **Publish**.

Sau mỗi lần cập nhật `firestore.rules` trên GitHub, cần xuất bản lại rules trong Firebase Console. GitHub Pages không tự triển khai Security Rules vào Firebase.

Không lưu mật khẩu trong repository. Dashboard gửi mật khẩu trực tiếp tới Firebase Authentication và chỉ cho phép tài khoản giáo viên đã cấu hình truy cập dữ liệu.

## Thêm theme mới

Metadata của 9 themes nằm trong mảng `THEMES`, còn dữ liệu từ vựng đang nằm trong `VOCABULARY` của `app.js`. Các theme chưa có nội dung được hiển thị ở trạng thái “Sắp cập nhật”, giúp bổ sung dần mà không phải thay đổi cấu trúc giao diện chính.

## Chạy cục bộ

Mở `index.html` trực tiếp hoặc chạy một static server trong thư mục repository.

## GitHub Pages

Workflow trong `.github/workflows/deploy-pages.yml` tự động triển khai website khi có thay đổi trên nhánh `main`.
