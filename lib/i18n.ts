import type { Resource } from "i18next";

export const defaultLanguage = "en";

export const languages = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "zh", label: "Mandarin" },
  { value: "hi", label: "Hindi" },
  { value: "pt", label: "Portuguese" },
  { value: "fr", label: "French" },
  { value: "ar", label: "Arabic" },
  { value: "ja", label: "Japanese" },
  { value: "de", label: "German" },
  { value: "id", label: "Indonesian" },
  { value: "ms", label: "Malay" },
] as const;

export type Language = (typeof languages)[number]["value"];

export const rtlLanguages: readonly Language[] = ["ar"];

export function isRtlLanguage(value: Language): boolean {
  return rtlLanguages.includes(value);
}

export function isLanguage(value: string): value is Language {
  return languages.some((language) => language.value === value);
}

const en = {
  nav: {
    features: "Features",
    listen: "Listen",
    getStarted: "Get Started",
    signIn: "Sign In",
  },
  hero: {
    titleLine1: "Unlock your",
    titleLine2: "productivity",
    description:
      "Through AI-powered email summaries that keep you focused on what matters.",
    cta: "Try it out",
  },
  core: {
    eyebrow: "Audio companion",
    title: "Capture your day. Listen to what matters.",
    description:
      "Eilo doesn't dump another feed on you. It turns email, news, and interests into a calm two-voice briefing you can play anywhere.",
    dailyBrief: {
      title: "Daily Brief",
      description:
        "A personalized briefing shaped around your topics, inbox, and routine—ready when you are.",
    },
    conversationRecall: {
      title: "Conversation Recall",
      description:
        "Two-voice dialogue that explains the story—then lets you go deeper when something matters.",
    },
    emailBriefings: {
      title: "Email Briefings",
      description:
        "Connect Gmail and hear what actually needs your attention without scrolling forever.",
    },
    listenAnywhere: {
      title: "Listen anywhere",
      description:
        "Stay informed while walking, commuting, cooking, or getting ready. Screen optional.",
    },
    liveStations: {
      title: "Live stations & Discover",
      description:
        "Browse shows, follow what you care about, and drop into live audio stations—without the noise of a typical feed.",
    },
    tags: {
      private: "Private",
      automated: "Automated",
      discover: "Discover",
      liveStations: "Live stations",
      personalTopics: "Personal topics",
    },
  },
  listen: {
    eyebrow: "Sources that matter",
    title: "Make sense of your day",
    titleAccent: "out loud",
    description:
      "Connect the inputs you already use. Eilo turns them into a briefing you can actually finish.",
    emailInbox: {
      title: "Email inbox",
      description:
        "Pull the threads that matter from Gmail and hear them as a natural conversation—not a wall of unread.",
    },
    webNews: {
      title: "Web & news",
      description:
        "Follow topics you care about. Eilo curates the signal and narrates it in a calm, conversational style.",
    },
    routine: {
      title: "Your routine",
      description:
        "Weather, hosts, and timing you control—so every brief feels like it was made for how you move through the day.",
    },
  },
  cta: {
    title: "Ready to listen?",
    description:
      "Keep up without looking down. Start your first Eilo briefing in minutes.",
    button: "Get Started",
  },
  footer: {
    description:
      "Your personal audio companion a calmer way to keep up with what matters.",
    product: "Product",
    company: "Company",
    legal: "Legal",
    about: "About",
    privacy: "Privacy Policy",
    copyright: "All rights reserved.",
    language: "Language",
  },
  auth: {
    title: "Sign In",
    screenTitle: "Welcome",
    signInSubtitle: "Sign in to access your AI audio briefings.",
    signUpSubtitle: "Create an account to start your AI audio briefings.",
    tabSignIn: "Sign In",
    tabCreateAccount: "Create Account",
    email: "Email Address",
    emailPlaceholder: "name@eilo.app",
    password: "Password",
    passwordPlaceholder: "••••••••",
    forgotPassword: "Forgot Password?",
    showPassword: "Show password",
    hidePassword: "Hide password",
    submit: "Sign In",
    createAccountSubmit: "Create Account",
    orContinue: "or continue with",
    google: "Google",
    apple: "Apple",
    noAccount: "Don't have an account?",
    createAccount: "Create an account",
    card1Title: "Stay ahead.",
    card1Description:
      "AI briefings that turn email and news into calm listening.",
    card2Title: "Listen anywhere.",
    card2Description:
      "Your day, distilled into audio you can play on the go.",
    back: "Back to home",
    emailRequired: "Email is required.",
    emailInvalid: "Enter a valid email address.",
    code: "Verification code",
    codeSubtitle: "Enter the code we sent to",
    codeRequired: "Verification code is required.",
    codeInvalid: "Enter the 6-digit code from your email.",
    verify: "Verify",
    resendCode: "Resend code",
    startOver: "Use a different email",
    codeSentAgain: "We sent another code to your email.",
    genericError: "Something went wrong. Please try again.",
    createAccountHint: "Enter your email above to create one.",
    accountNotFound: "No account found for that email. Create one instead.",
    accountExists: "That email already has an account. Sign in instead.",
  },
};

