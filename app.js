(function(){'use strict';
const $=id=>document.getElementById(id);
const fields=['temperature','humidity','precip','aqi','health','vulnerability','exposure','capacity'];
/* Base environmental risk weights (sum ≈ 100). Derived from GBD/Lancet burden evidence. */
const baseWeights={air:35,heat:25,precip:12,humidity:8,healthSens:10,other:10};
const I18N={
 ar:{pageTitle:'مختبر اليرموك | مؤشر الخطورة البيئية–الصحية',langBtn:'EN',theme:'تبديل المظهر',brand:'مختبر اليرموك',brandSub:'المناخ والصحة',eyebrow:'محلي • الخصوصية أولًا • مبني على أدلة عبء المرض • تقييم متعدد الدول',title:'مؤشر الخطورة البيئية–الصحية',badge:'0–100',
formula:'المعادلة: درجة الخطر الأساسية = (جودة الهواء × 35%) + (الحرارة/الإجهاد الحراري × 25%) + (الهطول/التطرفات × 12%) + (الرطوبة كمعدل × 8%) + (حساسية المؤشر الصحي × 10%) + (مساهمة تقديرية أخرى × 10%). ثم تُطبَّق معاملات التعديل: × معامل الهشاشة (1.0–1.5) × معامل مدة التعرض (1.0–1.25، سقف 7 أيام) × معامل تخفيف القدرة (0.70–1.0). النتيجة النهائية محصورة بين 0 و100.',
termsTitle:'تعريف المصطلحات والمؤشرات',termsIntro:'يوضح الجدول معنى كل مصطلح وكيفية استخدامه في النموذج. «الدرجة 0–100» قيمة نموذج وليست تصنيفًا رسميًا بالضرورة. الأوزان الأساسية مستمدة من عبء المرض البيئي (GBD/Lancet).',
termCol:'المصطلح',definitionCol:'التعريف',unitCol:'الوحدة / المجال',ruleCol:'قاعدة التحويل / الدور',weightCol:'الوزن / الدور',
intro:'أداة تفاعلية لحساب مؤشر خطورة بيئية توضيحي (0–100) استنادًا إلى أوزان مستمدة من عبء المرض العالمي (GBD/Lancet)، مع معاملات تعديل للهشاشة والتعرض والقدرة التكيفية، وتحديد الأمراض الأكثر تأثرًا. مصممة لتتوافق مع قائمة جمع البيانات لتقييم قابلية التأثر الصحي بالمناخ (الأردن أساسًا، تونس، الجزائر، لبنان، اليمن، الإمارات). المعالجة محلية بالكامل داخل المتصفح.',
sample:'تجربة بيانات نموذجية',reset:'مسح المدخلات',print:'طباعة / PDF',privacyTitle:'الخصوصية أولًا',privacy:'لا توجد قاعدة بيانات أو حسابات أو رفع للبيانات. النتائج تُحسب محليًا في جهازك.',
dataTitle:'بيانات التقييم',dataHelp:'أدخل القيم المتاحة. المحركات البيئية تُوزن وفق عبء المرض؛ الهشاشة ومدة التعرض وقدرة النظام تُستخدم كمعاملات تعديل.',
location:'الموقع / المحافظة',date:'الفترة الزمنية',dateSep:'إلى',dateFrom:'من تاريخ',dateTo:'إلى تاريخ',
temperature:'درجة الحرارة (°C)',humidity:'الرطوبة النسبية (%)',precip:'هطول الأمطار (مم)',
temperatureLevel:'مستوى الحرارة: {level} ({score}/100)',humidityLevel:'مستوى الرطوبة: {level} ({score}/100)',precipLevel:'مستوى الهطول: {level} ({score}/100)',
aqi:'جودة الهواء AQI / PM2.5',health:'المؤشر الصحي (حالات/10,000)',vulnerability:'هشاشة السكان (%)',
vulnerabilityLevel:'مستوى الهشاشة: {level} ({score}%)',vulnPending:'مستوى الهشاشة: بانتظار الإدخال',
aqiLevel:'مستوى جودة الهواء: {level} ({score})',healthLevel:'مستوى المؤشر الصحي: {level} ({score})',
exposureLevel:'مستوى التعرض: {level} ({score}/100)',capacityLevel:'مستوى القدرة: {level} ({score}/100)',
indicatorPending:'{label}: بانتظار الإدخال',exposure:'مدة التعرض (أيام)',capacity:'قدرة النظام الصحي / الاستعداد (%)',
locPh:'مثال: إربد',tempPh:'30',humPh:'60',precipPh:'5',aqiPh:'80',healthPh:'20',vulnPh:'25',exposurePh:'1',capacityPh:'60',
calc:'احسب مؤشر الخطورة',resultTitle:'النتيجة',resultIdle:'أدخل البيانات ثم اضغط «احسب مؤشر الخطورة».',waiting:'بانتظار التقييم',resultSummary:'سيظهر هنا ملخص النتيجة والتفسير.',
general:'إرشادات عامة',generalText:'استخدم المؤشر كأداة فرز واستكشاف، وليس كتشخيص طبي أو تنبؤ مؤكد. الأوزان مستمدة من عبء المرض العالمي ويجب معايرتها محليًا.',
methodology:'كيف يُحسب المؤشر؟',methodologyHelp:'نموذج مبني على أوزان عبء المرض البيئي (GBD/Lancet) مع معاملات تعديل للهشاشة والتعرض والقدرة. قابل للمعايرة محليًا.',
heat:'الحرارة / التغير المناخي',air:'جودة الهواء (PM2.5/AQI)',healthFactor:'حساسية المؤشر الصحي',vulnerabilityFactor:'هشاشة (معامل تضخيم)',precipFactor:'الهطول / التطرفات',capacityFactor:'قدرة النظام (معامل تخفيف)',humidityFactor:'الرطوبة (معدل)',
note:'الأوزان الأساسية مستمدة من مساهمة تلوث الهواء والتغير المناخي في عبء المرض العالمي (GBD 2021 / Lancet Countdown). الهشاشة ومدة التعرض وقدرة النظام الصحي تُستخدم كمعاملات تعديل وليست أوزانًا أساسية متوازية. النموذج توضيحي ويجب معايرته ببيانات محلية قبل أي استخدام تشغيلي.',
guide:'تفسير النتيجة',low:'منخفض',moderate:'متوسط',high:'مرتفع',critical:'مرتفع جدًا',
footer:'نسخة MVP محلية — أوزان مستمدة من عبء المرض (GBD/Lancet) — متوافقة مع قائمة جمع البيانات — لا تخزن البيانات مركزيًا.',
locationUnknown:'الموقع غير محدد',composite:'مؤشر الخطورة البيئية {score} من 100 (بعد معاملات التعديل). محسوب من محركات التعرض البيئية مع تعديل للهشاشة والتعرض والقدرة التكيفية.',
warning:'المؤشر أداة تحليلية أولية مبنية على أدلة عبء المرض، وليس تشخيصًا طبيًا أو إنذارًا رسميًا.',
required:'يرجى إدخال {label}.',range:'{label} يجب أن تكون بين {min} و{max}.',
recTemp:'ارتفاع الحرارة: راجع خطط الوقاية من الإجهاد الحراري وقلّل التعرض المباشر للحرارة، خاصة للفئات الهشة.',
recAqi:'جودة الهواء مرتفعة الخطورة: راقب الإرشادات البيئية وقلّل الأنشطة الخارجية عند الحاجة.',
recVuln:'هشاشة سكانية مرتفعة: أعطِ الأولوية للفئات الحساسة (أطفال، كبار سن، حوامل، لاجئون، عمال خارجيون) عند التخطيط للاستجابة.',
recExposure:'مدة التعرض متعددة الأيام: راقب المؤشر يوميًا بدل الاعتماد على قراءة واحدة.',
recPrecip:'هطول غير معتاد: راقب مخاطر الفيضانات أو الجفاف المرتبطة بالصحة (أمراض إسهالية، نواقل).',
recCapacity:'قدرة نظام صحي محدودة: عزّز الاستعداد وخطط الطوارئ وسلاسل التوريد وأنظمة الإنذار.',
recLow:'المؤشرات المدخلة ضمن نطاق منخفض نسبيًا؛ استمر في المراقبة.',
recGeneral:'المؤشرات تستدعي مراجعة الإجراءات الوقائية والبيانات المتاحة.',
conditionsTitle:'الأمراض والحالات الأكثر تأثرًا',conditionsIntro:'حالات مرتبطة بالمحركات البيئية المدخلة وفق عتبات علمية. ليست تشخيصًا فرديًا.',
conditionsBadge:'مرتبطة بالمؤشرات',conditionsEmpty:'ستظهر الحالات ذات الصلة بعد حساب المؤشر.',
conditionHeat:'أمراض القلب والأوعية الدموية',conditionHeatDesc:'قد تؤدي الحرارة الشديدة إلى زيادة العبء على القلب وتفاقم بعض الحالات القلبية الوعائية.',
conditionDiabetes:'داء السكري',conditionDiabetesDesc:'قد تزيد الحرارة الشديدة صعوبة تنظيم السوائل والحرارة لدى بعض المصابين بالسكري.',
conditionRespiratory:'الربو وأمراض الجهاز التنفسي المزمنة',conditionRespiratoryDesc:'يمكن للحرارة وتلوث الهواء أن يزيدا الأعراض أو يفاقما بعض أمراض الجهاز التنفسي.',
conditionCOPD:'مرض الانسداد الرئوي المزمن (COPD)',conditionCOPDDesc:'ارتفاع تلوث الهواء، وخاصة الجسيمات الدقيقة، قد يزيد مخاطر تفاقم أمراض الجهاز التنفسي المزمنة.',
conditionKidney:'أمراض الكلى',conditionKidneyDesc:'الحرارة والجفاف قد يزيدان الضغط على الكلى ويرفعان مخاطر الإصابة الحادة لدى الفئات المعرضة.',
conditionHeatIllness:'الإجهاد الحراري والجفاف وضربة الشمس',conditionHeatIllnessDesc:'عند ارتفاع الحرارة ومدة التعرض قد تزداد مخاطر الإنهاك الحراري والجفاف وضربة الشمس.',
conditionAirCardio:'أمراض القلب الإقفارية والسكتة الدماغية',conditionAirCardioDesc:'تلوث الهواء، وخاصة الجسيمات الدقيقة، يرتبط بآثار قلبية ووعائية وعصبية.',
conditionDiarrheal:'الأمراض الإسهالية والمنقولة بالمياه',conditionDiarrhealDesc:'التطرفات في الهطول (فيضانات أو جفاف) قد تزيد مخاطر الأمراض الإسهالية والتهاب الكبد والكوليرا.',
conditionVector:'الأمراض المنقولة بالنواقل',conditionVectorDesc:'تغيرات الحرارة والهطول قد تؤثر على توزيع نواقل الملاريا والليشمانيا وحمى الضنك.',
conditionMental:'الصحة النفسية والتوتر',conditionMentalDesc:'الأحداث المناخية المتطرفة والتعرض المطول قد يرتبطان بزيادة القلق والاكتئاب والتوتر النفسي، خاصة لدى الفئات الهشة.',
conditionNutrition:'سوء التغذية ونقص المغذيات',conditionNutritionDesc:'التطرفات المناخية والجفاف قد تؤثر على الأمن الغذائي وتزيد مخاطر سوء التغذية لدى الأطفال والنساء.',
conditionNote:'إذا كان الشخص يعاني من حالات مزمنة أو أعراض مقلقة فليطلب استشارة طبية متخصصة. ضربة الشمس حالة طبية طارئة.',
likelihoodHigh:'احتمالية تأثر مرتفعة',likelihoodMod:'احتمالية تأثر متوسطة',likelihoodLow:'احتمالية تأثر منخفضة',
sampleLocation:'إربد',
fieldNote:'المؤشر الصحي يُستخدم للتحقق والحساسية المحلية (ليس وزنًا أساسيًا). الهشاشة تشمل الأطفال دون 5، كبار السن، الحوامل، اللاجئين/النازحين، العمال الخارجيين، ذوي الأمراض المزمنة. القدرة تشمل المستشفيات، الأسرة، القوى العاملة، أنظمة الإنذار، خطط الاستعداد.',
checklistTitle:'مرجع فئات جمع البيانات',checklistIntro:'يتوافق هذا النموذج مع قائمة جمع البيانات لتقييم قابلية التأثر الصحي بالمناخ والاستعداد للطوارئ (Phase 1). الفئات الرئيسية:',
breakdownTitle:'تفكيك المساهمات',
modVuln:'معامل الهشاشة',modExposure:'معامل مدة التعرض',modCapacity:'معامل تخفيف القدرة',
baseScoreLabel:'الدرجة الأساسية (قبل التعديل)',finalScoreLabel:'الدرجة النهائية (بعد التعديل)',
terms:[
['جودة الهواء (PM2.5/AQI)','مؤشر تلوث الهواء بالجسيمات الدقيقة والعوامل المرتبطة؛ المساهم الأكبر في عبء المرض البيئي العالمي.','AQI؛ 0 إلى 500','الدرجة = clamp(AQI/300×100)','35% أساسي'],
['درجة الحرارة / الإجهاد الحراري','درجة حرارة الهواء المحيط وشدة الحرارة؛ مسار رئيسي للتغير المناخي وتأثيره الصحي.','°C؛ −30 إلى 60','الدرجة = clamp((T−18)/22×100)','25% أساسي'],
['هطول الأمطار / التطرفات','كمية الهطول لتمثيل مخاطر الفيضان أو الجفاف المرتبطة بالصحة.','مم؛ 0 إلى 500','درجة المخاطرة = clamp(|P−50|/100×100)','12% أساسي'],
['الرطوبة النسبية','نسبة بخار الماء؛ تعدل الإحساس بالحرارة وتكاثر مسببات الأمراض.','%؛ 0 إلى 100','≤40% = 0؛ ثم (RH−40)/60×100','8% أساسي (معدل)'],
['حساسية المؤشر الصحي','معدل الحالات الصحية الحساسة للمناخ لكل 10,000؛ يُستخدم للحساسية المحلية وليس كسبب.','حالات/10,000؛ 0–1000','الدرجة = clamp(الحالات/100×100)','10% حساسية'],
['هشاشة السكان','نسبة تقديرية لقابلية التأثر (أطفال، كبار سن، حوامل، لاجئون، عمال خارجيون، أمراض مزمنة).','%؛ 0 إلى 100','معامل تضخيم = 1 + (نسبة/100)×0.5  (1.0–1.5)','معامل تضخيم'],
['مدة التعرض','عدد أيام استمرار حالة التعرض.','أيام؛ 0 إلى 30','معامل = 1 + min(أيام,7)×0.035  (سقف ≈1.25)','معامل تضخيم'],
['قدرة النظام الصحي','تقدير لقدرة المرافق والقوى العاملة وأنظمة الإنذار وخطط الاستعداد.','%؛ 0 إلى 100','معامل تخفيف = 1 − (قدرة/100)×0.3  (0.70–1.0)','معامل تخفيف'],
['المؤشر المركب','قيمة تلخص المحركات البيئية بعد الأوزان ثم معاملات التعديل.','درجة 0–100','أساسي × هشاشة × تعرض × قدرة، محصور 0–100','نهائي']
]},
 en:{pageTitle:'Yarmouk Lab | Environmental–Health Risk Index',langBtn:'AR',theme:'Toggle theme',brand:'Yarmouk Lab',brandSub:'Climate & Health',eyebrow:'LOCAL • PRIVACY-FIRST • BURDEN-OF-DISEASE BASED • MULTI-COUNTRY',title:'Environmental–Health Risk Index',badge:'0–100',
formula:'Formula: Base risk score = (air quality × 35%) + (heat / climate extremes × 25%) + (precipitation extremes × 12%) + (humidity as modifier × 8%) + (health-indicator sensitivity × 10%) + (other estimated contribution × 10%). Then modifiers are applied: × vulnerability coefficient (1.0–1.5) × exposure-duration coefficient (1.0–1.25, 7-day cap) × capacity mitigation coefficient (0.70–1.0). Final result bounded to 0–100.',
termsTitle:'Terms and indicators',termsIntro:'The table explains each term and its role in the model. The 0–100 model score is not necessarily an official classification. Base weights are informed by environmental burden-of-disease evidence (GBD/Lancet).',
termCol:'Term',definitionCol:'Definition',unitCol:'Unit / range',ruleCol:'Transformation / role',weightCol:'Weight / role',
intro:'An interactive tool that calculates an illustrative environmental risk index (0–100) based on weights informed by global burden-of-disease evidence (GBD/Lancet), with modification coefficients for vulnerability, exposure duration and adaptive capacity, and identification of the most affected conditions. Designed to align with the climate-health vulnerability data checklist (Jordan primary; Tunisia, Algeria, Lebanon, Yemen, UAE). Fully local processing in the browser.',
sample:'Try sample data',reset:'Clear inputs',print:'Print / PDF',privacyTitle:'Privacy first',privacy:'No database, accounts, or data uploads. Results are calculated locally on your device.',
dataTitle:'Assessment data',dataHelp:'Enter available values. Environmental drivers are weighted by burden-of-disease evidence; vulnerability, exposure duration and system capacity act as modification coefficients.',
location:'Location / governorate',date:'Time period',dateSep:'to',dateFrom:'From date',dateTo:'To date',
temperature:'Temperature (°C)',humidity:'Relative humidity (%)',precip:'Precipitation (mm)',
temperatureLevel:'Temperature level: {level} ({score}/100)',humidityLevel:'Humidity level: {level} ({score}/100)',precipLevel:'Precipitation level: {level} ({score}/100)',
aqi:'Air quality AQI / PM2.5',health:'Health indicator (cases/10,000)',vulnerability:'Population vulnerability (%)',
vulnerabilityLevel:'Vulnerability level: {level} ({score}%)',vulnPending:'Vulnerability level: awaiting input',
aqiLevel:'Air quality level: {level} ({score})',healthLevel:'Health indicator level: {level} ({score})',
exposureLevel:'Exposure level: {level} ({score}/100)',capacityLevel:'Capacity level: {level} ({score}/100)',
indicatorPending:'{label}: awaiting input',exposure:'Exposure duration (days)',capacity:'Health system capacity / preparedness (%)',
locPh:'Example: Irbid',tempPh:'30',humPh:'60',precipPh:'5',aqiPh:'80',healthPh:'20',vulnPh:'25',exposurePh:'1',capacityPh:'60',
calc:'Calculate risk index',resultTitle:'Result',resultIdle:'Enter the data and select “Calculate risk index”.',waiting:'Awaiting assessment',resultSummary:'The result summary and interpretation will appear here.',
general:'General guidance',generalText:'Use this index for screening and exploration, not for medical diagnosis or definitive prediction. Weights are informed by global burden-of-disease evidence and should be calibrated locally.',
methodology:'How is the index calculated?',methodologyHelp:'A model based on environmental burden-of-disease weights (GBD/Lancet) with modification coefficients for vulnerability, exposure and capacity. Can be calibrated locally.',
heat:'Heat / climate extremes',air:'Air quality (PM2.5/AQI)',healthFactor:'Health-indicator sensitivity',vulnerabilityFactor:'Vulnerability (amplification coeff.)',precipFactor:'Precipitation / extremes',capacityFactor:'System capacity (mitigation coeff.)',humidityFactor:'Humidity (modifier)',
note:'Base weights are informed by the contribution of air pollution and climate change to global disease burden (GBD 2021 / Lancet Countdown). Vulnerability, exposure duration and health-system capacity are used as modification coefficients, not parallel base weights. The model is illustrative and should be calibrated with local data before operational use.',
guide:'Result interpretation',low:'Low',moderate:'Moderate',high:'High',critical:'Very high',
footer:'Local MVP — weights informed by burden of disease (GBD/Lancet) — aligned with data collection checklist — no centralized data storage.',
locationUnknown:'Location not specified',composite:'Environmental risk index {score} / 100 (after modifiers). Calculated from environmental exposure drivers with adjustments for vulnerability, exposure duration and adaptive capacity.',
warning:'This is a preliminary analytical tool informed by burden-of-disease evidence, not a medical diagnosis or official warning.',
required:'Please enter {label}.',range:'{label} must be between {min} and {max}.',
recTemp:'High temperature: review heat-stress prevention measures and reduce direct heat exposure, especially for vulnerable groups.',
recAqi:'High-risk air quality: follow environmental guidance and reduce outdoor activity when appropriate.',
recVuln:'High population vulnerability: prioritize sensitive groups (children, older adults, pregnant women, refugees, outdoor workers) in response planning.',
recExposure:'Multi-day exposure: monitor the index daily rather than relying on a single reading.',
recPrecip:'Unusual precipitation: monitor flood or drought-related health risks (diarrheal disease, vectors).',
recCapacity:'Limited health system capacity: strengthen preparedness, emergency plans, supply chains and alert systems.',
recLow:'The entered indicators are relatively low; continue monitoring.',
recGeneral:'The indicators warrant review of preventive measures and available data.',
conditionsTitle:'Most affected conditions and diseases',conditionsIntro:'Conditions linked to the entered environmental drivers according to scientific thresholds. Not an individual diagnosis.',
conditionsBadge:'Indicator-linked',conditionsEmpty:'Relevant conditions will appear after calculating the index.',
conditionHeat:'Cardiovascular diseases',conditionHeatDesc:'Extreme heat can increase cardiovascular strain and worsen some cardiovascular conditions.',
conditionDiabetes:'Diabetes',conditionDiabetesDesc:'Extreme heat can make fluid and temperature regulation more difficult for some people with diabetes.',
conditionRespiratory:'Asthma and chronic respiratory diseases',conditionRespiratoryDesc:'Heat and air pollution can increase symptoms or worsen some respiratory conditions.',
conditionCOPD:'Chronic obstructive pulmonary disease (COPD)',conditionCOPDDesc:'High air pollution, especially fine particulate matter, can increase risks for exacerbations of chronic respiratory disease.',
conditionKidney:'Kidney diseases',conditionKidneyDesc:'Heat and dehydration can increase stress on the kidneys and the risk of acute kidney injury in vulnerable people.',
conditionHeatIllness:'Heat exhaustion, dehydration and heatstroke',conditionHeatIllnessDesc:'High heat combined with longer exposure can increase the risk of heat illness and dehydration.',
conditionAirCardio:'Ischaemic heart disease and stroke',conditionAirCardioDesc:'Air pollution, especially fine particulate matter, is associated with cardiovascular and cerebrovascular effects.',
conditionDiarrheal:'Diarrheal and water-borne diseases',conditionDiarrhealDesc:'Precipitation extremes (floods or drought) can increase risks of diarrheal disease, hepatitis and cholera.',
conditionVector:'Vector-borne diseases',conditionVectorDesc:'Temperature and precipitation changes can affect the distribution of malaria, leishmaniasis and dengue vectors.',
conditionMental:'Mental health and stress',conditionMentalDesc:'Extreme climate events and prolonged exposure may be associated with increased anxiety, depression and psychological stress, especially among vulnerable groups.',
conditionNutrition:'Malnutrition and micronutrient deficiency',conditionNutritionDesc:'Climate extremes and drought can affect food security and increase risks of undernutrition in children and women.',
conditionNote:'People with chronic conditions or concerning symptoms should seek professional medical advice. Heatstroke is a medical emergency.',
likelihoodHigh:'High likelihood of impact',likelihoodMod:'Moderate likelihood of impact',likelihoodLow:'Lower likelihood of impact',
sampleLocation:'Irbid',
fieldNote:'The health indicator is used for local sensitivity and validation (not a primary causal weight). Vulnerability includes children under 5, older adults, pregnant women, refugees/IDPs, outdoor workers and people with chronic conditions. Capacity covers hospitals, beds, workforce, alert systems and preparedness plans.',
checklistTitle:'Data collection checklist reference',checklistIntro:'This model aligns with the Climate-Related Health Vulnerability & Emergency Preparedness Assessment data collection checklist (Phase 1). Main categories:',
breakdownTitle:'Contribution breakdown',
modVuln:'Vulnerability coefficient',modExposure:'Exposure-duration coefficient',modCapacity:'Capacity mitigation coefficient',
baseScoreLabel:'Base score (before modifiers)',finalScoreLabel:'Final score (after modifiers)',
terms:[
['Air quality (PM2.5/AQI)','Air pollution indicator for fine particulate matter and related factors; largest contributor to global environmental disease burden.','AQI; 0 to 500','score = clamp(AQI/300×100)','35% base'],
['Temperature / heat stress','Ambient air temperature and heat intensity; a main pathway of climate-change health impact.','°C; −30 to 60','score = clamp((T−18)/22×100)','25% base'],
['Precipitation / extremes','Rainfall amount used to represent flood or drought health risks.','mm; 0 to 500','risk score = clamp(|P−50|/100×100)','12% base'],
['Relative humidity','Water-vapour ratio; modifies heat sensation and pathogen proliferation.','%; 0 to 100','≤40% = 0; then (RH−40)/60×100','8% base (modifier)'],
['Health-indicator sensitivity','Rate of climate-sensitive health cases per 10,000; used for local sensitivity, not as a primary cause.','cases/10,000; 0–1,000','score = clamp(cases/100×100)','10% sensitivity'],
['Population vulnerability','Estimated susceptibility share (children, older adults, pregnant women, refugees, outdoor workers, chronic conditions).','%; 0 to 100','amplification coeff. = 1 + (share/100)×0.5  (1.0–1.5)','amplification coeff.'],
['Exposure duration','Number of days the exposure condition persists.','days; 0 to 30','coeff. = 1 + min(days,7)×0.035  (cap ≈1.25)','amplification coeff.'],
['Health system capacity','Estimate of facility, workforce, alert systems and preparedness capacity.','%; 0 to 100','mitigation coeff. = 1 − (capacity/100)×0.3  (0.70–1.0)','mitigation coeff.'],
['Composite index','Value summarising environmental drivers after weights and then modification coefficients.','0–100 score','base × vulnerability × exposure × capacity, bounded 0–100','final']
]}
};
let currentLang='ar';
const t=k=>I18N[currentLang][k]??k;
const interpolate=(s,vars)=>s.replace(/\{(\w+)\}/g,(_,k)=>vars[k]??'');
const clamp=v=>Math.max(0,Math.min(100,Number(v)||0));
function num(id){return Number($(id).value)}
function normalizeTemperature(t){return clamp((t-18)/22*100)}
function normalizeHumidity(h){return clamp(h<=40?0:(h-40)/60*100)}
function normalizePrecip(p){return clamp(Math.abs(p-50)/100*100)}
function normalizeAQI(a){return clamp(a/300*100)}
function normalizeHealth(h){return clamp(h/100*100)}
function normalizeVulnerability(v){return clamp(v)}
function normalizeExposure(v){return clamp(Math.min(Number(v),7)/7*100)}
function normalizeCapacity(c){return clamp(c)}
/* Modification coefficients */
function vulnCoeff(v){return 1+Math.min(Math.max(Number(v)||0,0),100)/100*0.5} /* 1.0 – 1.5 */
function exposureCoeff(d){return 1+Math.min(Math.max(Number(d)||0,0),7)*0.035} /* 1.0 – 1.245 */
function capacityCoeff(c){return 1-(Math.min(Math.max(Number(c)||0,0),100)/100)*0.3} /* 1.0 – 0.70 */
function classify(score){
 score=Number(score);
 if(!Number.isFinite(score))return ['low','low'];
 if(score<30)return ['low','low'];
 if(score<60)return ['moderate','moderate'];
 if(score<80)return ['high','high'];
 return ['critical','critical']
}
function calculate(v){
 const factors={
  air:normalizeAQI(v.aqi),
  heat:normalizeTemperature(v.temperature),
  precip:normalizePrecip(v.precip),
  humidity:normalizeHumidity(v.humidity),
  healthSens:normalizeHealth(v.health)
 };
 /* other residual contribution held constant at mid for transparency */
 const other=40;
 let base=
  factors.air*baseWeights.air/100 +
  factors.heat*baseWeights.heat/100 +
  factors.precip*baseWeights.precip/100 +
  factors.humidity*baseWeights.humidity/100 +
  factors.healthSens*baseWeights.healthSens/100 +
  other*baseWeights.other/100;
 const vc=vulnCoeff(v.vulnerability);
 const ec=exposureCoeff(v.exposure);
 const cc=capacityCoeff(v.capacity);
 const adjusted=base*vc*ec*cc;
 return {
  score:clamp(adjusted),
  base:clamp(base),
  factors,
  modifiers:{vulnerability:vc,exposure:ec,capacity:cc},
  other
 }
}
function validate(){
 const errors=[];
 const ranges={
  temperature:[-30,60,'temperature'],
  humidity:[0,100,'humidity'],
  precip:[0,500,'precip'],
  aqi:[0,500,'aqi'],
  health:[0,1000,'health'],
  vulnerability:[0,100,'vulnerability'],
  exposure:[0,30,'exposure'],
  capacity:[0,100,'capacity']
 };
 for(const [id,[min,max,key]] of Object.entries(ranges)){
  const raw=$(id).value.trim();
  const label=t(key);
  if(raw===''){errors.push(interpolate(t('required'),{label}));continue}
  const n=Number(raw);
  if(!Number.isFinite(n)||n<min||n>max)errors.push(interpolate(t('range'),{label,min,max}))
 }
 const df=$('dateFrom').value,dt=$('dateTo').value;
 if(df&&dt&&df>dt)errors.push(currentLang==='ar'?'تاريخ البداية يجب أن يسبق تاريخ النهاية.':'Start date must be before end date.');
 return errors
}
function recommendations(score,v){
 const out=[];
 if(v.temperature>=35)out.push(t('recTemp'));
 if(v.aqi>=150)out.push(t('recAqi'));
 if(v.vulnerability>=40)out.push(t('recVuln'));
 if(v.exposure>=3)out.push(t('recExposure'));
 if(v.precip>80||v.precip<5)out.push(t('recPrecip'));
 if(v.capacity<50)out.push(t('recCapacity'));
 if(!out.length)out.push(score<30?t('recLow'):t('recGeneral'));
 return out
}
function relatedConditions(r,v){
 const list=[];
 const heatHigh=v.temperature>=35||r.factors.heat>=75;
 const airHigh=v.aqi>=150||r.factors.air>=50;
 const humidHeat=heatHigh&&v.humidity>=60;
 const prolonged=v.exposure>=3;
 const precipExtreme=v.precip>80||v.precip<5;
 const highVuln=v.vulnerability>=40;
 const lowCap=v.capacity<50;
 if(heatHigh||humidHeat){
  list.push({key:'conditionHeatIllness',desc:'conditionHeatIllnessDesc',cls:'heat',lik:'likelihoodHigh'});
  list.push({key:'conditionHeat',desc:'conditionHeatDesc',cls:'heat',lik:heatHigh?'likelihoodHigh':'likelihoodMod'});
  list.push({key:'conditionKidney',desc:'conditionKidneyDesc',cls:'heat',lik:'likelihoodMod'});
  list.push({key:'conditionDiabetes',desc:'conditionDiabetesDesc',cls:'heat',lik:'likelihoodMod'});
 }
 if(airHigh){
  list.push({key:'conditionRespiratory',desc:'conditionRespiratoryDesc',cls:'air',lik:'likelihoodHigh'});
  list.push({key:'conditionCOPD',desc:'conditionCOPDDesc',cls:'air',lik:'likelihoodHigh'});
  list.push({key:'conditionAirCardio',desc:'conditionAirCardioDesc',cls:'air',lik:'likelihoodMod'});
 }
 if(precipExtreme){
  list.push({key:'conditionDiarrheal',desc:'conditionDiarrhealDesc',cls:'precip',lik:'likelihoodHigh'});
  list.push({key:'conditionVector',desc:'conditionVectorDesc',cls:'precip',lik:'likelihoodMod'});
 }
 if(highVuln||lowCap||prolonged){
  list.push({key:'conditionMental',desc:'conditionMentalDesc',cls:'heat',lik:highVuln?'likelihoodMod':'likelihoodLow'});
  list.push({key:'conditionNutrition',desc:'conditionNutritionDesc',cls:'precip',lik:precipExtreme?'likelihoodMod':'likelihoodLow'});
 }
 /* de-dup by key and limit */
 const seen=new Set();
 return list.filter(x=>{if(seen.has(x.key))return false;seen.add(x.key);return true}).slice(0,7)
}
function renderConditions(r,v){
 const list=relatedConditions(r,v);
 const el=$('conditionsList');
 if(!list.length){el.innerHTML='<p class="conditions-empty">'+t('conditionsEmpty')+'</p>';return}
 el.innerHTML=list.map(item=>'<div class="condition-item '+item.cls+'"><strong>'+t(item.key)+'</strong><p>'+t(item.desc)+'</p><div class="likelihood">'+t(item.lik)+'</div></div>').join('')+'<p class="condition-note">'+t('conditionNote')+'</p>'
}
function levelLabel(cls){return t(cls)}
function renderIndicatorLevel(id,score,levelKey){
 const el=$(id);
 if(!el)return;
 const [cls]=classify(score);
 el.textContent=interpolate(t(levelKey),{level:levelLabel(cls),score:Math.round(score)});
 el.className='field-level '+cls
}
function renderIndicatorTable(){
 const body=$('indicatorTableBody');
 if(!body)return;
 const terms=I18N[currentLang].terms||[];
 body.innerHTML=terms.map(row=>'<tr>'+row.map(c=>'<td>'+c+'</td>').join('')+'</tr>').join('')
}
function renderInputLevels(){
 const tVal=num('temperature'),hVal=num('humidity'),pVal=num('precip'),aVal=num('aqi'),heVal=num('health'),eVal=num('exposure'),cVal=num('capacity');
 if($('temperature').value!=='')renderIndicatorLevel('temperatureLevel',normalizeTemperature(tVal),'temperatureLevel');
 else if($('temperatureLevel')){$('temperatureLevel').textContent=interpolate(t('indicatorPending'),{label:t('temperature')});$('temperatureLevel').className='field-level neutral'}
 if($('humidity').value!=='')renderIndicatorLevel('humidityLevel',normalizeHumidity(hVal),'humidityLevel');
 else if($('humidityLevel')){$('humidityLevel').textContent=interpolate(t('indicatorPending'),{label:t('humidity')});$('humidityLevel').className='field-level neutral'}
 if($('precip').value!=='')renderIndicatorLevel('precipLevel',normalizePrecip(pVal),'precipLevel');
 else if($('precipLevel')){$('precipLevel').textContent=interpolate(t('indicatorPending'),{label:t('precip')});$('precipLevel').className='field-level neutral'}
 if($('aqi').value!=='')renderIndicatorLevel('aqiLevel',normalizeAQI(aVal),'aqiLevel');
 else if($('aqiLevel')){$('aqiLevel').textContent=interpolate(t('indicatorPending'),{label:t('air')});$('aqiLevel').className='field-level neutral'}
 if($('health').value!=='')renderIndicatorLevel('healthLevel',normalizeHealth(heVal),'healthLevel');
 else if($('healthLevel')){$('healthLevel').textContent=interpolate(t('indicatorPending'),{label:t('healthFactor')});$('healthLevel').className='field-level neutral'}
 if($('exposure').value!=='')renderIndicatorLevel('exposureLevel',normalizeExposure(eVal),'exposureLevel');
 else if($('exposureLevel')){$('exposureLevel').textContent=interpolate(t('indicatorPending'),{label:t('exposure')});$('exposureLevel').className='field-level neutral'}
 if($('capacity').value!=='')renderIndicatorLevel('capacityLevel',normalizeCapacity(cVal),'capacityLevel');
 else if($('capacityLevel')){$('capacityLevel').textContent=interpolate(t('indicatorPending'),{label:t('capacity')});$('capacityLevel').className='field-level neutral'}
}
function renderVulnerability(){
 const raw=$('vulnerability').value.trim();
 const el=$('vulnerabilityLevel');
 if(!el)return;
 if(raw===''){el.textContent=t('vulnPending');el.className='field-level neutral';return}
 const score=clamp(Number(raw));
 const [cls]=classify(score);
 el.textContent=interpolate(t('vulnerabilityLevel'),{level:levelLabel(cls),score:Math.round(score)});
 el.className='field-level '+cls
}
function render(r,v){
 const score=Math.round(r.score);
 const [cls,label]=classify(score);
 $('score').textContent=score;
 $('level').textContent=levelLabel(label);
 $('level').className='level '+cls;
 const ring=$('scoreRing');
 ring.style.setProperty('--score-deg',(score/100*360)+'deg');
 ring.className='score-ring risk-'+cls;
 const panel=$('resultPanel');
 panel.className='panel result risk-'+cls;
 const loc=$('location').value.trim()||t('locationUnknown');
 const df=$('dateFrom').value,dt=$('dateTo').value;
 let period='';
 if(df||dt)period=' | '+(df||'?')+' – '+(dt||'?');
 $('summary').textContent=interpolate(t('composite'),{score})+' — '+loc+period+'. '+t('warning');
 $('resultSubtitle').textContent=t('resultIdle');
 /* Breakdown */
 const bd=$('breakdown');
 if(bd)bd.hidden=false;
 const factorKeys=[
  ['air',r.factors.air,t('air'),baseWeights.air],
  ['heat',r.factors.heat,t('heat'),baseWeights.heat],
  ['precip',r.factors.precip,t('precipFactor'),baseWeights.precip],
  ['humidity',r.factors.humidity,t('humidityFactor'),baseWeights.humidity],
  ['healthSens',r.factors.healthSens,t('healthFactor'),baseWeights.healthSens]
 ];
 $('factors').innerHTML=factorKeys.map(([k,s,lab,w])=>'<div class="factor"><span>'+lab+' ('+w+'%)</span><strong>'+Math.round(s)+'</strong></div>').join('')+
  '<div class="factor"><span>'+t('baseScoreLabel')+'</span><strong>'+Math.round(r.base)+'</strong></div>';
 const mods=r.modifiers;
 $('modifiers').innerHTML=
  '<span class="modifier-chip">'+t('modVuln')+': <strong>×'+mods.vulnerability.toFixed(2)+'</strong></span>'+
  '<span class="modifier-chip">'+t('modExposure')+': <strong>×'+mods.exposure.toFixed(2)+'</strong></span>'+
  '<span class="modifier-chip">'+t('modCapacity')+': <strong>×'+mods.capacity.toFixed(2)+'</strong></span>'+
  '<span class="modifier-chip">'+t('finalScoreLabel')+': <strong>'+score+'</strong></span>';
 const recs=recommendations(score,v);
 $('recommendations').innerHTML='<h3 id="generalTitle">'+t('general')+'</h3><ul>'+recs.map(x=>'<li>'+x+'</li>').join('')+'</ul>';
 renderConditions(r,v);
 renderVulnerability()
}
function calculateUI(){
 const errors=validate();
 const errEl=$('errors');
 if(errors.length){errEl.innerHTML=errors.map(e=>'<div>'+e+'</div>').join('');errEl.focus();return}
 errEl.textContent='';
 const v={
  temperature:num('temperature'),
  humidity:num('humidity'),
  precip:num('precip'),
  aqi:num('aqi'),
  health:num('health'),
  vulnerability:num('vulnerability'),
  exposure:num('exposure'),
  capacity:num('capacity')
 };
 const r=calculate(v);
 render(r,v)
}
function sample(){
 const today=new Date();
 const from=new Date(today);from.setDate(from.getDate()-6);
 const data={
  location:t('sampleLocation'),
  dateFrom:from.toISOString().slice(0,10),
  dateTo:today.toISOString().slice(0,10),
  temperature:36,humidity:68,precip:12,aqi:145,health:42,vulnerability:38,exposure:3,capacity:55
 };
 Object.entries(data).forEach(([k,v])=>{if($(k))$(k).value=v});
 calculateUI()
}
function reset(){
 fields.concat(['location','dateFrom','dateTo']).forEach(id=>{if($(id))$(id).value=''});
 $('errors').textContent='';
 $('score').textContent='—';
 $('level').textContent=t('waiting');
 $('level').className='level neutral';
 $('summary').textContent=t('resultSummary');
 $('resultSubtitle').textContent=t('resultIdle');
 $('factors').innerHTML='';
 if($('modifiers'))$('modifiers').innerHTML='';
 if($('breakdown'))$('breakdown').hidden=true;
 $('conditionsList').innerHTML='<p class="conditions-empty">'+t('conditionsEmpty')+'</p>';
 $('recommendations').innerHTML='<h3 id="generalTitle">'+t('general')+'</h3><p id="generalText">'+t('generalText')+'</p>';
 const panel=$('resultPanel');if(panel)panel.className='panel result';
 const ring=$('scoreRing');if(ring){ring.className='score-ring';ring.style.removeProperty('--score-deg')}
 ['temperatureLevel','humidityLevel','precipLevel','aqiLevel','healthLevel','exposureLevel','capacityLevel'].forEach(id=>{
  if($(id)){$(id).className='field-level neutral'}
 });
 renderInputLevels();
 if($('vulnerabilityLevel')){$('vulnerabilityLevel').textContent=t('vulnPending');$('vulnerabilityLevel').className='field-level neutral'}
}
function applyLanguage(){
 document.documentElement.lang=currentLang;
 document.documentElement.dir=currentLang==='ar'?'rtl':'ltr';
 document.title=t('pageTitle');
 const map={
  brand:'brand',brandSub:'brandSub',eyebrow:'eyebrow',heroTitle:'title',heroIntro:'intro',
  sampleBtn:'sample',resetBtn:'reset',printBtn:'print',privacyTitle:'privacyTitle',privacyText:'privacy',
  dataTitle:'dataTitle',dataHelp:'dataHelp',badge:'badge',locationLabel:'location',dateLabel:'date',dateSep:'dateSep',
  temperatureLabel:'temperature',humidityLabel:'humidity',precipLabel:'precip',aqiLabel:'aqi',healthLabel:'health',
  vulnerabilityLabel:'vulnerability',exposureLabel:'exposure',capacityLabel:'capacity',
  calcBtn:'calc',resultTitle:'resultTitle',resultSubtitle:'resultIdle',level:'waiting',summary:'resultSummary',
  generalTitle:'general',generalText:'generalText',methodologyTitle:'methodology',methodologyHelp:'methodologyHelp',
  heatWeight:'heat',humidityWeight:'humidityFactor',precipWeight:'precipFactor',airWeight:'air',
  healthWeight:'healthFactor',vulnerabilityWeight:'vulnerabilityFactor',capacityWeight:'capacityFactor',
  methodNote:'note',termsTitle:'termsTitle',termsIntro:'termsIntro',termCol:'termCol',definitionCol:'definitionCol',
  unitCol:'unitCol',ruleCol:'ruleCol',weightCol:'weightCol',guideTitle:'guide',lowLabel:'low',moderateLabel:'moderate',
  highLabel:'high',criticalLabel:'critical',footerText:'footer',conditionsTitle:'conditionsTitle',
  conditionsIntro:'conditionsIntro',conditionsBadge:'conditionsBadge',conditionsEmpty:'conditionsEmpty',
  fieldNote:'fieldNote',checklistTitle:'checklistTitle',checklistIntro:'checklistIntro',breakdownTitle:'breakdownTitle'
 };
 Object.entries(map).forEach(([id,key])=>{const el=$(id);if(el){if(el.tagName==='INPUT'||el.tagName==='BUTTON'){}else el.textContent=t(key)}});
 if($('formulaBox'))$('formulaBox').innerHTML='<strong>'+(currentLang==='ar'?'المعادلة:':'Formula:')+'</strong> '+t('formula').replace(/^المعادلة:\s*|^Formula:\s*/,'');
 $('langBtn').textContent=t('langBtn');
 $('location').placeholder=t('locPh');
 $('temperature').placeholder=t('tempPh');
 $('humidity').placeholder=t('humPh');
 if($('precip'))$('precip').placeholder=t('precipPh');
 $('aqi').placeholder=t('aqiPh');
 $('health').placeholder=t('healthPh');
 $('vulnerability').placeholder=t('vulnPh');
 $('exposure').placeholder=t('exposurePh');
 if($('capacity'))$('capacity').placeholder=t('capacityPh');
 renderIndicatorTable();
 renderInputLevels();
 renderVulnerability();
 if($('score').textContent==='—'||$('score').textContent===''){
  $('level').textContent=t('waiting');
  $('summary').textContent=t('resultSummary');
  $('resultSubtitle').textContent=t('resultIdle');
  $('conditionsList').innerHTML='<p class="conditions-empty">'+t('conditionsEmpty')+'</p>';
  if($('breakdown'))$('breakdown').hidden=true;
 }
}
function init(){
 applyLanguage();
 $('langBtn').addEventListener('click',()=>{currentLang=currentLang==='ar'?'en':'ar';applyLanguage()});
 $('themeBtn').addEventListener('click',()=>document.body.classList.toggle('dark'));
 $('calcBtn').addEventListener('click',calculateUI);
 $('sampleBtn').addEventListener('click',sample);
 $('resetBtn').addEventListener('click',reset);
 $('printBtn').addEventListener('click',()=>window.print());
 fields.forEach(id=>{const el=$(id);if(el){el.addEventListener('input',()=>{renderInputLevels();if(id==='vulnerability')renderVulnerability()})}});
 if($('vulnerability'))$('vulnerability').addEventListener('input',renderVulnerability);
 renderIndicatorTable()
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
