import CryptoJS from "@/providers/utilities/crypto-js";
import JSEncrypt from '@/providers/utilities/jsencrypt.js'
import AppConfig from '@/app/app.constant'

/* 加密 */
export function encryptedData(data) { /* 新建JSEncrypt对象 */
	let encryptor = new JSEncrypt(); /* 设置公钥 */
	encryptor.setPublicKey(AppConfig.publicKey); /* 加密数据 */
	return encryptor.encrypt(data);
}

/* 解密 */
export function decryptData(data) { /* 新建JSEncrypt对象 */
	console.log("data----》",data)
	let decrypt = new JSEncrypt(); /* 设置私钥  */
	decrypt.setPrivateKey(AppConfig.privateKey); /* 解密数据 */
	return decrypt.decryptLong(data);
}

/* 解密 data：要加密解密的数据，AES_KEY：密钥，IV:偏移量 */
export function	decrypt(data) {
    const key = CryptoJS.enc.Utf8.parse(AppConfig.AES_KEY); const iv = CryptoJS.enc.Utf8.parse(AppConfig.IV);
    const decrypt = CryptoJS.AES.decrypt(data, key, { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }).toString(CryptoJS.enc.Utf8);
    return decrypt;
}
/* 加密 */
export function	encrypt(data) {
    const key = CryptoJS.enc.Utf8.parse(AppConfig.AES_KEY); const iv = CryptoJS.enc.Utf8.parse(AppConfig.IV);
    const encrypted = CryptoJS.AES.encrypt(data, key, { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    return encrypted.toString();
}