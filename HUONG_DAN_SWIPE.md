# 📱 Hướng Dẫn Sử Dụng Tính Năng Swipe Mã Chứng Khoán

## 🎯 Mục đích
Cho phép chuyển đổi giữa các mã chứng khoán bằng cách **vuốt ngang** (swipe) trong Bottom Sheet mà không cần đóng và mở lại.

---

## 🚀 Cách Sử Dụng

### 1️⃣ Mở chi tiết mã chứng khoán
- Nhấn vào bất kỳ card mã chứng khoán nào trong danh sách
- Bottom Sheet sẽ hiện lên với thông tin chi tiết

### 2️⃣ Chuyển đổi bằng SWIPE (Vuốt ngang)
- **Vuốt TRÁI (←)**: Chuyển sang mã chứng khoán tiếp theo
- **Vuốt PHẢI (→)**: Quay lại mã chứng khoán trước đó

### 3️⃣ Hoặc dùng Button (dễ hơn cho người mới)
- Nhấn button **"Sau"**: Chuyển sang mã tiếp theo
- Nhấn button **"Trước"**: Quay lại mã trước đó

---

## ⚙️ Cách Hoạt Động

### Ngưỡng Kích Hoạt Swipe
- **Khoảng cách tối thiểu**: Vuốt ít nhất **80 pixels**
- **Vận tốc tối thiểu**: **400 pixels/giây**
- **Giới hạn kéo**: Tối đa **150 pixels** để xem preview

### Ưu Tiên Scroll Dọc
Gesture được cấu hình để **KHÔNG conflict** với scroll dọc:
- ✅ Swipe ngang kích hoạt khi: vuốt ngang > 10px
- ✅ Scroll dọc ưu tiên khi: vuốt dọc > 20px
- ✅ Bạn vẫn scroll nội dung bình thường!

### Animation Mượt Mà
- ✨ Spring effect khi chuyển đổi
- ✨ Visual feedback (nội dung di chuyển theo ngón tay)
- ✨ Tự động reset nếu không đủ điều kiện swipe

---

## 🔄 Tính Năng Tuần Hoàn

Danh sách hoạt động theo vòng lặp vô hạn:
- Mã cuối cùng → Vuốt tiếp → Mã đầu tiên
- Mã đầu tiên → Vuốt lùi → Mã cuối cùng

---

## 🔍 Tương Thích Với Tìm Kiếm

Khi bạn tìm kiếm/lọc danh sách:
- ✅ Swipe chỉ chuyển đổi giữa các mã trong **kết quả tìm kiếm**
- ✅ Giúp duyệt nhanh các mã đã lọc

**Ví dụ:**
```
Tìm kiếm: "tech"
Kết quả: AAPL, MSFT, GOOGL, NVDA
→ Swipe chỉ chuyển giữa 4 mã này thôi!
```

---

## 🧪 Test Tính Năng

### Bước 1: Chạy ứng dụng
```bash
npm start
# Hoặc
npx expo start
```

### Bước 2: Test với Button (đơn giản)
1. Mở một mã chứng khoán bất kỳ
2. Nhấn button **"Sau"** → Kiểm tra chuyển sang mã tiếp theo
3. Nhấn button **"Trước"** → Kiểm tra quay lại

### Bước 3: Test với Swipe (nâng cao)
1. Mở một mã chứng khoán
2. **Vuốt TRÁI** (từ phải sang trái) → Chuyển sang mã tiếp theo
3. **Vuốt PHẢI** (từ trái sang phải) → Quay lại mã trước đó
4. Thử vuốt nhẹ (< 80px) → Nội dung sẽ quay lại vị trí cũ
5. Thử scroll dọc → Vẫn hoạt động bình thường!

### Bước 4: Test với Search
1. Tìm kiếm "app" → Có AAPL
2. Mở AAPL
3. Swipe → Chỉ chuyển trong kết quả tìm kiếm

---

## 📁 Files Đã Chỉnh Sửa

### 1. `screens/Home/HomeScreen.tsx`
**Dòng 24-50**: Logic chuyển đổi stock
- `handleNextStock()`: Chuyển sang mã tiếp theo
- `handlePreviousStock()`: Quay lại mã trước đó

