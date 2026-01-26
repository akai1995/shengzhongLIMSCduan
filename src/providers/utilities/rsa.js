import JSEncrypt from '@/providers/utilities/jsencrypt.js'
import AppConfig from '@/app/app.constant'

//加密	
export function encryptedData(data) { // 新建JSEncrypt对象  
	let encryptor = new JSEncrypt(); // 设置公钥  
	encryptor.setPublicKey(AppConfig.publicKey); // 加密数据  
	return encryptor.encrypt(data);
}

// 解密  
export function decryptData(data) { // 新建JSEncrypt对象  
	console.log("data----》",data)
	let decrypt = new JSEncrypt(); // 设置私钥 
	decrypt.setPrivateKey(AppConfig.privateKey); // 解密数据  
	return decrypt.decryptLong(data);
}