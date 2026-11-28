// ===== Preloader =====
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('preloader').classList.add('loaded');
    }, 2000);
});

// ===== Header Scroll Effect =====
const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// ===== Mobile Menu =====
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

// Close mobile menu on link click
document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
    });
});

// ===== Smooth Scroll for Navigation =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = header.offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Animate on Scroll (Custom AOS) =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = entry.target.getAttribute('data-aos-delay') || 0;
            setTimeout(() => {
                entry.target.classList.add('aos-animate');
            }, parseInt(delay));
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('[data-aos]').forEach(el => {
    observer.observe(el);
});

// ===== Counter Animation =====
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.stat-number');
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;

                const updateCounter = () => {
                    current += step;
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };

                updateCounter();
            });
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.intro-stats');
if (statsSection) {
    counterObserver.observe(statsSection);
}

// ===== Jewelry Filter =====
const jewelryTabs = document.querySelectorAll('.jewelry-tab');
const jewelryItems = document.querySelectorAll('.jewelry-item');

jewelryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Update active tab
        jewelryTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const category = tab.getAttribute('data-category');

        jewelryItems.forEach(item => {
            const itemCats = (item.getAttribute('data-category') || '').split(' ');
            if (category === 'all' || itemCats.includes(category)) {
                item.classList.remove('hidden');
                item.style.display = '';
            } else {
                item.classList.add('hidden');
                item.style.display = 'none';
            }
        });

        // Hide/show stream and BST groups based on visible children
        document.querySelectorAll('.bst-group').forEach(group => {
            const visibleCount = group.querySelectorAll('.jewelry-item:not(.hidden)').length;
            group.style.display = visibleCount > 0 ? '' : 'none';
        });

        document.querySelectorAll('.collections-stream').forEach(stream => {
            const visibleCount = stream.querySelectorAll('.jewelry-item:not(.hidden)').length;
            stream.style.display = visibleCount > 0 ? '' : 'none';
        });
    });
});

// Check URL hash on load to filter category (e.g. san-pham.html#modern)
window.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
        const matchingTab = document.querySelector(`.jewelry-tab[data-category="${hash}"]`);
        if (matchingTab) {
            matchingTab.click();
        }
    }
});

// ===== Testimonials Slider =====
const testimonials = document.querySelectorAll('.testimonial');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.testimonial-prev');
const nextBtn = document.querySelector('.testimonial-next');
let currentTestimonial = 0;

function showTestimonial(index) {
    if (!testimonials.length || !testimonials[index]) return; // guard: không có testimonial
    testimonials.forEach(t => t.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    testimonials[index].classList.add('active');
    if (dots[index]) dots[index].classList.add('active');
    currentTestimonial = index;
}

if (prevBtn && nextBtn && testimonials.length > 0) {
    prevBtn.addEventListener('click', () => {
        showTestimonial((currentTestimonial - 1 + testimonials.length) % testimonials.length);
    });
    nextBtn.addEventListener('click', () => {
        showTestimonial((currentTestimonial + 1) % testimonials.length);
    });
}

if (dots.length > 0) {
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showTestimonial(index));
    });
}

// Auto-rotate testimonials (chỉ khi có testimonial)
if (testimonials.length > 0) {
    setInterval(() => {
        showTestimonial((currentTestimonial + 1) % testimonials.length);
    }, 6000);
}

// ===== Contact Form =====
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalContent = submitBtn.innerHTML;

        submitBtn.innerHTML = '<span>Đang gửi...</span>';
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.innerHTML = '<span>✓ Đã gửi thành công!</span>';
            submitBtn.style.background = '#2d8a4e';

            setTimeout(() => {
                submitBtn.innerHTML = originalContent;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
                contactForm.reset();
            }, 3000);
        }, 1500);
    });
}

// ===== Newsletter Form =====
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = newsletterForm.querySelector('button');
        const originalText = btn.textContent;
        btn.textContent = '✓ Đã đăng ký!';
        btn.style.background = '#2d8a4e';

        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            newsletterForm.reset();
        }, 3000);
    });
}

// ===== Back to Top =====
const backToTop = document.getElementById('back-to-top');

if (backToTop) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===== Parallax Effect for Discover Section =====
window.addEventListener('scroll', () => {
    const discover = document.querySelector('.discover-parallax img');
    if (discover) {
        const scrolled = window.pageYOffset;
        const section = document.querySelector('.discover-section');
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (scrolled > sectionTop - window.innerHeight && scrolled < sectionTop + sectionHeight) {
            const yPos = (scrolled - sectionTop) * 0.3;
            discover.style.transform = `translateY(${yPos}px) scale(1.1)`;
        }
    }
});

