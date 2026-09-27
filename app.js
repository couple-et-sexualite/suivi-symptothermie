const MUCUS_LABELS = {
  'regles': 'Règles',
  'spotting': 'Spotting',
  'sec': 'Sec',
  'collante': 'Collante',
  'cremeuse': 'Crémeuse',
  'blanc-oeuf': "Blanc d'œuf"
};
const MUCUS_COLORS = {
  'regles': 'var(--period-color)',
  'spotting': 'var(--spotting-color)',
  'sec': 'var(--dry-color)',
  'collante': 'var(--sticky-color)',
  'cremeuse': 'var(--creamy-color)',
  'blanc-oeuf': 'var(--egg-white-color)'
};
const CURRENT_KEY = 'symptothermie_current_cycle';
const HISTORY_KEY = 'symptothermie_history';
const LEARNING_KEY = 'symptothermie_learning_progress';
const LEARNING_VERSION = 1;
const MODULE_TRANSLATIONS={
en:[{title:'Understand the cycle',summary:'Main phases and variability.',body:"<p>A cycle can include menstruation, a pre-ovulatory period, ovulation and a post-ovulatory period.</p><p>Record what you observe rather than expecting one normal duration.</p>",q:'Do cycle phases always last the same amount of time?',options:['Yes, for everyone','No, they can vary'],explain:'Cycles and their phases can vary.'},{title:'Understand fertility',summary:'Several signs and their limits.',body:"<p>The symptothermal approach observes several signs, such as cervical mucus and temperature.</p><p>The app records observations but does not replace professional interpretation.</p>",q:'What does an app mainly do?',options:['Replace contextual interpretation','Help record observations, with limits'],explain:'An app is a tracking tool.'},{title:'Observe cervical mucus',summary:'Describe observations without diagnosing.',body:"<p>Record sensations and appearance such as dry, sticky, creamy, wet, slippery, clear or stretchy.</p>",q:'Mucus categories are mainly…',options:['a diagnosis','observation references'],explain:'They describe observations and do not diagnose.'},{title:'Take your temperature',summary:'Regularity and disturbed measurements.',body:"<p>Measure at rest when possible under similar conditions. Fever, illness, alcohol, unusual schedules and poor sleep can affect a measurement.</p>",q:'Why identify a disturbed temperature?',options:['To review it with its context','To automatically conclude ovulation'],explain:'Context helps avoid overinterpreting an isolated value.'},{title:'Read your chart',summary:'Axes, missing data and context.',body:"<p>Read the day axis and temperature axis. Do not invent missing values. Keep relevant context for measurements.</p>",q:'To read a chart correctly, you should…',options:['Invent missing values','Observe axes, missing data and context'],explain:'Distinguish recorded data, missing data and affected measurements.'},{title:'Understand the thermal shift',summary:'A sustained temperature rise as a descriptive reference.',body:"<p>A sustained temperature rise may be shown as a descriptive reference.</p><p>A rise does not by itself prove ovulation.</p>",q:'A sustained rise is…',options:['Automatic proof of ovulation','A descriptive reference needing context'],explain:'It describes a temperature change and does not prove ovulation by itself.'},{title:'Special situations',summary:'When observation becomes more complex.',body:"<p>Illness, fever, disturbed sleep, travel, alcohol, medication, postpartum, breastfeeding and perimenopause can complicate interpretation.</p>",q:'When interpretation is complex, it is preferable to…',options:['Follow an automatic protocol','Seek competent guidance'],explain:'Special contexts call for appropriate support.'},{title:'Practice',summary:'Exercises to separate observation from interpretation.',body:"<p>Describe observations, record context, read the chart carefully and do not invent missing data.</p>",q:'What habit do these exercises encourage?',options:['Describe data and context before interpreting','Turn every observation into an automatic conclusion'],explain:'Separate recorded data from interpretation.'}],
es:[
{title:'Comprender el ciclo',summary:'Las grandes fases y su variabilidad.',body:`<p>Un ciclo puede incluir la menstruación, un período previo a la ovulación, la ovulación y un período posterior. Estos momentos no duran igual en todas las personas ni en todos los ciclos.</p><p>Las observaciones pueden variar. Es preferible anotar lo que se observa en lugar de esperar una duración «normal».</p>`,q:'¿Las fases del ciclo duran siempre lo mismo?',options:['Sí, para todo el mundo','No, pueden variar según la persona y el ciclo'],explain:'Los ciclos y sus fases pueden variar. Los datos sirven para observar, no para imponer una duración universal.'},
{title:'Comprender la fertilidad',summary:'Observar varios signos y conocer sus límites.',body:`<p>La fertilidad puede variar durante un ciclo. La sintotermia observa varios signos, como el moco cervical y la temperatura, en lugar de basarse solo en un calendario.</p><p>Una aplicación ayuda a registrar datos, pero no conoce todo el contexto ni sustituye la interpretación profesional. No ofrece «días seguros» ni recomendaciones anticonceptivas.</p>`,q:'¿Qué describe mejor una aplicación digital?',options:['Sustituye la interpretación contextual','Ayuda a registrar observaciones, con límites'],explain:'Una aplicación es una herramienta de seguimiento y no sustituye una interpretación completa.'},
{title:'Observar el moco cervical',summary:'Describir sensaciones y aspecto sin diagnosticar.',body:`<p>Puedes anotar sensación seca o ausencia de moco, así como observaciones pegajosas, cremosas, húmedas, resbaladizas, transparentes o elásticas.</p><p>Estas categorías son referencias descriptivas y no constituyen un diagnóstico.</p>`,q:'Las categorías del moco son principalmente…',options:['un diagnóstico','referencias de observación'],explain:'Ayudan a describir una sensación o un aspecto; por sí solas no diagnostican una situación.'},
{title:'Tomar la temperatura',summary:'Regularidad, sueño y mediciones alteradas.',body:`<p>La temperatura basal se mide en reposo y, cuando es posible, en condiciones similares. La hora y unas condiciones de sueño comparables ayudan a observar la evolución.</p><p>La fiebre o enfermedad, el alcohol, horarios inusuales y el sueño insuficiente pueden alterar una medición. Anotar el contexto ayuda a interpretarla con prudencia.</p>`,q:'¿Por qué identificar una temperatura alterada?',options:['Para revisarla teniendo en cuenta su contexto','Para concluir automáticamente que hubo ovulación'],explain:'El contexto evita sobreinterpretar un valor aislado.'},
{title:'Leer el gráfico',summary:'Leer los ejes, los datos que faltan y el contexto.',body:`<p>El eje horizontal sitúa las observaciones en el tiempo y el vertical muestra las temperaturas registradas.</p><p>No inventes valores cuando falta una medición. Anota los factores que pueden hacer una temperatura menos comparable y observa la evolución general en lugar de una sola cifra.</p><p class="notice"><strong>Importante:</strong> el gráfico organiza observaciones; no es un diagnóstico ni determina por sí solo qué ocurre en el ciclo.</p>`,q:'Para leer correctamente un gráfico hay que…',options:['inventar los valores que faltan','observar los ejes, los datos faltantes y el contexto'],explain:'Hay que distinguir datos registrados, datos ausentes y mediciones que pueden estar alteradas.'},
{title:'Comprender el cambio térmico',summary:'El principio general de una subida sostenida de temperatura.',body:`<p>Una subida sostenida de las temperaturas puede mostrarse como referencia descriptiva cuando los datos cumplen los criterios de la aplicación.</p><p>Una subida no demuestra por sí sola una ovulación. La interpretación depende del contexto y del método utilizado.</p>`,q:'Una subida sostenida mostrada por la aplicación es…',options:['una prueba automática de ovulación','una referencia descriptiva que debe interpretarse en contexto'],explain:'Describe una evolución de las temperaturas y no permite concluir automáticamente que hubo ovulación.'},
{title:'Situaciones particulares',summary:'Cuando la observación se vuelve más compleja.',body:`<p>Enfermedad, fiebre, sueño alterado, cambios de horario, viajes, alcohol o medicamentos pueden modificar las observaciones. El posparto, la lactancia, el abandono reciente de anticonceptivos hormonales y la perimenopausia también pueden complicar la interpretación.</p><p>En estas situaciones, busca orientación profesional cuando la interpretación sea compleja. La aplicación no ofrece un protocolo médico personalizado.</p>`,q:'Ante una interpretación compleja, es preferible…',options:['seguir un protocolo automático','buscar orientación competente'],explain:'Un contexto particular merece un acompañamiento adaptado, no una regla automática.'},
{title:'Práctica',summary:'Ejercicios para distinguir observación e interpretación.',body:`<p><strong>Ejercicio 1 — Moco:</strong> describe la sensación y el aspecto observados sin atribuirles automáticamente un significado.</p><p><strong>Ejercicio 2 — Temperatura alterada:</strong> conserva la medición y registra el factor perturbador.</p><p><strong>Ejercicio 3 — Gráfico:</strong> lee por separado el eje de los días y el de las temperaturas antes de observar la evolución.</p><p><strong>Ejercicio 4 — Observación o interpretación:</strong> «36,8 °C a las 6:30» es una observación; una conclusión sobre la ovulación es una interpretación.</p><p><strong>Ejercicio 5 — Dato faltante:</strong> no inventes ni estimes una temperatura ausente.</p>`,q:'¿Qué reflejo es común a estos ejercicios?',options:['describir los datos y su contexto antes de interpretarlos','convertir cada observación en una conclusión automática'],explain:'La buena práctica es conservar las observaciones, reconocer los límites y separar los datos de su interpretación.'}
],
ar:[
{title:'فهم الدورة',summary:'المراحل الأساسية وتنوعها.',body:`<p>قد تتضمن الدورة الحيض وفترة قبل الإباضة والإباضة وفترة بعدها. لا تكون هذه المراحل متطابقة في مدتها لدى الجميع أو في كل دورة.</p><p>قد تختلف الملاحظات من دورة إلى أخرى. من الأفضل تسجيل ما تلاحظينه بدل افتراض مدة «طبيعية» واحدة.</p>`,q:'هل تدوم مراحل الدورة دائمًا المدة نفسها؟',options:['نعم لدى الجميع','لا، قد تختلف حسب الشخص والدورة'],explain:'يمكن أن تختلف الدورات ومراحلها. تساعد الملاحظات على المتابعة ولا تفرض مدة موحدة.'},
{title:'فهم الخصوبة',summary:'ملاحظة عدة علامات ومعرفة الحدود.',body:`<p>قد تتغير الخصوبة خلال الدورة. تعتمد المتابعة الحرارية العرضية على ملاحظة عدة علامات مثل مخاط عنق الرحم ودرجة الحرارة، وليس على التقويم وحده.</p><p>يساعد التطبيق على تسجيل البيانات، لكنه لا يعرف كل السياق ولا يحل محل التفسير المتخصص. ولا يقدم «أيامًا آمنة» أو توصيات لمنع الحمل.</p>`,q:'ما الوصف الأدق للتطبيق الرقمي؟',options:['يحل محل التفسير في السياق','يساعد على تسجيل الملاحظات مع وجود حدود'],explain:'التطبيق أداة للمتابعة ولا يحل محل التفسير الكامل أو المرافقة المختصة.'},
{title:'ملاحظة مخاط عنق الرحم',summary:'وصف الإحساس والمظهر دون تشخيص.',body:`<p>يمكن تسجيل الإحساس بالجفاف أو غياب المخاط، وكذلك الملاحظات اللزجة والكريمية والرطبة والزَلِقة والشفافة والقابلة للتمدد.</p><p>هذه الفئات أوصاف للملاحظة وليست تشخيصًا.</p>`,q:'فئات المخاط هي أساسًا…',options:['تشخيصًا','مراجع للملاحظة'],explain:'تساعد على وصف الإحساس أو المظهر، ولا تشخّص الحالة بمفردها.'},
{title:'قياس درجة الحرارة',summary:'الانتظام والنوم والقياسات المتأثرة.',body:`<p>تُقاس درجة الحرارة الأساسية في الراحة، ويفضل في ظروف متقاربة قدر الإمكان. يساعد وقت القياس وظروف النوم المتشابهة على ملاحظة التغير.</p><p>قد تؤثر الحمى أو المرض والكحول وتغير المواعيد وقلة النوم في القياس. تسجيل السياق يساعد على قراءته بحذر.</p>`,q:'لماذا نسجل وجود قياس متأثر؟',options:['لإعادة قراءته مع مراعاة سياقه','للاستنتاج تلقائيًا بحدوث الإباضة'],explain:'السياق يساعد على تجنب المبالغة في تفسير قيمة منفردة.'},
{title:'قراءة الرسم البياني',summary:'قراءة المحاور والبيانات الناقصة والسياق.',body:`<p>يحدد المحور الأفقي الأيام أو التواريخ، ويعرض المحور العمودي درجات الحرارة المسجلة.</p><p>لا تخترعي قيمة عند غياب قياس. سجلي العوامل التي قد تجعل القياس أقل قابلية للمقارنة، وراقبي الاتجاه العام بدل قيمة واحدة.</p><p class="notice"><strong>مهم:</strong> الرسم ينظم الملاحظات ولا يمثل تشخيصًا ولا يحدد بمفرده ما يحدث في الدورة.</p>`,q:'لقراءة الرسم البياني بشكل صحيح ينبغي…',options:['اختراع القيم الناقصة','ملاحظة المحاور والبيانات الناقصة وسياق القياسات'],explain:'يجب التمييز بين البيانات المسجلة والناقصة والقياسات التي قد تكون متأثرة.'},
{title:'فهم التحول الحراري',summary:'المبدأ العام لارتفاع مستمر في درجات الحرارة.',body:`<p>قد يظهر ارتفاع مستمر في درجات الحرارة كمرجع وصفي عندما تستوفي البيانات معايير التطبيق.</p><p>الارتفاع وحده لا يثبت حدوث الإباضة. يعتمد التفسير على السياق والطريقة المستخدمة.</p>`,q:'الارتفاع المستمر الذي يعرضه التطبيق هو…',options:['دليل تلقائي على الإباضة','مرجع وصفي يحتاج إلى تفسير في سياقه'],explain:'إنه يصف تغيرًا في درجات الحرارة ولا يسمح وحده بالاستنتاج التلقائي بحدوث الإباضة.'},
{title:'حالات خاصة',summary:'عندما تصبح الملاحظة أكثر تعقيدًا.',body:`<p>قد تؤثر الأمراض والحمى واضطراب النوم وتغير المواعيد والسفر والكحول والأدوية في الملاحظات. كما قد تجعل فترة ما بعد الولادة والرضاعة والتوقف الحديث عن موانع الحمل الهرمونية وما حول سن اليأس التفسير أكثر تعقيدًا.</p><p>في هذه الحالات، اطلبي رأي مختصة أو مختص مؤهل عندما يكون التفسير معقدًا. لا يقدم التطبيق بروتوكولًا طبيًا شخصيًا.</p>`,q:'عند وجود تفسير معقد، من الأفضل…',options:['اتباع بروتوكول تلقائي','طلب مرافقة مختصة'],explain:'السياق الخاص يحتاج إلى مرافقة مناسبة وليس قاعدة تلقائية.'},
{title:'تطبيق عملي',summary:'تمارين للتمييز بين الملاحظة والتفسير.',body:`<p><strong>تمرين 1 — المخاط:</strong> صفي الإحساس والمظهر كما لاحظتهما دون إسناد معنى تلقائي.</p><p><strong>تمرين 2 — حرارة متأثرة:</strong> احتفظي بالقياس وسجلي العامل المؤثر.</p><p><strong>تمرين 3 — الرسم:</strong> اقرئي محور الأيام ومحور الحرارة كلًا على حدة ثم راقبي تطور النقاط.</p><p><strong>تمرين 4 — ملاحظة أم تفسير:</strong> «36.8°م الساعة 6:30» ملاحظة؛ أما الاستنتاج بشأن الإباضة فهو تفسير.</p><p><strong>تمرين 5 — بيانات ناقصة:</strong> لا تخترعي أو تقدري درجة حرارة غير مسجلة.</p>`,q:'ما السلوك المشترك في هذه التمارين؟',options:['وصف البيانات وسياقها قبل تفسيرها','تحويل كل ملاحظة إلى نتيجة تلقائية'],explain:'الممارسة الجيدة تحفظ الملاحظات وتوضح حدودها وتفصل البيانات عن تفسيرها.'}
]};
function localizedModules(){const lang=getLanguage(); if(lang==='fr') return MODULES; const tr=MODULE_TRANSLATIONS[lang]||MODULE_TRANSLATIONS.fr; return MODULES.map((m,i)=>{const t=tr[i]||{}; return {...m,title:t.title||m.title,summary:t.summary||m.summary,body:t.body||m.body,quiz:{...m.quiz,q:t.q||m.quiz.q,options:t.options||m.quiz.options,explain:t.explain||m.quiz.explain}};});}
const MODULES = [
  {id:'m1', title:'Comprendre le cycle', summary:'Les grandes phases et leur variabilité.', body:`<p>Un cycle peut inclure les règles, une période pré-ovulatoire, un événement biologique appelé ovulation, puis une période post-ovulatoire. Ces repères ne se présentent pas de façon identique chez toutes les personnes ni à chaque cycle.</p><p>Les règles correspondent à un saignement menstruel. Les observations avant et après l’ovulation peuvent varier ; il est préférable de noter ce qui est observé plutôt que d’attendre une durée « normale ».</p>`, quiz:{q:'Les phases du cycle ont-elles toujours la même durée ?', options:['Oui, chez tout le monde','Non, elles peuvent varier selon les personnes et les cycles'], answer:1, explain:'Les cycles et leurs phases peuvent varier. Les repères servent à observer, non à imposer une durée universelle.'}},
  {id:'m2', title:'Comprendre la fertilité', summary:'Observer plusieurs signes et connaître les limites.', body:`<p>La fertilité peut varier au cours d’un cycle. La symptothermie repose sur l’observation de plusieurs signes, par exemple la glaire et la température, plutôt que sur un calendrier seul.</p><p>Observer consiste à décrire ce qui est présent ; interpréter consiste à donner un sens à ces données. Une application peut organiser des données mais ne connaît ni votre contexte complet ni la méthode que vous utilisez. Elle ne fournit pas de « jours sûrs » ni de recommandation contraceptive.</p>`, quiz:{q:'Quel énoncé décrit le mieux une application numérique ?', options:['Elle remplace l’interprétation dans son contexte','Elle aide à consigner des observations, avec des limites'], answer:1, explain:'Une application est un outil de suivi. Elle ne remplace pas une interprétation complète ou un accompagnement compétent.'}},
  {id:'m3', title:'Observer la glaire cervicale', summary:'Décrire les sensations et l’aspect sans diagnostic.', body:`<p>Vous pouvez noter une sensation sèche ou une absence de glaire, ou des observations collantes, crémeuses, humides, glissantes, transparentes ou étirables. Ces catégories sont des repères pour décrire une observation.</p><p>Une même personne peut observer des variations, et les descriptions ne sont pas un diagnostic. L’important est de consigner ce que vous remarquez avec vos propres mots si besoin.</p>`, quiz:{q:'Les catégories de glaire sont avant tout…', options:['un diagnostic','des repères d’observation'], answer:1, explain:'Ces mots aident à décrire une sensation ou un aspect ; ils ne permettent pas à eux seuls de diagnostiquer une situation.'}},
  {id:'m4', title:'Prendre sa température', summary:'Régularité, sommeil et mesures perturbées.', body:`<p>La température basale correspond à une mesure prise au repos, dans des conditions aussi régulières que possible. L’heure de mesure et des conditions de sommeil comparables facilitent l’observation d’une évolution.</p><p>Fièvre ou maladie, alcool, horaires inhabituels et sommeil insuffisant peuvent perturber une mesure. Les identifier dans une note aide à relire le graphique avec prudence ; une donnée perturbée n’est pas une erreur à cacher.</p>`, quiz:{q:'Pourquoi identifier une température perturbée ?', options:['Pour pouvoir la relire avec son contexte','Pour conclure automatiquement à une ovulation'], answer:0, explain:'Identifier le contexte évite de surinterpréter une valeur isolée. Cela ne permet pas de conclure automatiquement.'}},
  {id:'m5', title:'Lire son graphique', summary:'Lire les axes, repérer les manques, les perturbations et les évolutions.', body:`<p><strong>Lire l’axe des jours :</strong> l’axe horizontal situe les observations dans le temps. Chaque position correspond à un jour ou à une date consignée dans le cycle.</p><p><strong>Lire l’axe des températures :</strong> l’axe vertical indique les valeurs de température. Chaque point correspond à une température réellement enregistrée ; sa position permet de la comparer visuellement aux autres jours.</p><p><strong>Repérer les données manquantes :</strong> lorsqu’aucune température n’a été enregistrée pour un jour, il ne faut pas inventer ni estimer une valeur. Une donnée manquante fait partie du suivi.</p><p><strong>Identifier une température perturbée :</strong> une note peut signaler une maladie, de la fièvre, un sommeil inhabituel, un horaire différent, de l’alcool ou un autre contexte pouvant rendre la mesure moins comparable aux autres. Le point reste une donnée, mais son contexte doit être conservé.</p><p><strong>Observer une évolution :</strong> regardez la tendance générale des températures au fil des jours plutôt qu’une valeur isolée. Une montée, une baisse ou des variations peuvent être observées sans leur attribuer automatiquement une cause.</p><p class="notice"><strong>À retenir :</strong> le graphique organise les observations pour faciliter leur lecture. Il ne constitue pas un diagnostic et ne permet pas, à lui seul, de déterminer ce qui se passe dans le cycle.</p>`,quiz:{q:'Pour lire correctement un graphique, il faut notamment…', options:['inventer les valeurs manquantes pour compléter la courbe','observer les axes, repérer les données manquantes et tenir compte du contexte des mesures'], answer:1, explain:'Une lecture attentive distingue les données réellement enregistrées, les données manquantes et les mesures pouvant être perturbées. Le graphique reste un outil d’observation, pas un diagnostic.'}},
  {id:'m6', title:'Comprendre le décalage thermique', summary:'Le principe général d’une hausse durable des températures.', body:`<p>Une hausse durable des températures peut constituer un repère descriptif sur un graphique. L’application affiche ce repère lorsque les données enregistrées correspondent à ses critères d’affichage.</p><p>Une hausse observée n’est pas, à elle seule, une preuve automatique d’ovulation. L’interprétation complète dépend du contexte et de la méthode symptothermique utilisée.</p><p class="notice"><strong>À retenir :</strong> le décalage thermique est présenté ici comme un repère d’observation, pas comme une méthode contraceptive automatisée.</p>`, quiz:{q:'Une hausse durable affichée par l’application est…', options:['une preuve automatique d’ovulation','un repère descriptif à interpréter dans son contexte'], answer:1, explain:'Le repère décrit une évolution des températures. À lui seul, il ne permet pas de conclure automatiquement à une ovulation.'}},
  {id:'m7', title:'Situations particulières', summary:'Quand l’observation devient plus complexe.', body:`<p>Maladie, fièvre, sommeil perturbé, changement d’horaires, voyage, alcool ou médicaments peuvent modifier les observations. Le postpartum, l’allaitement, l’arrêt récent d’une contraception hormonale et la périménopause peuvent également rendre les repères moins faciles à interpréter.</p><p>Dans ces situations, restez sur des observations générales et demandez l’avis d’une professionnelle ou d’un professionnel compétent lorsque l’interprétation est complexe. Cette application ne fournit pas de protocole médical personnalisé.</p>`, quiz:{q:'Face à une interprétation complexe, il est préférable de…', options:['suivre un protocole automatique','demander un accompagnement compétent'], answer:1, explain:'Un contexte particulier mérite un accompagnement adapté plutôt qu’une règle générale automatique. '}},
  {id:'m8', title:'Pratique', summary:'De petits exercices pour distinguer observation et interprétation.', body:`<p><strong>Exercice 1 — Glaire :</strong> une sensation glissante avec une observation d’aspect plus clair peut être consignée comme une observation de glaire. La correction consiste à décrire ce qui est observé, sans lui attribuer automatiquement une signification.</p><p><strong>Exercice 2 — Température perturbée :</strong> une température prise après une nuit très courte, avec fièvre ou après avoir bu de l’alcool, doit être conservée avec son contexte. La correction consiste à signaler le facteur perturbateur plutôt qu’à effacer ou interpréter automatiquement la valeur.</p><p><strong>Exercice 3 — Graphique :</strong> sur un graphique, l’axe horizontal correspond aux jours et l’axe vertical aux températures. La correction consiste à lire chaque axe séparément puis à observer l’évolution des points dans le temps.</p><p><strong>Exercice 4 — Observation ou interprétation :</strong> « température de 36,8 °C à 6 h 30 » est une observation ; « cette température prouve que j’ai ovulé » est une interprétation. La correction consiste à distinguer la donnée enregistrée de ce qu’on lui attribue.</p><p><strong>Exercice 5 — Donnée manquante :</strong> un jour sans température enregistrée doit rester visible comme une donnée manquante. La correction consiste à ne pas inventer ni estimer une valeur absente.</p>`,quiz:{q:'Quel réflexe est commun à ces exercices ?', options:['décrire les données et leur contexte avant de les interpréter','transformer chaque observation en conclusion automatique'], answer:0, explain:'La bonne pratique consiste à conserver les observations, repérer les limites et distinguer les données de leur interprétation.'}}

];
let memLearning = null;
function validLearning(value) {
  if (!value || typeof value !== 'object') return false;
  if (value.version !== LEARNING_VERSION || !value.completed || typeof value.completed !== 'object' || Array.isArray(value.completed)) return false;
  if (value.lastModule !== null && value.lastModule !== undefined && !MODULES.some(module => module.id === value.lastModule)) return false;
  return Object.keys(value.completed).every(id => MODULES.some(module => module.id === id) && value.completed[id] === true);
}
function loadLearning() {
  if (memLearning) return memLearning;
  try { const value = JSON.parse(localStorage.getItem(LEARNING_KEY) || 'null'); memLearning = validLearning(value) ? value : {version:LEARNING_VERSION, completed:{}, lastModule:null}; }
  catch (e) { storageAvailable = false; memLearning = {version:LEARNING_VERSION, completed:{}, lastModule:null}; setStorageStatus('La progression pédagogique locale est illisible. Elle a été réinitialisée pour cette session.'); }
  return memLearning;
}
function saveLearning(value) { memLearning = value; try { localStorage.setItem(LEARNING_KEY, JSON.stringify(value)); } catch (e) { storageAvailable = false; setStorageStatus('La progression reste disponible pendant cette session, mais n’a pas pu être enregistrée durablement dans ce navigateur.'); } }
function renderLearning() {
  const progress = loadLearning(), completed = Object.keys(progress.completed).length;
  const progressBar = document.getElementById('overall-progress');
  const progressText = document.getElementById('overall-progress-text');
  const moduleList = document.getElementById('module-list');
  const learnBar = document.querySelector('.learn-progress');
  if (!progressBar || !progressText || !moduleList || !learnBar) return;
  // L'état ouvert/fermé est géré uniquement par le bouton.
  // renderLearning() ne doit pas le modifier, sinon chaque rafraîchissement
  // inverserait l'état du panneau.
  progressBar.style.width = `${completed / MODULES.length * 100}%`;
  learnBar.setAttribute('aria-valuenow', completed);
  const learnText=getLanguage()==='en'?completed+' lesson'+(completed===1?'':'s')+' completed out of '+MODULES.length+'.':getLanguage()==='es'?completed+' lección'+(completed>1?'es':'')+' completada'+(completed>1?'s':'')+' de '+MODULES.length+'.':getLanguage()==='ar'?completed+' من '+MODULES.length+' من الدروس مكتملة.':completed+' leçon'+(completed>1?'s':'')+' terminée'+(completed>1?'s':'')+' sur '+MODULES.length+'.'; progressText.textContent=learnText;
  moduleList.innerHTML = localizedModules().map((module, index) => `<article class="module-card"><h3>Module ${index+1} — ${module.title}</h3><p>${module.summary}</p><div class="learn-progress" aria-hidden="true"><span style="width:${progress.completed[module.id] ? 100 : 0}%"></span></div><div class="row-actions"><span class="learn-meta">${progress.completed[module.id] ? (getLanguage()==='en'?'Lesson completed':getLanguage()==='es'?'Lección completada':getLanguage()==='ar'?'الدرس مكتمل':'Leçon terminée') : (getLanguage()==='en'?'Not started':getLanguage()==='es'?'Por descubrir':getLanguage()==='ar'?'للاكتشاف':'À découvrir')} · ${progress.completed[module.id] ? '100' : '0'} %</span><button class="btn btn-secondary" type="button" data-action="open-lesson" data-module="${escapeHtml(module.id)}">${progress.completed[module.id] ? (getLanguage()==='en'?'Continue':getLanguage()==='es'?'Continuar':getLanguage()==='ar'?'متابعة':'Reprendre') : (getLanguage()==='en'?'Open lesson':getLanguage()==='es'?'Abrir la lección':getLanguage()==='ar'?'فتح الدرس':'Ouvrir la leçon')}</button></div></article>`).join('');
}
function openLesson(id) {
  const module = localizedModules().find(item => item.id === id); if (!module) return;
  const progress = loadLearning(); progress.lastModule = id; saveLearning(progress);
  const panel = document.getElementById('lesson-view');
  panel.hidden = false;
  const moduleIndex = MODULES.findIndex(item => item.id === module.id); panel.innerHTML = `<h3>${getLanguage()==='en'?'Module':getLanguage()==='es'?'Módulo':getLanguage()==='ar'?'الوحدة':'Module'} ${moduleIndex+1} — ${module.title}</h3>${module.body}<div class="quiz"><h4>${getLanguage()==='en'?'Knowledge check':getLanguage()==='es'?'Pregunta de comprobación':getLanguage()==='ar'?'سؤال للتحقق':'Question de vérification'}</h4><p>${module.quiz.q}</p>${module.quiz.options.map((option, i) => `<button class="btn btn-secondary" type="button" data-action="answer-quiz" data-module="${escapeHtml(id)}" data-option="${i}">${option}</button>`).join('')}<p id="quiz-result" class="quiz-result" aria-live="polite"></p></div><div class="row-actions"><button class="btn" type="button" data-action="complete-lesson" data-module="${escapeHtml(id)}">${progress.completed[id] ? (getLanguage()==='en'?'Lesson already completed':getLanguage()==='es'?'Lección ya completada':getLanguage()==='ar'?'الدرس مكتمل بالفعل':'Leçon déjà terminée') : (getLanguage()==='en'?'Mark lesson as completed':getLanguage()==='es'?'Marcar la lección como completada':getLanguage()==='ar'?'وضع علامة على الدرس كمكتمل':'Marquer la leçon comme terminée')}</button><button class="btn btn-secondary" type="button" data-action="close-lesson">${getLanguage()==='en'?'Close lesson':getLanguage()==='es'?'Cerrar la lección':getLanguage()==='ar'?'إغلاق الدرس':'Fermer la leçon'}</button></div>`;
  panel.scrollIntoView({behavior:'smooth', block:'start'});
}
function answerQuiz(id, choice) { const module = localizedModules().find(item => item.id === id); if (!module || !module.quiz || !Number.isInteger(choice) || choice < 0 || choice >= module.quiz.options.length) return; const quiz = module.quiz, correct = choice === quiz.answer; document.getElementById('quiz-result').textContent = `${correct ? dt('yes') : dt('review')} ${quiz.explain}`; }
function completeLesson(id) { if (!MODULES.some(module => module.id === id)) return; const progress = loadLearning(); progress.completed[id] = true; progress.lastModule = id; saveLearning(progress); renderLearning(); openLesson(id); }function resetLearning() { if (!confirm(at('resetLearning'))) return; saveLearning({version:LEARNING_VERSION, completed:{}, lastModule:null}); document.getElementById('lesson-view').hidden = true; renderLearning(); }


