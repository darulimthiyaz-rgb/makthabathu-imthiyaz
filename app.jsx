import { useState, useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────────────────────────
// SEED DATA
// ─────────────────────────────────────────────────────────────
const INIT_CATS = [
  { id:1,  name:"التاريخ الإسلامي",  code:"h",  color:"#c8922a" },
  { id:2,  name:"الفقه وأحكامه",     code:"f",  color:"#0d9465" },
  { id:3,  name:"التفسير والقرآن",   code:"q",  color:"#7c3aed" },
  { id:4,  name:"الحديث والسنة",     code:"s",  color:"#dc2626" },
  { id:5,  name:"العقيدة",           code:"a",  color:"#2563eb" },
  { id:6,  name:"السيرة النبوية",    code:"n",  color:"#ea580c" },
  { id:7,  name:"أصول الفقه",        code:"us", color:"#0891b2" },
  { id:8,  name:"البلاغة",           code:"b",  color:"#be185d" },
  { id:9,  name:"النحو",             code:"nw", color:"#059669" },
  { id:10, name:"علوم القرآن",       code:"uq", color:"#d97706" },
];
const INIT_BOOKS = [
  // ── Usool al-Fiqh ──
  { id:9,  titleAr:"البدور اللوامع في شرح جمع الجوامع",          titleEn:"Al-Budoor al-Lami' fi Sharh Jam' al-Jawami'",  authorAr:"امام ابن المواهب الحسن بن مسعود اليوسي",          authorEn:"Imam al-Yoosi",               publisher:"",                    volumes:1,  categoryId:7, status:"available",   serial:"us-1", cover:null, pdf:null, descAr:"شرح نفيس على متن جمع الجوامع في أصول الفقه",  descEn:"A detailed commentary on Jam' al-Jawami' in usool al-fiqh.", reviews:[], borrowedBy:null },
  { id:10, titleAr:"البدور الطوالع بتسهيل البروق اللوامع",        titleEn:"Al-Budoor al-Tawali' bi Tasheel al-Burooq",    authorAr:"سهل بن سعد علي شامل العرفاني الكامل الثقافي",     authorEn:"Sahl ibn Sa'd al-'Irfani",    publisher:"",                    volumes:1,  categoryId:7, status:"available",   serial:"us-2", cover:null, pdf:null, descAr:"تسهيل في علم أصول الفقه",                    descEn:"A simplified work in the science of usool al-fiqh.",       reviews:[], borrowedBy:null },
  { id:11, titleAr:"منع الموانع عن جمع الجوامع",                  titleEn:"Man' al-Mawani' 'an Jam' al-Jawami'",          authorAr:"تاج الدين السبكي",                                 authorEn:"Taj al-Din al-Subki",         publisher:"",                    volumes:1,  categoryId:7, status:"available",   serial:"us-3", cover:null, pdf:null, descAr:"مناقشة الاعتراضات الواردة على جمع الجوامع",   descEn:"Refutation of objections raised against Jam' al-Jawami'.", reviews:[], borrowedBy:null },
  { id:12, titleAr:"المستصفى من علم الاصول",                      titleEn:"Al-Mustasfa min 'Ilm al-Usool",                authorAr:"امام الغزالي",                                     authorEn:"Imam al-Ghazali",             publisher:"",                    volumes:2,  categoryId:7, status:"available",   serial:"us-4", cover:null, pdf:null, descAr:"من أمهات كتب أصول الفقه للإمام الغزالي",     descEn:"One of Imam al-Ghazali's masterworks in Islamic legal theory.", reviews:[], borrowedBy:null },
  { id:13, titleAr:"حاشية العطار على شرح جمع الجوامع",            titleEn:"Hashiyat al-'Attar 'ala Sharh Jam' al-Jawami'", authorAr:"الشيخ حسن العطار",                                authorEn:"Shaykh Hasan al-'Attar",      publisher:"",                    volumes:2,  categoryId:7, status:"available",   serial:"us-5", cover:null, pdf:null, descAr:"حاشية علمية متميزة على شرح جمع الجوامع",      descEn:"A distinguished scholarly gloss on Jam' al-Jawami'.",      reviews:[], borrowedBy:null },
  { id:14, titleAr:"الاضواء السواطع في تقريب جمع الجوامع",        titleEn:"Al-Adwa' al-Sawati' fi Taqrib Jam' al-Jawami'", authorAr:"ابن محمد القادري الويلتوري",                       authorEn:"Ibn Muhammad al-Wilitouri",   publisher:"",                    volumes:1,  categoryId:7, status:"available",   serial:"us-6", cover:null, pdf:null, descAr:"تقريب وتيسير لمتن جمع الجوامع",               descEn:"A simplified approach to Jam' al-Jawami'.",                reviews:[], borrowedBy:null },
  { id:15, titleAr:"شرح الورقات في علم اصول الفقه",               titleEn:"Sharh al-Waraqat fi 'Ilm Usool al-Fiqh",       authorAr:"جلال الدين محمد بن احمد المحلي الشافعي",           authorEn:"Jalal al-Din al-Mahalli",     publisher:"",                    volumes:1,  categoryId:7, status:"available",   serial:"us-7", cover:null, pdf:null, descAr:"شرح مختصر الورقات للإمام الجويني",             descEn:"Commentary on al-Juwayni's al-Waraqat, a primer in usool.", reviews:[], borrowedBy:null },
  { id:16, titleAr:"القواعد الاساسية في اصول الفقه",              titleEn:"Al-Qawa'id al-Asasiyya fi Usool al-Fiqh",      authorAr:"السيد محمد بن علوي المالكي حسني",                  authorEn:"Sayyid Muhammad al-Maliki",   publisher:"",                    volumes:1,  categoryId:7, status:"available",   serial:"us-8", cover:null, pdf:null, descAr:"قواعد أساسية محررة في أصول الفقه",             descEn:"Core principles of Islamic legal theory by al-Maliki.",    reviews:[], borrowedBy:null },
  // ── Seerah / Mawlid / Shama'il ──
  { id:17, titleAr:"شرح على المواهب اللدنية بالمنح المحمدية للعلامة العسقلاني", titleEn:"Sharh al-Mawahib al-Ladunniyya",          authorAr:"العلامة الزرقاني",                                 authorEn:"Al-Zarqani",                  publisher:"", volumes:1, categoryId:6, status:"available", serial:"sn-1",  cover:null, pdf:null, descAr:"شرح موسوعي على المواهب اللدنية في السيرة النبوية", descEn:"An encyclopaedic commentary on al-Mawahib al-Ladunniyya.", reviews:[], borrowedBy:null },
  { id:18, titleAr:"نسيم الرياض في شرح شفاء القاضي عياض",                       titleEn:"Naseem al-Riyad fi Sharh Shifa al-Qadi 'Iyad", authorAr:"شهاب الدين احمد بن محمد الخفاجي المصري",          authorEn:"Shihab al-Din al-Khafaji",    publisher:"", volumes:1, categoryId:6, status:"available", serial:"sn-2",  cover:null, pdf:null, descAr:"شرح على كتاب الشفاء بتعريف حقوق المصطفى",        descEn:"Commentary on al-Qadi 'Iyad's al-Shifa.", reviews:[], borrowedBy:null },
  { id:19, titleAr:"سعادة الدارين في الصلاة على سيد الكونين",                    titleEn:"Sa'adat al-Darayn fi al-Salat 'ala Sayyid al-Kawnayn", authorAr:"يوسف بن اسماعيل النبهاني",              authorEn:"Yusuf al-Nabhani",            publisher:"", volumes:1, categoryId:6, status:"available", serial:"sn-3",  cover:null, pdf:null, descAr:"جامع في الصلاة والسلام على النبي ﷺ",              descEn:"A comprehensive work on salutations upon the Prophet ﷺ.", reviews:[], borrowedBy:null },
  { id:20, titleAr:"القصائد الوترية في مدح خير البرية",                          titleEn:"Al-Qasa'id al-Witriyya fi Madh Khayr al-Bariyya", authorAr:"ابو عبد الله محمد بن محمد بن ابي بكر الوتري",   authorEn:"Abu 'Abdillah al-Witri",      publisher:"", volumes:1, categoryId:6, status:"available", serial:"sn-4",  cover:null, pdf:null, descAr:"قصائد في مدح النبي ﷺ",                           descEn:"Odes in praise of the Prophet ﷺ.", reviews:[], borrowedBy:null },
  { id:21, titleAr:"فتح الصمد العالم على مولد الشيخ احمد بن القاسم",             titleEn:"Fath al-Samad al-'Alim 'ala Mawlid al-Shaykh Ahmad", authorAr:"",                                   authorEn:"",                            publisher:"", volumes:1, categoryId:6, status:"available", serial:"sn-5",  cover:null, pdf:null, descAr:"شرح على مولد الشيخ احمد بن القاسم",              descEn:"Commentary on the Mawlid of Shaykh Ahmad ibn al-Qasim.", reviews:[], borrowedBy:null },
  { id:22, titleAr:"القول المنجي على مولد البرنجي",                               titleEn:"Al-Qawl al-Munji 'ala Mawlid al-Barnaji",      authorAr:"امام الشيخ محمد بن احمد عليش المالكي",           authorEn:"Shaykh Muhammad 'Illaysh al-Maliki", publisher:"", volumes:1, categoryId:6, status:"available", serial:"sn-6",  cover:null, pdf:null, descAr:"شرح على مولد البرنجي في السيرة النبوية",          descEn:"Commentary on the Mawlid al-Barnaji.", reviews:[], borrowedBy:null },
  { id:23, titleAr:"مدارج السعود الى اكتساء البرود على المولد النبوية",           titleEn:"Madarij al-Su'ud ila Iktisa' al-Burud",        authorAr:"امام الشيخ محمد نووي البنتني",                     authorEn:"Imam Muhammad Nawawi al-Bantani", publisher:"", volumes:1, categoryId:6, status:"available", serial:"sn-7",  cover:null, pdf:null, descAr:"شرح على المولد النبوي الشريف",                   descEn:"Commentary on the noble Prophetic Mawlid.", reviews:[], borrowedBy:null },
  { id:24, titleAr:"حاشية الباجوري على متن البردة",                               titleEn:"Hashiyat al-Bajuri 'ala Matn al-Burda",        authorAr:"شيخ الاسلام الشيخ ابراهيم الباجوري",              authorEn:"Shaykh Ibrahim al-Bajuri",    publisher:"", volumes:1, categoryId:6, status:"available", serial:"sn-8",  cover:null, pdf:null, descAr:"حاشية شهيرة على قصيدة البردة للبوصيري",          descEn:"The celebrated gloss on Imam al-Busiri's Burda.", reviews:[], borrowedBy:null },
  { id:25, titleAr:"بلوغ المرام لبيان الفاظ مولد سيد الانام",                    titleEn:"Bulugh al-Maram li-Bayan Alfaz Mawlid Sayyid al-Anam", authorAr:"امام الهمام السيد ابو الفوز المرزومي",       authorEn:"Sayyid Abu al-Fawz al-Marzumi", publisher:"", volumes:1, categoryId:6, status:"available", serial:"sn-9",  cover:null, pdf:null, descAr:"شرح ألفاظ مولد سيد الأنام",                      descEn:"Explanation of the wording of Mawlid Sayyid al-Anam.", reviews:[], borrowedBy:null },
  { id:26, titleAr:"ابتغاء الوصول لحب الله بمدح الرسول",                         titleEn:"Ibtigha' al-Wusul li-Hub Allah bi-Madh al-Rasul", authorAr:"ابو محمد الويلتوري",                          authorEn:"Abu Muhammad al-Wilitouri",   publisher:"", volumes:1, categoryId:6, status:"available", serial:"sn-11", cover:null, pdf:null, descAr:"في مدح الرسول ﷺ وسيلةً لحب الله",               descEn:"Praising the Prophet ﷺ as a means of attaining love of Allah.", reviews:[], borrowedBy:null },
  { id:27, titleAr:"كشف الغمة بدعاء القران والسنة وبالصلاة على سيد الامة",        titleEn:"Kashf al-Ghumma bi-Du'a' al-Quran wal-Sunna",  authorAr:"",                                                authorEn:"",                            publisher:"", volumes:1, categoryId:6, status:"available", serial:"sn-12", cover:null, pdf:null, descAr:"في الدعاء والصلاة على النبي ﷺ بأسلوب قرآني سني", descEn:"On supplication and salutations upon the Prophet ﷺ.", reviews:[], borrowedBy:null },
  { id:28, titleAr:"تضمين الفوائد في تحقيق الموالد والاوراد والقصائد",            titleEn:"Tadmin al-Fawa'id fi Tahqiq al-Mawalid wal-Awrad", authorAr:"عبد الغفور الثقافي الكاو نوري",              authorEn:"'Abd al-Ghafur al-Thaqafi",   publisher:"", volumes:1, categoryId:6, status:"available", serial:"sn-13", cover:null, pdf:null, descAr:"تحقيق في الموالد والأوراد والقصائد النبوية",       descEn:"Verification of Mawlids, litanies, and Prophetic odes.", reviews:[], borrowedBy:null },
  { id:29, titleAr:"الامن والعلى لناعتي المصطفى بدافع البلاء",                    titleEn:"Al-Amn wal-'Ula li-Na'iti al-Mustafa",         authorAr:"امام احمد رضا القادري الحنفي",                     authorEn:"Imam Ahmad Rida al-Qadiri",   publisher:"", volumes:1, categoryId:6, status:"available", serial:"sn-14", cover:null, pdf:null, descAr:"في مدح المصطفى ﷺ ودفع البلاء",                   descEn:"On praising al-Mustafa ﷺ as protection from calamity.", reviews:[], borrowedBy:null },
  { id:30, titleAr:"تجلي اليقين بان نبينا سيد المرسلين",                          titleEn:"Tajalli al-Yaqin bi-anna Nabiyyina Sayyid al-Mursalin", authorAr:"امام احمد رضا القادري الحنفي",            authorEn:"Imam Ahmad Rida al-Qadiri",   publisher:"", volumes:1, categoryId:6, status:"available", serial:"sn-15", cover:null, pdf:null, descAr:"إثبات سيادة النبي ﷺ على جميع المرسلين",           descEn:"Establishing the supremacy of our Prophet ﷺ over all messengers.", reviews:[], borrowedBy:null },
  { id:31, titleAr:"حزى الله عدوه بإبائه ختم النبوة",                             titleEn:"Haza Allah 'Aduwwahu bi-Iba'ih Khatm al-Nubuwwa", authorAr:"امام احمد رضا القادري الحنفي",               authorEn:"Imam Ahmad Rida al-Qadiri",   publisher:"", volumes:1, categoryId:6, status:"available", serial:"sn-17", cover:null, pdf:null, descAr:"في ختم النبوة ورد الشبهات عنها",                  descEn:"On the finality of prophethood and refuting doubts.", reviews:[], borrowedBy:null },
  { id:32, titleAr:"انارة الدجى في مغازي خير الورى صلى الله عليه وسلم",          titleEn:"Inarat al-Duja fi Maghazi Khayr al-Wara",      authorAr:"",                                                authorEn:"",                            publisher:"", volumes:1, categoryId:6, status:"available", serial:"sn-18", cover:null, pdf:null, descAr:"في مغازي وغزوات النبي ﷺ",                         descEn:"On the military expeditions of the Prophet ﷺ.", reviews:[], borrowedBy:null },
  { id:33, titleAr:"سيرة سيد البشر صلى الله عليه وسلم",                           titleEn:"Sirat Sayyid al-Bashar",                       authorAr:"عبد الرحمن باوا بن محمد المليباري",                authorEn:"'Abd al-Rahman Bawa al-Malibari", publisher:"", volumes:1, categoryId:6, status:"available", serial:"sn-19", cover:null, pdf:null, descAr:"سيرة نبوية شريفة مؤلفة بالمليبارية",              descEn:"Seerah of the Prophet ﷺ by a Malabari scholar.", reviews:[], borrowedBy:null },
  { id:34, titleAr:"السيرة الحلبية",                                               titleEn:"Al-Sira al-Halabiyya",                          authorAr:"امام علي بن ابراهيم بن احمد الحلبي الشافعي",       authorEn:"Imam 'Ali al-Halabi al-Shafi'i", publisher:"", volumes:3, categoryId:6, status:"available", serial:"sn-20", cover:null, pdf:null, descAr:"من أشهر كتب السيرة النبوية المفصلة",               descEn:"One of the most renowned detailed works of the Prophetic Seerah.", reviews:[], borrowedBy:null },
  { id:35, titleAr:"السيرة النبوية",                                                titleEn:"Al-Sira al-Nabawiyya (Ibn Hisham)",             authorAr:"امام ابن هشام",                                    authorEn:"Imam Ibn Hisham",             publisher:"", volumes:2, categoryId:6, status:"available", serial:"sn-24", cover:null, pdf:null, descAr:"السيرة النبوية لابن هشام — من أقدم المصادر",        descEn:"One of the earliest and most authoritative Seerah works.", reviews:[], borrowedBy:null },
  { id:36, titleAr:"الدرة الثمينة في اخبار المدينة",                               titleEn:"Al-Durra al-Thamina fi Akhbar al-Madina",      authorAr:"امام حافظ ابو عبد الله محمد بن محمود بن النجار",   authorEn:"Ibn al-Najjar",               publisher:"", volumes:1, categoryId:6, status:"available", serial:"sn-25", cover:null, pdf:null, descAr:"في تاريخ المدينة المنورة وأخبارها",                descEn:"On the history and narrations of al-Madina al-Munawwara.", reviews:[], borrowedBy:null },
  { id:37, titleAr:"جالية الاكدار والسيف البتار في الصلاة على المختار",            titleEn:"Jaliyat al-Akdar wal-Sayf al-Battar",          authorAr:"ضياء الدين خالد البغدادي",                         authorEn:"Diya' al-Din Khalid al-Baghdadi", publisher:"", volumes:1, categoryId:6, status:"available", serial:"sn-26", cover:null, pdf:null, descAr:"في الصلاة والسلام على النبي المختار ﷺ",            descEn:"On invoking blessings upon al-Mukhtar ﷺ.", reviews:[], borrowedBy:null },
  { id:38, titleAr:"القول البديع في الصلاة على الحبيب الشفيع",                    titleEn:"Al-Qawl al-Badi' fi al-Salat 'ala al-Habib al-Shafi'", authorAr:"امام حافظ شمس الدين محمد بن عبد الرحمن السخاوي", authorEn:"Imam al-Sakhawi",             publisher:"", volumes:1, categoryId:6, status:"available", serial:"sn-27", cover:null, pdf:null, descAr:"جامع في الصلاة على النبي الشفيع ﷺ",               descEn:"A comprehensive work on invoking blessings upon the Prophet ﷺ.", reviews:[], borrowedBy:null },
  { id:39, titleAr:"دلائل النبوة",                                                  titleEn:"Dala'il al-Nubuwwa",                           authorAr:"امام البيهقي",                                     authorEn:"Imam al-Bayhaqi",             publisher:"", volumes:7, categoryId:6, status:"available", serial:"sn-28", cover:null, pdf:null, descAr:"موسوعة في إثبات نبوة النبي ﷺ بالأدلة والمعجزات",   descEn:"An encyclopaedic work on the proofs and miracles of Prophethood.", reviews:[], borrowedBy:null },
  { id:40, titleAr:"زاد المعاد في هدي خير العباد",                                 titleEn:"Zad al-Ma'ad fi Hady Khayr al-'Ibad",          authorAr:"امام ابن القيم الجوزي",                            authorEn:"Imam Ibn Qayyim al-Jawziyya", publisher:"", volumes:5, categoryId:6, status:"available", serial:"sn-29", cover:null, pdf:null, descAr:"في هدي النبي ﷺ في العبادات والمعاملات والغزوات",   descEn:"On the guidance of the Prophet ﷺ in worship, dealings and battles.", reviews:[], borrowedBy:null },
  { id:41, titleAr:"السيرة النبوية",                                                titleEn:"Al-Sira al-Nabawiyya (al-Nadwi)",               authorAr:"ابو الحسن علي الحسني الندوي",                      authorEn:"Abu al-Hasan al-Nadwi",       publisher:"", volumes:1, categoryId:6, status:"available", serial:"sn-30", cover:null, pdf:null, descAr:"سيرة نبوية معاصرة بأسلوب عصري رصين",              descEn:"A modern and scholarly Prophetic Seerah by al-Nadwi.", reviews:[], borrowedBy:null },
  { id:42, titleAr:"العجالة السنية على الفية السيرة النبوية",                       titleEn:"Al-'Ajala al-Saniyya 'ala Alfiyyat al-Sira",   authorAr:"حافظ زين الدين ابو الفضل عبد الرحيم بن الحسين العراقي", authorEn:"Hafiz al-'Iraqi",           publisher:"", volumes:1, categoryId:6, status:"available", serial:"sn-31", cover:null, pdf:null, descAr:"شرح على ألفية السيرة النبوية",                     descEn:"Commentary on the Alfiyya of the Prophetic Seerah.", reviews:[], borrowedBy:null },
  { id:43, titleAr:"التحفة اللطيفة في حادثات البعثة الشريفة",                     titleEn:"Al-Tuhfa al-Latifa fi Hadathat al-Ba'tha al-Sharifa", authorAr:"العلامة ابو محمد عبد الرحمن بن علي الدبيع الشيباني", authorEn:"Ibn al-Dayba' al-Shaybani", publisher:"", volumes:1, categoryId:6, status:"available", serial:"sn-33", cover:null, pdf:null, descAr:"في أحداث البعثة النبوية الشريفة",                   descEn:"On the events of the noble Prophetic mission.", reviews:[], borrowedBy:null },
  { id:44, titleAr:"نور العيون في تلخيص سيرة الأمين المأمون",                     titleEn:"Nur al-'Uyun fi Talkhis Sirat al-Amin al-Ma'mun", authorAr:"شمس الدين ابو عبد الله محمد بن محمد بن احمد بن سيد الناس", authorEn:"Ibn Sayyid al-Nas",        publisher:"", volumes:1, categoryId:6, status:"available", serial:"sn-34", cover:null, pdf:null, descAr:"تلخيص للسيرة النبوية الشريفة",                      descEn:"An abridged Prophetic Seerah.", reviews:[], borrowedBy:null },
  { id:45, titleAr:"حاشية تحفة المشتاقين على المولد المنقوص",                     titleEn:"Hashiyat Tuhfat al-Mushtaqin 'ala al-Mawlid al-Maqsus", authorAr:"الشيخ ابراهيم مسليار كدنغيم",              authorEn:"Shaykh Ibrahim Musliyar Kadangim", publisher:"", volumes:1, categoryId:6, status:"available", serial:"sn-35", cover:null, pdf:null, descAr:"حاشية على المولد المنقوص",                          descEn:"Gloss on al-Mawlid al-Maqsus.", reviews:[], borrowedBy:null },
  { id:46, titleAr:"الشمائل المحمدية",                                              titleEn:"Al-Shama'il al-Muhammadiyya",                   authorAr:"امام ابو عيسى محمد بن عيسى الترمذي",              authorEn:"Imam al-Tirmidhi",            publisher:"", volumes:1, categoryId:6, status:"available", serial:"sn-36", cover:null, pdf:null, descAr:"في صفات النبي ﷺ وشمائله وأخلاقه",                 descEn:"On the physical and moral qualities of the Prophet ﷺ.", reviews:[], borrowedBy:null },
  { id:47, titleAr:"قصيدة البردة وشرحها عصيدة الشهدة",                             titleEn:"Qasidat al-Burda wa-Sharhuha 'Aseedat al-Shahda", authorAr:"العلامة السيد عمر بن احمد افندي الحنفي",         authorEn:"Al-Sayyid 'Umar Afandi al-Hanafi", publisher:"", volumes:1, categoryId:6, status:"available", serial:"sn-38", cover:null, pdf:null, descAr:"قصيدة البردة مع شرحها المسمى عصيدة الشهدة",       descEn:"The Burda ode with its commentary 'Aseedat al-Shahda.", reviews:[], borrowedBy:null },
  { id:48, titleAr:"علامات النبوة",                                                 titleEn:"'Alamat al-Nubuwwa",                            authorAr:"عبد الملك علي الكليب",                             authorEn:"'Abd al-Malik al-Kulayb",     publisher:"", volumes:1, categoryId:6, status:"available", serial:"sn-40", cover:null, pdf:null, descAr:"في علامات النبوة ودلائلها",                        descEn:"On the signs and proofs of Prophethood.", reviews:[], borrowedBy:null },
  { id:49, titleAr:"محمد رسول الله صلى الله عليه وسلم",                            titleEn:"Muhammad Rasul Allah ﷺ",                        authorAr:"محمد رضا",                                         authorEn:"Muhammad Rida",               publisher:"", volumes:1, categoryId:6, status:"available", serial:"sn-42", cover:null, pdf:null, descAr:"كتاب في سيرة النبي ﷺ ورسالته الخالدة",             descEn:"A book on the Seerah and eternal message of the Prophet ﷺ.", reviews:[], borrowedBy:null },
  { id:50, titleAr:"الشمائل المحمدية",                                              titleEn:"Al-Shama'il al-Muhammadiyya (2nd copy)",        authorAr:"امام ابو عيسى محمد بن سورة الترمذي",              authorEn:"Imam al-Tirmidhi",            publisher:"", volumes:1, categoryId:6, status:"available", serial:"sn-43", cover:null, pdf:null, descAr:"في شمائل النبي ﷺ وصفاته وأخلاقه الشريفة",         descEn:"On the noble qualities and characteristics of the Prophet ﷺ.", reviews:[], borrowedBy:null },
  { id:51, titleAr:"الخصائص الكبرى",                                                titleEn:"Al-Khasa'is al-Kubra",                          authorAr:"امام جلال الدين عبد الرحمن السيوطي",               authorEn:"Imam al-Suyuti",              publisher:"", volumes:2, categoryId:6, status:"available", serial:"sn-44", cover:null, pdf:null, descAr:"في خصائص النبي ﷺ ومعجزاته وفضائله",               descEn:"On the exclusive distinctions, miracles and virtues of the Prophet ﷺ.", reviews:[], borrowedBy:null },
  { id:52, titleAr:"تهذيب الاسماء واللغات",                                         titleEn:"Tahdhib al-Asma' wal-Lughat",                   authorAr:"ابو زكريا محي الدين يحيى بن شرف النووي",           authorEn:"Imam al-Nawawi",              publisher:"", volumes:3, categoryId:6, status:"available", serial:"sn-46", cover:null, pdf:null, descAr:"موسوعة في أسماء العلماء واللغة للإمام النووي",       descEn:"An encyclopaedia of scholars' names and linguistic terms by Imam al-Nawawi.", reviews:[], borrowedBy:null },
  // ── Hadith ──
  { id:53, titleAr:"فتح الباري بشرح صحيح البخاري",                 titleEn:"Fath al-Bari bi-Sharh Sahih al-Bukhari",       authorAr:"حافظ احمد بن علي بن حجر العسقلاني",               authorEn:"Ibn Hajar al-Asqalani",       publisher:"", volumes:13, categoryId:4, status:"available", serial:"H-1",  cover:null, pdf:null, descAr:"أشهر شروح صحيح البخاري وأجمعها",                  descEn:"The most celebrated and comprehensive commentary on Sahih al-Bukhari.", reviews:[], borrowedBy:null },
  { id:54, titleAr:"موطأ",                                           titleEn:"Al-Muwatta'",                                  authorAr:"امام مالك",                                        authorEn:"Imam Malik",                  publisher:"", volumes:2,  categoryId:4, status:"available", serial:"H-2",  cover:null, pdf:null, descAr:"أقدم المجموعات الحديثية المدونة",                   descEn:"One of the earliest and most important hadith compilations.", reviews:[], borrowedBy:null },
  { id:55, titleAr:"صحيح مسلم",                                     titleEn:"Sahih Muslim",                                 authorAr:"امام ابو الحسين مسلم بن الحجاج القشيري النيسابوري", authorEn:"Imam Muslim al-Naysaburi",    publisher:"", volumes:5,  categoryId:4, status:"available", serial:"H-3",  cover:null, pdf:null, descAr:"ثاني الصحيحين في الحديث النبوي الشريف",             descEn:"The second of the two most authentic hadith collections.", reviews:[], borrowedBy:null },
  { id:56, titleAr:"شرح الزرقاني على موطأ الامام مالك",             titleEn:"Sharh al-Zarqani 'ala Muwatta' al-Imam Malik", authorAr:"امام سيدي محمد الزرقاني",                          authorEn:"Imam al-Zarqani",             publisher:"", volumes:4,  categoryId:4, status:"available", serial:"H-4",  cover:null, pdf:null, descAr:"شرح مفصل على موطأ الإمام مالك",                    descEn:"A detailed commentary on the Muwatta' of Imam Malik.", reviews:[], borrowedBy:null },
  { id:57, titleAr:"فيض القدير شرح الجامع الصغير",                  titleEn:"Fayd al-Qadir Sharh al-Jami' al-Saghir",       authorAr:"محمد عبد الرؤوف المناوي",                          authorEn:"Al-Munawi",                   publisher:"", volumes:6,  categoryId:4, status:"available", serial:"H-5",  cover:null, pdf:null, descAr:"شرح على الجامع الصغير للسيوطي",                    descEn:"Commentary on al-Suyuti's al-Jami' al-Saghir.", reviews:[], borrowedBy:null },
  { id:58, titleAr:"شرح رياض الصالحين",                             titleEn:"Sharh Riyad al-Salihin",                       authorAr:"امام ابو زكريا محي الدين يحيى بن شرف النووي",      authorEn:"Imam al-Nawawi",              publisher:"", volumes:4,  categoryId:4, status:"available", serial:"H-6",  cover:null, pdf:null, descAr:"شرح على كتاب رياض الصالحين",                       descEn:"Commentary on Riyad al-Salihin.", reviews:[], borrowedBy:null },
  { id:59, titleAr:"شرح صحيح المسلم",                               titleEn:"Sharh Sahih Muslim",                           authorAr:"امام ابو زكريا يحيى بن شرف النووي",                authorEn:"Imam al-Nawawi",              publisher:"", volumes:18, categoryId:4, status:"available", serial:"H-7",  cover:null, pdf:null, descAr:"أشهر شروح صحيح مسلم وأكملها",                      descEn:"The most celebrated commentary on Sahih Muslim.", reviews:[], borrowedBy:null },
  { id:60, titleAr:"ارشاد الساري لشرح صحيح البخاري",                titleEn:"Irshad al-Sari li-Sharh Sahih al-Bukhari",     authorAr:"امام ابو العباس شهاب الدين احمد بن محمد القسطلاني", authorEn:"Imam al-Qastallani",          publisher:"", volumes:10, categoryId:4, status:"available", serial:"H-8",  cover:null, pdf:null, descAr:"شرح وافٍ على صحيح البخاري",                         descEn:"A comprehensive commentary on Sahih al-Bukhari.", reviews:[], borrowedBy:null },
  { id:61, titleAr:"تدريب الراوي في شرح تقريب النواوي",             titleEn:"Tadrib al-Rawi fi Sharh Taqrib al-Nawawi",     authorAr:"ابو الفضل جلال الدين عبد الرحمن السيوطي",          authorEn:"Imam al-Suyuti",              publisher:"", volumes:2,  categoryId:4, status:"available", serial:"H-9",  cover:null, pdf:null, descAr:"في علوم الحديث وشرح تقريب النووي",                 descEn:"On hadith sciences, commentary on al-Nawawi's Taqrib.", reviews:[], borrowedBy:null },
  { id:62, titleAr:"معجم الصغير للطبراني",                          titleEn:"Al-Mu'jam al-Saghir lil-Tabarani",             authorAr:"الحافظ ابو القاسم سليمان بن احمد الطبراني",        authorEn:"Imam al-Tabarani",            publisher:"", volumes:2,  categoryId:4, status:"available", serial:"H-10", cover:null, pdf:null, descAr:"من معاجم الحديث للطبراني",                          descEn:"One of al-Tabarani's hadith encyclopaedias.", reviews:[], borrowedBy:null },
  { id:63, titleAr:"جامع العلوم والحكم في شرح خمسين حديثا من جوامع الكلم", titleEn:"Jami' al-'Ulum wal-Hikam",          authorAr:"امام حافظ زين الدين عبد الرحمن بن احمد بن رجب الحنبلي", authorEn:"Ibn Rajab al-Hanbali",      publisher:"", volumes:2,  categoryId:4, status:"available", serial:"H-11", cover:null, pdf:null, descAr:"شرح على خمسين حديثاً من جوامع الكلم",               descEn:"Commentary on fifty hadiths from the most comprehensive sayings.", reviews:[], borrowedBy:null },
  { id:64, titleAr:"الروضة الندية في شرح الاربعين النووية",         titleEn:"Al-Rawda al-Nadiyya fi Sharh al-Arba'in",      authorAr:"",                                                 authorEn:"",                            publisher:"", volumes:1,  categoryId:4, status:"available", serial:"H-12", cover:null, pdf:null, descAr:"شرح على الأربعين النووية",                           descEn:"Commentary on al-Nawawi's Forty Hadiths.", reviews:[], borrowedBy:null },
  { id:65, titleAr:"مرقاة المفاتيح بشرح مشكوة المصابيح",           titleEn:"Mirqat al-Mafatih Sharh Mishkat al-Masabih",   authorAr:"الشيخ علي بن سلطان محمد القاري",                   authorEn:"Mulla 'Ali al-Qari",          publisher:"", volumes:10, categoryId:4, status:"available", serial:"H-13", cover:null, pdf:null, descAr:"شرح موسوعي على مشكاة المصابيح",                     descEn:"An encyclopaedic commentary on Mishkat al-Masabih.", reviews:[], borrowedBy:null },
  { id:66, titleAr:"المجالس السنية في علم الحديث شرح الاربعين النووية", titleEn:"Al-Majalis al-Saniyya fi 'Ilm al-Hadith", authorAr:"الشيخ احمد بن حجازي الفشني المصري",               authorEn:"Shaykh Ahmad al-Fashni",      publisher:"", volumes:1,  categoryId:4, status:"available", serial:"H-14", cover:null, pdf:null, descAr:"شرح الأربعين النووية بأسلوب مجالسي",                descEn:"A scholarly commentary on al-Nawawi's Forty Hadiths.", reviews:[], borrowedBy:null },
  { id:67, titleAr:"الفتوحات الوهبية بشرح الاربعين حديثا النووية",  titleEn:"Al-Futuhat al-Wahbiyya bi-Sharh al-Arba'in",   authorAr:"الشيخ ابراهيم بن مرعى بن عطية",                   authorEn:"Shaykh Ibrahim ibn Mur'i",    publisher:"", volumes:1,  categoryId:4, status:"available", serial:"H-15", cover:null, pdf:null, descAr:"شرح على الأربعين النووية",                           descEn:"Commentary on al-Nawawi's Forty Hadiths.", reviews:[], borrowedBy:null },
  { id:68, titleAr:"المصنف في الاحاديث والاثار",                    titleEn:"Al-Musannaf fi al-Ahadith wal-Athar",          authorAr:"الشيخ عبد الله بن محمد بن ابي شيبة",               authorEn:"Ibn Abi Shayba",              publisher:"", volumes:15, categoryId:4, status:"available", serial:"H-16", cover:null, pdf:null, descAr:"موسوعة حديثية كبرى للحافظ ابن أبي شيبة",           descEn:"A major hadith and narrations encyclopaedia by Ibn Abi Shayba.", reviews:[], borrowedBy:null },
  { id:69, titleAr:"فتح المغيث شرح الفية الحديث",                   titleEn:"Fath al-Mughith Sharh Alfiyyat al-Hadith",     authorAr:"امام شمس الدين محمد بن عبد الرحمن السخاوي",        authorEn:"Imam al-Sakhawi",             publisher:"", volumes:4,  categoryId:4, status:"available", serial:"H-17", cover:null, pdf:null, descAr:"شرح على ألفية الحديث للعراقي",                      descEn:"Commentary on al-'Iraqi's Alfiyya of hadith sciences.", reviews:[], borrowedBy:null },
  { id:70, titleAr:"الاربعون حديثا النووية",                        titleEn:"Al-Arba'un al-Nawawiyya",                      authorAr:"امام يحيى بن شرف النووي",                          authorEn:"Imam al-Nawawi",              publisher:"", volumes:1,  categoryId:4, status:"available", serial:"H-18", cover:null, pdf:null, descAr:"أشهر متن في الأحاديث النبوية الأربعين",              descEn:"The most celebrated collection of forty prophetic hadiths.", reviews:[], borrowedBy:null },
  { id:71, titleAr:"مراة المشكاة",                                   titleEn:"Mir'at al-Mishkat",                            authorAr:"اسماعيل احمد نليكوت المليباري",                    authorEn:"Ismail Ahmad Nalikuth al-Malibari", publisher:"", volumes:1, categoryId:4, status:"available", serial:"H-19", cover:null, pdf:null, descAr:"شرح مشكاة المصابيح بالمليبارية",                   descEn:"Commentary on Mishkat al-Masabih by a Malabari scholar.", reviews:[], borrowedBy:null },
  { id:72, titleAr:"فتح الاله في شرح المشكاة",                      titleEn:"Fath al-Ilah fi Sharh al-Mishkat",             authorAr:"الشيخ الامام ابن حجر الهيتمي",                     authorEn:"Ibn Hajar al-Haytami",        publisher:"", volumes:3,  categoryId:4, status:"available", serial:"H-20", cover:null, pdf:null, descAr:"شرح على مشكاة المصابيح",                            descEn:"Commentary on Mishkat al-Masabih.", reviews:[], borrowedBy:null },
  { id:73, titleAr:"المقاصد الحسنة في بيان كثير من الاحاديث المشتهرة على الالسنة", titleEn:"Al-Maqasid al-Hasana",          authorAr:"امام شمس الدين محمد بن عبد الرحمن السخاوي",        authorEn:"Imam al-Sakhawi",             publisher:"", volumes:1,  categoryId:4, status:"available", serial:"H-21", cover:null, pdf:null, descAr:"في تحقيق الأحاديث المشهورة على الألسنة",             descEn:"Verification of widely-circulated hadiths.", reviews:[], borrowedBy:null },
  { id:74, titleAr:"كفاية الحفظة شرح مقدمة الموقظة في علم مصطلح الحديث", titleEn:"Kifayat al-Hafaza Sharh Muqaddimat al-Muwqiza", authorAr:"الحافظ شمس الدين محمد بن احمد الذهبي",          authorEn:"Imam al-Dhahabi",             publisher:"", volumes:1,  categoryId:4, status:"available", serial:"H-22", cover:null, pdf:null, descAr:"شرح على مقدمة الموقظة في مصطلح الحديث",             descEn:"Commentary on al-Dhahabi's Muqaddima al-Muwqiza.", reviews:[], borrowedBy:null },
  { id:75, titleAr:"مقدمة ابن الصلاح في علوم الحديث",               titleEn:"Muqaddimat Ibn al-Salah fi 'Ulum al-Hadith",    authorAr:"امام ابو عمرو عثمان بن عبد الرحمن الشهرزوري",      authorEn:"Ibn al-Salah",                publisher:"", volumes:1,  categoryId:4, status:"available", serial:"H-23", cover:null, pdf:null, descAr:"المرجع الأساسي في علوم الحديث",                     descEn:"The foundational reference in the sciences of hadith.", reviews:[], borrowedBy:null },
  { id:76, titleAr:"الالماع الى معرفة اصول الرواية وتقييد السماع",  titleEn:"Al-Ilma' ila Ma'rifat Usul al-Riwaya",         authorAr:"القاضي عياض بن موسى اليحصبي",                     authorEn:"Qadi 'Iyad",                  publisher:"", volumes:1,  categoryId:4, status:"available", serial:"H-24", cover:null, pdf:null, descAr:"في أصول الرواية وضوابط السماع والتحديث",             descEn:"On the principles of hadith transmission and audition.", reviews:[], borrowedBy:null },
  { id:77, titleAr:"فتح القريب المجيب على تهذيب الترغيب والترهيب",  titleEn:"Fath al-Qarib al-Mujib 'ala Tahdhib al-Targhib", authorAr:"السيد علوي بن السيد عباس المالكي الحسني",         authorEn:"Sayyid 'Alawi al-Maliki",     publisher:"", volumes:1,  categoryId:4, status:"available", serial:"H-25", cover:null, pdf:null, descAr:"شرح على تهذيب الترغيب والترهيب",                    descEn:"Commentary on Tahdhib al-Targhib wal-Tarhib.", reviews:[], borrowedBy:null },
  { id:78, titleAr:"الادب المفرد",                                   titleEn:"Al-Adab al-Mufrad",                            authorAr:"امام الحافظ محمد بن اسماعيل البخاري",               authorEn:"Imam al-Bukhari",             publisher:"", volumes:1,  categoryId:4, status:"available", serial:"H-26", cover:null, pdf:null, descAr:"جامع أحاديث الآداب النبوية الشريفة",                descEn:"A collection of prophetic hadiths on manners and etiquette.", reviews:[], borrowedBy:null },
  { id:79, titleAr:"زميل القاري لصحيح البخاري",                     titleEn:"Zamil al-Qari li-Sahih al-Bukhari",            authorAr:"محمد بن ماح الباقوي",                              authorEn:"Muhammad ibn Mah al-Baqawi",  publisher:"", volumes:1,  categoryId:4, status:"available", serial:"H-27", cover:null, pdf:null, descAr:"مختصر ومرافق لدراسة صحيح البخاري",                  descEn:"A companion guide to studying Sahih al-Bukhari.", reviews:[], borrowedBy:null },
  { id:80, titleAr:"الرفع والتكميل في الجرح والتعديل",              titleEn:"Al-Raf' wal-Takmil fi al-Jarh wal-Ta'dil",     authorAr:"امام ابو الحنات محمد عبد الحي الكنوي الهندي",      authorEn:"'Abd al-Hayy al-Laknawi",     publisher:"", volumes:1,  categoryId:4, status:"available", serial:"H-28", cover:null, pdf:null, descAr:"في علم الجرح والتعديل ونقد الرجال",                  descEn:"On the science of narrator criticism and authentication.", reviews:[], borrowedBy:null },
  { id:81, titleAr:"شرح الطيبي على مشكاة المصابيح",                 titleEn:"Sharh al-Tibi 'ala Mishkat al-Masabih",        authorAr:"امام شرف الدين الحسين بن محمد الطيبي",             authorEn:"Imam al-Tibi",                publisher:"", volumes:13, categoryId:4, status:"available", serial:"H-29", cover:null, pdf:null, descAr:"شرح علمي متين على مشكاة المصابيح",                  descEn:"A scholarly commentary on Mishkat al-Masabih.", reviews:[], borrowedBy:null },
  { id:82, titleAr:"شرح نخبة الفكر في مصطلحات اهل الاثر",          titleEn:"Sharh Nukhbat al-Fikr fi Mustalah Ahl al-Athar", authorAr:"امام المحدث علي بن سلطان محمد الهروي القاري",     authorEn:"Mulla 'Ali al-Qari",          publisher:"", volumes:1,  categoryId:4, status:"available", serial:"H-31", cover:null, pdf:null, descAr:"شرح على نخبة الفكر لابن حجر في مصطلح الحديث",       descEn:"Commentary on Ibn Hajar's Nukhbat al-Fikr in hadith terminology.", reviews:[], borrowedBy:null },
  { id:83, titleAr:"رياض الصالحين من كلام سيد المرسلين",            titleEn:"Riyad al-Salihin",                             authorAr:"امام يحيى بن شرف النووي",                          authorEn:"Imam al-Nawawi",              publisher:"", volumes:1,  categoryId:4, status:"available", serial:"H-33", cover:null, pdf:null, descAr:"من أشهر كتب الحديث في الآداب والأخلاق الإسلامية",   descEn:"One of the most beloved hadith collections on Islamic character.", reviews:[], borrowedBy:null },
  { id:84, titleAr:"دليل الفالحين لطرق رياض الصالحين",              titleEn:"Dalil al-Falihin li-Turuq Riyad al-Salihin",   authorAr:"محمد بن علان الصديقي الشافعي الاشعري المكي",       authorEn:"Ibn 'Allan al-Makki",         publisher:"", volumes:4,  categoryId:4, status:"available", serial:"H-34", cover:null, pdf:null, descAr:"شرح موسع على رياض الصالحين",                        descEn:"An extensive commentary on Riyad al-Salihin.", reviews:[], borrowedBy:null },
  { id:85, titleAr:"بلوغ المرام من ادلة الاحكام",                   titleEn:"Bulugh al-Maram min Adillat al-Ahkam",         authorAr:"الحافظ احمد بن علي بن حجر العسقلاني",              authorEn:"Ibn Hajar al-Asqalani",       publisher:"", volumes:1,  categoryId:4, status:"available", serial:"H-35", cover:null, pdf:null, descAr:"أحاديث الأحكام الفقهية مع تخريجها",                  descEn:"Hadiths of legal rulings with their critical evaluation.", reviews:[], borrowedBy:null },
  { id:86, titleAr:"تصقيل المراة بشرح مقدمة المشكوة",               titleEn:"Tasqil al-Mir'a bi-Sharh Muqaddimat al-Mishkat", authorAr:"الدكتور عبد الغفور المليباري",                    authorEn:"Dr 'Abd al-Ghafur al-Malibari", publisher:"", volumes:1, categoryId:4, status:"available", serial:"H-37", cover:null, pdf:null, descAr:"شرح مقدمة مشكاة المصابيح",                          descEn:"Commentary on the introduction to Mishkat al-Masabih.", reviews:[], borrowedBy:null },
  { id:87, titleAr:"المنهج المبين في شرح الاربعين",                  titleEn:"Al-Manhaj al-Mubin fi Sharh al-Arba'in",       authorAr:"ابو حفص تاج الدين عمر بن علي الفكهاني المالكي",    authorEn:"Ibn al-Fakihani al-Maliki",   publisher:"", volumes:1,  categoryId:4, status:"available", serial:"H-38", cover:null, pdf:null, descAr:"شرح على الأربعين النووية",                           descEn:"Commentary on al-Nawawi's Forty Hadiths.", reviews:[], borrowedBy:null },
  { id:88, titleAr:"ظفر الاماني بشرح مختصر السيد الشريف الجرجاني في مصطلح الحديث", titleEn:"Zafar al-Amani bi-Sharh Mukhtasar al-Jurjani", authorAr:"امام الشيخ محمد عبد الحي الكنوي الهندي",          authorEn:"'Abd al-Hayy al-Laknawi",     publisher:"", volumes:1,  categoryId:4, status:"available", serial:"H-39", cover:null, pdf:null, descAr:"شرح على مختصر الجرجاني في مصطلح الحديث",            descEn:"Commentary on al-Jurjani's abridgement of hadith terminology.", reviews:[], borrowedBy:null },
  { id:89, titleAr:"الفتح المبين بشرح الاربعين",                    titleEn:"Al-Fath al-Mubin bi-Sharh al-Arba'in",         authorAr:"امام شهاب الدين احمد بن علي بن حجر الهيتمي",       authorEn:"Ibn Hajar al-Haytami",        publisher:"", volumes:1,  categoryId:4, status:"available", serial:"H-40", cover:null, pdf:null, descAr:"شرح على الأربعين النووية لابن حجر الهيتمي",          descEn:"Ibn Hajar al-Haytami's commentary on al-Nawawi's Forty Hadiths.", reviews:[], borrowedBy:null },
  { id:90, titleAr:"اربعون حديثا في اصطناع المعروف",                titleEn:"Arba'un Hadith fi Istinan al-Ma'ruf",          authorAr:"زكي الدين ابو محمد عبد العظيم بن عبد القوي المنذري", authorEn:"Imam al-Mundhiri",            publisher:"", volumes:1,  categoryId:4, status:"available", serial:"H-41", cover:null, pdf:null, descAr:"أربعون حديثاً في فعل المعروف وإسدائه",               descEn:"Forty hadiths on performing and spreading good deeds.", reviews:[], borrowedBy:null },
  { id:91, titleAr:"اعمال الفكر والروايات في شرح حديث إنما الاعمال بالنيات", titleEn:"A'mal al-Fikr wal-Riwayat fi Sharh Hadith al-Niyyat", authorAr:"عبد الله ابراهيم بن حسن الكردي",            authorEn:"'Abdallah Ibrahim al-Kurdi",  publisher:"", volumes:1,  categoryId:4, status:"available", serial:"H-42", cover:null, pdf:null, descAr:"شرح حديث إنما الأعمال بالنيات",                      descEn:"Commentary on the hadith 'Actions are by intentions'.", reviews:[], borrowedBy:null },
  { id:92, titleAr:"المجالس الوعظية في شرح احاديث خير البرية من صحيح الامام البخاري", titleEn:"Al-Majalis al-Wa'ziyya fi Sharh Ahadith Khayr al-Bariyya", authorAr:"امام شمس الدين محمد بن عمر بن احمد السنيري الشافعي", authorEn:"Imam al-Sunayri al-Shafi'i", publisher:"", volumes:1, categoryId:4, status:"available", serial:"H-43", cover:null, pdf:null, descAr:"مجالس وعظية في شرح أحاديث صحيح البخاري",              descEn:"Preaching sessions explaining hadiths from Sahih al-Bukhari.", reviews:[], borrowedBy:null },
  { id:93, titleAr:"منهج ذوي النظر شرح منظومة علم الاثر للحافظ جلال الدين السيوطي", titleEn:"Manhaj Dhawi al-Nazar Sharh Manzuma 'Ilm al-Athar", authorAr:"الشيخ محمد محفوظ بن عبد الله الترمسي",            authorEn:"Shaykh Muhammad Mahfuz al-Tarmasi", publisher:"", volumes:1, categoryId:4, status:"available", serial:"H-44", cover:null, pdf:null, descAr:"شرح على منظومة علم الأثر للسيوطي",                   descEn:"Commentary on al-Suyuti's poem on hadith sciences.", reviews:[], borrowedBy:null },
  { id:94, titleAr:"الباعث الحثيث شرح اختصار علوم الحديث",         titleEn:"Al-Ba'ith al-Hathith Sharh Ikhtisar 'Ulum al-Hadith", authorAr:"الحافظ ابن كثير",                              authorEn:"Hafiz Ibn Kathir",             publisher:"", volumes:1,  categoryId:4, status:"available", serial:"H-45", cover:null, pdf:null, descAr:"شرح على اختصار علوم الحديث لابن كثير",               descEn:"Ibn Kathir's commentary on the abridgement of hadith sciences.", reviews:[], borrowedBy:null },
  { id:95, titleAr:"الاجوبة الفاضلة للاسئلة العشرة الكاملة",       titleEn:"Al-Ajwiba al-Fadila lil-As'ila al-'Ashara",    authorAr:"امام ابو الحنات محمد عبد الحي الكنوي الهندي",      authorEn:"'Abd al-Hayy al-Laknawi",     publisher:"", volumes:1,  categoryId:4, status:"available", serial:"H-46", cover:null, pdf:null, descAr:"أجوبة علمية على عشرة أسئلة في الحديث وعلومه",        descEn:"Scholarly answers to ten questions on hadith and its sciences.", reviews:[], borrowedBy:null },
  { id:96, titleAr:"الجزء المفقود من الجزء الاول من المصنف",        titleEn:"Al-Juz' al-Mafqud min al-Musannaf",            authorAr:"الحافظ الكبير ابو بكر عبد الرزاق بن همام الصنعاني", authorEn:"'Abd al-Razzaq al-San'ani",   publisher:"", volumes:1,  categoryId:4, status:"available", serial:"H-47", cover:null, pdf:null, descAr:"الجزء المستعاد من مصنف عبد الرزاق الصنعاني",        descEn:"The recovered portion of 'Abd al-Razzaq's al-Musannaf.", reviews:[], borrowedBy:null },
  { id:97, titleAr:"المنهل اللطيف في اصول الحديث الشريف",           titleEn:"Al-Manhal al-Latif fi Usul al-Hadith al-Sharif", authorAr:"السيد محمد بن علوي بن عباس المالكي المكي الحسني",  authorEn:"Sayyid Muhammad al-Maliki al-Makki", publisher:"", volumes:1, categoryId:4, status:"available", serial:"H-48", cover:null, pdf:null, descAr:"مختصر في أصول علم الحديث الشريف",                   descEn:"An introduction to the principles of hadith sciences.", reviews:[], borrowedBy:null },
  { id:98, titleAr:"مختصر الترغيب والترهيب",                        titleEn:"Mukhtasar al-Targhib wal-Tarhib",              authorAr:"الامام الحافظ احمد بن علي بن حجر العسقلاني",       authorEn:"Ibn Hajar al-Asqalani",       publisher:"", volumes:1,  categoryId:4, status:"available", serial:"H-49", cover:null, pdf:null, descAr:"مختصر في أحاديث الترغيب والترهيب",                   descEn:"An abridgement of hadiths on encouragement and warning.", reviews:[], borrowedBy:null },
  { id:99, titleAr:"الجامع الصغير في احاديث البشير والنذير",         titleEn:"Al-Jami' al-Saghir fi Ahadith al-Bashir wal-Nadhir", authorAr:"امام الحافظ جلال الدين عبد الرحمن السيوطي",    authorEn:"Imam al-Suyuti",              publisher:"", volumes:2,  categoryId:4, status:"available", serial:"H-50", cover:null, pdf:null, descAr:"جامع حديثي مشهور للسيوطي",                          descEn:"A celebrated hadith collection by Imam al-Suyuti.", reviews:[], borrowedBy:null },
  { id:100,titleAr:"صحيح رياض الصالحين",                            titleEn:"Sahih Riyad al-Salihin",                       authorAr:"امام ابو زكريا يحيى بن شرف النووي",                authorEn:"Imam al-Nawawi",              publisher:"", volumes:1,  categoryId:4, status:"available", serial:"H-51", cover:null, pdf:null, descAr:"رياض الصالحين مع تصحيح الأحاديث",                   descEn:"Riyad al-Salihin with hadith authentication.", reviews:[], borrowedBy:null },
  { id:101,titleAr:"موطأ",                                           titleEn:"Al-Muwatta' (2nd copy)",                       authorAr:"امام مالك بن انس",                                 authorEn:"Imam Malik ibn Anas",         publisher:"", volumes:2,  categoryId:4, status:"available", serial:"H-52", cover:null, pdf:null, descAr:"نسخة ثانية من موطأ الإمام مالك",                    descEn:"Second copy of Imam Malik's Muwatta'.", reviews:[], borrowedBy:null },
  { id:102,titleAr:"الرحلة في طلب الحديث",                          titleEn:"Al-Rihla fi Talab al-Hadith",                  authorAr:"امام الحافظ ابو بكر احمد بن علي بن ثابت الخطيب البغدادي", authorEn:"Al-Khatib al-Baghdadi",    publisher:"", volumes:1,  categoryId:4, status:"available", serial:"H-53", cover:null, pdf:null, descAr:"في رحلة طلب الحديث عند المحدثين",                    descEn:"On travelling in search of hadith knowledge.", reviews:[], borrowedBy:null },
  { id:103,titleAr:"ثلاث رسائل في علم مصطلح الحديث",               titleEn:"Thalath Rasa'il fi 'Ilm Mustalah al-Hadith",   authorAr:"",                                                 authorEn:"",                            publisher:"", volumes:1,  categoryId:4, status:"available", serial:"H-54", cover:null, pdf:null, descAr:"ثلاث رسائل متخصصة في مصطلح الحديث",                 descEn:"Three specialist treatises in hadith terminology.", reviews:[], borrowedBy:null },
  { id:104,titleAr:"تقرير المفاتيح على مشكوة المصابيح",             titleEn:"Taqrir al-Mafatih 'ala Mishkat al-Masabih",    authorAr:"اسماعيل احمد نليكوت",                             authorEn:"Ismail Ahmad Nalikuth",       publisher:"", volumes:1,  categoryId:4, status:"available", serial:"H-55", cover:null, pdf:null, descAr:"تقريرات على شرح مشكاة المصابيح",                    descEn:"Annotations on Mishkat al-Masabih.", reviews:[], borrowedBy:null },
  { id:105,titleAr:"الكافي في فقه الامام احمد بن حنبل",             titleEn:"Al-Kafi fi Fiqh al-Imam Ahmad ibn Hanbal",     authorAr:"ابو محمد موفق الدين عبد الله بن قدامة المقدسي",    authorEn:"Ibn Qudama al-Maqdisi",       publisher:"", volumes:4,  categoryId:4, status:"available", serial:"H-57", cover:null, pdf:null, descAr:"مرجع في الفقه الحنبلي لابن قدامة المقدسي",          descEn:"A Hanbali jurisprudence reference by Ibn Qudama al-Maqdisi.", reviews:[], borrowedBy:null },
  // ── البلاغة ──
  { id:106,titleAr:"كشف الشواهد في الكتب العوائد",                  titleEn:"Kashf al-Shawahid fi al-Kutub al-'Awa'id",     authorAr:"ابن محمد الويلتوري",                               authorEn:"Ibn Muhammad al-Wilitouri",   publisher:"", volumes:1,  categoryId:8, status:"available", serial:"B-1",  cover:null, pdf:null, descAr:"في شواهد البلاغة وأساليبها",                        descEn:"On rhetorical examples and literary devices.", reviews:[], borrowedBy:null },
  { id:107,titleAr:"هدي البيان على تحفة الاخوان",                   titleEn:"Hady al-Bayan 'ala Tuhfat al-Ikhwan",          authorAr:"ابن محمد الويلتوري",                               authorEn:"Ibn Muhammad al-Wilitouri",   publisher:"", volumes:1,  categoryId:8, status:"available", serial:"B-5",  cover:null, pdf:null, descAr:"شرح على تحفة الإخوان في علم البيان",                descEn:"Commentary on Tuhfat al-Ikhwan in the science of al-Bayan.", reviews:[], borrowedBy:null },
  { id:108,titleAr:"اسرار البلاغة",                                  titleEn:"Asrar al-Balagha",                             authorAr:"عبد القاهر الجرجاني",                              authorEn:"'Abd al-Qahir al-Jurjani",    publisher:"", volumes:1,  categoryId:8, status:"available", serial:"B-7",  cover:null, pdf:null, descAr:"من أهم كتب البلاغة العربية الكلاسيكية",              descEn:"One of the most important classical works on Arabic rhetoric.", reviews:[], borrowedBy:null },
  { id:109,titleAr:"شروح التلخيص",                                   titleEn:"Shuruh al-Talkhis",                            authorAr:"سعد الدين التفتازاني، ابن يعقوب المغربي، بهاء الدين السبكي", authorEn:"Al-Taftazani, Ibn Ya'qub al-Maghribi, Baha' al-Din al-Subki", publisher:"", volumes:3, categoryId:8, status:"available", serial:"B-8", cover:null, pdf:null, descAr:"شروح ثلاثة علماء على مختصر التلخيص في علوم البلاغة", descEn:"Three scholarly commentaries on Talkhis al-Miftah in rhetoric.", reviews:[], borrowedBy:null },
  // ── الفقه ──
  { id:110,titleAr:"نهاية المحتاج الى شرح المنهاج في فقه الامام الشافعي",          titleEn:"Nihayat al-Muhtaj ila Sharh al-Minhaj",                      authorAr:"شمس الدين محمد بن ابي العباس احمد بن حمزة الرملي",              authorEn:"Shams al-Din al-Ramli",         publisher:"", volumes:8,  categoryId:2, status:"available", serial:"F-1",  cover:null, pdf:null, descAr:"من أمهات كتب الفقه الشافعي",                              descEn:"One of the foremost references in Shafi'i jurisprudence.", reviews:[], borrowedBy:null },
  { id:111,titleAr:"حاشية البجيرمي على شرح منهج الطلاب",                            titleEn:"Hashiyat al-Bajirami 'ala Sharh Manhaj al-Tullab",            authorAr:"",                                                              authorEn:"",                              publisher:"", volumes:4,  categoryId:2, status:"available", serial:"F-2",  cover:null, pdf:null, descAr:"حاشية على شرح منهج الطلاب في الفقه الشافعي",             descEn:"Gloss on the commentary of Manhaj al-Tullab.", reviews:[], borrowedBy:null },
  { id:112,titleAr:"الفيض الاله المالك في حل الفاظ عمدة السالك وعدة الناسك",        titleEn:"Al-Fayd al-Ilahi al-Malik fi Hall Alfaz 'Umdat al-Salik",    authorAr:"السيد عمر بركات الشامي البتائي المكي الشافعي",                  authorEn:"Sayyid 'Umar Barakat al-Makki", publisher:"", volumes:1,  categoryId:2, status:"available", serial:"F-3",  cover:null, pdf:null, descAr:"شرح على عمدة السالك في الفقه الشافعي",                    descEn:"Commentary on 'Umdat al-Salik in Shafi'i fiqh.", reviews:[], borrowedBy:null },
  { id:113,titleAr:"كتاب الام في فروع الفقه برواية الربيع بن سليمان المرادي",        titleEn:"Kitab al-Umm fi Furu' al-Fiqh",                              authorAr:"امام ابو عبد الله محمد بن ادريس الشافعي",                       authorEn:"Imam al-Shafi'i",               publisher:"", volumes:8,  categoryId:2, status:"available", serial:"F-4",  cover:null, pdf:null, descAr:"الموسوعة الفقهية الكبرى للإمام الشافعي",                 descEn:"The grand jurisprudential encyclopedia of Imam al-Shafi'i.", reviews:[], borrowedBy:null },
  { id:114,titleAr:"الميزان الكبرى",                                                  titleEn:"Al-Mizan al-Kubra",                                           authorAr:"عبد الوهاب بن احمد الشعراني",                                   authorEn:"'Abd al-Wahhab al-Sha'rani",    publisher:"", volumes:2,  categoryId:2, status:"available", serial:"F-5",  cover:null, pdf:null, descAr:"في المقارنة بين المذاهب الفقهية الأربعة",                descEn:"A comparative study of the four jurisprudential schools.", reviews:[], borrowedBy:null },
  { id:115,titleAr:"حاشية على شرح علامة ابن قاسم على متن الشيخ ابن شجاعي",          titleEn:"Hashiya 'ala Sharh Ibn Qasim 'ala Matn Ibn Shuja'i",         authorAr:"الشيخ ابراهيم البيجوري",                                        authorEn:"Shaykh Ibrahim al-Bajuri",      publisher:"", volumes:1,  categoryId:2, status:"available", serial:"F-6",  cover:null, pdf:null, descAr:"حاشية البيجوري على شرح ابن قاسم",                        descEn:"Al-Bajuri's gloss on Ibn Qasim's commentary.", reviews:[], borrowedBy:null },
  { id:116,titleAr:"حاشية البجيرمي",                                                  titleEn:"Hashiyat al-Bajirami",                                        authorAr:"الشيخ سليمان البجيرمي",                                          authorEn:"Shaykh Sulayman al-Bajirami",   publisher:"", volumes:4,  categoryId:2, status:"available", serial:"F-7",  cover:null, pdf:null, descAr:"حاشية مشهورة للشيخ سليمان البجيرمي في الفقه الشافعي",   descEn:"The celebrated gloss by Shaykh al-Bajirami in Shafi'i fiqh.", reviews:[], borrowedBy:null },
  { id:117,titleAr:"المغني المحتاج الى معرفة معاني الفاظ المنهاج",                   titleEn:"Mughni al-Muhtaj ila Ma'rifat Ma'ani Alfaz al-Minhaj",       authorAr:"الشيخ محمد الشربيني الخطيب",                                    authorEn:"Shaykh Muhammad al-Khatib al-Shirbini", publisher:"", volumes:6, categoryId:2, status:"available", serial:"F-8", cover:null, pdf:null, descAr:"شرح موسوعي على منهاج الطالبين للنووي",                   descEn:"An encyclopaedic commentary on al-Nawawi's Minhaj al-Talibin.", reviews:[], borrowedBy:null },
  { id:118,titleAr:"الفتاوى الكبرى الفقهية",                                          titleEn:"Al-Fatawa al-Kubra al-Fiqhiyya",                              authorAr:"امام ابن حجر الهيتمي",                                           authorEn:"Ibn Hajar al-Haytami",          publisher:"", volumes:4,  categoryId:2, status:"available", serial:"F-9",  cover:null, pdf:null, descAr:"فتاوى فقهية كبرى لابن حجر الهيتمي",                      descEn:"Major jurisprudential fatwas by Ibn Hajar al-Haytami.", reviews:[], borrowedBy:null },
  { id:119,titleAr:"المجموع شرح المهذب",                                               titleEn:"Al-Majmu' Sharh al-Muhadhdhab",                               authorAr:"امام ابو زكريا يحيى بن شرف النووي",                             authorEn:"Imam al-Nawawi",                publisher:"", volumes:20, categoryId:2, status:"available", serial:"F-10", cover:null, pdf:null, descAr:"من أعظم موسوعات الفقه الشافعي",                          descEn:"One of the greatest encyclopaedias of Shafi'i jurisprudence.", reviews:[], borrowedBy:null },
  { id:120,titleAr:"حواشي على تحفة المحتاج بشرح المنهاج للامام ابن حجر الهيتمي",     titleEn:"Hawashi 'ala Tuhfat al-Muhtaj bi-Sharh al-Minhaj",           authorAr:"الشيخ عبد الحميد الشرواني والشيخ احمد بن قاسم العبادي",        authorEn:"Al-Shirwani & Ibn Qasim al-'Abbadi", publisher:"", volumes:10, categoryId:2, status:"available", serial:"F-11", cover:null, pdf:null, descAr:"حاشيتان على تحفة المحتاج لابن حجر الهيتمي",              descEn:"Two glosses on Tuhfat al-Muhtaj by Ibn Hajar al-Haytami.", reviews:[], borrowedBy:null },
  { id:121,titleAr:"الاجوبة العجيبة عن الاسئلة الغريبة",                              titleEn:"Al-Ajwiba al-'Ajiba 'an al-As'ila al-Ghariba",               authorAr:"امام احمد زين الدين بن محمد الغزالي المليباري",                 authorEn:"Ahmad Zayn al-Din al-Malibari", publisher:"", volumes:1,  categoryId:2, status:"available", serial:"F-12", cover:null, pdf:null, descAr:"أجوبة على مسائل فقهية غريبة ونادرة",                    descEn:"Answers to unusual and rare jurisprudential questions.", reviews:[], borrowedBy:null },
  { id:122,titleAr:"فقه السنة",                                                        titleEn:"Fiqh al-Sunna",                                              authorAr:"اسماعيل احمد نليكوت المليباري",                                  authorEn:"Ismail Ahmad Nalikuth al-Malibari", publisher:"", volumes:1, categoryId:2, status:"available", serial:"F-13", cover:null, pdf:null, descAr:"في فقه السنة بالمليبارية",                                descEn:"Fiqh al-Sunna by a Malabari scholar.", reviews:[], borrowedBy:null },
  { id:123,titleAr:"طيب الكلام بفوائد السلام",                                         titleEn:"Tayb al-Kalam bi-Fawa'id al-Salam",                           authorAr:"امام نور الدين علي بن عبد الله السمهودي الحسني الشافعي",        authorEn:"Imam al-Samhudi",               publisher:"", volumes:1,  categoryId:2, status:"available", serial:"F-14", cover:null, pdf:null, descAr:"في أحكام السلام وآدابه",                                  descEn:"On the rulings and etiquette of Islamic greetings.", reviews:[], borrowedBy:null },
  { id:124,titleAr:"الرسالة",                                                           titleEn:"Al-Risala",                                                  authorAr:"امام ابو عبد الله محمد بن ادريس الشافعي",                       authorEn:"Imam al-Shafi'i",               publisher:"", volumes:1,  categoryId:2, status:"available", serial:"F-15", cover:null, pdf:null, descAr:"أول كتاب صنف في أصول الفقه للإمام الشافعي",              descEn:"The first book written in Islamic legal theory by Imam al-Shafi'i.", reviews:[], borrowedBy:null },
  { id:125,titleAr:"بشرى الكريم بشرح مسائل التعليم",                                  titleEn:"Bushra al-Karim bi-Sharh Masa'il al-Ta'lim",                 authorAr:"الشيخ سعيد بن محمد باعشن",                                      authorEn:"Shaykh Sa'id Ba'shan",          publisher:"", volumes:1,  categoryId:2, status:"available", serial:"F-16", cover:null, pdf:null, descAr:"شرح على مسائل التعليم في الفقه الشافعي",                  descEn:"Commentary on jurisprudential questions in Shafi'i fiqh.", reviews:[], borrowedBy:null },
  { id:126,titleAr:"الانوار السنية على الدرر البهية",                                  titleEn:"Al-Anwar al-Saniyya 'ala al-Durar al-Bahiyya",               authorAr:"الشيخ عبد الحميد بن محمد علي قدس الخطيب",                      authorEn:"Shaykh 'Abd al-Hamid al-Khatib", publisher:"", volumes:1, categoryId:2, status:"available", serial:"F-17", cover:null, pdf:null, descAr:"شرح على الدرر البهية في الفقه",                            descEn:"Commentary on al-Durar al-Bahiyya.", reviews:[], borrowedBy:null },
  { id:127,titleAr:"حاشية على شرح الايضاح في مناسك الحج للامام النووي",               titleEn:"Hashiya 'ala Sharh al-Idah fi Manasik al-Hajj",              authorAr:"العلامة ابن حجر الهيتمي",                                       authorEn:"Ibn Hajar al-Haytami",          publisher:"", volumes:1,  categoryId:2, status:"available", serial:"F-18", cover:null, pdf:null, descAr:"حاشية على شرح الإيضاح في مناسك الحج",                    descEn:"Gloss on the commentary of al-Idah on Hajj rituals.", reviews:[], borrowedBy:null },
  { id:128,titleAr:"حاشية اعانة الطالبين على حل الفاظ فتح المعين",                    titleEn:"I'anat al-Talibin 'ala Hall Alfaz Fath al-Mu'in",            authorAr:"العلامة ابو بكر عثمان بن محمد شطا الدمياطي البكري",            authorEn:"Al-Dimyati al-Bakri",           publisher:"", volumes:4,  categoryId:2, status:"available", serial:"F-19", cover:null, pdf:null, descAr:"من أشهر حواشي فتح المعين في الفقه الشافعي",               descEn:"One of the most celebrated glosses on Fath al-Mu'in.", reviews:[], borrowedBy:null },
  { id:129,titleAr:"متن الزبد في علم الفقه على مذهب الامام الشافعي",                  titleEn:"Matn al-Zubd fi 'Ilm al-Fiqh",                               authorAr:"امام احمد بن رسلان الشافعي",                                    authorEn:"Imam Ahmad ibn Raslan",         publisher:"", volumes:1,  categoryId:2, status:"available", serial:"F-20", cover:null, pdf:null, descAr:"متن مختصر في الفقه الشافعي",                              descEn:"A concise primer in Shafi'i jurisprudence.", reviews:[], borrowedBy:null },
  { id:130,titleAr:"الثمار البالغة شرح رياض البديعة",                                  titleEn:"Al-Thamar al-Baligha Sharh Riyad al-Badi'a",                 authorAr:"الشيخ محمد حسب الله",                                           authorEn:"Shaykh Muhammad Hasb Allah",    publisher:"", volumes:1,  categoryId:2, status:"available", serial:"F-21", cover:null, pdf:null, descAr:"شرح على رياض البديعة في الفقه",                           descEn:"Commentary on Riyad al-Badi'a in fiqh.", reviews:[], borrowedBy:null },
  { id:131,titleAr:"ترشيح المستفيدين بترشيح فتح المعين",                               titleEn:"Tarshih al-Mustafiddin bi-Tarshih Fath al-Mu'in",            authorAr:"السيد علوي بن السيد احمد السقاف",                               authorEn:"Sayyid 'Alawi al-Saqqaf",       publisher:"", volumes:1,  categoryId:2, status:"available", serial:"F-22", cover:null, pdf:null, descAr:"تعليقات وإضافات على فتح المعين",                          descEn:"Annotations and additions to Fath al-Mu'in.", reviews:[], borrowedBy:null },
  { id:132,titleAr:"الحواشي المدنية على شرح الشهاب احمد بن حجر الهيتمي",              titleEn:"Al-Hawashi al-Madaniyya 'ala Sharh Ibn Hajar al-Haytami",   authorAr:"الشيخ محمد بن سليمان الكردي المدني",                            authorEn:"Shaykh Muhammad al-Kurdi al-Madani", publisher:"", volumes:2, categoryId:2, status:"available", serial:"F-24", cover:null, pdf:null, descAr:"حواشي مدنية على شرح ابن حجر الهيتمي",                    descEn:"Medinan glosses on Ibn Hajar al-Haytami's commentary.", reviews:[], borrowedBy:null },
  { id:133,titleAr:"كتاب الايضاح في مناسك الحج والعمرة",                               titleEn:"Kitab al-Idah fi Manasik al-Hajj wal-'Umra",                 authorAr:"امام يحيى بن شرف النووي",                                        authorEn:"Imam al-Nawawi",                publisher:"", volumes:1,  categoryId:2, status:"available", serial:"F-25", cover:null, pdf:null, descAr:"في أحكام مناسك الحج والعمرة",                             descEn:"On the rites of Hajj and 'Umra.", reviews:[], borrowedBy:null },
  { id:134,titleAr:"احكام الزواج على مذاهب الاربعة",                                   titleEn:"Ahkam al-Zawaj 'ala al-Madhahib al-Arba'a",                  authorAr:"ابو العباس احمد بن عمر الديربي الشافعي",                        authorEn:"Abu al-'Abbas al-Dayribi",      publisher:"", volumes:1,  categoryId:2, status:"available", serial:"F-26", cover:null, pdf:null, descAr:"أحكام الزواج عند المذاهب الأربعة",                        descEn:"Marriage rulings according to the four jurisprudential schools.", reviews:[], borrowedBy:null },
  { id:135,titleAr:"كفاية الاخيار في حل غاية الاختصار",                                titleEn:"Kifayat al-Akhyar fi Hall Ghayat al-Ikhtisar",               authorAr:"امام تقي الدين ابو بكر محمد الحسيني الحصني الدمشقي الشافعي",   authorEn:"Imam al-Husni al-Dimashqi",     publisher:"", volumes:2,  categoryId:2, status:"available", serial:"F-27", cover:null, pdf:null, descAr:"شرح على غاية الاختصار في الفقه الشافعي",                  descEn:"Commentary on Ghayat al-Ikhtisar in Shafi'i fiqh.", reviews:[], borrowedBy:null },
  { id:136,titleAr:"الفوائد المدنية فيمن يفتى بقوله من ائمة الشافعية",                 titleEn:"Al-Fawa'id al-Madaniyya fiman Yufta bi-Qawlih min A'immat al-Shafi'iyya", authorAr:"محمد بن سليمان الكردي المدني الشافعي", authorEn:"Muhammad al-Kurdi al-Madani", publisher:"", volumes:1,  categoryId:2, status:"available", serial:"F-29", cover:null, pdf:null, descAr:"في بيان من يُفتى بقوله من أئمة الشافعية",                 descEn:"On the authoritative voices in Shafi'i legal opinions.", reviews:[], borrowedBy:null },
  { id:137,titleAr:"الفرائض الزينية",                                                   titleEn:"Al-Fara'id al-Zayniyya",                                     authorAr:"ابو الزهرى ميزان بن محمد الباقوي المليباري",                    authorEn:"Abu al-Zuhra Mizan al-Baqawi",  publisher:"", volumes:1,  categoryId:2, status:"available", serial:"F-30", cover:null, pdf:null, descAr:"في علم الفرائض والمواريث",                                descEn:"On the science of Islamic inheritance.", reviews:[], borrowedBy:null },
  { id:138,titleAr:"فقه العبادات",                                                      titleEn:"Fiqh al-'Ibadat",                                            authorAr:"الشيخ محمد بن صالح العثيمين",                                   authorEn:"Shaykh Ibn 'Uthaymin",          publisher:"", volumes:1,  categoryId:2, status:"available", serial:"F-31", cover:null, pdf:null, descAr:"في أحكام العبادات",                                       descEn:"On the rulings of acts of worship.", reviews:[], borrowedBy:null },
  { id:139,titleAr:"مفيد الانام ونور الظلام في تحرير احكام الحج بيت الله الحرام",      titleEn:"Mufid al-Anam wa-Nur al-Zalam fi Tahrir Ahkam al-Hajj",     authorAr:"الشيخ عبد الله بن عبد الرحمن بن جاسر",                         authorEn:"Shaykh 'Abdallah ibn Jasir",    publisher:"", volumes:1,  categoryId:2, status:"available", serial:"F-32", cover:null, pdf:null, descAr:"في أحكام الحج إلى بيت الله الحرام",                       descEn:"On the rulings of pilgrimage to the Sacred House.", reviews:[], borrowedBy:null },
  { id:140,titleAr:"كتاب احكام النساء",                                                 titleEn:"Kitab Ahkam al-Nisa'",                                       authorAr:"ابو الفرج جمال الدين بن جوزي",                                  authorEn:"Ibn al-Jawzi",                  publisher:"", volumes:1,  categoryId:2, status:"available", serial:"F-33", cover:null, pdf:null, descAr:"في الأحكام الفقهية المتعلقة بالنساء",                    descEn:"On jurisprudential rulings concerning women.", reviews:[], borrowedBy:null },
  { id:141,titleAr:"تنشيط المطالعين على حاشية فتح المعين",                             titleEn:"Tanshit al-Mutali'in 'ala Hashiyat Fath al-Mu'in",           authorAr:"الشيخ علي بن الشيخ عبد الرحمن النقشبندي التانوري",              authorEn:"Shaykh 'Ali al-Naqshbandi",     publisher:"", volumes:1,  categoryId:2, status:"available", serial:"F-34", cover:null, pdf:null, descAr:"تعليقات تشجيعية على حاشية فتح المعين",                    descEn:"Encouraging annotations on the gloss of Fath al-Mu'in.", reviews:[], borrowedBy:null },
  { id:142,titleAr:"منظومة في الصور التي يستحب فيها الوضوء",                           titleEn:"Manzuma fi al-Suwar allati Yustahabb fiha al-Wudu'",         authorAr:"حافظ زين الدين العراقي",                                        authorEn:"Hafiz al-'Iraqi",               publisher:"", volumes:1,  categoryId:2, status:"available", serial:"F-35", cover:null, pdf:null, descAr:"منظومة في أحكام الوضوء المستحب",                          descEn:"A poem on the recommended occasions for wudu.", reviews:[], borrowedBy:null },
  { id:143,titleAr:"السنا والسنوت في معرفة ما يتعلق بالقنوت",                          titleEn:"Al-Sana wal-Sanut fi Ma'rifat ma Yata'allaq bil-Qunut",      authorAr:"شمس الدين محمد بن رسول الحسيني البرزنجي الشافعي",               authorEn:"Al-Barzanji al-Shafi'i",        publisher:"", volumes:1,  categoryId:2, status:"available", serial:"F-36", cover:null, pdf:null, descAr:"في أحكام القنوت وما يتعلق به",                           descEn:"On the rulings of qunut supplication.", reviews:[], borrowedBy:null },
  { id:144,titleAr:"معنى قول الامام المطلبي اذا صح الحديث فهو مذهبي",                  titleEn:"Ma'na Qawl al-Imam al-Shafi'i: Idha Sahha al-Hadith fa-Huwa Madhabi", authorAr:"تقي الدين ابو الحسن علي بن عبد الكافي السبكي",        authorEn:"Imam al-Subki",                 publisher:"", volumes:1,  categoryId:2, status:"available", serial:"F-37", cover:null, pdf:null, descAr:"تحقيق قول الإمام الشافعي في اتباع الحديث الصحيح",         descEn:"On Imam al-Shafi'i's statement about following authentic hadiths.", reviews:[], borrowedBy:null },
  { id:145,titleAr:"مختصر الفوائد المكية فيما يحتاجه طلبة الشافعية",                  titleEn:"Mukhtasar al-Fawa'id al-Makkiyya",                           authorAr:"الشيخ علوي بن احمد السقاف الشافعي المكي",                       authorEn:"Shaykh 'Alawi al-Saqqaf al-Makki", publisher:"", volumes:1, categoryId:2, status:"available", serial:"F-38", cover:null, pdf:null, descAr:"مختصر الفوائد المكية لطلبة الشافعية",                     descEn:"Abridgement of al-Fawa'id al-Makkiyya for Shafi'i students.", reviews:[], borrowedBy:null },
  { id:146,titleAr:"الفوائد المكية فيما يحتاجه طلبة الشافعية",                         titleEn:"Al-Fawa'id al-Makkiyya",                                     authorAr:"الشيخ علوي بن احمد السقاف الشافعي المكي",                       authorEn:"Shaykh 'Alawi al-Saqqaf al-Makki", publisher:"", volumes:1, categoryId:2, status:"available", serial:"F-40", cover:null, pdf:null, descAr:"فوائد مكية لطلبة الشافعية في مسائل الفقه",                descEn:"Meccan benefits for Shafi'i students in jurisprudential questions.", reviews:[], borrowedBy:null },
  { id:147,titleAr:"دراسة شهية لمصطلحات المذاهب الاربعة الفقهية",                     titleEn:"Dirasa Shahiyya li-Mustalah al-Madhahib al-Arba'a",          authorAr:"عبد البصير بن سليمان بلاكل الثقافي المليباري",                  authorEn:"'Abd al-Basir al-Malibari",     publisher:"", volumes:1,  categoryId:2, status:"available", serial:"F-41", cover:null, pdf:null, descAr:"دراسة في مصطلحات المذاهب الفقهية الأربعة",               descEn:"A study of the terminology of the four jurisprudential schools.", reviews:[], borrowedBy:null },
  { id:148,titleAr:"تفتيح مسائل الحج والعمرة وزيارة المدينة",                          titleEn:"Taftih Masa'il al-Hajj wal-'Umra wa-Ziyarat al-Madina",      authorAr:"محمد باقوي الفوكوتوري المليباري",                               authorEn:"Muhammad Baqawi al-Malibari",   publisher:"", volumes:1,  categoryId:2, status:"available", serial:"F-42", cover:null, pdf:null, descAr:"في مسائل الحج والعمرة وزيارة المدينة المنورة",           descEn:"On questions of Hajj, 'Umra and visiting al-Madina.", reviews:[], borrowedBy:null },
  { id:149,titleAr:"زيتونة الالقاح شرح منظومة ضوء المصباح في احكام النكاح",            titleEn:"Zaytuna al-Ilqah Sharh Manzuma Daw' al-Misbah fi Ahkam al-Nikah", authorAr:"امام عبد الله بن احمد باسودان",                        authorEn:"Imam 'Abdallah Ba-Sudan",       publisher:"", volumes:1,  categoryId:2, status:"available", serial:"F-43", cover:null, pdf:null, descAr:"شرح منظومة في أحكام النكاح",                              descEn:"Commentary on a poem concerning marriage rulings.", reviews:[], borrowedBy:null },
  { id:150,titleAr:"تذكرة الاخوان في بيان مصطلحات تحفة المحتاج لابن حجر",             titleEn:"Tadhkirat al-Ikhwan fi Bayan Mustalahat Tuhfat al-Muhtaj",   authorAr:"امام محمد بن ابراهيم العليجي القلهاني",                         authorEn:"Imam al-'Aliji al-Qalhani",     publisher:"", volumes:1,  categoryId:2, status:"available", serial:"F-44", cover:null, pdf:null, descAr:"في مصطلحات تحفة المحتاج لابن حجر الهيتمي",              descEn:"On the terminology of Tuhfat al-Muhtaj by Ibn Hajar al-Haytami.", reviews:[], borrowedBy:null },
  { id:151,titleAr:"الفتاوى الحديثية",                                                  titleEn:"Al-Fatawa al-Hadithiyya",                                    authorAr:"احمد شهاب الدين بن حجر الهيتمي المكي",                          authorEn:"Ibn Hajar al-Haytami",          publisher:"", volumes:1,  categoryId:2, status:"available", serial:"F-45", cover:null, pdf:null, descAr:"فتاوى في المسائل الحديثة لابن حجر الهيتمي",              descEn:"Fatwas on contemporary issues by Ibn Hajar al-Haytami.", reviews:[], borrowedBy:null },
  { id:152,titleAr:"فتاوى الامام النووي",                                               titleEn:"Fatawa al-Imam al-Nawawi",                                   authorAr:"امام النووي",                                                   authorEn:"Imam al-Nawawi",                publisher:"", volumes:1,  categoryId:2, status:"available", serial:"F-46", cover:null, pdf:null, descAr:"فتاوى الإمام النووي في المسائل الفقهية",                  descEn:"Legal opinions of Imam al-Nawawi.", reviews:[], borrowedBy:null },
  { id:153,titleAr:"الاشباه والنظائر في قواعد وفروع فقه الشافعية",                    titleEn:"Al-Ashbah wal-Naza'ir fi Qawa'id wa-Furu' Fiqh al-Shafi'iyya", authorAr:"امام جلال الدين عبد الرحمن السيوطي",                     authorEn:"Imam al-Suyuti",                publisher:"", volumes:1,  categoryId:2, status:"available", serial:"F-48", cover:null, pdf:null, descAr:"في القواعد والفروع الفقهية الشافعية",                     descEn:"On Shafi'i jurisprudential principles and branches.", reviews:[], borrowedBy:null },
  { id:154,titleAr:"منهاج الطالبين وعمدة المفتين في الفقه",                            titleEn:"Minhaj al-Talibin wa-'Umdat al-Muftin",                      authorAr:"ابو زكريا يحيى بن شرف النووي",                                  authorEn:"Imam al-Nawawi",                publisher:"", volumes:1,  categoryId:2, status:"available", serial:"F-49", cover:null, pdf:null, descAr:"المتن الفقهي الشافعي المعتمد",                            descEn:"The authoritative Shafi'i jurisprudential text.", reviews:[], borrowedBy:null },
  { id:155,titleAr:"الرسالة",                                                           titleEn:"Al-Risala (2nd copy)",                                       authorAr:"محمد بن ادريس الشافعي",                                         authorEn:"Imam al-Shafi'i",               publisher:"", volumes:1,  categoryId:2, status:"available", serial:"F-50", cover:null, pdf:null, descAr:"نسخة ثانية من الرسالة للإمام الشافعي",                   descEn:"Second copy of al-Risala by Imam al-Shafi'i.", reviews:[], borrowedBy:null },
  { id:156,titleAr:"المقاصد السنية الى موارد الهنية في جمع الفوائد الفقهية",           titleEn:"Al-Maqasid al-Saniyya ila Mawarid al-Haniyya",               authorAr:"الشيخ محمد بن عبد الله بن احمد باسودان المقدادي الكندي",       authorEn:"Shaykh Muhammad Ba-Sudan",      publisher:"", volumes:1,  categoryId:2, status:"available", serial:"F-51", cover:null, pdf:null, descAr:"جمع فوائد فقهية نافعة",                                  descEn:"A compilation of beneficial jurisprudential benefits.", reviews:[], borrowedBy:null },
  { id:157,titleAr:"نهاية الزين في ارشاد المبتدئين شرح على قرة العين بمهمات الدين",   titleEn:"Nihayat al-Zayn fi Irshad al-Mubtadi'in",                   authorAr:"ابو عبد المعطي محمد نووي الجاوي البنتني",                       authorEn:"Imam Nawawi al-Jawi al-Bantani", publisher:"", volumes:1, categoryId:2, status:"available", serial:"F-52", cover:null, pdf:null, descAr:"شرح على قرة العين بمهمات الدين في الفقه الشافعي",         descEn:"Commentary on Qurrat al-'Ayn in Shafi'i jurisprudence.", reviews:[], borrowedBy:null },
  { id:158,titleAr:"بغية المسترشدين في تلخيص فتاوى بعض الائمة من العلماء المتاخرين",  titleEn:"Bughyat al-Mustarshidin fi Talkhis Fatawa Ba'd al-A'imma",  authorAr:"عبد الرحمن بن محمد بن حسين بن عمر",                            authorEn:"'Abd al-Rahman Ba 'Umar",       publisher:"", volumes:1,  categoryId:2, status:"available", serial:"F-53", cover:null, pdf:null, descAr:"تلخيص فتاوى الأئمة المتأخرين",                           descEn:"Summary of fatwas of later jurisprudential authorities.", reviews:[], borrowedBy:null },
  { id:159,titleAr:"اشراق النور التجلي على شرح المنهاج للمحلي",                        titleEn:"Ishraq al-Nur al-Tajalli 'ala Sharh al-Minhaj lil-Mahalli", authorAr:"",                                                              authorEn:"",                              publisher:"", volumes:1,  categoryId:2, status:"available", serial:"F-54", cover:null, pdf:null, descAr:"حاشية على شرح المحلي على منهاج الطالبين",                 descEn:"Gloss on al-Mahalli's commentary on Minhaj al-Talibin.", reviews:[], borrowedBy:null },
  { id:160,titleAr:"صفوة الزبد الفية في فقه الشافعي",                                  titleEn:"Safwat al-Zubd al-Alfiyya fi Fiqh al-Shafi'i",               authorAr:"شهاب الدين احمد بن حسين بن حسن الرملي الشافعي",                 authorEn:"Shihab al-Din al-Ramli al-Shafi'i", publisher:"", volumes:1, categoryId:2, status:"available", serial:"F-56", cover:null, pdf:null, descAr:"ألفية في الفقه الشافعي",                                  descEn:"A thousand-verse poem in Shafi'i jurisprudence.", reviews:[], borrowedBy:null },
  { id:161,titleAr:"الكافي في فقه الامام احمد بن حنبل",                                titleEn:"Al-Kafi fi Fiqh al-Imam Ahmad ibn Hanbal (Fiqh copy)",      authorAr:"ابو محمد موفق الدين عبد الله بن قدامة المقدسي",                authorEn:"Ibn Qudama al-Maqdisi",         publisher:"", volumes:4,  categoryId:2, status:"available", serial:"F-57", cover:null, pdf:null, descAr:"مرجع في الفقه الحنبلي لابن قدامة",                        descEn:"A Hanbali jurisprudence reference by Ibn Qudama.", reviews:[], borrowedBy:null },
  { id:162,titleAr:"الالمام بمسائل الاعلام بقواطع الاسلام",                            titleEn:"Al-Ilmam bi-Masa'il al-I'lam bi-Qawati' al-Islam",          authorAr:"امام الشيخ احمد بن عبد الرزاق المغربي الرشيدي الشافعي",        authorEn:"Imam Ahmad al-Rashidi al-Shafi'i", publisher:"", volumes:1, categoryId:2, status:"available", serial:"F-58", cover:null, pdf:null, descAr:"في مسائل النواقض والمكفرات الشرعية",                      descEn:"On the invalidators of Islam and their jurisprudential rulings.", reviews:[], borrowedBy:null },
  // ── النحو ──
  { id:163,titleAr:"تدريب الطلاب في صناعة الاعراب",               titleEn:"Tadrib al-Tullab fi Sina'at al-I'rab",               authorAr:"محمد بن ابي بكر الاحسني الكودوري المليباري",      authorEn:"Muhammad al-Kuduri al-Malibari",    publisher:"", volumes:1, categoryId:9, status:"available", serial:"N-1",  cover:null, pdf:null, descAr:"في تعليم صناعة الإعراب للمبتدئين",          descEn:"Teaching the craft of grammatical analysis.", reviews:[], borrowedBy:null },
  { id:164,titleAr:"شرح قطر الندى وبل الصدى",                     titleEn:"Sharh Qatr al-Nada wa-Ball al-Sada",                 authorAr:"عبد الله جمال الدين ابن هشام الأنصاري",            authorEn:"Ibn Hisham al-Ansari",              publisher:"", volumes:1, categoryId:9, status:"available", serial:"N-2",  cover:null, pdf:null, descAr:"شرح قطر الندى في النحو العربي",              descEn:"Commentary on Qatr al-Nada in Arabic grammar.", reviews:[], borrowedBy:null },
  { id:165,titleAr:"حاشية على شرح تحفة الوردية",                  titleEn:"Hashiya 'ala Sharh Tuhfat al-Wardiyya",              authorAr:"",                                                  authorEn:"",                                  publisher:"", volumes:1, categoryId:9, status:"available", serial:"N-3",  cover:null, pdf:null, descAr:"حاشية على شرح تحفة الوردية في النحو",       descEn:"Gloss on the commentary of Tuhfat al-Wardiyya.", reviews:[], borrowedBy:null },
  { id:166,titleAr:"شرح الفواكه الجنية على متممة الآجرومية",       titleEn:"Sharh al-Fawakihal-Janiyya 'ala Mutammim al-Ajurrumiyya", authorAr:"عبد الله بن أحمد الفاكهي",               authorEn:"'Abdallah al-Fakkihi",              publisher:"", volumes:1, categoryId:9, status:"available", serial:"N-4",  cover:null, pdf:null, descAr:"شرح على متممة الآجرومية في النحو",            descEn:"Commentary on the supplement to al-Ajurrumiyya.", reviews:[], borrowedBy:null },
  { id:167,titleAr:"حاشية على متن الآجرومية في قواعد العربية",     titleEn:"Hashiya 'ala Matn al-Ajurrumiyya fi Qawa'id al-'Arabiyya", authorAr:"الشيخ عبد الله العشماوي",              authorEn:"Shaykh 'Abdallah al-'Ashmawi",      publisher:"", volumes:1, categoryId:9, status:"available", serial:"N-5",  cover:null, pdf:null, descAr:"حاشية على متن الآجرومية في قواعد العربية",   descEn:"Gloss on al-Ajurrumiyya in Arabic grammatical rules.", reviews:[], borrowedBy:null },
  { id:168,titleAr:"شرح مختصر جدا على متن الآجرومية",              titleEn:"Sharh Mukhtasar Jiddan 'ala Matn al-Ajurrumiyya",    authorAr:"الشيخ أحمد زيني دحلان",                           authorEn:"Shaykh Ahmad Zayni Dahlan",          publisher:"", volumes:1, categoryId:9, status:"available", serial:"N-6",  cover:null, pdf:null, descAr:"شرح مختصر على الآجرومية",                    descEn:"A very brief commentary on al-Ajurrumiyya.", reviews:[], borrowedBy:null },
  { id:169,titleAr:"جامع الدروس العربية",                          titleEn:"Jami' al-Durus al-'Arabiyya",                        authorAr:"الشيخ مصطفى الغلاييني",                            authorEn:"Shaykh Mustafa al-Ghalayini",        publisher:"", volumes:3, categoryId:9, status:"available", serial:"N-7",  cover:null, pdf:null, descAr:"موسوعة في قواعد اللغة العربية",              descEn:"An encyclopaedia of Arabic language rules.", reviews:[], borrowedBy:null },
  { id:170,titleAr:"أوضح المسالك إلى ألفية ابن مالك",             titleEn:"Awdah al-Masalik ila Alfiyyat Ibn Malik",            authorAr:"عبد الله جمال الدين ابن هشام الأنصاري",            authorEn:"Ibn Hisham al-Ansari",              publisher:"", volumes:4, categoryId:9, status:"available", serial:"N-8",  cover:null, pdf:null, descAr:"شرح على ألفية ابن مالك في النحو",            descEn:"Commentary on Ibn Malik's Alfiyya in grammar.", reviews:[], borrowedBy:null },
  { id:171,titleAr:"تلميح الفوائد النحوية في بيان الحواشي الألفية", titleEn:"Talmih al-Fawa'id al-Nahwiyya fi Bayan al-Hawashi al-Alfiyya", authorAr:"ابن محمد القادري المليباري",          authorEn:"Ibn Muhammad al-Qadiri al-Malibari", publisher:"", volumes:1, categoryId:9, status:"available", serial:"N-9",  cover:null, pdf:null, descAr:"في شرح الحواشي على ألفية ابن مالك",          descEn:"Explaining the glosses on Ibn Malik's Alfiyya.", reviews:[], borrowedBy:null },
  { id:172,titleAr:"حاشية السجاعي على القطر",                      titleEn:"Hashiyat al-Suja'i 'ala al-Qatr",                    authorAr:"العلامة السجاعي",                                  authorEn:"Al-'Allama al-Suja'i",              publisher:"", volumes:1, categoryId:9, status:"available", serial:"N-10", cover:null, pdf:null, descAr:"حاشية السجاعي على شرح القطر في النحو",       descEn:"Al-Suja'i's gloss on Qatr al-Nada.", reviews:[], borrowedBy:null },
  { id:173,titleAr:"حاشية شرح القطر في علم النحو",                 titleEn:"Hashiyat Sharh al-Qatr fi 'Ilm al-Nahw",             authorAr:"محمود الآلوسي",                                    authorEn:"Mahmud al-Alusi",                   publisher:"", volumes:1, categoryId:9, status:"available", serial:"N-11", cover:null, pdf:null, descAr:"حاشية على شرح القطر في علم النحو",           descEn:"Gloss on the commentary of Qatr al-Nada in grammar.", reviews:[], borrowedBy:null },
  { id:174,titleAr:"شرح العلامة الكفراوي على متن الاجرومي",        titleEn:"Sharh al-Kafrawı 'ala Matn al-Ajurrumi",             authorAr:"العلامة الكفراوي",                                 authorEn:"Al-'Allama al-Kafrawi",             publisher:"", volumes:1, categoryId:9, status:"available", serial:"N-13", cover:null, pdf:null, descAr:"شرح الكفراوي على متن الآجرومية",              descEn:"Al-Kafrawi's commentary on al-Ajurrumiyya.", reviews:[], borrowedBy:null },
  { id:175,titleAr:"ابتهاج العين بشرح شواهد خلاصة الالفية",        titleEn:"Ibtihaj al-'Ayn bi-Sharh Shawahid Khulasat al-Alfiyya", authorAr:"محمد باقوي",                             authorEn:"Muhammad Baqawi",                   publisher:"", volumes:1, categoryId:9, status:"available", serial:"N-14", cover:null, pdf:null, descAr:"شرح شواهد خلاصة الألفية في النحو",           descEn:"Commentary on the examples in the summary of the Alfiyya.", reviews:[], borrowedBy:null },
  { id:176,titleAr:"شرح التصريح على التوضيح",                      titleEn:"Sharh al-Tasrih 'ala al-Tawdih",                     authorAr:"الشيخ خالد الأزهري",                               authorEn:"Shaykh Khalid al-Azhari",           publisher:"", volumes:2, categoryId:9, status:"available", serial:"N-15", cover:null, pdf:null, descAr:"شرح التصريح على ألفية ابن مالك",              descEn:"Al-Tasrih commentary on Ibn Malik's Alfiyya.", reviews:[], borrowedBy:null },
  { id:177,titleAr:"شرح المكودي على الألفية",                      titleEn:"Sharh al-Makudi 'ala al-Alfiyya",                    authorAr:"عبد الرحمن بن صالح المكودي",                       authorEn:"'Abd al-Rahman al-Makudi",          publisher:"", volumes:1, categoryId:9, status:"available", serial:"N-16", cover:null, pdf:null, descAr:"شرح المكودي على ألفية ابن مالك",              descEn:"Al-Makudi's commentary on Ibn Malik's Alfiyya.", reviews:[], borrowedBy:null },
  { id:178,titleAr:"شرح ابن عقيل على الألفية",                     titleEn:"Sharh Ibn 'Aqil 'ala al-Alfiyya",                    authorAr:"بهاء الدين عبد الله ابن عقيل",                     authorEn:"Baha' al-Din Ibn 'Aqil",            publisher:"", volumes:2, categoryId:9, status:"available", serial:"N-17", cover:null, pdf:null, descAr:"من أشهر شروح ألفية ابن مالك",                descEn:"One of the most celebrated commentaries on Ibn Malik's Alfiyya.", reviews:[], borrowedBy:null },
  { id:179,titleAr:"حاشية يس على شرح قطر الندى",                   titleEn:"Hashiyat Yasin 'ala Sharh Qatr al-Nada",             authorAr:"العلامة يس بن زين الدين العليمي الحمصي",           authorEn:"Yasin al-'Alimi al-Himsi",          publisher:"", volumes:1, categoryId:9, status:"available", serial:"N-18", cover:null, pdf:null, descAr:"حاشية يس على شرح قطر الندى لابن هشام",       descEn:"Yasin's gloss on Ibn Hisham's commentary of Qatr al-Nada.", reviews:[], borrowedBy:null },
  { id:180,titleAr:"تسهيل شرح ابن عقيل على الألفية",               titleEn:"Tashil Sharh Ibn 'Aqil 'ala al-Alfiyya",             authorAr:"بهاء الدين عبد الله ابن عقيل",                     authorEn:"Baha' al-Din Ibn 'Aqil",            publisher:"", volumes:1, categoryId:9, status:"available", serial:"N-19", cover:null, pdf:null, descAr:"تيسير شرح ابن عقيل على ألفية ابن مالك",       descEn:"Simplified edition of Ibn 'Aqil's commentary.", reviews:[], borrowedBy:null },
  { id:181,titleAr:"حاشية الخضري على شرح ابن عقيل على الألفية",   titleEn:"Hashiyat al-Khudari 'ala Sharh Ibn 'Aqil",           authorAr:"محمد بن مصطفى الخضري",                             authorEn:"Muhammad al-Khudari",               publisher:"", volumes:2, categoryId:9, status:"available", serial:"N-20", cover:null, pdf:null, descAr:"حاشية الخضري على شرح ابن عقيل",              descEn:"Al-Khudari's gloss on Ibn 'Aqil's commentary.", reviews:[], borrowedBy:null },
  { id:182,titleAr:"حاشية الصبان على شرح الأشموني على ألفية ابن مالك", titleEn:"Hashiyat al-Sabban 'ala Sharh al-Ashmuni",      authorAr:"محمد بن علي الصبان",                               authorEn:"Muhammad al-Sabban",                publisher:"", volumes:4, categoryId:9, status:"available", serial:"N-21", cover:null, pdf:null, descAr:"حاشية الصبان على شرح الأشموني على الألفية",   descEn:"Al-Sabban's gloss on al-Ashmuni's commentary on the Alfiyya.", reviews:[], borrowedBy:null },
  { id:183,titleAr:"إظهار الأجناس للأناس",                         titleEn:"Izhar al-Ajnas lil-Anas",                            authorAr:"محمد الباقوي",                                     authorEn:"Muhammad al-Baqawi",                publisher:"", volumes:1, categoryId:9, status:"available", serial:"N-22", cover:null, pdf:null, descAr:"في علم الصرف والأجناس النحوية",               descEn:"On Arabic morphology and grammatical genders.", reviews:[], borrowedBy:null },
  { id:184,titleAr:"قلائد الجمان في نظم عوامل عالم جرجان",         titleEn:"Qala'id al-Juman fi Nazm 'Awamil 'Alam Jurjan",      authorAr:"محمد علي بن محمد علان الصديقي",                   authorEn:"Muhammad 'Allan al-Siddiqi",        publisher:"", volumes:1, categoryId:9, status:"available", serial:"N-23", cover:null, pdf:null, descAr:"نظم لعوامل الجرجاني في النحو",                descEn:"A versification of al-Jurjani's grammatical agents.", reviews:[], borrowedBy:null },
  { id:185,titleAr:"مراح وعزى ومقصود وبنا وأمثلة",                 titleEn:"Marah wa-'Uzza wa-Maqsud wa-Bina wa-Amthila",        authorAr:"أحمد بن علي استابنولي",                            authorEn:"Ahmad ibn 'Ali al-Istanbuli",        publisher:"", volumes:1, categoryId:9, status:"available", serial:"N-24", cover:null, pdf:null, descAr:"متون في الصرف والنحو",                        descEn:"Texts on morphology and grammar.", reviews:[], borrowedBy:null },
  { id:186,titleAr:"العوامل المئة النحوية في أصول علم العربية",    titleEn:"Al-'Awamil al-Mi'a al-Nahwiyya fi Usul 'Ilm al-'Arabiyya", authorAr:"عبد القاهر الجرجاني",                    authorEn:"'Abd al-Qahir al-Jurjani",          publisher:"", volumes:1, categoryId:9, status:"available", serial:"N-26", cover:null, pdf:null, descAr:"مئة عامل نحوي لعبد القاهر الجرجاني",          descEn:"The hundred grammatical agents by al-Jurjani.", reviews:[], borrowedBy:null },
  { id:187,titleAr:"تدريب الطلاب في صناعة الاعراب",                titleEn:"Tadrib al-Tullab fi Sina'at al-I'rab (2nd copy)",    authorAr:"محمد بن ابي بكر الاحسني الكودوري المليباري",      authorEn:"Muhammad al-Kuduri al-Malibari",    publisher:"", volumes:1, categoryId:9, status:"available", serial:"N-27", cover:null, pdf:null, descAr:"نسخة ثانية من تدريب الطلاب في صناعة الإعراب", descEn:"Second copy of Tadrib al-Tullab.", reviews:[], borrowedBy:null },
  { id:188,titleAr:"الالغاز النحوية",                               titleEn:"Al-Alghaz al-Nahwiyya",                              authorAr:"ابن هشام وخالد الازهري والسيوطي",                  authorEn:"Ibn Hisham, Khalid al-Azhari & al-Suyuti", publisher:"", volumes:1, categoryId:9, status:"available", serial:"N-28", cover:null, pdf:null, descAr:"ألغاز وأحاجي في علم النحو",                  descEn:"Riddles and puzzles in the science of grammar.", reviews:[], borrowedBy:null },
  { id:189,titleAr:"شرح السعد على تصريف الزنجاني",                  titleEn:"Sharh al-Sa'd 'ala Tasrif al-Zanjani",               authorAr:"سعد الدين التفتازاني",                             authorEn:"Sa'd al-Din al-Taftazani",          publisher:"", volumes:1, categoryId:9, status:"available", serial:"N-29", cover:null, pdf:null, descAr:"شرح على تصريف الزنجاني في علم الصرف",        descEn:"Commentary on al-Zanjani's work on Arabic morphology.", reviews:[], borrowedBy:null },
  { id:190,titleAr:"فلاح شرح المراح",                               titleEn:"Falah Sharh al-Marah",                               authorAr:"أحمد بن سليمان بن كمال باشا",                      authorEn:"Ahmad ibn Kamal Basha",             publisher:"", volumes:1, categoryId:9, status:"available", serial:"N-30", cover:null, pdf:null, descAr:"شرح على المراح في علم الصرف",                descEn:"Commentary on al-Marah in Arabic morphology.", reviews:[], borrowedBy:null },
  // ── التاريخ الإسلامي ──
  { id:191,titleAr:"صفة الصفوة",                                                     titleEn:"Safwat al-Safwa",                                              authorAr:"امام ابن الجوزي",                                        authorEn:"Ibn al-Jawzi",                      publisher:"", volumes:4, categoryId:1, status:"available", serial:"TH-1",  cover:null, pdf:null, descAr:"في أخبار الأنبياء والأولياء والصالحين",             descEn:"On the lives of prophets, saints and righteous people.", reviews:[], borrowedBy:null },
  { id:192,titleAr:"جامع كرامات الأولياء",                                           titleEn:"Jami' Karamat al-Awliya'",                                     authorAr:"يوسف بن إسماعيل النبهاني",                              authorEn:"Yusuf al-Nabhani",                  publisher:"", volumes:2, categoryId:1, status:"available", serial:"TH-2",  cover:null, pdf:null, descAr:"جامع في كرامات الأولياء وأخبارهم",                  descEn:"A comprehensive work on the miracles of the saints.", reviews:[], borrowedBy:null },
  { id:193,titleAr:"اللباب في تهذيب الأنساب",                                        titleEn:"Al-Lubab fi Tahdhib al-Ansab",                                 authorAr:"ابن الأثير الجزري",                                     authorEn:"Ibn al-Athir al-Jazari",            publisher:"", volumes:3, categoryId:1, status:"available", serial:"TH-3",  cover:null, pdf:null, descAr:"في علم الأنساب وتهذيبها",                           descEn:"On the science of genealogy and lineage.", reviews:[], borrowedBy:null },
  { id:194,titleAr:"البداية والنهاية",                                                titleEn:"Al-Bidaya wan-Nihaya",                                         authorAr:"ابن كثير اسماعيل الدمشقي",                             authorEn:"Ibn Kathir al-Dimashqi",            publisher:"", volumes:14,categoryId:1, status:"available", serial:"TH-4",  cover:null, pdf:null, descAr:"موسوعة تاريخية إسلامية شاملة من بدء الخلق",         descEn:"A comprehensive Islamic historical encyclopedia.", reviews:[], borrowedBy:null },
  { id:195,titleAr:"قلائد الجواهر في مناقب عبد القادر الجيلاني",                    titleEn:"Qala'id al-Jawahir fi Manaqib 'Abd al-Qadir al-Jilani",        authorAr:"محمد بن يحيى التاذفي الحنبلي",                         authorEn:"Muhammad al-Tadhafi al-Hanbali",   publisher:"", volumes:1, categoryId:1, status:"available", serial:"TH-5",  cover:null, pdf:null, descAr:"في مناقب الشيخ عبد القادر الجيلاني",                descEn:"On the virtues of Shaykh 'Abd al-Qadir al-Jilani.", reviews:[], borrowedBy:null },
  { id:196,titleAr:"بهجة الأسرار ومعدن الأنوار في مناقب عبد القادر الجيلاني",       titleEn:"Bahjat al-Asrar wa-Ma'dan al-Anwar fi Manaqib 'Abd al-Qadir", authorAr:"نور الدين أبو الحسن الشطنوفي",                         authorEn:"Nur al-Din al-Shatnufi",           publisher:"", volumes:1, categoryId:1, status:"available", serial:"TH-6",  cover:null, pdf:null, descAr:"في مناقب وكرامات الشيخ عبد القادر الجيلاني",        descEn:"Virtues and miracles of Shaykh 'Abd al-Qadir al-Jilani.", reviews:[], borrowedBy:null },
  { id:197,titleAr:"المهمة في بيان الأئمة المذكورين في فتح المعين",                  titleEn:"Al-Muhimma fi Bayan al-A'imma al-Madhkurin fi Fath al-Mu'in", authorAr:"كي كي كنح علي مسليار المليباري",                       authorEn:"Kee Kee Kanah 'Ali Musliyar al-Malibari", publisher:"", volumes:1, categoryId:1, status:"available", serial:"TH-7",  cover:null, pdf:null, descAr:"في بيان الأئمة الوارد ذكرهم في فتح المعين",          descEn:"Identifying the scholars mentioned in Fath al-Mu'in.", reviews:[], borrowedBy:null },
  { id:198,titleAr:"خليل الله إبراهيم عليه السلام",                                  titleEn:"Khalil Allah Ibrahim 'Alayhi al-Salam",                       authorAr:"الشيخ عبد الرحمن باوا بن محمد المليباري",              authorEn:"Shaykh 'Abd al-Rahman Bawa al-Malibari", publisher:"", volumes:1, categoryId:1, status:"available", serial:"TH-8",  cover:null, pdf:null, descAr:"في سيرة وقصة إبراهيم عليه السلام",                  descEn:"On the life and story of Ibrahim (AS).", reviews:[], borrowedBy:null },
  { id:199,titleAr:"١٠٠ قصة وقصة من حياة عمر بن الخطاب رضي الله عنه",               titleEn:"100 Stories from the Life of 'Umar ibn al-Khattab",           authorAr:"محمد صديق المنشاوي",                                   authorEn:"Muhammad Siddiq al-Minshawi",      publisher:"", volumes:1, categoryId:1, status:"available", serial:"TH-10", cover:null, pdf:null, descAr:"مئة قصة من حياة الفاروق عمر بن الخطاب",             descEn:"One hundred stories from the life of 'Umar ibn al-Khattab.", reviews:[], borrowedBy:null },
  { id:200,titleAr:"١٠٠ قصة وقصة من حياة عثمان بن عفان رضي الله عنه",               titleEn:"100 Stories from the Life of 'Uthman ibn 'Affan",             authorAr:"محمد صديق المنشاوي",                                   authorEn:"Muhammad Siddiq al-Minshawi",      publisher:"", volumes:1, categoryId:1, status:"available", serial:"TH-11", cover:null, pdf:null, descAr:"مئة قصة من حياة ذي النورين عثمان بن عفان",           descEn:"One hundred stories from the life of 'Uthman ibn 'Affan.", reviews:[], borrowedBy:null },
  { id:201,titleAr:"إمام المحدثين محمد بن إسماعيل البخاري رحمه الله",                titleEn:"Imam al-Muhaddithin Muhammad ibn Isma'il al-Bukhari",         authorAr:"الشيخ عبد الرحمن باوا بن محمد المليباري",              authorEn:"Shaykh 'Abd al-Rahman Bawa al-Malibari", publisher:"", volumes:1, categoryId:1, status:"available", serial:"TH-12", cover:null, pdf:null, descAr:"ترجمة حياة الإمام البخاري",                           descEn:"A biography of Imam al-Bukhari.", reviews:[], borrowedBy:null },
  { id:202,titleAr:"١٠٠ قصة وقصة من حياة علي بن أبي طالب رضي الله عنه",             titleEn:"100 Stories from the Life of 'Ali ibn Abi Talib",             authorAr:"محمد صديق المنشاوي",                                   authorEn:"Muhammad Siddiq al-Minshawi",      publisher:"", volumes:1, categoryId:1, status:"available", serial:"TH-13", cover:null, pdf:null, descAr:"مئة قصة من حياة أمير المؤمنين علي بن أبي طالب",       descEn:"One hundred stories from the life of 'Ali ibn Abi Talib.", reviews:[], borrowedBy:null },
  { id:203,titleAr:"الإمام البخاري رحمه الله",                                        titleEn:"Al-Imam al-Bukhari",                                           authorAr:"الشيخ أبو عائشة محمد الباقوي",                         authorEn:"Shaykh Abu 'A'isha Muhammad al-Baqawi", publisher:"", volumes:1, categoryId:1, status:"available", serial:"TH-14", cover:null, pdf:null, descAr:"في سيرة الإمام البخاري ومناقبه",                      descEn:"On the life and virtues of Imam al-Bukhari.", reviews:[], borrowedBy:null },
  { id:204,titleAr:"العقد الفريد المختصر من الأثبات والأسانيد",                       titleEn:"Al-'Iqd al-Farid al-Mukhtasar min al-Athbat wal-Asanid",      authorAr:"محمد بن علوي المالكي الحسني",                          authorEn:"Muhammad al-Maliki al-Hasani",     publisher:"", volumes:1, categoryId:1, status:"available", serial:"TH-17", cover:null, pdf:null, descAr:"مختصر في الأثبات والأسانيد العلمية",                  descEn:"An abridgement of scholarly chains of transmission.", reviews:[], borrowedBy:null },
  { id:205,titleAr:"الطبقات الصغرى",                                                  titleEn:"Al-Tabaqat al-Sughra",                                         authorAr:"إمام عبد الوهاب الشعراني",                             authorEn:"Imam 'Abd al-Wahhab al-Sha'rani",  publisher:"", volumes:1, categoryId:1, status:"available", serial:"TH-19", cover:null, pdf:null, descAr:"طبقات الأولياء والصالحين الصغرى",                    descEn:"The minor classes of saints and righteous scholars.", reviews:[], borrowedBy:null },
  { id:206,titleAr:"رحلة ابن بطوطة",                                                  titleEn:"Rihla Ibn Battuta",                                            authorAr:"ابن بطوطة",                                            authorEn:"Ibn Battuta",                       publisher:"", volumes:2, categoryId:1, status:"available", serial:"TH-20", cover:null, pdf:null, descAr:"رحلة ابن بطوطة الشهيرة في العالم الإسلامي",           descEn:"The celebrated travels of Ibn Battuta.", reviews:[], borrowedBy:null },
  { id:207,titleAr:"الطبقات الكبرى",                                                  titleEn:"Al-Tabaqat al-Kubra",                                          authorAr:"محمد بن سعد البصري",                                   authorEn:"Muhammad ibn Sa'd al-Basri",        publisher:"", volumes:8, categoryId:1, status:"available", serial:"TH-21", cover:null, pdf:null, descAr:"الطبقات الكبرى للصحابة والتابعين",                   descEn:"The major biographical dictionary of Companions and Successors.", reviews:[], borrowedBy:null },
  { id:208,titleAr:"الإصابة في تمييز الصحابة",                                        titleEn:"Al-Isaba fi Tamyiz al-Sahaba",                                 authorAr:"ابن حجر العسقلاني",                                    authorEn:"Ibn Hajar al-'Asqalani",            publisher:"", volumes:8, categoryId:1, status:"available", serial:"TH-22", cover:null, pdf:null, descAr:"في تمييز الصحابة والتعريف بهم",                       descEn:"Identifying and profiling the Companions of the Prophet.", reviews:[], borrowedBy:null },
  { id:209,titleAr:"روض الرياحين في حكايات الصالحين",                                 titleEn:"Rawd al-Rayahin fi Hikayat al-Salihin",                        authorAr:"عبد الله بن أسعد اليافعي",                             authorEn:"'Abdallah al-Yafi'i",               publisher:"", volumes:1, categoryId:1, status:"available", serial:"TH-23", cover:null, pdf:null, descAr:"حكايات وأخبار الصالحين",                              descEn:"Stories and accounts of the righteous.", reviews:[], borrowedBy:null },
  { id:210,titleAr:"النبوة والأنبياء",                                                 titleEn:"Al-Nubuwwa wal-Anbiya'",                                       authorAr:"محمد علي الصابوني",                                    authorEn:"Muhammad 'Ali al-Sabuni",           publisher:"", volumes:1, categoryId:1, status:"available", serial:"TH-24", cover:null, pdf:null, descAr:"في إثبات النبوة وأخبار الأنبياء",                     descEn:"On prophethood and the stories of the prophets.", reviews:[], borrowedBy:null },
  { id:211,titleAr:"تاريخ الخلفاء",                                                   titleEn:"Tarikh al-Khulafa'",                                           authorAr:"إمام جلال الدين عبد الرحمن السيوطي",                   authorEn:"Imam al-Suyuti",                    publisher:"", volumes:1, categoryId:1, status:"available", serial:"TH-25", cover:null, pdf:null, descAr:"في تواريخ خلفاء الإسلام",                             descEn:"History of the Islamic caliphs.", reviews:[], borrowedBy:null },
  { id:212,titleAr:"مقدمة العلامة ابن خلدون",                                         titleEn:"Muqaddimat Ibn Khaldun",                                       authorAr:"عبد الرحمن بن خلدون",                                  authorEn:"'Abd al-Rahman ibn Khaldun",        publisher:"", volumes:1, categoryId:1, status:"available", serial:"TH-27", cover:null, pdf:null, descAr:"مقدمة ابن خلدون في فلسفة التاريخ والاجتماع",          descEn:"Ibn Khaldun's famous introduction to history and sociology.", reviews:[], borrowedBy:null },
  { id:213,titleAr:"مناقب الأئمة الأربعة رضي الله عنهم",                              titleEn:"Manaqib al-A'imma al-Arba'a",                                  authorAr:"محمد بن أحمد المقدسي الحنبلي",                         authorEn:"Muhammad al-Maqdisi al-Hanbali",   publisher:"", volumes:1, categoryId:1, status:"available", serial:"TH-28", cover:null, pdf:null, descAr:"في مناقب الأئمة الأربعة الكرام",                      descEn:"On the virtues of the four great imams.", reviews:[], borrowedBy:null },
  { id:214,titleAr:"المعين على معرفة الرجال المذكورين في الأربعين للنووي",             titleEn:"Al-Mu'in 'ala Ma'rifat al-Rijal al-Madhkurin fi al-Arba'in",  authorAr:"محمد علي بن علان البكري",                              authorEn:"Muhammad 'Allan al-Bakri",          publisher:"", volumes:1, categoryId:1, status:"available", serial:"TH-29", cover:null, pdf:null, descAr:"في التعريف بالرجال الواردين في الأربعين النووية",       descEn:"Identifying the narrators mentioned in al-Nawawi's Forty Hadiths.", reviews:[], borrowedBy:null },
  { id:215,titleAr:"طبقات الشافعية الكبرى",                                           titleEn:"Tabaqat al-Shafi'iyya al-Kubra",                               authorAr:"إمام تاج الدين السبكي",                                authorEn:"Imam Taj al-Din al-Subki",          publisher:"", volumes:10,categoryId:1, status:"available", serial:"TH-30", cover:null, pdf:null, descAr:"الموسوعة الكبرى في تراجم علماء الشافعية",              descEn:"The major encyclopaedia of Shafi'i scholars.", reviews:[], borrowedBy:null },
  { id:216,titleAr:"الخيرات الحسان في مناقب الإمام الأعظم أبي حنيفة النعمان",         titleEn:"Al-Khayrat al-Hisan fi Manaqib al-Imam al-A'zam Abi Hanifa",  authorAr:"إمام أحمد بن حجر الهيتمي",                            authorEn:"Imam Ibn Hajar al-Haytami",         publisher:"", volumes:1, categoryId:1, status:"available", serial:"TH-31", cover:null, pdf:null, descAr:"في مناقب الإمام أبي حنيفة النعمان",                   descEn:"On the virtues of Imam Abu Hanifa al-Nu'man.", reviews:[], borrowedBy:null },
  { id:217,titleAr:"تحفة الطالبين في ترجمة الإمام محيي الدين",                        titleEn:"Tuhfat al-Talibin fi Tarjama al-Imam Muhyi al-Din",            authorAr:"علاء الدين علي بن إبراهيم بن العطار",                  authorEn:"'Ala' al-Din Ibn al-'Attar",        publisher:"", volumes:1, categoryId:1, status:"available", serial:"TH-32", cover:null, pdf:null, descAr:"في ترجمة الإمام النووي محيي الدين",                    descEn:"Biography of Imam al-Nawawi Muhyi al-Din.", reviews:[], borrowedBy:null },
  { id:218,titleAr:"عقد الجواهر والدرر في أخبار القرن الحادي عشر",                    titleEn:"'Iqd al-Jawahir wal-Durar fi Akhbar al-Qarn al-Hadi 'Ashar",  authorAr:"محمد بن أبي بكر بن أحمد الشلي باعلوي",                authorEn:"Muhammad al-Shilli Ba'alawi",       publisher:"", volumes:2, categoryId:1, status:"available", serial:"TH-33", cover:null, pdf:null, descAr:"في أخبار أعلام القرن الحادي عشر الهجري",               descEn:"On the notable figures of the 11th Hijri century.", reviews:[], borrowedBy:null },
  { id:219,titleAr:"مناقب الإمام سفيان بن سعيد بن مسروق الثوري",                     titleEn:"Manaqib al-Imam Sufyan al-Thawri",                             authorAr:"الحافظ شمس الدين محمد بن أحمد بن عثمان الذهبي",        authorEn:"Imam al-Dhahabi",                   publisher:"", volumes:1, categoryId:1, status:"available", serial:"TH-34", cover:null, pdf:null, descAr:"في مناقب الإمام سفيان الثوري",                        descEn:"On the virtues of Imam Sufyan al-Thawri.", reviews:[], borrowedBy:null },
  { id:220,titleAr:"مناقب معروف الكرخي وأخباره",                                      titleEn:"Manaqib Ma'ruf al-Karkhi wa-Akhbaruhu",                        authorAr:"عبد الرحمن بن علي بن محمد ابن الجوزي",                 authorEn:"Ibn al-Jawzi",                      publisher:"", volumes:1, categoryId:1, status:"available", serial:"TH-35", cover:null, pdf:null, descAr:"في مناقب وأخبار معروف الكرخي",                        descEn:"On the virtues and accounts of Ma'ruf al-Karkhi.", reviews:[], borrowedBy:null },
  { id:221,titleAr:"ترجمة الإمام جمال الدين عبد الرحيم بن الحسن الإسنوي الشافعي",    titleEn:"Tarjamat al-Imam al-Isnawi al-Shafi'i",                        authorAr:"زين الدين عبد الرحيم بن الحسين العراقي الشافعي",       authorEn:"Zayn al-Din al-'Iraqi al-Shafi'i",  publisher:"", volumes:1, categoryId:1, status:"available", serial:"TH-36", cover:null, pdf:null, descAr:"في ترجمة الإمام الإسنوي الشافعي",                     descEn:"Biography of Imam al-Isnawi al-Shafi'i.", reviews:[], borrowedBy:null },
  { id:222,titleAr:"بغية الراوي في ترجمة الإمام النووي",                               titleEn:"Bughyat al-Rawi fi Tarjamat al-Imam al-Nawawi",                authorAr:"إمام أبو عبد الله محمد بن محمد الشافعي",               authorEn:"Imam Abu 'Abdallah Muhammad al-Shafi'i", publisher:"", volumes:1, categoryId:1, status:"available", serial:"TH-37", cover:null, pdf:null, descAr:"في ترجمة وسيرة الإمام النووي",                         descEn:"Biography of Imam al-Nawawi.", reviews:[], borrowedBy:null },
  { id:223,titleAr:"المنهل العذب في ترجمة القطب الأولياء النووي",                     titleEn:"Al-Manhal al-'Adhb fi Tarjamat al-Nawawi",                     authorAr:"إمام الحافظ شمس الدين محمد بن عبد الرحمن السخاوي",     authorEn:"Imam al-Sakhawi",                   publisher:"", volumes:1, categoryId:1, status:"available", serial:"TH-38", cover:null, pdf:null, descAr:"ترجمة الإمام النووي للحافظ السخاوي",                   descEn:"Al-Sakhawi's biography of Imam al-Nawawi.", reviews:[], borrowedBy:null },
  { id:224,titleAr:"حكايات في مدح الشهداء الملفوميين",                                 titleEn:"Hikayat fi Madh al-Shuhada' al-Malfumin",                      authorAr:"محمد الباقوي الفوكوتوري المليباري",                    authorEn:"Muhammad al-Baqawi al-Malibari",    publisher:"", volumes:1, categoryId:1, status:"available", serial:"TH-41", cover:null, pdf:null, descAr:"في مدح الشهداء من أبناء المليبار",                    descEn:"In praise of the martyrs of Malabar.", reviews:[], borrowedBy:null },
  { id:225,titleAr:"تراجم علماء الأمة من المحدثين",                                   titleEn:"Tarajim 'Ulama' al-Umma min al-Muhaddithin",                   authorAr:"إمام شمس الدين محمد بن عبد الرحمن الغزي",              authorEn:"Imam Shams al-Din al-Ghazzi",       publisher:"", volumes:1, categoryId:1, status:"available", serial:"TH-42", cover:null, pdf:null, descAr:"في تراجم علماء المحدثين من الأمة",                     descEn:"Biographies of hadith scholars of the Muslim community.", reviews:[], borrowedBy:null },
  { id:226,titleAr:"النجوم الطوالع في تراجم أعلام جمع الجوامع",                       titleEn:"Al-Nujum al-Tawali' fi Tarajim A'lam Jam' al-Jawami'",         authorAr:"عبد الغفور الثقافي الكاونوري",                         authorEn:"'Abd al-Ghafur al-Thaqafi al-Kawnuri", publisher:"", volumes:1, categoryId:1, status:"available", serial:"TH-43", cover:null, pdf:null, descAr:"في تراجم العلماء الوارد ذكرهم في جمع الجوامع",          descEn:"Biographies of scholars mentioned in Jam' al-Jawami'.", reviews:[], borrowedBy:null },
  { id:227,titleAr:"سواد العينين في مناقب الغوث أبي العلمين",                         titleEn:"Sawad al-'Aynayn fi Manaqib al-Ghawth Abi al-'Alamayn",        authorAr:"إمام الشيخ عبد الكريم بن محمد الرافعي",               authorEn:"Imam 'Abd al-Karim al-Rafi'i",      publisher:"", volumes:1, categoryId:1, status:"available", serial:"TH-45", cover:null, pdf:null, descAr:"في مناقب الشيخ عبد القادر الجيلاني",                  descEn:"On the virtues of Shaykh 'Abd al-Qadir al-Jilani.", reviews:[], borrowedBy:null },
  { id:228,titleAr:"تعطير السير بثبوت النبوة آدم أبو البشر",                          titleEn:"Ta'tir al-Siyar bi-Thubut al-Nubuwwa Adum Abu al-Bashar",      authorAr:"عبد الرحمن باوا بن محمد المليباري",                    authorEn:"'Abd al-Rahman Bawa al-Malibari",   publisher:"", volumes:1, categoryId:1, status:"available", serial:"TH-47", cover:null, pdf:null, descAr:"في إثبات نبوة آدم أبو البشر عليه السلام",              descEn:"On proving the prophethood of Adam, father of mankind.", reviews:[], borrowedBy:null },
  { id:229,titleAr:"الإعلان بالتوبيخ لمن ذم التاريخ",                                 titleEn:"Al-I'lan bil-Tawbikh liman Dhamma al-Tarikh",                  authorAr:"شمس الدين محمد بن عبد الرحمن السخاوي",                 authorEn:"Imam al-Sakhawi",                   publisher:"", volumes:1, categoryId:1, status:"available", serial:"TH-48", cover:null, pdf:null, descAr:"في الدفاع عن علم التاريخ وبيان فضله",                  descEn:"A defence of the science of history.", reviews:[], borrowedBy:null },
  { id:230,titleAr:"قصص الأنبياء من القرآن والأثر",                                   titleEn:"Qisas al-Anbiya' min al-Qur'an wal-Athar",                     authorAr:"أبو الفداء الحافظ ابن كثير الدمشقي",                   authorEn:"Ibn Kathir al-Dimashqi",            publisher:"", volumes:1, categoryId:1, status:"available", serial:"TH-49", cover:null, pdf:null, descAr:"قصص الأنبياء من القرآن الكريم والأحاديث",              descEn:"Stories of the prophets from the Quran and hadith.", reviews:[], borrowedBy:null },
  { id:231,titleAr:"الدرر في ترجمة الإمام ابن حجر رضي الله عنه",                     titleEn:"Al-Durar fi Tarjamat al-Imam Ibn Hajar",                       authorAr:"محمد صالح بن حسن مسليار الأداكري",                     authorEn:"Muhammad Salih ibn Hasan Musliyar al-Adakari", publisher:"", volumes:1, categoryId:1, status:"available", serial:"TH-50", cover:null, pdf:null, descAr:"في ترجمة الإمام ابن حجر العسقلاني",                    descEn:"Biography of Imam Ibn Hajar al-'Asqalani.", reviews:[], borrowedBy:null },
  // ── علوم القرآن ──
  { id:232,titleAr:"الإتقان في علوم القرآن",                         titleEn:"Al-Itqan fi 'Ulum al-Qur'an",                      authorAr:"جلال الدين السيوطي",                        authorEn:"Jalal al-Din al-Suyuti",          publisher:"", volumes:2, categoryId:10, status:"available", serial:"U-1",  cover:null, pdf:null, descAr:"أشمل موسوعة في علوم القرآن الكريم",         descEn:"The most comprehensive encyclopaedia of Quranic sciences.", reviews:[], borrowedBy:null },
  { id:233,titleAr:"أحكام القرآن",                                   titleEn:"Ahkam al-Qur'an",                                  authorAr:"إمام الشافعي",                               authorEn:"Imam al-Shafi'i",                  publisher:"", volumes:2, categoryId:10, status:"available", serial:"U-3",  cover:null, pdf:null, descAr:"في الأحكام الفقهية المستنبطة من القرآن الكريم",descEn:"Jurisprudential rulings derived from the Holy Quran.", reviews:[], borrowedBy:null },
  { id:234,titleAr:"لباب النقول في أسباب النزول",                    titleEn:"Lubab al-Nuqul fi Asbab al-Nuzul",                 authorAr:"جلال الدين السيوطي",                        authorEn:"Jalal al-Din al-Suyuti",          publisher:"", volumes:1, categoryId:10, status:"available", serial:"U-4",  cover:null, pdf:null, descAr:"في أسباب نزول الآيات القرآنية",             descEn:"On the occasions and causes of Quranic revelation.", reviews:[], borrowedBy:null },
  { id:235,titleAr:"المعجم المفهرس لألفاظ القرآن الكريم",            titleEn:"Al-Mu'jam al-Mufahras li-Alfaz al-Qur'an al-Karim",authorAr:"محمد فؤاد عبد الباقي",                      authorEn:"Muhammad Fu'ad 'Abd al-Baqi",      publisher:"", volumes:1, categoryId:10, status:"available", serial:"U-5",  cover:null, pdf:null, descAr:"فهرس شامل لألفاظ القرآن الكريم",             descEn:"A comprehensive concordance of Quranic vocabulary.", reviews:[], borrowedBy:null },
  { id:236,titleAr:"البديهيات في حزب الأول من القرآن الكريم",        titleEn:"Al-Badihiyyat fi al-Hizb al-Awwal min al-Qur'an",  authorAr:"",                                          authorEn:"",                                publisher:"", volumes:1, categoryId:10, status:"available", serial:"U-6",  cover:null, pdf:null, descAr:"في بديهيات الحزب الأول من القرآن الكريم",    descEn:"On the fundamentals of the first section of the Quran.", reviews:[], borrowedBy:null },
  { id:237,titleAr:"القواعد الأساسية في علوم القرآن",                titleEn:"Al-Qawa'id al-Asasiyya fi 'Ulum al-Qur'an",        authorAr:"السيد محمد بن علوي المالكي الحسني",         authorEn:"Sayyid Muhammad al-Maliki al-Hasani",publisher:"", volumes:1, categoryId:10, status:"available", serial:"U-7",  cover:null, pdf:null, descAr:"قواعد أساسية محررة في علوم القرآن الكريم",   descEn:"Core principles of the Quranic sciences.", reviews:[], borrowedBy:null },
  { id:238,titleAr:"الوجيز في علوم القرآن",                          titleEn:"Al-Wajiz fi 'Ulum al-Qur'an",                      authorAr:"صلاح محمد حجازي كيلاني",                    authorEn:"Salah Muhammad al-Kilani",         publisher:"", volumes:1, categoryId:10, status:"available", serial:"U-8",  cover:null, pdf:null, descAr:"مختصر وافٍ في علوم القرآن الكريم",           descEn:"A concise yet comprehensive work on Quranic sciences.", reviews:[], borrowedBy:null },
  { id:239,titleAr:"كلمات القرآن تفسير وبيان",                       titleEn:"Kalimat al-Qur'an Tafsir wa-Bayan",                authorAr:"",                                          authorEn:"",                                publisher:"", volumes:1, categoryId:10, status:"available", serial:"U-9",  cover:null, pdf:null, descAr:"في تفسير وبيان كلمات القرآن الكريم",         descEn:"Explanation and commentary on the words of the Quran.", reviews:[], borrowedBy:null },
  { id:240,titleAr:"التبيان في آداب حملة القرآن",                    titleEn:"Al-Tibyan fi Adab Hamalat al-Qur'an",              authorAr:"إمام النووي",                               authorEn:"Imam al-Nawawi",                   publisher:"", volumes:1, categoryId:10, status:"available", serial:"U-10", cover:null, pdf:null, descAr:"في آداب حفظة القرآن الكريم وتلاوته",         descEn:"On the etiquette of those who memorise and recite the Quran.", reviews:[], borrowedBy:null },
  { id:241,titleAr:"المقصد لتلخيص ما في المرشد في الوقف والابتداء", titleEn:"Al-Maqsad li-Talkhis ma fi al-Murshid fil-Waqf wal-Ibtida'", authorAr:"إمام زكريا الأنصاري",           authorEn:"Imam Zakariyya al-Ansari",         publisher:"", volumes:1, categoryId:10, status:"available", serial:"U-11", cover:null, pdf:null, descAr:"في قواعد الوقف والابتداء في القرآن الكريم",   descEn:"On the rules of pausing and starting in Quranic recitation.", reviews:[], borrowedBy:null },
  { id:242,titleAr:"المقرب في معرفة ما في القرآن من المعرب",         titleEn:"Al-Muqarrab fi Ma'rifat ma fil-Qur'an min al-Mu'arrab",authorAr:"الشيخ محمد بن علي بن علان الصديقي",       authorEn:"Shaykh Muhammad ibn 'Allan al-Siddiqi",publisher:"", volumes:1, categoryId:10, status:"available", serial:"U-12", cover:null, pdf:null, descAr:"في الكلمات المعربة الواردة في القرآن الكريم",  descEn:"On the Arabised foreign words in the Holy Quran.", reviews:[], borrowedBy:null },
  { id:243,titleAr:"أسرار ترتيب القرآن",                             titleEn:"Asrar Tartib al-Qur'an",                           authorAr:"جلال الدين السيوطي",                        authorEn:"Jalal al-Din al-Suyuti",          publisher:"", volumes:1, categoryId:10, status:"available", serial:"U-16", cover:null, pdf:null, descAr:"في الحكمة من ترتيب سور القرآن الكريم",       descEn:"On the wisdom behind the arrangement of Quranic suras.", reviews:[], borrowedBy:null },
  // ── التفسير والقرآن ──
  { id:244,titleAr:"التفسير الكبير",                                                       titleEn:"Al-Tafsir al-Kabir",                                         authorAr:"إمام فخر الدين الرازي",                                  authorEn:"Imam Fakhr al-Din al-Razi",          publisher:"", volumes:32, categoryId:3, status:"available", serial:"T-1",  cover:null, pdf:null, descAr:"من أعظم التفاسير العقلية في الإسلام",               descEn:"One of the greatest rational commentaries on the Quran.", reviews:[], borrowedBy:null },
  { id:245,titleAr:"الدر المنثور في التفسير المأثور",                                      titleEn:"Al-Durr al-Manthur fil-Tafsir al-Ma'thur",                   authorAr:"إمام جلال الدين عبد الرحمن السيوطي",                    authorEn:"Imam al-Suyuti",                     publisher:"", volumes:8,  categoryId:3, status:"available", serial:"T-2",  cover:null, pdf:null, descAr:"تفسير بالمأثور للإمام السيوطي",                      descEn:"Tafsir by transmitted reports compiled by al-Suyuti.", reviews:[], borrowedBy:null },
  { id:246,titleAr:"تفسير القرطبي",                                                        titleEn:"Tafsir al-Qurtubi",                                          authorAr:"إمام محمد بن أحمد الأنصاري القرطبي",                    authorEn:"Imam al-Qurtubi",                    publisher:"", volumes:20, categoryId:3, status:"available", serial:"T-3",  cover:null, pdf:null, descAr:"الجامع لأحكام القرآن للقرطبي",                       descEn:"Al-Qurtubi's comprehensive commentary on Quranic rulings.", reviews:[], borrowedBy:null },
  { id:247,titleAr:"معالم التنزيل — تفسير البغوي",                                         titleEn:"Ma'alim al-Tanzil — Tafsir al-Baghawi",                      authorAr:"إمام الحسين بن مسعود الفراء البغوي",                    authorEn:"Imam al-Baghawi",                    publisher:"", volumes:8,  categoryId:3, status:"available", serial:"T-4",  cover:null, pdf:null, descAr:"تفسير البغوي المعروف بمعالم التنزيل",                descEn:"Al-Baghawi's celebrated Quran commentary.", reviews:[], borrowedBy:null },
  { id:248,titleAr:"التفسير الواضح الميسر",                                                titleEn:"Al-Tafsir al-Wadih al-Muyassar",                             authorAr:"الشيخ محمد علي الصابوني",                                authorEn:"Shaykh Muhammad 'Ali al-Sabuni",     publisher:"", volumes:1,  categoryId:3, status:"available", serial:"T-5",  cover:null, pdf:null, descAr:"تفسير ميسر للقرآن الكريم",                           descEn:"A simplified commentary on the Holy Quran.", reviews:[], borrowedBy:null },
  { id:249,titleAr:"تفسير القرآن العظيم",                                                  titleEn:"Tafsir al-Qur'an al-'Azim",                                 authorAr:"إمام ابن كثير الدمشقي",                                  authorEn:"Imam Ibn Kathir al-Dimashqi",         publisher:"", volumes:8,  categoryId:3, status:"available", serial:"T-6",  cover:null, pdf:null, descAr:"تفسير ابن كثير المشهور",                             descEn:"The celebrated Quranic commentary of Ibn Kathir.", reviews:[], borrowedBy:null },
  { id:250,titleAr:"تفسير روح البيان",                                                     titleEn:"Tafsir Ruh al-Bayan",                                        authorAr:"إسماعيل حقي البروسوي",                                   authorEn:"Isma'il Haqqi al-Bursawi",           publisher:"", volumes:10, categoryId:3, status:"available", serial:"T-7",  cover:null, pdf:null, descAr:"تفسير صوفي موسوعي للقرآن الكريم",                    descEn:"An encyclopaedic Sufi commentary on the Holy Quran.", reviews:[], borrowedBy:null },
  { id:251,titleAr:"الفتوحات الإلهية بتوضيح تفسير الجلالين للدقائق الخفية",                titleEn:"Al-Futuhhat al-Ilahiyya bi-Tawdih Tafsir al-Jalalayn",      authorAr:"سليمان بن عمر العجيلي الشافعي",                         authorEn:"Sulayman al-'Ujayly al-Shafi'i",     publisher:"", volumes:4,  categoryId:3, status:"available", serial:"T-8",  cover:null, pdf:null, descAr:"شرح وتوضيح لتفسير الجلالين",                         descEn:"Explanation and clarification of Tafsir al-Jalalayn.", reviews:[], borrowedBy:null },
  { id:252,titleAr:"لباب التأويل في معاني التنزيل",                                        titleEn:"Lubab al-Ta'wil fi Ma'ani al-Tanzil",                        authorAr:"علاء الدين الخازن",                                      authorEn:"'Ala' al-Din al-Khazin",             publisher:"", volumes:4,  categoryId:3, status:"available", serial:"T-9",  cover:null, pdf:null, descAr:"تفسير الخازن في معاني القرآن",                       descEn:"Al-Khazin's commentary on the meanings of the Quran.", reviews:[], borrowedBy:null },
  { id:253,titleAr:"حاشية محيي الدين شيخ زاده على تفسير القاضي البيضاوي",                  titleEn:"Hashiyat Shaykh Zadeh 'ala Tafsir al-Baydawi",              authorAr:"محمد بن مصطفى مصلح الدين القوجوي الحنفي",               authorEn:"Muhammad al-Qujawi al-Hanafi",       publisher:"", volumes:4,  categoryId:3, status:"available", serial:"T-11", cover:null, pdf:null, descAr:"حاشية على تفسير البيضاوي",                           descEn:"Gloss on al-Baydawi's Quranic commentary.", reviews:[], borrowedBy:null },
  { id:254,titleAr:"البينات في بيان بعض الآيات",                                           titleEn:"Al-Bayyinat fi Bayan Ba'd al-Ayat",                          authorAr:"ملا علي القاري",                                         authorEn:"Mulla 'Ali al-Qari",                 publisher:"", volumes:1,  categoryId:3, status:"available", serial:"T-13", cover:null, pdf:null, descAr:"في بيان وتفسير بعض الآيات القرآنية",                 descEn:"On the explanation of select Quranic verses.", reviews:[], borrowedBy:null },
  { id:255,titleAr:"جامع البيان في تفسير القرآن",                                          titleEn:"Jami' al-Bayan fi Tafsir al-Qur'an",                         authorAr:"عين الدين محمد بن عبد الرحمن",                          authorEn:"'Ayn al-Din Muhammad ibn 'Abd al-Rahman", publisher:"", volumes:4, categoryId:3, status:"available", serial:"T-14", cover:null, pdf:null, descAr:"جامع البيان في تفسير القرآن الكريم",                  descEn:"A comprehensive commentary on the Holy Quran.", reviews:[], borrowedBy:null },
  { id:256,titleAr:"تيسير الجلالين",                                                       titleEn:"Taysir al-Jalalayn",                                         authorAr:"الشيخ عبد الرحمن باوا بن محمد المليباري",               authorEn:"Shaykh 'Abd al-Rahman Bawa al-Malibari", publisher:"", volumes:1, categoryId:3, status:"available", serial:"T-16", cover:null, pdf:null, descAr:"تيسير وتوضيح لتفسير الجلالين",                        descEn:"Simplified edition of Tafsir al-Jalalayn.", reviews:[], borrowedBy:null },
];
const INIT_STUDENTS = [
  { id:1, name:"Ahmed Ali Hassan",  class:"Grade 10 - A", code:"1001" },
  { id:2, name:"Fatima Omar",       class:"Grade 11 - B", code:"1002" },
  { id:3, name:"Ibrahim Khalid",    class:"Grade 9 - C",  code:"1003" },
  { id:4, name:"Maryam Yusuf",      class:"Grade 10 - B", code:"1004" },
  { id:5, name:"Umar Farooq",       class:"Grade 12 - A", code:"1005" },
];
const ADMIN = { username:"admin", password:"admin123" };
const DEFAULT_CODE = "7842";
const AYAT = [
  { ar:"﴿ اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ ﴾",                                                                   ref:"العلق: ١"      },
  { ar:"﴿ وَقُل رَّبِّ زِدْنِي عِلْمًا ﴾",                                                                               ref:"طه: ١١٤"       },
  { ar:"﴿ يَرْفَعِ اللَّهُ الَّذِينَ آمَنُوا مِنكُمْ وَالَّذِينَ أُوتُوا الْعِلْمَ دَرَجَاتٍ ﴾",                       ref:"المجادلة: ١١"  },
  { ar:"﴿ وَمَن يُؤْتَ الْحِكْمَةَ فَقَدْ أُوتِيَ خَيْرًا كَثِيرًا ﴾",                                                  ref:"البقرة: ٢٦٩"   },
];

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
const DATA_VERSION = "v14"; // bump this whenever INIT_BOOKS or INIT_CATS change
const REMOVED_SEED_IDS = [1,2,3,4,5,6,7,8]; // original placeholder books removed

// Merge seed data into localStorage — adds new items, updates seed category names, never removes user data
function migrateData() {
  try {
    if (localStorage.getItem("lib-data-version") === DATA_VERSION) return;
    // Merge + update categories (update name/color/code for seed cats, add new ones)
    const storedCats = JSON.parse(localStorage.getItem("lib-cats") || "null");
    if (storedCats) {
      const merged = storedCats.map(sc => {
        const seed = INIT_CATS.find(ic => ic.id === sc.id);
        return seed ? { ...sc, name:seed.name, code:seed.code, color:seed.color } : sc;
      });
      INIT_CATS.forEach(ic => { if (!merged.find(c => c.id === ic.id)) merged.push(ic); });
      localStorage.setItem("lib-cats", JSON.stringify(merged));
    }
    // Merge books (add new seed books, remove old placeholders, never overwrite user edits)
    const storedBooks = JSON.parse(localStorage.getItem("lib-books") || "null");
    if (storedBooks) {
      let merged = storedBooks.filter(b => !REMOVED_SEED_IDS.includes(b.id));
      INIT_BOOKS.forEach(ib => { if (!merged.find(b => b.id === ib.id)) merged.push(ib); });
      localStorage.setItem("lib-books", JSON.stringify(merged));
    }
    // Migrate students: add code field if missing, remove nameAr
    const storedStudents = JSON.parse(localStorage.getItem("lib-students") || "null");
    if (storedStudents) {
      const migrated = storedStudents.map((s, i) => {
        const seed = INIT_STUDENTS.find(is => is.id === s.id);
        const base = { ...s };
        delete base.nameAr;
        if (!base.code) base.code = seed?.code || String(1000 + i + 1);
        return base;
      });
      localStorage.setItem("lib-students", JSON.stringify(migrated));
    }
    localStorage.setItem("lib-data-version", DATA_VERSION);
  } catch {}
}
migrateData();

function useLS(key, init) {
  const [v, setV] = useState(() => { try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : init; } catch { return init; } });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)); } catch {} }, [v, key]);
  return [v, setV];
}