// ===== Image lazy loading enhancement =====
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('load', function () {
        this.style.opacity = '1';
    });
    if (img.complete) {
        img.style.opacity = '1';
    }
});

// ===== Quick View Modal Product Data & Handler =====
const productData = {
    // I. DÒNG HIỆN ĐẠI — BST Điệp Vũ Nguyệt
    'ring-butterfly': {
        title: 'Nhẫn Khảm Xà Cừ',
        category: 'Dòng Hiện Đại • BST Điệp Vũ Nguyệt',
        price: '433.000đ',
        image: 'assets/images/sk_nhan_0.jpg',
        features: [
            'Chất liệu: Bạc 925 cao cấp phủ rhodium chống oxy hóa',
            'Mặt nhẫn: Xà cừ tự nhiên Chuôn Ngọ tuyển chọn ánh xanh đại dương',
            'Kiểu dáng: Tối giản, hiện đại, thanh lịch trên mọi ngón tay',
            'Khắc laser: Hỗ trợ khắc tên, ngày kỷ niệm bên trong lòng nhẫn',
            'Hộp đựng: Hộp nhung Sắc Khảm cao cấp'
        ]
    },
    'necklace-butterfly': {
        title: 'Dây Chuyền Khảm Xà Cừ',
        category: 'Dòng Hiện Đại • BST Điệp Vũ Nguyệt',
        price: '600.000đ',
        image: 'assets/images/sk_day_chuyen_1.jpg',
        features: [
            'Chất liệu: Bạc Ý 925 cao cấp sáng bóng không rỉ',
            'Mặt dây chuyền: Cánh bướm khảm xà cừ đại dương chuyển sắc',
            'Khắc tên laser cá nhân hóa phía sau mặt dây',
            'Tích hợp vi chip NFC thông minh lưu thông điệp thoại/video',
            'Bảo hành làm mới và đánh bóng xà cừ trọn đời'
        ]
    },
    'bracelet-butterfly': {
        title: 'Vòng Tay Khảm Xà Cừ',
        category: 'Dòng Hiện Đại • BST Điệp Vũ Nguyệt',
        price: '543.000đ',
        image: 'assets/images/sk_vong_tay_1.jpg',
        features: [
            'Thiết kế mảnh mai, tôn nét cổ tay thanh thoát',
            'Họa tiết cánh bướm xà cừ Chuôn Ngọ tỏa sắc quang học',
            'Tùy chọn khắc chữ cái đầu hoặc ngày kỷ niệm trên chốt khóa',
            'Công nghệ chạm NFC truyền thông điệp bí mật',
            'Đóng gói hộp quà cao cấp chuẩn phong cách Sắc Khảm'
        ]
    },

    // II. DÒNG TRUYỀN THỐNG — BST Vân Mộng Hồ Điệp
    'comb-butterfly': {
        title: 'Lược Khảm Xà Cừ',
        category: 'Dòng Truyền Thống • BST Vân Mộng Hồ Điệp',
        price: '398.000đ',
        image: 'assets/images/sk_luoc_1.jpg',
        features: [
            'Kỹ thuật khảm cưa lọng Chuôn Ngọ truyền thống gần 1000 năm',
            'Họa tiết cánh bướm xà cừ ánh ngọc trên nền đen bóng cao cấp',
            'Răng lược bo tròn êm dịu, nâng niu từng sợi tóc',
            'Khắc tên kỷ niệm hoặc lời tri ân trên thân lược',
            'Món quà truyền thống thanh lịch dành tặng mẹ, vợ, đối tác'
        ]
    },
    'hairpin-wave': {
        title: 'Trâm Cài Tóc (Dáng Uốn)',
        category: 'Dòng Truyền Thống • BST Vân Mộng Hồ Điệp',
        price: '316.000đ',
        image: 'assets/images/sk_tram_0.jpg',
        features: [
            'Dáng trâm uốn lượn mềm mại lấy cảm hứng từ mây nước cổ phong',
            'Có 2 phiên bản màu: Nâu vân gỗ trầm và Vàng hổ phách thanh tao',
            'Đầu trâm khảm xà cừ tự nhiên Chuôn Ngọ óng ánh sắc ngọc',
            'Thanh trâm chắc chắn, giữ nếp tóc búi cổ phong hoàn hảo',
            'Đi kèm hộp quà nghệ thuật Sắc Khảm và thiệp viết tay'
        ]
    },
    'hairpin-flower': {
        title: 'Trâm Cài Tóc (Khảm Hoa)',
        category: 'Dòng Truyền Thống • BST Vân Mộng Hồ Điệp',
        price: '316.000đ',
        image: 'assets/images/sk_tram_2.jpg',
        features: [
            'Chất liệu gỗ mun đen tuyền tự nhiên càng dùng càng bóng sâu',
            'Họa tiết hoa 5 cánh khảm xà cừ trắng ánh xanh tinh xảo từng đường nét',
            'Chế tác thủ công 100% từ đôi bàn tay nghệ nhân Chuôn Ngọ',
            'Hỗ trợ khắc tên laser và thiệp viết tay trang trọng',
            'Bảo dưỡng làm sáng gỗ mun và xà cừ trọn đời'
        ]
    },
    'mirror-butterfly': {
        title: 'Gương Khảm Xà Cừ',
        category: 'Dòng Truyền Thống • BST Vân Mộng Hồ Điệp',
        price: '407.000đ',
        image: 'assets/images/sk_guong_0.jpg',
        features: [
            'Mặt sau khảm bức tranh vầng trăng khuyết, mây cuộn và hồ điệp xà cừ',
            'Gương soi quang học độ nét cao, khung gỗ tự nhiên gia công trơn mịn',
            'Kiểu dáng cổ phong thanh tao, tôn vinh nét đẹp truyền thống',
            'Khắc tên hoặc thông điệp ý nghĩa ở tay cầm',
            'Đi kèm túi nhung bảo vệ và hộp quà lót lụa'
        ]
    },

    // III. TRỌN BỘ BỘ SƯU TẬP
    'bst-diep-vu-nguyet': {
        title: 'BST Điệp Vũ Nguyệt (Trọn Bộ)',
        category: 'Dòng Hiện Đại • Trọn Bộ Trang Sức',
        price: '1.358.000đ',
        image: 'assets/images/sk_bst_diep_vu_nguyet.jpg',
        features: [
            'Trọn bộ 3 món: Nhẫn (433.000đ) + Dây Chuyền (600.000đ) + Vòng Tay (543.000đ)',
            'Giá trọn bộ ưu đãi: 1.358.000đ (Tiết kiệm 218.000đ so với mua lẻ)',
            'Chất liệu: Bạc Ý 925 & Xà cừ tự nhiên Chuôn Ngọ tuyển chọn',
            'Miễn phí khắc laser tên, chữ ký hoặc ngày kỷ niệm',
            'Tích hợp vi mạch NFC lưu trữ thông điệp bí mật thoại/video',
            'Đóng gói hộp quà nhung nghệ thuật cao cấp Sắc Khảm'
        ]
    },
    'bst-van-mong': {
        title: 'BST Vân Mộng Hồ Điệp (Trọn Bộ)',
        category: 'Dòng Truyền Thống • Trọn Bộ Quà Tặng',
        price: '1.322.000đ',
        image: 'assets/images/sk_bst_van_mong.jpg',
        features: [
            'Trọn bộ phụ kiện cổ phong: Lược khảm (398.000đ) + Trâm cài tóc (316.000đ) + Gương khảm (407.000đ)',
            'Giá trọn bộ BST Vân Mộng Hồ Điệp: 1.322.000đ',
            'Chất liệu: Gỗ quý & Xà cừ Chuôn Ngọ cưa đục thủ công gần 1000 năm',
            'Họa tiết hồ điệp, hoa lá và vầng trăng khuyết độc bản',
            'Miễn phí khắc laser cá nhân hóa trên thân lược và cán gương',
            'Hộp quà bọc lụa cao cấp chuẩn phong cách Sắc Khảm'
        ]
    },

    // Fallback keys
    'necklace': {
        title: 'Dây Chuyền Khảm Xà Cừ',
        category: 'Trang Sức Đương Đại • Bạc 925',
        price: '600.000đ',
        image: 'assets/images/sk_day_chuyen_1.jpg',
        features: [
            'Chất liệu: Bạc ý 925 cao cấp không rỉ',
            'Khảm: Xà cừ tự nhiên Chuôn Ngọ óng ánh xanh biếc',
            'Tùy chọn khắc laser: Tên, chữ ký, ngày kỷ niệm sau mặt dây',
            'Công nghệ NFC: Tích hợp vi chip lưu lời nhắn thoại / video',
            'Đóng gói: Hộp quà cao cấp Sắc Khảm kèm thiệp viết tay'
        ]
    },
    'bracelet': {
        title: 'Vòng Tay Khảm Xà Cừ',
        category: 'Vòng Tay Bạc • Khảm Xà Cừ',
        price: '543.000đ',
        image: 'assets/images/sk_vong_tay_1.jpg',
        features: [
            'Chất liệu: Bạc 925 thanh mảnh, thiết kế ôm tay duyên dáng',
            'Khảm: Cánh bướm xà cừ thủ công đa sắc',
            'Tùy chọn: Khắc tên hoặc ký hiệu riêng trên chốt khóa',
            'Tích hợp chip NFC trao gửi lời nhắn bí mật',
            'Hộp quà sang trọng chuẩn phong cách Sắc Khảm'
        ]
    },
    'ring': {
        title: 'Nhẫn Khảm Xà Cừ',
        category: 'Nhẫn Bạc • Tối Giản Sang Trọng',
        price: '433.000đ',
        image: 'assets/images/sk_nhan_0.jpg',
        features: [
            'Phong cách tối giản đương đại, dễ dàng phối trang phục',
            'Mặt nhẫn tròn khảm xà cừ tự nhiên chuyển sắc theo ánh sáng',
            'Bề mặt bạc gia công nhẵn bóng, êm ái khi đeo',
            'Khắc tên hoặc ngày kỷ niệm bên trong lòng nhẫn',
            'Bảo hành làm mới và đánh bóng trọn đời'
        ]
    },
    'comb': {
        title: 'Lược Khảm Xà Cừ',
        category: 'Phụ Kiện Cổ Phong Đương Đại',
        price: '398.000đ',
        image: 'assets/images/sk_luoc_1.jpg',
        features: [
            'Chất liệu nền sừng/nhựa cao cấp phủ sơn mài bóng mượt',
            'Họa tiết cánh bướm khảm xà cừ Chuôn Ngọ tỉ mỉ từng chi tiết',
            'Răng lược bo tròn êm dịu cho da đầu và mái tóc',
            'Hỗ trợ khắc tên laser cá nhân hóa trên thân lược',
            'Hộp quà bọc lụa hoàn mỹ làm quà tặng mẹ, vợ hoặc đối tác'
        ]
    },
    'hairpin': {
        title: 'Trâm Cài Tóc (Dáng Uốn)',
        category: 'Trâm Cài Tóc • Nghệ Thuật',
        price: '316.000đ',
        image: 'assets/images/sk_tram_0.jpg',
        features: [
            'Dáng trâm uốn lượn mềm mại lấy cảm hứng từ sóng nước',
            'Đầu trâm khảm xà cừ tự nhiên xoáy tròn lấp lánh',
            'Tôn vinh vẻ đẹp thanh lịch, đài các của phụ nữ Việt',
            'Đi kèm hộp quà cao cấp và thẻ chứng nhận làng nghề',
            'Hỗ trợ tích hợp thông điệp số'
        ]
    },
    'wood-hairpin': {
        title: 'Trâm Cài Tóc (Khảm Hoa)',
        category: 'Gỗ Mun Quý • Khảm Hoa Xà Cừ',
        price: '316.000đ',
        image: 'assets/images/sk_tram_2.jpg',
        features: [
            'Gỗ mun đen tuyền tự nhiên càng dùng càng bóng đẹp',
            'Hoa mai/đào xà cừ trắng ngà được cưa lọng chuẩn xác từng mm',
            'Chế tác thủ công 100% bởi các nghệ nhân làng Chuôn Ngọ',
            'Khắc tên kỷ niệm hoặc lời chúc ý nghĩa',
            'Bảo hành phục chế và làm mới trọn đời'
        ]
    }
};