**Dòng 102-107**: Truyền callbacks vào BottomSheet
```tsx
<BasicBottomSheet
  stockData={selectedStock}
  onClose={handleCloseSheet}
  onNextStock={handleNextStock}      // ← Thêm
  onPreviousStock={handlePreviousStock} // ← Thêm
/>
```

### 2. `components/BottomSheet/BasicBottomSheet.tsx`
**Dòng 10-17**: Import gesture handler & reanimated
```tsx
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
```

**Dòng 42-44**: Shared values cho animation
```tsx
const translateX = useSharedValue(0);
const contextX = useSharedValue(0);
```

**Dòng 116-170**: Pan gesture configuration
- `.activeOffsetX([-10, 10])`: Kích hoạt swipe ngang
- `.failOffsetY([-20, 20])`: Ưu tiên scroll dọc
- Logic xử lý swipe left/right

**Dòng 237-257**: Navigation buttons (test dễ hơn)

**Dòng 302-455**: Wrap với GestureDetector + Animated.View

---

## 🛠️ Dependencies Được Sử Dụng

Các package này **ĐÃ CÓ SẴN** trong project:
- ✅ `react-native-gesture-handler` (~2.28.0)
- ✅ `react-native-reanimated` (~4.1.1)
- ✅ `@gorhom/bottom-sheet` (^5.2.6)

**Không cần cài thêm gì!** 🎉

---

## 💡 Tips & Tricks

### 1. Điều chỉnh độ nhạy swipe
Trong `BasicBottomSheet.tsx` dòng 138-139:
```tsx
const SWIPE_THRESHOLD = 80;      // ← Giảm xuống để swipe dễ hơn
const VELOCITY_THRESHOLD = 400;  // ← Giảm xuống để swipe nhanh hơn
```

### 2. Điều chỉnh giới hạn kéo
Dòng 130:
```tsx
const maxTranslate = 150;  // ← Tăng lên để xem preview rõ hơn
```

### 3. Tắt button (chỉ dùng swipe)
Xóa hoặc comment dòng 237-257 trong `BasicBottomSheet.tsx`

### 4. Debug
Thêm console.log để xem gesture data:
```tsx
.onEnd((event) => {
  console.log('Swipe:', event.translationX, event.velocityX);
  // ...
})
```

---

## ❓ Troubleshooting

### Vấn đề: Swipe không hoạt động
**Giải pháp:**
1. Kiểm tra `react-native-gesture-handler` đã cài đúng chưa
2. Kiểm tra file `app/_layout.tsx` có wrap với `GestureHandlerRootView` chưa

### Vấn đề: Conflict với scroll dọc
**Giải pháp:**
- Điều chỉnh `.failOffsetY([value])` - tăng giá trị lên (vd: 30)

### Vấn đề: Animation giật
**Giải pháp:**
- Kiểm tra `react-native-reanimated` đã setup đúng chưa
- Thử giảm `SWIPE_THRESHOLD` xuống

---

## 🎓 Nguyên Lý Hoạt Động

```
User vuốt trái 100px với vận tốc 500px/s
    ↓
Pan Gesture detect: translationX = -100, velocityX = -500
    ↓
Check điều kiện:
  - translationX < -80 ✅
  - velocityX < -400 ✅
    ↓
Gọi onNextStock() qua runOnJS
    ↓
HomeScreen tìm index hiện tại trong filteredStocks
    ↓
index++ → setSelectedStock(filteredStocks[index])
    ↓
BasicBottomSheet nhận stockData mới
    ↓
useEffect reset translateX về 0 với spring animation
    ↓
✨ Chuyển mượt sang mã tiếp theo!
```

---

## 📝 Kết Luận

Tính năng swipe giúp bạn:
- ✅ Duyệt nhanh nhiều mã chứng khoán
- ✅ UX mượt mà, hiện đại
- ✅ Không conflict với các gesture khác
- ✅ Tương thích với tìm kiếm/lọc

**Chúc bạn sử dụng vui vẻ!** 🚀

---

**Ngày tạo**: 2025-01-30  
**Tác giả**: AI Assistant  
**Version**: 1.0