// In-memory cache acts as the source of truth for this session. localStorage
// is used as best-effort persistence on top of it: if a browser blocks
// storage (this can happen when a file is opened directly, e.g. some Safari
// configurations), the app still works fully for the current session instead
// of silently failing to show what was just entered.
let memCurrent = null;
let memHistory = null;
let memProfile = null;
let storageAvailable = true;

const VALID_MUCUS = ['sec','collante','cremeuse','blanc-oeuf'];
const VALID_BLEEDING = ['aucun','regles','spotting'];
const VALID_FACTORS = ['maladie','sommeil','horaire','voyage','alcool','medicament'];
const MAX_ENTRIES_PER_CYCLE = 3700;
const MAX_HISTORY_CYCLES = 200;

function validStoredTemperature(value){return value===null||(typeof value==='number'&&Number.isFinite(value)&&value>=34&&value<=42);}
function validStoredTime(value){return value===null||(typeof value==='string'&&/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value));}
function validStoredEntry(e){return !!e&&typeof e==='object'&&!Array.isArray(e)&&isValidDateKey(e.date)&&validStoredTemperature(e.temp)&&typeof e.mucus==='string'&&VALID_MUCUS.includes(e.mucus)&&typeof e.notes==='string'&&e.notes.length<=2000&&(!('factors'in e)||(Array.isArray(e.factors)&&e.factors.length<=VALID_FACTORS.length&&e.factors.every(f=>VALID_FACTORS.includes(f))))&&(!('bleeding'in e)||(typeof e.bleeding==='string'&&VALID_BLEEDING.includes(e.bleeding)))&&(!('time'in e)||validStoredTime(e.time));}
function validEntryCollection(entries){if(!Array.isArray(entries)||entries.length>MAX_ENTRIES_PER_CYCLE)return false;const dates=new Set();for(const entry of entries){if(!validStoredEntry(entry)||dates.has(entry.date))return false;dates.add(entry.date);}return true;}
function validStoredHistoryCycle(c){return !!c&&typeof c==='object'&&!Array.isArray(c)&&isValidDateKey(c.start)&&isValidDateKey(c.end)&&c.start<=c.end&&validEntryCollection(c.entries)&&c.entries.length>0&&c.entries.every(e=>e.date>=c.start&&e.date<=c.end);}