function openQuickView(prodId) {
    const prod = productData[prodId] || productData['comb'];
    const modal = document.getElementById('quick-view-modal');
    if (!modal) return;
    if (prod) {
        const modalImg = document.getElementById('modal-img');
        const modalTitle = document.getElementById('modal-title');
        const modalBadge = document.getElementById('modal-badge');
        const modalPrice = document.getElementById('modal-price');
        const modalFeatures = document.getElementById('modal-features');
        const modalOrderBtn = document.getElementById('modal-order-btn');
        currentProdId = prodId;
        if (modalImg) modalImg.src = prod.image;
        if (modalTitle) modalTitle.textContent = prod.title;
        if (modalBadge) modalBadge.textContent = prod.category;
        if (modalPrice) modalPrice.textContent = prod.price;
        if (modalFeatures) modalFeatures.innerHTML = prod.features.map(f => `<li>${f}</li>`).join('');
        if (modalOrderBtn && (!modalOrderBtn.textContent || !modalOrderBtn.textContent.trim())) {
            modalOrderBtn.textContent = 'Thêm Vào Giỏ Hàng';
        }
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Global click delegation for .quick-view
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.quick-view');
    if (btn) {
        e.preventDefault();
        e.stopPropagation();
        const prodId = btn.getAttribute('data-product');
        openQuickView(prodId);
    }
});

