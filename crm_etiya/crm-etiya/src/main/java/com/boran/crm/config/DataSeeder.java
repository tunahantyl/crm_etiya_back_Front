package com.boran.crm.config;

import com.boran.crm.domain.entity.*;
import com.boran.crm.domain.repository.CustomerRepository;
import com.boran.crm.domain.repository.TaskRepository;
import com.boran.crm.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Random;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final TaskRepository taskRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Sadece boşsa seed et
        if (userRepository.count() == 0 && customerRepository.count() == 0 && taskRepository.count() == 0) {
            seedDatabase();
        }
    }

    private void seedDatabase() {
        Random random = new Random();
        
        // İsim listeleri
        String[] firstNames = {
            "Ahmet", "Mehmet", "Mustafa", "Ali", "Hasan", "Hüseyin", "İbrahim", "İsmail", "Murat", "Osman",
            "Fatma", "Ayşe", "Emine", "Hatice", "Zeynep", "Elif", "Meryem", "Büşra", "Sema", "Esra",
            "Can", "Cem", "Deniz", "Ege", "Kaan", "Kerem", "Onur", "Berk", "Emre", "Burak",
            "Selin", "Derin", "Ece", "İrem", "Melis", "Begüm", "Cansu", "Defne", "Gizem", "Pınar"
        };
        
        String[] lastNames = {
            "Yılmaz", "Kaya", "Demir", "Şahin", "Çelik", "Yıldız", "Yıldırım", "Öztürk", "Aydin", "Özdemir",
            "Arslan", "Doğan", "Kılıç", "Aslan", "Çetin", "Kara", "Koç", "Kurt", "Özkan", "Şimşek",
            "Erdoğan", "Güler", "Türk", "Köse", "Duman", "Çakır", "Gül", "Acar", "Başar", "Soylu"
        };
        
        String[] cities = {
            "İstanbul", "Ankara", "İzmir", "Bursa", "Antalya", "Adana", "Konya", "Gaziantep", "Mersin", "Diyarbakır",
            "Kayseri", "Eskişehir", "Urfa", "Malatya", "Erzurum", "Van", "Batman", "Elazığ", "İçel", "Trabzon",
            "Balıkesir", "Kahramanmaraş", "Manisa", "Bolu", "Tekirdağ", "Sivas", "Denizli", "Sakarya", "Kocaeli", "Muğla"
        };
        
        String[] companies = {
            "Teknoloji A.Ş.", "Yazılım Ltd.", "Danışmanlık Hizmetleri", "İnşaat A.Ş.", "Turizm Ltd.",
            "Gıda Sanayi A.Ş.", "Tekstil Fabrikası", "Otomotiv Ltd.", "Enerji A.Ş.", "Telekomünikasyon Ltd.",
            "Finans Hizmetleri", "Lojistik A.Ş.", "E-ticaret Ltd.", "Medya Grubu", "Sağlık Hizmetleri A.Ş.",
            "Eğitim Kurumları", "Spor Kulübü", "Restoran Zinciri", "Mağazacılık A.Ş.", "İmalat Sanayi Ltd."
        };

        // Kullanıcılar oluştur
        List<User> users = new ArrayList<>();
        
        // Admin kullanıcılar (3 tane)
        for (int i = 1; i <= 3; i++) {
            users.add(User.builder()
                .fullName(firstNames[random.nextInt(firstNames.length)] + " " + lastNames[random.nextInt(lastNames.length)])
                .email("admin" + i + "@crm.com")
                .password(passwordEncoder.encode("admin123"))
                .role(Role.ADMIN)
                .isActive(true)
                .build());
        }
        
        // Manager kullanıcılar (5 tane)
        for (int i = 1; i <= 5; i++) {
            users.add(User.builder()
                .fullName(firstNames[random.nextInt(firstNames.length)] + " " + lastNames[random.nextInt(lastNames.length)])
                .email("manager" + i + "@crm.com")
                .password(passwordEncoder.encode("manager123"))
                .role(Role.MANAGER)
                .isActive(true)
                .build());
        }
        
        // Normal kullanıcılar (12 tane)
        for (int i = 1; i <= 12; i++) {
            users.add(User.builder()
                .fullName(firstNames[random.nextInt(firstNames.length)] + " " + lastNames[random.nextInt(lastNames.length)])
                .email("user" + i + "@crm.com")
                .password(passwordEncoder.encode("user123"))
                .role(Role.USER)
                .isActive(random.nextBoolean() || random.nextBoolean()) // %75 aktif
                .build());
        }
        
        userRepository.saveAll(users);

        // Müşteriler oluştur (50 tane)
        List<Customer> customers = new ArrayList<>();
        String[] vipNotes = {"VIP müşteri", "Büyük hacimli alıcı", "Stratejik partner", "Uzun vadeli müşteri", "Premium hizmet alıcısı"};
        String[] regularNotes = {"Düzenli müşteri", "Potansiyel büyüme", "Yeni müşteri", "Referans müşteri", "Pilot proje müşterisi"};
        
        for (int i = 1; i <= 50; i++) {
            String firstName = firstNames[random.nextInt(firstNames.length)];
            String lastName = lastNames[random.nextInt(lastNames.length)];
            String company = companies[random.nextInt(companies.length)];
            boolean isVip = random.nextInt(10) < 3; // %30 VIP
            
            customers.add(Customer.builder()
                .name(firstName + " " + lastName + " - " + company)
                .email(firstName.toLowerCase() + "." + lastName.toLowerCase() + "@" + company.toLowerCase().replace(" ", "").replace(".", "") + ".com")
                .phone("555" + String.format("%04d", 1000 + i))
                .address(cities[random.nextInt(cities.length)] + ", " + (random.nextInt(50) + 1) + ". Sokak No: " + (random.nextInt(100) + 1))
                .notes(isVip ? vipNotes[random.nextInt(vipNotes.length)] : regularNotes[random.nextInt(regularNotes.length)])
                .isActive(random.nextInt(10) > 1) // %90 aktif
                .build());
        }
        
        customerRepository.saveAll(customers);

        // Görevler oluştur (150 tane)
        List<Task> tasks = new ArrayList<>();
        String[] taskTitles = {
            "Müşteri Görüşmesi", "Sözleşme Hazırlama", "Teknik Destek", "Proje Sunumu", "Sistem Analizi",
            "Fiyat Teklifi", "Demo Hazırlama", "Eğitim Verme", "Dokümantasyon", "Test Süreci",
            "Bakım Hizmetleri", "Güncelleme İşlemleri", "Performans Analizi", "Güvenlik Kontrolü", "Veri Migrasyonu",
            "Entegrasyon Çalışması", "Raporlama", "Kalite Kontrolü", "Müşteri Eğitimi", "Satış Takibi",
            "Pazarlama Kampanyası", "İletişim Kurma", "Sorun Çözme", "Optimizasyon", "Araştırma Projesi"
        };
        
        String[] taskDescriptions = {
            "Müşteri ile detaylı görüşme yapılacak", "Yasal süreçler tamamlanacak", "Teknik sorunlar çözülecek",
            "Kapsamlı sunum hazırlanacak", "Sistem gereksinimleri analiz edilecek", "Rekabetçi fiyat oluşturulacak",
            "Ürün demosu hazırlanacak", "Kullanıcı eğitimi verilecek", "Detaylı dokümantasyon oluşturulacak",
            "Kapsamlı test senaryoları uygulanacak", "Düzenli bakım yapılacak", "Sistem güncellemeleri uygulanacak",
            "Performans metrikleri ölçülecek", "Güvenlik açıkları kontrol edilecek", "Veri taşıma işlemleri yapılacak",
            "Sistem entegrasyonu sağlanacak", "Detaylı raporlar oluşturulacak", "Kalite standartları kontrol edilecek",
            "Müşteri personeli eğitilecek", "Satış süreçleri takip edilecek", "Pazarlama stratejileri uygulanacak",
            "Etkili iletişim kanalları kurulacak", "Müşteri sorunları çözülecek", "Süreçler optimize edilecek",
            "Pazar araştırması yapılacak"
        };
        
        TaskStatus[] statuses = TaskStatus.values();
        
        for (int i = 1; i <= 150; i++) {
            TaskStatus status = statuses[random.nextInt(statuses.length)];
            LocalDateTime dueDate;
            LocalDateTime completedAt = null;
            Float actualHours = null;
            
            // Tarih aralıkları çeşitlendir
            if (status == TaskStatus.COMPLETED) {
                dueDate = LocalDateTime.now().minusDays(random.nextInt(30) + 1); // Son 30 gün
                completedAt = dueDate.plusDays(random.nextInt(3)); // Bitiş tarihinden sonra 0-2 gün
                actualHours = (float) (random.nextInt(10) + 1) + random.nextFloat();
            } else if (status == TaskStatus.IN_PROGRESS) {
                dueDate = LocalDateTime.now().plusDays(random.nextInt(20) + 1); // Gelecek 20 gün
            } else {
                dueDate = LocalDateTime.now().plusDays(random.nextInt(45) + 1); // Gelecek 45 gün
            }
            
            tasks.add(Task.builder()
                .title(taskTitles[random.nextInt(taskTitles.length)] + " #" + i)
                .description(taskDescriptions[random.nextInt(taskDescriptions.length)])
                .status(status)
                .dueDate(dueDate)
                .completedAt(completedAt)
                .priority(random.nextInt(3) + 1) // 1-3 arası
                .customer(customers.get(random.nextInt(customers.size())))
                .assignedTo(users.get(random.nextInt(users.size())))
                .estimatedHours((float) (random.nextInt(8) + 1) + random.nextFloat())
                .actualHours(actualHours)
                .build());
        }
        
        taskRepository.saveAll(tasks);
    }
}