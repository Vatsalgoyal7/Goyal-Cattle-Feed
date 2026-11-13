export type SiteLanguage = 'en' | 'hi' | 'hinglish';

export interface SiteCopy {
  nav: {
    features: string;
    about: string;
    contact: string;
    login: string;
    getStarted: string;
    dashboard: string;
  };
  hero: {
    badge: string;
    titleLine1: string;
    titleHighlight: string;
    titleLine2: string;
    desc: string;
    ctaPrimary: string;
    ctaSecondary: string;
    trust1: string;
    trust2: string;
    trust3: string;
    trust4: string;
  };
  stats: {
    s1Label: string;
    s2Label: string;
    s3Label: string;
    s4Label: string;
  };
  features: {
    tag: string;
    heading: string;
    subheading: string;
    items: {
      title: string;
      desc: string;
    }[];
  };
  testimonials: {
    heading: string;
    subheading: string;
    items: {
      name: string;
      company: string;
      quote: string;
    }[];
  };
  cta: {
    heading: string;
    desc: string;
    button: string;
  };
  about: {
    tag: string;
    heading: string;
    headingHighlight: string;
    desc: string;
    storyTag: string;
    storyHeading: string;
    storyP1: string;
    storyP2: string;
    storyP3: string;
    missionHeading: string;
    values: {
      title: string;
      desc: string;
    }[];
    teamHeading: string;
    teamSub: string;
    whyHeading: string;
    whyItems: {
      title: string;
      desc: string;
    }[];
  };
  auth: {
    loginTitle: string;
    loginSubtitle: string;
    registerTitle: string;
    registerSubtitle: string;
    forgotTitle: string;
    forgotSubtitle: string;
    tabLogin: string;
    tabRegister: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    confirmPasswordLabel: string;
    confirmPasswordPlaceholder: string;
    nameLabel: string;
    namePlaceholder: string;
    roleLabel: string;
    roleHint: string;
    forgotPasswordLink: string;
    loginBtn: string;
    registerBtn: string;
    googleBtn: string;
    phoneBtn: string;
    orDivider: string;
    sendResetBtn: string;
    backToLogin: string;
    phoneLabel: string;
    phonePlaceholder: string;
    otpLabel: string;
    otpPlaceholder: string;
    sendOtpBtn: string;
    verifyOtpBtn: string;
    resendOtp: string;
    featureBullet1: string;
    featureBullet2: string;
    featureBullet3: string;
    featureBullet4: string;
    footerText: string;
    roles: {
      id: string;
      title: string;
      desc: string;
    }[];
  };
}