const es = {
  nav: {
    features: "Funciones",
    listen: "Escuchar",
    getStarted: "Empezar",
    signIn: "Iniciar sesión",
  },
  hero: {
    titleLine1: "Desbloquea tu",
    titleLine2: "productividad",
    description:
      "Con resúmenes de correo impulsados por IA que te mantienen enfocado en lo que importa.",
    cta: "Probar ahora",
  },
  core: {
    eyebrow: "Compañero de audio",
    title: "Captura tu día. Escucha lo que importa.",
    description:
      "Eilo no te llena de otro feed. Convierte el correo, las noticias y tus intereses en un briefing calmado a dos voces que puedes escuchar en cualquier lugar.",
    dailyBrief: {
      title: "Briefing diario",
      description:
        "Un briefing personalizado según tus temas, bandeja de entrada y rutina—listo cuando tú lo estés.",
    },
    conversationRecall: {
      title: "Recuerdo de conversación",
      description:
        "Un diálogo a dos voces que explica la historia—y te deja profundizar cuando algo importa.",
    },
    emailBriefings: {
      title: "Briefings de correo",
      description:
        "Conecta Gmail y escucha lo que realmente necesita tu atención sin desplazarte sin fin.",
    },
    listenAnywhere: {
      title: "Escucha en cualquier lugar",
      description:
        "Mantente informado mientras caminas, viajas, cocinas o te preparas. Pantalla opcional.",
    },
    liveStations: {
      title: "Estaciones en vivo y Descubrir",
      description:
        "Explora shows, sigue lo que te importa y entra en estaciones de audio en vivo—sin el ruido de un feed típico.",
    },
    tags: {
      private: "Privado",
      automated: "Automatizado",
      discover: "Descubrir",
      liveStations: "Estaciones en vivo",
      personalTopics: "Temas personales",
    },
  },
  listen: {
    eyebrow: "Fuentes que importan",
    title: "Da sentido a tu día",
    titleAccent: "en voz alta",
    description:
      "Conecta las entradas que ya usas. Eilo las convierte en un briefing que realmente puedes terminar.",
    emailInbox: {
      title: "Bandeja de correo",
      description:
        "Extrae los hilos importantes de Gmail y escúchalos como una conversación natural—no como un muro de no leídos.",
    },
    webNews: {
      title: "Web y noticias",
      description:
        "Sigue los temas que te importan. Eilo cura la señal y la narra con un estilo calmado y conversacional.",
    },
    routine: {
      title: "Tu rutina",
      description:
        "Clima, anfitriones y horarios que controlas—para que cada brief se sienta hecho para cómo vives el día.",
    },
  },
  cta: {
    title: "¿Listo para escuchar?",
    description:
      "Mantente al día sin mirar abajo. Empieza tu primer briefing de Eilo en minutos.",
    button: "Empezar",
  },
  footer: {
    description:
      "Tu compañero de audio personal una forma más calmada de seguir lo que importa.",
    product: "Producto",
    company: "Empresa",
    legal: "Legal",
    about: "Acerca de",
    privacy: "Política de privacidad",
    copyright: "Todos los derechos reservados.",
    language: "Idioma",
  },
  auth: {
    title: "Iniciar sesión",
    subtitle:
      "Introduce tus datos para acceder a tus briefings de audio con IA.",
    email: "Correo electrónico",
    emailPlaceholder: "nombre@eilo.app",
    password: "Contraseña",
    passwordPlaceholder: "••••••••",
    forgotPassword: "¿Olvidaste tu contraseña?",
    showPassword: "Mostrar contraseña",
    hidePassword: "Ocultar contraseña",
    submit: "Iniciar sesión",
    orContinue: "o continúa con",
    google: "Google",
    apple: "Apple",
    noAccount: "¿No tienes una cuenta?",
    createAccount: "Crear una cuenta",
    card1Title: "Mantente al día.",
    card1Description:
      "Briefings de IA que convierten email y noticias en audio calmado.",
    card2Title: "Escucha donde sea.",
    card2Description:
      "Tu día, destilado en audio que puedes reproducir en movimiento.",
    back: "Volver al inicio",
  },
};

const zh = {
  nav: {
    features: "功能",
    listen: "收听",
    getStarted: "开始使用",
    signIn: "登录",
  },
  hero: {
    titleLine1: "释放你的",
    titleLine2: "生产力",
    description: "通过 AI 驱动的邮件摘要，让你专注于真正重要的事。",
    cta: "立即试用",
  },
  core: {
    eyebrow: "音频伴侣",
    title: "记录你的一天。收听真正重要的内容。",
    description:
      "Eilo 不会再给你堆一个信息流。它把邮件、新闻和兴趣变成可随时收听的平静双人简报。",
    dailyBrief: {
      title: "每日简报",
      description: "围绕你的主题、收件箱和日程定制的个性化简报——随时就绪。",
    },
    conversationRecall: {
      title: "对话回顾",
      description: "双人对话式讲解故事——当内容重要时，你可以继续深入。",
    },
    emailBriefings: {
      title: "邮件简报",
      description: "连接 Gmail，听出真正需要你关注的内容，无需无限滚动。",
    },
    listenAnywhere: {
      title: "随时随地收听",
      description: "走路、通勤、做饭或准备出门时也能保持知情。屏幕可选。",
    },
    liveStations: {
      title: "直播电台与发现",
      description: "浏览节目、关注你在意的内容，并进入直播音频电台——没有普通信息流的嘈杂。",
    },
    tags: {
      private: "私密",
      automated: "自动化",
      discover: "发现",
      liveStations: "直播电台",
      personalTopics: "个人主题",
    },
  },
  listen: {
    eyebrow: "真正重要的来源",
    title: "理解你的一天",
    titleAccent: "用声音",
    description: "连接你已在使用的输入。Eilo 把它们变成你真正听得完的简报。",
    emailInbox: {
      title: "电子邮箱",
      description: "从 Gmail 提取重要邮件线程，并以自然对话方式收听——而不是未读墙。",
    },
    webNews: {
      title: "网页与新闻",
      description: "关注你关心的主题。Eilo 筛选信号，并以平静、对话式风格讲述。",
    },
    routine: {
      title: "你的日常",
      description: "天气、主持人和你可控制的时间——让每份简报都贴合你的一天。",
    },
  },
  cta: {
    title: "准备好听了吗？",
    description: "不必低头刷屏也能跟上。几分钟即可开始你的第一份 Eilo 简报。",
    button: "开始使用",
  },
  footer: {
    description: "你的个人音频伴侣 更平静地跟上真正重要的事。",
    product: "产品",
    company: "公司",
    legal: "法律",
    about: "关于",
    privacy: "隐私政策",
    copyright: "保留所有权利。",
    language: "语言",
  },
  auth: {
    title: "登录",
    subtitle: "输入信息以访问你的 AI 音频简报。",
    email: "电子邮箱",
    emailPlaceholder: "name@eilo.app",
    password: "密码",
    passwordPlaceholder: "••••••••",
    forgotPassword: "忘记密码？",
    showPassword: "显示密码",
    hidePassword: "隐藏密码",
    submit: "登录",
    orContinue: "或继续使用",
    google: "Google",
    apple: "Apple",
    noAccount: "还没有账户？",
    createAccount: "创建账户",
    card1Title: "保持领先。",
    card1Description: "把邮件和新闻变成平静可听的 AI 简报。",
    card2Title: "随时收听。",
    card2Description: "把一天浓缩成随身可听的音频。",
    back: "返回首页",
  },
};

