module.exports.getBuffer = (target, isHex = true) => {
  if (Buffer.isBuffer(target) == false) {
    if (isHex === true) {
      target = Buffer.from(target, 'hex')
    } else {
      target = Buffer.from(target)
    }
  }

  return target
}