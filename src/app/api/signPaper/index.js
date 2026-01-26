import service from '@/app/app.http';

export function getSignFileList(params) { return service.get({ url: '/appDevice/storageInstrumentReserve/getSignList', params	}) }
export function appSignDataSubmit(data) { return service.post({ url: '/appDevice/storageInstrumentReserve/appSignDataSubmit', data }) }