const hi = {
  nav: {
    features: "विशेषताएँ",
    listen: "सुनें",
    getStarted: "शुरू करें",
    signIn: "साइन इन",
  },
  hero: {
    titleLine1: "खोलें अपनी",
    titleLine2: "उत्पादकता",
    description:
      "AI-संचालित ईमेल सारांश के साथ जो आपको महत्वपूर्ण चीज़ों पर केंद्रित रखते हैं।",
    cta: "आज़माएँ",
  },
  core: {
    eyebrow: "ऑडियो साथी",
    title: "अपना दिन कैप्चर करें। जो ज़रूरी है उसे सुनें।",
    description:
      "Eilo आपको एक और फ़ीड नहीं थमाता। यह ईमेल, समाचार और रुचियों को शांत दो-आवाज़ ब्रीफिंग में बदल देता है।",
    dailyBrief: {
      title: "दैनिक ब्रीफ",
      description:
        "आपके विषयों, इनबॉक्स और दिनचर्या के अनुसार व्यक्तिगत ब्रीफिंग—जब आप तैयार हों।",
    },
    conversationRecall: {
      title: "बातचीत स्मरण",
      description:
        "दो-आवाज़ संवाद जो कहानी समझाता है—फिर जब कुछ महत्वपूर्ण हो तो गहराई में जाने देता है।",
    },
    emailBriefings: {
      title: "ईमेल ब्रीफिंग",
      description:
        "Gmail कनेक्ट करें और सुनें कि सच में किस पर ध्यान देना है—बिना अंतहीन स्क्रॉल के।",
    },
    listenAnywhere: {
      title: "कहीं भी सुनें",
      description:
        "चलते, यात्रा करते, खाना बनाते या तैयार होते समय भी अपडेट रहें। स्क्रीन वैकल्पिक।",
    },
    liveStations: {
      title: "लाइव स्टेशन और खोजें",
      description:
        "शो देखें, जो पसंद है उसे फ़ॉलो करें, और लाइव ऑडियो स्टेशन में जाएँ—बिना आम फ़ीड के शोर के।",
    },
    tags: {
      private: "निजी",
      automated: "स्वचालित",
      discover: "खोजें",
      liveStations: "लाइव स्टेशन",
      personalTopics: "व्यक्तिगत विषय",
    },
  },
  listen: {
    eyebrow: "महत्वपूर्ण स्रोत",
    title: "अपने दिन को समझें",
    titleAccent: "आवाज़ में",
    description:
      "जिन इनपुट का आप पहले से उपयोग करते हैं उन्हें जोड़ें। Eilo उन्हें ऐसी ब्रीफिंग बनाता है जिसे आप पूरा सुन सकते हैं।",
    emailInbox: {
      title: "ईमेल इनबॉक्स",
      description:
        "Gmail से ज़रूरी थ्रेड निकालें और उन्हें स्वाभाविक बातचीत की तरह सुनें—अपठित दीवार की तरह नहीं।",
    },
    webNews: {
      title: "वेब और समाचार",
      description:
        "अपने पसंदीदा विषयों को फ़ॉलो करें। Eilo सिग्नल चुनता है और शांत, संवादी अंदाज़ में सुनाता है।",
    },
    routine: {
      title: "आपकी दिनचर्या",
      description:
        "मौसम, होस्ट और समय आपके नियंत्रण में—ताकि हर ब्रीफ आपके दिन के हिसाब से लगे।",
    },
  },
  cta: {
    title: "सुनने के लिए तैयार?",
    description:
      "नीचे देखे बिना अपडेट रहें। कुछ ही मिनटों में अपनी पहली Eilo ब्रीफिंग शुरू करें।",
    button: "शुरू करें",
  },
  footer: {
    description:
      "आपका व्यक्तिगत ऑडियो साथी जो महत्वपूर्ण है उसे शांति से फॉलो करने का तरीका।",
    product: "उत्पाद",
    company: "कंपनी",
    legal: "कानूनी",
    about: "परिचय",
    privacy: "गोपनीयता नीति",
    copyright: "सर्वाधिकार सुरक्षित।",
    language: "भाषा",
  },
  auth: {
    title: "साइन इन",
    subtitle: "अपने AI ऑडियो ब्रीफिंग तक पहुँचने के लिए विवरण दर्ज करें।",
    email: "ईमेल पता",
    emailPlaceholder: "name@eilo.app",
    password: "पासवर्ड",
    passwordPlaceholder: "••••••••",
    forgotPassword: "पासवर्ड भूल गए?",
    showPassword: "पासवर्ड दिखाएँ",
    hidePassword: "पासवर्ड छिपाएँ",
    submit: "साइन इन",
    orContinue: "या इसके साथ जारी रखें",
    google: "Google",
    apple: "Apple",
    noAccount: "खाता नहीं है?",
    createAccount: "खाता बनाएँ",
    card1Title: "आगे रहें।",
    card1Description:
      "ईमेल और समाचार को शांत सुनने में बदलने वाले AI ब्रीफिंग।",
    card2Title: "कहीं भी सुनें।",
    card2Description: "आपका दिन, चलते-फिरते सुनने योग्य ऑडियो में।",
    back: "होम पर वापस जाएँ",
  },
};