const modal = document.getElementById('quick-view-modal');
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalBadge = document.getElementById('modal-badge');
const modalPrice = document.getElementById('modal-price');
const modalFeatures = document.getElementById('modal-features');
const modalOrderBtn = document.getElementById('modal-order-btn');

if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    });
}

if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ===== Cart + Checkout =====
// ⚙️ THAY URL NÀY sau khi tạo Google Apps Script (xem hướng dẫn):
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxbBuCDbgD0X8Z-_fF84dOguows3H02XtRF7-p4OlYT2Qs-aO3pIpSqgEhyPEESTEYmnA/exec';

let cart = [];
try { cart = JSON.parse(localStorage.getItem('sk-cart') || '[]'); } catch (e) { cart = []; }
let currentProdId = null;

const cartBtn = document.getElementById('cart-btn');
const cartDrawer = document.getElementById('cart-drawer');
const cartOverlay = document.getElementById('cart-overlay');
const cartClose = document.getElementById('cart-close');
const cartItemsEl = document.getElementById('cart-items');
const cartEmptyEl = document.getElementById('cart-empty');
const cartCountEl = document.getElementById('cart-count');
const cartFooter = document.getElementById('cart-footer');

// Step elements
const step1 = document.getElementById('cart-step-1');
const step2 = document.getElementById('cart-step-2');
const step3 = document.getElementById('cart-step-3');
const stepNav1 = document.getElementById('step-nav-1');
const stepNav2 = document.getElementById('step-nav-2');
const stepNav3 = document.getElementById('step-nav-3');

