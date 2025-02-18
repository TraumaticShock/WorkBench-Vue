import axios from 'axios';

interface IPLocationResponse {
    status: string;
    info: string;
    infocode: string;
    province: string;
    city: string;
    adcode: string;
    rectangle: string;
}

// 使用高德地图 IP 定位
export const getLocation = async (): Promise<{
    city: string;
    province: string;
    adcode: string;
}> => {
    try {
        const response = await axios.get<IPLocationResponse>(
            'https://restapi.amap.com/v3/ip',
            {
                params: {
                    key: 'ef26c023c447aa07786bf9f32db40fd5'  // 使用 Web 服务 key
                }
            }
        );
        
        if (response.data.status === '1' && response.data.info === 'OK') {
            const locationInfo = {
                city: response.data.city,
                province: response.data.province,
                adcode: response.data.adcode
            };
            return locationInfo;
        } else {
            const error = `IP 定位失败: ${response.data.info}`;
            console.error(error);
            throw new Error(error);
        }
    } catch (err) {
        console.error('获取位置信息失败:', err);
        throw err;
    }
};