# SanBong - He Thong Quan Ly San Bong

He thong quan ly san bong tructuyen - du an hoc phan Co So Du Lieu Phan Tan (THCSDL).

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](#)
[![Java](https://img.shields.io/badge/Java-23-blue)](#)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.0-green)](#)
[![React](https://img.shields.io/badge/React-19-blue)](#)

---

## Muc luc

- [Mo ta du an](#mo-ta-du-an)
- [Tinh nang chinh](#tinh-nang-chinh)
- [Cau truc du an](#cau-truc-du-an)
- [Cong nghe su dung](#cong-nghe-su-dung)
- [Yeu cau he thong](#yeu-cau-he-thong)
- [Huong dan cai dat](#huong-dan-cai-dat)
  - [Backend (Spring Boot)](#1-cai-dat-backend)
  - [Frontend (React)](#2-cai-dat-frontend)
  - [Chay ung dung](#3-chay-ung-dung)
- [Tai khoan mac dinh](#tai-khoan-mac-dinh)
- [Huong dan su dung](#huong-dan-su-dung)
  - [Nguoi dung thong thuong](#nguoi-dung-thong-thuong)
  - [Quan tri vien](#quan-tri-vien)
- [Cau hinh MySQL (Production)](#cau-hinh-mysql-cho-production)
- [Thu nghiem API](#thu-nghiem-api)
- [Cac loi thuong gap](#cac-loi-thuong-gap)
- [Lich su phien ban](#lich-su-phien-ban)
- [Dong gop](#dong-gop)
- [Bang quyen va giay phep](#bang-quyen-va-giay-phep)

---

## Mo ta du an

SanBong la mot he thong quan ly san bong tructuyen, cho phep nguoi dung dat san, quan ly lich dat, danh gia san bong, va quan tri he thong mot cach hieu qua. Du an duoc xay dung theo kien truc **Full-Stack** voi backend Java Spring Boot va frontend React.

Dac diem noi bat:
- Dat san truc tuyen voi kiem tra tinh khả dụng theo thoi gian thuc
- He thong phan quyen: Nguoi dung / Quan tri vien
- Thong ke doanh thu chi tiet theo ngay, thang, nam
- Danh gia san bong voi he thong diem so
- Giao dien nguoi dung thiet ke responsive, hien dang

---

## Tinh nang chinh

### Nguoi dung

- **Dang nhap / Dang ky** tai khoan
- **Xem danh sach san bong** theo chi nhanh va loai san
- **Dat san** theo ngay va khung gio
- **Xem lich su dat san** (sap xep theo trang thai: Dang cho, Da duyet, Hoan tat, Da huy)
- **Huy dat san** khi chua duyet
- **Danh gia san bong** sau khi hoan tat

### Quan tri vien

- **Dashboard** - Tong quan he thong (doanh thu, so san, so khach hang, so dat san)
- **Quan ly chi nhanh** - Them / Chinh sua / Xoa chi nhanh
- **Quan ly san bong** - Them / Chinh sua / Xoa san, quan ly khung gio
- **Quan ly dat san** - Duyet / Huy / Hoan tat / Xoa dat san
- **Quan ly khach hang** - Xem danh sach tai khoan
- **Bao cao doanh thu** - Theo thang, theo nam
- **Quan ly danh gia** - Xem va xoa danh gia

---

## Cau truc du an

```
Project_Database_20241-main/
├── backend/                          # Spring Boot API
│   ├── src/main/java/com/sanbong/
│   │   ├── SanBongApplication.java   # Entry point
│   │   ├── config/                  # Cau hinh Security, CORS
│   │   ├── controller/               # REST Controllers
│   │   │   ├── AuthController.java    # Auth endpoints
│   │   │   ├── BookingController.java # User booking endpoints
│   │   │   ├── UserController.java    # User profile endpoints
│   │   │   ├── PublicController.java  # Public field/branch endpoints
│   │   │   └── admin/               # Admin controllers
│   │   │       ├── AdminBookingController.java
│   │   │       ├── AdminBookingController.java
│   │   │       ├── BranchController.java
│   │   │       ├── FieldController.java
│   │   │       ├── TimeSlotAdminController.java
│   │   │       ├── CustomerController.java
│   │   │       ├── RevenueController.java
│   │   │       └── ReviewController.java
│   │   ├── dto/
│   │   │   ├── request/            # Request DTOs
│   │   │   └── response/            # Response DTOs + ApiResponse wrapper
│   │   ├── entity/                  # JPA Entities
│   │   │   ├── BaseEntity.java      # Base entity voi id, createdAt, updatedAt
│   │   │   ├── User.java
│   │   │   ├── Branch.java
│   │   │   ├── Field.java
│   │   │   ├── TimeSlot.java
│   │   │   ├── Booking.java
│   │   │   └── Review.java
│   │   ├── enums/
│   │   │   ├── Role.java           # USER, ADMIN
│   │   │   └── BookingStatus.java   # CHO_DUYET, DA_DUYET, HOAN_TAT, DA_HUY
│   │   ├── exception/              # Custom exceptions + GlobalExceptionHandler
│   │   ├── repository/              # Spring Data JPA Repositories
│   │   ├── security/
│   │   │   ├── JwtTokenProvider.java
│   │   │   ├── JwtAuthenticationFilter.java
│   │   │   ├── UserPrincipal.java
│   │   │   └── CustomUserDetailsService.java
│   │   └── service/
│   │       ├── interfaces/         # Service interfaces
│   │       └── impl/              # Service implementations
│   ├── src/main/resources/
│   │   └── application.properties  # Cau hinh database, JWT, server
│   └── pom.xml
│
├── frontend/                         # React SPA
│   ├── src/
│   │   ├── api/                    # Axios API clients
│   │   │   ├── index.js            # Axios instance (interceptors)
│   │   │   ├── authApi.js
│   │   │   ├── fieldApi.js
│   │   │   ├── bookingApi.js
│   │   │   ├── userApi.js
│   │   │   └── adminApi.js
│   │   ├── components/
│   │   │   ├── layout/             # Layout, Header, Footer, ManagerHeader
│   │   │   └── pages/
│   │   │       ├── Home.js          # Trang chu - danh sach san
│   │   │       ├── Signin.js        # Dang nhap
│   │   │       ├── Signup.js        # Dang ky
│   │   │       ├── BookingPage.js   # Dat san (multi-step)
│   │   │       ├── MyBookings.js    # Lich su dat san
│   │   │       ├── Reviews.js       # Danh gia san
│   │   │       ├── Profile.js       # Trang ca nhan
│   │   │       └── admin/           # Admin pages
│   │   │           ├── Dashboard.js
│   │   │           ├── BranchManager.js
│   │   │           ├── FieldManager.js
│   │   │           ├── BookingManager.js
│   │   │           ├── CustomerManager.js
│   │   │           ├── RevenueReport.js
│   │   │           └── ReviewManager.js
│   │   ├── hooks/
│   │   │   ├── useAuth.js           # Auth context (signin/signup/logout)
│   │   │   └── useToast.js          # Toast notification hook
│   │   ├── styles/                  # CSS files
│   │   │   └── global.css           # Design system (variables, utilities)
│   │   ├── App.js                   # Router + ProtectedRoute
│   │   └── index.js
│   ├── package.json
│   └── public/
│       └── index.html
│
├── README.md                         # Tai lieu du an
└── LICENCE                           # Giay phep
```

---

## Cong nghe su dung

### Backend

| Cong nghe | Phien ban | Mo ta |
|-----------|-----------|-------|
| Java | 23+ | Ngon ngu lap trinh |
| Spring Boot | 3.3.0 | Framework chinh |
| Spring Data JPA | 3.3.0 | Truy cap database |
| Spring Security | 6.1.8 | Xac thuc & phan quyen |
| H2 Database | - | Database cho dev (in-memory) |
| MySQL | 8.0+ | Database cho production |
| Lombok | 1.18.38 | Giam code lap |
| JJWT | 0.11.5 | JSON Web Token |
| HikariCP | 5.0.1 | Connection pool |
| Springdoc OpenAPI | 2.3.0 | API documentation |

### Frontend

| Cong nghe | Phien ban | Mo ta |
|-----------|-----------|-------|
| React | 19 | UI framework |
| react-router-dom | 7 | Routing |
| Axios | 1.11.0 | HTTP client |
| Chart.js | 4.4.9 | Bieu do thong ke |
| react-chartjs-2 | 5.3.0 | React wrapper cho Chart.js |
| FontAwesome | 6.7.2 | Icons |
| JWT Decode | 4.0.0 | Decode JWT token |

---

## Yeu cau he thong

- **Java Development Kit (JDK)** 23 hoac cao hon
- **Node.js** 18 hoac cao hon
- **Maven** 3.9+ (hoac su dung `mvnw` di kem)
- **MySQL** 8.0+ (chi can thiet khi su dung production)

---

## Huong dan cai dat

### 1. Cai dat Backend

Backend su dung Maven, co the chay truc tiep bang `mvnw` (khong can cai Maven thu cong).

```bash
cd backend
./mvnw.cmd spring-boot:run    # Windows
# hoac
./mvnw spring-boot:run        # Linux/macOS
```

Backend se khoi dong tren **port 2006**. Du lieu khoi tao (admin, 2 chi nhanh, 4 san bong) se duoc tao tu dong.

**Hoac build thanh JAR:**

```bash
./mvnw.cmd clean package -DskipTests
java -jar target/THCSDL-0.0.1-SNAPSHOT.jar
```

### 2. Cai dat Frontend

```bash
cd frontend
npm install
```

### 3. Chay ung dung

**Terminal 1 - Backend:**

```bash
cd backend
./mvnw.cmd spring-boot:run
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm start
```

Ung dung frontend se mo tu dong tai **http://localhost:3000**.

---

## Tai khoan mac dinh

Sau khi chay backend lan dau, he thong se tu dong tao du lieu mau:

| Vai tro | Email | Mat khau |
|---------|-------|---------|
| Quan tri vien | admin@sanbong.com | admin123 |

**Du lieu mau da tao san:**
- 2 chi nhanh: "Chi nhanh Cau Giay", "Chi nhanh Thanh Xuan"
- 4 san bong: "San A1", "San A2" (5 nguoi, 150.000VND), "San B1", "San B2" (7 nguoi, 250.000VND)
- 15 khung gio cho moi san (7h - 22h)

---

## Huong dan su dung

### Nguoi dung thong thuong

1. **Dang ky tai khoan** tai `/signup`
2. **Dang nhap** tai `/signin`
3. **Xem danh sach san bong** va loc theo chi nhanh / loai san tai trang chu
4. **Dat san** - chon san, chon ngay, chon khung gio, xac nhan
5. **Xem lich su dat san** tai `/my-bookings` - loc theo trang thai
6. **Huy dat san** neu chua duyet
7. **Danh gia san** tai `/reviews` sau khi da hoan tat dat san
8. **Cap nhat thong tin ca nhan** tai `/profile`

### Quan tri vien

1. Dang nhap bang tai khoan admin
2. Truy cap trang quan ly tai `/admin`
3. **Dashboard** - Xem tong quan: so san, doanh thu, so khach hang
4. **Quan ly chi nhanh** (`/admin/branches`) - Them sua xoa chi nhanh
5. **Quan ly san bong** (`/admin/fields`) - Them sua xoa san, quan ly khung gio
6. **Quan ly dat san** (`/admin/bookings`) - Duyet / Huy / Hoan tat / Xoa dat san
7. **Quan ly khach hang** (`/admin/customers`) - Xem danh sach tai khoan
8. **Bao cao doanh thu** (`/admin/revenue`) - Xem doanh thu theo thang/nam
9. **Quan ly danh gia** (`/admin/reviews`) - Xem va xoa danh gia

---

## Cau hinh MySQL cho Production

Du an su dung **H2 in-memory** theo mac dinh (rat tot cho phat trien va test). De chuyen sang MySQL, chinh sua file `backend/src/main/resources/application.properties`:

```properties
# Comment out H2 config
# spring.datasource.url=jdbc:h2:mem:sanbong;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE;MODE=MySQL
# spring.datasource.username=sa
# spring.datasource.password=

# Uncomment MySQL config
spring.datasource.url=jdbc:mysql://localhost:3306/san_bong?useSSL=false&serverTimezone=Asia/Ho_Chi_Minh&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD_HERE

# Hibernate dialect
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
spring.jpa.hibernate.ddl-auto=update
```

Tao database `san_bong` truoc khi chay:

```sql
CREATE DATABASE san_bong CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

## Thu nghiem API

API documentation co san tai Swagger UI (sau khi khoi dong backend):

```
http://localhost:2006/swagger-ui.html
```

### Cac endpoint chinh

**Cong khai (khong can auth):**

| Method | Endpoint | Mo ta |
|--------|----------|-------|
| GET | `/api/public/branches` | Lay danh sach chi nhanh |
| GET | `/api/public/fields` | Lay danh sach san (co loc theo branchId) |
| GET | `/api/public/fields/{id}` | Chi tiet san |
| GET | `/api/public/fields/{id}/availability?date=YYYY-MM-DD` | Kiem tra tinh khả dụng |

**Auth:**

| Method | Endpoint | Mo ta |
|--------|----------|-------|
| POST | `/api/auth/signin` | Dang nhap |
| POST | `/api/auth/signup` | Dang ky |

**Nguoi dung (can Bearer token):**

| Method | Endpoint | Mo ta |
|--------|----------|-------|
| POST | `/api/bookings` | Dat san |
| GET | `/api/bookings` | Lay lich su dat san |
| POST | `/api/bookings/reviews` | Danh gia san |
| GET | `/api/users/me` | Lay thong tin ca nhan |
| PUT | `/api/users/me` | Cap nhat thong tin |
| DELETE | `/api/users/bookings/{id}` | Huy dat san |

**Admin (can role ADMIN):**

| Method | Endpoint | Mo ta |
|--------|----------|-------|
| GET | `/api/admin/branches` | Quan ly chi nhanh (CRUD) |
| GET | `/api/admin/fields` | Quan ly san bong (CRUD) |
| GET | `/api/admin/fields/{id}/timeslots` | Quan ly khung gio |
| GET | `/api/admin/bookings` | Quan ly dat san |
| PUT | `/api/admin/bookings/{id}/approve` | Duyet dat san |
| PUT | `/api/admin/bookings/{id}/cancel` | Huy dat san |
| PUT | `/api/admin/bookings/{id}/complete` | Hoan tat dat san |
| GET | `/api/admin/customers` | Quan ly khach hang |
| GET | `/api/admin/reviews` | Quan ly danh gia |
| GET | `/api/admin/revenue` | Doanh thu theo thang |
| GET | `/api/admin/revenue/summary` | Tong quan doanh thu |

---

## Cac loi thuong gap

### 1. Backend khong khoi dong - loi ket noi MySQL

**Loi:** `java.sql.SQLException: Access denied for user 'root'@'localhost'`

**Giai phap:** Kiem tra mat khau MySQL trong `application.properties`. Neu chua co, su dung H2 mac dinh (khong can cau hinh gi them).

### 2. MySQL chua chay

**Loi:** `Connection refused`

**Giai phap:** Khoi dong MySQL service:

```powershell
# Windows
net start MySQL95

# Linux
sudo systemctl start mysql
```

### 3. Frontend khong ket noi duoc backend

**Loi:** Network error, CORS error

**Giai phap:**
- Dam ba bao backend da chay tren port 2006
- Kiem tra `application.properties` da co CORS cho `localhost:3000`
- Kiem tra token JWT con han (het han sau 7 ngay)

### 4. loi 500 khi goi API

**Loi:** `500 Internal Server Error`

**Giai phap:** Kiem tra console cua backend (terminal dang chay Spring Boot) de xem chi tiet loi. Cac nguyen nhan thuong gap:
- Sai format request body
- Thieu tham so bat buoc
- foreign key violation (xoa chi nhanh con san bong)

### 5. Lombok khong hoat dong

**Loi:** `variable not initialized in the default constructor`

**Giai phap:** Dam ba da cai dat `lombok 1.18.38` trong `pom.xml` va `<proc>full</proc>` trong maven-compiler-plugin.

### 6. Cua so trinh duyet bi trong khi khoi dong backend

**Loi:** Spring Boot mo cua so trinh duyet khi chay

**Giai phap:** Thoat khoi ung dung Spring Boot, xoa thu muc `target`, chay lai. Dam ba rang `spring-boot-starter-thymeleaf` co scope `provided` hoac `exclude` no khoi dependencies.

---

## Lich su phien ban

### v2.0 (2026-06-01)
- Tai cau truc backend theo nguyen tac OOP (entities, DTOs, services, controllers)
- Chuyen frontend sang React voi cac trang moi: Trang chu, Dat san, Lich su, Danh gia, Ca nhan, Quan ly
- Thay the database MySQL = H2 cho moi truong dev
- Them he thong JWT authentication
- Them chuc nang danh gia san bong
- Thiet ke lai giao dien nguoi dung (Admin Dashboard, quan ly CRUD)
- Them Bao cao doanh thu
- Xoa 49 file cu thua trong package `Main`
- Xoa cac component frontend cu khong su dung

### v1.0 (truoc do)
- Du an ban dau voi cau truc thu cong, MySQL, khong co OOP
- Giao dien JSP/Thymeleaf

---

## Dong gop

Moi dong gop deu duoc hoan nghien. Vui long:
1. Tao branch moi cho tinh nang (`git checkout -b feature/ten-tinh-nang`)
2. Commit thay doi voi message ro rang
3. Gui Pull Request vao branch `main`
4. Dam ba rang cac test da chay thanh cong

**Cac yeu cau duoc chap nhan:**
- Sua loi bug
- Cai thien hieu nang
- Them tinh nang moi
- Cap nhat tai lieu
- Cai thien kien truc code

---

## Nguoi dong gop

Du an duoc phat trien boi sinh vien HCMUTE, mon hoc Co So Du Lieu Phan Tan.

---

## Bang quyen va giay phep

Du an nay chi mang tinh hoc tap. Khong co giay phep thuong mai nao duoc cap.

---

## Lien he ho tro

Neu gap van de hoac co cau hoi, vui long tao Issue tren repository hoac lien he qua email: support@sanbong.local

---

*Cap nhat lan cuoi: 01/06/2026*