const pt = {
  nav: {
    features: "Recursos",
    listen: "Ouvir",
    getStarted: "Começar",
    signIn: "Entrar",
  },
  hero: {
    titleLine1: "Desbloqueie sua",
    titleLine2: "produtividade",
    description:
      "Com resumos de e-mail com IA que mantêm você focado no que importa.",
    cta: "Experimentar",
  },
  core: {
    eyebrow: "Companheiro de áudio",
    title: "Capture seu dia. Ouça o que importa.",
    description:
      "A Eilo não joga outro feed em você. Transforma e-mail, notícias e interesses em um briefing calmo em duas vozes que você pode ouvir em qualquer lugar.",
    dailyBrief: {
      title: "Briefing diário",
      description:
        "Um briefing personalizado em torno dos seus temas, caixa de entrada e rotina—pronto quando você estiver.",
    },
    conversationRecall: {
      title: "Lembrete de conversa",
      description:
        "Diálogo em duas vozes que explica a história—e deixa você aprofundar quando algo importa.",
    },
    emailBriefings: {
      title: "Briefings de e-mail",
      description:
        "Conecte o Gmail e ouça o que realmente precisa da sua atenção sem rolar para sempre.",
    },
    listenAnywhere: {
      title: "Ouça em qualquer lugar",
      description:
        "Fique informado enquanto caminha, se desloca, cozinha ou se prepara. Tela opcional.",
    },
    liveStations: {
      title: "Estações ao vivo e Descobrir",
      description:
        "Explore programas, siga o que importa e entre em estações de áudio ao vivo—sem o ruído de um feed típico.",
    },
    tags: {
      private: "Privado",
      automated: "Automatizado",
      discover: "Descobrir",
      liveStations: "Estações ao vivo",
      personalTopics: "Tópicos pessoais",
    },
  },
  listen: {
    eyebrow: "Fontes que importam",
    title: "Dê sentido ao seu dia",
    titleAccent: "em voz alta",
    description:
      "Conecte as entradas que você já usa. A Eilo as transforma em um briefing que você realmente consegue terminar.",
    emailInbox: {
      title: "Caixa de e-mail",
      description:
        "Extraia as threads importantes do Gmail e ouça-as como uma conversa natural—não como um muro de não lidos.",
    },
    webNews: {
      title: "Web e notícias",
      description:
        "Siga os temas que importam. A Eilo curadoria o sinal e narra com um estilo calmo e conversacional.",
    },
    routine: {
      title: "Sua rotina",
      description:
        "Clima, apresentadores e horários sob o seu controle—para cada brief parecer feito para o seu dia.",
    },
  },
  cta: {
    title: "Pronto para ouvir?",
    description:
      "Acompanhe sem olhar para baixo. Comece seu primeiro briefing da Eilo em minutos.",
    button: "Começar",
  },
  footer: {
    description:
      "Seu companheiro de áudio pessoal uma forma mais calma de acompanhar o que importa.",
    product: "Produto",
    company: "Empresa",
    legal: "Legal",
    about: "Sobre",
    privacy: "Política de privacidade",
    copyright: "Todos os direitos reservados.",
    language: "Idioma",
  },
  auth: {
    title: "Entrar",
    subtitle:
      "Introduza os seus dados para aceder aos briefings de áudio com IA.",
    email: "Endereço de e-mail",
    emailPlaceholder: "nome@eilo.app",
    password: "Palavra-passe",
    passwordPlaceholder: "••••••••",
    forgotPassword: "Esqueceu a palavra-passe?",
    showPassword: "Mostrar palavra-passe",
    hidePassword: "Ocultar palavra-passe",
    submit: "Entrar",
    orContinue: "ou continue com",
    google: "Google",
    apple: "Apple",
    noAccount: "Não tem uma conta?",
    createAccount: "Criar uma conta",
    card1Title: "Mantenha-se à frente.",
    card1Description:
      "Briefings de IA que transformam e-mail e notícias em áudio calmo.",
    card2Title: "Ouça em qualquer lugar.",
    card2Description:
      "O seu dia, destilado em áudio para ouvir em movimento.",
    back: "Voltar ao início",
  },
};

const fr = {
  nav: {
    features: "Fonctionnalités",
    listen: "Écouter",
    getStarted: "Commencer",
    signIn: "Connexion",
  },
  hero: {
    titleLine1: "Libérez votre",
    titleLine2: "productivité",
    description:
      "Grâce à des résumés d'e-mails alimentés par l'IA qui vous gardent concentré sur l'essentiel.",
    cta: "Essayer",
  },
  core: {
    eyebrow: "Compagnon audio",
    title: "Capturez votre journée. Écoutez ce qui compte.",
    description:
      "Eilo ne vous impose pas un autre fil. Il transforme e-mails, actualités et centres d'intérêt en un briefing calme à deux voix, à écouter partout.",
    dailyBrief: {
      title: "Briefing quotidien",
      description:
        "Un briefing personnalisé autour de vos sujets, boîte de réception et routine—prêt quand vous l'êtes.",
    },
    conversationRecall: {
      title: "Rappel de conversation",
      description:
        "Un dialogue à deux voix qui explique l'histoire—puis vous laisse approfondir quand quelque chose compte.",
    },
    emailBriefings: {
      title: "Briefings e-mail",
      description:
        "Connectez Gmail et entendez ce qui demande vraiment votre attention, sans scroll infini.",
    },
    listenAnywhere: {
      title: "Écoutez partout",
      description:
        "Restez informé en marchant, en trajet, en cuisinant ou en vous préparant. Écran optionnel.",
    },
    liveStations: {
      title: "Stations en direct et Découvrir",
      description:
        "Parcourez les émissions, suivez ce qui vous tient à cœur et rejoignez des stations audio en direct—sans le bruit d'un fil classique.",
    },
    tags: {
      private: "Privé",
      automated: "Automatisé",
      discover: "Découvrir",
      liveStations: "Stations en direct",
      personalTopics: "Sujets personnels",
    },
  },
  listen: {
    eyebrow: "Sources qui comptent",
    title: "Donnez du sens à votre journée",
    titleAccent: "à voix haute",
    description:
      "Connectez les entrées que vous utilisez déjà. Eilo en fait un briefing que vous pouvez vraiment terminer.",
    emailInbox: {
      title: "Boîte e-mail",
      description:
        "Extrayez les fils importants de Gmail et écoutez-les comme une conversation naturelle—pas un mur de non-lus.",
    },
    webNews: {
      title: "Web et actualités",
      description:
        "Suivez les sujets qui comptent. Eilo sélectionne le signal et le raconte d'une voix calme et conversationnelle.",
    },
    routine: {
      title: "Votre routine",
      description:
        "Météo, animateurs et horaires sous votre contrôle—pour que chaque brief semble fait pour votre journée.",
    },
  },
  cta: {
    title: "Prêt à écouter ?",
    description:
      "Restez à jour sans baisser les yeux. Lancez votre premier briefing Eilo en quelques minutes.",
    button: "Commencer",
  },
  footer: {
    description:
      "Votre compagnon audio personnel une façon plus calme de suivre ce qui compte.",
    product: "Produit",
    company: "Entreprise",
    legal: "Mentions légales",
    about: "À propos",
    privacy: "Politique de confidentialité",
    copyright: "Tous droits réservés.",
    language: "Langue",
  },
  auth: {
    title: "Connexion",
    subtitle:
      "Entrez vos informations pour accéder à vos briefings audio IA.",
    email: "Adresse e-mail",
    emailPlaceholder: "nom@eilo.app",
    password: "Mot de passe",
    passwordPlaceholder: "••••••••",
    forgotPassword: "Mot de passe oublié ?",
    showPassword: "Afficher le mot de passe",
    hidePassword: "Masquer le mot de passe",
    submit: "Connexion",
    orContinue: "ou continuer avec",
    google: "Google",
    apple: "Apple",
    noAccount: "Pas encore de compte ?",
    createAccount: "Créer un compte",
    card1Title: "Restez en avance.",
    card1Description:
      "Des briefings IA qui transforment e-mails et actus en écoute calme.",
    card2Title: "Écoutez partout.",
    card2Description: "Votre journée, distillée en audio à emporter.",
    back: "Retour à l'accueil",
  },
};