function loadCurrent(){
  if(memCurrent!==null)return memCurrent;
  try{const raw=localStorage.getItem(CURRENT_KEY),parsed=raw?JSON.parse(raw):[];if(!validEntryCollection(parsed))throw new Error('format');memCurrent=parsed;}
  catch(e){storageAvailable=false;memCurrent=[];setStorageStatus('Les données locales du cycle en cours sont illisibles ou incomplètes. Une nouvelle saisie peut être enregistrée dans cette session.');}
  return memCurrent;
}
function setStorageStatus(message){const status=document.getElementById('storage-status');if(status)status.textContent=message;}
function saveCurrent(entries) {
  memCurrent = entries;
  try { localStorage.setItem(CURRENT_KEY, JSON.stringify(entries)); } catch (e) { storageAvailable = false; setStorageStatus('Les données restent disponibles pendant cette session, mais n’ont pas pu être enregistrées durablement dans ce navigateur.'); }
}
function loadHistory(){if(memHistory!==null)return memHistory;try{const raw=localStorage.getItem(HISTORY_KEY),parsed=raw?JSON.parse(raw):[];if(!Array.isArray(parsed)||parsed.length>MAX_HISTORY_CYCLES||!parsed.every(validStoredHistoryCycle))throw new Error('format');memHistory=parsed;}catch(e){storageAvailable=false;memHistory=[];setStorageStatus('L’historique local est illisible ou incomplet. Il reste vide dans cette session ; si tu as une sauvegarde exportée, utilise-la pour récupérer tes données.');}return memHistory;}
function saveHistory(hist){memHistory=hist;try{localStorage.setItem(HISTORY_KEY,JSON.stringify(hist));}catch(e){storageAvailable=false;setStorageStatus('Les données restent disponibles pendant cette session, mais n’ont pas pu être enregistrées durablement dans ce navigateur.');}}

document.getElementById('f-date').valueAsDate = new Date();
document.getElementById('f-date').max = localDateKey();
document.getElementById('today-date').textContent =
  'Aujourd\'hui : ' + new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

function addEntry() {
  const button = document.getElementById('save-entry-btn');
  try {
    const date = document.getElementById('f-date').value;
    const inputTemp = parseFloat(document.getElementById('f-temp').value);
    const temp = Number.isNaN(inputTemp) ? NaN : displayToCelsius(inputTemp);
    const bleeding = document.getElementById('f-bleeding').value;
    const mucus = document.getElementById('f-mucus').value;
    const notes = document.getElementById('f-notes').value.trim();
    const factors = [...document.querySelectorAll('.factor:checked')].map(el => el.value);
    const time = document.getElementById('f-time').value;

    if (!date) { setActionStatus(at('chooseDate')); return; }
    if (!isValidDateKey(date)) { setActionStatus(at('invalidDate')); return; }
    if (date > localDateKey()) { setActionStatus(at('future')); return; }

    if (isNaN(temp) && bleeding !== 'regles') {
      if (!confirm(at('noTempConfirm'))) return;
    }
    if (!isNaN(temp) && (temp < 34 || temp > 42)) {
      if (!confirm(at('unusualConfirm').replace('{temp}',formatTemperature(temp,2)).replace('{range}',getUnit()==='f'?'93.2–107.6 °F':'34–42 °C'))) return;
    }

    if (button) button.disabled = true;

    let entries = loadCurrent();
    entries = entries.filter(e => e.date !== date);

    const candidate = {
      date,
      temp: isNaN(temp) ? null : temp,
      mucus,
      bleeding,
      notes,
      factors,
      time: time || null
    };

    if (!validStoredEntry(candidate)) {
      setActionStatus(at('invalid'));
      return;
    }

    entries.push(candidate);
    if (entries.length > MAX_ENTRIES_PER_CYCLE) {
      setActionStatus(at('retention'));
      return;
    }
    entries.sort((a, b) => a.date.localeCompare(b.date));
    saveCurrent(entries);

    // Le stockage est effectué avant le rafraîchissement de l'interface.
    // Ainsi, même si un élément visuel rencontre une erreur, l'observation reste sauvegardée.
    render();

    setActionStatus(at('saved'));

    // Réinitialiser uniquement les champs de saisie.
    document.getElementById('f-date').value = localDateKey();
    document.getElementById('f-temp').value = '';
    document.getElementById('f-time').value = '';
    document.getElementById('f-bleeding').value = 'aucun';
    document.getElementById('f-mucus').value = 'sec';
    document.getElementById('f-notes').value = '';
    document.querySelectorAll('.factor').forEach(el => { el.checked = false; });

    const editStatus = document.getElementById('edit-status');
    if (editStatus) editStatus.style.display = 'none';
    const cancelBtn = document.getElementById('cancel-edit-btn');
    if (cancelBtn) cancelBtn.style.display = 'none';
    if (button) button.textContent = at('save');
  } catch (error) {
    console.error('Erreur lors de l’enregistrement de l’observation :', error);
    setActionStatus(at('saveFail'));
  } finally {
    if (button) button.disabled = false;
  }
}

function editEntry(date) {
  announceEditStatus('Modification de l’observation du ' + formatDate(date) + '.');

  const entry = loadCurrent().find(e => e.date === date);
  if (!entry) return;
  document.getElementById('f-date').value = entry.date;
  document.getElementById('f-temp').value = entry.temp === null ? '' : celsiusToDisplay(entry.temp).toFixed(2);
  document.getElementById('f-time').value = entry.time || '';
  document.getElementById('f-mucus').value = entry.mucus || 'sec';
  document.getElementById('f-bleeding').value = entry.bleeding || (entry.mucus === 'regles' ? 'regles' : entry.mucus === 'spotting' ? 'spotting' : 'aucun');
  document.getElementById('f-notes').value = entry.notes || '';
  document.querySelectorAll('.factor').forEach(el => { el.checked = Array.isArray(entry.factors) && entry.factors.includes(el.value); });
  document.getElementById('save-entry-btn').textContent = dt('editSave');
  document.getElementById('cancel-edit-btn').style.display = 'inline-block';
  const status = document.getElementById('edit-status');
  status.style.display = 'block';
  status.textContent = dt('editInProgress');
  document.getElementById('f-date').focus();
}

function announceEditStatus(message) {
  const status = document.getElementById('edit-status');
  if (status) status.textContent = message;
}

function cancelEdit() {
  const status = document.getElementById('edit-status');
  const saveBtn = document.getElementById('save-entry-btn');
  const cancelBtn = document.getElementById('cancel-edit-btn');
  if (status) status.style.display = 'none';
  if (saveBtn) saveBtn.textContent = at('save');
  if (cancelBtn) cancelBtn.style.display = 'none';
  const form = document.getElementById('f-date');
  if (form) form.valueAsDate = new Date();
  const temp = document.getElementById('f-temp');
  const time = document.getElementById('f-time');
  const bleeding = document.getElementById('f-bleeding');
  const mucus = document.getElementById('f-mucus');
  const notes = document.getElementById('f-notes');
  if (temp) temp.value = '';
  if (time) time.value = '';
  if (bleeding) bleeding.value = 'aucun';
  if (mucus) mucus.value = 'sec';
  if (notes) notes.value = '';
  document.querySelectorAll('.factor').forEach(el => { el.checked = false; });
  announceEditStatus('Formulaire réinitialisé.');
}

function deleteEntry(date) {
  if (!confirm(at('deleteConfirm').replace('{date}',formatDate(date)))) return;
  let entries = loadCurrent().filter(e => e.date !== date);
  saveCurrent(entries);
  setActionStatus(at('deleteObs'));
  const status=document.getElementById('action-status');if(status)status.focus();
  render();
}

function startNewCycle() {
  const entries = loadCurrent();
  if (entries.length === 0) { setActionStatus(at('alreadyEmpty')); return; }
  if (!confirm(at('archiveConfirm'))) return;

  const hist = loadHistory();
  if (hist.length >= MAX_HISTORY_CYCLES) {
    setActionStatus(at('historyLimit'));
    return;
  }
  const nextHistory = [{ start: entries[0].date, end: entries[entries.length-1].date, entries }, ...hist];
  const keys = [CURRENT_KEY, HISTORY_KEY];
  const previous = { [CURRENT_KEY]: null, [HISTORY_KEY]: null };
  try {
    keys.forEach(key => { previous[key] = localStorage.getItem(key); });
    localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory));
    localStorage.setItem(CURRENT_KEY, JSON.stringify([]));
    memHistory = nextHistory;
    memCurrent = [];
    storageAvailable = true;
    setActionStatus(at('newCycle'));
  } catch (error) {
    try {
      keys.forEach(key => {
        if (previous[key] === null) localStorage.removeItem(key);
        else localStorage.setItem(key, previous[key]);
      });
    } catch (rollbackError) {}
    storageAvailable = false;
    memHistory = nextHistory;
    memCurrent = [];
    setActionStatus(at('sessionArchive'));
    setStorageStatus('Le cycle a été conservé pendant cette session, mais le navigateur n’a pas permis de confirmer la sauvegarde durable.');
  }
  const status=document.getElementById('action-status');if(status)status.focus();
  render();
}

function deleteHistoryCycle(idx) {
  const hist = loadHistory();
  const cycle = hist[idx];
  if (!cycle) return;
  if (!confirm(at('deleteHistoryConfirm').replace('{start}',formatDate(cycle.start)).replace('{end}',formatDate(cycle.end)))) return;
  hist.splice(idx, 1);
  saveHistory(hist);
  setActionStatus(at('historyDeleted'));
  const status=document.getElementById('action-status');if(status)status.focus();
  render();
}

// Compare successive temperature observations to display a visual reference line; this is not an ovulation detector
function detectThermalReference(entries) {
  const withTemp = entries.filter(e => e.temp !== null);
  for (let i = 6; i < withTemp.length; i++) {
    const prev6 = withTemp.slice(i-6, i).map(e => e.temp);
    const maxPrev = Math.max(...prev6);
    const referenceLine = maxPrev + 0.1;
    if (withTemp[i].temp > referenceLine &&
        withTemp[i+1] && withTemp[i+1].temp > referenceLine &&
        withTemp[i+2] && withTemp[i+2].temp > referenceLine) {
      return { index: i, date: withTemp[i].date, referenceLine };
    }
  }
  return null;
}

function renderChart(entries) {
  const container = document.getElementById('chart-container');
  const badge = document.getElementById('thermal-badge');
  if (!container || !badge) return;
  if (entries.length === 0) {
    container.innerHTML = '<p class="empty">' + dt('addFirst') + '</p>';
    badge.innerHTML = '';
    return;
  }
  const withTemp = entries.filter(e => e.temp !== null);
  const shift = withTemp.length >= 9 ? detectThermalReference(entries) : null;
  badge.innerHTML = shift
    ? `<span class="badge badge-info">${dt('shiftAround')} ${formatDate(shift.date)}</span>`
    : `<span class="badge badge-info">${dt('noShift')}</span>`;

  const w = Math.max(600, entries.length * 46);
  const h = 260;
  const padL = 46, padR = 20, padT = 20, padB = 40;
  const temps = withTemp.map(e => e.temp);
  const minT = temps.length ? Math.min(...temps) - 0.2 : 36;
  const maxT = temps.length ? Math.max(...temps) + 0.2 : 37.5;

  const xStep = (w - padL - padR) / Math.max(entries.length - 1, 1);
  const yFor = t => padT + (maxT - t) / (maxT - minT) * (h - padT - padB);
  const xFor = i => padL + i * xStep;

  let gridLines = '';
  const steps = 5;
  for (let s = 0; s <= steps; s++) {
    const t = minT + (maxT - minT) * s / steps;
    const y = yFor(t);
    gridLines += `<line x1="${padL}" y1="${y}" x2="${w-padR}" y2="${y}" stroke="var(--border)" stroke-width="1"/>`;
    gridLines += `<text x="${padL-8}" y="${y+4}" font-size="10" fill="var(--text-muted)" text-anchor="end">${t.toFixed(1)}</text>`;
  }

  let linePoints = [];
  withTemp.forEach(e => {
    const idx = entries.findIndex(x => x.date === e.date);
    linePoints.push(`${xFor(idx)},${yFor(e.temp)}`);
  });
  const polyline = linePoints.length > 1
    ? `<polyline points="${linePoints.join(' ')}" fill="none" stroke="var(--blue)" stroke-width="2.5"/>`
    : '';

  let referenceLineSvg = '';
  if (shift) {
    referenceLineSvg = `<line x1="${padL}" y1="${yFor(shift.referenceLine)}" x2="${w-padR}" y2="${yFor(shift.referenceLine)}" stroke="var(--pink)" stroke-width="1.5" stroke-dasharray="5,4"/>`;
  }

  let dotsAndLabels = '';
  entries.forEach((e, i) => {
    const x = xFor(i);
    const color = MUCUS_COLORS[e.mucus] || 'var(--dry-color)';
    if (e.temp !== null) {
      dotsAndLabels += `<circle cx="${x}" cy="${yFor(e.temp)}" r="4.5" fill="${color}" stroke="var(--card-bg)" stroke-width="1.5"/>`;
    } else {
      dotsAndLabels += `<circle cx="${x}" cy="${h-padB+14}" r="4" fill="${color}"/>`;
    }
    const d = new Date(e.date + 'T00:00:00');
    dotsAndLabels += `<text x="${x}" y="${h-10}" font-size="9" fill="var(--text-muted)" text-anchor="middle">${d.getDate()}/${d.getMonth()+1}</text>`;
  });

  const summary = withTemp.length
    ? 'Résumé textuel : ' + withTemp.map(e => formatDate(e.date) + ' — ' + formatTemperature(e.temp,2)).join(' ; ')
    : 'Résumé textuel : aucune température enregistrée.';
  container.innerHTML = `<p class="sr-only" id="chart-text-summary">${escapeHtml(summary)}</p><svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" aria-hidden="true">
    ${gridLines}
    ${referenceLineSvg}
    ${polyline}
    ${dotsAndLabels}
  </svg>`;
}

function formatDate(d) {
  const value = new Date(d + 'T00:00:00');
  const locale = getLanguage()==='en' ? 'en-US' : getLanguage()==='es' ? 'es-ES' : getLanguage()==='ar' ? 'ar' : 'fr-FR';
  return value.toLocaleDateString(locale, { day: 'numeric', month: 'long' });
}
function factorLabel(key){
  const labels=getLanguage()==='en'?{maladie:'illness/fever',sommeil:'disturbed sleep',horaire:'unusual schedule',voyage:'travel/displacement',alcool:'alcohol',medicament:'medication'}:getLanguage()==='es'?{maladie:'enfermedad/fiebre',sommeil:'sueño alterado',horaire:'horario inusual',voyage:'viaje/desplazamiento',alcool:'alcohol',medicament:'medicamento'}:getLanguage()==='ar'?{maladie:'مرض/حمى',sommeil:'اضطراب النوم',horaire:'وقت غير معتاد',voyage:'سفر/تنقّل',alcool:'كحول',medicament:'دواء'}:{maladie:'maladie/fièvre',sommeil:'sommeil perturbé',horaire:'horaire inhabituel',voyage:'voyage/déplacement',alcool:'alcool',medicament:'médicament'};
  return labels[key]||key;
}

