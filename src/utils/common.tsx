// Helper function to format date from MM/DD/YYYY to readable format
export const formatDateDisplay = (dateString: string) => {
    const [month, day, year] = dateString.split('/').map(Number);
    const date = new Date(year, month - 1, day);

    const dayNum = date.getDate();
    const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
    const fullYear = date.getFullYear();

    // Get ordinal suffix (st, nd, rd, th)
    const getOrdinal = (n: number) => {
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return s[(v - 20) % 10] || s[v] || s[0];
    };

    return `${dayNum}${getOrdinal(dayNum)} ${weekday} ${fullYear}`;
};

export const formatDate = (date: Date): string => {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
};

export const formatDateWithOrdinal = (date: Date) => {
    const day = date.getDate();
    const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
    const year = date.getFullYear();

    // Get ordinal suffix (st, nd, rd, th)
    const getOrdinal = (n: number) => {
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return s[(v - 20) % 10] || s[v] || s[0];
    };

    return `${day}${getOrdinal(day)} ${weekday} ${year}`;
};

export const generateCalendar = (currentMonthDate: Date) => {
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
        days.push(null);
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
        days.push(new Date(year, month, day));
    }

    return days;
};

// Check if date is less than 12 hours from now
export const isDateWithin12Hours = (date: Date) => {
    const now = new Date();
    const twelveHoursFromNow = new Date(now.getTime() + 12 * 60 * 60 * 1000);
    return date < twelveHoursFromNow;
};

export const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
};

// Generate time slots with 12-hour restriction
export const generateTimeSlots = (date: Date) => {
    const times: string[] = [];
    const now = new Date();
    const twelveHoursFromNow = new Date(now.getTime() + 12 * 60 * 60 * 1000);

    // Check if selected date is today or in the future
    const isToday = date.toDateString() === now.toDateString();
    const isFutureDate = date > now;

    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
            const h = hour.toString().padStart(2, '0');
            const m = minute.toString().padStart(2, '0');
            const time = `${h}:${m}`;

            // Create datetime for this slot
            const slotDateTime = new Date(date);
            slotDateTime.setHours(hour, minute, 0, 0);

            // If it's today, check if it's at least 12 hours from now
            if (isToday) {
                if (slotDateTime >= twelveHoursFromNow) {
                    times.push(time);
                }
            } else if (isFutureDate) {
                // For future dates, all times are allowed
                times.push(time);
            } else {
                // For past dates, no times allowed
                // This case shouldn't happen due to date validation
            }
        }
    }
    return times;
};

// Update selected time to ensure it's at least 12 hours from now
export const updateSelectedTimeToValid = (date: Date, currentTime: string) => {
    const timeSlots = generateTimeSlots(date);

    if (timeSlots.length === 0) {
        // No valid times for today, set to first available time tomorrow
        const tomorrow = new Date(date);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const firstValidTime = '00:00';
        return { date: tomorrow, time: firstValidTime };
    }

    // Check if current time is valid
    if (!timeSlots.includes(currentTime)) {
        // Find the next valid time
        const nextValidTime = timeSlots[0];
        return { date, time: nextValidTime };
    }

    return { date, time: currentTime };
};

// Helper function to check if a time slot is at least 12 hours from now
export const isTimeAtLeast12HoursFromNow = (date: Date, time: string): boolean => {
    const [hours, minutes] = time.split(':').map(Number);
    const selectedDateTime = new Date(date);
    selectedDateTime.setHours(hours, minutes, 0, 0);

    const now = new Date();
    const twelveHoursFromNow = new Date(now.getTime() + 12 * 60 * 60 * 1000);

    return selectedDateTime >= twelveHoursFromNow;
};

// Helper function to get category text based on car type
export const getCategoryText = (type: string) => {
    const lowerType = type.toLowerCase();

    if (lowerType.includes('4 passenger')) {
        return 'Or a similar vehicle';
    } else if (lowerType.includes('5 passenger')) {
        return 'Or a similar 5-seater vehicle';
    } else if (lowerType.includes('8 passenger')) {
        return 'Or a similar 8-seater minibus';
    } else if (lowerType.includes('16 passenger')) {
        return 'Or a similar 16-seater minibus';
    } else if (lowerType.includes('24 passenger')) {
        return 'Or a similar 24-seater minibus';
    } else if (lowerType.includes('56 passenger')) {
        return 'Or a similar 56-seater coach';
    } else if (lowerType.includes('64 passenger')) {
        return 'Or a similar 64-seater coach';
    } else if (lowerType.includes('72 passenger')) {
        return 'Or a similar 72-seater coach';
    } else {
        return 'Or a similar vehicle';
    }
};