const ar = {
  nav: {
    features: "الميزات",
    listen: "استمع",
    getStarted: "ابدأ",
    signIn: "تسجيل الدخول",
  },
  hero: {
    titleLine1: "حرّر",
    titleLine2: "إنتاجيتك",
    description:
      "من خلال ملخصات البريد المدعومة بالذكاء الاصطناعي التي تبقيك مركزًا على ما يهم.",
    cta: "جرّبه",
  },
  core: {
    eyebrow: "رفيق صوتي",
    title: "التقط يومك. استمع لما يهم.",
    description:
      "لا يفرض عليك Eilo موجزًا آخر. يحوّل البريد والأخبار واهتماماتك إلى إحاطة هادئة بصوتين يمكنك تشغيلها في أي مكان.",
    dailyBrief: {
      title: "الإحاطة اليومية",
      description:
        "إحاطة مخصصة حول مواضيعك وصندوق الوارد وروتينك—جاهزة عندما تكون أنت جاهزًا.",
    },
    conversationRecall: {
      title: "استرجاع المحادثة",
      description:
        "حوار بصوتين يشرح القصة—ثم يتيح لك التعمق عندما يهمك شيء ما.",
    },
    emailBriefings: {
      title: "إحاطات البريد",
      description:
        "اربط Gmail واستمع لما يحتاج انتباهك فعلًا دون تمرير لا ينتهي.",
    },
    listenAnywhere: {
      title: "استمع في أي مكان",
      description:
        "ابقَ مطلعًا أثناء المشي أو التنقل أو الطبخ أو الاستعداد. الشاشة اختيارية.",
    },
    liveStations: {
      title: "محطات مباشرة واكتشاف",
      description:
        "تصفح العروض وتابع ما تهتم به وادخل محطات صوت مباشرة—بدون ضوضاء الموجزات المعتادة.",
    },
    tags: {
      private: "خاص",
      automated: "آلي",
      discover: "اكتشف",
      liveStations: "محطات مباشرة",
      personalTopics: "مواضيع شخصية",
    },
  },
  listen: {
    eyebrow: "مصادر تهم",
    title: "افهم يومك",
    titleAccent: "بصوت عالٍ",
    description:
      "اربط المدخلات التي تستخدمها بالفعل. يحوّلها Eilo إلى إحاطة يمكنك إنهاؤها فعلًا.",
    emailInbox: {
      title: "صندوق البريد",
      description:
        "اسحب الخيوط المهمة من Gmail واستمع إليها كمحادثة طبيعية—وليس كجدار من غير المقروء.",
    },
    webNews: {
      title: "الويب والأخبار",
      description:
        "تابع المواضيع التي تهمك. ينتقي Eilo الإشارة ويسردها بأسلوب هادئ ومحادث.",
    },
    routine: {
      title: "روتينك",
      description:
        "الطقس والمقدّمون والتوقيت تحت سيطرتك—حتى تشعر كل إحاطة وكأنها صُنعت ليومك.",
    },
  },
  cta: {
    title: "هل أنت مستعد للاستماع؟",
    description:
      "تابع دون أن تنظر للأسفل. ابدأ أول إحاطة من Eilo في دقائق.",
    button: "ابدأ",
  },
  footer: {
    description:
      "رفيقك الصوتي الشخصي طريقة أكثر هدوءًا لمتابعة ما يهم.",
    product: "المنتج",
    company: "الشركة",
    legal: "قانوني",
    about: "حول",
    privacy: "سياسة الخصوصية",
    copyright: "جميع الحقوق محفوظة.",
    language: "اللغة",
  },
  auth: {
    title: "تسجيل الدخول",
    subtitle:
      "أدخل بياناتك للوصول إلى ملخصاتك الصوتية بالذكاء الاصطناعي.",
    email: "البريد الإلكتروني",
    emailPlaceholder: "name@eilo.app",
    password: "كلمة المرور",
    passwordPlaceholder: "••••••••",
    forgotPassword: "نسيت كلمة المرور؟",
    showPassword: "إظهار كلمة المرور",
    hidePassword: "إخفاء كلمة المرور",
    submit: "تسجيل الدخول",
    orContinue: "أو المتابعة مع",
    google: "Google",
    apple: "Apple",
    noAccount: "ليس لديك حساب؟",
    createAccount: "إنشاء حساب",
    card1Title: "ابقَ متقدماً.",
    card1Description:
      "ملخصات ذكاء اصطناعي تحول البريد والأخبار إلى استماع هادئ.",
    card2Title: "استمع في أي مكان.",
    card2Description:
      "يومك ملخصاً في صوت يمكنك تشغيله أثناء التنقل.",
    back: "العودة إلى الرئيسية",
  },
};