function renderTable(entries) {
  const container = document.getElementById('table-container');
  if (!container) return;
  const lang=getLanguage();
  const labels=lang==='es'?{empty:'No hay registros para este ciclo.',context:'Contexto',time:'Hora',bleeding:'Sangrado',period:'menstruación',spotting:'manchado',actions:'Acciones',date:'Fecha',temp:'Temp.',mucus:'Moco',notes:'Notas / contexto',edit:'Editar',delete:'Eliminar'}:lang==='ar'?{empty:'لا توجد إدخالات لهذه الدورة.',context:'السياق',time:'الوقت',bleeding:'النزيف',period:'الحيض',spotting:'تبقيع',actions:'الإجراءات',date:'التاريخ',temp:'الحرارة',mucus:'المخاط',notes:'ملاحظات / سياق',edit:'تعديل',delete:'حذف'}:{empty:'Aucune entrée pour ce cycle.',context:'Contexte',time:'Heure',bleeding:'Saignement',period:'règles',spotting:'spotting',actions:'Actions',date:'Date',temp:'Temp.',mucus:'Glaire',notes:'Notes / contexte',edit:'Modifier',delete:'Supprimer'};
  if (entries.length === 0) { container.innerHTML = '<p class="empty">'+labels.empty+'</p>'; return; }
  let rows = entries.slice().reverse().map(e => {
    const factors = Array.isArray(e.factors) && e.factors.length ? ' · '+labels.context+' : ' + e.factors.map(f => escapeHtml(factorLabel(f))).join(', ') : '';
    const safeNotes = e.notes ? escapeHtml(e.notes) : '';
    const timeLabel = e.time ? ' · '+labels.time+' : ' + escapeHtml(e.time) : '';
    const bleedingLabel = e.bleeding && e.bleeding !== 'aucun' ? ' · '+labels.bleeding+' : ' + (e.bleeding === 'regles' ? labels.period : labels.spotting) : '';
    return `
    <tr>
      <td>${formatDate(e.date)}</td>
      <td>${e.temp !== null ? formatTemperature(e.temp,2) : '—'}</td>
      <td>${e.bleeding && e.bleeding !== 'aucun' ? (e.bleeding === 'regles' ? labels.period : labels.spotting) : '—'}</td>
      <td>${mucusLabel(e.mucus)}</td>
      <td>${safeNotes}${bleedingLabel}${timeLabel}${factors ? '<div class="learn-meta">' + factors + '</div>' : ''}</td>
      <td class="no-print"><button type="button" class="btn edit-btn" data-action="edit-entry" data-date="${escapeHtml(e.date)}">${labels.edit}</button><button type="button" class="btn btn-danger" data-action="delete-entry" data-date="${escapeHtml(e.date)}" aria-label="${labels.delete} ${formatDate(e.date)}">✕</button></td>
    </tr>`;
  }).join('');
  container.innerHTML = `<div class="table-scroll"><table>
    <thead><tr><th>${labels.date}</th><th>${labels.temp}</th><th>${labels.bleeding}</th><th>${labels.mucus}</th><th>${labels.notes}</th><th class="no-print">${labels.actions}</th></tr></thead>
    <tbody>${rows}</tbody>
  </table></div>`;
}

function renderHistory() {
  const hist = loadHistory();
  const container = document.getElementById('history-container');
  if (!container) return;
  const lang=getLanguage();
  const t=lang==='es'?{empty:'Aún no hay ciclos archivados.',cycle:'Ciclo del',to:'al',obs:'observación(es) registrada(s)',temps:'temperatura(s)',covered:'período cubierto',days:'día(s)',mucus:'observación(es) de moco registrada(s)',bleeding:'observación(es) con sangrado',complete:'de los campos temperatura/moco completados',context:'Contexto registrado en',delete:'Eliminar'}:lang==='ar'?{empty:'لا توجد دورات مؤرشفة بعد.',cycle:'الدورة من',to:'إلى',obs:'ملاحظة مسجلة',temps:'درجة حرارة',covered:'الفترة المغطاة',days:'يوم',mucus:'ملاحظة للمخاط',bleeding:'ملاحظة مع نزيف',complete:'من حقول الحرارة/المخاط مكتملة',context:'السياق مسجل في',delete:'حذف'}:{empty:'Pas encore de cycle archivé.',cycle:'Cycle du',to:'au',obs:'observation(s) enregistrée(s)',temps:'température(s)',covered:'période couverte',days:'jour(s)',mucus:'observation(s) de glaire renseignée(s)',bleeding:'observation(s) avec saignement',complete:'des champs température/glaire renseignés',context:'Contexte renseigné sur',delete:'Supprimer'};
  if (hist.length === 0) { container.innerHTML = '<p class="empty">'+t.empty+'</p>'; return; }
  container.innerHTML = hist.map((c, i) => {
    const temps = c.entries.filter(e => Number.isFinite(Number(e.temp))).length;
    const contexts = c.entries.filter(e => Array.isArray(e.factors) && e.factors.length).length;
    const mucusCount = c.entries.filter(e => e.mucus && e.mucus !== 'sec').length;
    const bleedingCount = c.entries.filter(e => e.bleeding && e.bleeding !== 'aucun').length;
    const completeness = c.entries.length ? Math.round(((temps + mucusCount) / (c.entries.length * 2)) * 100) : 0;
    const first = c.entries.slice().sort((a,b) => a.date.localeCompare(b.date))[0];
    const last = c.entries.slice().sort((a,b) => a.date.localeCompare(b.date)).slice(-1)[0];
    const span = first && last ? Math.floor((new Date(last.date+'T00:00:00') - new Date(first.date+'T00:00:00')) / 86400000) + 1 : c.entries.length;
    return `
    <article class="history-item" aria-labelledby="history-cycle-${i}">
      <div>
        <h3 id="history-cycle-${i}">${t.cycle} ${formatDate(c.start)} ${t.to} ${formatDate(c.end)}</h3>
        <div class="learn-meta">${c.entries.length} ${t.obs} · ${temps} ${t.temps} · ${t.covered} : ${span} ${t.days}</div>
        <div class="learn-meta">${mucusCount} ${t.mucus} · ${bleedingCount} ${t.bleeding} · ${completeness}% ${t.complete}</div>
        ${contexts ? '<div class="learn-meta">'+t.context+' '+contexts+' '+t.obs+'</div>' : ''}
      </div>
      <button type="button" class="btn btn-danger" data-action="delete-history-cycle" data-index="${i}" aria-label="${t.delete} ${t.cycle.toLowerCase()} ${formatDate(c.start)}">${t.delete}</button>
    </article>`;
  }).join('');
}

function localDateKey(date = new Date()) {
  return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
}

function renderTodaySummary(entries) {
  const box = document.getElementById('today-summary');
  if (!box) return;
  const today = localDateKey();
  const todayEntry = entries.find(e => e.date === today);
  const sorted = [...entries].sort((a,b) => a.date.localeCompare(b.date));
  const first = sorted[0];
  const cycleDay = first ? Math.max(1, Math.floor((new Date(today+'T00:00:00') - new Date(first.date+'T00:00:00')) / 86400000) + 1) : null;
  const temp = todayEntry && Number.isFinite(Number(todayEntry.temp)) ? formatTemperature(todayEntry.temp,2) : dt('notFilled');
  const mucus = todayEntry ? (mucusLabel(todayEntry.mucus) || dt('obsSaved')) : dt('noObs');
  const cycleLabel = getLanguage()==='en' ? 'Day ' : getLanguage()==='es' ? 'Día ' : getLanguage()==='ar' ? 'اليوم ' : 'Jour ';
  box.innerHTML = '<div class="today-stat"><strong>' + (todayEntry ? dt('saved') : dt('toFill')) + '</strong><span>' + dt('todayObs') + '</span></div>' + '<div class="today-stat"><strong>' + temp + '</strong><span>' + dt('temperature') + '</span></div>' + '<div class="today-stat"><strong>' + mucus + '</strong><span>' + dt('mucusObs') + '</span></div>' + '<div class="today-stat"><strong>' + (cycleDay ? cycleLabel + cycleDay : '—') + '</strong><span>' + dt('cycleRef') + '</span></div>';
}
function render() {
  applyLanguage();
  const dateField = document.getElementById('f-date');
  if (dateField && !dateField.value) dateField.value = localDateKey();
  const entries = loadCurrent();
  renderTodaySummary(entries);
  renderChart(entries);
  renderTable(entries);
  renderHistory();
  // Le calendrier lit directement le cycle en cours : il doit être rafraîchi
  // immédiatement après chaque ajout, modification ou suppression.
  renderCalendar();
  const warning = document.getElementById('storage-warning');
  if (!storageAvailable) {
    warning.style.display = 'block';
    warning.textContent = "⚠️ La sauvegarde locale est indisponible dans ce navigateur : tes entrées restent visibles pendant cette session, mais peuvent être perdues si tu fermes ou recharges la page. Vérifie les réglages de confidentialité ou de stockage du navigateur.";
  } else {
    warning.style.display = 'none';
  }
  // Keep the print document synchronized with the visible cycle so that
  // system print flows (including Safari/iOS) already have real content
  // before the print dialog is opened.
  preparePrintView();
}

function preparePrintView() {
  const sheet = document.getElementById('print-sheet');
  const entries = loadCurrent();
  if (!sheet) return false;
  if (!entries.length) {
    sheet.innerHTML = '';
    sheet.setAttribute('aria-hidden','true');
    return false;
  }

  const withTemp = entries.filter(e => e.temp !== null);
  const shift = withTemp.length >= 9 ? detectThermalReference(entries) : null;
  const locale = getLanguage()==='en' ? 'en-US' : getLanguage()==='es' ? 'es-ES' : getLanguage()==='ar' ? 'ar' : 'fr-FR';
  const today = new Date().toLocaleDateString(locale,{day:'numeric',month:'long',year:'numeric'});
  const t = getLanguage()==='en'
    ? {title:'Symptothermal tracking — cycle observations',period:'Period',days:'Days recorded',generated:'Generated on',shift:'Descriptive thermal reference shown around',none:'No descriptive thermal reference is shown yet with this cycle data.',limit:'This reference is not a diagnosis or automatic confirmation of ovulation.',chart:'Descriptive cycle chart',journal:'Current cycle journal'}
    : getLanguage()==='es'
    ? {title:'Seguimiento de sintotermia — observaciones del ciclo',period:'Período',days:'Días registrados',generated:'Generado el',shift:'Referencia térmica descriptiva mostrada alrededor del',none:'Todavía no se muestra una referencia térmica descriptiva con los datos de este ciclo.',limit:'Esta referencia no constituye un diagnóstico ni una confirmación automática de la ovulación.',chart:'Gráfico descriptivo del ciclo',journal:'Diario del ciclo actual'}
    : getLanguage()==='ar'
    ? {title:'متابعة الأعراض الحرارية — ملاحظات الدورة',period:'الفترة',days:'الأيام المسجلة',generated:'تم الإنشاء في',shift:'مرجع حراري وصفي معروض حول',none:'لا يظهر بعد مرجع حراري وصفي باستخدام بيانات هذه الدورة.',limit:'لا يشكل هذا المرجع تشخيصًا ولا تأكيدًا تلقائيًا للإباضة.',chart:'المخطط الوصفي للدورة',journal:'سجل الدورة الحالية'}
    : {title:'Suivi Symptothermie — observations du cycle',period:'Période',days:'Jours notés',generated:'Généré le',shift:'Repère thermique descriptif affiché autour du',none:'Pas encore de repère thermique descriptif affiché avec les données de ce cycle.',limit:'Ce repère ne constitue pas un diagnostic ni une confirmation automatique d’ovulation.',chart:'Courbe descriptive du cycle',journal:'Journal du cycle en cours'};

  let summary = '<div class="print-meta"><strong>'+t.period+' :</strong> '+formatDate(entries[0].date)+' au '+formatDate(entries[entries.length-1].date)+'<br><strong>'+t.days+' :</strong> '+entries.length+' · <strong>'+t.generated+' :</strong> '+today+'<br>';
  summary += shift ? t.shift+' <strong>'+formatDate(shift.date)+'</strong>. '+t.limit : t.none;
  summary += '</div>';

  const chart = document.getElementById('chart-container')?.cloneNode(true);
  const table = document.getElementById('table-container')?.cloneNode(true);
  [chart, table].forEach(node => {
    if (node) node.querySelectorAll('.no-print, button, input, select, textarea').forEach(el => el.remove());
  });

  sheet.innerHTML = '<h1>'+t.title+'</h1>'+summary+
    (chart && chart.innerHTML.trim() ? '<h2>'+t.chart+'</h2><div class="print-chart">'+chart.innerHTML+'</div>' : '')+
    (table && table.innerHTML.trim() ? '<h2>'+t.journal+'</h2><div class="print-table">'+table.innerHTML+'</div>' : '')+
    '<div class="print-note">'+t.limit+'</div>';
  sheet.setAttribute('aria-hidden','true');
  return true;
}

function isIOSStandalone() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    (window.navigator.standalone === true || window.matchMedia?.('(display-mode: standalone)').matches === true);
}

function openIOSPrintDocument() {
  const sheet = document.getElementById('print-sheet');
  if (!sheet || !sheet.innerHTML.trim()) return false;

  const printWindow = window.open('', '_blank');
  if (!printWindow) return false;

  const title = getLanguage()==='en'
    ? 'Symptothermal tracking — cycle observations'
    : getLanguage()==='es'
    ? 'Seguimiento de sintotermia — observaciones del ciclo'
    : getLanguage()==='ar'
    ? 'متابعة الأعراض الحرارية — ملاحظات الدورة'
    : 'Suivi Symptothermie — observations du cycle';

  const printDocument = printWindow.document;
  printDocument.documentElement.lang = getLanguage();
  printDocument.head.innerHTML = '';
  const metaCharset = printDocument.createElement('meta');
  metaCharset.setAttribute('charset', 'utf-8');
  const metaViewport = printDocument.createElement('meta');
  metaViewport.setAttribute('name', 'viewport');
  metaViewport.setAttribute('content', 'width=device-width,initial-scale=1');
  const titleElement = printDocument.createElement('title');
  titleElement.textContent = title;
  const styleElement = printDocument.createElement('style');
  styleElement.textContent = '@page{margin:14mm}html,body{background:#fff!important;color:#111!important;padding:0;margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;font-size:11pt;line-height:1.45}h1{margin:0 0 6mm;font-size:20pt}h2{margin:6mm 0 3mm;font-size:14pt}.print-meta{margin-bottom:5mm;color:#444}.print-note{margin-top:5mm;padding:3mm;border:1px solid #ccc}.print-chart{margin-top:4mm}.print-chart svg{width:100%!important;height:auto!important;display:block}.print-table{overflow:visible!important}.print-table table{width:100%;font-size:9pt;border-collapse:collapse}.print-table th,.print-table td{border-bottom:1px solid #ccc;padding:5px 4px;text-align:left}.no-print,button,input,select,textarea{display:none!important}';
  printDocument.head.append(metaCharset, metaViewport, titleElement, styleElement);
  const main = printDocument.createElement('main');
  main.innerHTML = sheet.innerHTML;
  printDocument.body.replaceChildren(main);

  printWindow.addEventListener('load', () => {
    printWindow.focus();
    window.setTimeout(() => printWindow.print(), 300);
  }, {once:true});

  // iOS may have the document already loaded before the load listener is attached.
  window.setTimeout(() => {
    try { if (printWindow.document.readyState === 'complete') { printWindow.focus(); printWindow.print(); } } catch (e) {}
  }, 500);

  return true;
}

function exportPDF() {
  if (!preparePrintView()) { setBackupStatus(at('pdfEmpty')); return; }

  if (isIOSStandalone()) {
    if (!openIOSPrintDocument()) {
      setBackupStatus('Impossible d’ouvrir la fenêtre d’impression. Ouvre SymRella directement dans Safari puis relance l’export PDF.');
    }
    return;
  }

  if (typeof window.print !== 'function') {
    setBackupStatus('L’impression PDF n’est pas disponible dans ce navigateur. Ouvre cette page dans Safari.');
    return;
  }

  window.requestAnimationFrame(() => window.print());
}