function saveCart() { localStorage.setItem('sk-cart', JSON.stringify(cart)); }

function showStep(n) {
    [step1, step2, step3].forEach((s, i) => {
        if (s) s.style.display = (i + 1 === n) ? 'flex' : 'none';
    });
    [stepNav1, stepNav2, stepNav3].forEach((dot, i) => {
        if (dot) dot.classList.toggle('active', i + 1 === n);
    });
}

function renderCart() {
    const total = cart.reduce((s, i) => s + i.qty, 0);
    cartCountEl.textContent = total;
    cartCountEl.classList.toggle('visible', total > 0);
    cartEmptyEl.style.display = cart.length ? 'none' : 'flex';
    if (cartFooter) cartFooter.style.display = cart.length ? 'flex' : 'none';
    cartItemsEl.innerHTML = cart.map(i => {
        const p = productData[i.id];
        if (!p) return '';
        return `<li class="cart-item">
            <img src="${p.image}" alt="${p.title}">
            <div class="cart-item-info">
                <span class="cart-item-title">${p.title}</span>
                <span class="cart-item-category">${p.category || 'Xà cừ Chuôn Ngọ'} • ${p.price || ''}</span>
            </div>
            <div class="cart-qty">
                <button data-act="dec" data-id="${i.id}" aria-label="Giảm số lượng">&minus;</button>
                <span>${i.qty}</span>
                <button data-act="inc" data-id="${i.id}" aria-label="Tăng số lượng">+</button>
            </div>
            <button class="cart-remove" data-act="rm" data-id="${i.id}" aria-label="Xóa sản phẩm">&times;</button>
        </li>`;
    }).join('');
}

function openCart() {
    showStep(1);
    cartDrawer.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeCart() {
    cartDrawer.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

if (cartBtn) cartBtn.addEventListener('click', openCart);
if (cartClose) cartClose.addEventListener('click', closeCart);
if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

// Additional close and continue buttons
const cartContinueBtn = document.getElementById('cart-continue-btn');
const emptyShopBtn = document.getElementById('empty-shop-btn');
if (cartContinueBtn) cartContinueBtn.addEventListener('click', closeCart);
if (emptyShopBtn) emptyShopBtn.addEventListener('click', closeCart);

// Escape key to close cart
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cartDrawer && cartDrawer.classList.contains('active')) {
        closeCart();
    }
});