const ja = {
  nav: {
    features: "機能",
    listen: "聴く",
    getStarted: "はじめる",
    signIn: "サインイン",
  },
  hero: {
    titleLine1: "解き放て、あなたの",
    titleLine2: "生産性",
    description:
      "AIによるメール要約で、大切なことに集中できるように。",
    cta: "試してみる",
  },
  core: {
    eyebrow: "オーディオコンパニオン",
    title: "一日を捉え、大切なことを聴く。",
    description:
      "Eiloはまた別のフィードを押し付けることはありません。メール、ニュース、関心ごとを、どこでも聴ける穏やかな二人のブリーフィングに変えます。",
    dailyBrief: {
      title: "デイリーブリーフ",
      description:
        "トピック、受信トレイ、ルーティンに合わせたパーソナルなブリーフィング—いつでも準備完了。",
    },
    conversationRecall: {
      title: "会話リコール",
      description:
        "物語を説明する二人の対話—大切なときにはさらに深く掘り下げられます。",
    },
    emailBriefings: {
      title: "メールブリーフィング",
      description:
        "Gmailを接続し、本当に注意が必要なことを、延々とスクロールせずに聴けます。",
    },
    listenAnywhere: {
      title: "どこでも聴ける",
      description:
        "歩きながら、通勤中、料理中、支度中でも情報をキャッチ。画面は任意です。",
    },
    liveStations: {
      title: "ライブステーションとディスカバー",
      description:
        "番組を閲覧し、気になるものをフォローし、ライブ音声ステーションへ—いつものフィードのノイズなしで。",
    },
    tags: {
      private: "プライベート",
      automated: "自動化",
      discover: "ディスカバー",
      liveStations: "ライブステーション",
      personalTopics: "パーソナルトピック",
    },
  },
  listen: {
    eyebrow: "大切なソース",
    title: "一日を理解する",
    titleAccent: "声に出して",
    description:
      "すでに使っている入力をつなげば、Eiloが本当に聴き切れるブリーフィングに変えます。",
    emailInbox: {
      title: "メール受信箱",
      description:
        "Gmailから重要なスレッドを取り出し、未読の壁ではなく自然な会話として聴けます。",
    },
    webNews: {
      title: "ウェブとニュース",
      description:
        "関心のあるトピックをフォロー。Eiloがシグナルを選び、穏やかな会話調で語ります。",
    },
    routine: {
      title: "あなたのルーティン",
      description:
        "天気、ホスト、タイミングはあなた次第—毎日のブリーフが生活の流れに合うように。",
    },
  },
  cta: {
    title: "聴く準備はできましたか？",
    description:
      "下を向かずにキャッチアップ。数分で最初のEiloブリーフィングを始めましょう。",
    button: "はじめる",
  },
  footer: {
    description:
      "あなたのパーソナルオーディオコンパニオン 大切なことを、より穏やかに追い続ける方法。",
    product: "プロダクト",
    company: "会社",
    legal: "法務",
    about: "について",
    privacy: "プライバシーポリシー",
    copyright: "全著作権所有。",
    language: "言語",
  },
  auth: {
    title: "サインイン",
    subtitle:
      "AI音声ブリーフィングにアクセスするための情報を入力してください。",
    email: "メールアドレス",
    emailPlaceholder: "name@eilo.app",
    password: "パスワード",
    passwordPlaceholder: "••••••••",
    forgotPassword: "パスワードをお忘れですか？",
    showPassword: "パスワードを表示",
    hidePassword: "パスワードを隠す",
    submit: "サインイン",
    orContinue: "または次で続行",
    google: "Google",
    apple: "Apple",
    noAccount: "アカウントをお持ちでないですか？",
    createAccount: "アカウントを作成",
    card1Title: "一歩先へ。",
    card1Description:
      "メールとニュースを落ち着いた音声にするAIブリーフィング。",
    card2Title: "どこでも聴く。",
    card2Description: "一日を持ち運べる音声に凝縮。",
    back: "ホームに戻る",
  },
};