window.addEventListener('beforeprint', () => { preparePrintView(); });
const APP_DATA_VERSION = 2;
const PROFILE_KEY = 'symptothermie_profile';
let calendarDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
const LANGUAGE_KEY = 'symptothermie_language';
const ACTION_TEXTS={
fr:{future:'Une observation future ne peut pas être enregistrée.',invalidDate:'La date saisie est invalide.',invalid:'Les données saisies ne sont pas valides. Vérifie les champs avant d’enregistrer.',saved:'✓ Observation enregistrée dans le journal du cycle en cours.',deleteObs:'Observation supprimée.',alreadyEmpty:'Le cycle en cours est déjà vide.',newCycle:'Cycle archivé et nouveau cycle démarré.',clear:'Toutes les données locales ont été effacées.',connect:'🌡️ Thermomètre connecté',noStorage:'⚠️ La sauvegarde locale est indisponible dans ce navigateur : tes entrées restent visibles pendant cette session, mais peuvent être perdues si tu fermes ou recharges la page.',mucus:{sec:'Sec',collante:'Collante',cremeuse:'Crémeuse',blanc:'Blanc d’œuf'},chooseDate:'Merci de choisir une date.',retention:'Ce cycle dépasse la limite de conservation. Exporte tes données avant de continuer.',saveFail:'Impossible d’enregistrer cette observation. Vérifie les champs et réessaie.',historyLimit:'La limite de cycles archivés est atteinte. Exporte tes données avant d’en archiver un nouveau.',sessionArchive:'Cycle archivé et nouveau cycle démarré pour cette session, mais la sauvegarde durable a échoué.',historyDeleted:'Cycle archivé supprimé.',storageSession:'Les données ont été effacées pour cette session, mais la suppression durable n’a pas pu être confirmée.',resetLearning:'Réinitialiser toute la progression pédagogique ?',clearConfirm:'Effacer toutes les données locales de cette application ? Cette action ne peut pas être annulée.',importConfirm:'Remplacer les données locales actuelles par cette sauvegarde ?',pdfEmpty:'Ajoute au moins une entrée avant d’exporter.',exportEmpty:'Ajoute au moins une observation ou archive un cycle avant d’exporter.',exported:'Sauvegarde exportée.',imported:'Sauvegarde importée avec succès.',importTooLarge:'La sauvegarde dépasse la taille maximale autorisée de 2 Mo.',importFailed:'La sauvegarde n’a pas été importée : fichier invalide, incomplet ou impossible à enregistrer. Les données existantes sont conservées.',noTempConfirm:'Aucune température saisie, continuer quand même ?',unusualConfirm:'{temp} semble inhabituel pour une température corporelle (plage de contrôle {range}). Enregistrer quand même ?',deleteConfirm:'Supprimer l’observation du {date} ?',archiveConfirm:'Archiver le cycle en cours et démarrer un nouveau cycle ?',deleteHistoryConfirm:'Supprimer définitivement le cycle du {start} au {end} ?',save:'Enregistrer l’entrée',resetDone:'',bluetooth:{invalid:'Mesure reçue mais valeur inexploitable. Vérifie le thermomètre.',received:'Mesure Bluetooth reçue : {temp}. Vérifie-la puis enregistre l’observation.',unsupported:'La connexion Bluetooth depuis le navigateur n’est pas disponible sur cet appareil ou navigateur.',search:'Recherche d’un thermomètre Bluetooth compatible…',disconnected:'Thermomètre déconnecté. Tu peux en reconnecter un.',connected:'Connecté : {name}.',none:'Aucun thermomètre sélectionné.',failed:'Connexion impossible. Vérifie que le thermomètre utilise le service Bluetooth Health Thermometer.'}},
en:{future:'A future observation cannot be recorded.',invalidDate:'The entered date is invalid.',invalid:'The entered data are not valid. Check the fields before saving.',saved:'✓ Observation saved in the current cycle journal.',deleteObs:'Observation deleted.',alreadyEmpty:'The current cycle is already empty.',newCycle:'Cycle archived and a new cycle started.',clear:'All local data have been deleted.',connect:'🌡️ Thermometer connected',noStorage:'⚠️ Local storage is unavailable in this browser.',mucus:{sec:'Dry',collante:'Sticky',cremeuse:'Creamy',blanc:'Egg white'},chooseDate:'Please choose a date.',retention:'This cycle exceeds the storage limit. Export your data before continuing.',saveFail:'This observation could not be saved. Check the fields and try again.',historyLimit:'The archived-cycle limit has been reached. Export your data before archiving another cycle.',sessionArchive:'The cycle was archived and a new one started for this session, but permanent storage failed.',historyDeleted:'Archived cycle deleted.',storageSession:'The data were cleared for this session, but permanent deletion could not be confirmed.',resetLearning:'Reset all learning progress?',clearConfirm:'Delete all local data from this application? This action cannot be undone.',importConfirm:'Replace the current local data with this backup?',pdfEmpty:'Add at least one entry before exporting.',exportEmpty:'Add at least one observation or archive a cycle before exporting.',exported:'Backup exported.',imported:'Backup imported successfully.',importTooLarge:'The backup exceeds the maximum allowed size of 2 MB.',importFailed:'The backup was not imported: invalid, incomplete or unsaveable file. Existing data are preserved.',noTempConfirm:'No temperature was entered. Continue anyway?',unusualConfirm:'{temp} seems unusual for a body temperature (control range {range}). Save anyway?',deleteConfirm:'Delete the observation from {date}?',archiveConfirm:'Archive the current cycle and start a new cycle?',deleteHistoryConfirm:'Permanently delete the archived cycle from {start} to {end}?',save:'Save entry',resetDone:'',bluetooth:{invalid:'The received measurement cannot be used. Check the thermometer.',received:'Bluetooth measurement received: {temp}. Check it, then save the observation.',unsupported:'Bluetooth connection from the browser is not available on this device or browser.',search:'Searching for a compatible Bluetooth thermometer…',disconnected:'Thermometer disconnected. You can reconnect it.',connected:'Connected: {name}.',none:'No thermometer selected.',failed:'Connection failed. Check that the thermometer uses the Bluetooth Health Thermometer service.'}},
es:{future:'No se puede registrar una observación futura.',invalidDate:'La fecha indicada no es válida.',invalid:'Los datos introducidos no son válidos. Comprueba los campos antes de guardar.',saved:'✓ Observación registrada en el diario del ciclo actual.',deleteObs:'Observación eliminada.',alreadyEmpty:'El ciclo actual ya está vacío.',newCycle:'Ciclo archivado y nuevo ciclo iniciado.',clear:'Todos los datos locales han sido eliminados.',connect:'🌡️ Termómetro conectado',noStorage:'⚠️ El almacenamiento local no está disponible en este navegador: las entradas permanecen visibles durante esta sesión, pero pueden perderse al cerrar o recargar la página.',mucus:{sec:'Seco',collante:'Pegajoso',cremeuse:'Cremoso',blanc:'Clara de huevo'},chooseDate:'Elige una fecha.',retention:'Este ciclo supera el límite de conservación. Exporta tus datos antes de continuar.',saveFail:'No se puede guardar esta observación. Comprueba los campos e inténtalo de nuevo.',historyLimit:'Se alcanzó el límite de ciclos archivados. Exporta tus datos antes de archivar otro.',sessionArchive:'El ciclo se archivó y comenzó uno nuevo durante esta sesión, pero el almacenamiento permanente falló.',historyDeleted:'Ciclo archivado eliminado.',storageSession:'Los datos se eliminaron durante esta sesión, pero no se pudo confirmar la eliminación permanente.',resetLearning:'¿Restablecer toda la progresión de aprendizaje?',clearConfirm:'¿Borrar todos los datos locales de esta aplicación? Esta acción no se puede deshacer.',importConfirm:'¿Reemplazar los datos locales actuales por esta copia de seguridad?',pdfEmpty:'Añade al menos una observación antes de exportar.',exportEmpty:'Añade al menos una observación o archiva un ciclo antes de exportar.',exported:'Copia de seguridad exportada.',imported:'Copia de seguridad importada correctamente.',importTooLarge:'La copia de seguridad supera el tamaño máximo permitido de 2 MB.',importFailed:'La copia de seguridad no se ha importado: archivo inválido, incompleto o imposible de guardar. Los datos existentes se conservan.',noTempConfirm:'No se ha introducido ninguna temperatura, ¿continuar?',unusualConfirm:'{temp} parece inusual para una temperatura corporal (rango de control {range}). ¿Guardar de todos modos?',deleteConfirm:'¿Eliminar la observación del {date}?',archiveConfirm:'¿Archivar el ciclo actual y comenzar un nuevo ciclo?',deleteHistoryConfirm:'¿Eliminar definitivamente el ciclo del {start} al {end}?',save:'Guardar la entrada',resetDone:'',bluetooth:{invalid:'La medida recibida no es utilizable. Comprueba el termómetro.',received:'Medida Bluetooth recibida: {temp}. Compruébala y guarda la observación.',unsupported:'La conexión Bluetooth desde el navegador no está disponible en este dispositivo o navegador.',search:'Buscando un termómetro Bluetooth compatible…',disconnected:'Termómetro desconectado. Puedes volver a conectarlo.',connected:'Conectado: {name}.',none:'No se seleccionó ningún termómetro.',failed:'No se pudo conectar. Comprueba que el termómetro use el servicio Bluetooth Health Thermometer.'}},
ar:{future:'لا يمكن تسجيل ملاحظة بتاريخ مستقبلي.',invalidDate:'التاريخ المُدخل غير صالح.',invalid:'البيانات المُدخلة غير صالحة. تحققي من الحقول قبل الحفظ.',saved:'✓ تم تسجيل الملاحظة في سجل الدورة الحالية.',deleteObs:'تم حذف الملاحظة.',alreadyEmpty:'الدورة الحالية فارغة بالفعل.',newCycle:'تمت أرشفة الدورة وبدء دورة جديدة.',clear:'تم حذف جميع البيانات المحلية.',connect:'🌡️ تم توصيل مقياس الحرارة',noStorage:'⚠️ التخزين المحلي غير متاح في هذا المتصفح: تبقى الإدخالات ظاهرة خلال هذه الجلسة، لكنها قد تضيع عند إغلاق الصفحة أو إعادة تحميلها.',mucus:{sec:'جاف',collante:'لزج',cremeuse:'كريمي',blanc:'بياض البيض'},chooseDate:'اختاري تاريخًا.',retention:'تتجاوز هذه الدورة حد الاحتفاظ. صدّري بياناتك قبل المتابعة.',saveFail:'تعذر حفظ هذه الملاحظة. تحققي من الحقول وحاولي مرة أخرى.',historyLimit:'تم بلوغ الحد الأقصى للدورات المؤرشفة. صدّري بياناتك قبل أرشفة دورة جديدة.',sessionArchive:'تمت أرشفة الدورة وبدء دورة جديدة خلال هذه الجلسة، لكن تعذر الحفظ الدائم.',historyDeleted:'تم حذف الدورة المؤرشفة.',storageSession:'تم حذف البيانات خلال هذه الجلسة، لكن تعذر تأكيد الحذف الدائم.',resetLearning:'هل تريدين إعادة ضبط التقدم التعليمي بالكامل؟',clearConfirm:'هل تريدين حذف جميع البيانات المحلية من هذا التطبيق؟ لا يمكن التراجع عن هذا الإجراء.',importConfirm:'هل تريدين استبدال البيانات المحلية الحالية بهذه النسخة الاحتياطية؟',pdfEmpty:'أضيفي ملاحظة واحدة على الأقل قبل التصدير.',exportEmpty:'أضيفي ملاحظة واحدة على الأقل أو أرشفي دورة قبل التصدير.',exported:'تم تصدير النسخة الاحتياطية.',imported:'تم استيراد النسخة الاحتياطية بنجاح.',importTooLarge:'تتجاوز النسخة الاحتياطية الحد الأقصى المسموح به وهو 2 ميغابايت.',importFailed:'تعذر استيراد النسخة الاحتياطية: الملف غير صالح أو ناقص أو تعذر حفظه. تم الاحتفاظ بالبيانات الحالية.',noTempConfirm:'لم يتم إدخال درجة حرارة، هل تريدين المتابعة؟',unusualConfirm:'تبدو {temp} غير معتادة لدرجة حرارة الجسم (نطاق التحقق {range}). هل تريدين الحفظ رغم ذلك؟',deleteConfirm:'هل تريدين حذف الملاحظة بتاريخ {date}؟',archiveConfirm:'هل تريدين أرشفة الدورة الحالية وبدء دورة جديدة؟',deleteHistoryConfirm:'هل تريدين حذف الدورة المؤرشفة نهائيًا من {start} إلى {end}؟',save:'حفظ الإدخال',resetDone:'',bluetooth:{invalid:'القيمة المستلمة غير قابلة للاستخدام. تحققي من مقياس الحرارة.',received:'تم استلام القياس عبر Bluetooth: {temp}. تحققي منه ثم احفظي الملاحظة.',unsupported:'اتصال Bluetooth من المتصفح غير متاح على هذا الجهاز أو المتصفح.',search:'جارٍ البحث عن مقياس حرارة Bluetooth متوافق…',disconnected:'تم فصل مقياس الحرارة. يمكنك إعادة توصيله.',connected:'متصل: {name}.',none:'لم يتم اختيار مقياس حرارة.',failed:'تعذر الاتصال. تحققي من أن مقياس الحرارة يستخدم خدمة Health Thermometer عبر Bluetooth.'}}
};
function at(key){const t=ACTION_TEXTS[getLanguage()]||ACTION_TEXTS.fr;return t[key]||ACTION_TEXTS.fr[key]||key;}
function bt(key,vars={}){const t=(ACTION_TEXTS[getLanguage()]||ACTION_TEXTS.fr).bluetooth;return Object.keys(vars).reduce((s,k)=>s.replace('{'+k+'}',String(vars[k])),t[key]||ACTION_TEXTS.fr.bluetooth[key]);}
function mucusLabel(key){const t=(ACTION_TEXTS[getLanguage()]||ACTION_TEXTS.fr).mucus;return t[key]||key;}
const DYNAMIC_TEXTS = {
  fr:{saved:'✓ Enregistrée',toFill:'À renseigner',todayObs:'Observation du jour',temperature:'Température',mucusObs:'Glaire / observation',cycleRef:'Repère dans le cycle',noObs:'Aucune observation',obsSaved:'Observation enregistrée',notFilled:'Non renseignée',observation:'Observation',context:'Contexte',notes:'Notes',measurementTime:'Heure de mesure',bleeding:'Saignement',period:'règles',spotting:'spotting',yes:'Réponse juste.',review:'À revoir.',addFirst:'Ajoute des entrées pour voir ta courbe.',noShift:'Pas encore assez de données pour afficher un repère',shiftAround:'Repère thermique descriptif autour du',savedJournal:'✓ Observation enregistrée dans le journal du cycle en cours.',save:'Enregistrer l’entrée',editSave:'Enregistrer la modification',editInProgress:'Modification en cours : vérifie les données puis enregistre.'},
  en:{saved:'✓ Saved',toFill:'To enter',todayObs:'Today observation',temperature:'Temperature',mucusObs:'Mucus / observation',cycleRef:'Cycle reference',noObs:'No observation',obsSaved:'Observation saved',notFilled:'Not entered',observation:'Observation',context:'Context',notes:'Notes',measurementTime:'Measurement time',bleeding:'Bleeding',period:'period',spotting:'spotting',yes:'Correct answer.',review:'Review.',addFirst:'Add entries to see your chart.',noShift:'Not enough data yet to display a reference',shiftAround:'Descriptive thermal reference around',savedJournal:'✓ Observation saved in the current cycle journal.',save:'Save entry',editSave:'Save changes',editInProgress:'Editing in progress: check the data and save.'},
  es:{saved:'✓ Registrada',toFill:'Por completar',todayObs:'Observación del día',temperature:'Temperatura',mucusObs:'Moco / observación',cycleRef:'Referencia del ciclo',noObs:'Ninguna observación',obsSaved:'Observación registrada',notFilled:'No indicada',observation:'Observación',context:'Contexto',notes:'Notas',measurementTime:'Hora de medición',bleeding:'Sangrado',period:'menstruación',spotting:'manchado',yes:'Respuesta correcta.',review:'Revisar.',addFirst:'Añade registros para ver tu curva.',noShift:'Aún no hay suficientes datos para mostrar una referencia',shiftAround:'Referencia térmica descriptiva alrededor del',savedJournal:'✓ Observación registrada en el diario del ciclo actual.',save:'Guardar la entrada',editSave:'Guardar la modificación',editInProgress:'Modificación en curso: revisa los datos y guarda.'},
  ar:{saved:'✓ مسجّلة',toFill:'تحتاج إلى إدخال',todayObs:'ملاحظة اليوم',temperature:'درجة الحرارة',mucusObs:'المخاط / الملاحظة',cycleRef:'مرجع في الدورة',noObs:'لا توجد ملاحظة',obsSaved:'تم تسجيل الملاحظة',notFilled:'غير مُدخلة',observation:'الملاحظة',context:'السياق',notes:'ملاحظات',measurementTime:'وقت القياس',bleeding:'النزيف',period:'الحيض',spotting:'تبقيع',yes:'إجابة صحيحة.',review:'تحتاج إلى مراجعة.',addFirst:'أضيفي ملاحظات لرؤية المنحنى.',noShift:'لا توجد بيانات كافية بعد لعرض مرجع',shiftAround:'مرجع حراري وصفي حول',savedJournal:'✓ تم تسجيل الملاحظة في سجل الدورة الحالية.',save:'حفظ الإدخال',editSave:'حفظ التعديل',editInProgress:'التعديل جارٍ: تحققي من البيانات ثم احفظي.'}
};
function dt(key){return (DYNAMIC_TEXTS[getLanguage()]||DYNAMIC_TEXTS.fr)[key]||DYNAMIC_TEXTS.fr[key]||key;}
function detectBrowserLanguage(){
  const languages=Array.isArray(navigator.languages)&&navigator.languages.length?navigator.languages:[navigator.language||'fr'];
  for(const raw of languages){
    const code=String(raw).toLowerCase().split('-')[0];
    if(code==='fr'||code==='en'||code==='es'||code==='ar')return code;
  }
  return 'fr';
}
function getLanguage(){const v=loadProfile().language;return ['fr','en','es','ar'].includes(v)?v:'fr';}
function getUnit(){return loadProfile().unit==='f'?'f':'c';}
function celsiusToDisplay(value){const n=Number(value);return getUnit()==='f'?(n*9/5+32):n;}
function displayToCelsius(value){const n=Number(value);return getUnit()==='f'?(n-32)*5/9:n;}
function formatTemperature(value,decimals=2){if(value===null||value===undefined||!Number.isFinite(Number(value)))return '—';return celsiusToDisplay(value).toFixed(decimals)+' °'+(getUnit()==='f'?'F':'C');}
function applyTemperatureInputSettings(){const input=document.getElementById('f-temp'),label=document.getElementById('temp-unit-label');if(!input)return;const f=getUnit()==='f';input.min=f?'93.2':'34';input.max=f?'107.6':'42';input.placeholder=f?'97.70':'36.50';if(label)label.textContent=f?'°F':'°C';}
function applyLanguage(){
  const root=document.documentElement;
  const lang=getLanguage();
  root.lang=lang;
  root.dir=lang==='ar'?'rtl':'ltr';
  const languageHelp={fr:'La langue est détectée automatiquement lors de la première utilisation. Vous pouvez la modifier à tout moment dans votre profil.',en:'Your language is detected automatically the first time you use the app. You can change it at any time in your profile.',es:'El idioma se detecta automáticamente durante el primer uso. Puedes cambiarlo en cualquier momento en tu perfil.',ar:'يتم اكتشاف اللغة تلقائيًا عند أول استخدام. يمكنك تغييرها في أي وقت من ملفك الشخصي.'};
  const d={
    fr:{title:'🌡️ Suivi Symptothermie',nav:['Accueil','Graphique','Calendrier','Historique','Apprendre','Profil'],save:"Enregistrer l'entrée",profile:'👤 Profil et confidentialité',language:'Langue',unit:'Unité de température',
      ui:{todayAdd:'📝 Ajouter l’observation du jour',todayGraph:'📈 Voir le graphique',addTitle:'➕ Ajouter une entrée',tempLink:'Conseils de mesure',chartTitle:'📈 Courbe du cycle en cours',chartDescription:'Le graphique est descriptif, pas diagnostique. Le repère visuel des températures n’est pas un détecteur d’ovulation.',calendarTitle:'🗓️ Calendrier du suivi',prevMonth:'‹ Mois précédent',nextMonth:'Mois suivant ›',intro:'Note la date, ta température, ta glaire cervicale et tes ressentis pour mieux observer ton cycle',learn:'📚 Apprendre la symptothermie',today:'🌿 Aujourd’hui',add:'➕ Ajouter une entrée',date:'Date',temp:'Température',time:'Heure de mesure (optionnel)',bleeding:'Saignement',mucus:'Glaire cervicale',factors:'Contexte de la mesure (optionnel)',notes:'Notes (optionnel)',saveProfile:'Enregistrer le profil',privacy:'Confidentialité :',export:'Exporter mes données',import:'Importer une sauvegarde',clear:'Effacer toutes mes données',calendar:'🗓️ Calendrier du suivi',history:'📋 Journal du cycle en cours',previous:'🗂️ Cycles précédents',sources:'Sources et limites'},
      goals:['Observer mon cycle','Apprendre la symptothermie','Préparer un suivi avec une professionnelle ou un professionnel']},
    en:{title:'🌡️ Symptothermal Tracking',nav:['Home','Chart','Calendar','History','Learn','Profile'],save:'Save entry',profile:'👤 Profile & privacy',language:'Language',unit:'Temperature unit',ui:{todayAdd:'📝 Add today observation',todayGraph:'📈 View chart',addTitle:'➕ Add an entry',tempLink:'Measurement tips',chartTitle:'📈 Current cycle chart',chartDescription:'The chart is descriptive, not diagnostic. The temperature reference is not an ovulation detector.',calendarTitle:'🗓️ Tracking calendar',prevMonth:'‹ Previous month',nextMonth:'Next month ›',intro:'Record the date, temperature, cervical mucus and how you feel to observe your cycle.',learn:'📚 Learn about the symptothermal method',today:'🌿 Today',add:'➕ Add an entry',date:'Date',temp:'Temperature',time:'Measurement time (optional)',bleeding:'Bleeding',mucus:'Cervical mucus',factors:'Measurement context (optional)',notes:'Notes (optional)',saveProfile:'Save profile',privacy:'Privacy:',export:'Export my data',import:'Import a backup',clear:'Delete all my data',calendar:'🗓️ Tracking calendar',history:'📋 Current cycle journal',previous:'🗂️ Previous cycles',sources:'Sources & limitations'},goals:['Observe my cycle','Learn the symptothermal method','Prepare for follow-up with a healthcare professional']},
    es:{title:'🌡️ Seguimiento sintotérmico',nav:['Inicio','Gráfico','Calendario','Historial','Aprender','Perfil'],save:'Guardar observación',profile:'👤 Perfil y privacidad',language:'Idioma',unit:'Unidad de temperatura',
      ui:{todayAdd:'📝 Añadir la observación de hoy',todayGraph:'📈 Ver el gráfico',addTitle:'➕ Añadir una observación',tempLink:'Consejos de medición',chartTitle:'📈 Curva del ciclo actual',chartDescription:'El gráfico es descriptivo, no diagnóstico. La referencia visual de las temperaturas no es un detector de ovulación.',calendarTitle:'🗓️ Calendario del seguimiento',prevMonth:'‹ Mes anterior',nextMonth:'Mes siguiente ›',intro:'Anota la fecha, tu temperatura, tu moco cervical y lo que sientes para observar mejor tu ciclo',learn:'📚 Aprender sobre el método sintotérmico',today:'🌿 Hoy',add:'➕ Añadir una observación',date:'Fecha',temp:'Temperatura',time:'Hora de medición (opcional)',bleeding:'Sangrado',mucus:'Moco cervical',factors:'Contexto de la medición (opcional)',notes:'Notas (opcional)',saveProfile:'Guardar perfil',privacy:'Privacidad:',export:'Exportar mis datos',import:'Importar una copia de seguridad',clear:'Borrar todos mis datos',calendar:'🗓️ Calendario del seguimiento',history:'📋 Diario del ciclo actual',previous:'🗂️ Ciclos anteriores',sources:'Fuentes y límites'},
      goals:['Observar mi ciclo','Aprender el método sintotérmico','Preparar un seguimiento con una profesional o un profesional']},
    ar:{title:'🌡️ متابعة الأعراض الحرارية',nav:['الرئيسية','الرسم البياني','التقويم','السجل','التعلّم','الملف الشخصي'],save:'حفظ الملاحظة',profile:'👤 الملف الشخصي والخصوصية',language:'اللغة',unit:'وحدة درجة الحرارة',
      ui:{todayAdd:'📝 إضافة ملاحظة اليوم',todayGraph:'📈 عرض الرسم البياني',addTitle:'➕ إضافة ملاحظة',tempLink:'نصائح القياس',chartTitle:'📈 منحنى الدورة الحالية',chartDescription:'الرسم البياني وصفي وليس تشخيصيًا. المرجع البصري لدرجات الحرارة ليس كاشفًا للإباضة.',calendarTitle:'🗓️ تقويم المتابعة',prevMonth:'‹ الشهر السابق',nextMonth:'الشهر التالي ›',intro:'سجّلي التاريخ ودرجة الحرارة ومخاط عنق الرحم وما تشعرين به لمراقبة دورتك بشكل أفضل',learn:'📚 تعلّم متابعة الأعراض الحرارية',today:'🌿 اليوم',add:'➕ إضافة ملاحظة',date:'التاريخ',temp:'درجة الحرارة',time:'وقت القياس (اختياري)',bleeding:'النزيف',mucus:'مخاط عنق الرحم',factors:'سياق القياس (اختياري)',notes:'ملاحظات (اختياري)',saveProfile:'حفظ الملف الشخصي',privacy:'الخصوصية:',export:'تصدير بياناتي',import:'استيراد نسخة احتياطية',clear:'حذف جميع بياناتي',calendar:'🗓️ تقويم المتابعة',history:'📋 سجل الدورة الحالية',previous:'🗂️ الدورات السابقة',sources:'المصادر والحدود'},
      goals:['مراقبة دورتي','تعلّم متابعة الأعراض الحرارية','التحضير للمتابعة مع مختصة أو مختص']}
  }[lang];
  const languageHelpNode=document.getElementById('language-help');if(languageHelpNode)languageHelpNode.textContent=languageHelp[lang]||languageHelp.fr;
  const h=document.querySelector('header h1');if(h)h.textContent=d.title;
  const intro=document.querySelector('header p');if(intro)intro.textContent=d.ui.intro;
  document.querySelectorAll('.app-nav a').forEach((a,n)=>{if(d.nav[n])a.textContent=d.nav[n];});
  const set=(sel,val)=>{const el=document.querySelector(sel);if(el&&val!==undefined)el.textContent=val;};
  set('#learn-title',d.ui.learn);set('#today-title',d.ui.today);set('#profil h2',d.profile);set('#sources-title',d.ui.sources);
  set('section#accueil .card:nth-of-type(2) h2',d.ui.add);set('#calendrier h2',d.ui.calendar);set('#historique .card:first-child h2',d.ui.history);set('#historique .card:nth-child(2) h2',d.ui.previous);
  set('label[for="profile-language"]',d.language);set('label[for="profile-unit"]',d.unit);set('label[for="profile-name"]',lang==='fr'?'Prénom ou nom d’affichage (facultatif)':lang==='en'?'Display name (optional)':lang==='es'?'Nombre para mostrar (opcional)':'اسم العرض (اختياري)');
  set('label[for="profile-goal"]',lang==='fr'?'Objectif d’observation':lang==='en'?'Observation goal':lang==='es'?'Objetivo de observación':'هدف المتابعة');
  set('label[for="f-date"]',d.ui.date);set('#temp-label-text',d.ui.temp);set('label[for="f-time"]',d.ui.time);set('label[for="f-bleeding"]',d.ui.bleeding);set('#mucus-label-text',d.ui.mucus);set('#factors-label',d.ui.factors);set('label[for="f-notes"]',d.ui.notes);
  set('#today-add-btn',d.ui.todayAdd);set('#today-graph-btn',d.ui.todayGraph);set('#entry-title',d.ui.addTitle);set('#temp-label-text',d.ui.temp);set('#temp-help-link',d.ui.tempLink);set('#chart-description',d.ui.chartDescription);
  const chartTitle=document.getElementById('chart-title');
  const thermalBadge=document.getElementById('thermal-badge');
  if(chartTitle){
    const titleText=[...chartTitle.childNodes].find(node=>node.nodeType===Node.TEXT_NODE);
    if(titleText) titleText.nodeValue=d.ui.chartTitle+' ';
    else if(thermalBadge) chartTitle.insertBefore(document.createTextNode(d.ui.chartTitle+' '),thermalBadge);
    else chartTitle.textContent=d.ui.chartTitle;
  }set('#calendar-heading',d.ui.calendarTitle);set('#calendar-prev-btn',d.ui.prevMonth);set('#calendar-next-btn',d.ui.nextMonth);
  const saveProfile=document.querySelector('[data-action="save-profile"]');if(saveProfile)saveProfile.textContent=d.ui.saveProfile;
  const privacy=document.querySelector('.privacy-box');if(privacy)privacy.firstChild.textContent=d.ui.privacy+' ';
  const buttons=document.querySelectorAll('[data-action="export-data"],[data-action="import-data"],[data-action="clear-all-data"]');if(buttons[0])buttons[0].textContent=d.ui.export;if(buttons[1])buttons[1].textContent=d.ui.import;if(buttons[2])buttons[2].textContent=d.ui.clear;
  const goal=document.getElementById('profile-goal');if(goal)goal.querySelectorAll('option').forEach((o,i)=>{if(d.goals[i])o.textContent=d.goals[i];});
  const labels={
    fr:{bleeding:['Aucun renseigné','Règles','Spotting (saignement léger)'],mucus:['Sec / absent','Collante','Crémeuse',"Blanc d'œuf (observation)"],factors:['Maladie / fièvre','Sommeil perturbé','Horaire inhabituel','Voyage / déplacement','Alcool','Médicament']},
    en:{bleeding:['None indicated','Period','Spotting (light bleeding)'],mucus:['Dry / absent','Sticky','Creamy','Egg white (observation)'],factors:['Illness / fever','Disturbed sleep','Unusual schedule','Travel / displacement','Alcohol','Medication']},
    es:{bleeding:['Ninguno indicado','Regla','Spotting (sangrado leve)'],mucus:['Seco / ausente','Pegajoso','Cremoso',"Clara de huevo (observación)"],factors:['Enfermedad / fiebre','Sueño alterado','Horario inusual','Viaje / desplazamiento','Alcohol','Medicamento']},
    ar:{bleeding:['لا يوجد','الدورة الشهرية','نزيف خفيف'],mucus:['جاف / غير موجود','لزج','كريمي','مثل بياض البيض (ملاحظة)'],factors:['مرض / حمى','اضطراب النوم','وقت غير معتاد','سفر / تنقّل','كحول','دواء']}
  }[lang];
  document.querySelectorAll('#f-bleeding option').forEach((o,i)=>o.textContent=labels.bleeding[i]||o.textContent);
  document.querySelectorAll('#f-mucus option').forEach((o,i)=>o.textContent=labels.mucus[i]||o.textContent);
  document.querySelectorAll('.factor').forEach((o,i)=>{const label=o.parentElement;if(label&&labels.factors[i])label.lastChild.textContent=' '+labels.factors[i];});
  const s=document.getElementById('save-entry-btn');if(s&&!s.disabled)s.textContent=d.save;
  applyTemperatureInputSettings();
}
function loadProfile(){if(memProfile!==null)return memProfile;const fallback={version:APP_DATA_VERSION,name:'',goal:'observer',language:detectBrowserLanguage(),unit:'c'};try{const v=JSON.parse(localStorage.getItem(PROFILE_KEY)||'null');if(v===null){memProfile=fallback;return memProfile;}if(typeof v!=='object'||Array.isArray(v)||(v.version!==undefined&&v.version!==APP_DATA_VERSION)||('name'in v&&(typeof v.name!=='string'||v.name.length>80))||('goal'in v&&!['observer','apprendre','suivi'].includes(v.goal))||('language'in v&&!['fr','en','es','ar'].includes(v.language))||('unit'in v&&!['c','f'].includes(v.unit)))throw new Error('format');memProfile={version:APP_DATA_VERSION,name:v.name||'',goal:v.goal||'observer',language:v.language||'fr',unit:v.unit||'c'};}catch(e){storageAvailable=false;memProfile=fallback;setStorageStatus('Le profil local est illisible. Tu peux en enregistrer un nouveau dans cette session.');}return memProfile;}
function renderProfile(){const p=loadProfile();const n=document.getElementById('profile-name'),g=document.getElementById('profile-goal'),l=document.getElementById('profile-language'),u=document.getElementById('profile-unit');if(n)n.value=p.name||'';if(g)g.value=p.goal||'observer';if(l)l.value=p.language||'fr';if(u)u.value=p.unit||'c';applyLanguage();}
function setProfileStatus(message){const status=document.getElementById('profile-status');if(status)status.textContent=message;}
function saveProfile(){const name=(document.getElementById('profile-name').value||'').trim(),goal=document.getElementById('profile-goal').value,language=document.getElementById('profile-language').value,unit=document.getElementById('profile-unit').value;if(name.length>80){setProfileStatus('Le nom d’affichage ne peut pas dépasser 80 caractères.');document.getElementById('profile-status')?.focus();return;}if(!['observer','apprendre','suivi'].includes(goal)){setProfileStatus('Objectif de profil invalide.');document.getElementById('profile-status')?.focus();return;}if(!['fr','en','es','ar'].includes(language)||!['c','f'].includes(unit)){setProfileStatus('Paramètre de profil invalide.');document.getElementById('profile-status')?.focus();return;}const p={version:APP_DATA_VERSION,name,goal,language,unit};memProfile=p;try{localStorage.setItem(PROFILE_KEY,JSON.stringify(p));setProfileStatus('Profil enregistré.');}catch(e){storageAvailable=false;setProfileStatus('Le profil n’a pas pu être enregistré durablement. Il reste disponible pendant cette session.');setStorageStatus('Le profil n’a pas pu être enregistré durablement dans ce navigateur.');}applyLanguage();renderProfile();render();document.getElementById('profile-status')?.focus();}
function allEntriesForCalendar(){const map={};[...loadHistory().flatMap(c=>c.entries||[]),...loadCurrent()].forEach(e=>{map[e.date]=e;});return map;}
function renderCalendar(){const grid=document.getElementById('calendar-grid'),title=document.getElementById('calendar-title');if(!grid||!title)return;const y=calendarDate.getFullYear(),m=calendarDate.getMonth();title.textContent=new Date(y,m,1).toLocaleDateString(getLanguage()==='ar'?'ar':getLanguage()==='es'?'es':'fr',{month:'long',year:'numeric'});const first=new Date(y,m,1),days=new Date(y,m+1,0).getDate(),offset=(first.getDay()+6)%7,map=allEntriesForCalendar();const weekdays=getLanguage()==='en'?['Mon','Tue','Wed','Thu','Fri','Sat','Sun']:getLanguage()==='ar'?['الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت','الأحد']:getLanguage()==='es'?['Lun','Mar','Mié','Jue','Vie','Sáb','Dom']:['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];let html=weekdays.map(d=>'<div class="calendar-head">'+d+'</div>').join('');for(let i=0;i<offset;i++)html+='<div class="calendar-day empty" aria-hidden="true"></div>';for(let d=1;d<=days;d++){const key=y+'-'+String(m+1).padStart(2,'0')+'-'+String(d).padStart(2,'0'),e=map[key],cls='calendar-day'+(e?' has-entry':'')+(e&&e.bleeding==='regles'?' is-period':'');html+='<div class="'+cls+'"'+(e?' role="button" tabindex="0" aria-label="'+(getLanguage()==='en'?'View observations for ':getLanguage()==='es'?'Ver las observaciones del ':getLanguage()==='ar'?'عرض ملاحظات ':'Voir les observations du ')+formatDate(key)+'" data-calendar-date="'+key+'"':'')+'><span class="day-num">'+d+'</span>'+(e?'<span class="day-meta">'+(e.temp!==null?formatTemperature(e.temp,1):(getLanguage()==='en'?'Observation':getLanguage()==='es'?'Observación':getLanguage()==='ar'?'ملاحظة':'Observation'))+'</span>':'')+'</div>';}grid.innerHTML=html;}
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}
function showCalendarDetail(date) {
  const detail = document.getElementById('calendar-detail');
  const entry = allEntriesForCalendar()[date];
  if (!detail || !entry) return;
  const temp = entry.temp !== null ? formatTemperature(entry.temp,2) : dt('notFilled');
  detail.style.display = 'block';
  const factorLabels = getLanguage()==='en' ? {maladie:'illness/fever',sommeil:'disturbed sleep',horaire:'unusual schedule',voyage:'travel/displacement',alcool:'alcohol',medicament:'medication'} : getLanguage()==='es' ? {maladie:'enfermedad/fiebre',sommeil:'sueño alterado',horaire:'horario inusual',voyage:'viaje/desplazamiento',alcool:'alcohol',medicament:'medicamento'} : getLanguage()==='ar' ? {maladie:'مرض/حمى',sommeil:'اضطراب النوم',horaire:'وقت غير معتاد',voyage:'سفر/تنقّل',alcool:'كحول',medicament:'دواء'} : {maladie:'maladie/fièvre',sommeil:'sommeil perturbé',horaire:'horaire inhabituel',voyage:'voyage/déplacement',alcool:'alcool',medicament:'médicament'};
  const factors = Array.isArray(entry.factors) && entry.factors.length ? '<br>' + dt('context') + ' : ' + entry.factors.map(f => escapeHtml(factorLabels[f] || f)).join(', ') : '';
  const notes = entry.notes ? '<br>' + dt('notes') + ' : ' + escapeHtml(entry.notes) : '';
  const time = entry.time ? '<br>' + dt('measurementTime') + ' : ' + escapeHtml(entry.time) : '';
  const bleeding = entry.bleeding && entry.bleeding !== 'aucun' ? '<br>' + dt('bleeding') + ' : ' + (entry.bleeding === 'regles' ? dt('period') : dt('spotting')) : '';
  detail.innerHTML = '<strong>' + formatDate(date) + '</strong> — ' + dt('temperature') + ' : ' + temp + ' — ' + dt('observation') + ' : ' + (mucusLabel(entry.mucus) || dt('notFilled')) + bleeding + time + factors + notes;
  detail.focus();
}

function changeCalendarMonth(delta){calendarDate=new Date(calendarDate.getFullYear(),calendarDate.getMonth()+delta,1);renderCalendar();}
function clearAllData(){
  if(!confirm(at('clearConfirm'))) return;
  const keys=[CURRENT_KEY,HISTORY_KEY,LEARNING_KEY,PROFILE_KEY], previous={};
  keys.forEach(key => { previous[key]=null; });
  let persistent=true;
  try {
    keys.forEach(key => { previous[key]=localStorage.getItem(key); });
    keys.forEach(key => localStorage.removeItem(key));
  } catch (error) {
    persistent=false;
    try {
      keys.forEach(key => {
        if (previous[key] === null) localStorage.removeItem(key);
        else localStorage.setItem(key, previous[key]);
      });
    } catch (rollbackError) {}
  }
  memCurrent=[];
  memHistory=[];
  memLearning={version:LEARNING_VERSION,completed:{},lastModule:null};
  memProfile={version:APP_DATA_VERSION,name:'',goal:'observer',language:detectBrowserLanguage(),unit:'c'};
  storageAvailable=persistent;
  setActionStatus(persistent?at('clear'):at('storageSession'));
  if(!persistent) setStorageStatus('Le navigateur n’a pas permis de modifier durablement les données locales. Les données sont toutefois effacées de la session en cours.');
  document.getElementById('action-status')?.focus();
  renderProfile();renderLearning();renderCalendar();render();
}
function setBackupStatus(message) {
  const status = document.getElementById('backup-status');
  if (status) status.textContent = message;
}
function setActionStatus(message) {
  const status = document.getElementById('action-status');
  const entryStatus = document.getElementById('entry-action-status');
  if (status) status.textContent = message;
  if (entryStatus) {
    entryStatus.textContent = message;
    entryStatus.style.display = 'block';
    entryStatus.focus();
  }
}

const THERMOMETER_SERVICE_UUID = 0x1809;
const TEMPERATURE_MEASUREMENT_UUID = 0x2A1C;
let bluetoothDevice = null;
let temperatureCharacteristic = null;

function decodeBleTemperature(dataView) {
  if (!dataView || dataView.byteLength < 5) return null;
  const flags = dataView.getUint8(0);
  let raw = dataView.getUint32(1, true);
  let mantissa = raw & 0x00FFFFFF;
  if (mantissa & 0x00800000) mantissa |= 0xFF000000;
  const exponent = (raw >> 24) & 0xFF;
  const signedExponent = exponent & 0x80 ? exponent - 0x100 : exponent;
  let value = mantissa * Math.pow(10, signedExponent);
  if (flags & 0x01) value = (value - 32) * 5 / 9;
  if (!Number.isFinite(value) || value < 34 || value > 42) return null;
  return value;
}

function setThermometerStatus(message) {
  const status = document.getElementById('thermometer-status');
  if (status) status.textContent = message;
}

function handleThermometerMeasurement(event) {
  const value = decodeBleTemperature(event.target.value);
  if (value === null) {
    setThermometerStatus(bt('invalid'));
    return;
  }
  const field = document.getElementById('f-temp');
  if (field) field.value = celsiusToDisplay(value).toFixed(2);
  const timeField = document.getElementById('f-time');
  if (timeField && !timeField.value) {
    const now = new Date();
    timeField.value = now.toTimeString().slice(0, 5);
  }
  setThermometerStatus(bt('received',{temp:formatTemperature(value,2)}));
}

async function connectThermometer() {
  if (!('bluetooth' in navigator) || !navigator.bluetooth) {
    setThermometerStatus(bt('unsupported'));
    return;
  }
  try {
    setThermometerStatus(bt('search'));
    bluetoothDevice = await navigator.bluetooth.requestDevice({
      filters: [{ services: [THERMOMETER_SERVICE_UUID] }],
      optionalServices: [THERMOMETER_SERVICE_UUID]
    });
    bluetoothDevice.addEventListener('gattserverdisconnected', () => {
      temperatureCharacteristic = null;
      setThermometerStatus(bt('disconnected'));
    });
    const server = await bluetoothDevice.gatt.connect();
    const service = await server.getPrimaryService(THERMOMETER_SERVICE_UUID);
    temperatureCharacteristic = await service.getCharacteristic(TEMPERATURE_MEASUREMENT_UUID);
    temperatureCharacteristic.addEventListener('characteristicvaluechanged', handleThermometerMeasurement);
    await temperatureCharacteristic.startNotifications();
    try {
      const value = await temperatureCharacteristic.readValue();
      handleThermometerMeasurement({ target: { value } });
    } catch (readError) {}
    const button = document.getElementById('connect-thermometer-btn');
    if (button) button.textContent = at('connect');
    setThermometerStatus(bt('connected',{name:bluetoothDevice.name || (getLanguage()==='en'?'compatible thermometer':getLanguage()==='es'?'termómetro compatible':getLanguage()==='ar'?'مقياس حرارة متوافق':'thermomètre compatible')}));
  } catch (error) {
    if (error && error.name === 'NotFoundError') {
      setThermometerStatus(bt('none'));
    } else {
      setThermometerStatus(bt('failed'));
    }
  }
}

function exportData(){const current=loadCurrent();const history=loadHistory();if(!current.length&&!history.length){setBackupStatus(at('exportEmpty'));return;}const exportedAt=new Date().toISOString();const payload={version:APP_DATA_VERSION,exportedAt,current,history,learning:loadLearning(),profile:loadProfile()};const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;const dateLabel=new Date().toISOString().slice(0,10);a.download='SymRella-sauvegarde-'+dateLabel+'.json';document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);setBackupStatus(at('exported'));}
function isValidDateKey(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(value + 'T00:00:00');
  return !Number.isNaN(d.getTime()) && localDateKey(d) === value;
}

