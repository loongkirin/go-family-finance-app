"use client"
import { useEffect, useState } from 'react';
import axios from '@/lib/axios';

export interface CaptchaData{
    CaptchaId: string;
    PicPath: string;
    CaptchaLength: number;
}

const useCaptcha = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [captchaData, setCaptchaData] = useState<CaptchaData>({ CaptchaId: "", PicPath: "", CaptchaLength: 0 });
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        fetchCaptcha();        
    }, [])

    const fetchCaptcha = async () => {
        try {
            setIsLoading(true);
            setErrorMessage("");
            const res = await axios.get("/auth/captcha")
            const result = res.data;
            console.log(result);
            if (result.code !== 200) {
                setErrorMessage(result.message);
                return;
            }
            const data = result.result.data;
            console.log("data", data);
            const captchaData: CaptchaData = { CaptchaId: data.captcha_id, PicPath: data.pic_path, CaptchaLength: data.captcha_length };
            console.log(captchaData);
            setCaptchaData(captchaData);    
        } catch (err) {
            console.log(err);
            setErrorMessage("fetch captcha failure, refresh and try again");
        } finally {
            setIsLoading(false);
        }
    }
    return {isLoading, captchaData, errorMessage, fetchCaptcha};
}

export default useCaptcha;