const de = {
  nav: {
    features: "Funktionen",
    listen: "Hören",
    getStarted: "Loslegen",
    signIn: "Anmelden",
  },
  hero: {
    titleLine1: "Entfalte deine",
    titleLine2: "Produktivität",
    description:
      "Mit KI-gestützten E-Mail-Zusammenfassungen, die dich auf das Wesentliche fokussieren.",
    cta: "Ausprobieren",
  },
  core: {
    eyebrow: "Audio-Begleiter",
    title: "Erfasse deinen Tag. Höre, was zählt.",
    description:
      "Eilo wirft dir keinen weiteren Feed vor. Es verwandelt E-Mails, Nachrichten und Interessen in ein ruhiges Zwei-Stimmen-Briefing, das du überall abspielen kannst.",
    dailyBrief: {
      title: "Tägliches Briefing",
      description:
        "Ein persönliches Briefing rund um deine Themen, dein Postfach und deine Routine—bereit, wenn du es bist.",
    },
    conversationRecall: {
      title: "Gesprächserinnerung",
      description:
        "Ein Dialog mit zwei Stimmen, der die Geschichte erklärt—und dich tiefer gehen lässt, wenn etwas zählt.",
    },
    emailBriefings: {
      title: "E-Mail-Briefings",
      description:
        "Verbinde Gmail und höre, was wirklich deine Aufmerksamkeit braucht—ohne endloses Scrollen.",
    },
    listenAnywhere: {
      title: "Überall hören",
      description:
        "Bleib informiert beim Gehen, Pendeln, Kochen oder Fertigmachen. Bildschirm optional.",
    },
    liveStations: {
      title: "Live-Stationen & Entdecken",
      description:
        "Durchstöbere Shows, folge dem, was dich interessiert, und spring in Live-Audio-Stationen—ohne den Lärm eines typischen Feeds.",
    },
    tags: {
      private: "Privat",
      automated: "Automatisiert",
      discover: "Entdecken",
      liveStations: "Live-Stationen",
      personalTopics: "Persönliche Themen",
    },
  },
  listen: {
    eyebrow: "Quellen, die zählen",
    title: "Verstehe deinen Tag",
    titleAccent: "laut",
    description:
      "Verbinde die Eingaben, die du schon nutzt. Eilo macht daraus ein Briefing, das du wirklich zu Ende hören kannst.",
    emailInbox: {
      title: "E-Mail-Posteingang",
      description:
        "Hole die wichtigen Threads aus Gmail und höre sie als natürliches Gespräch—nicht als Wand ungelesener Mails.",
    },
    webNews: {
      title: "Web & Nachrichten",
      description:
        "Folge Themen, die dich interessieren. Eilo filtert das Signal und erzählt es ruhig und gesprächig.",
    },
    routine: {
      title: "Deine Routine",
      description:
        "Wetter, Hosts und Timing unter deiner Kontrolle—damit jedes Brief sich anfühlt, als wäre es für deinen Tag gemacht.",
    },
  },
  cta: {
    title: "Bereit zum Hören?",
    description:
      "Bleib auf dem Laufenden, ohne nach unten zu schauen. Starte dein erstes Eilo-Briefing in Minuten.",
    button: "Loslegen",
  },
  footer: {
    description:
      "Dein persönlicher Audio-Begleiter ein ruhigerer Weg, dem zu folgen, was zählt.",
    product: "Produkt",
    company: "Unternehmen",
    legal: "Rechtliches",
    about: "Über uns",
    privacy: "Datenschutzrichtlinie",
    copyright: "Alle Rechte vorbehalten.",
    language: "Sprache",
  },
  auth: {
    title: "Anmelden",
    subtitle:
      "Gib deine Daten ein, um auf deine KI-Audio-Briefings zuzugreifen.",
    email: "E-Mail-Adresse",
    emailPlaceholder: "name@eilo.app",
    password: "Passwort",
    passwordPlaceholder: "••••••••",
    forgotPassword: "Passwort vergessen?",
    showPassword: "Passwort anzeigen",
    hidePassword: "Passwort verbergen",
    submit: "Anmelden",
    orContinue: "oder weiter mit",
    google: "Google",
    apple: "Apple",
    noAccount: "Noch kein Konto?",
    createAccount: "Konto erstellen",
    card1Title: "Bleib voraus.",
    card1Description:
      "KI-Briefings, die E-Mail und News in ruhiges Hören verwandeln.",
    card2Title: "Überall zuhören.",
    card2Description: "Dein Tag, verdichtet zu Audio für unterwegs.",
    back: "Zurück zur Startseite",
  },
};

const id = {
  nav: {
    features: "Fitur",
    listen: "Dengarkan",
    getStarted: "Mulai",
    signIn: "Masuk",
  },
  hero: {
    titleLine1: "Buka",
    titleLine2: "produktivitasmu",
    description:
      "Dengan ringkasan email bertenaga AI yang membuatmu fokus pada yang penting.",
    cta: "Coba sekarang",
  },
  core: {
    eyebrow: "Pendamping audio",
    title: "Tangkap harimu. Dengarkan yang penting.",
    description:
      "Eilo tidak membebanimu dengan feed lain. Ia mengubah email, berita, dan minat menjadi briefing dua suara yang tenang yang bisa diputar di mana saja.",
    dailyBrief: {
      title: "Brief harian",
      description:
        "Briefing personal berdasarkan topik, kotak masuk, dan rutinitasmu—siap kapan pun kamu siap.",
    },
    conversationRecall: {
      title: "Ingatan percakapan",
      description:
        "Dialog dua suara yang menjelaskan cerita—lalu membiarkanmu menggali lebih dalam saat ada yang penting.",
    },
    emailBriefings: {
      title: "Briefing email",
      description:
        "Hubungkan Gmail dan dengarkan apa yang benar-benar perlu perhatianmu tanpa menggulir tanpa henti.",
    },
    listenAnywhere: {
      title: "Dengarkan di mana saja",
      description:
        "Tetap terinformasi saat berjalan, commuting, memasak, atau bersiap. Layar opsional.",
    },
    liveStations: {
      title: "Stasiun langsung & Temukan",
      description:
        "Jelajahi acara, ikuti yang kamu pedulikan, dan masuk ke stasiun audio langsung—tanpa kebisingan feed biasa.",
    },
    tags: {
      private: "Privat",
      automated: "Otomatis",
      discover: "Temukan",
      liveStations: "Stasiun langsung",
      personalTopics: "Topik pribadi",
    },
  },
  listen: {
    eyebrow: "Sumber yang penting",
    title: "Pahami harimu",
    titleAccent: "dengan suara",
    description:
      "Hubungkan input yang sudah kamu gunakan. Eilo mengubahnya menjadi briefing yang benar-benar bisa kamu selesaikan.",
    emailInbox: {
      title: "Kotak email",
      description:
        "Ambil utas penting dari Gmail dan dengarkan sebagai percakapan alami—bukan dinding belum dibaca.",
    },
    webNews: {
      title: "Web & berita",
      description:
        "Ikuti topik yang kamu pedulikan. Eilo menyaring sinyal dan menceritakannya dengan gaya tenang dan percakapan.",
    },
    routine: {
      title: "Rutinitasmu",
      description:
        "Cuaca, host, dan waktu yang kamu kendalikan—agar setiap brief terasa dibuat untuk cara kamu menjalani hari.",
    },
  },
  cta: {
    title: "Siap mendengarkan?",
    description:
      "Tetap update tanpa menunduk. Mulai briefing Eilo pertamamu dalam hitungan menit.",
    button: "Mulai",
  },
  footer: {
    description:
      "Pendamping audio pribadimu cara lebih tenang untuk mengikuti yang penting.",
    product: "Produk",
    company: "Perusahaan",
    legal: "Legal",
    about: "Tentang",
    privacy: "Kebijakan privasi",
    copyright: "Hak cipta dilindungi.",
    language: "Bahasa",
  },
  auth: {
    title: "Masuk",
    subtitle: "Masukkan detail Anda untuk mengakses briefing audio AI.",
    email: "Alamat email",
    emailPlaceholder: "nama@eilo.app",
    password: "Kata sandi",
    passwordPlaceholder: "••••••••",
    forgotPassword: "Lupa kata sandi?",
    showPassword: "Tampilkan kata sandi",
    hidePassword: "Sembunyikan kata sandi",
    submit: "Masuk",
    orContinue: "atau lanjutkan dengan",
    google: "Google",
    apple: "Apple",
    noAccount: "Belum punya akun?",
    createAccount: "Buat akun",
    card1Title: "Tetap unggul.",
    card1Description:
      "Briefing AI yang mengubah email dan berita menjadi audio tenang.",
    card2Title: "Dengarkan di mana saja.",
    card2Description:
      "Harimu, diringkas menjadi audio yang bisa diputar di perjalanan.",
    back: "Kembali ke beranda",
  },
};