function validBackup(value){if(!value||typeof value!=='object'||value.version!==APP_DATA_VERSION||!validEntryCollection(value.current)||!Array.isArray(value.history)||value.history.length>MAX_HISTORY_CYCLES)return false;const p=value.profile;if(p!==undefined&&p!==null&&(typeof p!=='object'||Array.isArray(p)||(p.version!==undefined&&p.version!==APP_DATA_VERSION)||(p.name!==undefined&&(typeof p.name!=='string'||p.name.length>80))||(p.goal!==undefined&&!['observer','apprendre','suivi'].includes(p.goal))||(p.language!==undefined&&!['fr','en','es','ar'].includes(p.language))||(p.unit!==undefined&&!['c','f'].includes(p.unit))))return false;if(typeof value.exportedAt!=='string'||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value.exportedAt)||Number.isNaN(Date.parse(value.exportedAt)))return false;return value.current.every(validStoredEntry)&&value.history.every(validStoredHistoryCycle);}
function importData(event){const file=event.target.files&&event.target.files[0];if(!file)return;if(file.size>2*1024*1024){setBackupStatus(at('importTooLarge'));const status=document.getElementById('backup-status');if(status)status.focus();event.target.value='';return;}const reader=new FileReader();reader.onload=()=>{try{const p=JSON.parse(reader.result);if(!p||typeof p!=='object'||Array.isArray(p)||!validBackup(p)||('learning'in p&&p.learning!==undefined&&!validLearning(p.learning)))throw new Error('format');if(!confirm(at('importConfirm')))return;const keys=[CURRENT_KEY,HISTORY_KEY,LEARNING_KEY,PROFILE_KEY],previous={};keys.forEach(key=>{previous[key]=localStorage.getItem(key);});const nextLearning=p.learning&&validLearning(p.learning)?p.learning:{version:LEARNING_VERSION,completed:{},lastModule:null};const nextProfile=p.profile&&typeof p.profile==='object'?p.profile:{version:APP_DATA_VERSION,name:'',goal:'observer',language:detectBrowserLanguage(),unit:'c'};try{localStorage.setItem(CURRENT_KEY,JSON.stringify(p.current));localStorage.setItem(HISTORY_KEY,JSON.stringify(p.history));localStorage.setItem(LEARNING_KEY,JSON.stringify(nextLearning));localStorage.setItem(PROFILE_KEY,JSON.stringify(nextProfile));}catch(storageError){try{keys.forEach(key=>{if(previous[key]===null)localStorage.removeItem(key);else localStorage.setItem(key,previous[key]);});}catch(rollbackError){}throw storageError;}memCurrent=p.current;memHistory=p.history;memLearning=nextLearning;memProfile=nextProfile;storageAvailable=true;renderProfile();renderLearning();renderCalendar();render();setBackupStatus(at('imported'));const status=document.getElementById('backup-status');if(status)status.focus();}catch(e){setBackupStatus(at('importFailed'));const status=document.getElementById('backup-status');if(status)status.focus();}finally{event.target.value='';}};reader.readAsText(file);}
document.addEventListener('click', (event) => {
  const calendarTarget = event.target.closest('[data-calendar-date]');
  if (calendarTarget) {
    showCalendarDetail(calendarTarget.dataset.calendarDate);
    return;
  }
  const target = event.target.closest('[data-action]');
  if (!target) return;
  const action = target.dataset.action;
  if (action === 'edit-entry') editEntry(target.dataset.date);
  else if (action === 'delete-entry') deleteEntry(target.dataset.date);
  else if (action === 'delete-history-cycle') deleteHistoryCycle(Number(target.dataset.index));
  else if (action === 'focus-date') document.getElementById('f-date')?.focus();
  else if (action === 'scroll-graph') document.getElementById('graphique')?.scrollIntoView({behavior:'smooth'});
  else if (action === 'open-lesson') openLesson(target.dataset.module);
  else if (action === 'cancel-edit') cancelEdit();
  else if (action === 'start-new-cycle') startNewCycle();
  else if (action === 'export-pdf') exportPDF();
  else if (action === 'calendar-prev') changeCalendarMonth(-1);
  else if (action === 'calendar-next') changeCalendarMonth(1);
  else if (action === 'save-profile') saveProfile();
  else if (action === 'export-data') exportData();
  else if (action === 'import-data') document.getElementById('import-data')?.click();
  else if (action === 'clear-all-data') clearAllData();
  else if (action === 'connect-thermometer') connectThermometer();
  else if (action === 'answer-quiz') answerQuiz(target.dataset.module, Number(target.dataset.option));
  else if (action === 'complete-lesson') completeLesson(target.dataset.module);
  else if (action === 'close-lesson') document.getElementById('lesson-view').hidden = true;
});
document.getElementById('import-data')?.addEventListener('change', importData);
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  const target = event.target.closest('[data-calendar-date]');
  if (!target) return;
  event.preventDefault();
  showCalendarDetail(target.dataset.calendarDate);
});
document.getElementById('resume-learning').addEventListener('click', () => openLesson(loadLearning().lastModule || MODULES[0].id));
document.getElementById('toggle-modules').addEventListener('click', () => {
  const list = document.getElementById('module-list');
  const button = document.getElementById('toggle-modules');
  if (!list || !button) return;
  const expanded = list.hidden;
  list.hidden = !expanded;
  button.setAttribute('aria-expanded', String(expanded));
  button.textContent = expanded ? (getLanguage()==='es'?'Ocultar módulos':getLanguage()==='ar'?'إخفاء الوحدات':'Masquer les modules') : (getLanguage()==='es'?'Mostrar módulos':getLanguage()==='ar'?'عرض الوحدات':'Afficher les modules');
});
document.getElementById('reset-learning').addEventListener('click', resetLearning);
renderLearning();
renderProfile();
renderCalendar();
render();

