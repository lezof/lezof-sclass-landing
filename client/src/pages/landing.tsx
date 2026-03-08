import { useState, useCallback } from "react";
import {
  type EngineKey,
  type Mileage,
  type DueStatus,
  engines,
  mileageStops,
  getServiceType,
  periodicPrices,
  majorMilestones,
  isMajorMilestone,
  getMajorPrice,
  getPeriodicPrice,
  getAgencyPrice,
  formatPrice,
  buildBookingUrl,
  dueTableData,
  renderDueStatus,
} from "@/lib/pricing-data";
import { ChevronDown, Check, Phone, MessageCircle, Menu, X as XIcon } from "lucide-react";
import lezofLogoEn from "@assets/IMG_7321_1772333194588.JPG";
import lezofLogoAr from "@assets/IMG_7320_1772333194588.JPG";
import lezofIcon from "@assets/IMG_7319_1772333194588.JPG";
import sClassFront from "@assets/Front_S-Klasse.png.1720x1720_q95_1772333199477.png";
import mercedesLogoDark from "@assets/IMG_7325_1772333194589.JPG";

const WHATSAPP_LINK = "https://wa.me/966500000000";
const PHONE_NUMBER = "tel:+966500000000";

function scrollToSelector() {
  document.getElementById("selector")?.scrollIntoView({ behavior: "smooth" });
}