const ms = {
  nav: {
    features: "Ciri",
    listen: "Dengar",
    getStarted: "Mulakan",
    signIn: "Log masuk",
  },
  hero: {
    titleLine1: "Buka",
    titleLine2: "produktiviti anda",
    description:
      "Melalui ringkasan e-mel berkuasa AI yang mengekalkan fokus anda pada perkara penting.",
    cta: "Cuba sekarang",
  },
  core: {
    eyebrow: "Rakan audio",
    title: "Tangkap hari anda. Dengar apa yang penting.",
    description:
      "Eilo tidak membebankan anda dengan suapan lain. Ia menukar e-mel, berita dan minat kepada taklimat dua suara yang tenang yang boleh dimainkan di mana-mana.",
    dailyBrief: {
      title: "Taklimat harian",
      description:
        "Taklimat peribadi berdasarkan topik, peti masuk dan rutin anda—sedia bila anda bersedia.",
    },
    conversationRecall: {
      title: "Ingatan perbualan",
      description:
        "Dialog dua suara yang menerangkan cerita—kemudian membiarkan anda mendalami apabila sesuatu penting.",
    },
    emailBriefings: {
      title: "Taklimat e-mel",
      description:
        "Sambungkan Gmail dan dengar apa yang benar-benar memerlukan perhatian anda tanpa menatal tanpa henti.",
    },
    listenAnywhere: {
      title: "Dengar di mana-mana",
      description:
        "Kekal dimaklumkan semasa berjalan, bertolak, memasak atau bersiap. Skrin pilihan.",
    },
    liveStations: {
      title: "Stesen langsung & Temui",
      description:
        "Layari rancangan, ikuti apa yang anda peduli, dan masuk ke stesen audio langsung—tanpa hingar suapan biasa.",
    },
    tags: {
      private: "Peribadi",
      automated: "Automatik",
      discover: "Temui",
      liveStations: "Stesen langsung",
      personalTopics: "Topik peribadi",
    },
  },
  listen: {
    eyebrow: "Sumber yang penting",
    title: "Fahami hari anda",
    titleAccent: "dengan suara",
    description:
      "Sambungkan input yang sudah anda gunakan. Eilo menukarkannya kepada taklimat yang benar-benar boleh anda habiskan.",
    emailInbox: {
      title: "Peti e-mel",
      description:
        "Ambil benang penting dari Gmail dan dengar sebagai perbualan semula jadi—bukan dinding belum dibaca.",
    },
    webNews: {
      title: "Web & berita",
      description:
        "Ikuti topik yang anda peduli. Eilo memilih isyarat dan menceritakannya dengan gaya tenang dan perbualan.",
    },
    routine: {
      title: "Rutin anda",
      description:
        "Cuaca, hos dan masa di bawah kawalan anda—supaya setiap taklimat terasa dibuat untuk cara anda menjalani hari.",
    },
  },
  cta: {
    title: "Sedia untuk mendengar?",
    description:
      "Kekal mengikuti tanpa menunduk. Mulakan taklimat Eilo pertama anda dalam beberapa minit.",
    button: "Mulakan",
  },
  footer: {
    description:
      "Rakan audio peribadi anda cara yang lebih tenang untuk mengikuti perkara penting.",
    product: "Produk",
    company: "Syarikat",
    legal: "Undang-undang",
    about: "Mengenai",
    privacy: "Dasar privasi",
    copyright: "Hak cipta terpelihara.",
    language: "Bahasa",
  },
  auth: {
    title: "Log masuk",
    subtitle: "Masukkan butiran anda untuk mengakses taklimat audio AI.",
    email: "Alamat e-mel",
    emailPlaceholder: "nama@eilo.app",
    password: "Kata laluan",
    passwordPlaceholder: "••••••••",
    forgotPassword: "Lupa kata laluan?",
    showPassword: "Tunjukkan kata laluan",
    hidePassword: "Sembunyikan kata laluan",
    submit: "Log masuk",
    orContinue: "atau teruskan dengan",
    google: "Google",
    apple: "Apple",
    noAccount: "Belum ada akaun?",
    createAccount: "Cipta akaun",
    card1Title: "Kekal di hadapan.",
    card1Description:
      "Taklimat AI yang menukar e-mel dan berita menjadi audio tenang.",
    card2Title: "Dengar di mana-mana.",
    card2Description:
      "Hari anda, disuling menjadi audio untuk dibawa pergi.",
    back: "Kembali ke laman utama",
  },
};

export const resources: Resource = {
  en: { translation: en },
  es: { translation: es },
  zh: { translation: zh },
  hi: { translation: hi },
  pt: { translation: pt },
  fr: { translation: fr },
  ar: { translation: ar },
  ja: { translation: ja },
  de: { translation: de },
  id: { translation: id },
  ms: { translation: ms },
};
