import type { Unit } from './types'

/*
 * THE COURSE. Edit lessons here.
 *
 * Every phrase has hi (Devanagari), rom (romanised) and en (English); accept lists other answers that count.
 * fem gives the form for learners who chose feminine forms, where Hindi differs (मैं नया हूँ → मैं नई हूँ).
 * {name} is replaced with the learner's first name.
 *
 * Romanisation follows one plain scheme throughout: aa, ee/i, oo/u, n for nasal sounds (hain, hoon),
 * ch for च, chh for छ, and an apostrophe-free spelling.
 *
 * Have a fluent Hindi speaker review any new or changed text before it ships.
 */
export const COURSE: Unit[] = [
  {
    id: 'first-words',
    title: 'First conversations',
    hi: 'पहली बातचीत',
    lessons: [
      {
        id: 'namaste',
        title: 'Namaste!',
        subtitle: 'Greet your neighbour and ask how she is',
        scene: 'You meet Priya, your neighbour, on the stairs one morning.',
        colors: ['#fde68a', '#f97316'],
        props: ['🪴', '🏠'],
        character: { name: 'Priya', role: 'your neighbour', emoji: '👩🏽', voice: 'female' },
        learn: [
          { hi: 'नमस्ते', rom: 'namaste', en: 'Hello', accept: ['नमस्कार', 'namaskar'] },
          { hi: 'आप कैसी हैं?', rom: 'aap kaisi hain?', en: 'How are you? (to a woman)' },
          { hi: 'मैं ठीक हूँ', rom: 'main theek hoon', en: 'I am fine' },
          { hi: 'और आप?', rom: 'aur aap?', en: 'And you?' },
          { hi: 'फिर मिलेंगे', rom: 'phir milenge', en: 'See you again' },
        ],
        conversation: [
          { who: 'them', hi: 'नमस्ते!', rom: 'namaste!', en: 'Hello!' },
          { who: 'you', hi: 'नमस्ते! आप कैसी हैं?', rom: 'namaste! aap kaisi hain?', en: 'Hello! How are you?' },
          { who: 'them', hi: 'मैं ठीक हूँ। आप कैसे हैं?', rom: 'main theek hoon. aap kaise hain?', en: 'I am fine. How are you?',
            fem: { hi: 'मैं ठीक हूँ। आप कैसी हैं?', rom: 'main theek hoon. aap kaisi hain?' } },
          { who: 'you', hi: 'मैं भी ठीक हूँ, धन्यवाद।', rom: 'main bhi theek hoon, dhanyavaad.', en: 'I am fine too, thank you.' },
          { who: 'them', hi: 'अच्छा, मुझे देर हो रही है।', rom: 'achchha, mujhe der ho rahi hai.', en: 'Okay, I am getting late.' },
          { who: 'you', hi: 'कोई बात नहीं। फिर मिलेंगे!', rom: 'koi baat nahin. phir milenge!', en: 'No problem. See you again!' },
          { who: 'them', hi: 'हाँ, फिर मिलेंगे!', rom: 'haan, phir milenge!', en: 'Yes, see you!' },
        ],
        tip: 'नमस्ते works at any time of day and with anyone. When you ask how someone is, use कैसे with a man and कैसी with a woman.',
      },
      {
        id: 'introductions',
        title: 'What’s your name?',
        subtitle: 'Introduce yourself to a new colleague',
        scene: 'It is your first day at a new office. Rohan sits at the next desk.',
        colors: ['#bae6fd', '#2563eb'],
        props: ['💻', '☕'],
        character: { name: 'Rohan', role: 'your new colleague', emoji: '👨🏽', voice: 'male' },
        learn: [
          { hi: 'आपका नाम क्या है?', rom: 'aapka naam kya hai?', en: 'What is your name?' },
          { hi: 'मेरा नाम {name} है', rom: 'mera naam {name} hai', en: 'My name is {name}' },
          { hi: 'मैं यहाँ नया हूँ', rom: 'main yahaan naya hoon', en: 'I am new here',
            fem: { hi: 'मैं यहाँ नई हूँ', rom: 'main yahaan nayi hoon' } },
          { hi: 'आपसे मिलकर खुशी हुई', rom: 'aapse milkar khushi hui', en: 'Nice to meet you' },
        ],
        conversation: [
          { who: 'them', hi: 'नमस्ते! मेरा नाम रोहन है। आपका नाम क्या है?', rom: 'namaste! mera naam Rohan hai. aapka naam kya hai?', en: 'Hello! My name is Rohan. What is your name?' },
          { who: 'you', hi: 'नमस्ते! मेरा नाम {name} है।', rom: 'namaste! mera naam {name} hai.', en: 'Hello! My name is {name}.' },
          { who: 'them', hi: 'आप यहाँ नए हैं?', rom: 'aap yahaan naye hain?', en: 'Are you new here?',
            fem: { hi: 'आप यहाँ नई हैं?', rom: 'aap yahaan nayi hain?' } },
          { who: 'you', hi: 'हाँ, मैं यहाँ नया हूँ।', rom: 'haan, main yahaan naya hoon.', en: 'Yes, I am new here.',
            fem: { hi: 'हाँ, मैं यहाँ नई हूँ।', rom: 'haan, main yahaan nayi hoon.' } },
          { who: 'them', hi: 'कोई बात नहीं, मैं आपकी मदद करूँगा।', rom: 'koi baat nahin, main aapki madad karoonga.', en: 'No problem, I will help you.' },
          { who: 'you', hi: 'धन्यवाद! आपसे मिलकर खुशी हुई।', rom: 'dhanyavaad! aapse milkar khushi hui.', en: 'Thank you! Nice to meet you.' },
          { who: 'them', hi: 'मुझे भी!', rom: 'mujhe bhi!', en: 'Me too!' },
        ],
        tip: 'In Hindi, verbs and adjectives change with the speaker’s gender: a man says मैं नया हूँ, a woman says मैं नई हूँ. Bolo uses the forms you chose in Settings.',
      },
      {
        id: 'polite',
        title: 'Yes please, thank you',
        subtitle: 'Accept, decline and leave politely',
        scene: 'Sharma Aunty from next door has invited you in for lunch.',
        colors: ['#fecdd3', '#db2777'],
        props: ['🍛', '🫓'],
        character: { name: 'Sharma Aunty', role: 'your neighbour', emoji: '👵🏽', voice: 'female' },
        learn: [
          { hi: 'जी हाँ, धन्यवाद', rom: 'ji haan, dhanyavaad', en: 'Yes, thank you', accept: ['जी हां धन्यवाद'] },
          { hi: 'जी नहीं, बस', rom: 'ji nahin, bas', en: 'No, that is enough' },
          { hi: 'शुक्रिया', rom: 'shukriya', en: 'Thanks' },
          { hi: 'माफ़ कीजिए, मुझे जाना है', rom: 'maaf kijiye, mujhe jaana hai', en: 'Excuse me, I have to go', accept: ['माफ कीजिए मुझे जाना है', 'माफ़ कीजिये मुझे जाना है'] },
        ],
        conversation: [
          { who: 'them', hi: 'बेटा, खाना खाओगे?', rom: 'beta, khaana khaoge?', en: 'Dear, will you eat?',
            fem: { hi: 'बेटी, खाना खाओगी?', rom: 'beti, khaana khaogi?' } },
          { who: 'you', hi: 'जी हाँ, धन्यवाद!', rom: 'ji haan, dhanyavaad!', en: 'Yes, thank you!', accept: ['जी हां धन्यवाद'] },
          { who: 'them', hi: 'और लो, और लो!', rom: 'aur lo, aur lo!', en: 'Have some more, have some more!' },
          { who: 'you', hi: 'जी नहीं, बस। शुक्रिया!', rom: 'ji nahin, bas. shukriya!', en: 'No, that is enough. Thanks!' },
          { who: 'them', hi: 'चाय पियोगे?', rom: 'chai piyoge?', en: 'Will you have tea?',
            fem: { hi: 'चाय पियोगी?', rom: 'chai piyogi?' } },
          { who: 'you', hi: 'माफ़ कीजिए, मुझे जाना है।', rom: 'maaf kijiye, mujhe jaana hai.', en: 'Excuse me, I have to go.', accept: ['माफ कीजिए मुझे जाना है', 'माफ़ कीजिये मुझे जाना है'] },
          { who: 'them', hi: 'कोई बात नहीं, फिर आना!', rom: 'koi baat nahin, phir aana!', en: 'No problem, come again!' },
        ],
        tip: 'जी makes yes and no polite: जी हाँ, जी नहीं. शुक्रिया is a little more casual than धन्यवाद. Elders often call younger people बेटा or बेटी, a warm “dear”.',
      },
    ],
  },
  {
    id: 'out-and-about',
    title: 'Out and about',
    hi: 'बाहर',
    lessons: [
      {
        id: 'chai',
        title: 'At the chai stall',
        subtitle: 'Order a tea just the way you like it',
        scene: 'A busy street corner. Ramesh bhaiya is pouring chai.',
        colors: ['#fed7aa', '#b45309'],
        props: ['☕', '🫖'],
        character: { name: 'Ramesh bhaiya', role: 'the chai seller', emoji: '👨🏽‍🍳', voice: 'male' },
        learn: [
          { hi: 'भैया, एक चाय दीजिए', rom: 'bhaiya, ek chai dijiye', en: 'Brother, one tea please', accept: ['भैया एक चाय दीजिये'] },
          { hi: 'चीनी कम डालिए', rom: 'cheeni kam daaliye', en: 'Please put in less sugar', accept: ['चीनी कम डालिये'] },
          { hi: 'बहुत अच्छी चाय है', rom: 'bahut achchhi chai hai', en: 'The tea is very good' },
          { hi: 'कितने पैसे हुए?', rom: 'kitne paise hue?', en: 'How much is it?' },
        ],
        conversation: [
          { who: 'them', hi: 'हाँ जी, क्या लेंगे?', rom: 'haan ji, kya lenge?', en: 'Yes, what will you have?' },
          { who: 'you', hi: 'भैया, एक चाय दीजिए।', rom: 'bhaiya, ek chai dijiye.', en: 'Brother, one tea please.', accept: ['भैया एक चाय दीजिये'] },
          { who: 'them', hi: 'चीनी वाली?', rom: 'cheeni waali?', en: 'With sugar?' },
          { who: 'you', hi: 'हाँ, पर चीनी कम डालिए।', rom: 'haan, par cheeni kam daaliye.', en: 'Yes, but put in less sugar.', accept: ['हां पर चीनी कम डालिये'] },
          { who: 'them', hi: 'ये लीजिए, आपकी चाय।', rom: 'ye lijiye, aapki chai.', en: 'Here you go, your tea.' },
          { who: 'you', hi: 'वाह, बहुत अच्छी चाय है! कितने पैसे हुए?', rom: 'vaah, bahut achchhi chai hai! kitne paise hue?', en: 'Wow, the tea is very good! How much is it?' },
          { who: 'them', hi: 'बीस रुपये।', rom: 'bees rupaye.', en: 'Twenty rupees.' },
          { who: 'you', hi: 'ये लीजिए। धन्यवाद!', rom: 'ye lijiye. dhanyavaad!', en: 'Here you go. Thank you!', accept: ['ये लीजिये धन्यवाद', 'यह लीजिए धन्यवाद'] },
        ],
        tip: 'दीजिए is the polite “please give”: add it to almost anything you order. Calling a man भैया (brother) is friendly and normal at stalls and shops.',
      },
      {
        id: 'market',
        title: 'At the vegetable market',
        subtitle: 'Ask the rate and bargain a little',
        scene: 'The evening sabzi market. Sunita ji has fresh tomatoes.',
        colors: ['#bbf7d0', '#15803d'],
        props: ['🍅', '🧺'],
        character: { name: 'Sunita ji', role: 'the vegetable seller', emoji: '👩🏽‍🌾', voice: 'female' },
        learn: [
          { hi: 'ये टमाटर कैसे दिए?', rom: 'ye tamaatar kaise diye?', en: 'How much are these tomatoes?', accept: ['यह टमाटर कैसे दिए'] },
          { hi: 'बहुत महँगे हैं', rom: 'bahut mahange hain', en: 'They are very expensive', accept: ['बहुत महंगे हैं', 'bahut mehenge hain'] },
          { hi: 'थोड़ा कम कीजिए', rom: 'thoda kam kijiye', en: 'Please lower it a little', accept: ['थोड़ा कम कीजिये', 'थोडा कम कीजिए'] },
          { hi: 'एक किलो दीजिए', rom: 'ek kilo dijiye', en: 'Give me one kilo', accept: ['1 किलो दीजिए', 'एक किलो दीजिये'] },
        ],
        conversation: [
          { who: 'them', hi: 'आइए, आइए! ताज़ी सब्ज़ी लीजिए!', rom: 'aaiye, aaiye! taazi sabzi lijiye!', en: 'Come, come! Get fresh vegetables!' },
          { who: 'you', hi: 'ये टमाटर कैसे दिए?', rom: 'ye tamaatar kaise diye?', en: 'How much are these tomatoes?', accept: ['यह टमाटर कैसे दिए'] },
          { who: 'them', hi: 'साठ रुपये किलो।', rom: 'saath rupaye kilo.', en: 'Sixty rupees a kilo.' },
          { who: 'you', hi: 'बहुत महँगे हैं! थोड़ा कम कीजिए।', rom: 'bahut mahange hain! thoda kam kijiye.', en: 'They are very expensive! Please lower it a little.', accept: ['बहुत महंगे हैं थोड़ा कम कीजिए', 'बहुत महंगे हैं थोड़ा कम कीजिये'] },
          { who: 'them', hi: 'अच्छा, पचास दे दीजिए।', rom: 'achchha, pachaas de dijiye.', en: 'Okay, give me fifty.' },
          { who: 'you', hi: 'ठीक है, एक किलो दीजिए।', rom: 'theek hai, ek kilo dijiye.', en: 'Okay, give me one kilo.', accept: ['ठीक है 1 किलो दीजिए', 'ठीक है एक किलो दीजिये'] },
          { who: 'them', hi: 'ये लीजिए। और कुछ?', rom: 'ye lijiye. aur kuchh?', en: 'Here you go. Anything else?' },
          { who: 'you', hi: 'बस, इतना ही।', rom: 'bas, itna hi.', en: 'That is all.' },
        ],
        tip: '“कैसे दिए?” (literally “how did you give them?”) is how people ask the rate at a market. Gentle bargaining is normal at markets, but not in shops with fixed prices.',
      },
      {
        id: 'auto',
        title: 'Taking an auto',
        subtitle: 'Agree the fare and give directions',
        scene: 'You need to get to the railway station. An auto-rickshaw pulls up.',
        colors: ['#fef08a', '#65a30d'],
        props: ['🛺', '🚉'],
        character: { name: 'Ali bhai', role: 'the auto driver', emoji: '🧔🏽', voice: 'male' },
        learn: [
          { hi: 'भैया, स्टेशन चलेंगे?', rom: 'bhaiya, station chalenge?', en: 'Will you go to the station?' },
          { hi: 'कितना लेंगे?', rom: 'kitna lenge?', en: 'How much will you charge?' },
          { hi: 'सीधे चलिए, फिर बाएँ मुड़िए', rom: 'seedhe chaliye, phir baayen mudiye', en: 'Go straight, then turn left', accept: ['सीधे चलिए फिर बाएं मुड़िए', 'सीधे चलिये फिर बाएँ मुड़िये'] },
          { hi: 'यहीं रोकिए', rom: 'yahin rokiye', en: 'Stop right here', accept: ['यहीं रोकिये', 'यही रोकिए'] },
        ],
        conversation: [
          { who: 'you', hi: 'भैया, स्टेशन चलेंगे?', rom: 'bhaiya, station chalenge?', en: 'Will you go to the station?' },
          { who: 'them', hi: 'हाँ, चलेंगे।', rom: 'haan, chalenge.', en: 'Yes, I will.' },
          { who: 'you', hi: 'कितना लेंगे?', rom: 'kitna lenge?', en: 'How much will you charge?' },
          { who: 'them', hi: 'सौ रुपये। बैठिए।', rom: 'sau rupaye. baithiye.', en: 'A hundred rupees. Get in.' },
          { who: 'them', hi: 'किधर से चलूँ?', rom: 'kidhar se chaloon?', en: 'Which way should I go?' },
          { who: 'you', hi: 'सीधे चलिए, फिर बाएँ मुड़िए।', rom: 'seedhe chaliye, phir baayen mudiye.', en: 'Go straight, then turn left.', accept: ['सीधे चलिए फिर बाएं मुड़िए', 'सीधे चलिये फिर बाएँ मुड़िये'] },
          { who: 'them', hi: 'लीजिए, स्टेशन आ गया।', rom: 'lijiye, station aa gaya.', en: 'Here we are, this is the station.' },
          { who: 'you', hi: 'यहीं रोकिए। धन्यवाद!', rom: 'yahin rokiye. dhanyavaad!', en: 'Stop right here. Thank you!', accept: ['यहीं रोकिये धन्यवाद', 'यही रोकिए धन्यवाद'] },
        ],
        tip: 'Agree on the fare before you get in, or ask for the meter: मीटर से चलिए. बाएँ is left and दाएँ is right.',
      },
    ],
  },
  {
    id: 'people',
    title: 'Getting to know people',
    hi: 'लोगों से मिलना',
    lessons: [
      {
        id: 'family',
        title: 'Talking about family',
        subtitle: 'Say who is in your family and ask about theirs',
        scene: 'Over coffee, your friend Meera asks about your family.',
        colors: ['#e9d5ff', '#7c3aed'],
        props: ['🏡', '📷'],
        character: { name: 'Meera', role: 'your friend', emoji: '👩🏽‍🦱', voice: 'female' },
        learn: [
          { hi: 'मेरे परिवार में चार लोग हैं', rom: 'mere parivaar mein chaar log hain', en: 'There are four people in my family', accept: ['मेरे परिवार में 4 लोग हैं'] },
          { hi: 'मेरा एक भाई है', rom: 'mera ek bhai hai', en: 'I have a brother', accept: ['मेरा 1 भाई है'] },
          { hi: 'मेरी एक बहन है', rom: 'meri ek bahan hai', en: 'I have a sister', accept: ['मेरी 1 बहन है'] },
          { hi: 'आपके माता-पिता कहाँ रहते हैं?', rom: 'aapke maata-pita kahaan rehte hain?', en: 'Where do your parents live?', accept: ['आपके माता पिता कहां रहते हैं'] },
        ],
        conversation: [
          { who: 'them', hi: 'आपके परिवार में कौन-कौन है?', rom: 'aapke parivaar mein kaun-kaun hai?', en: 'Who is in your family?' },
          { who: 'you', hi: 'मेरे परिवार में चार लोग हैं।', rom: 'mere parivaar mein chaar log hain.', en: 'There are four people in my family.', accept: ['मेरे परिवार में 4 लोग हैं'] },
          { who: 'them', hi: 'अच्छा! भाई-बहन हैं?', rom: 'achchha! bhai-bahan hain?', en: 'Nice! Do you have brothers and sisters?' },
          { who: 'you', hi: 'हाँ, मेरा एक भाई है और एक बहन भी।', rom: 'haan, mera ek bhai hai aur ek bahan bhi.', en: 'Yes, I have a brother and a sister too.', accept: ['हां मेरा 1 भाई है और 1 बहन भी'] },
          { who: 'them', hi: 'मेरी दो बहनें हैं।', rom: 'meri do bahanen hain.', en: 'I have two sisters.' },
          { who: 'you', hi: 'आपके माता-पिता कहाँ रहते हैं?', rom: 'aapke maata-pita kahaan rehte hain?', en: 'Where do your parents live?', accept: ['आपके माता पिता कहां रहते हैं'] },
          { who: 'them', hi: 'दिल्ली में। और आपके?', rom: 'dilli mein. aur aapke?', en: 'In Delhi. And yours?' },
        ],
        tip: 'Parents and elders are spoken about with the plural हैं as a mark of respect: माता-पिता कहाँ रहते हैं?',
      },
      {
        id: 'plans',
        title: 'Making plans',
        subtitle: 'Agree on a film and a time to meet',
        scene: 'Your friend Arjun calls you up with an idea for tomorrow.',
        colors: ['#c7d2fe', '#4338ca'],
        props: ['🎬', '🍿'],
        character: { name: 'Arjun', role: 'your friend', emoji: '🧑🏽', voice: 'male' },
        learn: [
          { hi: 'हाँ, मैं फ़्री हूँ', rom: 'haan, main free hoon', en: 'Yes, I am free', accept: ['हां मैं फ्री हूं', 'हाँ मैं फ्री हूँ'] },
          { hi: 'बढ़िया! कितने बजे?', rom: 'badhiya! kitne baje?', en: 'Great! What time?', accept: ['बढ़िया कितने बजे', 'बढिया कितने बजे'] },
          { hi: 'शाम छह बजे', rom: 'shaam chhah baje', en: 'At six in the evening', accept: ['शाम 6 बजे', 'शाम छः बजे'] },
          { hi: 'ठीक है, कल मिलते हैं', rom: 'theek hai, kal milte hain', en: 'Okay, see you tomorrow' },
        ],
        conversation: [
          { who: 'them', hi: 'हेलो! कल आप फ़्री हैं?', rom: 'hello! kal aap free hain?', en: 'Hello! Are you free tomorrow?' },
          { who: 'you', hi: 'हाँ, मैं फ़्री हूँ। क्यों?', rom: 'haan, main free hoon. kyon?', en: 'Yes, I am free. Why?', accept: ['हां मैं फ्री हूं क्यों', 'हाँ मैं फ्री हूँ क्यों'] },
          { who: 'them', hi: 'चलिए, फ़िल्म देखते हैं!', rom: 'chaliye, film dekhte hain!', en: 'Let’s watch a film!' },
          { who: 'you', hi: 'बढ़िया! कितने बजे?', rom: 'badhiya! kitne baje?', en: 'Great! What time?', accept: ['बढ़िया कितने बजे', 'बढिया कितने बजे'] },
          { who: 'them', hi: 'शाम छह बजे। ठीक है?', rom: 'shaam chhah baje. theek hai?', en: 'At six in the evening. Okay?' },
          { who: 'you', hi: 'ठीक है, कल मिलते हैं!', rom: 'theek hai, kal milte hain!', en: 'Okay, see you tomorrow!' },
          { who: 'them', hi: 'पक्का! कल मिलते हैं।', rom: 'pakka! kal milte hain.', en: 'For sure! See you tomorrow.' },
        ],
        tip: 'Friends often say तुम instead of आप, but आप is always polite and never wrong. Hindi uses बजे for o’clock: छह बजे is six o’clock.',
      },
    ],
  },
]

/** Every lesson in course order */
export const LESSONS = COURSE.flatMap(u => u.lessons)

export function findLesson(id: string) {
  return LESSONS.find(l => l.id === id)
}