/**
 * AIRPORT DETECTION STRATEGY
 *
 * Google Places resolves airport selections to their postal address, e.g.:
 *   "Edinburgh Airport" → "Edinburgh EH12 9DN, UK"
 *   "Heathrow Airport" → "Longford, Hounslow TW6 1EW, UK"
 *
 * We use TWO layers of detection:
 *   1. airportPostcodes — exact UK airport postcodes (catches Google's resolved addresses)
 *   2. airportKeywords — name/code keywords (catches typed or partially resolved addresses)
 */

export const airportPostcodes: string[] = [
    // ── LONDON ──────────────────────────────────
    'tw6',          // Heathrow (TW6 1EW / TW6 2GA etc.)
    'rh6',          // Gatwick (RH6 0NP)
    'cm24',         // Stansted (CM24 1QW)
    'lu2',          // Luton (LU2 9QT)
    'e16',          // London City (E16 2PX)
    'ss2',          // Southend (SS2 6YF)

    // ── ENGLAND ──────────────────────────────────
    'b26',          // Birmingham (B26 3QJ)
    'bs48',         // Bristol (BS48 3DY)
    'ex5',          // Exeter (EX5 2BD)
    'pl5',          // Plymouth City (PL5 2BQ -- closed, kept for legacy)
    'me14',         // Rochester (ME14)
    'tn29',         // Lydd (TN29 9QL)
    'bn26',         // Shoreham (BN26)
    'gu14',         // Farnborough (GU14 6XA)
    'hp27',         // Wycombe Air Park
    'sg6',          // London Luton satellite postcode
    'po3',          // Portsmouth (PO3 5PJ)
    'so18',         // Southampton (SO18 2NL)
    'dh1',          // Durham Tees Valley
    'dl2',          // Durham Tees Valley (DL2 1LU)
    'ts18',         // Teesside
    'ne13',         // Newcastle (NE13 8BZ)
    'sr5',          // Sunderland / Wearside
    'ls19',         // Leeds Bradford (LS19 7TU)
    'dn9',          // Doncaster Sheffield / Robin Hood (DN9 3RH)
    'hx4',          // Halifax / Calderdale
    'm90',          // Manchester (M90 1QX)
    'ch5',          // Hawarden / Chester (CH5 3FB)
    'cv8',          // Coventry (CV8 3AZ)
    'st18',         // Staffordshire (near Birmingham)
    'kw1',          // Wick (KW1 4QT)
    'tr9',          // Newquay Cornwall (TR9 6RJ)
    'pl12',         // Bodmin / Cornwall

    // ── SCOTLAND ─────────────────────────────────
    'eh12',         // Edinburgh (EH12 9DN)
    'eh28',         // Edinburgh Airport parking / nearby
    'pa3',          // Glasgow International (PA3 2SW)
    'ka9',          // Prestwick (KA9 2PL)
    'ab21',         // Aberdeen (AB21 7DU)
    'iv2',          // Inverness (IV2 7JB)
    'dd2',          // Dundee (DD2)
    'ph1',          // Perth Scone (PH1)
    'ky11',         // Leuchars / St Andrews area
    'hs1',          // Stornoway (HS1 2RB)
    'pa31',         // Campbeltown / Machrihanish
    'ze1',          // Sumburgh / Shetland (ZE1)
    'ze3',          // Lerwick/Tingwall
    'kw17',         // Kirkwall / Orkney
    'gy1',          // Guernsey (GY1)
    'je1',          // Jersey (JE1)

    // ── WALES ────────────────────────────────────
    'cf62',         // Cardiff (CF62 3BD)
    'sa1',          // Swansea (SA1)
    'll65',         // Anglesey (LL65 3NY)

    // ── NORTHERN IRELAND ─────────────────────────
    'bt3',          // Belfast City / George Best (BT3 9JH)
    'bt29',         // Belfast International (BT29 4AB)
    'bt94',         // Enniskillen (BT94)
    'bt41',         // Antrim (near Belfast Intl)
    'bt51',         // City of Derry / Londonderry (BT51)

    // ── ISLE OF MAN ──────────────────────────────
    'im4',          // Ronaldsway / IOM (IM4 1)
];

