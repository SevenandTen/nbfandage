const BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

const BASE64_MAP = {}
for (let i = 0; i < BASE64_CHARS.length; i++) {
  BASE64_MAP[BASE64_CHARS.charAt(i)] = i
}

// 字符串 -> UTF-8 字节数组，兼容 emoji 等四字节字符
export function stringToUtf8Bytes(str) {
  const bytes = []
  for (let i = 0; i < str.length; i++) {
    let code = str.charCodeAt(i)
    // 代理对（surrogate pair）
    if (code >= 0xd800 && code <= 0xdbff && i + 1 < str.length) {
      const next = str.charCodeAt(i + 1)
      if (next >= 0xdc00 && next <= 0xdfff) {
        code = 0x10000 + ((code - 0xd800) << 10) + (next - 0xdc00)
        i++
      }
    }
    if (code < 0x80) {
      bytes.push(code)
    } else if (code < 0x800) {
      bytes.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f))
    } else if (code < 0x10000) {
      bytes.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f))
    } else {
      bytes.push(
        0xf0 | (code >> 18),
        0x80 | ((code >> 12) & 0x3f),
        0x80 | ((code >> 6) & 0x3f),
        0x80 | (code & 0x3f)
      )
    }
  }
  return bytes
}

// UTF-8 字节数组 -> 字符串
export function utf8BytesToString(bytes) {
  const out = []
  for (let i = 0; i < bytes.length; i++) {
    const b = bytes[i]
    let code
    if (b < 0x80) {
      code = b
    } else if (b >= 0xc0 && b < 0xe0) {
      code = ((b & 0x1f) << 6) | (bytes[++i] & 0x3f)
    } else if (b >= 0xe0 && b < 0xf0) {
      code = ((b & 0x0f) << 12) | ((bytes[++i] & 0x3f) << 6) | (bytes[++i] & 0x3f)
    } else {
      code =
        ((b & 0x07) << 18) |
        ((bytes[++i] & 0x3f) << 12) |
        ((bytes[++i] & 0x3f) << 6) |
        (bytes[++i] & 0x3f)
    }
    if (code > 0xffff) {
      code -= 0x10000
      out.push(String.fromCharCode(0xd800 + (code >> 10), 0xdc00 + (code & 0x3ff)))
    } else {
      out.push(String.fromCharCode(code))
    }
  }
  return out.join('')
}

// 文本 -> Base64（按 UTF-8 编码，支持中文）
export function encodeBase64(text) {
  if (!text) return ''
  const bytes = stringToUtf8Bytes(text)
  let output = ''
  for (let i = 0; i < bytes.length; i += 3) {
    const b1 = bytes[i]
    const b2 = bytes[i + 1]
    const b3 = bytes[i + 2]
    output += BASE64_CHARS.charAt(b1 >> 2)
    output += BASE64_CHARS.charAt(((b1 & 0x03) << 4) | ((b2 || 0) >> 4))
    output += b2 === undefined ? '=' : BASE64_CHARS.charAt(((b2 & 0x0f) << 2) | ((b3 || 0) >> 6))
    output += b3 === undefined ? '=' : BASE64_CHARS.charAt(b3 & 0x3f)
  }
  return output
}

// Base64 -> 文本（按 UTF-8 解码）
export function decodeBase64(base64) {
  if (!base64) return ''
  const clean = String(base64).replace(/[\s\r\n]/g, '').replace(/=+$/, '')
  if (!/^[A-Za-z0-9+/]*$/.test(clean)) {
    throw new Error('不是合法的 Base64 字符串')
  }
  if (clean.length % 4 === 1) {
    throw new Error('Base64 长度不合法')
  }
  const bytes = []
  let buffer = 0
  let bits = 0
  for (let i = 0; i < clean.length; i++) {
    buffer = (buffer << 6) | BASE64_MAP[clean.charAt(i)]
    bits += 6
    if (bits >= 8) {
      bits -= 8
      bytes.push((buffer >> bits) & 0xff)
    }
  }
  return utf8BytesToString(bytes)
}
