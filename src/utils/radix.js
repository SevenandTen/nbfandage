// 0-9 A-Z a-z，最大支持 62 进制
const CHARSET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

const VALUE_MAP = {}
for (let i = 0; i < CHARSET.length; i++) {
  VALUE_MAP[CHARSET.charAt(i)] = i
}

const LIMB = 100000000 // 大数以 1e8 为一段存储，保证乘法不丢精度

// limbs = limbs * mul + add
function mulAdd(limbs, mul, add) {
  let carry = add
  for (let i = 0; i < limbs.length; i++) {
    const v = limbs[i] * mul + carry
    limbs[i] = v % LIMB
    carry = Math.floor(v / LIMB)
  }
  while (carry > 0) {
    limbs.push(carry % LIMB)
    carry = Math.floor(carry / LIMB)
  }
}

// limbs = limbs / div，返回余数
function divMod(limbs, div) {
  let carry = 0
  for (let i = limbs.length - 1; i >= 0; i--) {
    const cur = limbs[i] + carry * LIMB
    limbs[i] = Math.floor(cur / div)
    carry = cur % div
  }
  while (limbs.length > 1 && limbs[limbs.length - 1] === 0) {
    limbs.pop()
  }
  return carry
}

function isZero(limbs) {
  return limbs.length === 1 && limbs[0] === 0
}

export function convertBase(input, fromBase, toBase) {
  const raw = String(input || '')
    .trim()
    .replace(/[\s_]/g, '')
  if (!raw) return ''

  let negative = false
  let body = raw
  if (body.charAt(0) === '-' || body.charAt(0) === '+') {
    negative = body.charAt(0) === '-'
    body = body.slice(1)
  }
  if (!body) throw new Error('请输入有效数字')

  // 按源进制累加成大整数
  const limbs = [0]
  for (let i = 0; i < body.length; i++) {
    const ch = body.charAt(i)
    const value = VALUE_MAP[ch]
    if (value === undefined) throw new Error(`字符 "${ch}" 不属于该进制`)
    if (value >= fromBase) throw new Error(`字符 "${ch}" 超出 ${fromBase} 进制范围`)
    mulAdd(limbs, fromBase, value)
  }

  let result
  if (toBase === 10) {
    let str = String(limbs[limbs.length - 1])
    for (let i = limbs.length - 2; i >= 0; i--) {
      str += String(limbs[i]).padStart(8, '0')
    }
    result = str
  } else {
    const digits = []
    while (!isZero(limbs)) {
      digits.push(CHARSET.charAt(divMod(limbs, toBase)))
    }
    result = digits.length ? digits.reverse().join('') : '0'
  }

  return (negative && !/^0+$/.test(result) ? '-' : '') + result
}