function DueStatusCell({ status }: { status: DueStatus }) {
  const { text, color } = renderDueStatus(status);
  if (status === "not_included") {
    return <span style={{ color }}>—</span>;
  }
  if (status === "included") {
    return (
      <span className="inline-flex items-center gap-1 text-xs" style={{ color }}>
        <Check size={12} />
      </span>
    );
  }
  if (status === "vin_check") {
    return <span className="text-xs" style={{ color }}>&#9723;</span>;
  }
  return <span className="text-xs" style={{ color }}>&#11088;</span>;
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div
        className="w-full py-2 px-4 text-center text-xs md:text-sm"
        style={{ backgroundColor: "var(--lz-surface-1)", color: "var(--lz-text-3)", borderBottom: "1px solid var(--lz-border)" }}
        data-testid="text-top-bar"
      >
        الرياض | تسليم في نفس اليوم (حسب الموعد) | حجز سريع خلال دقيقة
      </div>

      <header
        className="sticky top-0 z-40 w-full"
        style={{ backgroundColor: "rgba(11,11,12,0.92)", backdropFilter: "blur(16px)", borderBottom: "1px solid var(--lz-border)" }}
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img src={lezofIcon} alt="LEZOF" className="w-8 h-8 rounded" data-testid="img-logo-icon" />
            <img src={lezofLogoEn} alt="LEZOF" className="h-5 hidden md:block" data-testid="img-logo-en" />
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm" style={{ color: "var(--lz-text-2)" }}>
            <a href="#pricing" className="transition-colors hover:text-white" data-testid="link-pricing">الأسعار</a>
            <a href="#solution" className="transition-colors hover:text-white" data-testid="link-how">كيف يعمل البرنامج؟</a>
            <a href="#trust" className="transition-colors hover:text-white" data-testid="link-why">لماذا لزوف؟</a>
            <a href="#faq" className="transition-colors hover:text-white" data-testid="link-faq">الأسئلة الشائعة</a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 text-xs transition-colors hover:text-white"
              style={{ color: "var(--lz-text-3)" }}
              data-testid="link-whatsapp-header"
            >
              <MessageCircle size={14} />
              واتساب
            </a>
            <a
              href={PHONE_NUMBER}
              className="hidden md:flex items-center gap-1.5 text-xs transition-colors hover:text-white"
              style={{ color: "var(--lz-text-3)" }}
              data-testid="link-phone-header"
            >
              <Phone size={14} />
              اتصال سريع
            </a>
            <button
              onClick={scrollToSelector}
              className="text-sm font-medium px-4 py-2 rounded-md transition-colors"
              style={{ backgroundColor: "var(--lz-accent)", color: "#fff" }}
              data-testid="button-book-header"
            >
              احجز الآن
            </button>
            <button
              className="md:hidden p-2"
              onClick={() => setMenuOpen(!menuOpen)}
              data-testid="button-mobile-menu"
            >
              {menuOpen ? <XIcon size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden px-4 pb-4 flex flex-col gap-3 text-sm" style={{ color: "var(--lz-text-2)" }}>
            <a href="#pricing" onClick={() => setMenuOpen(false)} data-testid="link-pricing-mobile">الأسعار</a>
            <a href="#solution" onClick={() => setMenuOpen(false)} data-testid="link-how-mobile">كيف يعمل البرنامج؟</a>
            <a href="#trust" onClick={() => setMenuOpen(false)} data-testid="link-why-mobile">لماذا لزوف؟</a>
            <a href="#faq" onClick={() => setMenuOpen(false)} data-testid="link-faq-mobile">الأسئلة الشائعة</a>
            <div className="flex items-center gap-4 pt-2" style={{ borderTop: "1px solid var(--lz-border)" }}>
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs" data-testid="link-whatsapp-mobile">
                <MessageCircle size={14} /> واتساب
              </a>
              <a href={PHONE_NUMBER} className="flex items-center gap-1.5 text-xs" data-testid="link-phone-mobile">
                <Phone size={14} /> اتصال سريع
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden" style={{ minHeight: "85vh" }}>
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 30% 40%, rgba(239,65,54,0.06) 0%, transparent 70%),
                          radial-gradient(ellipse 60% 50% at 80% 60%, rgba(141,146,148,0.04) 0%, transparent 70%)`,
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 pt-16 md:pt-24 pb-16">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="flex-1 text-center md:text-right">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-6">
              <img src={mercedesLogoDark} alt="Mercedes" className="w-10 h-10 md:w-12 md:h-12 rounded-full" data-testid="img-mercedes-logo" />
              <span className="text-xs font-medium px-3 py-1 rounded-full" style={{ backgroundColor: "var(--lz-surface-2)", color: "var(--lz-text-3)", border: "1px solid var(--lz-border)" }}>
                S-Class 2020–2025
              </span>
            </div>

            <h1
              className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
              style={{ color: "var(--lz-text)" }}
              data-testid="text-hero-title"
            >
              صيانة S-Class…
              <br />
              <span style={{ color: "var(--lz-chrome-1)" }}>بوضوح يليق بها.</span>
            </h1>

            <p
              className="text-base md:text-lg leading-relaxed mb-6 max-w-xl mx-auto md:mx-0"
              style={{ color: "var(--lz-text-2)" }}
              data-testid="text-hero-subtitle"
            >
              برنامج صيانة احترافي لمرسيدس S-Class (موديلات 2020–2025) في الرياض — تطبيق كامل لجدول المصنع، وتغيير المستحق فقط، مع استلام وتسليم في نفس اليوم (حسب الموعد).
            </p>

            <div className="mb-4">
              <p className="text-lg md:text-xl font-semibold" style={{ color: "var(--lz-text)" }} data-testid="text-price-anchor">
                الصيانة الدورية تبدأ من: <span style={{ color: "var(--lz-accent)" }}>3,060 ريال</span> (شامل VAT)
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--lz-text-3)" }}>
                مرجعية الوكالة للصيانة القياسية: <span className="line-through">3,600 ريال</span> (15 ألف/سنة – 6 سلندر)
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 mb-4 justify-center md:justify-start">
              <button
                onClick={scrollToSelector}
                className="w-full sm:w-auto text-base font-semibold px-8 py-3.5 rounded-lg transition-all"
                style={{ backgroundColor: "var(--lz-accent)", color: "#fff" }}
                data-testid="button-hero-cta"
              >
                احجز موعدك الآن
              </button>
              <button
                onClick={scrollToSelector}
                className="w-full sm:w-auto text-sm px-6 py-3 rounded-lg transition-all"
                style={{ border: "1px solid var(--lz-chrome-3)", color: "var(--lz-text)" }}
                data-testid="button-hero-secondary"
              >
                اعرف خدمتك القادمة خلال 20 ثانية
              </button>
            </div>

            <p className="text-xs mb-6" style={{ color: "var(--lz-text-3)" }}>
              تأكيد الموعد عبر صفحة الحجز خلال دقائق — وأولوية لمواعيد التسليم في نفس اليوم.
            </p>

            <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
              {["جدول المصنع", "تغيير المستحق فقط", "موافقة قبل التنفيذ", "تقرير واضح بعد الخدمة"].map((badge) => (
                <span
                  key={badge}
                  className="text-xs px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: "var(--lz-surface-2)", color: "var(--lz-chrome-2)", border: "1px solid var(--lz-border)" }}
                  data-testid={`badge-${badge}`}
                >
                  {badge}
                </span>
              ))}
            </div>

            <p className="text-xs" style={{ color: "var(--lz-text-3)" }}>
              اختر المحرك + ممشى السيارة… وستظهر لك باقتان فقط ثم تنتقل للحجز مباشرة.
            </p>
          </div>

          <div className="flex-1 flex justify-center md:justify-end">
            <div className="relative">
              <div
                className="absolute -inset-8 rounded-full blur-3xl opacity-20"
                style={{ background: "radial-gradient(circle, var(--lz-chrome-3), transparent)" }}
              />
              <img
                src={sClassFront}
                alt="Mercedes S-Class"
                className="relative z-10 w-full max-w-lg"
                style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.5))" }}
                data-testid="img-hero-car"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProblemSection() {
  return (
    <section className="py-16 md:py-24 px-4" id="problem">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl md:text-4xl font-bold mb-6" style={{ color: "var(--lz-text)" }} data-testid="text-problem-title">
          القرار ليس: هل أُصين؟ … القرار هو: هل الفاتورة واضحة؟
        </h2>
        <p className="text-base md:text-lg leading-relaxed mb-8" style={{ color: "var(--lz-text-2)" }} data-testid="text-problem-body">
          مالك S-Class عادةً لا يرفض الصيانة. هو يرفض الغموض: بنود غير مفهومة، تكرار غير مبرر، وأرقام يصعب تفسيرها.
          <br />
          في النهاية… السيارة تستحق صيانة منتظمة، لكنك تستحق شفافية واحترام للجدول.
        </p>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {[
            "صدمة أسعار الوكالة عند كل استحقاق — بدون طريقة سهلة لفهم (ليش؟)",
            "بنود تُجمع أو تتكرر بدون توضيح (مستحق/غير مستحق)",
            "بعض الورش تغيّر (للاحتياط) بدل الالتزام بالاستحقاق",
          ].map((text, i) => (
            <div
              key={i}
              className="p-5 rounded-lg text-sm text-right"
              style={{ backgroundColor: "var(--lz-surface-1)", border: "1px solid var(--lz-border)", color: "var(--lz-text-2)" }}
              data-testid={`card-problem-${i}`}
            >
              {text}
            </div>
          ))}
        </div>

        <button
          onClick={scrollToSelector}
          className="text-sm font-medium px-6 py-3 rounded-lg transition-colors"
          style={{ backgroundColor: "var(--lz-accent)", color: "#fff" }}
          data-testid="button-problem-cta"
        >
          شوف السعر حسب محركك الآن
        </button>
      </div>
    </section>
  );
}

function SolutionSection() {
  const cards = [
    { title: "انضباط", text: "نفس فلسفة المصنع… بدون اجتهادات." },
    { title: "تحكم", text: "أي بند إضافي يظهر لك مسبقًا — وتوافق عليه قبل التنفيذ." },
    { title: "شفافية", text: "مشمول / غير مشمول / يُؤكَّد بالـVIN… مكتوبة بوضوح." },
    { title: "سرعة", text: "استلام وتسليم في نفس اليوم (حسب الموعد)." },
  ];

  return (
    <section className="py-16 md:py-24 px-4" id="solution">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-bold mb-4" style={{ color: "var(--lz-text)" }} data-testid="text-solution-title">
            حل لزوف: برنامج صيانة مُدار… وليس زيارة ورشة.
          </h2>
          <p className="text-base md:text-lg" style={{ color: "var(--lz-text-2)" }} data-testid="text-solution-body">
            في لزوف، صيانة S-Class تُدار كبرنامج واضح:
            <br />
            نطبق جدول المصنع كما هو — ونغيّر فقط ما هو مستحق — ونعطيك تقريرًا مفهومًا.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {cards.map((card, i) => (
            <div
              key={i}
              className="lz-corner-triangle p-6 rounded-lg"
              style={{ backgroundColor: "var(--lz-surface-1)", border: "1px solid var(--lz-border)" }}
              data-testid={`card-solution-${i}`}
            >
              <h3 className="text-lg font-bold mb-2" style={{ color: "var(--lz-text)" }}>{card.title}</h3>
              <p className="text-sm" style={{ color: "var(--lz-text-2)" }}>{card.text}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={scrollToSelector}
            className="text-sm font-medium px-6 py-3 rounded-lg transition-colors"
            style={{ backgroundColor: "var(--lz-accent)", color: "#fff" }}
            data-testid="button-solution-cta"
          >
            ابدأ الاختيار
          </button>
        </div>
      </div>
    </section>
  );
}

function InteractiveSelector({
  selectedEngine,
  setSelectedEngine,
  selectedMileage,
  setSelectedMileage,
  selectedPackage,
  setSelectedPackage,
}: {
  selectedEngine: EngineKey;
  setSelectedEngine: (e: EngineKey) => void;
  selectedMileage: Mileage;
  setSelectedMileage: (m: Mileage) => void;
  selectedPackage: "PERIODIC" | "MAJOR" | null;
  setSelectedPackage: (p: "PERIODIC" | "MAJOR" | null) => void;
}) {
  const serviceType = getServiceType(selectedMileage);
  const periodicPrice = getPeriodicPrice(selectedEngine, selectedMileage);
  const agencyPrice = getAgencyPrice(selectedEngine, selectedMileage);
  const isMajor = isMajorMilestone(selectedEngine, selectedMileage);
  const majorPrice = getMajorPrice(selectedEngine, selectedMileage);
  const engineMajorMilestones = majorMilestones[selectedEngine];
  const mileageIndex = mileageStops.indexOf(selectedMileage);

  const handleBooking = useCallback(() => {
    if (!selectedPackage) return;
    const price = selectedPackage === "PERIODIC" ? periodicPrice : majorPrice?.price || 0;
    const url = buildBookingUrl({
      engine: selectedEngine,
      mileage: selectedMileage,
      serviceType,
      packageType: selectedPackage,
      price,
    });
    window.open(url, "_blank");
  }, [selectedEngine, selectedMileage, selectedPackage, periodicPrice, majorPrice, serviceType]);

  return (
    <section className="py-16 md:py-24 px-4" id="selector">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: "var(--lz-text)" }} data-testid="text-selector-title">
            اختر محركك… وحدد ممشى سيارتك… والسعر يظهر فورًا.
          </h2>
        </div>

        <div
          className="p-6 md:p-8 rounded-xl mb-6"
          style={{ backgroundColor: "var(--lz-surface-1)", border: "1px solid var(--lz-border)" }}
        >
          <div className="mb-8">
            <p className="text-sm font-semibold mb-4" style={{ color: "var(--lz-text)" }}>
              1) اختر المحرك
            </p>
            <div className="flex flex-wrap gap-2">
              {engines.map((eng) => (
                <button
                  key={eng.key}
                  onClick={() => { setSelectedEngine(eng.key); setSelectedPackage(null); }}
                  className="px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
                  style={
                    selectedEngine === eng.key
                      ? { backgroundColor: "var(--lz-accent)", color: "#fff" }
                      : { backgroundColor: "var(--lz-surface-2)", color: "var(--lz-text-2)", border: "1px solid var(--lz-border)" }
                  }
                  data-testid={`button-engine-${eng.key}`}
                >
                  {eng.label}
                </button>
              ))}
            </div>
            <p className="text-xs mt-3" style={{ color: "var(--lz-text-3)" }}>
              غير متأكد من المحرك؟ اكتب رقم الشاصي (VIN) في صفحة الحجز وسنؤكد لك كل شيء قبل التنفيذ.
            </p>
          </div>

          <div className="mb-8">
            <p className="text-sm font-semibold mb-4" style={{ color: "var(--lz-text)" }}>
              2) كم ممشى سيارتك الآن؟
            </p>
            <p className="text-xs mb-4" style={{ color: "var(--lz-text-3)" }}>
              ممشى السيارة (اختر أقرب رقم):
            </p>

            <div className="slider-custom mb-3">
              <input
                type="range"
                min={0}
                max={mileageStops.length - 1}
                value={mileageIndex}
                onChange={(e) => {
                  setSelectedMileage(mileageStops[parseInt(e.target.value)] as Mileage);
                  setSelectedPackage(null);
                }}
                className="w-full"
                data-testid="input-mileage-slider"
              />
            </div>

            <div className="flex justify-between text-xs flex-wrap gap-y-1" style={{ color: "var(--lz-text-3)", direction: "ltr" }}>
              {mileageStops.map((m) => (
                <button
                  key={m}
                  onClick={() => { setSelectedMileage(m); setSelectedPackage(null); }}
                  className={`transition-colors ${m === selectedMileage ? "font-bold" : ""}`}
                  style={{ color: m === selectedMileage ? "var(--lz-accent)" : "var(--lz-text-3)" }}
                  data-testid={`button-mileage-${m}`}
                >
                  {m >= 1000 ? `${m / 1000}K` : m}
                </button>
              ))}
            </div>

            <p className="text-xs mt-3" style={{ color: "var(--lz-text-3)" }}>
              حتى لو كان ممشى سيارتك بين رقمين، اختر الأقرب — وسنؤكد الاستحقاق النهائي حسب VIN.
            </p>
          </div>

          <div
            className="text-center py-2 px-4 rounded-md mb-2 text-sm"
            style={{ backgroundColor: "var(--lz-surface-2)", color: "var(--lz-chrome-2)" }}
            data-testid="text-service-type"
          >
            الخدمة الدورية القادمة عادةً: Service {serviceType}
          </div>

          <div
            className="text-center py-2.5 px-4 rounded-md mb-6 text-sm font-medium"
            style={{
              backgroundColor: isMajor ? "rgba(239,65,54,0.1)" : "rgba(34,197,94,0.1)",
              color: isMajor ? "var(--lz-accent)" : "#22c55e",
              border: `1px solid ${isMajor ? "rgba(239,65,54,0.2)" : "rgba(34,197,94,0.2)"}`,
            }}
            data-testid="text-visit-classification"
          >
            {isMajor
              ? "هذه الزيارة تتضمن بنودًا ثقيلة وتدخل ضمن الصيانة الشاملة."
              : "هذه الزيارة ضمن الصيانة الدورية."}
          </div>

          <p className="text-sm font-semibold mb-4 text-center" style={{ color: "var(--lz-text)" }}>
            اختر باقة واحدة:
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div
              className={`lz-corner-triangle p-5 rounded-lg cursor-pointer transition-all ${selectedPackage === "PERIODIC" ? "ring-2" : ""}`}
              style={{
                backgroundColor: "var(--lz-surface-2)",
                border: selectedPackage === "PERIODIC" ? "2px solid var(--lz-accent)" : "1px solid var(--lz-border)",
                ringColor: "var(--lz-accent)",
              }}
              onClick={() => setSelectedPackage("PERIODIC")}
              data-testid="card-periodic"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="w-3 h-3 rounded-full bg-green-500" />
                <h3 className="text-base font-bold" style={{ color: "var(--lz-text)" }}>
                  الصيانة الدورية (Service A / Service B)
                </h3>
              </div>
              <p className="text-xs mb-3" style={{ color: "var(--lz-text-3)" }}>
                مناسبة لكل 15,000 كم / سنة.
              </p>

              <div className="mb-3">
                <p className="text-lg font-bold" style={{ color: "var(--lz-text)" }} data-testid="text-periodic-price">
                  Service {serviceType}: {formatPrice(periodicPrice)} ريال <span className="text-xs font-normal" style={{ color: "var(--lz-text-3)" }}>(شامل VAT)</span>
                </p>
                {agencyPrice && (
                  <p className="text-xs mt-1" style={{ color: "var(--lz-text-3)" }}>
                    مرجعية الوكالة: <span className="line-through">{formatPrice(agencyPrice)} ريال</span>
                  </p>
                )}
              </div>

              <ul className="space-y-1.5 text-sm mb-3" style={{ color: "var(--lz-text-2)" }}>
                <li className="flex items-start gap-2">
                  <span style={{ color: "#22c55e" }} className="text-xs mt-0.5 flex-shrink-0">&#10003;</span>
                  تغيير زيت المحرك + فلتر — مشمول
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: "#22c55e" }} className="text-xs mt-0.5 flex-shrink-0">&#10003;</span>
                  فلتر الهواء — مشمول
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: "#22c55e" }} className="text-xs mt-0.5 flex-shrink-0">&#10003;</span>
                  فحص شامل + ضبط الخدمة — مشمول
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: "var(--lz-chrome-2)" }} className="text-xs mt-0.5 flex-shrink-0">&#9723;</span>
                  فلتر المكيف، زيت الفرامل، تعقيم التكييف — ضمن Service B عند الاستحقاق (يُؤكَّد بالـVIN)
                </li>
              </ul>
              <p className="text-xs mb-4 leading-relaxed" style={{ color: "var(--lz-text-3)" }}>
                تتضمن Service B البنود الزمنية مثل فلتر المكيف، زيت الفرامل، وتنظيف نظام التكييف — ويتم تأكيد الاستحقاق برقم الشاصي (VIN) قبل التنفيذ.
              </p>

              <button
                onClick={(e) => { e.stopPropagation(); setSelectedPackage("PERIODIC"); }}
                className="w-full py-2.5 rounded-md text-sm font-medium transition-colors"
                style={
                  selectedPackage === "PERIODIC"
                    ? { backgroundColor: "var(--lz-accent)", color: "#fff" }
                    : { border: "1px solid var(--lz-chrome-3)", color: "var(--lz-text)" }
                }
                data-testid="button-select-periodic"
              >
                {selectedPackage === "PERIODIC" ? "تم الاختيار" : "اختر الصيانة الدورية"}
              </button>
            </div>

            <div
              className={`lz-corner-triangle p-5 rounded-lg cursor-pointer transition-all ${selectedPackage === "MAJOR" ? "ring-2" : ""}`}
              style={{
                backgroundColor: "var(--lz-surface-2)",
                border: selectedPackage === "MAJOR" ? "2px solid var(--lz-accent)" : "1px solid var(--lz-border)",
                ringColor: "var(--lz-accent)",
              }}
              onClick={() => setSelectedPackage("MAJOR")}
              data-testid="card-major"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <h3 className="text-base font-bold" style={{ color: "var(--lz-text)" }}>
                  الصيانة الشاملة (Major Service)
                </h3>
              </div>
              <p className="text-xs mb-3" style={{ color: "var(--lz-text-3)" }}>
                مناسبة عند الاستحقاقات الثقيلة (حسب الممشى/VIN).
              </p>

              {isMajor ? (
                <div className="mb-3">
                  <p className="text-xs mb-2 px-2 py-1 rounded inline-block" style={{ backgroundColor: "rgba(239,65,54,0.15)", color: "var(--lz-accent)" }}>
                    مناسبة لهذا الاستحقاق — لأن بعض البنود الثقيلة تكون مستحقة هنا.
                  </p>
                  {majorPrice && !majorPrice.isUnpriced ? (
                    <p className="text-lg font-bold mt-2" style={{ color: "var(--lz-text)" }} data-testid="text-major-price">
                      {formatPrice(majorPrice.price)} ريال <span className="text-xs font-normal" style={{ color: "var(--lz-text-3)" }}>(شامل VAT)</span>
                      {majorPrice.isPreliminary && (
                        <span className="block text-xs font-normal mt-1" style={{ color: "var(--lz-text-3)" }}>
                          (سعر مبدئي — يُثبت حسب VIN)
                        </span>
                      )}
                    </p>
                  ) : (
                    <p className="text-sm mt-2" style={{ color: "var(--lz-text-3)" }} data-testid="text-major-price">
                      غير مسعّرة حاليًا — يُثبت حسب VIN
                    </p>
                  )}
                </div>
              ) : (
                <div className="mb-3">
                  <p className="text-xs mb-3 px-2 py-1 rounded inline-block" style={{ backgroundColor: "var(--lz-surface-1)", color: "var(--lz-text-3)" }}>
                    غير مطلوبة الآن — سنوصي بها عند الاستحقاق فقط.
                  </p>
                </div>
              )}

              <div className="mb-4">
                <p className="text-xs mb-2 font-medium" style={{ color: "var(--lz-text-3)" }}>
                  الاستحقاقات الشائعة للشاملة (حسب محركك):
                </p>
                <div className="space-y-1">
                  {engineMajorMilestones.map((ms) => (
                    <div
                      key={ms.mileage}
                      className="flex items-center justify-between text-sm px-2 py-1 rounded"
                      style={{
                        backgroundColor: ms.mileage === selectedMileage && isMajor ? "rgba(239,65,54,0.1)" : "transparent",
                        color: ms.mileage === selectedMileage && isMajor ? "var(--lz-text)" : "var(--lz-text-3)",
                      }}
                    >
                      <span>{formatPrice(ms.mileage)} كم</span>
                      <span className="font-medium">
                        {ms.isUnpriced ? (
                          <span className="text-xs">يُثبت حسب VIN</span>
                        ) : (
                          <>
                            {formatPrice(ms.price)} ريال
                            {ms.isPreliminary && <span className="text-xs mr-1">(مبدئي)</span>}
                          </>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); setSelectedPackage("MAJOR"); }}
                className="w-full py-2.5 rounded-md text-sm font-medium transition-colors"
                style={
                  selectedPackage === "MAJOR"
                    ? { backgroundColor: "var(--lz-accent)", color: "#fff" }
                    : { border: "1px solid var(--lz-chrome-3)", color: "var(--lz-text)" }
                }
                data-testid="button-select-major"
              >
                {selectedPackage === "MAJOR" ? "تم الاختيار" : "اختر الصيانة الشاملة"}
              </button>
            </div>
          </div>

          {selectedPackage && (
            <div className="text-center animate-fade-in-up">
              <button
                onClick={handleBooking}
                className="text-base font-bold px-10 py-4 rounded-lg transition-all"
                style={{ backgroundColor: "var(--lz-accent)", color: "#fff", boxShadow: "0 4px 24px rgba(239,65,54,0.3)" }}
                data-testid="button-proceed-booking"
              >
                تابع للحجز
              </button>
              <p className="text-xs mt-3" style={{ color: "var(--lz-text-3)" }}>
                سيتم نقلك إلى صفحة الحجز مع تمرير اختيارك تلقائيًا.
              </p>
            </div>
          )}
        </div>

        <p className="text-xs text-center mt-4 mb-2" style={{ color: "var(--lz-text-3)" }} data-testid="text-vin-disclaimer">
          يتم تأكيد الاستحقاق النهائي حسب رقم الشاصي (VIN) لأن بعض البنود تختلف حسب 4Matic/AMG/Hybrid والتجهيزات.
        </p>
        <p className="text-xs text-center" style={{ color: "var(--lz-text-3)" }}>
          لا يتم تنفيذ أي بند إضافي إلا بعد تأكيد الاستحقاق برقم الشاصي (VIN) وموافقتك قبل التنفيذ.
        </p>
      </div>
    </section>
  );
}

function DueTableSection() {
  const [activeTab, setActiveTab] = useState<EngineKey>("STD_6");
  const [isOpen, setIsOpen] = useState(false);

  const tabLabels: Record<EngineKey, string> = {
    STD_6: "S-Class 6cyl",
    STD_8: "S-Class 8cyl",
    S63_AMG: "S63 AMG",
  };

  const columns = ["KM", "A/B", "فلتر مكيف", "زيت فرامل", "بواجي", "زيت قير", "دفرنس", "تبريد", "تصنيف الزيارة"];
  const rows = dueTableData[activeTab];

  return (
    <section className="py-16 md:py-24 px-4" id="due-table">
      <div className="max-w-5xl mx-auto">
        <div
          className="rounded-xl overflow-hidden"
          style={{ backgroundColor: "var(--lz-surface-1)", border: "1px solid var(--lz-border)" }}
        >
          <button
            className="w-full flex items-center justify-between p-5 md:p-6 text-right"
            onClick={() => setIsOpen(!isOpen)}
            data-testid="button-due-table-accordion"
          >
            <span className="text-lg md:text-xl font-bold" style={{ color: "var(--lz-text)" }}>
              تفاصيل الاستحقاقات (لمن يحب التفاصيل)
            </span>
            <ChevronDown
              size={22}
              className="flex-shrink-0 mr-3 transition-transform"
              style={{ color: "var(--lz-text-3)", transform: isOpen ? "rotate(180deg)" : "rotate(0)" }}
            />
          </button>

          {isOpen && (
            <div className="px-4 md:px-6 pb-6">
              <div className="flex flex-wrap gap-2 mb-6 justify-center">
                {(Object.keys(tabLabels) as EngineKey[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                    style={
                      activeTab === key
                        ? { backgroundColor: "var(--lz-accent)", color: "#fff" }
                        : { backgroundColor: "var(--lz-surface-2)", color: "var(--lz-text-2)", border: "1px solid var(--lz-border)" }
                    }
                    data-testid={`button-due-tab-${key}`}
                  >
                    {tabLabels[key]}
                  </button>
                ))}
              </div>

              <div
                className="rounded-lg overflow-hidden mb-4"
                style={{ border: "1px solid var(--lz-border)" }}
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-sm" data-testid="table-due">
                    <thead>
                      <tr style={{ backgroundColor: "var(--lz-surface-2)" }}>
                        {columns.map((col, i) => (
                          <th
                            key={i}
                            className={`px-3 py-3 font-semibold whitespace-nowrap ${i === 0 || i === columns.length - 1 ? "text-right" : "text-center"}`}
                            style={{ color: "var(--lz-text-2)", fontSize: "0.75rem" }}
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, i) => {
                        const isMajorRow = row.classification.includes("شاملة");
                        return (
                          <tr
                            key={i}
                            style={{
                              backgroundColor: i % 2 === 0 ? "var(--lz-surface-1)" : "var(--lz-surface-2)",
                              borderTop: "1px solid var(--lz-border)",
                            }}
                          >
                            <td className="px-3 py-2.5 font-medium whitespace-nowrap" style={{ color: "var(--lz-text)", direction: "ltr", textAlign: "center" }}>{row.km}</td>
                            <td className="px-3 py-2.5 text-center" style={{ color: "var(--lz-text-2)" }}>{row.ab}</td>
                            <td className="px-3 py-2.5 text-center"><DueStatusCell status={row.cabinFilter} /></td>
                            <td className="px-3 py-2.5 text-center"><DueStatusCell status={row.brakeFluid} /></td>
                            <td className="px-3 py-2.5 text-center"><DueStatusCell status={row.sparkPlugs} /></td>
                            <td className="px-3 py-2.5 text-center"><DueStatusCell status={row.gearboxOil} /></td>
                            <td className="px-3 py-2.5 text-center"><DueStatusCell status={row.differential} /></td>
                            <td className="px-3 py-2.5 text-center"><DueStatusCell status={row.coolant} /></td>
                            <td className="px-3 py-2.5 text-right whitespace-nowrap">
                              <span
                                className="text-xs font-medium px-2 py-1 rounded"
                                style={{
                                  backgroundColor: isMajorRow ? "rgba(239,65,54,0.12)" : "rgba(34,197,94,0.12)",
                                  color: isMajorRow ? "var(--lz-accent)" : "#22c55e",
                                }}
                              >
                                {row.classification}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-lg p-4 mb-4" style={{ backgroundColor: "var(--lz-surface-2)", border: "1px solid var(--lz-border)" }}>
                <p className="text-xs leading-relaxed" style={{ color: "var(--lz-text-3)" }}>
                  <span className="font-semibold" style={{ color: "var(--lz-text-2)" }}>تفسير سريع:</span>{" "}
                  <span style={{ color: "#22c55e" }}>&#10003; مشمول</span> دائمًا —{" "}
                  <span style={{ color: "var(--lz-chrome-2)" }}>&#9723; ضمن Service B عند الاستحقاق</span> (يُؤكَّد بالـVIN) —{" "}
                  <span style={{ color: "#f59e0b" }}>&#11088; يُنفّذ ضمن الصيانة الشاملة</span> عند محطات 60k/90k/120k —{" "}
                  <span style={{ color: "var(--lz-text-3)" }}>— غير مشمول</span>
                </p>
              </div>

              <p className="text-xs text-center" style={{ color: "var(--lz-text-3)" }} data-testid="text-due-table-note">
                ملاحظة: الاستحقاق النهائي يُؤكَّد حسب رقم الشاصي (VIN) لأن بعض البنود تختلف حسب 4Matic/AMG/Hybrid والتجهيزات.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  const blocks = [
    {
      heading: "S-Class Standard 6-Cylinder",
      buttonText: "احجز 6 سلندر",
      periodic: { a: { price: 3060, agency: 3600 }, b: { price: 4340, agency: 5100 } },
      major: [
        { km: "60,000", price: 9070, agency: 10300 },
        { km: "90,000", price: 6870, agency: 7800 },
        { km: "150,000", price: 6720, agency: null, note: "(سعر مبدئي — يُثبت حسب VIN)" },
      ],
    },
    {
      heading: "S-Class Standard 8-Cylinder",
      buttonText: "احجز 8 سلندر",
      periodic: { a: { price: 3320, agency: 3900 }, b: { price: 4590, agency: 5400 } },
      major: [
        { km: "60,000", price: 9160, agency: 10400 },
        { km: "90,000", price: 7310, agency: 8300 },
        { km: "150,000", price: 6820, agency: null, note: "(سعر مبدئي — يُثبت حسب VIN)" },
      ],
    },
    {
      heading: "S63 AMG",
      buttonText: "احجز S63 AMG",
      periodic: { a: { price: 5990, agency: 6800 }, b: { price: 7000, agency: 7950 } },
      major: [
        { km: "45,000", price: 8910, agency: 9900 },
        { km: "60,000", price: 11880, agency: 13200 },
        { km: "90,000", price: 10350, agency: 11500 },
        { km: "150,000", price: 7310, agency: null, note: "(سعر مبدئي — يُثبت حسب VIN)" },
      ],
    },
  ];

  const comparisonRows = [
    { item: "زيت المحرك + فلتر", periodic: "مشمول", major: "مشمول" },
    { item: "فلتر الهواء", periodic: "مشمول", major: "مشمول" },
    { item: "فحص شامل + ضبط الخدمة", periodic: "مشمول", major: "مشمول" },
    { item: "فلتر المكيف/الكربون", periodic: "ضمن Service B عند الاستحقاق (يُؤكَّد بالـVIN)", major: "يُنفّذ ضمن الصيانة الشاملة عند محطات 60k/90k/120k" },
    { item: "زيت الفرامل", periodic: "ضمن Service B عند الاستحقاق (يُؤكَّد بالـVIN)", major: "يُنفّذ ضمن الصيانة الشاملة عند محطات 60k/90k/120k" },
    { item: "تعقيم/تنظيف نظام التكييف", periodic: "ضمن Service B عند الاستحقاق (يُؤكَّد بالـVIN)", major: "يُنفّذ ضمن الصيانة الشاملة عند محطات 60k/90k/120k" },
    { item: "البواجي", periodic: "غير مشمول", major: "يُنفّذ ضمن الصيانة الشاملة عند محطات 60k/90k/120k" },
    { item: "زيت القير + فلتر", periodic: "غير مشمول", major: "يُنفّذ ضمن الصيانة الشاملة عند محطات 60k/90k/120k" },
    { item: "زيوت/سوائل المحاور والدفرنس", periodic: "غير مشمول", major: "يُنفّذ ضمن الصيانة الشاملة عند محطات 60k/90k/120k" },
    { item: "سائل التبريد", periodic: "غير مشمول", major: "يُنفّذ ضمن الصيانة الشاملة عند محطات 60k/90k/120k" },
    { item: "تقرير مفصل + توثيق", periodic: "مشمول", major: "مشمول" },
  ];

  function renderCellStatus(value: string) {
    if (value === "مشمول") {
      return <span className="inline-flex items-center gap-1 text-xs" style={{ color: "#22c55e" }}>&#10003; مشمول</span>;
    }
    if (value === "غير مشمول") {
      return <span className="text-xs" style={{ color: "var(--lz-text-3)" }}>— غير مشمول</span>;
    }
    if (value.startsWith("ضمن Service B")) {
      return <span className="text-xs" style={{ color: "var(--lz-chrome-2)" }}>&#9723; {value}</span>;
    }
    if (value.startsWith("يُنفّذ")) {
      return <span className="text-xs" style={{ color: "#f59e0b" }}>&#11088; {value}</span>;
    }
    return <span className="text-xs" style={{ color: "var(--lz-text-3)" }}>{value}</span>;
  }

  return (
    <section className="py-16 md:py-24 px-4" id="pricing">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-bold mb-3" style={{ color: "var(--lz-text)" }} data-testid="text-pricing-title">
            باقتان فقط. لأن الوضوح هو الفخامة.
          </h2>
          <p className="text-sm md:text-base" style={{ color: "var(--lz-text-2)" }}>
            اختر الدورية للانضباط السنوي… واختر الشاملة عندما تكون البنود الثقيلة مستحقة.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-12">
          {blocks.map((block, idx) => (
            <div
              key={idx}
              className="lz-corner-triangle p-6 rounded-lg"
              style={{ backgroundColor: "var(--lz-surface-1)", border: "1px solid var(--lz-border)" }}
              data-testid={`card-pricing-block-${idx}`}
            >
              <h3 className="text-lg font-bold mb-5 pb-3" style={{ color: "var(--lz-text)", borderBottom: "1px solid var(--lz-border)" }}>
                {block.heading}
              </h3>

              <div className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  <span className="text-sm font-semibold" style={{ color: "var(--lz-text)" }}>الصيانة الدورية</span>
                </div>
                <div className="space-y-1.5 text-sm">
                  <p style={{ color: "var(--lz-text-2)" }}>
                    Service A: <span className="line-through text-xs" style={{ color: "var(--lz-text-3)" }}>{formatPrice(block.periodic.a.agency)}</span>{" "}
                    <span className="font-semibold" style={{ color: "var(--lz-text)" }}>{formatPrice(block.periodic.a.price)} ريال</span>{" "}
                    <span className="text-xs" style={{ color: "var(--lz-text-3)" }}>(شامل VAT)</span>
                  </p>
                  <p style={{ color: "var(--lz-text-2)" }}>
                    Service B: <span className="line-through text-xs" style={{ color: "var(--lz-text-3)" }}>{formatPrice(block.periodic.b.agency)}</span>{" "}
                    <span className="font-semibold" style={{ color: "var(--lz-text)" }}>{formatPrice(block.periodic.b.price)} ريال</span>{" "}
                    <span className="text-xs" style={{ color: "var(--lz-text-3)" }}>(شامل VAT)</span>
                  </p>
                </div>
              </div>

              <div className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span className="text-sm font-semibold" style={{ color: "var(--lz-text)" }}>الصيانة الشاملة</span>
                </div>
                <div className="space-y-1.5 text-sm">
                  {block.major.map((m, i) => (
                    <p key={i} style={{ color: "var(--lz-text-2)" }}>
                      {m.km} كم:{" "}
                      {m.agency && <span className="line-through text-xs" style={{ color: "var(--lz-text-3)" }}>{formatPrice(m.agency)}</span>}{" "}
                      <span className="font-semibold" style={{ color: "var(--lz-text)" }}>{formatPrice(m.price)} ريال</span>{" "}
                      <span className="text-xs" style={{ color: "var(--lz-text-3)" }}>(شامل VAT)</span>
                      {m.note && <span className="block text-xs mt-0.5" style={{ color: "var(--lz-text-3)" }}>{m.note}</span>}
                    </p>
                  ))}
                </div>
              </div>

              <button
                onClick={scrollToSelector}
                className="w-full py-2.5 rounded-md text-sm font-medium transition-colors"
                style={{ backgroundColor: "var(--lz-accent)", color: "#fff" }}
                data-testid={`button-pricing-${idx}`}
              >
                {block.buttonText}
              </button>
            </div>
          ))}
        </div>

        <div
          className="rounded-lg overflow-hidden mb-4"
          style={{ border: "1px solid var(--lz-border)" }}
        >
          <div className="p-4" style={{ backgroundColor: "var(--lz-surface-1)" }}>
            <h3 className="text-base font-bold mb-2" style={{ color: "var(--lz-text)" }}>ماذا تشمل كل باقة؟</h3>
            <p className="text-xs leading-relaxed" style={{ color: "var(--lz-text-3)" }}>
              تفسير سريع: <span style={{ color: "#22c55e" }}>&#10003; مشمول</span> دائمًا — <span style={{ color: "var(--lz-chrome-2)" }}>&#9723; ضمن Service B عند الاستحقاق</span> (يُؤكَّد بالـVIN) — <span style={{ color: "#f59e0b" }}>&#11088; يُنفّذ ضمن الصيانة الشاملة</span> عند محطات 60k/90k/120k — <span style={{ color: "var(--lz-text-3)" }}>— غير مشمول</span>
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-testid="table-comparison">
              <thead>
                <tr style={{ backgroundColor: "var(--lz-surface-2)" }}>
                  <th className="text-right px-4 py-3 font-semibold" style={{ color: "var(--lz-text-2)" }}>البند</th>
                  <th className="text-center px-4 py-3 font-semibold" style={{ color: "var(--lz-text-2)" }}>
                    <span className="inline-flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      الدورية (A/B)
                    </span>
                  </th>
                  <th className="text-center px-4 py-3 font-semibold" style={{ color: "var(--lz-text-2)" }}>
                    <span className="inline-flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      الشاملة (Major)
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr
                    key={i}
                    style={{
                      backgroundColor: i % 2 === 0 ? "var(--lz-surface-1)" : "var(--lz-surface-2)",
                      borderTop: "1px solid var(--lz-border)",
                    }}
                  >
                    <td className="px-4 py-3" style={{ color: "var(--lz-text-2)" }}>{row.item}</td>
                    <td className="px-4 py-3 text-center">{renderCellStatus(row.periodic)}</td>
                    <td className="px-4 py-3 text-center">{renderCellStatus(row.major)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-xs text-center mb-8" style={{ color: "var(--lz-text-3)" }}>
          لا يتم تنفيذ أي بند إضافي إلا بعد تأكيد الاستحقاق برقم الشاصي (VIN) وموافقتك قبل التنفيذ.
        </p>

        <div className="text-center">
          <button
            onClick={scrollToSelector}
            className="text-sm font-medium px-6 py-3 rounded-lg transition-colors"
            style={{ backgroundColor: "var(--lz-accent)", color: "#fff" }}
            data-testid="button-pricing-cta"
          >
            اختَر محركك الآن واحجز
          </button>
        </div>
      </div>
    </section>
  );
}

function TrustSection() {
  const bullets = [
    "برنامج مخصص لـ S-Class (2020–2025)",
    "تطبيق جدول المصنع كل 15,000 كم/سنة",
    "تغيير المستحق فقط — بدون مبالغة في البنود",
    "توثيق وتقرير واضح بعد الخدمة",
    "تسليم في نفس اليوم (حسب الموعد)",
    "القرار عندك: لا تنفيذ لأي بند إضافي بدون موافقتك",
  ];

  return (
    <section className="py-16 md:py-24 px-4" id="trust">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-4xl font-bold mb-4" style={{ color: "var(--lz-text)" }} data-testid="text-trust-title">
            لماذا لزوف لمرسيدس S-Class؟
          </h2>
          <p className="text-base md:text-lg leading-relaxed" style={{ color: "var(--lz-text-2)" }}>
            لأن S-Class لا تحتاج تجربة… تحتاج منهج.
            <br />
            في لزوف، كل زيارة صيانة لها منطق واضح: ماذا يتم تغييره؟ ماذا يتم فحصه؟ وما الذي يُنفّذ فقط عند استحقاقه.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {bullets.map((text, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-4 rounded-lg trust-badge-border"
              style={{ backgroundColor: "var(--lz-surface-1)" }}
              data-testid={`card-trust-${i}`}
            >
              <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5" style={{ backgroundColor: "var(--lz-accent)" }}>
                <Check size={12} color="#fff" />
              </div>
              <p className="text-sm" style={{ color: "var(--lz-text-2)" }}>{text}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={scrollToSelector}
            className="text-sm font-medium px-6 py-3 rounded-lg transition-colors"
            style={{ backgroundColor: "var(--lz-accent)", color: "#fff" }}
            data-testid="button-trust-cta"
          >
            احجز الآن
          </button>
        </div>
      </div>
    </section>
  );
}

function RiskReductionSection({ hasSelection, onBooking }: { hasSelection: boolean; onBooking: () => void }) {
  const cards = [
    { title: "موافقة قبل التنفيذ", text: "أي بند إضافي يتم عرضه لك بوضوح… وتقرره أنت." },
    { title: "لا مفاجآت", text: "لا تغيير عشوائي. لا (نبدّل وخلاص)." },
    { title: "تقرير مفصل", text: "تستلم تقريرًا يوضح ما تم عمله بشكل مفهوم." },
  ];

  return (
    <section className="py-16 md:py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: "var(--lz-text)" }} data-testid="text-risk-title">
            قبل التنفيذ… أنت ترى كل شيء وتوافق عليه.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {cards.map((card, i) => (
            <div
              key={i}
              className="lz-corner-triangle p-6 rounded-lg text-center"
              style={{ backgroundColor: "var(--lz-surface-1)", border: "1px solid var(--lz-border)" }}
              data-testid={`card-risk-${i}`}
            >
              <h3 className="text-base font-bold mb-2" style={{ color: "var(--lz-text)" }}>{card.title}</h3>
              <p className="text-sm" style={{ color: "var(--lz-text-2)" }}>{card.text}</p>
            </div>
          ))}
        </div>

        <p className="text-xs text-center mb-6" style={{ color: "var(--lz-text-3)" }}>
          الاستحقاق النهائي يتم تأكيده حسب VIN لأن بعض البنود تختلف حسب التجهيزات.
        </p>

        <div className="text-center">
          <button
            onClick={hasSelection ? onBooking : scrollToSelector}
            className="text-sm font-medium px-6 py-3 rounded-lg transition-colors"
            style={{ backgroundColor: "var(--lz-accent)", color: "#fff" }}
            data-testid="button-risk-cta"
          >
            تابع للحجز
          </button>
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "هل الصيانة خارج الوكالة تعني فقدان الضمان؟",
      a: "الصيانة خارج الوكالة لا تعني تلقائيًا فقدان الضمان. العامل الحاسم عادةً هو الالتزام بجدول المصنع، استخدام المواصفات الصحيحة، وتوثيق الخدمة بفواتير واضحة.\nفي لزوف نلتزم بالجدول ونوفر توثيقًا وتقريرًا مفصلًا. وإذا كانت سيارتك تحت ضمان، اكتب VIN في صفحة الحجز وسنؤكد الاستحقاق قبل التنفيذ.",
    },
    {
      q: "كيف أعرف إذا خدمتي A أو B؟",
      a: "اختر ممشى السيارة في هذه الصفحة — وسيظهر نوع الخدمة تلقائيًا. وإن كان لديك سجل سابق مختلف، سنؤكد نوع الخدمة معك قبل التنفيذ.",
    },
    {
      q: "هل ستغيّرون قطع إضافية؟",
      a: "لا. أي بند إضافي يكون فقط مشمولًا عند استحقاقه أو حسب التجهيز — ويُعرض عليك للموافقة قبل التنفيذ.",
    },
    {
      q: "كم يستغرق الوقت؟",
      a: "غالبًا تسليم في نفس اليوم (حسب الموعد ونوع الاستحقاق). سنؤكد لك الزمن المتوقع عبر صفحة الحجز.",
    },
    {
      q: "هل الأسعار تشمل الضريبة؟",
      a: "نعم، جميع الأسعار المعروضة شامل VAT.",
    },
  ];

  return (
    <section className="py-16 md:py-24 px-4" id="faq">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10" style={{ color: "var(--lz-text)" }} data-testid="text-faq-title">
          أسئلة شائعة قبل الحجز
        </h2>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-lg overflow-hidden"
              style={{ backgroundColor: "var(--lz-surface-1)", border: "1px solid var(--lz-border)" }}
              data-testid={`card-faq-${i}`}
            >
              <button
                className="w-full flex items-center justify-between p-4 text-right"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                data-testid={`button-faq-${i}`}
              >
                <span className="text-sm font-semibold" style={{ color: "var(--lz-text)" }}>{faq.q}</span>
                <ChevronDown
                  size={18}
                  className="flex-shrink-0 mr-3 transition-transform"
                  style={{ color: "var(--lz-text-3)", transform: openIndex === i ? "rotate(180deg)" : "rotate(0)" }}
                />
              </button>
              {openIndex === i && (
                <div className="px-4 pb-4 text-sm leading-relaxed whitespace-pre-line" style={{ color: "var(--lz-text-2)" }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <button
            onClick={scrollToSelector}
            className="text-sm font-medium px-6 py-3 rounded-lg transition-colors"
            style={{ backgroundColor: "var(--lz-accent)", color: "#fff" }}
            data-testid="button-faq-cta"
          >
            احجز الآن
          </button>
        </div>
      </div>
    </section>
  );
}

function FinalCTASection({ hasSelection, onBooking }: { hasSelection: boolean; onBooking: () => void }) {
  return (
    <section className="py-20 md:py-28 px-4 text-center">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-4xl font-bold mb-4" style={{ color: "var(--lz-text)" }} data-testid="text-final-cta-title">
          خلال دقيقة… تكون حجّزت.
        </h2>
        <p className="text-base mb-8" style={{ color: "var(--lz-text-2)" }}>
          اختر المحرك + الممشى + الباقة… ثم انتقل للحجز مباشرة.
        </p>
        <button
          onClick={hasSelection ? onBooking : scrollToSelector}
          className="text-lg font-bold px-12 py-4 rounded-lg transition-all"
          style={{ backgroundColor: "var(--lz-accent)", color: "#fff", boxShadow: "0 4px 32px rgba(239,65,54,0.25)" }}
          data-testid="button-final-cta"
        >
          تابع للحجز
        </button>
      </div>
    </section>
  );
}

function FooterSection() {
  return (
    <footer
      className="py-10 px-4"
      style={{ backgroundColor: "var(--lz-surface-1)", borderTop: "1px solid var(--lz-border)" }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-8">
          <div>
            <img src={lezofLogoAr} alt="لزوف" className="h-8 mb-3" data-testid="img-footer-logo" />
            <p className="text-sm" style={{ color: "var(--lz-text-2)" }}>مركز لزوف لخدمات السيارات – الرياض</p>
          </div>
          <div className="text-sm space-y-2" style={{ color: "var(--lz-text-3)" }}>
            <p>
              <a href={PHONE_NUMBER} className="hover:text-white transition-colors" data-testid="link-footer-phone">
                <Phone size={14} className="inline ml-1" /> اتصال
              </a>
            </p>
            <p>
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" data-testid="link-footer-whatsapp">
                <MessageCircle size={14} className="inline ml-1" /> واتساب
              </a>
            </p>
          </div>
        </div>
        <div
          className="pt-6 text-xs text-center"
          style={{ color: "var(--lz-text-3)", borderTop: "1px solid var(--lz-border)" }}
          data-testid="text-footer-disclaimer"
        >
          يتم تأكيد الاستحقاق النهائي حسب رقم الشاصي (VIN) لأن بعض البنود تختلف حسب 4Matic/AMG/Hybrid والتجهيزات.
        </div>
      </div>
    </footer>
  );
}

function StickyMobileCTA() {
  return (
    <div className="sticky-cta-mobile md:hidden">
      <button
        onClick={scrollToSelector}
        className="w-full py-3.5 rounded-lg text-sm font-bold transition-colors"
        style={{ backgroundColor: "var(--lz-accent)", color: "#fff", boxShadow: "0 -2px 20px rgba(239,65,54,0.2)" }}
        data-testid="button-sticky-cta"
      >
        احجز صيانة S-Class
      </button>
    </div>
  );
}

export default function LandingPage() {
  const [selectedEngine, setSelectedEngine] = useState<EngineKey>("STD_6");
  const [selectedMileage, setSelectedMileage] = useState<Mileage>(15000);
  const [selectedPackage, setSelectedPackage] = useState<"PERIODIC" | "MAJOR" | null>(null);

  const hasSelection = selectedPackage !== null;

  const handleBooking = useCallback(() => {
    if (!selectedPackage) {
      scrollToSelector();
      return;
    }
    const serviceType = getServiceType(selectedMileage);
    const price = selectedPackage === "PERIODIC"
      ? getPeriodicPrice(selectedEngine, selectedMileage)
      : getMajorPrice(selectedEngine, selectedMileage)?.price || 0;
    const url = buildBookingUrl({
      engine: selectedEngine,
      mileage: selectedMileage,
      serviceType,
      packageType: selectedPackage,
      price,
    });
    window.open(url, "_blank");
  }, [selectedEngine, selectedMileage, selectedPackage]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--lz-bg)" }}>
      <Header />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <InteractiveSelector
        selectedEngine={selectedEngine}
        setSelectedEngine={setSelectedEngine}
        selectedMileage={selectedMileage}
        setSelectedMileage={setSelectedMileage}
        selectedPackage={selectedPackage}
        setSelectedPackage={setSelectedPackage}
      />
      <DueTableSection />
      <PricingSection />
      <TrustSection />
      <RiskReductionSection hasSelection={hasSelection} onBooking={handleBooking} />
      <FAQSection />
      <FinalCTASection hasSelection={hasSelection} onBooking={handleBooking} />
      <FooterSection />
      <StickyMobileCTA />
    </div>
  );
}