// Close buttons on other steps
const cartClose2 = document.getElementById('cart-close-2');
const cartClose3 = document.getElementById('cart-close-3');
if (cartClose2) cartClose2.addEventListener('click', closeCart);
if (cartClose3) cartClose3.addEventListener('click', closeCart);

// Back button on step 2
const cartBackBtn = document.getElementById('cart-back-btn');
if (cartBackBtn) cartBackBtn.addEventListener('click', () => showStep(1));

// Proceed to checkout
const cartCheckoutBtn = document.getElementById('cart-checkout-btn');
if (cartCheckoutBtn) {
    cartCheckoutBtn.addEventListener('click', () => {
        if (cart.length === 0) return;
        // Render order summary with thumbnails
        const summaryEl = document.getElementById('checkout-summary');
        if (summaryEl) {
            summaryEl.innerHTML = cart.map(i => {
                const p = productData[i.id];
                if (!p) return '';
                return `<div class="checkout-summary-item">
                    <img src="${p.image}" alt="${p.title}" class="checkout-thumb">
                    <div class="checkout-item-meta">
                        <span class="checkout-item-title">${p.title}</span>
                        <span class="checkout-item-sub">${p.category || 'Xà cừ Chuôn Ngọ'}</span>
                    </div>
                    <span class="item-qty">x${i.qty}</span>
                </div>`;
            }).join('');
        }
        showStep(2);
    });
}

// Success close
const successCloseBtn = document.getElementById('success-close-btn');
if (successCloseBtn) successCloseBtn.addEventListener('click', closeCart);

if (cartItemsEl) {
    cartItemsEl.addEventListener('click', (e) => {
        const b = e.target.closest('button[data-act]');
        if (!b) return;
        const item = cart.find(i => i.id === b.dataset.id);
        if (!item) return;
        if (b.dataset.act === 'inc') item.qty++;
        if (b.dataset.act === 'dec') item.qty--;
        if (b.dataset.act === 'rm') item.qty = 0;
        cart = cart.filter(i => i.qty > 0);
        saveCart();
        renderCart();
    });
}

if (modalOrderBtn) {
    modalOrderBtn.addEventListener('click', () => {
        if (currentProdId) {
            const item = cart.find(i => i.id === currentProdId);
            if (item) item.qty++; else cart.push({ id: currentProdId, qty: 1 });
            saveCart();
            renderCart();
        }
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
        openCart();
    });
}

// ===== Checkout Form Submit → Google Sheets =====
const checkoutForm = document.getElementById('checkout-form');
if (checkoutForm) {
    checkoutForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('checkout-submit-btn');
        submitBtn.classList.add('loading');
        submitBtn.querySelector('span').textContent = 'Đang gửi...';

        // Build order items string
        const orderItems = cart.map(i => {
            const p = productData[i.id];
            return `${p ? p.title : i.id} (x${i.qty})`;
        }).join(', ');

        const formData = {
            timestamp: new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
            name: document.getElementById('co-name').value.trim(),
            phone: document.getElementById('co-phone').value.trim(),
            email: document.getElementById('co-email').value.trim(),
            address: document.getElementById('co-address').value.trim(),
            engrave: document.getElementById('co-engrave').value.trim(),
            note: document.getElementById('co-note').value.trim(),
            items: orderItems
        };

        try {
            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'text/plain' }, // text/plain mới được phép với no-cors
                body: JSON.stringify(formData)
            });
            console.log('✅ Đơn hàng đã gửi lên Google Sheet');
        } catch (err) {
            console.warn('⚠️ Fetch error:', err.message);
        }

        // Hiện success
        const successMsg = document.getElementById('success-name-msg');
        if (successMsg) {
            successMsg.textContent = `${formData.name} ơi, Sắc Khảm đã nhận được đơn hàng và sẽ liên hệ xác nhận qua ${formData.phone} trong vòng 30 phút!`;
        }

        // Clear cart
        cart = [];
        saveCart();
        renderCart();
        checkoutForm.reset();
        submitBtn.classList.remove('loading');
        submitBtn.querySelector('span').textContent = 'Xác Nhận Đặt Hàng';
        showStep(3);
    });
}

renderCart();