(() => {
  const button = document.getElementById('save-entry-btn');
  const status = document.getElementById('entry-action-status');
  if (!button) return;

  const showFallbackError = (message) => {
    if (status) {
      status.textContent = message;
      status.style.display = 'block';
      status.focus();
    }
  };

  button.addEventListener('click', (event) => {
    event.preventDefault();
    try {
      if (typeof window.addEntry !== 'function') {
        showFallbackError('L’application n’a pas terminé son initialisation. Recharge la page puis réessaie.');
        return;
      }
      window.addEntry();
    } catch (error) {
      console.error('Erreur lors de l’enregistrement de l’observation:', error);
      showFallbackError('L’enregistrement a rencontré un problème. Tes données existantes sont conservées.');
    }
  });
})();

if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1")) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
}
/* SymRella observation assistant v3
 * Guided descriptive learning aid + local visual comparison cards.
 * No AI classification, fertility, ovulation, Peak, Peak+3 or contraceptive advice.
 */
(() => {
  const state={objectUrl:null,photoQuality:'none'};
  const create=(tag,props={},children=[])=>{const el=document.createElement(tag);Object.entries(props).forEach(([k,v])=>{if(k==='text')el.textContent=v;else if(k==='className')el.className=v;else if(k==='htmlFor')el.htmlFor=v;else if(k==='hidden')el.hidden=!!v;else el.setAttribute(k,v);});children.forEach(c=>el.appendChild(c));return el;};
  const field=(id,label,options)=>{const w=create('div',{className:'observation-assistant-field'});if(label)w.appendChild(create('label',{htmlFor:id,text:label}));const s=create('select',{id});options.forEach(([v,t])=>s.appendChild(create('option',{value:v,text:t})));w.appendChild(s);return w;};
  const mount=document.querySelector('#accueil');if(!mount||document.getElementById('cervical-observation-assistant'))return;
  const style=create('style');style.textContent='#cervical-observation-assistant .assistant-steps{display:grid;gap:16px}#cervical-observation-assistant .assistant-step{padding:14px;border:1px solid var(--border);border-radius:12px}#cervical-observation-assistant .assistant-step h3{margin:0 0 6px}#cervical-observation-assistant .assistant-grid{display:grid;gap:12px}@media(min-width:620px){#cervical-observation-assistant .assistant-grid{grid-template-columns:1fr 1fr}}#cervical-observation-assistant .assistant-photo{display:grid;gap:10px}#cervical-observation-assistant .assistant-preview{max-width:100%;max-height:260px;border:1px solid var(--border);border-radius:12px;object-fit:contain;background:var(--bg)}#cervical-observation-assistant .assistant-result{margin-top:16px}#cervical-observation-assistant .assistant-result strong{font-size:1.05rem}#cervical-observation-assistant .assistant-muted{color:var(--text-muted);font-size:.84rem}#cervical-observation-assistant .assistant-evidence{margin:8px 0 0;padding-left:20px}#cervical-observation-assistant .assistant-visual-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:12px}@media(min-width:760px){#cervical-observation-assistant .assistant-visual-grid{grid-template-columns:repeat(4,minmax(0,1fr))}}#cervical-observation-assistant .assistant-visual{padding:10px;border:1px solid var(--border);border-radius:10px;background:transparent;text-align:left;cursor:pointer}#cervical-observation-assistant .assistant-visual[aria-pressed=true]{outline:2px solid currentColor}#cervical-observation-assistant .assistant-swatch{height:76px;border-radius:8px;margin-bottom:7px;border:1px solid var(--border)}';
  document.head.appendChild(style);
  const card=create('div',{id:'cervical-observation-assistant',className:'card no-print'});
  card.appendChild(create('h2',{text:'🔎 M’aider à reconnaître ce que j’observe'}));
  card.appendChild(create('p',{className:'learn-meta',text:'Vous n’avez pas besoin de connaître les catégories à l’avance. Comparez d’abord, puis décrivez ce que vous voyez et ressentez.'}));
  card.appendChild(create('div',{className:'notice',text:'L’objectif est d’apprendre à décrire votre observation. Une observation peut être mixte ou difficile à caractériser.'}));
  const photo=create('div',{className:'assistant-photo assistant-step',style:'margin-top:16px;'});photo.appendChild(create('h3',{text:'Photo facultative'}));photo.appendChild(create('div',{className:'assistant-muted',text:'La photo peut rester sur votre appareil comme support de comparaison. Elle n’est ni envoyée ni classée automatiquement.'}));
  const input=create('input',{id:'cervical-photo',type:'file',accept:'image/jpeg,image/png,image/webp'});photo.appendChild(input);photo.appendChild(create('div',{className:'assistant-muted',text:'Maximum 8 Mo. Aucune sauvegarde dans le journal.'}));const ps=create('div',{id:'cervical-photo-status',className:'learn-meta',role:'status','aria-live':'polite'});photo.appendChild(ps);const preview=create('img',{id:'cervical-photo-preview',className:'assistant-preview',alt:'Aperçu local de l’observation',hidden:true});photo.appendChild(preview);card.appendChild(photo);
  const visual=create('section',{className:'assistant-step',style:'margin-top:16px;'});visual.appendChild(create('h3',{text:'Comparer avant de nommer'}));visual.appendChild(create('p',{className:'assistant-muted',text:'Ces vignettes sont des repères visuels simplifiés, pas des photographies médicales. Choisissez celle qui vous paraît la plus proche, ou « aucune ».'}));
  const vg=create('div',{className:'assistant-visual-grid'});
  [['opaque','Blanc / opaque','Surface visuellement peu transparente','linear-gradient(135deg,#f4f4f4,#dcdcdc)'],['translucent','Translucide','Laisse partiellement passer la lumière','linear-gradient(135deg,#eef7f7,#cfe3e3)'],['transparent','Transparent','Clair et visuellement transparent','linear-gradient(135deg,#ffffff,#dceff5)'],['stretchy','Étirable','Aspect filant / pouvant former un fil','linear-gradient(135deg,#f8fbfb,#e7f3f3)']].forEach(([v,t,d,bg])=>{const btn=create('button',{className:'assistant-visual',type:'button','aria-pressed':'false'});const sw=create('div',{className:'assistant-swatch'});sw.style.background=bg;btn.appendChild(sw);btn.appendChild(create('strong',{text:t}));btn.appendChild(create('div',{className:'assistant-muted',text:d}));btn.addEventListener('click',()=>{vg.querySelectorAll('.assistant-visual').forEach(x=>x.setAttribute('aria-pressed','false'));btn.setAttribute('aria-pressed','true');btn.dataset.value=v;});vg.appendChild(btn);});
  const none=create('button',{className:'btn btn-secondary',type:'button',style:'margin-top:10px;',text:'Aucune ne correspond'});none.addEventListener('click',()=>vg.querySelectorAll('.assistant-visual').forEach(x=>x.setAttribute('aria-pressed','false')));visual.appendChild(vg);visual.appendChild(none);card.appendChild(visual);
  const steps=create('div',{className:'assistant-steps',style:'margin-top:16px;'});
  const s1=create('section',{className:'assistant-step'});s1.appendChild(create('h3',{text:'1. Quelle sensation ressentez-vous ?'}));s1.appendChild(create('p',{className:'assistant-muted',text:'Au niveau de la vulve en vous essuyant :'}));s1.appendChild(field('ca-sensation','',[['unknown','Je ne sais pas'],['dry','Sèche'],['moist','Humide'],['wet','Mouillée'],['slippery','Glissante']]));steps.appendChild(s1);
  const s2=create('section',{className:'assistant-step'});s2.appendChild(create('h3',{text:'2. Quelle consistance observez-vous ?'}));s2.appendChild(create('p',{className:'assistant-muted',text:'Décrivez ce que vous voyez sans chercher encore à lui donner un nom.'}));const g2=create('div',{className:'assistant-grid'});g2.appendChild(field('ca-texture','',[['unknown','Je ne sais pas'],['creamy','Épaisse / crémeuse'],['watery','Très fluide / aqueuse'],['gel_like','Gélatineuse'],['sticky','Collante'],['mixed','Mélangée / difficile à décrire']]));g2.appendChild(field('ca-transparency','',[['unknown','Je ne sais pas'],['transparent','Claire / transparente'],['translucent','Translucide'],['opaque','Opaque / blanche']]));s2.appendChild(g2);steps.appendChild(s2);
  const s3=create('section',{className:'assistant-step'});s3.appendChild(create('h3',{text:'3. Que se passe-t-il si elle est étirée ?'}));s3.appendChild(create('p',{className:'assistant-muted',text:'Si vous souhaitez faire ce test, faites-le doucement.'}));const g3=create('div',{className:'assistant-grid'});g3.appendChild(field('ca-extensibility','',[['unknown','Je ne sais pas / pas testé'],['absent','Ne s’étire pas'],['weak','S’étire très peu'],['clear','S’étire nettement'],['indeterminate','Impossible à déterminer']]));g3.appendChild(field('ca-stretch-length','',[['unknown','Je ne sais pas'],['0','Aucun'],['lt_1cm','Moins de 1 cm'],['1_2cm','Environ 1 à 2 cm'],['gt_2cm','Plus de 2 cm']]));s3.appendChild(g3);steps.appendChild(s3);card.appendChild(steps);
  const actions=create('div',{className:'row-actions',style:'margin-top:16px;'});actions.appendChild(create('button',{className:'btn',type:'button',id:'cervical-assistant-analyze',text:'Voir la description la plus proche'}));actions.appendChild(create('button',{className:'btn btn-secondary',type:'button',id:'cervical-assistant-reset',text:'Recommencer'}));card.appendChild(actions);
  const result=create('div',{id:'cervical-assistant-result',className:'notice assistant-result',role:'status','aria-live':'polite',tabindex:'-1',hidden:true});card.appendChild(result);
  const formCard=mount.querySelector('.card.no-print:nth-of-type(2)');if(formCard)formCard.insertAdjacentElement('afterend',card);else mount.appendChild(card);
  const setResult=(title,evidence,details)=>{while(result.firstChild)result.removeChild(result.firstChild);result.appendChild(create('strong',{text:title}));if(evidence.length){const ul=create('ul',{className:'assistant-evidence'});evidence.forEach(x=>ul.appendChild(create('li',{text:x})));result.appendChild(ul);}details.forEach(x=>result.appendChild(create('p',{className:'assistant-muted',text:x})));result.hidden=false;result.focus();};
  input.addEventListener('change',()=>{const file=input.files&&input.files[0];if(state.objectUrl)URL.revokeObjectURL(state.objectUrl);state.objectUrl=null;state.photoQuality='none';preview.hidden=true;ps.textContent='';if(!file)return;if(!/^image\/(jpeg|png|webp)$/.test(file.type)||file.size>8*1024*1024){ps.textContent='Format non pris en charge ou fichier supérieur à 8 Mo.';input.value='';return;}const url=URL.createObjectURL(file);state.objectUrl=url;const image=new Image();image.onload=()=>{const mp=image.naturalWidth*image.naturalHeight/1e6;state.photoQuality=image.naturalWidth<640||image.naturalHeight<480||mp<.3?'uncertain':'sufficient';preview.src=url;preview.hidden=false;ps.textContent=state.photoQuality==='sufficient'?'Photo lisible pour comparaison locale. Elle n’est pas analysée automatiquement.':'Photo chargée, mais sa résolution est faible pour une comparaison visuelle fiable.';};image.onerror=()=>{URL.revokeObjectURL(url);state.objectUrl=null;ps.textContent='Impossible de lire cette image.';input.value='';};image.src=url;});
  document.getElementById('cervical-assistant-analyze').addEventListener('click',()=>{const t=document.getElementById('ca-transparency').value,x=document.getElementById('ca-texture').value,e=document.getElementById('ca-extensibility').value,s=document.getElementById('ca-sensation').value,l=document.getElementById('ca-stretch-length').value,v=(vg.querySelector('[aria-pressed=true]')||{}).dataset?.value||'unknown';let c=0,y=0,ec=[],ey=[];if(t==='opaque'||v==='opaque'){c+=2;ec.push('aspect opaque ou blanc');}if(t==='transparent'||v==='transparent'){y+=2;ey.push('aspect clair ou transparent');}if(t==='translucent'||v==='translucent'){c++;y++;}if(x==='creamy'){c+=3;ec.push('consistance épaisse ou crémeuse');}if(x==='watery'){y+=2;ey.push('consistance très fluide');}if(x==='gel_like'){y++;ey.push('aspect gélatineux');}if(x==='sticky'){c+=2;ec.push('consistance collante');}if(x==='mixed'){c++;y++;}if(e==='absent'){c+=2;ec.push('ne s’étire pas');}if(e==='weak'){c++;ec.push('s’étire très peu');}if(e==='clear'||v==='stretchy'){y+=3;ey.push('étirement nettement visible');}if(s==='dry'||s==='moist'){c++;ec.push('sensation sèche ou humide');}if(s==='wet'){y++;ey.push('sensation mouillée');}if(s==='slippery'){y+=3;ey.push('sensation glissante');}if(l==='0'||l==='lt_1cm')c++;if(l==='1_2cm'){y++;ey.push('étirement d’environ 1 à 2 cm');}if(l==='gt_2cm'){y+=2;ey.push('étirement de plus de 2 cm');}const vals=[t,x,e,s,l],known=vals.filter(z=>z!=='unknown'&&z!=='indeterminate').length,gap=Math.abs(c-y);if(known<2||gap<2||x==='mixed'||v==='unknown'){setResult('Observation incertaine ou difficile à caractériser',[...ec.slice(0,2),...ey.slice(0,2)],['Plusieurs caractéristiques se mélangent ou les informations sont insuffisantes pour rapprocher l’observation d’une description unique.','Vous pouvez conserver les caractéristiques observées sans forcer une catégorie.',state.photoQuality==='sufficient'?'La photo reste uniquement un support de comparaison locale.':'La photo n’est pas utilisée pour décider de la description.','SymRella ne déduit ici ni fertilité, ni ovulation, ni Peak, ni Peak+3 et ne fournit pas de conseil contraceptif.']);return;}const cream=c>y;setResult(cream?'Description la plus proche : épaisse / crémeuse':'Description la plus proche : transparente / étirable',cream?ec:ey,['Cette orientation repose sur vos observations guidées, pas sur une analyse automatique de la photo.','Elle sert à apprendre à décrire une observation et ne constitue pas une classification médicale.','SymRella ne déduit ici ni fertilité, ni ovulation, ni Peak, ni Peak+3 et ne fournit pas de conseil contraceptif.']);});
  document.getElementById('cervical-assistant-reset').addEventListener('click',()=>{['ca-sensation','ca-transparency','ca-texture','ca-extensibility','ca-stretch-length'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='unknown';});vg.querySelectorAll('.assistant-visual').forEach(x=>x.setAttribute('aria-pressed','false'));input.value='';if(state.objectUrl)URL.revokeObjectURL(state.objectUrl);state.objectUrl=null;state.photoQuality='none';preview.removeAttribute('src');preview.hidden=true;ps.textContent='';result.hidden=true;});
  window.addEventListener('beforeunload',()=>{if(state.objectUrl)URL.revokeObjectURL(state.objectUrl);});
})();
