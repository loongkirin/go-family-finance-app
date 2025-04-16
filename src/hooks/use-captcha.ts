"use client"
import { useEffect, useState } from 'react';
import { CaptchaData, accountApi } from '@/features/accounts/api/account';

const useCaptcha = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [captchaData, setCaptchaData] = useState<CaptchaData>({ captcha_id: "", pic_path: "", captcha_length: 0 });
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        fetchCaptcha();        
    }, [])

    const fetchCaptcha = async () => {
        try {
            setIsLoading(true);
            setErrorMessage("");
            const response = await accountApi.fetchCaptcha();
            // console.log("fetch captcha response", response);
            if (response.code !== 200) {
                setErrorMessage(response.message);
                return;
            }
            const data = response.result.data;
            // console.log("fetch captcha data", data);
            // const captchaData: CaptchaData = { CaptchaId: data.captcha_id, PicPath: data.pic_path, CaptchaLength: data.captcha_length };
            const captchaData: CaptchaData = { ...data };
            // console.log("captchaData", captchaData);
            setCaptchaData(captchaData);    
        } catch {
            // console.log("fetch captcha failure", err);
            setErrorMessage("Captcha load failed. Tap to retry.");
        } finally {
            setIsLoading(false);
        }
    }
    return {isLoading, captchaData, errorMessage, fetchCaptcha};
}

export default useCaptcha;