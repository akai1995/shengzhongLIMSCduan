import CryptoJS from "@/providers/utilities/crypto-js.js";
import constant from '@/app/constant.js'
	// 解密  data：要加密解密的数据，AES_KEY：密钥，IV:偏移量
export function	decrypt(data) {
		const key = CryptoJS.enc.Utf8.parse(constant.AES_KEY);
		const iv = CryptoJS.enc.Utf8.parse(constant.IV);
		const decrypt = CryptoJS.AES.decrypt(data, key, {
			iv,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7
		}).toString(CryptoJS.enc.Utf8);
		return decrypt;
	}
	// 加密
export function	encrypt(data) {
		const key = CryptoJS.enc.Utf8.parse(constant.AES_KEY);
		const iv = CryptoJS.enc.Utf8.parse(constant.IV);
		const encrypted = CryptoJS.AES.encrypt(data, key, {
			iv,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7
		});
		return encrypted.toString();
	}