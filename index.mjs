import * as asn1js from "asn1js"

/**
 * @import Integer from "asn1js"
 * @import Sequence from "asn1js"
 */

/**
 * Converts the input JSON string to an array of integers.
 * @param {string} jstring The string to be parsed.
 * @returns {number[]} The array of integers.
 */
function json2ints(jstring) {
  try {
    /** @type number[] */
    const parsed = JSON.parse(jstring)
    return parsed
  } catch {
    return []
  }
}

/**
 * @typedef {number} FileDesc
 */

/** @type FileDesc */
const stdin = 0

/** @type FileDesc */
const stdout = 1

/**
 * Reads bytes to the buffer from stdin.
 * @param {Uint8Array} buffer The buffer to store the read bytes.
 * @returns {number} Number of bytes read.
 */
function stdin2buffer(buffer) {
  // @ts-ignore:
  return Javy.IO.readSync(stdin, buffer)
}

/**
 * Reads data from stdin and returns them as an array of chunks.
 * @returns {Uint8Array[]} The read data.
 */
function stdin2chunks() {
  /** @type Uint8Array[] */
  const ret = []

  /** @type Uint8Array */
  const buf = new Uint8Array(1024)

  while (true) {
    /** @type number */
    const bytesRead = stdin2buffer(buf)
    if (0 == bytesRead) return ret

    ret.push(buf.subarray(0, bytesRead))
  }
}

/**
 * Converts the array of chunks to a Uint8Array.
 * @param {Uint8Array[]} chunks The chunks to be converted.
 * @returns {Uint8Array} The concatenated data.
 */
function chunks2bytes(chunks) {
  /** @type number */
  const totalByteSize = chunks.reduce(
    (state, next) => state + next.length,
    0,
  )

  return chunks.filter((next) => 0 < next.length).reduce(
    (state, next) => {
      /** @type Uint8Array */
      const buf = state.finalBuffer

      /** @type number */
      const offset = state.offset

      buf.set(next, offset)

      return {
        finalBuffer: buf,
        offset: offset + next.length,
      }
    },
    {
      finalBuffer: new Uint8Array(totalByteSize),
      offset: 0,
    },
  ).finalBuffer
}

/**
 * Converts the utf8 bytes to a string.
 * @param {Uint8Array} utf8bytes The bytes to be converted.
 * @returns {string} The converted string.
 */
function bytes2string(utf8bytes) {
  return new TextDecoder().decode(utf8bytes)
}

/**
 * Gets a string from stdin.
 * @returns {string}
 */
function stdin2string() {
  /** @type Uint8Array[] */
  const chunks = stdin2chunks()

  /** @type Uint8Array */
  const data = chunks2bytes(chunks)

  return bytes2string(data)
}

/**
 * Gets an array of integers from stdin.
 * @returns {number[]}
 */
function stdin2ints() {
  /** @type string */
  const jstring = stdin2string()
  return json2ints(jstring)
}

/**
 * Converts the raw integers to asn1 integers.
 * @param {number[]} ints The integers to be converted.
 * @returns {Integer[]}
 */
function ints2asn1(ints) {
  // @ts-ignore:
  return ints.map((i) => new asn1js.Integer({ value: i }))
}

/**
 * Converts the raw integers to der bytes.
 * @param {number[]} ints The integers to be converted.
 * @returns {ArrayBuffer}
 */
function ints2der(ints) {
  /** @type Integer[] */
  const asn1 = ints2asn1(ints)

  /** @type Sequence */
  // @ts-ignore
  const seq = new asn1js.Sequence({ value: asn1 })

  // @ts-ignore
  return seq.toBER()
}

/**
 * Gets an array of integers from stdin and returns der representation.
 * @returns {ArrayBuffer}
 */
function stdin2der() {
  /** @type number[] */
  const ints = stdin2ints()

  return ints2der(ints)
}

/**
 * Writes the bytes to stdout.
 * @param {Uint8Array} bytes The bytes to be written.
 */
function bytes2stdout(bytes) {
  // @ts-ignore:
  Javy.IO.writeSync(stdout, bytes)
}

/**
 * Converts the buffer to an array.
 * @param {ArrayBuffer} buf The buffer to be converted.
 * @returns {Uint8Array}
 */
function buf2bytes(buf) {
  return new Uint8Array(buf)
}

/**
 * Writes the buffer to stdout.
 * @param {ArrayBuffer} buf The buffer to be written.
 */
function buf2stdout(buf) {
  /** @type Uint8Array */
  const bytes = buf2bytes(buf)
  bytes2stdout(bytes)
}

function stdin2json2ints2der2bytes2stdout() {
  /** @type ArrayBuffer */
  const der = stdin2der()

  buf2stdout(der)
}

function main() {
  stdin2json2ints2der2bytes2stdout()
}

main()