export const SITE_CONTENT: Record<SiteLanguage, SiteCopy> = {
  // ─────────────────────────────────────────────────────────────
  // 1. ENGLISH (Pure, Professional English)
  // ─────────────────────────────────────────────────────────────
  en: {
    nav: {
      features: 'Features',
      about: 'About Us',
      contact: 'Contact',
      login: 'Sign In',
      getStarted: 'Get Started Free →',
      dashboard: 'Go to Dashboard',
    },
    hero: {
      badge: '🌾 Complete Business Operating System for Agro & Feed Mills',
      titleLine1: 'Scale Your Business With',
      titleHighlight: 'Precision & Clarity',
      titleLine2: 'Without Complexities',
      desc: 'An enterprise-grade operating system designed for grain, cattle feed, and manufacturing units. Manage sales, inventory, double-entry accounts, and labor in one seamless workspace.',
      ctaPrimary: 'Access Portal Now',
      ctaSecondary: 'Read Company Story',
      trust1: 'GST Invoicing Ready',
      trust2: 'Enterprise Cloud Security',
      trust3: 'Offline Sync Support',
      trust4: 'Elder-Friendly Interface',
    },
    stats: {
      s1Label: 'Core Business Modules',
      s2Label: 'Real-Time Sync Accuracy',
      s3Label: 'Role-Based Access Profiles',
      s4Label: 'AI Automation Assistants',
    },
    features: {
      tag: 'Enterprise Features',
      heading: 'Everything Needed to Run Your Mills',
      subheading: 'Tailored specifically for agricultural processing, feed manufacturing, and distribution businesses.',
      items: [
        {
          title: 'Executive Dashboard',
          desc: 'High-level real-time visibility into revenue, margins, pending dues, and bank balances with customizable data grids.',
        },
        {
          title: 'Inventory & Silo Management',
          desc: 'Track raw materials, finished pellets, multi-warehouse batch stocks, and automated re-order thresholds.',
        },
        {
          title: 'Invoicing & Party Ledgers',
          desc: 'Instant GST invoice generation, e-way bill export bundle, customer debit/credit limits, and automated payment reminders.',
        },
        {
          title: 'AI Business Companion',
          desc: 'Smart intelligence engine to query stock levels, draft supplier emails, and capture vocal business notes effortlessly.',
        },
        {
          title: 'Fleet & Dispatch Logistics',
          desc: 'End-to-end transport assignment, driver trip logs, fuel expense reconciliation, and delivery confirmations.',
        },
        {
          title: 'Role-Based Security & Audit',
          desc: 'Granular permissions for Owners, Managers, Accountants, and Field Staff with comprehensive tamper-proof audit trails.',
        },
      ],
    },
    testimonials: {
      heading: 'Trusted by Established Feed Manufacturers',
      subheading: 'Real feedback from businesses managing multi-crore turnover on our platform.',
      items: [
        {
          name: 'Ramesh Agarwal',
          company: 'Agarwal Feeds, Lucknow',
          quote: 'This platform brought total clarity to our grain procurement and dispatch cycle. Accounts reconciliation now takes minutes instead of days.',
        },
        {
          name: 'Priya Singh',
          company: 'Singh Agro Industries, Kanpur',
          quote: 'The interface is exceptionally clean. Even our senior warehouse supervisors learned to log daily stock batches without any technical training.',
        },
        {
          name: 'Mohit Verma',
          company: 'Verma Cattle Feed Mills, Jaipur',
          quote: 'The automated GST reports and party ledgers have saved our chartered accountant countless hours every closing quarter.',
        },
      ],
    },
    cta: {
      heading: 'Ready to Modernize Your Operations?',
      desc: 'Join hundreds of progressive agribusinesses streamlining their supply chain, billing, and accounting today.',
      button: 'Sign In to Your Workspace',
    },
    about: {
      tag: 'Our Foundation',
      heading: 'Built From Real Industry Experience',
      headingHighlight: 'For Indian Agribusinesses',
      desc: 'Goyal Business OS was engineered to bridge the gap between traditional agricultural commerce and high-speed modern digital operations.',
      storyTag: 'Our Journey',
      storyHeading: 'How a Grain Merchant’s Need Became an OS',
      storyP1: 'In major agricultural trade hubs across North India, business owners struggled with generic software that failed to account for bag tare weights, bulk vehicle weighbridge receipts, and seasonal farmer credit cycles.',
      storyP2: 'We built Goyal Business OS specifically around these ground realities: multi-depot stock transfers, moisture loss tracking, freight calculation, and fast counter billing.',
      storyP3: 'Today, Goyal Business OS represents a comprehensive system that unites plant operations, fleet management, and statutory tax compliance under one intuitive roof.',
      missionHeading: 'Our Mission & Architectural Pillars',
      values: [
        {
          title: 'Purpose-Built Precision',
          desc: 'Every calculation, tax rule, and inventory metric is customized for the feed, grain, and manufacturing industry.',
        },
        {
          title: 'Accessibility for Everyone',
          desc: 'Designed with high contrast, legible typography, and icon-driven workflows so family elders and executives can operate it equally well.',
        },
        {
          title: 'Data Sovereignty & Privacy',
          desc: 'Your proprietary recipes, party discounts, and margin sheets are protected with industry-standard encrypted cloud infrastructure.',
        },
        {
          title: 'Continuous Innovation',
          desc: 'From generative business reporting to vocal memory logging, we bring modern AI directly into everyday shopfloor routines.',
        },
      ],
      teamHeading: 'Executive Leadership',
      teamSub: 'The visionaries and engineers behind Goyal Business OS',
      whyHeading: 'Why Industry Leaders Choose Goyal OS',
      whyItems: [
        { title: 'Industry Specific', desc: 'Pre-configured for quintals, bags, truck tare weights, and moisture deduction formulas.' },
        { title: 'Dual Operation Modes', desc: 'Toggle effortlessly between Simple Touchscreen Mode and Advanced Accountant Mode.' },
        { title: 'Encrypted & Backed Up', desc: 'Automated daily cloud backups with one-click offline snapshot recovery.' },
        { title: 'Complete Hardware Support', desc: 'Direct thermal receipt printing, barcode generation, and weighbridge terminal integration.' },
        { title: 'Dedicated Customer Support', desc: 'Direct operational assistance via phone, WhatsApp, and remote diagnostic tools.' },
        { title: 'Zero Hidden Costs', desc: 'Predictable pricing designed for single manufacturing plants and expanding multi-city depots alike.' },
      ],
    },
    auth: {
      loginTitle: 'Welcome Back',
      loginSubtitle: 'Sign in to access your business operations portal',
      registerTitle: 'Create New Account',
      registerSubtitle: 'Register a new profile for your business workspace',
      forgotTitle: 'Reset Password',
      forgotSubtitle: 'Enter your verified email to receive instructions',
      tabLogin: 'Login',
      tabRegister: 'New Registration',
      emailLabel: 'Business Email Address',
      emailPlaceholder: 'e.g. vatsalgoyal71@gmail.com',
      passwordLabel: 'Security Password',
      passwordPlaceholder: 'Enter your password',
      confirmPasswordLabel: 'Confirm Password',
      confirmPasswordPlaceholder: 'Re-enter password',
      nameLabel: 'Full Legal Name',
      namePlaceholder: 'e.g. Vatsal Goyal',
      roleLabel: 'Select Your System Role',
      roleHint: 'Choose the profile that matches your duties',
      forgotPasswordLink: 'Forgot password?',
      loginBtn: 'Sign In to Workspace',
      registerBtn: 'Create Account',
      googleBtn: 'Sign in with Google',
      phoneBtn: 'Sign in with Mobile OTP',
      orDivider: 'or continue with email',
      sendResetBtn: 'Send Password Reset Link',
      backToLogin: 'Back to Login',
      phoneLabel: '10-Digit Mobile Number',
      phonePlaceholder: '98765 43210',
      otpLabel: 'Enter 6-Digit OTP Code',
      otpPlaceholder: '••••••',
      sendOtpBtn: 'Send Verification OTP',
      verifyOtpBtn: 'Verify OTP & Proceed',
      resendOtp: 'Resend OTP Code',
      featureBullet1: 'Real-Time Enterprise Financials & GST Filing',
      featureBullet2: 'Live Silo & Warehouse Inventory Tracking',
      featureBullet3: 'AI Memory Assistant with Voice Command Capture',
      featureBullet4: 'Multi-Role Access Control & Security Encryption',
      footerText: 'Protected by Enterprise Cloud Authentication · All Rights Reserved',
      roles: [
        { id: 'owner', title: 'Owner / Executive', desc: 'Full administrative oversight, profit metrics, and sensitive approvals' },
        { id: 'manager', title: 'Operations Manager', desc: 'Plant scheduling, order fulfillment, and operational performance' },
        { id: 'accountant', title: 'Senior Accountant', desc: 'Ledgers, GST tax reconciliations, payment balances, and vouchers' },
        { id: 'stock_manager', title: 'Warehouse Supervisor', desc: 'Inventory counts, batch dispatch, gate passes, and stock intake' },
        { id: 'sales_executive', title: 'Sales Officer', desc: 'Dealer quotes, orders, customer khata, and payment collections' },
        { id: 'hr_manager', title: 'Personnel & Labor HR', desc: 'Staff attendance, wage rosters, transport drivers, and advances' },
      ],
    },
  },

  // ─────────────────────────────────────────────────────────────
  // 2. HINDI (शुद्ध, सम्मानजनक हिंदी - देवनागरी लिपि)
  // ─────────────────────────────────────────────────────────────
  hi: {
    nav: {
      features: 'विशेषताएं',
      about: 'हमारे बारे में',
      contact: 'संपर्क',
      login: 'लॉग इन करें',
      getStarted: 'निःशुल्क शुरू करें →',
      dashboard: 'डैशबोर्ड पर जाएं',
    },
    hero: {
      badge: '🌾 पशु आहार एवं कृषि व्यापार हेतु संपूर्ण डिजिटल ऑपरेटिंग सिस्टम',
      titleLine1: 'अपने व्यापार को दें',
      titleHighlight: 'सटीकता और गति',
      titleLine2: 'सरलतम रूप में',
      desc: 'पशु आहार निर्माताओं, मिलों एवं थोक व्यापारियों के लिए विशेष रूप से निर्मित डिजिटल प्रणाली। बिक्री, गोदाम का स्टॉक, डबल-एंट्री बहीखाता और कर्मचारियों का हिसाब अब एक ही स्थान पर सुरक्षित रखें।',
      ctaPrimary: 'पोर्टल में प्रवेश करें',
      ctaSecondary: 'हमारी कहानी पढ़ें',
      trust1: 'जीएसटी बिलिंग समर्थित',
      trust2: 'क्लाउड सुरक्षा प्रमाणित',
      trust3: 'ऑफलाइन उपयोग सुविधा',
      trust4: 'वरिष्ठ जनों हेतु सरल डिजाइन',
    },
    stats: {
      s1Label: 'प्रमुख व्यावसायिक मॉड्यूल',
      s2Label: 'रियल-टाइम डेटा सटीकता',
      s3Label: 'कार्यकारी भूमिका प्रोफाइल',
      s4Label: 'कृत्रिम बुद्धिमत्ता सहायक',
    },
    features: {
      tag: 'प्रमुख क्षमताएं',
      heading: 'व्यापार को सुचारू रूप से चलाने के सभी साधन',
      subheading: 'कृषि एवं पशु आहार उद्योग की वास्तविक आवश्यकताओं को ध्यान में रखकर तैयार की गई तकनीक।',
      items: [
        {
          title: 'मुख्य कार्यकारी डैशबोर्ड',
          desc: 'कुल दैनिक बिक्री, शुद्ध लाभ, देनदारी, लेनदारी एवं बैंक बैलेंस का संपूर्ण वास्तविक विवरण स्पष्ट चार्ट्स के माध्यम से देखें।',
        },
        {
          title: 'स्टॉक एवं गोदाम प्रबंधन',
          desc: 'कच्चे माल, निर्मित खल, चूरी एवं दाना की बोरी-वार गिनती। कम स्टॉक होने पर स्वतः पूर्व चेतावनी अलर्ट।',
        },
        {
          title: 'जीएसटी बिलिंग एवं खाता बही',
          desc: 'एक क्लिक में जीएसटी इनवॉइस, ई-वे बिल जेनरेशन, पार्टी लेजर स्टेटमेंट एवं बकाया वसूली हेतु ऑटोमैटिक सूचना।',
        },
        {
          title: 'गोयल एआई व्यापार साथी',
          desc: 'हिंदी भाषा में बातचीत करने वाला सहायक, जो आपकी आवाज सुनकर सीधे स्टॉक प्रविष्टि और स्मरण पत्र दर्ज कर सकता है।',
        },
        {
          title: 'वाहन एवं ढुलाई प्रबंधन',
          desc: 'गाड़ियों का डिस्पैच, चालकों का ट्रिप हिसाब, डीजल खर्च का मिलान एवं पावती की सटीक ट्रैकिंग।',
        },
        {
          title: 'सुरक्षा एवं लेखा परीक्षा',
          desc: 'मालिक, मुनीम, मैनेजर एवं सेल्समैन हेतु पृथक अधिकार। प्रत्येक प्रविष्टि का सुरक्षित एवं अपरिवर्तनीय रिकॉर्ड।',
        },
      ],
    },
    testimonials: {
      heading: 'विश्वसनीय व्यापारियों के विचार',
      subheading: 'हमारे मंच का उपयोग कर रहे प्रमुख उद्योगपतियों का अनुभव।',
      items: [
        {
          name: 'रमेश अग्रवाल',
          company: 'अग्रवाल फीड्स, लखनऊ',
          quote: 'इस सॉफ्टवेयर ने हमारी खरीद एवं बिक्री प्रणाली को पूर्णतः पारदर्शी बना दिया है। मुनीम जी का काम अब घंटों की बजाय मिनटों में हो जाता है।',
        },
        {
          name: 'प्रिया सिंह',
          company: 'सिंह एग्रो इंडस्ट्रीज, कानपुर',
          quote: 'अक्षर बड़े और स्पष्ट हैं। हमारे गोदाम के वरिष्ठ प्रभारियों ने बिना किसी कंप्यूटर प्रशिक्षण के इसका उपयोग सहजता से सीख लिया।',
        },
        {
          name: 'मोहित वर्मा',
          company: 'वर्मा कैटल फीड मिल्स, जयपुर',
          quote: 'जीएसटी रिपोर्ट और पार्टी लेजर इतने व्यवस्थित निकलते हैं कि हमारे सीए साहब को टैक्स ऑडिट में कोई परेशानी नहीं होती।',
        },
      ],
    },
    cta: {
      heading: 'क्या आप अपने व्यापार को आधुनिक बनाने हेतु तैयार हैं?',
      desc: 'सैकड़ों सफल व्यापारियों से जुड़ें और अपनी बिलिंग, स्टॉक एवं बहीखाते को तनावमुक्त बनाएं।',
      button: 'अपने पोर्टल में प्रवेश करें',
    },
    about: {
      tag: 'हमारी पृष्ठभूमि',
      heading: 'जमीनी अनुभव से उपजा समाधान',
      headingHighlight: 'भारतीय कृषि व्यापार हेतु',
      desc: 'गोयल बिजनेस ओएस का निर्माण पारंपरिक मंडी व्यापार और आधुनिक डिजिटल तकनीक के सफल समन्वय हेतु किया गया है।',
      storyTag: 'हमारी यात्रा',
      storyHeading: 'एक व्यापारी की आवश्यकता से बना ऑपरेटिंग सिस्टम',
      storyP1: 'उत्तर भारत की प्रमुख अनाज और खल मंडियों में व्यापारियों को ऐसी कठिनाइयों का सामना करना पड़ता था, जिन्हें विदेशी या सामान्य सॉफ्टवेयर नहीं समझ पाते थे — जैसे कट्टों का वजन (तौल), नमी की कटौती, और किसानों की मौसमी उधारी।',
      storyP2: 'हमने इन व्यावहारिक परिस्थितियों के अनुरूप सॉफ्टवेयर तैयार किया: धर्मकांटा पर्ची मिलान, गोदाम स्थानांतरण, गाड़ी भाड़ा और त्वरित काउंटर बिलिंग।',
      storyP3: 'आज गोयल बिजनेस ओएस एक सम्पूर्ण व्यवस्था के रूप में स्थापित है, जो फैक्टरी उत्पादन से लेकर टैक्स फाइलिंग तक हर चरण को सरल बनाती है।',
      missionHeading: 'हमारा उद्देश्य एवं आधारभूत सिद्धांत',
      values: [
        {
          title: 'उद्योग के अनुकूल निर्माण',
          desc: 'प्रत्येक गणना, टैक्स नियम एवं इन्वेंटरी सूत्र विशेष रूप से पशु आहार और कृषि उद्योग के अनुकूल हैं।',
        },
        {
          title: 'सर्वजन सुलभ उपयोग',
          desc: 'स्पष्ट अक्षर, बड़े आइकॉन एवं सहज प्रक्रिया ताकि परिवार के वरिष्ठजन एवं युवा दोनों इसे आत्मविश्वास से चला सकें।',
        },
        {
          title: 'डेटा गोपनीयता एवं सुरक्षा',
          desc: 'आपकी व्यावसायिक दरें, फॉर्मूले और ग्राहकों की जानकारी पूर्णतः एन्क्रिप्टेड और सुरक्षित रहती है।',
        },
        {
          title: 'निरंतर नवाचार',
          desc: 'आर्टिफिशियल इंटेलिजेंस और वॉयस कमांड्स के माध्यम से दैनिक कार्यों को और अधिक सुगम बनाना।',
        },
      ],
      teamHeading: 'कार्यकारी नेतृत्व',
      teamSub: 'गोयल बिजनेस ओएस को निरंतर सशक्त बनाने वाली समर्पित टीम',
      whyHeading: 'व्यापारी बंधु हमें क्यों चुनते हैं?',
      whyItems: [
        { title: 'मंडी व्यापार के अनुकूल', desc: 'क्विंटल, बोरी, गाड़ी वजन और बारदाना हिसाब की पूर्व-निर्मित व्यवस्था।' },
        { title: 'दोहरा कार्य मोड', desc: 'सरल टचस्क्रीन मोड अथवा विस्तृत मुनीमी मोड में कार्य करने की स्वतंत्रता।' },
        { title: 'सुरक्षित क्लाउड बैकअप', desc: 'प्रतिदिन स्वतः बैकअप ताकि कंप्यूटर खराब होने पर भी डेटा हमेशा सुरक्षित रहे।' },
        { title: 'प्रिंटर एवं हार्डवेयर समर्थन', desc: 'थर्मल रसीद प्रिंटर, बारकोड स्कैनर एवं धर्मकांटा मशीनों से सीधा जुड़ाव।' },
        { title: 'समर्पित ग्राहक सेवा', desc: 'फोन, व्हाट्सएप एवं वीडियो कॉल के माध्यम से त्वरित सहायता।' },
        { title: 'सुलभ एवं पारदर्शी मूल्य', desc: 'बिना किसी छुपे हुए शुल्क के छोटे और बड़े दोनों प्रतिष्ठानों के लिए उपयुक्त।' },
      ],
    },
    auth: {
      loginTitle: 'पुनः स्वागत है',
      loginSubtitle: 'अपने व्यापारिक कार्यक्षेत्र में प्रवेश करने हेतु विवरण दर्ज करें',
      registerTitle: 'नया खाता बनाएं',
      registerSubtitle: 'अपने व्यवसाय हेतु नई प्रोफ़ाइल पंजीकृत करें',
      forgotTitle: 'पासवर्ड रीसेट करें',
      forgotSubtitle: 'अपना पंजीकृत ईमेल दर्ज करें, हम लिंक भेजेंगे',
      tabLogin: 'लॉग इन',
      tabRegister: 'नया पंजीकरण',
      emailLabel: 'व्यापारिक ईमेल पता',
      emailPlaceholder: 'उदा. vatsalgoyal71@gmail.com',
      passwordLabel: 'सुरक्षा पासवर्ड',
      passwordPlaceholder: 'अपना पासवर्ड दर्ज करें',
      confirmPasswordLabel: 'पासवर्ड की पुष्टि करें',
      confirmPasswordPlaceholder: 'वही पासवर्ड पुनः लिखें',
      nameLabel: 'पूरा कानूनी नाम',
      namePlaceholder: 'उदा. वत्सल गोयल',
      roleLabel: 'सिस्टम में अपनी भूमिका चुनें',
      roleHint: 'अपने पद और दायित्व के अनुसार विकल्प चुनें',
      forgotPasswordLink: 'पासवर्ड भूल गए?',
      loginBtn: 'कार्यक्षेत्र में प्रवेश करें',
      registerBtn: 'खाता तैयार करें',
      googleBtn: 'गूगल खाते से सीधा प्रवेश करें',
      phoneBtn: 'मोबाइल नंबर ओटीपी द्वारा प्रवेश',
      orDivider: 'अथवा ईमेल द्वारा जारी रखें',
      sendResetBtn: 'पासवर्ड रीसेट लिंक भेजें',
      backToLogin: 'लॉग इन पृष्ठ पर वापस जाएं',
      phoneLabel: '10 अंकों का मोबाइल नंबर',
      phonePlaceholder: '98765 43210',
      otpLabel: '6 अंकों का ओटीपी कोड',
      otpPlaceholder: '••••••',
      sendOtpBtn: 'ओटीपी कोड भेजें',
      verifyOtpBtn: 'ओटीपी सत्यापित कर आगे बढ़ें',
      resendOtp: 'ओटीपी पुनः भेजें',
      featureBullet1: 'वास्तविक समय में वित्तीय विश्लेषण एवं जीएसटी विवरण',
      featureBullet2: 'गोदामों एवं साइलो में स्टॉक की सजीव स्थिति',
      featureBullet3: 'हिंदी भाषा में बोलने पर प्रविष्टि दर्ज करने वाला एआई सहायक',
      featureBullet4: 'बहु-स्तरीय भूमिका सुरक्षा एवं पूर्णतः गोपनीय डेटा',
      footerText: 'सुरक्षित क्लाउड तकनीक द्वारा संचालित · सर्वाधिकार सुरक्षित',
      roles: [
        { id: 'owner', title: 'मालिक / मुख्य संचालक', desc: 'व्यापार की संपूर्ण निगरानी, लाभ-हानि, बैंक खाते एवं गोपनीय निर्णय' },
        { id: 'manager', title: 'संयंत्र प्रबंधक (मैनेजर)', desc: 'उत्पादन योजना, स्टॉक प्रेषण और दैनिक कर्मचारियों का संचालन' },
        { id: 'accountant', title: 'मुख्य लेखाकार (मुनीम जी)', desc: 'खाता बही, जीएसटी मिलान, उधारी वसूली और समस्त भुगतान वाउचर' },
        { id: 'stock_manager', title: 'गोदाम प्रभारी (स्टॉक मैनेजर)', desc: 'बोरी गिनती, आवक-जावक रजिस्टर, गेट पास और इन्वेंटरी सुरक्षा' },
        { id: 'sales_executive', title: 'बिक्री अधिकारी (सेल्समैन)', desc: 'ग्राहक ऑर्डर, भाव सूची, डिलीवरी समन्वय और नया ग्राहक जोड़ना' },
        { id: 'hr_manager', title: 'कार्मिक एवं मजदूरी प्रबंधक', desc: 'लेबर हाजिरी, दिहाड़ी-वेतन, वाहन चालक और अग्रिम भुगतान का हिसाब' },
      ],
    },
  },

  // ─────────────────────────────────────────────────────────────
  // 3. HINGLISH (Natural, Conversational Roman Hindi)
  // ─────────────────────────────────────────────────────────────
  hinglish: {
    nav: {
      features: 'Features',
      about: 'Hamare Baare Mein',
      contact: 'Sampark',
      login: 'Login Karein',
      getStarted: 'Free Shuru Karein →',
      dashboard: 'Dashboard Pe Jayein',
    },
    hero: {
      badge: '🌾 Cattle Feed aur Agro Business ke liye Smart Operating System',
      titleLine1: 'Apna Business Chalaayein',
      titleHighlight: 'Poori Clarity ke Saath',
      titleLine2: 'Bina Kisi Pareshani ke',
      desc: 'Feed mill aur trading businesses ke liye banaya gaya modern software. Sales, godaam ka stock, munimi khata aur staff ka hisab-kitab ab ek hi aasan screen par manage karein.',
      ctaPrimary: 'Portal Mein Login Karein',
      ctaSecondary: 'Hamari Kahani Padhein',
      trust1: 'GST Bill Ready',
      trust2: 'Cloud Data Security',
      trust3: 'Offline Mode Available',
      trust4: 'Bujurgon ke Liye Easy',
    },
    stats: {
      s1Label: 'Zaroori Business Modules',
      s2Label: 'Live Data Accuracy',
      s3Label: 'Staff Roles System',
      s4Label: 'Smart AI Assistant Tools',
    },
    features: {
      tag: 'Khas Suvidhayein',
      heading: 'Mill aur Trading Sambhalne ke Saare Tools',
      subheading: 'Cattle feed aur agro trading ke daily ground reality ke hisab se design kiya gaya hai.',
      items: [
        {
          title: 'Live Business Dashboard',
          desc: 'Aaj ki total sales, munafa, pending payments aur bank balance ek nazariya mein saaf dekhein.',
        },
        {
          title: 'Stock aur Godaam Khata',
          desc: 'Kaccha maal aur taiyaar bori ka live hisab. Stock kam hone se pehle hi automatic alert milega.',
        },
        {
          title: 'GST Bill aur Party Khata',
          desc: '1-click mein GST bill print karein, e-way bill banayein aur party ka ledger WhatsApp par bhein.',
        },
        {
          title: 'Goyal AI Smart Saathi',
          desc: 'Hindi mein bolkar ya likhkar baat karein — assistant stock entry aur reminder khud save kar lega.',
        },
        {
          title: 'Gadi aur Transport Dispatch',
          desc: 'Gadi loading, driver ka kharcha, diesel hisab aur delivery confirmation ka clear record.',
        },
        {
          title: 'Security aur User Control',
          desc: 'Maalik, Munim ji, Manager aur Sales ke alag-alag permissions taaki sensitive data secure rahe.',
        },
      ],
    },
    testimonials: {
      heading: 'Hamare Sath Judey Vyapariyon ki Rai',
      subheading: 'Daily Goyal Business OS use karne wale mill maalik kya kehte hain.',
      items: [
        {
          name: 'Ramesh Agarwal',
          company: 'Agarwal Feeds, Lucknow',
          quote: 'Is software ke aane se khareed aur bikri ka hisab bilkul clear ho gaya. Shaam ko hisab milane mein ab sirf 10 minute lagte hain.',
        },
        {
          name: 'Priya Singh',
          company: 'Singh Agro Industries, Kanpur',
          quote: 'Bade-bade buttons aur clean Hindi ki wajah se hamare senior godaam munim ji ne bhi bina kisi training ke chalana seekh liya.',
        },
        {
          name: 'Mohit Verma',
          company: 'Verma Cattle Feed Mills, Jaipur',
          quote: 'GST report aur party ledger itna badhiya nikalta hai ki hamare CA ko tax return bharne mein bilkul der nahi lagti.',
        },
      ],
    },
    cta: {
      heading: 'Apne Business ko Smart aur Digital Banayein',
      desc: 'Aaj hi sign in karein aur stock, accounts aur sales ka saara jhanjhat hamesha ke liye khatam karein.',
      button: 'Apne Portal Mein Login Karein',
    },
    about: {
      tag: 'Hamari Shuruat',
      heading: 'Mandi ke Real Experience se Bana',
      headingHighlight: 'Indian Vyapariyon ke Liye',
      desc: 'Goyal Business OS ka maqsad desi agro vyapar aur modern technology ke beech ka gap khatam karna hai.',
      storyTag: 'Hamari Kahani',
      storyHeading: 'Ek Vyapari ki Zaroorat se Shuru Hua Safar',
      storyP1: 'Mandi mein generic software se kaam karna mushkil tha, kyunki unme bori ka wazan, dharampuri kanta patti aur kisan uधारी ka koi hisab nahi hota tha.',
      storyP2: 'Humne seedhe ground par jakar feed mill aur mandi ki ground reality ke mutabiq features banaye — jaise bori wazan, moisture deduction aur instant cash counter billing.',
      storyP3: 'Aaj Goyal Business OS ek aisa complete system ban chuka hai jo production se lekar tax return tak har step ko aasan banata hai.',
      missionHeading: 'Hamara Mission aur 4 Bade Pillars',
      values: [
        {
          title: 'Desi Vyapar ke Mutabiq',
          desc: 'Har calculation aur report agro aur feed business ke regular tareeqe ke hisab se setup hai.',
        },
        {
          title: 'Sabke Liye Asaan',
          desc: 'Bade akshar aur clear icons taaki ghar ke bade-bujurg aur naye ladke sab aasaani se chala sakein.',
        },
        {
          title: 'Poori Data Security',
          desc: 'Aapke rates, recipes aur party ledger bank-level encryption ke saath cloud par secure rehte hain.',
        },
        {
          title: 'Latest AI Technology',
          desc: 'Voice commands aur smart AI partner jo aapke business ki bhasha achhi tarah samajhta hai.',
        },
      ],
      teamHeading: 'Leadership Team',
      teamSub: 'Goyal Business OS ko daily behtar banane wale log',
      whyHeading: 'Vyapari Goyal Business OS Kyun Pasand Karte Hain?',
      whyItems: [
        { title: 'Agro Business Ready', desc: 'Quintal, bori, truck kanta aur bardana hisab pehle se set hai.' },
        { title: 'Simple & Advanced Mode', desc: 'Bujurgon ke liye bada simple mode aur accountants ke liye advanced mode.' },
        { title: 'Auto Cloud Backup', desc: 'Har ghante automatic backup taaki computer kharab hone par bhi data safe rahe.' },
        { title: 'Hardware Friendly', desc: 'Thermal receipt printer, barcode aur weight machine ke sath direct connect.' },
        { title: 'Friendly Support', desc: 'Direct phone aur WhatsApp support jab bhi aapko zaroorat ho.' },
        { title: 'No Hidden Charges', desc: 'Transparent pricing jo chote vyapari aur badi mill dono ke budget mein fit aaye.' },
      ],
    },
    auth: {
      loginTitle: 'Welcome Back',
      loginSubtitle: 'Apne business portal mein login karne ke liye details daalein',
      registerTitle: 'Naya Account Banayein',
      registerSubtitle: 'Apne business workspace ke liye nayi profile register karein',
      forgotTitle: 'Password Reset Karein',
      forgotSubtitle: 'Apna registered email daalein, hum password reset link bhejenge',
      tabLogin: 'Login',
      tabRegister: 'Naya Register',
      emailLabel: 'Email Address',
      emailPlaceholder: 'jaise vatsalgoyal71@gmail.com',
      passwordLabel: 'Security Password',
      passwordPlaceholder: 'Apna password daalein',
      confirmPasswordLabel: 'Password Confirm Karein',
      confirmPasswordPlaceholder: 'Wahi password dobara daalein',
      nameLabel: 'Poora Naam',
      namePlaceholder: 'jaise Vatsal Goyal',
      roleLabel: 'Apna Business Role Chunein',
      roleHint: 'Aapki zimmedari ke mutabiq option select karein',
      forgotPasswordLink: 'Password bhool gaye?',
      loginBtn: 'Portal Mein Login Karein',
      registerBtn: 'Naya Account Banayein',
      googleBtn: 'Google se 1-Click Login Karein',
      phoneBtn: 'Mobile No. OTP se Login Karein',
      orDivider: 'ya email password se',
      sendResetBtn: 'Password Reset Link Bhejo',
      backToLogin: 'Login pe Wapas Jayein',
      phoneLabel: '10-Digit Mobile Number',
      phonePlaceholder: '98765 43210',
      otpLabel: '6-Digit OTP Code Daalein',
      otpPlaceholder: '••••••',
      sendOtpBtn: 'OTP Code Bhejo',
      verifyOtpBtn: 'OTP Verify Karke Aage Badhein',
      resendOtp: 'OTP Dobara Bhejo',
      featureBullet1: 'Real-Time Financial Reports aur GST Ready Invoicing',
      featureBullet2: 'Live Godaam aur Silo Stock Tracking',
      featureBullet3: 'Hindi Voice Command Samajhne Wala Smart AI Partner',
      featureBullet4: 'Multi-Role Staff Access aur Encrypted Data Security',
      footerText: 'Secure Firebase Cloud dwara surakshit · All Rights Reserved',
      roles: [
        { id: 'owner', title: 'Owner / Maalik', desc: 'Poore business ka control, munafa, bank hisab aur approvals' },
        { id: 'manager', title: 'Plant Manager', desc: 'Production planning, dispatch aur factory staff monitoring' },
        { id: 'accountant', title: 'Munim Ji / Accountant', desc: 'Khata bahi, GST tax reconciliation, payment balances aur vouchers' },
        { id: 'stock_manager', title: 'Godaam / Stock Incharge', desc: 'Bori counting, raw material aawak-jaawak aur gate pass' },
        { id: 'sales_executive', title: 'Sales Executive', desc: 'Customer order, party khata, payment recovery aur new deals' },
        { id: 'hr_manager', title: 'Staff & Labour HR', desc: 'Attendance, daily deehadi, drivers ka hisab aur advances' },
      ],
    },
  },
};