export const airportKeywords: string[] = [
    // Generic — safe standalone
    'airport',
    'terminal',

    // IATA codes — safe standalone (short, unique)
    'lhr', 'lgw', 'stn', 'ltn', 'lcy', 'sen',
    'bhx', 'man', 'edi', 'gla', 'brs', 'lpl',
    'ncl', 'ema', 'lba', 'dsa', 'abz', 'inv',
    'bfs', 'bhd', 'cwl', 'ext', 'nqy', 'sou',
    'pik', 'dnd', 'huy', 'blk', 'nwi', 'boh',
    'mme', 'oxf', 'fab', 'cbg', 'lyx', 'esh',
    'cvt', 'ceg', 'syy', 'koi', 'lsi', 'brr',
    'beb', 'ila', 'tre', 'lwk', 'cax', 'cal',
    'sws', 'jsy', 'gci', 'iom', 'ald',

    // Unambiguous multi-word names — safe standalone
    'heathrow',
    'gatwick',
    'stansted',
    'luton',
    'london city airport',
    'southend airport',
    'east midlands airport',
    'leeds bradford',
    'robin hood airport',
    'doncaster sheffield',
    'durham tees valley',
    'london southend',
    'glasgow prestwick',
    'prestwick airport',
    'george best belfast',
    'belfast international',
    'city of derry',
    'ronaldsway',
    'turnhouse',
    'ingliston',        // Edinburgh Airport area name
];

