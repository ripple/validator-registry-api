
export function SHA256() {
  return require('crypto')
          .createHash('sha256')
          .update(String(Math.random()))
          .digest('hex')
          .toUpperCase()
}