// ─────────────────────────────────────────────────────────────
// STARS
// ─────────────────────────────────────────────────────────────
const STARS = Array.from({ length: 130 }, (_, i) => ({
  id: i, x: Math.random()*100, y: Math.random()*90,
  s: 0.5 + Math.random()*1.8, dur: 2.5 + Math.random()*5, del: Math.random()*7,
}));
function StarField({ light }) {
  if (light) return null;
  return (
    <div className="sf" aria-hidden="true">
      {STARS.map(s => (
        <div key={s.id} className="star" style={{ left:`${s.x}%`, top:`${s.y}%`, width:s.s, height:s.s, animationDuration:`${s.dur}s`, animationDelay:`${s.del}s` }}/>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CONSTELLATION CANVAS (dark only)
// ─────────────────────────────────────────────────────────────
function ConstellationCanvas({ light }) {
  const ref = useRef(null);
  useEffect(() => {
    if (light) return;
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    let W = c.width = innerWidth, H = c.height = innerHeight, raf;
    const nodes = Array.from({ length: 48 }, () => ({
      x: Math.random()*W, y: Math.random()*H,
      vx: (Math.random()-.5)*.15, vy: (Math.random()-.5)*.15,
    }));
    const tick = () => {
      ctx.clearRect(0,0,W,H);
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x<0) n.x=W; if (n.x>W) n.x=0;
        if (n.y<0) n.y=H; if (n.y>H) n.y=0;
      });
      for (let i=0;i<nodes.length;i++) for (let j=i+1;j<nodes.length;j++) {
        const dx=nodes[i].x-nodes[j].x, dy=nodes[i].y-nodes[j].y, d=Math.sqrt(dx*dx+dy*dy);
        if (d<110) { ctx.beginPath(); ctx.strokeStyle=`rgba(212,168,67,${(1-d/110)*.09})`; ctx.lineWidth=.5; ctx.moveTo(nodes[i].x,nodes[i].y); ctx.lineTo(nodes[j].x,nodes[j].y); ctx.stroke(); }
      }
      nodes.forEach(n => { ctx.beginPath(); ctx.arc(n.x,n.y,.7,0,Math.PI*2); ctx.fillStyle="rgba(212,168,67,0.22)"; ctx.fill(); });
      raf = requestAnimationFrame(tick);
    };
    tick();
    const onR = () => { W=c.width=innerWidth; H=c.height=innerHeight; };
    addEventListener("resize", onR);
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", onR); };
  }, [light]);
  if (light) return null;
  return <canvas ref={ref} className="const-canvas"/>;
}

// ─────────────────────────────────────────────────────────────
// CINEMATIC BG — dark/light aware
// ─────────────────────────────────────────────────────────────
function CineBG({ light }) {
  const MOTES = light ? Array.from({length:16},(_,i)=>({
    id:i, left:`${5+Math.random()*90}%`, bottom:`${Math.random()*20}%`,
    d:`${7+Math.random()*10}s`, del:`${Math.random()*8}s`, dx:`${(Math.random()-.5)*60}px`
  })) : [];
  return (
    <div className={`cine-bg ${light ? "cine-light" : "cine-dark"}`} aria-hidden="true">
      {light ? (
        <>
          <div className="cl-base"/>
          <div className="cl-candle"/>
          <div className="cl-rays">{[0,1,2,3,4].map(i=><div key={i} className="cl-ray" style={{"--i":i}}/>)}</div>
          <div className="cl-geo"/>
          <div className="cl-vignette"/>
          <div className="cl-shimmer"/>
          <div className="cl-motes">{MOTES.map(m=><div key={m.id} className="cl-mote" style={{left:m.left,bottom:m.bottom,"--d":m.d,"--del":m.del,"--dx":m.dx}}/>)}</div>
        </>
      ) : (
        <>
          <div className="cd-base"/>
          <div className="cd-n1"/><div className="cd-n2"/><div className="cd-n3"/>
          <div className="cd-a1"/><div className="cd-a2"/>
          <StarField light={light}/>
          <ConstellationCanvas light={light}/>
          <div className="cd-rays">
            {[0,1,2,3,4,5].map(i => <div key={i} className="cd-ray" style={{"--i":i}}/>)}
          </div>
          <div className="cd-vignette"/>
          <div className="cd-mosque"/>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// DUST PARTICLES
// ─────────────────────────────────────────────────────────────
const DUST = Array.from({ length: 22 }, (_, i) => ({
  id:i, x:Math.random()*100, y:30+Math.random()*55,
  s:1+Math.random()*2, dur:8+Math.random()*12, d:Math.random()*10, drift:(Math.random()-.5)*70,
}));
function Dust() {
  return (
    <div className="dust-wrap" aria-hidden="true">
      {DUST.map(p => (
        <div key={p.id} className="dp" style={{ left:`${p.x}%`, top:`${p.y}%`, width:p.s, height:p.s, animationDuration:`${p.dur}s`, animationDelay:`${p.d}s`, "--drift":`${p.drift}px` }}/>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MANDALA
// ─────────────────────────────────────────────────────────────
function Mandala() {
  return (
    <svg className="mandala" viewBox="0 0 300 300" width="240" height="240">
      <defs>
        <radialGradient id="mg"><stop offset="0%" stopColor="#d4a843" stopOpacity=".7"/><stop offset="100%" stopColor="#d4a843" stopOpacity="0"/></radialGradient>
        <filter id="gf"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <circle cx="150" cy="150" r="26" fill="url(#mg)" filter="url(#gf)" className="mc"/>
      <circle cx="150" cy="150" r="13" fill="none" stroke="#d4a843" strokeWidth=".8" opacity=".9"/>
      {[0,45,90,135,180,225,270,315].map((deg,i) => (
        <line key={i} x1={150+Math.cos(deg*Math.PI/180)*13} y1={150+Math.sin(deg*Math.PI/180)*13} x2={150+Math.cos(deg*Math.PI/180)*25} y2={150+Math.sin(deg*Math.PI/180)*25} stroke="#d4a843" strokeWidth="1.4" opacity=".85" filter="url(#gf)"/>
      ))}
      {[38,58,78,98,118].map((r,i) => (
        <g key={r}>
          <circle cx="150" cy="150" r={r} fill="none" stroke="#d4a843" strokeWidth={i===0?1:.35} opacity={.09+(5-i)*.04}/>
          {[0,60,120,180,240,300].map((deg,j) => (
            <circle key={j} cx={150+Math.cos(deg*Math.PI/180)*r} cy={150+Math.sin(deg*Math.PI/180)*r} r={i===0?1.8:1.1} fill="#d4a843" opacity={.22+(5-i)*.05}/>
          ))}
        </g>
      ))}
      <polygon points="150,20 253,82 253,218 150,280 47,218 47,82" fill="none" stroke="#d4a843" strokeWidth=".4" opacity=".09"/>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// ORNAMENT
// ─────────────────────────────────────────────────────────────
function Ornament({ w=200 }) {
  return (
    <div className="orn" style={{ width:w }}>
      <div className="orn-line"/><div className="orn-dia"/><div className="orn-line"/>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// TOAST
// ─────────────────────────────────────────────────────────────
function Toast({ toasts, remove }) {
  return (
    <div className="toast-wrap">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`} onClick={() => remove(t.id)}>
          <span>{t.type==="success"?"✓":t.type==="error"?"✗":"ℹ"}</span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// LANTERN
// ─────────────────────────────────────────────────────────────
function Lantern({ on }) {
  return (
    <div className={`lantern ${on?"lantern-on":""}`}>
      <svg width="40" height="62" viewBox="0 0 48 72" fill="none">
        <line x1="24" y1="0" x2="24" y2="9" stroke="#c8922a" strokeWidth="2"/>
        <path d="M16 9 Q24 7 32 9 L34 13 Q24 11 14 13Z" fill="#a07020"/>
        <rect x="12" y="13" width="24" height="36" rx="3" fill={on?"rgba(255,200,60,0.12)":"rgba(160,112,32,0.08)"} stroke="#c8922a" strokeWidth="1.4"/>
        <line x1="12" y1="24" x2="36" y2="24" stroke="#c8922a" strokeWidth=".45" opacity=".5"/>
        <line x1="12" y1="35" x2="36" y2="35" stroke="#c8922a" strokeWidth=".45" opacity=".5"/>
        <line x1="24" y1="13" x2="24" y2="49" stroke="#c8922a" strokeWidth=".45" opacity=".5"/>
        {on && <><ellipse cx="24" cy="35" rx="7" ry="9" fill="rgba(255,200,60,0.1)" className="lg"/><circle cx="24" cy="27" r="2.8" fill="#ffdd60" className="fl"/><ellipse cx="24" cy="25" rx="1.8" ry="2.8" fill="#ff9900" opacity=".8" className="fli"/></>}
        <path d="M10 49 Q24 53 38 49 L40 57 Q24 61 8 57Z" fill="#a07020"/>
        <circle cx="24" cy="62" r="3.5" fill="#7a5a12"/>
      </svg>
      {on && <div className="lantern-glow"/>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// COUNTER
// ─────────────────────────────────────────────────────────────
function Counter({ val }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let i=0; const step=Math.max(1,Math.ceil(val/30));
    const t = setInterval(() => { i=Math.min(i+step,val); setN(i); if(i>=val) clearInterval(t); }, 40);
    return () => clearInterval(t);
  }, [val]);
  return <>{n}</>;
}

// ─────────────────────────────────────────────────────────────
// PAGE WRAPPER
// ─────────────────────────────────────────────────────────────
function Page({ children, className="" }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 30); return () => clearTimeout(t); }, []);
  return <div className={`page-wrap ${visible?"page-in":""} ${className}`}>{children}</div>;
}

// ─────────────────────────────────────────────────────────────
// AYAH TICKER
// ─────────────────────────────────────────────────────────────
function AyahBanner({ light }) {
  const [idx, setIdx] = useState(0);
  const [vis, setVis] = useState(true);
  useEffect(() => {
    const t = setInterval(() => {
      setVis(false);
      setTimeout(() => { setIdx(i => (i+1)%AYAT.length); setVis(true); }, 600);
    }, 6000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className={`ayah-banner ${light?"ayah-light":""}`}>
      <span className="ayah-deco">✦</span>
      <div className={`ayah-text ${vis?"ayah-in":"ayah-out"}`}>
        <span className="ayah-ar">{AYAT[idx].ar}</span>
        <span className="ayah-ref">{AYAT[idx].ref}</span>
      </div>
      <span className="ayah-deco">✦</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SHARED HEADER (used in Catalog & Categories pages)
// ─────────────────────────────────────────────────────────────
function AppHeader({ activePage, setActivePage, candleOn, setCandleOn, isAdmin, onAdminClick, onLoginClick, onLogout, light }) {
  return (
    <header className={`app-header ${light?"header-light":""}`}>
      <div className="header-inner">
        <div className="header-brand">
          <Lantern on={candleOn}/>
          <div className="header-brand-text">
            <h1 className="header-title">Makthabathu Madrasathil Imthiyaz</h1>
            <p className="header-sub">مكتبة مدرسة الامتياز</p>
          </div>
        </div>

        <nav className="header-nav">
          <button className={`nav-btn ${activePage==="catalog"?"nav-active":""}`} onClick={() => setActivePage("catalog")}>
            📚 Catalog
          </button>
          <button className={`nav-btn ${activePage==="categories"?"nav-active":""}`} onClick={() => setActivePage("categories")}>
            🗂 Categories
          </button>
        </nav>

        <div className="header-actions">
          <button className={`btn-candle ${candleOn?"candle-on":""}`} onClick={() => setCandleOn(v=>!v)}>
            {candleOn ? "🌙 Extinguish" : "🕯 Candle Mode"}
          </button>
          {isAdmin ? (
            <>
              <button className="btn-admin-dash" onClick={onAdminClick}>⚙️ Dashboard</button>
              <button className="btn-logout-sm" onClick={onLogout}>Sign Out</button>
            </>
          ) : (
            <button className="btn-admin-dash" onClick={onLoginClick}>🔐 Admin</button>
          )}
        </div>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────
// BOOK CARD (shared between catalog & category detail)
function BookCard({ book, category, idx, onBookClick, light }) {
  return (
    <div
      className={`book-card ${light?"book-card-light":""}`}
      style={{ animationDelay:`${idx*0.05}s` }}
      onClick={() => onBookClick(book)}
    >
      <div className="bc-cover">
        {book.cover
          ? <img src={book.cover} className="bc-img" alt=""/>
          : <div className="bc-ph" style={{"--cc": category?.color||"#c8922a"}}>
              <span className="bc-ph-icon">📖</span>
              <span className="bc-ser">{book.serial}</span>
            </div>
        }
        <div className={`bc-status ${book.status==="available"?"bcs-av":"bcs-un"}`}>
          {book.status==="available" ? "Available" : "Unavailable"}
        </div>
      </div>
      <div className="bc-info">
        <div className="bc-serial" style={{ color: category?.color }}>{book.serial}</div>
        <div className="bc-title-ar">{book.titleAr}</div>
        <div className="bc-title-en">{book.titleEn}</div>
        <div className="bc-author">{book.authorEn}</div>
        <div className="bc-meta">
          <span className="bc-cat" style={{ background:(category?.color||"#c8922a")+"22", color:category?.color, borderColor:(category?.color||"#c8922a")+"44" }}>{category?.name}</span>
          <span className="bc-vol">{book.volumes} vol.</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// BOOKS PANEL (reused in catalog & category view)
// ─────────────────────────────────────────────────────────────
function BooksPanel({ books, categories, onBookClick, light, showCategoryFilter=true }) {
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [viewMode, setViewMode] = useState("grid");

  const filtered = books
    .filter(b => {
      const q = search.toLowerCase();
      return b.titleEn.toLowerCase().includes(q)||b.titleAr.includes(q)||b.authorEn.toLowerCase().includes(q)||b.serial.toLowerCase().includes(q);
    })
    .filter(b => filterCat==="all" || b.categoryId===parseInt(filterCat))
    .filter(b => filterStatus==="all" || b.status===filterStatus)
    .sort((a,b2) => sortBy==="alpha"?a.titleEn.localeCompare(b2.titleEn):sortBy==="serial"?a.serial.localeCompare(b2.serial):b2.id-a.id);

  return (
    <>
      {/* Search */}
      <section className={`search-section ${light?"ss-light":""}`}>
        <div className={`search-box ${light?"sb-light":""}`}>
          <span className="si">🔍</span>
          <input className={`search-inp ${light?"si-light":""}`} placeholder="Search books, authors, serials…" value={search} onChange={e=>setSearch(e.target.value)}/>
          {search && <button className="sclear" onClick={()=>setSearch("")}>×</button>}
        </div>
        <div className="filters-row">
          <select className={`fsel ${light?"fsel-light":""}`} value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
          {showCategoryFilter && (
            <select className={`fsel ${light?"fsel-light":""}`} value={filterCat} onChange={e=>setFilterCat(e.target.value)}>
              <option value="all">All Categories</option>
              {categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          )}
          <select className={`fsel ${light?"fsel-light":""}`} value={sortBy} onChange={e=>setSortBy(e.target.value)}>
            <option value="latest">Latest Added</option>
            <option value="alpha">Alphabetical</option>
            <option value="serial">By Serial</option>
          </select>
          <div className="view-toggle">
            <button className={`vt-btn ${viewMode==="grid"?"vt-active":""} ${light?"vt-light":""}`} onClick={()=>setViewMode("grid")}>⊞</button>
            <button className={`vt-btn ${viewMode==="list"?"vt-active":""} ${light?"vt-light":""}`} onClick={()=>setViewMode("list")}>☰</button>
          </div>
        </div>
      </section>

      <div className={`results-info ${light?"ri-light":""}`}>
        Showing <strong>{filtered.length}</strong> book{filtered.length!==1?"s":""}
        {search&&<> · Results for "<em>{search}</em>"</>}
      </div>

      {viewMode==="grid" && (
        <section className="books-grid">
          {filtered.length===0 && <div className={`empty-state ${light?"es-light":""}`}><div>📭</div><p>No books found</p></div>}
          {filtered.map((book,i) => (
            <BookCard key={book.id} book={book} category={categories.find(c=>c.id===book.categoryId)} idx={i} onBookClick={onBookClick} light={light}/>
          ))}
        </section>
      )}
      {viewMode==="list" && (
        <section className="books-list">
          {filtered.map((book,i) => {
            const cat = categories.find(c=>c.id===book.categoryId);
            return (
              <div key={book.id} className={`book-row ${light?"book-row-light":""}`} style={{ animationDelay:`${i*0.03}s` }} onClick={()=>onBookClick(book)}>
                <div className="br-cover">
                  {book.cover?<img src={book.cover} className="br-img" alt=""/>:<div className="br-ph" style={{"--cc":cat?.color||"#c8922a"}}>📖</div>}
                </div>
                <div className="br-info">
                  <span className="br-ar">{book.titleAr}</span>
                  <span className="br-en">{book.titleEn}</span>
                  <span className="br-meta">{book.authorEn} · <span style={{color:cat?.color}}>{cat?.name}</span> · {book.volumes} vol.</span>
                </div>
                <div className="br-right">
                  <span className="tserial">{book.serial}</span>
                  <span className={`brs ${book.status==="available"?"brs-av":"brs-un"}`}>{book.status}</span>
                </div>
              </div>
            );
          })}
        </section>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// INTRO PAGE
// ─────────────────────────────────────────────────────────────
function IntroPage({ onEnter }) {
  const [phase, setPhase] = useState(0);
  const [typeText, setTypeText] = useState("");
  const [exiting, setExiting] = useState(false);
  const full = "Makthabathu Madrasathil Imthiyaz";

  useEffect(() => {
    const ts = [
      setTimeout(()=>setPhase(1), 100),
      setTimeout(()=>setPhase(2), 500),
      setTimeout(()=>setPhase(3), 900),
      setTimeout(()=>setPhase(4), 1400),
      setTimeout(()=>setPhase(5), 1900),
    ];
    return () => ts.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (phase<3) return;
    let i=0; setTypeText("");
    const t = setInterval(() => { setTypeText(full.slice(0,++i)); if(i>=full.length) clearInterval(t); }, 55);
    return () => clearInterval(t);
  }, [phase>=3]);

  const enter = () => { setExiting(true); setTimeout(onEnter, 500); };

  return (
    <div className={`intro ${phase>=1?"intro-bg":""} ${exiting?"intro-exit":""}`}>
      <div className="intro-grain"/>
      <div className="intro-vignette"/>
      {phase>=1 && <>
        <div className="cd-base" style={{position:"absolute",inset:0,zIndex:0}}/>
        <div className="cd-n1" style={{position:"absolute",zIndex:0}}/>
        <div className="cd-n2" style={{position:"absolute",zIndex:0}}/>
        <StarField light={false}/>
        {phase>=1 && <Dust/>}
      </>}
      <div className={`intro-moon ${phase>=1?"moon-in":""}`}>
        <svg width="88" height="88" viewBox="0 0 100 100">
          <defs><filter id="mf"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
          <circle cx="50" cy="50" r="40" fill="#c8922a" opacity=".08" filter="url(#mf)"/>
          <path d="M50 10 A40 40 0 1 1 50 90 A28 28 0 1 0 50 10Z" fill="#c8922a" filter="url(#mf)" opacity=".85"/>
        </svg>
      </div>
      {phase>=1 && !exiting && <div className="scan-line"/>}
      <div className={`intro-mandala ${phase>=2?"mandala-in":""}`}><Mandala/></div>
      <div className="intro-body">
        <div className={`ib-bismillah ${phase>=2?"ib-in":""}`}>﷽</div>
        <div className={`ib-title-wrap ${phase>=3?"ib-in":""}`}>
          <div className="ib-bar"/>
          <h1 className="ib-title">{typeText}{phase===3&&typeText.length<full.length&&<span className="cursor">|</span>}</h1>
          <p className="ib-title-ar">مكتبة مدرسة الامتياز</p>
          <div className="ib-bar"/>
        </div>
        <div className={`ib-sub ${phase>=4?"ib-in":""}`}>The Distinguished Islamic Digital Library</div>
        <div className={`ib-ayah ${phase>=4?"ib-in":""}`} style={{transitionDelay:".2s"}}>﴿ اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ ﴾</div>
        <Ornament w={160}/>
        <div className={`ib-btn-wrap ${phase>=5?"ib-in":""}`}>
          <button className="intro-btn" onClick={enter}>
            <span className="ib-glow"/>
            <span className="ib-inner"><span>📚</span><span>Enter the Library</span><span className="ib-arr">→</span></span>
            <div className="ib-shimmer"/>
          </button>
          <p className="ib-skip" onClick={enter}>Skip intro</p>
        </div>
      </div>
      <div className={`intro-mosque ${phase>=5?"mosque-in":""}`}/>
      <div className={`lb-top ${phase>=1?"lb-open":""}`}/><div className={`lb-bot ${phase>=1?"lb-open":""}`}/>
      {exiting && <div className="exit-fade"/>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CATALOG PAGE (homepage)
// ─────────────────────────────────────────────────────────────
function CatalogPage({ books, categories, isAdmin, onBookClick, onAdminClick, onLoginClick, candleOn, setCandleOn, onLogout, light }) {
  const stats = {
    total: books.length,
    available: books.filter(b=>b.status==="available").length,
    unavailable: books.filter(b=>b.status==="unavailable").length,
    cats: categories.length,
  };

  return (
    <Page className={`catalog-page ${light?"page-light":""}`}>
      <CineBG light={light}/>

      {/* Animated hero section */}
      <div className={`catalog-hero ${light?"ch-light":""}`}>
        <div className="ch-inner">
          <div className={`ch-badge ${light?"ch-badge-light":""}`}>✦ Islamic Digital Library ✦</div>
          <h2 className={`ch-heading ${light?"ch-heading-light":""}`}>مكتبة مدرسة الامتياز</h2>
          <p className={`ch-sub ${light?"ch-sub-light":""}`}>Explore a curated collection of classical Islamic texts</p>
          <Ornament w={160}/>
        </div>
        {!light && <div className="ch-glow-orb"/>}
        {!light && <div className="ch-glow-orb2"/>}
      </div>

      <AyahBanner light={light}/>

      {/* Stats */}
      <section className="stats-row">
        {[
          { icon:"📚", val:stats.total,     label:"Total Books",  color:"gold" },
          { icon:"✅", val:stats.available,  label:"Available",         color:"em"   },
          { icon:"📭", val:stats.unavailable,label:"Unavailable",     color:"red"  },
          { icon:"🗂", val:stats.cats,       label:"Categories",    color:"blue" },
        ].map((s,i) => (
          <div key={i} className={`stat-card sc-${s.color} ${light?`sc-light sc-light-${s.color}`:""}`} style={{animationDelay:`${i*0.08}s`}}>
            <div className="sc-icon">{s.icon}</div>
            <div className="sc-val"><Counter val={s.val}/></div>
            <div className="sc-label">{s.label}</div>
          </div>
        ))}
      </section>

      {/* Category bubbles */}
      <section className="cats-bubbles">
        {categories.map(c=>{
          const count = books.filter(b=>b.categoryId===c.id).length;
          return (
            <div key={c.id} className={`cat-bubble ${light?"cb-light":""}`} style={{"--cc":c.color}}>
              <span className="cb-dot" style={{background:c.color}}/>
              <span>{c.name}</span>
              <span className="cb-count">{count}</span>
            </div>
          );
        })}
      </section>

      <BooksPanel books={books} categories={categories} onBookClick={onBookClick} light={light} showCategoryFilter={true}/>

      <footer className={`hp-footer ${light?"footer-light":""}`}>
        <Ornament w={110}/>
        <p className="footer-ayah">﴿ يَرْفَعِ اللَّهُ الَّذِينَ آمَنُوا مِنكُمْ وَالَّذِينَ أُوتُوا الْعِلْمَ دَرَجَاتٍ ﴾</p>
        <p className="footer-ref">سورة المجادلة: ١١</p>
        <Ornament w={110}/>
        <p className="footer-copy">Makthabathu Madrasathil Imthiyaz © {new Date().getFullYear()}</p>
      </footer>
    </Page>
  );
}

// ─────────────────────────────────────────────────────────────
// CATEGORIES PAGE
// ─────────────────────────────────────────────────────────────
function CategoriesPage({ books, categories, onBookClick, light }) {
  const [selectedCat, setSelectedCat] = useState(null);

  if (selectedCat) {
    const cat = categories.find(c=>c.id===selectedCat);
    const catBooks = books.filter(b=>b.categoryId===selectedCat);
    return (
      <Page className={`cat-detail-page ${light?"page-light":""}`}>
        <CineBG light={light}/>
        <div className="cat-detail-wrap">
          <button className="back-btn" onClick={()=>setSelectedCat(null)}>← All Categories</button>
          <div className="cat-detail-header" style={{borderColor:cat?.color+"66"}}>
            <div className="cdh-dot" style={{background:cat?.color, boxShadow:`0 0 20px ${cat?.color}66`}}/>
            <div>
              <h2 className={`cdh-name ${light?"cdh-light":""}`} style={{color:cat?.color}}>{cat?.name}</h2>
              <p className={`cdh-sub ${light?"text-light":""}`}>{catBooks.length} book{catBooks.length!==1?"s":""} in this field</p>
            </div>
          </div>
          <BooksPanel books={catBooks} categories={categories} onBookClick={onBookClick} light={light} showCategoryFilter={false}/>
        </div>
      </Page>
    );
  }

  return (
    <Page className={`categories-page ${light?"page-light":""}`}>
      <CineBG light={light}/>
      <div className="cats-page-wrap">
        <div className="cats-page-header">
          <h2 className={`cph-title ${light?"cph-light":""}`}>📚 All Categories</h2>
          <p className={`cph-sub ${light?"text-light":""}`}>Browse the library by Islamic discipline</p>
        </div>
        <div className="cat-cards-grid">
          {categories.map((cat, i) => {
            const total = books.filter(b=>b.categoryId===cat.id).length;
            const avail = books.filter(b=>b.categoryId===cat.id&&b.status==="available").length;
            const unavail = total - avail;
            return (
              <div
                key={cat.id}
                className={`cat-field-card ${light?"cfc-light":""}`}
                style={{ "--cc":cat.color, animationDelay:`${i*0.07}s` }}
                onClick={()=>setSelectedCat(cat.id)}
              >
                <div className="cfc-accent" style={{background:cat.color}}/>
                <div className="cfc-top">
                  <div className="cfc-code" style={{color:cat.color, borderColor:cat.color+"44", background:cat.color+"11"}}>{cat.code.toUpperCase()}</div>
                  <div className="cfc-total" style={{color:cat.color}}>{total}</div>
                </div>
                <div className={`cfc-name ${light?"cfc-name-light":""}`}>{cat.name}</div>
                <div className="cfc-stats">
                  <span className="cfc-av">✅ {avail} available</span>
                  {unavail>0 && <span className="cfc-un">📭 {unavail} out</span>}
                </div>
                <div className="cfc-bar-wrap">
                  <div className="cfc-bar-track">
                    <div className="cfc-bar-fill" style={{width: total>0?`${(avail/total)*100}%`:"0%", background:cat.color}}/>
                  </div>
                  <span className={`cfc-pct ${light?"text-light":""}`}>{total>0?Math.round((avail/total)*100):0}% available</span>
                </div>
                <div className="cfc-arrow" style={{color:cat.color}}>→</div>
              </div>
            );
          })}
        </div>
      </div>
    </Page>
  );
}

// ─────────────────────────────────────────────────────────────
// BOOK DETAIL PAGE
// ─────────────────────────────────────────────────────────────
function BookDetailPage({ book, category, isAdmin, students, requestCode, onRequest, onUpdateBook, onBack, addToast, light }) {
  const [subPage, setSubPage] = useState("detail");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reqName, setReqName] = useState("");
  const [reqCode, setReqCode] = useState("");
  const [matched, setMatched] = useState(null);
  const [reqDone, setReqDone] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [hoverReview, setHoverReview] = useState(0);
  const [editPublisher, setEditPublisher] = useState(false);
  const [publisherVal, setPublisherVal] = useState(book.publisher || "");
  const [editBorrowed, setEditBorrowed] = useState(false);
  const [borrowedVal, setBorrowedVal] = useState(book.borrowedBy || "");

  const reviews = book.reviews || [];
  const avgRating = reviews.length ? (reviews.reduce((a,r)=>a+r.rating,0)/reviews.length).toFixed(1) : null;

  useEffect(() => {
    if (reqName.length<2) { setMatched(null); return; }
    const f = students.find(s=>s.name.toLowerCase().includes(reqName.toLowerCase()));
    setMatched(f||null);
  }, [reqName]);

  const submitReview = () => {
    if (!reviewText.trim() || !reviewRating) return;
    const updated = { ...book, reviews:[...reviews, { rating:reviewRating, text:reviewText.trim(), reviewer:reviewerName.trim()||"Anonymous", date:new Date().toLocaleDateString() }] };
    onUpdateBook(updated);
    setReviewText(""); setReviewRating(0); setReviewerName("");
    addToast("Review submitted — جزاك الله خيراً!", "success");
  };

  const savePublisher = () => {
    onUpdateBook({ ...book, publisher:publisherVal });
    setEditPublisher(false);
    addToast("Publisher updated!");
  };

  const saveBorrowed = () => {
    onUpdateBook({ ...book, borrowedBy:borrowedVal||null, status:borrowedVal?"unavailable":"available" });
    setEditBorrowed(false);
    addToast("Borrower info updated!");
  };

  const submitRequest = () => {
    if (!matched) { addToast("Student not found", "error"); return; }
    if (reqCode !== matched.code) { addToast("Invalid access code", "error"); return; }
    onRequest({ bookId:book.id, bookTitleAr:book.titleAr, bookTitle:book.titleEn, studentId:matched.id, studentName:matched.name, studentClass:matched.class, date:new Date().toLocaleDateString() });
    setReqDone(true);
  };

  const tabs = ["detail","reviews","request"];

  return (
    <Page className={`detail-page ${light?"page-light":""}`}>
      <CineBG light={light}/>
      <div className="detail-wrap">
        <button className="back-btn" onClick={onBack}>← Back to Library</button>

        {/* HERO */}
        <div className="detail-hero">
          <div className="detail-cover-wrap">
            {book.cover
              ? <img src={book.cover} alt="" className="detail-cover-img"/>
              : <div className="detail-cover-ph" style={{"--cc":category?.color||"#c8922a"}}>
                  <span>📖</span><span className="dcp-ser">{book.serial}</span>
                  {avgRating && <span className="dcp-rat">★ {avgRating}</span>}
                </div>
            }
            <div className={`avail-badge ${book.status==="available"?"av-yes":"av-no"}`}>
              <span className="av-dot"/> {book.status==="available"?"Available":"Unavailable"}
            </div>
          </div>

          <div className="detail-meta">
            <div className="dm-serial" style={{color:category?.color}}>{book.serial}</div>
            <h1 className="dm-title-ar">{book.titleAr}</h1>
            <h2 className={`dm-title-en ${light?"dm-light":""}`}>{book.titleEn}</h2>
            <div className={`dm-row ${light?"dm-row-light":""}`}><span className="dm-lbl">Author (Arabic):</span><span>{book.authorAr}</span></div>
            <div className={`dm-row ${light?"dm-row-light":""}`}><span className="dm-lbl">Author (English):</span><span>{book.authorEn}</span></div>
            <div className={`dm-row ${light?"dm-row-light":""}`}><span className="dm-lbl">Category:</span><span style={{color:category?.color}}>{category?.name}</span></div>
            <div className={`dm-row ${light?"dm-row-light":""}`}><span className="dm-lbl">Volumes:</span><span>{book.volumes}</span></div>

            {/* PUBLISHER */}
            <div className={`dm-row ${light?"dm-row-light":""}`}>
              <span className="dm-lbl">Publisher:</span>
              {editPublisher && isAdmin ? (
                <span className="pub-edit-row">
                  <input className="inp pub-inp" value={publisherVal} onChange={e=>setPublisherVal(e.target.value)} placeholder="Enter publisher name"/>
                  <button className="pub-save" onClick={savePublisher}>Save</button>
                  <button className="pub-cancel" onClick={()=>setEditPublisher(false)}>✕</button>
                </span>
              ) : (
                <span>
                  {book.publisher || <em className="dm-none">Not specified</em>}
                  {isAdmin && <button className="edit-inline-btn" onClick={()=>setEditPublisher(true)}>✏️</button>}
                </span>
              )}
            </div>

            {avgRating && <div className={`dm-row ${light?"dm-row-light":""}`}><span className="dm-lbl">Rating:</span><span className="dm-rating">{"★".repeat(Math.round(avgRating))}{"☆".repeat(5-Math.round(avgRating))} {avgRating}/5 ({reviews.length})</span></div>}

            {/* BORROWED BY — shown if unavailable */}
            {book.status==="unavailable" && (
              <div className="borrowed-box">
                <span className="bb-label">📌 Currently borrowed by:</span>
                {editBorrowed && isAdmin ? (
                  <span className="pub-edit-row">
                    <input className="inp pub-inp" value={borrowedVal} onChange={e=>setBorrowedVal(e.target.value)} placeholder="Student name"/>
                    <button className="pub-save" onClick={saveBorrowed}>Save</button>
                    <button className="pub-cancel" onClick={()=>setEditBorrowed(false)}>✕</button>
                  </span>
                ) : (
                  <span className="bb-name">
                    {book.borrowedBy || <em>Unknown</em>}
                    {isAdmin && <button className="edit-inline-btn" onClick={()=>setEditBorrowed(true)}>✏️</button>}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* TABS */}
        <div className={`detail-tabs ${light?"dt-light":""}`}>
          {["📖 Details","⭐ Reviews","📋 Request"].map((label,i)=>(
            <button key={i} className={`dtab ${subPage===tabs[i]?"dtab-active":""} ${light?"dtab-light":""}`} onClick={()=>{ setSubPage(tabs[i]); setReqDone(false); }}>
              {label}
            </button>
          ))}
        </div>

        {/* DETAIL TAB */}
        {subPage==="detail" && (
          <div className="dsub anim-fade">
            <div className={`desc-box ${light?"desc-box-light":""}`}>
              <h3 className="desc-title">وصف الكتاب — Arabic Description</h3>
              <p className="desc-ar">{book.descAr}</p>
            </div>
            <div className={`desc-box ${light?"desc-box-light":""}`}>
              <h3 className="desc-title">English Description</h3>
              <p className={`desc-en ${light?"de-light":""}`}>{book.descEn}</p>
            </div>
            {book.pdf && <button className="btn-pdf" onClick={()=>window.open(book.pdf,"_blank")}>📄 Open PDF — فتح الكتاب</button>}
          </div>
        )}

        {/* REVIEWS TAB */}
        {subPage==="reviews" && (
          <div className="dsub anim-fade">
            {/* Write review */}
            <div className={`review-write-box ${light?"rwb-light":""}`}>
              <h3 className="rv-title">Write a Review</h3>
              <div className="form-group" style={{marginBottom:10}}>
                <label className={light?"label-light":""}>Your Name (optional)</label>
                <input className={`inp ${light?"inp-light":""}`} value={reviewerName} onChange={e=>setReviewerName(e.target.value)} placeholder="Enter your name or leave anonymous"/>
              </div>
              <div className="stars-row">
                {[1,2,3,4,5].map(s=>(
                  <button key={s} className={`star-btn ${(hoverReview||reviewRating)>=s?"star-lit":""}`}
                    onMouseEnter={()=>setHoverReview(s)} onMouseLeave={()=>setHoverReview(0)}
                    onClick={()=>setReviewRating(s)}>★</button>
                ))}
              </div>
              <textarea
                className={`inp review-ta ${light?"inp-light":""}`}
                value={reviewText}
                onChange={e=>setReviewText(e.target.value)}
                placeholder="Share your thoughts on this book…"
                rows={3}
              />
              <button className="btn-submit" onClick={submitReview} disabled={!reviewText.trim()||!reviewRating}>
                Submit Review
              </button>
            </div>

            {/* Existing reviews */}
            {reviews.length===0
              ? <div className={`no-reviews ${light?"nr-light":""}`}>No reviews yet — be the first!</div>
              : reviews.map((rv,i)=>(
                <div key={i} className={`review-card ${light?"rc-light":""}`}>
                  <div className="rc-top">
                    <span className="rc-reviewer">{rv.reviewer||"Anonymous"}</span>
                    <span className="rc-stars">{"★".repeat(rv.rating)}{"☆".repeat(5-rv.rating)}</span>
                    <span className="rc-date">{rv.date}</span>
                  </div>
                  <p className={`rc-text ${light?"rc-light-text":""}`}>{rv.text}</p>
                </div>
              ))
            }

            {avgRating && (
              <div className={`rate-avg ${light?"ra-light":""}`}>
                <div className="rate-avg-num">{avgRating}</div>
                <div className="rate-avg-stars">{"★".repeat(Math.round(avgRating))}{"☆".repeat(5-Math.round(avgRating))}</div>
                <div className={`rate-avg-count ${light?"text-light":""}`}>Based on {reviews.length} review{reviews.length!==1?"s":""}</div>
              </div>
            )}
          </div>
        )}

        {/* REQUEST TAB */}
        {subPage==="request" && (
          <div className="dsub anim-fade">
            {reqDone ? (
              <div className={`req-success ${light?"req-success-light":""}`}>
                <div className="rs-icon">✓</div>
                <h3>Request Submitted!</h3>
                <p className={light?"text-light":""}>The librarian will process your request shortly.</p>
                <button className="btn-submit" onClick={()=>setReqDone(false)}>Another Request</button>
              </div>
            ) : (
              <div className={`req-form ${light?"req-form-light":""}`}>
                <h3 className="req-title">Request This Book</h3>
                <p className={`req-sub ${light?"text-light":""}`}>Type your name — details will appear automatically</p>
                <div className="form-group">
                  <label className={light?"label-light":""}>Your Name</label>
                  <input className={`inp ${light?"inp-light":""}`} value={reqName} onChange={e=>setReqName(e.target.value)} placeholder="Start typing your name…"/>
                  {matched && (
                    <div className="matched-student">
                      <div className="ms-check">✓</div>
                      <div>
                        <div className="ms-name">{matched.name}</div>
                        <div className="ms-class">{matched.class}</div>
                      </div>
                    </div>
                  )}
                  {reqName.length>=2 && !matched && <div className="not-found">⚠ Student not found in the system</div>}
                </div>
                <div className="form-group">
                  <label className={light?"label-light":""}>4-Digit Access Code</label>
                  <input className={`inp inp-code ${light?"inp-light":""}`} value={reqCode} onChange={e=>setReqCode(e.target.value.slice(0,4))} placeholder="• • • •" maxLength={4} type="password"/>
                  <p className={`inp-hint ${light?"text-light":""}`}>Enter your personal 4-digit access code</p>
                </div>
                <button className="btn-submit" onClick={submitRequest} disabled={!matched||reqCode.length!==4}>
                  Submit Request — تقديم الطلب
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </Page>
  );
}

// ─────────────────────────────────────────────────────────────
// PASSWORD CHANGE CARD
// ─────────────────────────────────────────────────────────────
function PasswordChangeCard({ light, onSetPassword, addToast }) {
  const [cur,  setCur]  = useState("");
  const [nw,   setNw]   = useState("");
  const [cnf,  setCnf]  = useState("");
  const [err,  setErr]  = useState("");
  const [show, setShow] = useState(false);

  const handleSave = () => {
    setErr("");
    // Verify current password against stored value
    const stored = (() => { try { const v=localStorage.getItem("lib-admin-pw"); return v?JSON.parse(v):null; } catch{return null;} })() || "admin123";
    if (cur !== stored)          { setErr("Current password is incorrect.");       return; }
    if (nw.length < 6)           { setErr("New password must be at least 6 characters."); return; }
    if (nw !== cnf)              { setErr("Passwords do not match.");               return; }
    onSetPassword(nw);
    setCur(""); setNw(""); setCnf("");
    addToast("✅ Password updated successfully!");
  };

  return (
    <div className={`settings-card ${light?"settings-light":""}`}>
      <h3>🔑 Change Admin Password</h3>
      <p className={`settings-sub ${light?"text-light":""}`}>Update the password used to access the admin dashboard.</p>

      <div className="form-group" style={{position:"relative"}}>
        <div className="pw-input-wrap">
          <input className={`inp ${light?"inp-light":""}`} type={show?"text":"password"} value={cur} onChange={e=>setCur(e.target.value)} placeholder="Current password"/>
          <button className="pw-eye" onClick={()=>setShow(s=>!s)}>{show?"🙈":"👁"}</button>
        </div>
      </div>
      <div className="form-grid2">
        <div className="form-group">
          <input className={`inp ${light?"inp-light":""}`} type={show?"text":"password"} value={nw} onChange={e=>setNw(e.target.value)} placeholder="New password"/>
        </div>
        <div className="form-group">
          <input className={`inp ${light?"inp-light":""}`} type={show?"text":"password"} value={cnf} onChange={e=>setCnf(e.target.value)} placeholder="Confirm new password" onKeyDown={e=>e.key==="Enter"&&handleSave()}/>
        </div>
      </div>
      {err && <div className="err-msg" style={{marginBottom:10}}>{err}</div>}
      <button className="btn-submit" style={{width:"auto",padding:"10px 28px"}} onClick={handleSave}>Save Password</button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ADMIN PANEL
// ─────────────────────────────────────────────────────────────
function AdminPanel({ books, categories, students, requests, requestCode, onAddBook, onEditBook, onDeleteBook, onAddCat, onEditCat, onDeleteCat, onAddStudent, onEditStudent, onDeleteStudent, onSetCode, onSetPassword, onLogout, addToast, onBack, light }) {
  const [tab, setTab] = useState("books");
  const [showBookForm, setShowBookForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [showCatForm, setShowCatForm] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [showImport, setShowImport] = useState(false);
  const [newCode, setNewCode] = useState(requestCode);
  const [confirmDelete, setConfirmDelete] = useState(null); // { type:"book"|"student"|"cat", id, label }

  const adminTabs = [
    { id:"books",      label:"📚 Books"      },
    { id:"students",   label:"🎓 Students"   },
    { id:"requests",   label:"📋 Requests"   },
    { id:"categories", label:"🗂 Categories" },
    { id:"settings",   label:"⚙️ Settings"  },
  ];

  return (
    <Page className={`admin-page ${light?"page-light":""}`}>
      <CineBG light={light}/>
      <div className="admin-wrap">
        <div className="admin-header">
          <div className="ah-left">
            <button className="back-btn" onClick={onBack}>← Back</button>
            <h1 className={`ah-title ${light?"text-light-strong":""}`}>Admin Dashboard</h1>
          </div>
          <button className="btn-logout" onClick={onLogout}>Sign Out</button>
        </div>
        <div className="admin-tabs">
          {adminTabs.map(t=>(
            <button key={t.id} className={`atab ${tab===t.id?"atab-active":""} ${light?"atab-light":""}`} onClick={()=>setTab(t.id)}>{t.label}</button>
          ))}
        </div>

        {tab==="books" && (
          <div className="admin-section anim-fade">
            <div className="as-header">
              <h2 className={light?"text-light-strong":""}>Manage Books</h2>
              <div className="as-btn-group">
                <button className={`btn-import ${showImport?"btn-import-active":""}`} onClick={()=>setShowImport(v=>!v)}>
                  📥 Import Excel
                </button>
                <button className="btn-add" onClick={()=>{ setEditingBook(null); setShowBookForm(true); }}>+ Add Book</button>
              </div>
            </div>
            {showImport && (
              <ExcelImportModal
                light={light}
                categories={categories}
                existingBooks={books}
                onImport={newBooks=>{
                  newBooks.forEach(b => onAddBook(b));
                  addToast(`✅ ${newBooks.length} book${newBooks.length!==1?"s":""} imported successfully!`);
                  setShowImport(false);
                }}
                onClose={()=>setShowImport(false)}
              />
            )}
            <div className="admin-table-wrap">
              <table className={`admin-table ${light?"admin-table-light":""}`}>
                <thead><tr><th>Serial</th><th>Title — العنوان</th><th>Author</th><th>Publisher</th><th>Vol.</th><th>Status</th><th>Borrowed By</th><th>Actions</th></tr></thead>
                <tbody>
                  {books.map(b=>{
                    const cat=categories.find(c=>c.id===b.categoryId);
                    return (
                      <tr key={b.id}>
                        <td><span className="tserial">{b.serial}</span></td>
                        <td><div className="tb-title"><span className="tb-ar">{b.titleAr}</span><span className="tb-en">{b.titleEn}</span></div></td>
                        <td>{b.authorEn}</td>
                        <td>{b.publisher||<em style={{color:"#888"}}>—</em>}</td>
                        <td>{b.volumes}</td>
                        <td><span className={`tstat ${b.status==="available"?"ts-av":"ts-un"}`}>{b.status}</span></td>
                        <td>{b.borrowedBy||<em style={{color:"#888"}}>—</em>}</td>
                        <td>
                          <div className="tactions">
                            <button className="ta-btn" onClick={()=>{ setEditingBook(b); setShowBookForm(true); }}>✏️</button>
                            {confirmDelete?.id===b.id ? (
                              <span className="del-confirm-row">
                                <span className="del-confirm-label">Delete?</span>
                                <button className="ta-btn ta-del-yes" onClick={()=>{ onDeleteBook(b.id); addToast("Book deleted","error"); setConfirmDelete(null); }}>Yes</button>
                                <button className="ta-btn ta-del-no"  onClick={()=>setConfirmDelete(null)}>No</button>
                              </span>
                            ) : (
                              <button className="ta-btn ta-del" onClick={()=>setConfirmDelete({type:"book",id:b.id})}>🗑</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab==="students" && (
          <div className="admin-section anim-fade">
            <div className="as-header">
              <h2 className={light?"text-light-strong":""}>Students</h2>
              <button className="btn-add" onClick={()=>{ setEditingStudent(null); setShowStudentForm(true); }}>+ Add Student</button>
            </div>
            {showStudentForm && (
              <StudentForm
                light={light}
                student={editingStudent}
                onSave={s=>{
                  if (editingStudent) { onEditStudent(s); addToast("Student updated!"); }
                  else { onAddStudent(s); addToast("Student added!"); }
                  setShowStudentForm(false); setEditingStudent(null);
                }}
                onClose={()=>{ setShowStudentForm(false); setEditingStudent(null); }}
              />
            )}
            <div className="admin-table-wrap">
              <table className={`admin-table ${light?"admin-table-light":""}`}>
                <thead><tr><th>#</th><th>Name</th><th>Class</th><th>Code</th><th>Actions</th></tr></thead>
                <tbody>
                  {students.map((s,i)=>(
                    <tr key={s.id}>
                      <td>{i+1}</td>
                      <td>{s.name}</td>
                      <td>{s.class}</td>
                      <td><span style={{fontFamily:"monospace",letterSpacing:"0.15em",color:"#c8922a",fontWeight:700}}>{s.code||"—"}</span></td>
                      <td>
                        <div className="tactions">
                          {confirmDelete?.id===s.id ? (
                            <span className="del-confirm-row">
                              <span className="del-confirm-label">Remove?</span>
                              <button className="ta-btn ta-del-yes" onClick={()=>{ onDeleteStudent(s.id); addToast("Student removed","error"); setConfirmDelete(null); }}>Yes</button>
                              <button className="ta-btn ta-del-no"  onClick={()=>setConfirmDelete(null)}>No</button>
                            </span>
                          ) : (
                            <>
                              <button className="ta-btn" onClick={()=>{ setEditingStudent(s); setShowStudentForm(true); }}>✏️</button>
                              <button className="ta-btn ta-del" onClick={()=>setConfirmDelete({type:"student",id:s.id})}>🗑</button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab==="requests" && (
          <div className="admin-section anim-fade">
            <h2 className={light?"text-light-strong":""}>Book Requests — الطلبات</h2>
            {requests.length===0
              ? <p className={`empty-msg ${light?"text-light":""}`}>No requests yet.</p>
              : <div className="admin-table-wrap">
                  <table className={`admin-table ${light?"admin-table-light":""}`}>
                    <thead><tr><th>Date</th><th>Book</th><th>Student</th><th>Class</th></tr></thead>
                    <tbody>
                      {requests.map((r,i)=>(
                        <tr key={i}>
                          <td>{r.date}</td>
                          <td><div className="tb-title"><span className="tb-ar">{r.bookTitleAr}</span><span className="tb-en">{r.bookTitle}</span></div></td>
                          <td>{r.studentName}</td><td>{r.studentClass}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
            }
          </div>
        )}

        {tab==="categories" && (
          <div className="admin-section anim-fade">
            <div className="as-header">
              <h2 className={light?"text-light-strong":""}>Categories</h2>
              <button className="btn-add" onClick={()=>{ setEditingCat(null); setShowCatForm(true); }}>+ Add Category</button>
            </div>
            {showCatForm && (
              <CatForm
                light={light}
                cat={editingCat}
                onSave={c=>{
                  if (editingCat) { onEditCat(c); addToast("Category updated!"); }
                  else { onAddCat(c); addToast("Category added!"); }
                  setShowCatForm(false); setEditingCat(null);
                }}
                onClose={()=>{ setShowCatForm(false); setEditingCat(null); }}
              />
            )}
            <div className="cats-admin-grid">
              {categories.map(c=>(
                <div key={c.id} className={`cat-admin-card ${light?"cac-light":""}`} style={{borderColor:c.color+"44"}}>
                  <div className="cac-dot" style={{background:c.color}}/>
                  <div className="cac-info">
                    <span className="cac-name">{c.name}</span>
                    <span className="cac-code" style={{color:c.color}}>{c.code}-  ·  {books.filter(b=>b.categoryId===c.id).length} books</span>
                  </div>
                  <div className="tactions" style={{marginLeft:"auto"}}>
                    <button className="ta-btn" onClick={()=>{ setEditingCat(c); setShowCatForm(true); }}>✏️</button>
                    {confirmDelete?.id===c.id ? (
                      <span className="del-confirm-row">
                        <span className="del-confirm-label">Remove?</span>
                        <button className="ta-btn ta-del-yes" onClick={()=>{ onDeleteCat(c.id); addToast("Removed","error"); setConfirmDelete(null); }}>Yes</button>
                        <button className="ta-btn ta-del-no"  onClick={()=>setConfirmDelete(null)}>No</button>
                      </span>
                    ) : (
                      <button className="ta-btn ta-del" onClick={()=>setConfirmDelete({type:"cat",id:c.id})}>🗑</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==="settings" && (
          <div className="admin-section anim-fade">
            <h2 className={light?"text-light-strong":""}>Settings — الإعدادات</h2>
            {/* ── Change Password ── */}
            <PasswordChangeCard light={light} onSetPassword={onSetPassword} addToast={addToast}/>
          </div>
        )}
      </div>

      {showBookForm && (
        <BookFormModal book={editingBook} categories={categories} books={books} light={light}
          onSave={data=>{ editingBook?onEditBook(data):onAddBook(data); addToast(editingBook?"Book updated!":"Book added!"); setShowBookForm(false); }}
          onClose={()=>setShowBookForm(false)}/>
      )}
    </Page>
  );
}

// ─────────────────────────────────────────────────────────────
// EXCEL IMPORT MODAL
// ─────────────────────────────────────────────────────────────
function ExcelImportModal({ categories, existingBooks, onImport, onClose, light }) {
  const [step, setStep]       = useState("upload");   // upload | preview | done
  const [rows, setRows]       = useState([]);          // parsed preview rows
  const [selected, setSelected] = useState([]);        // checked row indices
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef               = useRef(null);

  // ── Parse an .xlsx / .xls / .csv file via SheetJS loaded dynamically ──
  const parseFile = async (file) => {
    setError(""); setLoading(true);
    try {
      // Load SheetJS from CDN if not already present
      if (!window.XLSX) {
        await new Promise((res, rej) => {
          const s = document.createElement("script");
          s.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
          s.onload = res; s.onerror = rej;
          document.head.appendChild(s);
        });
      }
      const XLSX = window.XLSX;
      const buf  = await file.arrayBuffer();
      const wb   = XLSX.read(buf, { type:"array" });
      const ws   = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws, { defval:"" });

      if (!data.length) { setError("The sheet appears to be empty."); setLoading(false); return; }

      // Flexible column mapping — case-insensitive, accept common variants
      const col = (row, ...keys) => {
        for (const k of keys) {
          const found = Object.keys(row).find(rk => rk.trim().toLowerCase() === k.toLowerCase());
          if (found && row[found] !== "") return String(row[found]).trim();
        }
        return "";
      };

      const parsed = data.map((row, i) => {
        const titleEn  = col(row,"title","title (english)","title_en","book title","kitab","كتاب");
        const titleAr  = col(row,"arabic title","title (arabic)","title_ar","arabic","العنوان","عنوان");
        const authorEn = col(row,"author","author (english)","author_en","writer");
        const authorAr = col(row,"arabic author","author (arabic)","author_ar","المؤلف","مؤلف");
        const category = col(row,"category","field","subject","الفئة","تصنيف");
        const serial   = col(row,"serial","serial number","serial_number","s/n","الرقم","رقم");
        const volumes  = col(row,"volumes","volume","vol","مجلدات","عدد المجلدات") || "1";
        const publisher= col(row,"publisher","dar","دار","ناشر");

        // Try to match category string to existing category
        const matchedCat = categories.find(c =>
          c.name.toLowerCase().includes(category.toLowerCase()) ||
          category.toLowerCase().includes(c.name.toLowerCase()) ||
          c.code.toLowerCase() === category.toLowerCase()
        ) || null;

        return {
          _rowNum: i+2,
          _valid: !!(titleEn || titleAr),
          titleEn, titleAr, authorEn, authorAr,
          publisher,
          categoryRaw: category,
          categoryId: matchedCat?.id || categories[0]?.id || 1,
          serialRaw: serial,
          volumes: parseInt(volumes)||1,
        };
      }).filter(r => r._valid);

      if (!parsed.length) {
        setError("No valid book rows found. Make sure your sheet has a 'Title' column.");
        setLoading(false); return;
      }

      setRows(parsed);
      setSelected(parsed.map((_,i) => i));  // select all by default
      setStep("preview");
    } catch(e) {
      setError("Could not read file. Please use .xlsx, .xls or .csv format.");
    }
    setLoading(false);
  };

  const toggleRow  = i => setSelected(s => s.includes(i) ? s.filter(x=>x!==i) : [...s,i]);
  const toggleAll  = () => setSelected(s => s.length===rows.length ? [] : rows.map((_,i)=>i));

  const handleImport = () => {
    const toAdd = selected.map(i => {
      const r = rows[i];
      const cat = categories.find(c => c.id === r.categoryId);
      // Build serial: if raw serial already has code prefix, use as-is, else prefix with cat code
      let serial = r.serialRaw;
      if (cat && serial && !serial.startsWith(cat.code+"-")) serial = `${cat.code}-${serial}`;
      else if (!serial) serial = `${cat?.code||"x"}-${Date.now()+i}`;
      // Skip if serial already exists
      if (existingBooks.some(b => b.serial === serial)) serial = serial+"-imp";
      return {
        id: Date.now() + i + Math.random(),
        titleEn:  r.titleEn,
        titleAr:  r.titleAr,
        authorEn: r.authorEn,
        authorAr: r.authorAr,
        publisher:r.publisher,
        categoryId: r.categoryId,
        serial,
        volumes: r.volumes,
        status: "available",
        cover: null, pdf: null,
        descAr:"", descEn:"",
        reviews:[], borrowedBy:null,
      };
    });
    onImport(toAdd);
  };

  // ── UPLOAD STEP ──
  if (step === "upload") return (
    <div className={`excel-import-panel ${light?"eip-light":""}`}>
      <div className="eip-header">
        <div className="eip-title-row">
          <span className="eip-icon">📥</span>
          <div>
            <h3 className="eip-title">Import Books from Excel</h3>
            <p className="eip-sub">Upload an .xlsx, .xls or .csv file — books will be added automatically</p>
          </div>
          <button className="eip-close" onClick={onClose}>×</button>
        </div>
      </div>

      {/* Template guide */}
      <div className={`eip-guide ${light?"eip-guide-l":""}`}>
        <p className="eig-label">📋 Your Excel file should have these columns (column names are flexible):</p>
        <div className="eig-cols">
          {[
            {col:"Title",        req:true,  hint:"Book name in English"},
            {col:"Arabic Title", req:false, hint:"اسم الكتاب بالعربية"},
            {col:"Author",       req:false, hint:"Author in English"},
            {col:"Arabic Author",req:false, hint:"المؤلف بالعربية"},
            {col:"Category",     req:false, hint:"e.g. Fiqh & Rulings"},
            {col:"Serial Number",req:false, hint:"e.g. 5  or  f-5"},
            {col:"Volumes",      req:false, hint:"Number of volumes"},
            {col:"Publisher",    req:false, hint:"Publisher name"},
          ].map(c=>(
            <div key={c.col} className={`eig-col ${light?"eig-col-l":""}`}>
              <span className="eig-col-name">{c.col}{c.req&&<span className="eig-req">*</span>}</span>
              <span className="eig-col-hint">{c.hint}</span>
            </div>
          ))}
        </div>
        <p className="eig-note">💡 Only <strong>Title</strong> is required. Other fields can be filled in later by editing each book.</p>
      </div>

      {/* Drop zone */}
      <div
        className={`eip-dropzone ${light?"edz-light":""}`}
        onClick={()=>fileRef.current?.click()}
        onDragOver={e=>e.preventDefault()}
        onDrop={e=>{ e.preventDefault(); const f=e.dataTransfer.files[0]; if(f) parseFile(f); }}
      >
        {loading ? (
          <div className="eip-loading"><div className="eip-spinner"/><span>Reading file…</span></div>
        ) : (
          <>
            <div className="edz-icon">📊</div>
            <p className="edz-main">Click to browse or drag & drop your Excel file here</p>
            <p className="edz-sub">.xlsx  ·  .xls  ·  .csv</p>
          </>
        )}
        <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" style={{display:"none"}}
          onChange={e=>{ if(e.target.files[0]) parseFile(e.target.files[0]); }}/>
      </div>

      {error && <div className="eip-error">⚠ {error}</div>}
    </div>
  );

  // ── PREVIEW STEP ──
  return (
    <div className={`excel-import-panel ${light?"eip-light":""}`}>
      <div className="eip-header">
        <div className="eip-title-row">
          <span className="eip-icon">✅</span>
          <div>
            <h3 className="eip-title">Preview — {rows.length} books found</h3>
            <p className="eip-sub">{selected.length} of {rows.length} selected for import</p>
          </div>
          <button className="eip-close" onClick={onClose}>×</button>
        </div>
      </div>

      <div className={`eip-preview-wrap ${light?"epw-light":""}`}>
        <div className="eip-preview-toolbar">
          <label className={`eip-chk-all ${light?"eca-light":""}`}>
            <input type="checkbox" checked={selected.length===rows.length} onChange={toggleAll}/>
            <span>Select all</span>
          </label>
          <span className={`eip-sel-count ${light?"esc-light":""}`}>{selected.length} selected</span>
        </div>

        <div className="eip-rows">
          {rows.map((r,i)=>{
            const cat = categories.find(c=>c.id===r.categoryId);
            const isSel = selected.includes(i);
            const dup = existingBooks.some(b =>
              b.titleEn?.toLowerCase()===r.titleEn?.toLowerCase() && r.titleEn
            );
            return (
              <div key={i} className={`eip-row ${isSel?"eip-row-sel":""} ${dup?"eip-row-dup":""} ${light?"eip-row-l":""}`}>
                <input type="checkbox" className="eip-row-chk" checked={isSel} onChange={()=>toggleRow(i)}/>
                <div className="eip-row-cover" style={{"--cc":cat?.color||"#c8922a"}}>📖</div>
                <div className="eip-row-info">
                  <div className="eip-row-titles">
                    {r.titleAr && <span className="eip-row-ar">{r.titleAr}</span>}
                    <span className="eip-row-en">{r.titleEn||<em>No English title</em>}</span>
                  </div>
                  <div className="eip-row-meta">
                    {r.authorEn && <span>✍ {r.authorEn}</span>}
                    {r.authorAr && <span className="eip-meta-ar">{r.authorAr}</span>}
                    <span className="eip-meta-cat" style={{color:cat?.color}}>🗂 {cat?.name||r.categoryRaw||"Uncategorised"}</span>
                    {r.serialRaw && <span>🔢 {r.serialRaw}</span>}
                    <span>📚 {r.volumes} vol.</span>
                    {r.publisher && <span>🏛 {r.publisher}</span>}
                  </div>
                  {dup && <span className="eip-dup-warn">⚠ Possible duplicate — a book with this title already exists</span>}
                </div>
                {/* Category override */}
                <select
                  className={`eip-cat-sel ${light?"ecs-light":""}`}
                  value={r.categoryId}
                  onChange={e=>{
                    const updated=[...rows]; updated[i]={...updated[i],categoryId:parseInt(e.target.value)};
                    setRows(updated);
                  }}
                >
                  {categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            );
          })}
        </div>
      </div>

      <div className="eip-footer">
        <button className={`btn-sec ${light?"btn-sec-light":""}`} onClick={()=>setStep("upload")}>← Back</button>
        <button
          className="btn-submit"
          style={{width:"auto",padding:"10px 28px"}}
          disabled={!selected.length}
          onClick={handleImport}
        >
          Import {selected.length} Book{selected.length!==1?"s":""}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// BOOK FORM MODAL
// ─────────────────────────────────────────────────────────────
function BookFormModal({ book, categories, books, onSave, onClose, light }) {
  const isEdit = !!book;
  const [f, setF] = useState(book || { titleAr:"", titleEn:"", authorAr:"", authorEn:"", publisher:"", descAr:"", descEn:"", volumes:1, categoryId:categories[0]?.id||1, status:"available", serialNum:"", cover:null, pdf:null, reviews:[], borrowedBy:null });
  const [prev, setPrev] = useState(book?.cover||null);
  const handleSave = () => {
    if (!f.titleAr||!f.titleEn||!f.serialNum) return;
    const cat = categories.find(c=>c.id===parseInt(f.categoryId));
    const serial = `${cat?.code}-${f.serialNum}`;
    if (!isEdit&&books.some(b=>b.serial===serial)) { alert("Serial already exists!"); return; }
    onSave({ ...f, serial, categoryId:parseInt(f.categoryId), volumes:parseInt(f.volumes), id:book?.id||Date.now() });
  };
  return (
    <div className="modal-overlay">
      <div className={`modal-box ${light?"modal-light":""}`}>
        <div className="modal-hdr">
          <h2>{isEdit?"✏️ Edit Book":"➕ Add Book"}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="form-grid2">
          <div className="form-group"><label className={light?"label-light":""}>Arabic Title *</label><input className={`inp ${light?"inp-light":""}`} value={f.titleAr} onChange={e=>setF(p=>({...p,titleAr:e.target.value}))} dir="rtl" placeholder="اسم الكتاب"/></div>
          <div className="form-group"><label className={light?"label-light":""}>English Title *</label><input className={`inp ${light?"inp-light":""}`} value={f.titleEn} onChange={e=>setF(p=>({...p,titleEn:e.target.value}))} placeholder="Book title"/></div>
          <div className="form-group"><label className={light?"label-light":""}>Arabic Author</label><input className={`inp ${light?"inp-light":""}`} value={f.authorAr} onChange={e=>setF(p=>({...p,authorAr:e.target.value}))} dir="rtl" placeholder="المؤلف"/></div>
          <div className="form-group"><label className={light?"label-light":""}>English Author</label><input className={`inp ${light?"inp-light":""}`} value={f.authorEn} onChange={e=>setF(p=>({...p,authorEn:e.target.value}))} placeholder="Author name"/></div>
          <div className="form-group"><label className={light?"label-light":""}>Publisher</label><input className={`inp ${light?"inp-light":""}`} value={f.publisher} onChange={e=>setF(p=>({...p,publisher:e.target.value}))} placeholder="e.g. Dar Ibn Kathir"/></div>
          <div className="form-group"><label className={light?"label-light":""}>Borrowed By</label><input className={`inp ${light?"inp-light":""}`} value={f.borrowedBy||""} onChange={e=>setF(p=>({...p,borrowedBy:e.target.value||null}))} placeholder="Student name (if checked out)"/></div>
          <div className="form-group"><label className={light?"label-light":""}>Category</label>
            <select className={`inp ${light?"inp-light":""}`} value={f.categoryId} onChange={e=>setF(p=>({...p,categoryId:e.target.value}))}>
              {categories.map(c=><option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
            </select>
          </div>
          <div className="form-group"><label className={light?"label-light":""}>Serial Number *</label><input className={`inp ${light?"inp-light":""}`} type="number" value={f.serialNum} onChange={e=>setF(p=>({...p,serialNum:e.target.value}))} placeholder="e.g. 3"/></div>
          <div className="form-group"><label className={light?"label-light":""}>Volumes</label><input className={`inp ${light?"inp-light":""}`} type="number" value={f.volumes} onChange={e=>setF(p=>({...p,volumes:e.target.value}))} min="1"/></div>
          <div className="form-group"><label className={light?"label-light":""}>Status</label>
            <select className={`inp ${light?"inp-light":""}`} value={f.status} onChange={e=>setF(p=>({...p,status:e.target.value}))}>
              <option value="available">Available</option><option value="unavailable">Unavailable</option>
            </select>
          </div>
        </div>
        <div className="form-group"><label className={light?"label-light":""}>Arabic Description</label><textarea className={`inp ${light?"inp-light":""}`} rows={2} value={f.descAr} onChange={e=>setF(p=>({...p,descAr:e.target.value}))} dir="rtl"/></div>
        <div className="form-group"><label className={light?"label-light":""}>English Description</label><textarea className={`inp ${light?"inp-light":""}`} rows={2} value={f.descEn} onChange={e=>setF(p=>({...p,descEn:e.target.value}))}/></div>
        <div className="form-group">
          <label className={light?"label-light":""}>Cover Image</label>
          <div className="cover-upload">
            {prev?<img src={prev} className="cover-prev" alt=""/>:<div className="cup">🖼 Upload Cover</div>}
            <input type="file" accept="image/*" className="file-inp" onChange={e=>{ const r=new FileReader(); r.onload=ev=>{ setPrev(ev.target.result); setF(p=>({...p,cover:ev.target.result})); }; if(e.target.files[0]) r.readAsDataURL(e.target.files[0]); }}/>
          </div>
        </div>
        <div className="modal-footer">
          <button className={`btn-sec ${light?"btn-sec-light":""}`} onClick={onClose}>Cancel</button>
          <button className="btn-submit" onClick={handleSave} style={{width:"auto",padding:"10px 28px"}}>{isEdit?"Save Changes":"Add Book"}</button>
        </div>
      </div>
    </div>
  );
}

function StudentForm({ onSave, onClose, light, student }) {
  const isEdit = !!student;
  const [f, setF] = useState(
    student
      ? { name:student.name, class:student.class, code:student.code||"" }
      : { name:"", class:"", code:"" }
  );
  const valid = f.name.trim() && f.class.trim() && f.code.length===4 && /^\d{4}$/.test(f.code);
  return (
    <div className={`inline-form ${light?"inline-form-light":""}`}>
      <div className="form-grid2">
        <div className="form-group">
          <label className={light?"label-light":""}>Full Name</label>
          <input className={`inp ${light?"inp-light":""}`} value={f.name} onChange={e=>setF(p=>({...p,name:e.target.value}))} placeholder="Student full name"/>
        </div>
        <div className="form-group">
          <label className={light?"label-light":""}>Class / Grade</label>
          <input className={`inp ${light?"inp-light":""}`} value={f.class} onChange={e=>setF(p=>({...p,class:e.target.value}))} placeholder="Grade 10 - A"/>
        </div>
        <div className="form-group">
          <label className={light?"label-light":""}>4-Digit Access Code</label>
          <input className={`inp inp-code ${light?"inp-light":""}`} value={f.code} onChange={e=>setF(p=>({...p,code:e.target.value.replace(/\D/g,"").slice(0,4)}))} maxLength={4} placeholder="0000" style={{letterSpacing:"0.2em",fontFamily:"monospace"}}/>
        </div>
      </div>
      <div className="modal-footer" style={{paddingTop:0,marginTop:0}}>
        <button className={`btn-sec ${light?"btn-sec-light":""}`} onClick={onClose}>Cancel</button>
        <button className="btn-submit" onClick={()=>{ if(valid) onSave({ ...(student||{}), ...f, id:student?.id||Date.now() }); }} disabled={!valid} style={{width:"auto",padding:"10px 24px"}}>{isEdit?"Save":"Add"}</button>
      </div>
    </div>
  );
}

function CatForm({ onSave, onClose, light, cat }) {
  const isEdit = !!cat;
  const [f, setF] = useState(cat ? { name:cat.name, code:cat.code, color:cat.color } : { name:"", code:"", color:"#c8922a" });
  return (
    <div className={`inline-form ${light?"inline-form-light":""}`}>
      <div className="form-grid2">
        <div className="form-group"><label className={light?"label-light":""}>Category Name</label><input className={`inp ${light?"inp-light":""}`} value={f.name} onChange={e=>setF(p=>({...p,name:e.target.value}))} placeholder="e.g. Islamic Philosophy"/></div>
        <div className="form-group"><label className={light?"label-light":""}>Short Code</label><input className={`inp ${light?"inp-light":""}`} value={f.code} onChange={e=>setF(p=>({...p,code:e.target.value.toLowerCase()}))} maxLength={4} placeholder="e.g. p"/></div>
        <div className="form-group"><label className={light?"label-light":""}>Color</label><input type="color" className="color-inp" value={f.color} onChange={e=>setF(p=>({...p,color:e.target.value}))}/><span style={{marginLeft:8,fontSize:".8rem",color:f.color,fontWeight:600}}>{f.color}</span></div>
      </div>
      <div className="modal-footer" style={{paddingTop:0,marginTop:0}}>
        <button className={`btn-sec ${light?"btn-sec-light":""}`} onClick={onClose}>Cancel</button>
        <button className="btn-submit" onClick={()=>{ if(f.name&&f.code) onSave({ ...f, id: cat?.id||Date.now() }); }} style={{width:"auto",padding:"10px 24px"}}>{isEdit?"Save Changes":"Add"}</button>
      </div>
    </div>
  );
}

function LoginModal({ onLogin, onClose, adminPassword }) {
  const [p,setP]=useState(""); const [err,setErr]=useState("");
  const attempt = () => p===adminPassword ? onLogin() : setErr("Invalid password");
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e=>e.stopPropagation()}>
        <div className="modal-hdr"><h2>🔐 Admin Login</h2><button className="modal-close" onClick={onClose}>×</button></div>
        <div className="form-group"><input className="inp" type="password" value={p} onChange={e=>setP(e.target.value)} onKeyDown={e=>e.key==="Enter"&&attempt()} placeholder="Password"/></div>
        {err&&<div className="err-msg">{err}</div>}
        <button className="btn-submit" onClick={attempt}>Login</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("intro");       // intro | main | detail | admin
  const [subPage, setSubPage] = useState("catalog"); // catalog | categories
  const [isAdmin, setIsAdmin] = useState(false);
  const [candleOn, setCandleOn] = useState(false);  // true = light theme
  const [books, setBooks] = useLS("lib-books", INIT_BOOKS);
  const [categories, setCategories] = useLS("lib-cats", INIT_CATS);
  const [students, setStudents] = useLS("lib-students", INIT_STUDENTS);
  const [requests, setRequests] = useLS("lib-requests", []);
  const [requestCode, setRequestCode] = useLS("lib-code", DEFAULT_CODE);
  const [adminPassword, setAdminPassword] = useLS("lib-admin-pw", ADMIN.password);
  const [selectedBook, setSelectedBook] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [prevPage, setPrevPage] = useState("main");

  const light = candleOn; // candle ON = light theme

  const addToast = useCallback((msg, type="success") => {
    const id = Date.now();
    setToasts(t=>[...t,{id,message:msg,type}]);
    setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)), 3500);
  }, []);

  const goBook = (book) => { setSelectedBook(book); setPrevPage(page==="admin"?"admin":"main"); setPage("detail"); };
  const goBack = () => setPage(prevPage==="admin"?"admin":"main");

  useEffect(() => {
    document.body.style.margin="0"; document.body.style.overflowX="hidden";
    document.body.style.background = light ? "#f5efe6" : "#000";
  }, [light]);

  const sharedHeaderProps = {
    activePage: subPage,
    setActivePage: (p) => { setSubPage(p); setPage("main"); },
    candleOn, setCandleOn, isAdmin,
    onAdminClick: ()=>setPage("admin"),
    onLoginClick: ()=>setShowLogin(true),
    onLogout: ()=>{ setIsAdmin(false); addToast("Signed out"); },
    light,
  };

  return (
    <>
      <GlobalStyles light={light}/>
      {page==="intro" && <IntroPage onEnter={()=>setPage("main")}/>}

      {page==="main" && (
        <>
          <AppHeader {...sharedHeaderProps}/>
          {subPage==="catalog" && (
            <CatalogPage books={books} categories={categories} isAdmin={isAdmin} onBookClick={goBook}
              onAdminClick={()=>setPage("admin")} onLoginClick={()=>setShowLogin(true)}
              candleOn={candleOn} setCandleOn={setCandleOn} onLogout={()=>{ setIsAdmin(false); addToast("Signed out"); }}
              light={light}/>
          )}
          {subPage==="categories" && (
            <CategoriesPage books={books} categories={categories} onBookClick={goBook} light={light}/>
          )}
        </>
      )}

      {page==="detail" && selectedBook && (
        <>
          <AppHeader {...sharedHeaderProps}/>
          <BookDetailPage
            book={selectedBook}
            category={categories.find(c=>c.id===selectedBook.categoryId)}
            isAdmin={isAdmin} students={students} requestCode={requestCode}
            onRequest={req=>{ setRequests(r=>[...r,req]); addToast("Request submitted — جزاك الله خيراً!"); }}
            onUpdateBook={updated=>{ setBooks(bs=>bs.map(b=>b.id===updated.id?updated:b)); setSelectedBook(updated); }}
            onBack={goBack} addToast={addToast} light={light}/>
        </>
      )}

      {page==="admin" && (
        <>
          <AppHeader {...sharedHeaderProps}/>
          <AdminPanel
            books={books} categories={categories} students={students} requests={requests} requestCode={requestCode}
            onAddBook={b=>setBooks(bs=>[...bs,b])}
            onEditBook={b=>setBooks(bs=>bs.map(x=>x.id===b.id?b:x))}
            onDeleteBook={id=>setBooks(bs=>bs.filter(b=>b.id!==id))}
            onAddCat={c=>setCategories(cs=>[...cs,c])}
            onEditCat={c=>setCategories(cs=>cs.map(x=>x.id===c.id?c:x))}
            onDeleteCat={id=>setCategories(cs=>cs.filter(c=>c.id!==id))}
            onAddStudent={s=>setStudents(ss=>[...ss,s])}
            onEditStudent={s=>setStudents(ss=>ss.map(x=>x.id===s.id?s:x))}
            onDeleteStudent={id=>setStudents(ss=>ss.filter(s=>s.id!==id))}
            onSetCode={setRequestCode}
            onSetPassword={setAdminPassword}
            onLogout={()=>{ setIsAdmin(false); setPage("main"); addToast("Signed out"); }}
            addToast={addToast} onBack={()=>setPage("main")} light={light}
            isAdmin={isAdmin}/>
        </>
      )}

      {showLogin && (
        <LoginModal
          onLogin={()=>{ setIsAdmin(true); setShowLogin(false); addToast("Welcome, Admin 👋"); }}
          onClose={()=>setShowLogin(false)}
          adminPassword={adminPassword}/>
      )}
      <Toast toasts={toasts} remove={id=>setToasts(t=>t.filter(x=>x.id!==id))}/>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// GLOBAL STYLES
// ─────────────────────────────────────────────────────────────
function GlobalStyles({ light }) {
  useEffect(() => {
    let s = document.getElementById("lib-styles");
    if (!s) { s=document.createElement("style"); s.id="lib-styles"; document.head.appendChild(s); }
    s.textContent = buildCSS(light);
  }, [light]);
  useEffect(() => () => document.getElementById("lib-styles")?.remove(), []);
  return null;
}

function buildCSS(light) {
  const DARK = !light;
  return `
@import url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Crimson+Pro:ital,wght@0,300;0,400;0,600&family=Cairo:wght@300;400;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{
  background:${light?"#f5efe6":"#000"};
  color:${light?"#2c1a08":"#e8dcc8"};
  font-family:'Crimson Pro','Amiri',serif;
  direction:ltr;
  transition:background .5s ease,color .4s ease;
}
:root{
  --gold:${light?"#8a5c10":"#d4a843"};
  --gold2:${light?"#c8922a":"#f0cc6a"};
  --em:${light?"#0a6645":"#10b981"};
  --bg-card:${light?"rgba(255,248,235,0.88)":"rgba(4,12,28,0.72)"};
  --border:${light?"rgba(180,120,40,0.22)":"rgba(212,168,67,0.14)"};
  --text:${light?"#2c1a08":"#e8dcc8"};
  --muted:${light?"#7a5020":"#8a7a5a"};
  --blur:blur(22px) saturate(1.3);
}

/* ── PAGE ── */
.page-wrap{opacity:0;transform:translateY(16px);transition:opacity .65s cubic-bezier(.2,1,.3,1),transform .65s cubic-bezier(.2,1,.3,1);min-height:100vh;position:relative;}
.page-in{opacity:1;transform:none;}
.page-light{background:transparent;}
.anim-fade{animation:afade .5s ease both;}
@keyframes afade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}

/* ── CINEMATIC BG DARK ── */
.cine-bg{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden;}
.cine-dark{}
.cd-base{position:absolute;inset:0;background:radial-gradient(ellipse 120% 80% at 50% -10%,#0b1e3a 0%,transparent 60%),radial-gradient(ellipse 80% 60% at 80% 110%,#071a10 0%,transparent 55%),linear-gradient(180deg,#000305 0%,#020c18 35%,#000205 100%);}
.cd-n1{position:absolute;width:65vw;height:55vh;top:-12%;left:-12%;border-radius:50%;background:radial-gradient(ellipse,rgba(13,40,80,.55) 0%,transparent 70%);filter:blur(75px);mix-blend-mode:screen;animation:nbr 22s ease-in-out infinite;}
.cd-n2{position:absolute;width:55vw;height:60vh;bottom:0;right:-15%;border-radius:50%;background:radial-gradient(ellipse,rgba(8,50,30,.42) 0%,transparent 70%);filter:blur(75px);mix-blend-mode:screen;animation:nbr 27s ease-in-out infinite;animation-delay:-9s;}
.cd-n3{position:absolute;width:45vw;height:42vh;top:30%;right:18%;border-radius:50%;background:radial-gradient(ellipse,rgba(45,22,5,.28) 0%,transparent 70%);filter:blur(75px);mix-blend-mode:screen;animation:nbr 20s ease-in-out infinite;animation-delay:-4s;}
@keyframes nbr{0%,100%{transform:scale(1);opacity:.7}50%{transform:scale(1.07) translate(1%,1%);opacity:1}}
.cd-a1{position:absolute;top:4%;left:-20%;right:-20%;height:150px;border-radius:50%;background:linear-gradient(90deg,transparent,rgba(16,185,129,.07),rgba(212,168,67,.05),transparent);filter:blur(40px);opacity:0;mix-blend-mode:screen;animation:arfl 24s ease-in-out infinite;}
.cd-a2{position:absolute;top:10%;left:-20%;right:-20%;height:150px;border-radius:50%;background:linear-gradient(90deg,transparent,rgba(212,168,67,.05),rgba(59,130,246,.04),transparent);filter:blur(40px);opacity:0;mix-blend-mode:screen;animation:arfl 30s ease-in-out infinite;animation-delay:-10s;}
@keyframes arfl{0%{opacity:0;transform:translateX(-5%) scaleY(.8)}15%{opacity:1}50%{transform:translateX(5%) scaleY(1.2);opacity:.8}85%{opacity:.5}100%{opacity:0;transform:translateX(-5%) scaleY(.8)}}
.cd-rays{position:absolute;top:-25%;left:50%;transform:translateX(-50%);width:200%;height:115vh;pointer-events:none;}
.cd-ray{position:absolute;top:0;left:50%;width:2px;height:100%;transform-origin:top center;background:linear-gradient(180deg,rgba(212,168,67,.055) 0%,rgba(212,168,67,.02) 40%,transparent 75%);filter:blur(8px);transform:rotate(calc(-42deg + var(--i)*15deg));animation:ryp 15s ease-in-out infinite;animation-delay:calc(var(--i)*-2.2s);}
@keyframes ryp{0%,100%{opacity:.2;transform:rotate(calc(-42deg + var(--i)*15deg)) scaleX(1)}50%{opacity:.75;transform:rotate(calc(-42deg + var(--i)*15deg)) scaleX(2.2)}}
.const-canvas{position:absolute;inset:0;width:100%;height:100%;opacity:.45;}
.cd-vignette{position:absolute;inset:0;background:radial-gradient(ellipse 100% 100% at 50% 50%,transparent 35%,rgba(0,0,0,.6) 100%),linear-gradient(180deg,rgba(0,0,0,.45) 0%,transparent 18%,transparent 70%,rgba(0,0,0,.65) 100%);}
.cd-mosque{position:fixed;bottom:0;left:0;right:0;height:130px;z-index:1;pointer-events:none;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 130'%3E%3Cpath d='M0 130 L0 90 Q50 80 60 55 Q65 35 70 55 Q75 80 80 90 L110 90 L110 65 Q120 42 130 20 Q135 5 140 20 Q145 42 150 65 L150 90 L170 90 L170 78 Q175 58 180 78 L185 90 L220 90 L220 100 L270 100 L270 78 Q290 46 310 22 Q320 2 330 22 Q340 46 350 78 L350 100 L400 100 L400 90 L415 90 L415 66 Q420 42 428 26 Q433 10 438 26 Q443 42 448 66 L448 90 L460 90 L460 100 L540 100 L540 90 L555 90 L555 54 Q565 20 575 4 Q580 -6 585 4 Q590 20 598 54 L598 90 L610 90 L610 100 L700 100 L700 90 L750 90 L750 78 Q760 58 770 78 L775 90 L810 90 L810 100 L860 100 L860 90 L875 90 L875 66 Q885 34 895 12 Q900 -2 905 12 Q910 34 920 66 L920 90 L940 90 L940 100 L1020 100 L1020 90 L1070 90 L1070 78 Q1080 58 1090 78 L1095 90 L1130 90 L1130 100 L1160 100 L1160 90 L1175 90 L1175 65 Q1180 42 1185 22 Q1190 5 1195 22 Q1198 42 1200 65 L1200 130 Z' fill='%23010912'/%3E%3C/svg%3E") center bottom/cover no-repeat;animation:mfloat 18s ease-in-out infinite;}
@keyframes mfloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}

/* ── CINEMATIC BG LIGHT (Candle/Parchment) ── */
.cine-light{}
.cl-base{position:absolute;inset:0;background:radial-gradient(ellipse 130% 100% at 50% -5%,#fff8ec 0%,#fdf0d5 20%,#f7e8c0 45%,#f0ddb0 70%,#e8d0a0 100%);animation:clbreathe 10s ease-in-out infinite;}
@keyframes clbreathe{0%,100%{filter:brightness(1)}50%{filter:brightness(1.03)}}
/* warm candle-glow from center-bottom */
.cl-candle{position:absolute;bottom:-20%;left:50%;transform:translateX(-50%);width:80vw;height:80vh;border-radius:50%;background:radial-gradient(ellipse at 50% 100%,rgba(255,160,20,.18) 0%,rgba(230,140,20,.09) 35%,transparent 65%);pointer-events:none;animation:candleglow 3.5s ease-in-out infinite;}
@keyframes candleglow{0%,100%{opacity:.75;transform:translateX(-50%) scaleX(1)}50%{opacity:1;transform:translateX(-50%) scaleX(1.06)}}
/* diagonal light rays */
.cl-rays{position:absolute;top:-10%;left:50%;transform:translateX(-50%);width:200%;height:110vh;pointer-events:none;}
.cl-ray{position:absolute;top:0;left:50%;width:3px;height:100%;transform-origin:top center;background:linear-gradient(180deg,rgba(200,146,42,.055) 0%,rgba(200,146,42,.02) 45%,transparent 75%);filter:blur(14px);transform:rotate(calc(-30deg + var(--i)*15deg));animation:ryp 16s ease-in-out infinite;animation-delay:calc(var(--i)*-2.8s);}
/* Islamic geo pattern */
.cl-geo{position:absolute;inset:0;opacity:.04;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cpath d='M40 4 L72 22 L72 58 L40 76 L8 58 L8 22 Z' stroke='%23c8922a' stroke-width='0.6' fill='none'/%3E%3Ccircle cx='40' cy='40' r='14' stroke='%23c8922a' stroke-width='0.3' fill='none'/%3E%3C/svg%3E");background-size:80px 80px;animation:geospin 80s linear infinite;}
@keyframes geospin{from{background-position:0 0}to{background-position:80px 80px}}
.cl-vignette{position:absolute;inset:0;background:radial-gradient(ellipse 110% 110% at 50% 50%,transparent 48%,rgba(160,100,30,.07) 100%),linear-gradient(180deg,rgba(180,130,50,.045) 0%,transparent 18%,transparent 72%,rgba(140,90,20,.08) 100%);}
.cl-shimmer{position:absolute;inset:0;background:linear-gradient(140deg,rgba(255,255,255,.16) 0%,transparent 50%,rgba(255,255,255,.07) 100%);animation:lshin 9s ease-in-out infinite;}
@keyframes lshin{0%,100%{opacity:.5}50%{opacity:1}}
/* Floating golden motes */
.cl-motes{position:absolute;inset:0;pointer-events:none;overflow:hidden;}
.cl-mote{position:absolute;width:3px;height:3px;border-radius:50%;background:rgba(200,146,42,.5);animation:moteup var(--d,10s) ease-in-out var(--del,0s) infinite;}
@keyframes moteup{0%{transform:translateY(0) translateX(0);opacity:0}15%{opacity:.9}80%{opacity:.25}100%{transform:translateY(-85vh) translateX(var(--dx,20px));opacity:0}}

/* ── STARS / DUST ── */
.sf{position:fixed;inset:0;pointer-events:none;z-index:0;}
.star{position:absolute;background:#fff;border-radius:50%;opacity:0;animation:twink var(--dur,4s) ease-in-out infinite;}
@keyframes twink{0%,100%{opacity:0;transform:scale(.8)}50%{opacity:.6;transform:scale(1.2)}}
.dust-wrap{position:absolute;inset:0;pointer-events:none;z-index:1;}
.dp{position:absolute;background:rgba(212,168,67,.45);border-radius:50%;animation:dfloat var(--dur,10s) ease-in-out infinite;}
@keyframes dfloat{0%{transform:translateY(0) translateX(0);opacity:0}25%{opacity:.8}80%{opacity:.35}100%{transform:translateY(-100px) translateX(var(--drift,30px));opacity:0}}

/* ── ORNAMENT ── */
.orn{display:flex;align-items:center;gap:8px;margin:6px auto;}
.orn-line{flex:1;height:1px;background:linear-gradient(90deg,transparent,${light?"rgba(180,120,40,.3)":"rgba(212,168,67,.3)"},transparent);}
.orn-dia{width:6px;height:6px;background:var(--gold);transform:rotate(45deg);box-shadow:0 0 8px rgba(212,168,67,.5);animation:dpulse 2s ease-in-out infinite;}
@keyframes dpulse{0%,100%{box-shadow:0 0 5px rgba(212,168,67,.35)}50%{box-shadow:0 0 16px rgba(212,168,67,.85)}}

/* ── TOAST ── */
.toast-wrap{position:fixed;bottom:24px;left:24px;z-index:9999;display:flex;flex-direction:column;gap:8px;}
.toast{display:flex;align-items:center;gap:10px;padding:10px 16px;border-radius:10px;font-size:.88rem;cursor:pointer;animation:tin .3s ease;backdrop-filter:var(--blur);}
@keyframes tin{from{transform:translateX(-16px);opacity:0}to{opacity:1}}
.toast-success{background:${light?"rgba(10,100,70,.12)":"rgba(16,185,129,.14)"};border:1px solid ${light?"rgba(10,100,70,.3)":"rgba(16,185,129,.28)"};color:var(--em);}
.toast-error{background:rgba(220,38,38,.12);border:1px solid rgba(220,38,38,.28);color:#dc2626;}
.toast-info{background:rgba(37,99,235,.12);border:1px solid rgba(37,99,235,.28);color:#3b82f6;}

/* ── LANTERN ── */
.lantern{position:relative;display:flex;align-items:center;justify-content:center;margin-left:12px;flex-shrink:0;}
.lantern-glow{position:absolute;width:64px;height:64px;border-radius:50%;background:radial-gradient(circle,rgba(255,200,60,.22) 0%,transparent 70%);animation:lglow 8s ease-in-out infinite;pointer-events:none;}
@keyframes lglow{0%,100%{opacity:.55}50%{opacity:1}}
.fl{animation:ffl .3s ease-in-out infinite alternate;}
.fli{animation:ffl .2s ease-in-out infinite alternate-reverse;}
@keyframes ffl{from{transform:scaleX(1) scaleY(1)}to{transform:scaleX(1.1) scaleY(.93)}}

/* ── SCAN LINE ── */
.scan-line{position:fixed;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(212,168,67,.22),transparent);z-index:50;pointer-events:none;animation:scdown 7s ease-in-out infinite;}
@keyframes scdown{0%{top:-2px;opacity:0}5%{opacity:1}95%{opacity:.2}100%{top:102%;opacity:0}}

/* ── MANDALA ── */
.mandala{animation:mspin 60s linear infinite;}
@keyframes mspin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
.mc{animation:mglow 4s ease-in-out infinite;}
@keyframes mglow{0%,100%{opacity:.6}50%{opacity:1}}

/* ── HEADER ── */
.app-header{position:sticky;top:0;z-index:100;border-bottom:1px solid var(--border);backdrop-filter:var(--blur);padding:0 24px;transition:background .5s ease,border-color .4s ease;}
.header-light{background:rgba(245,239,230,.9);box-shadow:0 1px 0 rgba(180,120,40,.1),0 4px 18px rgba(150,100,30,.1);}
.cine-dark ~ .app-header, .app-header:not(.header-light){background:rgba(2,6,16,.8);box-shadow:0 1px 0 rgba(212,168,67,.07),0 4px 24px rgba(0,0,0,.5);}
.header-inner{max-width:1400px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;padding:12px 0;gap:12px;flex-wrap:wrap;}
.header-brand{display:flex;align-items:center;gap:12px;}
.header-title{font-family:'Crimson Pro',serif;font-size:clamp(1rem,2.2vw,1.5rem);font-weight:600;color:var(--gold);text-shadow:${light?"none":"0 0 24px rgba(212,168,67,.4)"};line-height:1.2;}
.header-sub{font-family:'Amiri',serif;font-size:.82rem;color:var(--muted);direction:rtl;}
.header-nav{display:flex;gap:4px;background:${light?"rgba(180,120,40,.1)":"rgba(255,255,255,.04)"};border:1px solid var(--border);border-radius:12px;padding:4px;}
.nav-btn{background:none;border:none;padding:7px 18px;border-radius:8px;color:var(--muted);cursor:pointer;font-family:'Crimson Pro',serif;font-size:.9rem;transition:all .25s;white-space:nowrap;}
.nav-btn:hover{color:var(--text);background:${light?"rgba(180,120,40,.12)":"rgba(255,255,255,.06)"}}
.nav-active{background:${light?"rgba(200,146,42,.2)":"rgba(212,168,67,.14)"} !important;color:var(--gold) !important;font-weight:600;}
.header-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
.btn-candle{background:${light?"rgba(200,146,42,.15)":"rgba(212,168,67,.08)"};border:1px solid var(--border);color:var(--gold);padding:7px 14px;border-radius:20px;cursor:pointer;font-family:inherit;font-size:.82rem;transition:all .3s;}
.btn-candle:hover,.candle-on{background:${light?"rgba(200,146,42,.3)":"rgba(212,168,67,.2)"};box-shadow:0 0 14px rgba(212,168,67,.25);}
.btn-admin-dash{background:${light?"rgba(10,100,70,.1)":"rgba(16,185,129,.1)"};border:1px solid ${light?"rgba(10,100,70,.28)":"rgba(16,185,129,.28)"};color:var(--em);padding:7px 14px;border-radius:20px;cursor:pointer;font-family:inherit;font-size:.82rem;transition:all .3s;}
.btn-admin-dash:hover{background:${light?"rgba(10,100,70,.22)":"rgba(16,185,129,.22)"};}
.btn-logout-sm{background:rgba(220,38,38,.08);border:1px solid rgba(220,38,38,.2);color:#dc2626;padding:7px 12px;border-radius:20px;cursor:pointer;font-family:inherit;font-size:.82rem;transition:all .3s;}
.btn-logout-sm:hover{background:rgba(220,38,38,.18);}

/* ── AYAH BANNER ── */
.ayah-banner{display:flex;align-items:center;justify-content:center;gap:18px;padding:15px 24px;border-bottom:1px solid var(--border);position:relative;z-index:2;overflow:hidden;transition:background .5s ease;}
.ayah-banner:not(.ayah-light){background:rgba(4,12,28,.55);backdrop-filter:var(--blur);}
.ayah-light{background:rgba(245,234,210,.7);backdrop-filter:var(--blur);}
.ayah-banner::before{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,${light?"rgba(200,146,42,.06)":"rgba(212,168,67,.04)"},transparent);animation:ayahshine 8s ease-in-out infinite;}
@keyframes ayahshine{0%,100%{opacity:0;transform:translateX(-100%)}50%{opacity:1;transform:translateX(100%)}}
.ayah-deco{color:var(--gold);opacity:.5;font-size:.95rem;}
.ayah-text{text-align:center;transition:opacity .5s ease,transform .5s ease;}
.ayah-in{opacity:1;transform:translateY(0);}
.ayah-out{opacity:0;transform:translateY(-8px);}
.ayah-ar{display:block;font-family:'Amiri',serif;font-size:clamp(1rem,2.2vw,1.25rem);color:var(--gold);direction:rtl;line-height:1.8;text-shadow:${light?"none":"0 0 18px rgba(212,168,67,.35)"};}
.ayah-ref{display:block;font-size:.76rem;color:var(--muted);margin-top:2px;direction:rtl;}

/* ── CATALOG HERO ── */
.catalog-hero{position:relative;z-index:2;text-align:center;padding:50px 24px 30px;overflow:hidden;}
.ch-light{}
.ch-inner{position:relative;z-index:2;}
.ch-badge{display:inline-block;font-size:.78rem;letter-spacing:.12em;color:var(--gold);border:1px solid var(--border);padding:5px 16px;border-radius:20px;margin-bottom:14px;backdrop-filter:blur(8px);background:${light?"rgba(200,146,42,.1)":"rgba(212,168,67,.08)"};animation:afade .6s ease both;}
.ch-heading{font-family:'Amiri',serif;font-size:clamp(1.8rem,5vw,3.2rem);color:var(--gold);direction:rtl;margin-bottom:10px;text-shadow:${light?"none":"0 0 40px rgba(212,168,67,.35)"};animation:afade .7s ease .1s both;}
.ch-sub{font-size:clamp(.9rem,2vw,1.1rem);color:var(--muted);max-width:500px;margin:0 auto;animation:afade .7s ease .2s both;font-style:italic;}
.ch-heading-light,.ch-sub-light{}
.ch-glow-orb{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:420px;height:200px;border-radius:50%;background:radial-gradient(ellipse,rgba(212,168,67,.06) 0%,transparent 70%);pointer-events:none;animation:orbpulse 6s ease-in-out infinite;}
.ch-glow-orb2{position:absolute;top:60%;left:35%;width:280px;height:150px;border-radius:50%;background:radial-gradient(ellipse,rgba(16,185,129,.04) 0%,transparent 70%);pointer-events:none;animation:orbpulse 8s ease-in-out infinite;animation-delay:-3s;}
@keyframes orbpulse{0%,100%{transform:translate(-50%,-50%) scale(1);opacity:.7}50%{transform:translate(-50%,-50%) scale(1.1);opacity:1}}

/* ── STATS ── */
.stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;max-width:1400px;margin:24px auto 0;padding:0 24px;position:relative;z-index:2;}
.stat-card{border:1px solid var(--border);border-radius:16px;padding:18px;text-align:center;backdrop-filter:var(--blur);box-shadow:${light?"0 2px 14px rgba(180,120,40,.1)":"0 4px 22px rgba(0,0,0,.45),inset 0 1px 0 rgba(255,255,255,.02)"};transition:transform .3s,box-shadow .3s;animation:afade .55s ease both;cursor:default;background:var(--bg-card);}
.stat-card:hover{transform:translateY(-5px);}
.sc-icon{font-size:1.35rem;margin-bottom:7px;}
.sc-val{font-size:1.9rem;font-weight:700;font-family:'Crimson Pro',serif;}
.sc-label{font-size:.78rem;color:var(--muted);margin-top:2px;}
.sc-gold .sc-val{color:var(--gold);text-shadow:0 0 16px ${light?"rgba(200,146,42,.3)":"rgba(212,168,67,.4)"};}
.sc-em .sc-val{color:var(--em);}
.sc-red .sc-val{color:#dc2626;}
.sc-blue .sc-val{color:${light?"#1d4ed8":"#60a5fa"};}
.sc-light{box-shadow:0 2px 16px rgba(180,120,40,.12);}

/* ── CATEGORY BUBBLES ── */
.cats-bubbles{display:flex;flex-wrap:wrap;gap:8px;max-width:1400px;margin:18px auto 0;padding:0 24px;position:relative;z-index:2;}
.cat-bubble{display:flex;align-items:center;gap:6px;padding:6px 14px;border-radius:50px;border:1px solid color-mix(in srgb,var(--cc) 28%,transparent);background:${light?"rgba(255,248,235,.7)":"rgba(0,0,0,.05)"};backdrop-filter:blur(8px);font-family:'Crimson Pro',serif;font-size:.86rem;color:var(--text);cursor:default;}
.cb-light{background:rgba(255,248,235,.8);}
.cb-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
.cb-count{margin-left:4px;font-size:.75rem;color:var(--muted);background:${light?"rgba(180,120,40,.12)":"rgba(255,255,255,.06)"};padding:1px 7px;border-radius:20px;}

/* ── SEARCH ── */
.search-section{max-width:1400px;margin:20px auto 0;padding:0 24px;position:relative;z-index:2;}
.search-box{display:flex;align-items:center;border:1px solid var(--border);border-radius:12px;padding:11px 15px;gap:10px;margin-bottom:12px;backdrop-filter:var(--blur);transition:border-color .3s,box-shadow .3s;background:var(--bg-card);}
.search-box:focus-within{border-color:var(--gold);box-shadow:0 0 16px ${light?"rgba(200,146,42,.14)":"rgba(212,168,67,.12)"};}
.sb-light{}
.si{font-size:1rem;opacity:.5;}
.search-inp{flex:1;background:none;border:none;outline:none;color:var(--text);font-family:'Crimson Pro',serif;font-size:.97rem;}
.search-inp::placeholder{color:var(--muted);}
.si-light{}
.sclear{background:none;border:none;color:var(--muted);cursor:pointer;font-size:1.1rem;}
.filters-row{display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
.fsel{background:var(--bg-card);border:1px solid var(--border);border-radius:8px;padding:7px 12px;color:var(--text);font-family:'Crimson Pro',serif;font-size:.86rem;cursor:pointer;outline:none;backdrop-filter:var(--blur);}
.fsel option{background:${light?"#f5efe6":"#0a1628"};}
.fsel-light{}
.view-toggle{display:flex;border:1px solid var(--border);border-radius:8px;overflow:hidden;}
.vt-btn{background:none;border:none;padding:7px 12px;color:var(--muted);cursor:pointer;font-size:.92rem;transition:all .2s;}
.vt-btn.vt-active{background:${light?"rgba(200,146,42,.18)":"rgba(212,168,67,.14)"};color:var(--gold);}
.vt-light{}
.results-info{max-width:1400px;margin:12px auto 0;padding:0 24px;font-size:.84rem;color:var(--muted);position:relative;z-index:2;}
.results-info strong{color:var(--gold);}
.results-info em{color:var(--text);font-style:normal;}
.ri-light{}

/* ── BOOK CARDS ── */
.books-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:16px;max-width:1400px;margin:16px auto 130px;padding:0 24px;position:relative;z-index:2;}
.empty-state{grid-column:1/-1;text-align:center;padding:70px;color:var(--muted);}
.empty-state div{font-size:3rem;margin-bottom:14px;}
.es-light{}

.book-card{background:var(--bg-card);border:1px solid var(--border);border-radius:16px;overflow:hidden;cursor:pointer;backdrop-filter:var(--blur);animation:afade .5s ease both;box-shadow:${light?"0 3px 18px rgba(180,120,40,.1)":"0 4px 22px rgba(0,0,0,.45),inset 0 1px 0 rgba(255,255,255,.025)"};
  /* HOVER ENLARGE */
  transition:transform .28s cubic-bezier(.2,1,.3,1), box-shadow .28s cubic-bezier(.2,1,.3,1), border-color .28s;
}
.book-card:hover{
  transform:scale(1.045) translateY(-4px);
  border-color:${light?"rgba(200,146,42,.4)":"rgba(212,168,67,.35)"};
  box-shadow:${light?"0 12px 32px rgba(180,120,40,.2)":"0 14px 38px rgba(0,0,0,.55),0 0 22px rgba(212,168,67,.1)"};
  z-index:10;
}
.book-card-light{}
.bc-cover{position:relative;aspect-ratio:3/4;overflow:hidden;}
.bc-img{width:100%;height:100%;object-fit:cover;transition:transform .3s;}
.book-card:hover .bc-img{transform:scale(1.06);}
.bc-ph{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;background:linear-gradient(135deg,color-mix(in srgb,var(--cc) 14%,${light?"#f5efe6":"#020810"}),${light?"#f0e8d5":"#020810"});}
.bc-ph-icon{font-size:2.5rem;opacity:.7;}
.bc-ser{font-family:monospace;font-size:.78rem;color:var(--cc,var(--gold));opacity:.9;}
.bc-status{position:absolute;top:8px;right:8px;padding:3px 9px;border-radius:20px;font-size:.7rem;font-weight:600;}
.bcs-av{background:${light?"rgba(10,100,70,.15)":"rgba(16,185,129,.2)"};color:var(--em);border:1px solid ${light?"rgba(10,100,70,.3)":"rgba(16,185,129,.3)"};}
.bcs-un{background:rgba(220,38,38,.18);color:#dc2626;border:1px solid rgba(220,38,38,.28);}
.bc-info{padding:11px;}
.bc-serial{font-family:monospace;font-size:.74rem;margin-bottom:3px;}
.bc-title-ar{font-family:'Amiri',serif;font-size:.97rem;color:var(--text);line-height:1.5;direction:rtl;}
.bc-title-en{font-family:'Crimson Pro',serif;font-size:.84rem;color:var(--muted);font-style:italic;margin-bottom:3px;}
.bc-author{font-size:.78rem;color:var(--muted);margin-bottom:7px;}
.bc-meta{display:flex;align-items:center;gap:6px;flex-wrap:wrap;}
.bc-cat{font-size:.68rem;padding:2px 8px;border-radius:20px;border:1px solid;}
.bc-vol{font-size:.68rem;color:var(--muted);}

/* ── BOOK LIST ── */
.books-list{display:flex;flex-direction:column;gap:10px;max-width:1400px;margin:16px auto 130px;padding:0 24px;position:relative;z-index:2;}
.book-row{display:flex;align-items:center;gap:14px;background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:11px 15px;cursor:pointer;backdrop-filter:var(--blur);animation:afade .4s ease both;
  transition:transform .28s cubic-bezier(.2,1,.3,1),box-shadow .28s,border-color .28s;
}
.book-row:hover{transform:scale(1.018) translateX(-3px);border-color:${light?"rgba(200,146,42,.35)":"rgba(212,168,67,.28)"};box-shadow:${light?"0 6px 20px rgba(180,120,40,.15)":"0 6px 22px rgba(0,0,0,.4)"};}
.book-row-light{}
.br-cover{width:42px;height:58px;border-radius:6px;overflow:hidden;flex-shrink:0;}
.br-img{width:100%;height:100%;object-fit:cover;}
.br-ph{width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:1.3rem;background:linear-gradient(135deg,color-mix(in srgb,var(--cc) 14%,${light?"#f5efe6":"#020810"}),${light?"#f0e8d5":"#020810"});}
.br-info{flex:1;display:flex;flex-direction:column;gap:2px;}
.br-ar{font-family:'Amiri',serif;font-size:.97rem;direction:rtl;}
.br-en{font-family:'Crimson Pro',serif;font-size:.8rem;color:var(--muted);font-style:italic;}
.br-meta{font-size:.76rem;color:var(--muted);}
.br-right{display:flex;flex-direction:column;align-items:flex-end;gap:6px;flex-shrink:0;}
.brs{font-size:.7rem;padding:2px 8px;border-radius:20px;}
.brs-av{background:${light?"rgba(10,100,70,.12)":"rgba(16,185,129,.14)"};color:var(--em);}
.brs-un{background:rgba(220,38,38,.12);color:#dc2626;}
.tserial{font-family:monospace;font-size:.75rem;color:var(--gold);background:${light?"rgba(200,146,42,.12)":"rgba(212,168,67,.1)"};padding:2px 7px;border-radius:5px;border:1px solid ${light?"rgba(200,146,42,.22)":"rgba(212,168,67,.18)"};}

/* ── FOOTER ── */
.hp-footer{position:relative;z-index:2;text-align:center;padding:36px 24px 140px;border-top:1px solid var(--border);backdrop-filter:var(--blur);margin-top:20px;background:${light?"rgba(245,239,230,.7)":"rgba(0,1,6,.55)"};}
.footer-light{}
.footer-ayah{font-family:'Amiri',serif;font-size:clamp(.95rem,2.2vw,1.25rem);color:var(--gold);direction:rtl;margin:14px auto;text-shadow:${light?"none":"0 0 18px rgba(212,168,67,.35)"};}
.footer-ref{font-size:.76rem;color:var(--muted);direction:rtl;margin:3px 0 14px;}
.footer-copy{font-size:.76rem;color:var(--muted);margin-top:14px;}

/* ── CATEGORIES PAGE ── */
.cats-page-wrap{max-width:1400px;margin:0 auto;padding:32px 24px 130px;position:relative;z-index:2;}
.cats-page-header{text-align:center;margin-bottom:32px;}
.cph-title{font-family:'Crimson Pro',serif;font-size:clamp(1.5rem,3.5vw,2.2rem);color:var(--gold);margin-bottom:8px;}
.cph-light{}
.cph-sub{font-size:1rem;color:var(--muted);}
.text-light{color:var(--muted) !important;}

.cat-cards-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:18px;}
.cat-field-card{background:var(--bg-card);border:1px solid var(--border);border-left:3px solid var(--cc,var(--gold));border-radius:16px;padding:22px;cursor:pointer;position:relative;overflow:hidden;backdrop-filter:var(--blur);animation:afade .5s ease both;box-shadow:${light?"0 3px 18px rgba(180,120,40,.1)":"0 4px 22px rgba(0,0,0,.4)"};
  transition:transform .28s cubic-bezier(.2,1,.3,1),box-shadow .28s,border-color .28s;
}
.cat-field-card:hover{transform:scale(1.03) translateY(-4px);box-shadow:${light?"0 12px 32px rgba(180,120,40,.18)":"0 14px 36px rgba(0,0,0,.5),0 0 18px color-mix(in srgb,var(--cc) 12%,transparent)"};}
.cfc-light{}
.cfc-accent{position:absolute;top:0;right:0;width:3px;height:100%;opacity:.5;}
.cfc-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;}
.cfc-code{font-family:monospace;font-size:.85rem;padding:3px 10px;border-radius:6px;border:1px solid;font-weight:700;}
.cfc-total{font-family:'Crimson Pro',serif;font-size:2.2rem;font-weight:700;line-height:1;}
.cfc-name{font-family:'Crimson Pro',serif;font-size:1.15rem;font-weight:600;margin-bottom:12px;color:var(--text);}
.cfc-name-light{}
.cfc-stats{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:12px;}
.cfc-av{font-size:.78rem;color:var(--em);}
.cfc-un{font-size:.78rem;color:#dc2626;}
.cfc-bar-wrap{display:flex;align-items:center;gap:8px;}
.cfc-bar-track{flex:1;height:5px;background:${light?"rgba(180,120,40,.15)":"rgba(255,255,255,.08)"};border-radius:3px;overflow:hidden;}
.cfc-bar-fill{height:100%;border-radius:3px;transition:width .8s cubic-bezier(.4,0,.2,1);}
.cfc-pct{font-size:.72rem;color:var(--muted);}
.cfc-arrow{position:absolute;bottom:16px;right:18px;font-size:1.1rem;opacity:0;transition:opacity .25s,transform .25s;}
.cat-field-card:hover .cfc-arrow{opacity:.8;transform:translateX(4px);}

/* ── CATEGORY DETAIL ── */
.cat-detail-page{min-height:100vh;}
.cat-detail-wrap{max-width:1400px;margin:0 auto;padding:24px 24px 120px;position:relative;z-index:2;}
.cat-detail-header{display:flex;align-items:center;gap:16px;padding:18px 22px;border:1px solid;border-radius:14px;margin-bottom:24px;background:var(--bg-card);backdrop-filter:var(--blur);}
.cdh-dot{width:16px;height:16px;border-radius:50%;flex-shrink:0;}
.cdh-name{font-family:'Crimson Pro',serif;font-size:1.5rem;font-weight:600;}
.cdh-sub{font-size:.88rem;color:var(--muted);}
.cdh-light{}

/* ── DETAIL PAGE ── */
.detail-page{min-height:100vh;}
.detail-wrap{max-width:920px;margin:0 auto;padding:24px 24px 120px;position:relative;z-index:2;}
.back-btn{display:inline-flex;align-items:center;gap:7px;background:${light?"rgba(200,146,42,.1)":"rgba(212,168,67,.07)"};border:1px solid var(--border);color:var(--gold);padding:7px 15px;border-radius:20px;cursor:pointer;font-family:'Crimson Pro',serif;font-size:.88rem;margin-bottom:26px;transition:all .3s;}
.back-btn:hover{background:${light?"rgba(200,146,42,.2)":"rgba(212,168,67,.16)"};}
.detail-hero{display:flex;gap:26px;margin-bottom:28px;animation:afade .6s ease both;}
.detail-cover-wrap{position:relative;flex-shrink:0;}
.detail-cover-img{width:175px;height:235px;object-fit:cover;border-radius:12px;box-shadow:${light?"0 6px 24px rgba(180,120,40,.2)":"0 8px 32px rgba(0,0,0,.6)"};}
.detail-cover-ph{width:175px;height:235px;border-radius:12px;background:linear-gradient(135deg,color-mix(in srgb,var(--cc) 14%,${light?"#f5efe6":"#020810"}),${light?"#f0e8d5":"#020810"});border:1px solid var(--border);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;font-size:2.8rem;}
.dcp-ser{font-family:monospace;font-size:.82rem;color:var(--gold);opacity:.8;}
.dcp-rat{font-size:.82rem;color:var(--gold);}
.avail-badge{position:absolute;top:10px;right:10px;display:flex;align-items:center;gap:5px;padding:4px 10px;border-radius:20px;font-size:.72rem;}
.av-yes{background:${light?"rgba(10,100,70,.15)":"rgba(16,185,129,.2)"};color:var(--em);border:1px solid ${light?"rgba(10,100,70,.3)":"rgba(16,185,129,.3)"};}
.av-no{background:rgba(220,38,38,.18);color:#dc2626;border:1px solid rgba(220,38,38,.28);}
.av-dot{width:7px;height:7px;border-radius:50%;background:currentColor;animation:dpulse 1.5s ease-in-out infinite;}
.detail-meta{flex:1;min-width:0;}
.dm-serial{font-family:monospace;font-size:.8rem;margin-bottom:7px;}
.dm-title-ar{font-family:'Amiri',serif;font-size:clamp(1.25rem,2.8vw,1.9rem);color:var(--text);direction:rtl;line-height:1.5;margin-bottom:3px;}
.dm-title-en{font-family:'Crimson Pro',serif;font-size:clamp(.95rem,1.8vw,1.3rem);color:var(--muted);font-style:italic;margin-bottom:13px;}
.dm-light{}
.dm-row{display:flex;align-items:flex-start;gap:8px;margin-bottom:7px;font-size:.88rem;flex-wrap:wrap;}
.dm-row-light{}
.dm-lbl{color:var(--muted);min-width:130px;flex-shrink:0;}
.dm-none{color:var(--muted);font-style:italic;}
.dm-rating{color:var(--gold);}
.pub-edit-row{display:flex;align-items:center;gap:6px;flex-wrap:wrap;}
.pub-inp{width:180px;padding:4px 8px;font-size:.84rem;}
.pub-save{background:var(--em);border:none;color:#fff;padding:4px 10px;border-radius:6px;cursor:pointer;font-family:inherit;font-size:.8rem;}
.pub-cancel{background:rgba(220,38,38,.15);border:1px solid rgba(220,38,38,.25);color:#dc2626;padding:4px 8px;border-radius:6px;cursor:pointer;font-size:.8rem;}
.edit-inline-btn{background:none;border:none;cursor:pointer;font-size:.85rem;margin-left:5px;opacity:.55;transition:opacity .2s;vertical-align:middle;}
.edit-inline-btn:hover{opacity:1;}
.borrowed-box{display:flex;align-items:center;gap:10px;background:rgba(220,38,38,.08);border:1px solid rgba(220,38,38,.18);border-radius:10px;padding:10px 14px;margin-top:10px;flex-wrap:wrap;}
.bb-label{font-size:.82rem;color:#dc2626;font-weight:600;}
.bb-name{font-size:.9rem;font-weight:600;color:var(--text);}

/* ── DETAIL TABS ── */
.detail-tabs{display:flex;border:1px solid var(--border);border-radius:12px;overflow:hidden;margin-bottom:22px;backdrop-filter:var(--blur);background:${light?"rgba(245,239,230,.7)":"transparent"};}
.dt-light{}
.dtab{flex:1;background:none;border:none;padding:11px 16px;color:var(--muted);cursor:pointer;font-family:'Crimson Pro',serif;font-size:.92rem;transition:all .25s;border-right:1px solid var(--border);}
.dtab:last-child{border-right:none;}
.dtab:hover{color:var(--text);background:${light?"rgba(200,146,42,.08)":"rgba(255,255,255,.04)"}}
.dtab-active{background:${light?"rgba(200,146,42,.18)":"rgba(212,168,67,.14)"} !important;color:var(--gold) !important;}
.dtab-light{}
.dtab:hover{background:${light?"rgba(200,146,42,.08)":"rgba(212,168,67,.06)"};color:var(--text);}
.dtab-active{background:${light?"rgba(200,146,42,.18)":"rgba(212,168,67,.14)"};color:var(--gold);}
.dtab-light{}
.dsub{padding:4px 0;}
.desc-box{background:var(--bg-card);border:1px solid var(--border);border-radius:12px;padding:18px;margin-bottom:14px;backdrop-filter:var(--blur);}
.desc-box-light{}
.desc-title{font-family:'Crimson Pro',serif;font-size:.97rem;color:var(--gold);margin-bottom:8px;font-weight:600;}
.desc-ar{font-family:'Amiri',serif;font-size:1.02rem;color:var(--text);direction:rtl;line-height:1.9;}
.desc-en{font-size:.97rem;line-height:1.7;color:var(--text);}
.de-light{}
.btn-pdf{background:${light?"rgba(10,100,70,.1)":"rgba(16,185,129,.12)"};border:1px solid ${light?"rgba(10,100,70,.25)":"rgba(16,185,129,.28)"};color:var(--em);padding:11px 22px;border-radius:10px;cursor:pointer;font-family:'Crimson Pro',serif;font-size:.97rem;transition:all .3s;margin-top:6px;}
.btn-pdf:hover{background:${light?"rgba(10,100,70,.22)":"rgba(16,185,129,.22)"};}

/* ── REVIEWS ── */
.review-write-box{background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:22px;margin-bottom:18px;backdrop-filter:var(--blur);}
.rwb-light{}
.rv-title{font-family:'Crimson Pro',serif;font-size:1.1rem;color:var(--gold);margin-bottom:12px;}
.stars-row{display:flex;gap:8px;margin-bottom:12px;}
.star-btn{background:none;border:none;font-size:2rem;cursor:pointer;color:${light?"#d5b888":"#3a3020"};transition:all .2s;line-height:1;}
.star-lit{color:var(--gold);text-shadow:0 0 10px rgba(212,168,67,.55);}
.star-btn:hover{transform:scale(1.15);}
.review-ta{margin-bottom:12px;}
.review-card{background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:14px;margin-bottom:10px;backdrop-filter:var(--blur);}
.rc-light{}
.rc-top{display:flex;align-items:center;gap:10px;justify-content:space-between;margin-bottom:8px;flex-wrap:wrap;}
.rc-reviewer{font-weight:600;font-size:.88rem;color:var(--gold);}
.rc-stars{color:var(--gold);font-size:1rem;}
.rc-date{font-size:.74rem;color:var(--muted);margin-left:auto;}
.rc-text{font-size:.92rem;line-height:1.65;color:var(--text);}
.rc-light-text{}
.no-reviews{text-align:center;padding:30px;color:var(--muted);font-style:italic;}
.nr-light{}
.rate-avg{text-align:center;padding:20px;background:var(--bg-card);border:1px solid var(--border);border-radius:12px;margin-top:16px;backdrop-filter:var(--blur);}
.ra-light{}
.rate-avg-num{font-size:2.4rem;font-weight:700;color:var(--gold);font-family:'Crimson Pro',serif;}
.rate-avg-stars{font-size:1.2rem;color:var(--gold);margin:3px 0;}
.rate-avg-count{font-size:.8rem;color:var(--muted);}

/* ── REQUEST ── */
.req-form,.req-success{background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:26px;backdrop-filter:var(--blur);}
.req-form-light,.req-success-light{}
.req-title{font-family:'Crimson Pro',serif;font-size:1.2rem;color:var(--gold);margin-bottom:7px;}
.req-sub{font-size:.88rem;color:var(--muted);margin-bottom:18px;}
.req-success{text-align:center;}
.rs-icon{font-size:2.8rem;color:var(--em);margin-bottom:10px;}
.req-success h3{font-family:'Crimson Pro',serif;font-size:1.25rem;color:var(--em);margin-bottom:8px;}
.matched-student{display:flex;align-items:center;gap:11px;background:${light?"rgba(10,100,70,.1)":"rgba(16,185,129,.1)"};border:1px solid ${light?"rgba(10,100,70,.22)":"rgba(16,185,129,.22)"};border-radius:10px;padding:11px;margin-top:9px;animation:afade .3s ease;}
.ms-check{width:30px;height:30px;border-radius:50%;background:${light?"rgba(10,100,70,.18)":"rgba(16,185,129,.18)"};color:var(--em);display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.ms-name{font-size:.92rem;font-weight:600;color:var(--text);}
.ms-name-ar{font-family:'Amiri',serif;font-size:.88rem;color:var(--muted);direction:rtl;}
.ms-class{font-size:.78rem;color:var(--em);}
.not-found{background:rgba(220,38,38,.08);border:1px solid rgba(220,38,38,.18);border-radius:8px;padding:9px 13px;margin-top:8px;font-size:.84rem;color:#dc2626;}

/* ── ADMIN ── */
.admin-page{min-height:100vh;}
.admin-wrap{max-width:1400px;margin:0 auto;padding:24px 24px 100px;position:relative;z-index:2;}
.admin-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:22px;flex-wrap:wrap;gap:10px;}
.ah-left{display:flex;align-items:center;gap:14px;}
.ah-title{font-family:'Crimson Pro',serif;font-size:clamp(1.25rem,3vw,1.75rem);color:var(--gold);}
.text-light-strong{color:var(--text) !important;}
.btn-logout{background:rgba(220,38,38,.1);border:1px solid rgba(220,38,38,.22);color:#dc2626;padding:7px 16px;border-radius:20px;cursor:pointer;font-family:inherit;font-size:.86rem;transition:all .3s;}
.btn-logout:hover{background:rgba(220,38,38,.2);}
.admin-tabs{display:flex;gap:3px;flex-wrap:wrap;border-bottom:1px solid var(--border);margin-bottom:22px;padding-bottom:3px;}
.atab{background:none;border:none;padding:9px 16px;color:var(--muted);cursor:pointer;font-family:'Crimson Pro',serif;font-size:.9rem;border-radius:8px 8px 0 0;transition:all .25s;border-bottom:2px solid transparent;}
.atab:hover{color:var(--text);}
.atab-active{color:var(--gold);border-bottom-color:var(--gold);background:${light?"rgba(200,146,42,.08)":"rgba(212,168,67,.06)"};}
.atab-light{}
.admin-section{animation:afade .4s ease both;}
.as-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:8px;}
.btn-add{background:linear-gradient(135deg,${light?"rgba(200,146,42,.2)":"rgba(212,168,67,.18)"},${light?"rgba(200,146,42,.1)":"rgba(212,168,67,.1)"});border:1px solid ${light?"rgba(200,146,42,.38)":"rgba(212,168,67,.38)"};color:var(--gold);padding:7px 16px;border-radius:8px;cursor:pointer;font-family:inherit;font-size:.86rem;transition:all .3s;}
.btn-add:hover{background:${light?"rgba(200,146,42,.3)":"rgba(212,168,67,.28)"};}
.admin-table-wrap{overflow-x:auto;border-radius:12px;border:1px solid var(--border);}
.admin-table{width:100%;border-collapse:collapse;background:var(--bg-card);}
.admin-table-light{}
.admin-table th{background:${light?"rgba(200,146,42,.1)":"rgba(212,168,67,.08)"};color:var(--gold);padding:11px 13px;text-align:left;font-size:.8rem;font-weight:600;border-bottom:1px solid var(--border);}
.admin-table tr{transition:background .2s;}
.admin-table tr:hover{background:${light?"rgba(200,146,42,.05)":"rgba(212,168,67,.04)"};}
.admin-table td{padding:10px 13px;border-bottom:1px solid ${light?"rgba(200,146,42,.08)":"rgba(212,168,67,.05)"};font-size:.86rem;color:var(--text);}
.tb-title{display:flex;flex-direction:column;gap:2px;}
.tb-ar{font-family:'Amiri',serif;direction:rtl;font-size:.93rem;}
.tb-en{font-size:.78rem;color:var(--muted);font-style:italic;}
.tstat{font-size:.73rem;padding:2px 8px;border-radius:20px;}
.ts-av{background:${light?"rgba(10,100,70,.12)":"rgba(16,185,129,.14)"};color:var(--em);}
.ts-un{background:rgba(220,38,38,.12);color:#dc2626;}
.tactions{display:flex;gap:5px;}
.ta-btn{width:27px;height:27px;background:${light?"rgba(180,120,40,.1)":"rgba(255,255,255,.05)"};border:1px solid var(--border);border-radius:6px;cursor:pointer;font-size:.78rem;transition:all .2s;}
.ta-btn:hover{background:rgba(212,168,67,.18);}
.ta-del:hover{background:rgba(220,38,38,.18);}
.del-confirm-row{display:flex;align-items:center;gap:4px;animation:afade .15s ease;}
.del-confirm-label{font-size:.72rem;color:#dc2626;white-space:nowrap;}
.ta-del-yes{background:rgba(220,38,38,.15);border:1px solid rgba(220,38,38,.4);color:#dc2626;padding:2px 8px;border-radius:5px;cursor:pointer;font-size:.75rem;font-family:inherit;transition:all .2s;}
.ta-del-yes:hover{background:rgba(220,38,38,.3);}
.ta-del-no{background:rgba(255,255,255,.06);border:1px solid var(--border);color:var(--muted);padding:2px 8px;border-radius:5px;cursor:pointer;font-size:.75rem;font-family:inherit;transition:all .2s;}
.ta-del-no:hover{background:rgba(255,255,255,.12);}
.empty-msg{color:var(--muted);padding:16px 0;}
.cats-admin-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;}
.cat-admin-card{display:flex;align-items:center;gap:9px;background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:11px 13px;backdrop-filter:blur(12px);}
.cac-light{}
.cac-dot{width:9px;height:9px;border-radius:50%;flex-shrink:0;}
.cac-info{display:flex;flex-direction:column;gap:2px;flex:1;min-width:0;}
.cac-name{font-size:.88rem;color:var(--text);font-weight:500;}
.cac-code{font-family:monospace;font-size:.75rem;color:var(--muted);}
.pw-input-wrap{position:relative;display:flex;align-items:center;}
.pw-input-wrap .inp{padding-right:38px;}
.pw-eye{position:absolute;right:10px;background:none;border:none;cursor:pointer;font-size:.9rem;color:var(--muted);transition:color .2s;padding:0;}
.pw-eye:hover{color:var(--gold);}
.settings-card{background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:22px;max-width:520px;backdrop-filter:var(--blur);}
.settings-light{}
.settings-card h3{font-family:'Crimson Pro',serif;font-size:1.08rem;color:var(--gold);margin-bottom:7px;}
.settings-sub{font-size:.86rem;color:var(--muted);margin-bottom:14px;}
.code-row{display:flex;align-items:center;gap:10px;margin-bottom:8px;}

/* ── INLINE FORM ── */
.inline-form{background:${light?"rgba(245,235,215,.85)":"rgba(4,12,28,.88)"};border:1px solid var(--border);border-radius:12px;padding:18px;margin-bottom:14px;backdrop-filter:var(--blur);}
.inline-form-light{}

/* ── MODALS ── */
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.7);backdrop-filter:blur(10px);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px;animation:afade .2s ease;}
.modal-box{background:${light?"linear-gradient(135deg,#fdf6ea,#f5ece0)":"linear-gradient(135deg,#0a1628,#060d1a)"};border:1px solid ${light?"rgba(200,146,42,.3)":"rgba(212,168,67,.28)"};border-radius:18px;padding:24px;width:100%;max-width:460px;max-height:90vh;overflow-y:auto;box-shadow:${light?"0 20px 50px rgba(180,120,40,.2)":"0 24px 60px rgba(0,0,0,.7),0 0 36px rgba(212,168,67,.06)"};animation:mslide .3s ease;}
.modal-light{}
@keyframes mslide{from{transform:translateY(22px) scale(.97);opacity:0}to{transform:none;opacity:1}}
.modal-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;}
.modal-hdr h2{font-family:'Crimson Pro',serif;font-size:1.15rem;color:var(--gold);}
.modal-close{background:none;border:1px solid var(--border);color:var(--muted);width:28px;height:28px;border-radius:50%;cursor:pointer;font-size:.95rem;transition:all .2s;}
.modal-close:hover{background:rgba(220,38,38,.18);color:#dc2626;}
.modal-footer{display:flex;gap:9px;margin-top:14px;}
.modal-footer>*{flex:1;}

/* ── FORMS ── */
.form-group{display:flex;flex-direction:column;gap:4px;margin-bottom:12px;}
.form-group label{font-size:.8rem;color:var(--muted);}
.label-light{}
.form-grid2{display:grid;grid-template-columns:1fr 1fr;gap:0 12px;}
.inp{background:${light?"rgba(255,248,235,.9)":"rgba(255,255,255,.04)"};border:1px solid var(--border);border-radius:8px;padding:9px 12px;color:var(--text);font-family:'Crimson Pro',serif;font-size:.9rem;outline:none;width:100%;transition:border-color .2s,box-shadow .2s;}
.inp:focus{border-color:var(--gold);box-shadow:0 0 10px ${light?"rgba(200,146,42,.14)":"rgba(212,168,67,.12)"};}
.inp-light{}
textarea.inp{resize:vertical;min-height:60px;}
.inp-code{text-align:center;letter-spacing:.4em;font-size:1.05rem;font-family:monospace;max-width:150px;}
.inp-hint{font-size:.75rem;color:var(--muted);margin-top:3px;}
.err-msg{background:rgba(220,38,38,.1);border:1px solid rgba(220,38,38,.2);color:#dc2626;padding:8px 12px;border-radius:8px;font-size:.84rem;text-align:center;margin-bottom:10px;}
.hint{text-align:center;font-size:.75rem;color:var(--muted);margin-top:9px;}
.color-inp{width:48px;height:34px;padding:2px;border-radius:6px;cursor:pointer;border:1px solid var(--border);}
.cover-upload{position:relative;border:2px dashed var(--border);border-radius:10px;padding:12px;text-align:center;cursor:pointer;transition:border-color .2s;min-height:74px;display:flex;align-items:center;justify-content:center;}
.cover-upload:hover{border-color:var(--gold);}
.cup{color:var(--muted);font-size:.86rem;}
.cover-prev{width:66px;height:90px;object-fit:cover;border-radius:6px;}
.file-inp{position:absolute;inset:0;opacity:0;cursor:pointer;}
.btn-submit{background:linear-gradient(135deg,${light?"rgba(200,146,42,.25)":"rgba(212,168,67,.22)"},${light?"rgba(200,146,42,.14)":"rgba(212,168,67,.12)"});border:1px solid ${light?"rgba(200,146,42,.44)":"rgba(212,168,67,.42)"};color:var(--gold);padding:11px 18px;border-radius:10px;cursor:pointer;font-family:'Crimson Pro',serif;font-size:.93rem;width:100%;transition:all .3s;font-weight:600;}
.btn-submit:hover{background:${light?"rgba(200,146,42,.35)":"rgba(212,168,67,.32)"};box-shadow:0 0 16px rgba(212,168,67,.2);}
.btn-submit:disabled{opacity:.4;cursor:not-allowed;}
.btn-sec{background:${light?"rgba(180,120,40,.08)":"rgba(255,255,255,.04)"};border:1px solid var(--border);color:var(--muted);padding:11px 18px;border-radius:10px;cursor:pointer;font-family:'Crimson Pro',serif;font-size:.93rem;transition:all .3s;}
.btn-sec:hover{background:${light?"rgba(180,120,40,.16)":"rgba(255,255,255,.08)"};}
.btn-sec-light{}

/* ── INTRO ── */
.intro{position:fixed;inset:0;background:#000;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:9990;overflow:hidden;transition:opacity 1.1s cubic-bezier(.4,0,.2,1),transform 1.1s cubic-bezier(.4,0,.2,1);}
.intro-bg{background:radial-gradient(ellipse at 30% 15%,#0e2040 0%,#05101e 40%,#000 100%);}
.intro-exit{opacity:0;transform:scale(1.04);pointer-events:none;}
.intro-grain{position:absolute;inset:0;opacity:.022;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");background-size:200px 200px;animation:grain .5s steps(2) infinite;pointer-events:none;z-index:30;}
@keyframes grain{0%{background-position:0 0}25%{background-position:-40px 20px}50%{background-position:20px -30px}75%{background-position:-20px 40px}}
.intro-vignette{position:absolute;inset:0;background:radial-gradient(ellipse at center,transparent 40%,rgba(0,0,0,.88) 100%);z-index:2;pointer-events:none;}
.intro-moon{position:absolute;top:5%;right:6%;z-index:4;opacity:0;transform:translateY(-36px) rotate(18deg);transition:opacity 1.4s ease,transform 1.4s cubic-bezier(.2,1,.3,1);filter:drop-shadow(0 0 16px rgba(200,146,42,.4));animation:moonf 9s ease-in-out infinite 2s;}
.moon-in{opacity:1 !important;transform:translateY(0) rotate(0) !important;}
@keyframes moonf{0%,100%{transform:translateY(0) rotate(-3deg)}50%{transform:translateY(-10px) rotate(2deg)}}
.intro-mandala{position:absolute;opacity:0;transform:scale(.28) rotate(-90deg);transition:opacity 1.8s cubic-bezier(.2,1,.3,1),transform 1.8s cubic-bezier(.2,1,.3,1);z-index:2;}
.mandala-in{opacity:.45 !important;transform:scale(1) rotate(0) !important;}
.intro-body{position:relative;z-index:10;text-align:center;display:flex;flex-direction:column;align-items:center;gap:14px;padding:28px 20px;max-width:660px;}
.ib-bismillah,.ib-title-wrap,.ib-sub,.ib-ayah,.ib-btn-wrap{opacity:0;transform:translateY(26px);transition:opacity .95s cubic-bezier(.2,1,.3,1),transform .95s cubic-bezier(.2,1,.3,1);}
.ib-in{opacity:1 !important;transform:none !important;}
.ib-bismillah{font-family:'Amiri',serif;font-size:clamp(1.4rem,4vw,2.2rem);color:#d4a843;text-shadow:0 0 36px rgba(212,168,67,.6);}
.ib-bar{width:170px;height:1px;background:linear-gradient(90deg,transparent,#d4a843,transparent);}
.ib-title{font-family:'Crimson Pro',serif;font-size:clamp(1.4rem,4.2vw,3rem);font-weight:600;color:#d4a843;text-shadow:0 0 38px rgba(212,168,67,.7),0 0 75px rgba(212,168,67,.22);line-height:1.25;letter-spacing:.02em;min-height:1.3em;}
.ib-title-ar{font-family:'Amiri',serif;font-size:clamp(.95rem,2.3vw,1.5rem);color:rgba(212,168,67,.72);direction:rtl;margin-top:3px;}
.ib-title-wrap{display:flex;flex-direction:column;align-items:center;gap:8px;}
.cursor{animation:cblink .7s ease-in-out infinite;font-weight:300;color:#d4a843;}
@keyframes cblink{0%,100%{opacity:1}50%{opacity:0}}
.ib-sub{font-family:'Crimson Pro',serif;font-size:clamp(.9rem,2.3vw,1.15rem);color:rgba(232,220,200,.6);letter-spacing:.07em;}
.ib-ayah{font-family:'Amiri',serif;font-size:clamp(.88rem,1.9vw,1.05rem);color:#10b981;text-shadow:0 0 16px rgba(16,185,129,.4);direction:rtl;}
.intro-btn{position:relative;background:transparent;border:none;cursor:pointer;padding:0;font-family:inherit;overflow:visible;}
.ib-glow{position:absolute;inset:-10px;border-radius:50px;background:radial-gradient(ellipse,rgba(212,168,67,.13) 0%,transparent 70%);animation:ibglow 3s ease-in-out infinite;}
@keyframes ibglow{0%,100%{opacity:.6;transform:scale(1)}50%{opacity:1;transform:scale(1.04)}}
.ib-inner{position:relative;display:flex;align-items:center;gap:13px;background:linear-gradient(135deg,rgba(212,168,67,.15),rgba(16,185,129,.07));border:1px solid rgba(212,168,67,.42);color:#d4a843;padding:14px 40px;border-radius:50px;font-family:'Crimson Pro',serif;font-size:clamp(.97rem,2.3vw,1.25rem);letter-spacing:.05em;transition:all .4s cubic-bezier(.2,1,.3,1);box-shadow:0 0 26px rgba(212,168,67,.09),inset 0 1px 0 rgba(255,255,255,.04);backdrop-filter:blur(10px);}
.intro-btn:hover .ib-inner{background:rgba(212,168,67,.24);border-color:rgba(212,168,67,.7);box-shadow:0 0 48px rgba(212,168,67,.26),0 0 88px rgba(212,168,67,.09);transform:translateY(-3px) scale(1.02);}
.ib-arr{opacity:.65;transition:transform .3s;}
.intro-btn:hover .ib-arr{transform:translateX(4px);}
.ib-shimmer{position:absolute;inset:0;border-radius:50px;background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,.09) 50%,transparent 60%);transform:translateX(-100%);animation:ibsh 4.5s ease infinite 3s;pointer-events:none;}
@keyframes ibsh{to{transform:translateX(200%)}}
.ib-skip{font-size:.73rem;color:rgba(138,122,90,.6);cursor:pointer;letter-spacing:.1em;transition:color .3s;user-select:none;}
.ib-skip:hover{color:rgba(212,168,67,.5);}
.ib-btn-wrap{display:flex;flex-direction:column;align-items:center;gap:12px;}
.intro-mosque{position:absolute;bottom:0;left:0;right:0;height:130px;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 130'%3E%3Cpath d='M0 130 L0 90 Q50 80 60 55 Q65 35 70 55 Q75 80 80 90 L110 90 L110 65 Q120 42 130 20 Q135 5 140 20 Q145 42 150 65 L150 90 L170 90 L170 78 Q175 58 180 78 L185 90 L220 90 L220 100 L270 100 L270 78 Q290 46 310 22 Q320 2 330 22 Q340 46 350 78 L350 100 L400 100 L400 90 L415 90 L415 66 Q420 42 428 26 Q433 10 438 26 Q443 42 448 66 L448 90 L460 90 L460 100 L540 100 L540 90 L555 90 L555 54 Q565 20 575 4 Q580 -6 585 4 Q590 20 598 54 L598 90 L610 90 L610 100 L700 100 L700 90 L750 90 L750 78 Q760 58 770 78 L775 90 L810 90 L810 100 L860 100 L860 90 L875 90 L875 66 Q885 34 895 12 Q900 -2 905 12 Q910 34 920 66 L920 90 L940 90 L940 100 L1020 100 L1020 90 L1070 90 L1070 78 Q1080 58 1090 78 L1095 90 L1130 90 L1130 100 L1160 100 L1160 90 L1175 90 L1175 65 Q1180 42 1185 22 Q1190 5 1195 22 Q1198 42 1200 65 L1200 130 Z' fill='%23010912'/%3E%3C/svg%3E") center bottom/cover no-repeat;z-index:6;pointer-events:none;opacity:0;transform:translateY(28px);transition:opacity 1.3s ease,transform 1.3s cubic-bezier(.2,1,.3,1);}
.mosque-in{opacity:1 !important;transform:none !important;animation:mfloat 14s ease-in-out infinite 2s;}
.lb-top,.lb-bot{position:absolute;left:0;right:0;background:#000;z-index:15;pointer-events:none;transition:height 1.5s cubic-bezier(.4,0,.2,1);}
.lb-top{top:0;height:55px;}.lb-bot{bottom:0;height:55px;}
.lb-top.lb-open,.lb-bot.lb-open{height:0;}
.exit-fade{position:absolute;inset:0;background:#000;z-index:50;animation:efade 1.1s ease forwards;}
@keyframes efade{from{opacity:0}to{opacity:1}}

/* ── SCROLLBAR ── */
::-webkit-scrollbar{width:5px;}
::-webkit-scrollbar-track{background:${light?"#f0e8d5":"#020810"};}
::-webkit-scrollbar-thumb{background:${light?"rgba(200,146,42,.25)":"rgba(212,168,67,.2)"};border-radius:3px;}
::-webkit-scrollbar-thumb:hover{background:${light?"rgba(200,146,42,.45)":"rgba(212,168,67,.4)"};}

/* ── RESPONSIVE ── */
@media(max-width:900px){
  .stats-row{grid-template-columns:repeat(2,1fr);}
  .detail-hero{flex-direction:column;}
  .detail-cover-img,.detail-cover-ph{width:100%;max-width:260px;height:auto;aspect-ratio:3/4;}
  .form-grid2{grid-template-columns:1fr;}
  .books-grid{grid-template-columns:repeat(auto-fill,minmax(170px,1fr));}
  .cat-cards-grid{grid-template-columns:repeat(auto-fill,minmax(220px,1fr));}
  .header-inner{gap:8px;}
  .header-nav{order:3;width:100%;}
  .nav-btn{flex:1;text-align:center;}
}
/* ── RESPONSIVE ── */
@media(max-width:900px){
  .stats-row{grid-template-columns:repeat(2,1fr);}
  .detail-hero{flex-direction:column;}
  .detail-cover-img,.detail-cover-ph{width:100%;max-width:260px;height:auto;aspect-ratio:3/4;}
  .form-grid2{grid-template-columns:1fr;}
  .books-grid{grid-template-columns:repeat(auto-fill,minmax(170px,1fr));}
  .cat-cards-grid{grid-template-columns:repeat(auto-fill,minmax(220px,1fr));}
  .header-inner{gap:8px;}
  .header-nav{order:3;width:100%;}
  .nav-btn{flex:1;text-align:center;}
}
@media(max-width:540px){
  .books-grid{grid-template-columns:repeat(2,1fr);gap:10px;}
  .stats-row{grid-template-columns:repeat(2,1fr);gap:10px;}
  .detail-tabs{flex-wrap:wrap;}
  .dtab{flex:none;font-size:.82rem;padding:8px 12px;}
  .ib-title{font-size:1.35rem;}
  .cat-cards-grid{grid-template-columns:1fr 1fr;}
  .admin-table th,.admin-table td{padding:7px 9px;font-size:.8rem;}
}

/* ── EXCEL IMPORT ── */
.as-btn-group{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
.btn-import{background:${light?"rgba(29,78,216,.1)":"rgba(59,130,246,.1)"};border:1px solid ${light?"rgba(29,78,216,.3)":"rgba(59,130,246,.3)"};color:${light?"#1d4ed8":"#60a5fa"};padding:7px 16px;border-radius:8px;cursor:pointer;font-family:inherit;font-size:.86rem;transition:all .3s;}
.btn-import:hover,.btn-import-active{background:${light?"rgba(29,78,216,.18)":"rgba(59,130,246,.18)"};}

.excel-import-panel{background:${light?"rgba(255,248,235,.95)":"rgba(4,12,28,.95)"};border:1px solid ${light?"rgba(200,146,42,.3)":"rgba(212,168,67,.2)"};border-radius:16px;padding:24px;margin-bottom:18px;backdrop-filter:var(--blur);animation:afade .35s ease;}
.eip-light{}
.eip-header{margin-bottom:18px;}
.eip-title-row{display:flex;align-items:flex-start;gap:13px;}
.eip-icon{font-size:1.7rem;margin-top:2px;flex-shrink:0;}
.eip-title{font-family:'Crimson Pro',serif;font-size:1.15rem;color:var(--gold);margin-bottom:3px;}
.eip-sub{font-size:.84rem;color:var(--muted);}
.eip-close{margin-left:auto;background:none;border:1px solid var(--border);color:var(--muted);width:28px;height:28px;border-radius:50%;cursor:pointer;font-size:1rem;flex-shrink:0;transition:all .2s;}
.eip-close:hover{background:rgba(220,38,38,.18);color:#dc2626;}

.eip-guide{background:${light?"rgba(200,146,42,.07)":"rgba(212,168,67,.05)"};border:1px solid var(--border);border-radius:12px;padding:16px;margin-bottom:18px;}
.eip-guide-l{}
.eig-label{font-size:.84rem;color:var(--muted);margin-bottom:11px;}
.eig-cols{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:8px;margin-bottom:10px;}
.eig-col{display:flex;flex-direction:column;gap:2px;background:${light?"rgba(255,248,235,.8)":"rgba(255,255,255,.03)"};border:1px solid var(--border);border-radius:8px;padding:8px 11px;}
.eig-col-l{}
.eig-col-name{font-size:.82rem;font-weight:600;color:var(--text);}
.eig-req{color:#dc2626;margin-left:2px;}
.eig-col-hint{font-size:.74rem;color:var(--muted);}
.eig-note{font-size:.8rem;color:var(--muted);}
.eig-note strong{color:var(--gold);}

.eip-dropzone{border:2px dashed ${light?"rgba(200,146,42,.4)":"rgba(212,168,67,.28)"};border-radius:14px;padding:40px 24px;text-align:center;cursor:pointer;transition:border-color .3s,background .3s;background:${light?"rgba(200,146,42,.04)":"rgba(212,168,67,.03)"};}
.eip-dropzone:hover{border-color:var(--gold);background:${light?"rgba(200,146,42,.09)":"rgba(212,168,67,.07)"};}
.edz-light{}
.eip-loading{display:flex;flex-direction:column;align-items:center;gap:12px;}
.eip-spinner{width:32px;height:32px;border:3px solid var(--border);border-top-color:var(--gold);border-radius:50%;animation:spin .7s linear infinite;}
@keyframes spin{to{transform:rotate(360deg)}}
.edz-icon{font-size:2.8rem;margin-bottom:12px;}
.edz-main{font-size:.95rem;color:var(--text);margin-bottom:5px;}
.edz-sub{font-size:.8rem;color:var(--muted);letter-spacing:.06em;}
.eip-error{background:rgba(220,38,38,.1);border:1px solid rgba(220,38,38,.2);color:#dc2626;padding:10px 14px;border-radius:10px;font-size:.85rem;margin-top:14px;}

.eip-preview-wrap{border:1px solid var(--border);border-radius:12px;overflow:hidden;margin-bottom:16px;}
.epw-light{}
.eip-preview-toolbar{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:${light?"rgba(200,146,42,.08)":"rgba(212,168,67,.06)"};border-bottom:1px solid var(--border);}
.eip-chk-all{display:flex;align-items:center;gap:8px;cursor:pointer;font-size:.86rem;color:var(--text);}
.eca-light{}
.eip-chk-all input{accent-color:var(--gold);}
.eip-sel-count{font-size:.82rem;color:var(--muted);}
.esc-light{}

.eip-rows{max-height:380px;overflow-y:auto;}
.eip-row{display:flex;align-items:center;gap:12px;padding:13px 14px;border-bottom:1px solid ${light?"rgba(200,146,42,.08)":"rgba(212,168,67,.05)"};transition:background .2s;}
.eip-row:last-child{border-bottom:none;}
.eip-row-sel{background:${light?"rgba(200,146,42,.07)":"rgba(212,168,67,.05)"};}
.eip-row-dup{border-left:3px solid rgba(220,38,38,.45);}
.eip-row-l{}
.eip-row:hover{background:${light?"rgba(200,146,42,.05)":"rgba(212,168,67,.04)"};}
.eip-row-chk{accent-color:var(--gold);width:15px;height:15px;cursor:pointer;flex-shrink:0;}
.eip-row-cover{width:34px;height:46px;border-radius:5px;background:linear-gradient(135deg,color-mix(in srgb,var(--cc) 18%,${light?"#f5efe6":"#020810"}),${light?"#f0e8d5":"#020810"});display:flex;align-items:center;justify-content:center;font-size:1.15rem;flex-shrink:0;}
.eip-row-info{flex:1;min-width:0;}
.eip-row-titles{display:flex;flex-direction:column;gap:1px;margin-bottom:5px;}
.eip-row-ar{font-family:'Amiri',serif;font-size:.93rem;direction:rtl;color:var(--text);}
.eip-row-en{font-family:'Crimson Pro',serif;font-size:.88rem;color:${light?"#3a2510":"#e0d4bc"};font-style:italic;}
.eip-row-meta{display:flex;flex-wrap:wrap;gap:8px;font-size:.76rem;color:var(--muted);}
.eip-meta-ar{font-family:'Amiri',serif;direction:rtl;}
.eip-meta-cat{font-weight:600;}
.eip-dup-warn{display:block;font-size:.72rem;color:#dc2626;margin-top:4px;}
.eip-cat-sel{background:${light?"rgba(255,248,235,.9)":"rgba(255,255,255,.05)"};border:1px solid var(--border);border-radius:7px;padding:5px 8px;color:var(--text);font-family:'Crimson Pro',serif;font-size:.78rem;cursor:pointer;outline:none;flex-shrink:0;max-width:140px;}
.ecs-light{}

.eip-footer{display:flex;gap:10px;justify-content:flex-end;align-items:center;}

@media(max-width:600px){.eig-cols{grid-template-columns:1fr 1fr;}.eip-row{flex-wrap:wrap;}.eip-cat-sel{max-width:100%;width:100%;}}
`;
}
