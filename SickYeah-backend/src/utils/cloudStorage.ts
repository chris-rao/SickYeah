import COS from 'cos-nodejs-sdk-v5';
import { randomUUID } from 'crypto';
import path from 'path';

const BUCKET = process.env.COS_BUCKET!;
const REGION = process.env.COS_REGION!;
const ENV_ID = process.env.WX_ENV_ID!;

// 内部 API 基础地址（仅在微信云托管容器内可访问）
const WEIXIN_API_BASE = 'http://api.weixin.qq.com';

// COS 单例，getAuthorization 由 SDK 在密钥过期前自动回调刷新
let cosInstance: COS | null = null;

function getCOS(): COS {
  if (!cosInstance) {
    cosInstance = new COS({
      getAuthorization: async (_options, callback) => {
        const res = await fetch(`${WEIXIN_API_BASE}/_/cos/getauth`);
        const data = await res.json() as {
          TmpSecretId: string;
          TmpSecretKey: string;
          Token: string;
          ExpiredTime: number;
          StartTime: number;
        };
        callback({
          TmpSecretId: data.TmpSecretId,
          TmpSecretKey: data.TmpSecretKey,
          SecurityToken: data.Token,
          ExpiredTime: data.ExpiredTime,
          StartTime: data.StartTime,
        });
      },
    });
  }
  return cosInstance;
}

/**
 * 将内存中的 Buffer 上传到微信云托管对象存储。
 * 上传时写入文件元数据（x-cos-meta-fileid），确保小程序端可正常访问。
 * @returns cloud://ENV_ID/path 格式的 cloudID，永久有效，存入数据库
 */
export async function uploadBuffer(buffer: Buffer, originalName: string): Promise<string> {
  const ext = path.extname(originalName);
  const cloudPath = `reviews/${randomUUID()}${ext}`;

  // 获取文件元数据（管理端上传 openid 传空字符串）
  const metaRes = await fetch(`${WEIXIN_API_BASE}/_/cos/metaid/encode`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      openid: '',
      bucket: BUCKET,
      paths: [`/${cloudPath}`],
    }),
  });
  const metaData = await metaRes.json() as {
    respdata: { x_cos_meta_field_strs: string[] };
  };
  const metaField = metaData.respdata.x_cos_meta_field_strs[0];

  await getCOS().putObject({
    Bucket: BUCKET,
    Region: REGION,
    Key: cloudPath,
    StorageClass: 'STANDARD',
    Body: buffer,
    ContentLength: buffer.length,
    Headers: { 'x-cos-meta-fileid': metaField } as Record<string, string>,
  });

  return `cloud://${ENV_ID}/${cloudPath}`;
}

/**
 * 将 cloudID 转换为带签名的 HTTP URL（H5 端渲染使用）。
 * 每次查询时实时生成，确保 URL 始终有效。
 * @param expires 有效期秒数，默认 7 天
 */
export function getSignedUrl(cloudID: string, expires = 604800): Promise<string> {
  // cloud://env-id/reviews/xxx.jpg → reviews/xxx.jpg
  const key = cloudID.replace(/^cloud:\/\/[^/]+\//, '');
  return new Promise((resolve, reject) => {
    getCOS().getObjectUrl(
      { Bucket: BUCKET, Region: REGION, Key: key, Sign: true, Expires: expires },
      (err, data) => {
        if (err) return reject(new Error(err.message || JSON.stringify(err)));
        resolve(data.Url);
      }
    );
  });
}