export const countryDialCodes = [
    // United Kingdom & Territories
    { code: '+44', name: 'United Kingdom', flag: '🇬🇧', countryCode: 'GB' },
    { code: '+44', name: 'Jersey', flag: '🇯🇪', countryCode: 'JE' },
    { code: '+44', name: 'Guernsey', flag: '🇬🇬', countryCode: 'GG' },
    { code: '+44', name: 'Isle of Man', flag: '🇮🇲', countryCode: 'IM' },

    // North America
    { code: '+1', name: 'United States', flag: '🇺🇸', countryCode: 'US' },
    { code: '+1', name: 'Canada', flag: '🇨🇦', countryCode: 'CA' },
    { code: '+52', name: 'Mexico', flag: '🇲🇽', countryCode: 'MX' },

    // Europe - Western
    { code: '+49', name: 'Germany', flag: '🇩🇪', countryCode: 'DE' },
    { code: '+33', name: 'France', flag: '🇫🇷', countryCode: 'FR' },
    { code: '+39', name: 'Italy', flag: '🇮🇹', countryCode: 'IT' },
    { code: '+34', name: 'Spain', flag: '🇪🇸', countryCode: 'ES' },
    { code: '+351', name: 'Portugal', flag: '🇵🇹', countryCode: 'PT' },
    { code: '+31', name: 'Netherlands', flag: '🇳🇱', countryCode: 'NL' },
    { code: '+32', name: 'Belgium', flag: '🇧🇪', countryCode: 'BE' },
    { code: '+41', name: 'Switzerland', flag: '🇨🇭', countryCode: 'CH' },
    { code: '+43', name: 'Austria', flag: '🇦🇹', countryCode: 'AT' },
    { code: '+353', name: 'Ireland', flag: '🇮🇪', countryCode: 'IE' },
    { code: '+352', name: 'Luxembourg', flag: '🇱🇺', countryCode: 'LU' },

    // Europe - Nordic
    { code: '+46', name: 'Sweden', flag: '🇸🇪', countryCode: 'SE' },
    { code: '+47', name: 'Norway', flag: '🇳🇴', countryCode: 'NO' },
    { code: '+45', name: 'Denmark', flag: '🇩🇰', countryCode: 'DK' },
    { code: '+358', name: 'Finland', flag: '🇫🇮', countryCode: 'FI' },
    { code: '+354', name: 'Iceland', flag: '🇮🇸', countryCode: 'IS' },

    // Europe - Mediterranean
    { code: '+356', name: 'Malta', flag: '🇲🇹', countryCode: 'MT' },
    { code: '+357', name: 'Cyprus', flag: '🇨🇾', countryCode: 'CY' },
    { code: '+30', name: 'Greece', flag: '🇬🇷', countryCode: 'GR' },

    // Europe - Central & Eastern
    { code: '+48', name: 'Poland', flag: '🇵🇱', countryCode: 'PL' },
    { code: '+420', name: 'Czech Republic', flag: '🇨🇿', countryCode: 'CZ' },
    { code: '+421', name: 'Slovakia', flag: '🇸🇰', countryCode: 'SK' },
    { code: '+36', name: 'Hungary', flag: '🇭🇺', countryCode: 'HU' },
    { code: '+40', name: 'Romania', flag: '🇷🇴', countryCode: 'RO' },
    { code: '+359', name: 'Bulgaria', flag: '🇧🇬', countryCode: 'BG' },
    { code: '+385', name: 'Croatia', flag: '🇭🇷', countryCode: 'HR' },
    { code: '+381', name: 'Serbia', flag: '🇷🇸', countryCode: 'RS' },
    { code: '+386', name: 'Slovenia', flag: '🇸🇮', countryCode: 'SI' },

    // Europe - Baltic
    { code: '+372', name: 'Estonia', flag: '🇪🇪', countryCode: 'EE' },
    { code: '+371', name: 'Latvia', flag: '🇱🇻', countryCode: 'LV' },
    { code: '+370', name: 'Lithuania', flag: '🇱🇹', countryCode: 'LT' },

    // Europe - Eastern
    { code: '+380', name: 'Ukraine', flag: '🇺🇦', countryCode: 'UA' },
    { code: '+7', name: 'Russia', flag: '🇷🇺', countryCode: 'RU' },

    // Europe - Other
    { code: '+90', name: 'Turkey', flag: '🇹🇷', countryCode: 'TR' },

    // Microstates & Special Territories
    { code: '+376', name: 'Andorra', flag: '🇦🇩', countryCode: 'AD' },
    { code: '+377', name: 'Monaco', flag: '🇲🇨', countryCode: 'MC' },
    { code: '+378', name: 'San Marino', flag: '🇸🇲', countryCode: 'SM' },
    { code: '+379', name: 'Vatican City', flag: '🇻🇦', countryCode: 'VA' },
    { code: '+423', name: 'Liechtenstein', flag: '🇱🇮', countryCode: 'LI' },
    { code: '+350', name: 'Gibraltar', flag: '🇬🇮', countryCode: 'GI' },
    { code: '+298', name: 'Faroe Islands', flag: '🇫🇴', countryCode: 'FO' },
    { code: '+299', name: 'Greenland', flag: '🇬🇱', countryCode: 'GL' },
    { code: '+358', name: 'Åland Islands', flag: '🇦🇽', countryCode: 'AX' },

    // Asia - South
    { code: '+91', name: 'India', flag: '🇮🇳', countryCode: 'IN' },
    { code: '+92', name: 'Pakistan', flag: '🇵🇰', countryCode: 'PK' },
    { code: '+880', name: 'Bangladesh', flag: '🇧🇩', countryCode: 'BD' },
    { code: '+94', name: 'Sri Lanka', flag: '🇱🇰', countryCode: 'LK' },
    { code: '+977', name: 'Nepal', flag: '🇳🇵', countryCode: 'NP' },

    // Asia - East
    { code: '+86', name: 'China', flag: '🇨🇳', countryCode: 'CN' },
    { code: '+81', name: 'Japan', flag: '🇯🇵', countryCode: 'JP' },
    { code: '+82', name: 'South Korea', flag: '🇰🇷', countryCode: 'KR' },
    { code: '+850', name: 'North Korea', flag: '🇰🇵', countryCode: 'KP' },
    { code: '+976', name: 'Mongolia', flag: '🇲🇳', countryCode: 'MN' },
    { code: '+886', name: 'Taiwan', flag: '🇹🇼', countryCode: 'TW' },
    { code: '+852', name: 'Hong Kong', flag: '🇭🇰', countryCode: 'HK' },
    { code: '+853', name: 'Macau', flag: '🇲🇴', countryCode: 'MO' },

    // Asia - Southeast
    { code: '+84', name: 'Vietnam', flag: '🇻🇳', countryCode: 'VN' },
    { code: '+66', name: 'Thailand', flag: '🇹🇭', countryCode: 'TH' },
    { code: '+60', name: 'Malaysia', flag: '🇲🇾', countryCode: 'MY' },
    { code: '+65', name: 'Singapore', flag: '🇸🇬', countryCode: 'SG' },
    { code: '+63', name: 'Philippines', flag: '🇵🇭', countryCode: 'PH' },
    { code: '+62', name: 'Indonesia', flag: '🇮🇩', countryCode: 'ID' },
    { code: '+95', name: 'Myanmar', flag: '🇲🇲', countryCode: 'MM' },
    { code: '+855', name: 'Cambodia', flag: '🇰🇭', countryCode: 'KH' },
    { code: '+856', name: 'Laos', flag: '🇱🇦', countryCode: 'LA' },

    // Asia - Central & West
    { code: '+93', name: 'Afghanistan', flag: '🇦🇫', countryCode: 'AF' },
    { code: '+98', name: 'Iran', flag: '🇮🇷', countryCode: 'IR' },
    { code: '+964', name: 'Iraq', flag: '🇮🇶', countryCode: 'IQ' },
    { code: '+963', name: 'Syria', flag: '🇸🇾', countryCode: 'SY' },
    { code: '+961', name: 'Lebanon', flag: '🇱🇧', countryCode: 'LB' },
    { code: '+962', name: 'Jordan', flag: '🇯🇴', countryCode: 'JO' },
    { code: '+972', name: 'Israel', flag: '🇮🇱', countryCode: 'IL' },
    { code: '+970', name: 'Palestine', flag: '🇵🇸', countryCode: 'PS' },

    // Middle East - Gulf
    { code: '+966', name: 'Saudi Arabia', flag: '🇸🇦', countryCode: 'SA' },
    { code: '+971', name: 'UAE', flag: '🇦🇪', countryCode: 'AE' },
    { code: '+974', name: 'Qatar', flag: '🇶🇦', countryCode: 'QA' },
    { code: '+965', name: 'Kuwait', flag: '🇰🇼', countryCode: 'KW' },
    { code: '+973', name: 'Bahrain', flag: '🇧🇭', countryCode: 'BH' },
    { code: '+968', name: 'Oman', flag: '🇴🇲', countryCode: 'OM' },
    { code: '+967', name: 'Yemen', flag: '🇾🇪', countryCode: 'YE' },

    // Oceania
    { code: '+61', name: 'Australia', flag: '🇦🇺', countryCode: 'AU' },
    { code: '+64', name: 'New Zealand', flag: '🇳🇿', countryCode: 'NZ' },

    // Africa - North
    { code: '+20', name: 'Egypt', flag: '🇪🇬', countryCode: 'EG' },
    { code: '+212', name: 'Morocco', flag: '🇲🇦', countryCode: 'MA' },
    { code: '+213', name: 'Algeria', flag: '🇩🇿', countryCode: 'DZ' },
    { code: '+216', name: 'Tunisia', flag: '🇹🇳', countryCode: 'TN' },
    { code: '+218', name: 'Libya', flag: '🇱🇾', countryCode: 'LY' },

    // Africa - East
    { code: '+249', name: 'Sudan', flag: '🇸🇩', countryCode: 'SD' },
    { code: '+252', name: 'Somalia', flag: '🇸🇴', countryCode: 'SO' },
    { code: '+253', name: 'Djibouti', flag: '🇩🇯', countryCode: 'DJ' },
    { code: '+291', name: 'Eritrea', flag: '🇪🇷', countryCode: 'ER' },
    { code: '+251', name: 'Ethiopia', flag: '🇪🇹', countryCode: 'ET' },
    { code: '+254', name: 'Kenya', flag: '🇰🇪', countryCode: 'KE' },
    { code: '+256', name: 'Uganda', flag: '🇺🇬', countryCode: 'UG' },
    { code: '+250', name: 'Rwanda', flag: '🇷🇼', countryCode: 'RW' },
    { code: '+257', name: 'Burundi', flag: '🇧🇮', countryCode: 'BI' },
    { code: '+255', name: 'Tanzania', flag: '🇹🇿', countryCode: 'TZ' },

    // Africa - Southern
    { code: '+27', name: 'South Africa', flag: '🇿🇦', countryCode: 'ZA' },
    { code: '+258', name: 'Mozambique', flag: '🇲🇿', countryCode: 'MZ' },
    { code: '+260', name: 'Zambia', flag: '🇿🇲', countryCode: 'ZM' },
    { code: '+263', name: 'Zimbabwe', flag: '🇿🇼', countryCode: 'ZW' },
    { code: '+265', name: 'Malawi', flag: '🇲🇼', countryCode: 'MW' },
    { code: '+266', name: 'Lesotho', flag: '🇱🇸', countryCode: 'LS' },
    { code: '+267', name: 'Botswana', flag: '🇧🇼', countryCode: 'BW' },
    { code: '+268', name: 'Eswatini', flag: '🇸🇿', countryCode: 'SZ' },
    { code: '+264', name: 'Namibia', flag: '🇳🇦', countryCode: 'NA' },

    // Africa - Island Nations
    { code: '+261', name: 'Madagascar', flag: '🇲🇬', countryCode: 'MG' },
    { code: '+269', name: 'Comoros', flag: '🇰🇲', countryCode: 'KM' },
    { code: '+248', name: 'Seychelles', flag: '🇸🇨', countryCode: 'SC' },
    { code: '+230', name: 'Mauritius', flag: '🇲🇺', countryCode: 'MU' },
    { code: '+238', name: 'Cape Verde', flag: '🇨🇻', countryCode: 'CV' },
    { code: '+239', name: 'São Tomé and Príncipe', flag: '🇸🇹', countryCode: 'ST' },

    // Africa - West
    { code: '+234', name: 'Nigeria', flag: '🇳🇬', countryCode: 'NG' },
    { code: '+233', name: 'Ghana', flag: '🇬🇭', countryCode: 'GH' },
    { code: '+225', name: 'Ivory Coast', flag: '🇨🇮', countryCode: 'CI' },
    { code: '+228', name: 'Togo', flag: '🇹🇬', countryCode: 'TG' },
    { code: '+229', name: 'Benin', flag: '🇧🇯', countryCode: 'BJ' },
    { code: '+245', name: 'Guinea-Bissau', flag: '🇬🇼', countryCode: 'GW' },
    { code: '+224', name: 'Guinea', flag: '🇬🇳', countryCode: 'GN' },
    { code: '+232', name: 'Sierra Leone', flag: '🇸🇱', countryCode: 'SL' },
    { code: '+231', name: 'Liberia', flag: '🇱🇷', countryCode: 'LR' },
    { code: '+226', name: 'Burkina Faso', flag: '🇧🇫', countryCode: 'BF' },
    { code: '+223', name: 'Mali', flag: '🇲🇱', countryCode: 'ML' },
    { code: '+221', name: 'Senegal', flag: '🇸🇳', countryCode: 'SN' },
    { code: '+220', name: 'Gambia', flag: '🇬🇲', countryCode: 'GM' },
    { code: '+222', name: 'Mauritania', flag: '🇲🇷', countryCode: 'MR' },

    // Africa - Central
    { code: '+227', name: 'Niger', flag: '🇳🇪', countryCode: 'NE' },
    { code: '+235', name: 'Chad', flag: '🇹🇩', countryCode: 'TD' },
    { code: '+236', name: 'Central African Republic', flag: '🇨🇫', countryCode: 'CF' },
    { code: '+237', name: 'Cameroon', flag: '🇨🇲', countryCode: 'CM' },
    { code: '+240', name: 'Equatorial Guinea', flag: '🇬🇶', countryCode: 'GQ' },
    { code: '+241', name: 'Gabon', flag: '🇬🇦', countryCode: 'GA' },
    { code: '+242', name: 'Republic of the Congo', flag: '🇨🇬', countryCode: 'CG' },
    { code: '+243', name: 'DR Congo', flag: '🇨🇩', countryCode: 'CD' },
    { code: '+244', name: 'Angola', flag: '🇦🇴', countryCode: 'AO' },

    // South America
    { code: '+55', name: 'Brazil', flag: '🇧🇷', countryCode: 'BR' },
    { code: '+54', name: 'Argentina', flag: '🇦🇷', countryCode: 'AR' },

    // Caribbean & Atlantic Islands
    { code: '+290', name: 'Saint Helena', flag: '🇸🇭', countryCode: 'SH' },
    { code: '+500', name: 'Falkland Islands', flag: '🇫🇰', countryCode: 'FK' },

    // French Territories
    { code: '+262', name: 'Réunion', flag: '🇷🇪', countryCode: 'RE' },
    { code: '+262', name: 'Mayotte', flag: '🇾🇹', countryCode: 'YT' },
    { code: '+594', name: 'French Guiana', flag: '🇬🇫', countryCode: 'GF' },
    { code: '+689', name: 'French Polynesia', flag: '🇵🇫', countryCode: 'PF' },
    { code: '+687', name: 'New Caledonia', flag: '🇳🇨', countryCode: 'NC' },
    { code: '+681', name: 'Wallis and Futuna', flag: '🇼🇫', countryCode: 'WF' },
    { code: '+508', name: 'Saint Pierre and Miquelon', flag: '🇵🇲', countryCode: 'PM' },
    { code: '+590', name: 'Saint Barthélemy', flag: '🇧🇱', countryCode: 'BL' },
    { code: '+590', name: 'Saint Martin', flag: '🇲🇫', countryCode: 'MF' },

    // Netherlands Territories
    { code: '+297', name: 'Aruba', flag: '🇦🇼', countryCode: 'AW' },
    { code: '+599', name: 'Curaçao', flag: '🇨🇼', countryCode: 'CW' },
    { code: '+1', name: 'Sint Maarten', flag: '🇸🇽', countryCode: 'SX' },
    { code: '+599', name: 'Caribbean Netherlands', flag: '🇧🇶', countryCode: 'BQ' },

    // UK Caribbean Territories
    { code: '+1', name: 'Anguilla', flag: '🇦🇮', countryCode: 'AI' },
    { code: '+1', name: 'Bermuda', flag: '🇧🇲', countryCode: 'BM' },
    { code: '+1', name: 'British Virgin Islands', flag: '🇻🇬', countryCode: 'VG' },
    { code: '+1', name: 'Cayman Islands', flag: '🇰🇾', countryCode: 'KY' },
    { code: '+1', name: 'Montserrat', flag: '🇲🇸', countryCode: 'MS' },
    { code: '+1', name: 'Turks and Caicos', flag: '🇹🇨', countryCode: 'TC' },

    // US Territories
    { code: '+1', name: 'Puerto Rico', flag: '🇵🇷', countryCode: 'PR' },
    { code: '+1', name: 'US Virgin Islands', flag: '🇻🇮', countryCode: 'VI' },
    { code: '+1', name: 'Guam', flag: '🇬🇺', countryCode: 'GU' },
    { code: '+1', name: 'American Samoa', flag: '🇦🇸', countryCode: 'AS' },
    { code: '+1', name: 'Northern Mariana Islands', flag: '🇲🇵', countryCode: 'MP' },
];

export const getFlagUrl = (countryCode: string): string => {
    // Convert to lowercase for flag CDN
    return `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;
};

// Calculate rental hours for daily rental
export const calculateRentalHours = (pickupDate: Date, pickupTime: string, dropoffDate: Date, dropoffTime: string) => {
    const pickupDateTime = new Date(pickupDate);
    const [pickupHour, pickupMinute] = pickupTime.split(':').map(Number);
    pickupDateTime.setHours(pickupHour, pickupMinute, 0, 0);

    const dropoffDateTime = new Date(dropoffDate);
    const [dropoffHour, dropoffMinute] = dropoffTime.split(':').map(Number);
    dropoffDateTime.setHours(dropoffHour, dropoffMinute, 0, 0);

    const diffMs = dropoffDateTime.getTime() - pickupDateTime.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    return Math.max(0, diffHours);
};

export const formatTime12Hour = (time24: string) => {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
};

// Calculate rental days for multi-day rental
export const calculateRentalDays = (pickupDate: Date, dropoffDate: Date) => {
    if (pickupDate.toDateString() === dropoffDate.toDateString()) {
        return 1;
    }
    const diffTime = Math.abs(dropoffDate.getTime() - pickupDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays);
};