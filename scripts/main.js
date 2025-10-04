// complete-ocr-enhanced.js
import fs from 'node:fs/promises';
import invariant from 'tiny-invariant';
import {pathToFileURL } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';
import cv from '@techstark/opencv-js';
import clipper from 'js-clipper';
import * as ort from 'onnxruntime-web';

const isVercel = process.env.VERCEL === '1';
const isProduction = process.env.NODE_ENV === 'production';
const isWindows = process.platform === 'win32';

if (isVercel && isProduction) {
  // Vercel production: WASM copied to public/wasm during build
  ort.env.wasm.wasmPaths = '/wasm/';
} else {
  // Everything else: use node_modules
  const wasmDir = path.join(process.cwd(), 'node_modules/onnxruntime-web/dist/');
  ort.env.wasm.wasmPaths = isWindows ? pathToFileURL(wasmDir).href : wasmDir;
}

ort.env.wasm.numThreads = 1;
ort.env.wasm.simd = true;

import { InferenceSession, Tensor } from 'onnxruntime-web';

// Model paths - DON'T convert to file:// URLs, InferenceSession.create handles regular paths
const OCR_CONFIG = {
  DETECTION: {
    MODEL_PATH: path.join(process.cwd(), 'scripts/models/ch_PP-OCRv4_det_infer.onnx'),
    THRESHOLD: 0.1,
    MIN_BOX_SIZE: 3,
    MAX_BOX_SIZE: 2000,
    UNCLIP_RATIO: 1.5,
    BASE_SIZE: 32,
    MAX_IMAGE_SIZE: 960,
    ONNX_OPTIONS: {
      executionProviders: ['wasm'],
      graphOptimizationLevel: 'all',
      logSeverityLevel: 3,
    }
  },
  RECOGNITION: {
    LANGUAGES: {
      en: {
        MODEL: path.join(process.cwd(), 'scripts/models/en_PP-OCRv4_rec_infer.onnx'),
        DICT: path.join(process.cwd(), 'scripts/models/en_dict.txt'),
        NAME: 'English'
      },
      ch: {
        MODEL: path.join(process.cwd(), 'scripts/models/ch_PP-OCRv4_rec_infer.onnx'),
        DICT: path.join(process.cwd(), 'scripts/models/ch_dict.txt'),
        NAME: 'Chinese'
      },
      ja: {
        MODEL: path.join(process.cwd(), 'scripts/models/japan_PP-OCRv3_rec_infer.onnx'),
        DICT: path.join(process.cwd(), 'scripts/models/japan_dict.txt'),
        NAME: 'Japanese'
      },
      ko: {
        MODEL: path.join(process.cwd(), 'scripts/models/ch_PP-OCRv4_rec_infer.onnx'),
        DICT: path.join(process.cwd(), 'scripts/models/korean_dict.txt'),
        NAME: 'Korean'
      },
      ptbr: {
        MODEL: path.join(process.cwd(), 'scripts/models/latin_PP-OCRv3_rec_infer.onnx'),
        DICT: path.join(process.cwd(), 'scripts/models/latin_dict.txt'),
        NAME: 'Latin'
      }
    },
    DEFAULT_LANGUAGE: 'en',
    IMAGE_HEIGHT: 48,
    CONFIDENCE_THRESHOLD: 0.5,
    REMOVE_DUPLICATE_CHARS: true,
    IGNORED_TOKENS: [0],
    ONNX_OPTIONS: {
      executionProviders: ['wasm'],
      graphOptimizationLevel: 'all',
      logSeverityLevel: 3,
    }
  },
  GROUPING: {
    VERTICAL_THRESHOLD_RATIO: 1.2,
    HORIZONTAL_THRESHOLD_RATIO: 2.2,
    MIN_OVERLAP_RATIO: 0.3,
    MAX_VERTICAL_OFFSET_RATIO: 0.5
  },
};
// =============================================================================
// HELPERS
// =============================================================================

function median(values) {
  if (!values || values.length === 0) return 0;
  const s = [...values].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 === 0 ? (s[m - 1] + s[m]) / 2 : s[m];
}

class FileUtils {
  static async read(filePath) {
    return await fs.readFile(filePath, 'utf8');
  }
}

class ImageRaw {
  data;
  width;
  height;
  #sharp;
   static async open(filePath) {
    const sharpInstance = sharp(filePath).ensureAlpha();
    const result = await sharpInstance.raw().toBuffer({ resolveWithObject: true });
    return new ImageRaw({ data: result.data, width: result.info.width, height: result.info.height });
  }
  constructor(imageRawData) {
    this.data = imageRawData.data;
    this.width = imageRawData.width;
    this.height = imageRawData.height;
    this.#sharp = sharp(imageRawData.data, {
      raw: { width: imageRawData.width, height: imageRawData.height, channels: 4 }
    });
  }
  async resize(size) {
    const resized = await this.#sharp.resize({
      width: size.width,
      height: size.height,
      fit: 'contain'
    }).raw().toBuffer({ resolveWithObject: true });
    this.data = resized.data;
    this.width = resized.info.width;
    this.height = resized.info.height;
    this.#sharp = sharp(this.data, { raw: { width: this.width, height: this.height, channels: 4 } });
    return this;
  }
}

class ModelBase {
  options;
  #model;
  constructor({ model, options }) {
    this.#model = model;
    this.options = options;
  }
  async runModel({ modelData, onnxOptions = {} }) {
    const input = new Tensor('float32', Float32Array.from(modelData.data), [1, 3, modelData.height, modelData.width]);
    const outputs = await this.#model.run({ [this.#model.inputNames[0]]: input }, onnxOptions);
    return outputs[this.#model.outputNames[0]];
  }
  imageToInput(image, { mean = [0, 0, 0], std = [1, 1, 1] } = {}) {
    const R = [], G = [], B = [];
    for (let i = 0; i < image.data.length; i += 4) {
      R.push((image.data[i] / 255 - mean[0]) / std[0]);
      G.push((image.data[i + 1] / 255 - mean[1]) / std[1]);
      B.push((image.data[i + 2] / 255 - mean[2]) / std[2]);
    }
    return { data: [...B, ...G, ...R], width: image.width, height: image.height };
  }
}

// =============================================================================
// OPENCV HELPERS
// =============================================================================

function cvImread(image) {
  const mat = new cv.Mat(image.height, image.width, cv.CV_8UC4);
  mat.data.set(image.data);
  return mat;
}

function cvImshow(mat) {
  return new ImageRaw({ data: Buffer.from(mat.data), width: mat.cols, height: mat.rows });
}

function getMiniBoxes(contour) {
  const boundingBox = cv.minAreaRect(contour);
  const points = Array.from(boxPoints(boundingBox)).sort((a, b) => a[0] - b[0]);
  let index_1 = 0, index_4 = 1;
  if (points[1][1] > points[0][1]) { index_1 = 0; index_4 = 1; } else { index_1 = 1; index_4 = 0; }
  let index_2 = 2, index_3 = 3;
  if (points[3][1] > points[2][1]) { index_2 = 2; index_3 = 3; } else { index_2 = 3; index_3 = 2; }
  const box = [points[index_1], points[index_2], points[index_3], points[index_4]];
  return { points: box, sside: Math.min(boundingBox.size.height, boundingBox.size.width) };
}

function boxPoints(rotatedRect) {
  const points = [];
  const angle = rotatedRect.angle * Math.PI / 180.0;
  const b = Math.cos(angle) * 0.5;
  const a = Math.sin(angle) * 0.5;
  const center = rotatedRect.center;
  const size = rotatedRect.size;
  points[0] = [center.x - a * size.height - b * size.width, center.y + b * size.height - a * size.width];
  points[1] = [center.x + a * size.height - b * size.width, center.y - b * size.height - a * size.width];
  points[2] = [center.x + a * size.height + b * size.width, center.y - b * size.height + a * size.width];
  points[3] = [center.x - a * size.height + b * size.width, center.y + b * size.height + a * size.width];
  return points;
}

function polygonPolygonArea(polygon) {
  let area = 0;
  for (let i = 0; i < polygon.length; i++) {
    const j = (i + 1) % polygon.length;
    area += polygon[i][0] * polygon[j][1] - polygon[j][0] * polygon[i][1];
  }
  return Math.abs(area) / 2.0;
}

function polygonPolygonLength(polygon) {
  let length = 0;
  for (let i = 0; i < polygon.length; i++) {
    const j = (i + 1) % polygon.length;
    length += Math.sqrt(Math.pow(polygon[j][0] - polygon[i][0], 2) + Math.pow(polygon[j][1] - polygon[i][1], 2));
  }
  return length;
}

function orderPointsClockwise(pts) {
  const s = pts.map(pt => pt[0] + pt[1]);
  const rect = [pts[s.indexOf(Math.min(...s))], null, pts[s.indexOf(Math.max(...s))], null];
  const tmp = pts.filter(pt => pt !== rect[0] && pt !== rect[2]);
  const diff = [tmp[0][1] - tmp[1][1], tmp[0][0] - tmp[1][0]];
  rect[1] = diff[1] > 0 ? tmp[0] : tmp[1];
  rect[3] = diff[1] > 0 ? tmp[1] : tmp[0];
  return rect;
}

function linalgNorm(p0, p1) {
  return Math.sqrt(Math.pow(p0[0] - p1[0], 2) + Math.pow(p0[1] - p1[1], 2));
}

function getRotateCropImage(imageRaw, points) {
  const img_crop_width = Math.floor(Math.max(linalgNorm(points[0], points[1]), linalgNorm(points[2], points[3])));
  const img_crop_height = Math.floor(Math.max(linalgNorm(points[0], points[3]), linalgNorm(points[1], points[2])));
  const pts_std = [[0, 0], [img_crop_width, 0], [img_crop_width, img_crop_height], [0, img_crop_height]];
  const srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, points.flat());
  const dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, pts_std.flat());
  const M = cv.getPerspectiveTransform(srcTri, dstTri);
  const src = cvImread(imageRaw);
  const dst = new cv.Mat();
  cv.warpPerspective(src, dst, M, new cv.Size(img_crop_width, img_crop_height), cv.INTER_CUBIC, cv.BORDER_REPLICATE, new cv.Scalar());
  let dst_rot = dst;
  if (dst.rows / dst.cols >= 1.5) {
    dst_rot = new cv.Mat();
    const M_rot = cv.getRotationMatrix2D(new cv.Point(dst.cols / 2, dst.cols / 2), 90, 1);
    cv.warpAffine(dst, dst_rot, M_rot, new cv.Size(dst.rows, dst.cols), cv.INTER_CUBIC, cv.BORDER_REPLICATE, new cv.Scalar());
    dst.delete();
  }
  src.delete();
  srcTri.delete();
  dstTri.delete();
  return cvImshow(dst_rot);
}

function unclip(box, unclip_ratio = 1.5) {
  const area = Math.abs(polygonPolygonArea(box));
  const length = polygonPolygonLength(box);
  const distance = (area * unclip_ratio) / length;
  const tmpArr = box.map(item => ({ X: item[0], Y: item[1] }));
  const offset = new clipper.ClipperOffset();
  offset.AddPath(tmpArr, clipper.JoinType.jtRound, clipper.EndType.etClosedPolygon);
  const expanded = [];
  offset.Execute(expanded, distance);
  return expanded[0] ? expanded[0].map(item => [item.X, item.Y]).flat() : [];
}

// =============================================================================
// DETECTION MODEL
// =============================================================================

class Detection extends ModelBase {
  static async create({ models, onnxOptions = {}, threshold = 0.1, minSize = 3, maxSize = 2000, unclipRatio = 1.5, baseSize = 32, maxImageSize = 960 } = {}) {
    const detectionPath = models?.detectionPath || OCR_CONFIG.DETECTION.MODEL_PATH;
    const finalOnnxOptions = { ...OCR_CONFIG.DETECTION.ONNX_OPTIONS, ...onnxOptions };
    const model = await InferenceSession.create(detectionPath, finalOnnxOptions);
    return new Detection({ model, options: {}, threshold, minSize, maxSize, unclipRatio, baseSize, maxImageSize });
  }
  constructor({ model, options, threshold, minSize, maxSize, unclipRatio, baseSize, maxImageSize }) {
    super({ model, options });
    Object.assign(this, { threshold, minSize, maxSize, unclipRatio, baseSize, maxImageSize });
  }
  async run(imagePath, { onnxOptions = {} } = {}) {
    const image = await ImageRaw.open(imagePath);
    const inputImage = await image.resize(this.multipleOfBaseSize(image));
    const modelData = this.imageToInput(inputImage);
    const modelOutput = await this.runModel({ modelData, onnxOptions });
    const outputImage = this.outputToImage(modelOutput, this.threshold);
    return await this.splitIntoLineImages(outputImage, inputImage);
  }
  multipleOfBaseSize(image) {
    let width = image.width, height = image.height;
    if (this.maxImageSize && Math.max(width, height) > this.maxImageSize) {
      const ratio = width > height ? this.maxImageSize / width : this.maxImageSize / height;
      width *= ratio; height *= ratio;
    }
    return {
      width: Math.max(Math.ceil(width / this.baseSize) * this.baseSize, this.baseSize),
      height: Math.max(Math.ceil(height / this.baseSize) * this.baseSize, this.baseSize)
    };
  }
  outputToImage(output, threshold) {
    const [height, width] = [output.dims[2], output.dims[3]];
    const data = new Uint8Array(width * height * 4);
    output.data.forEach((outValue, outIndex) => {
      const n = outIndex * 4;
      const value = outValue > threshold ? 255 : 0;
      data[n] = data[n + 1] = data[n + 2] = value;
      data[n + 3] = 255;
    });
    return new ImageRaw({ data, width, height });
  }
  async splitIntoLineImages(image, sourceImage) {
    const src = cvImread(image);
    cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
    const contours = new cv.MatVector();
    const hierarchy = new cv.Mat();
    cv.findContours(src, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);
    const edgeRect = [];
    const [w, h] = [image.width, image.height];
    const [rx, ry] = [sourceImage.width / w, sourceImage.height / h];
    for (let i = 0; i < contours.size(); i++) {
      const { points, sside } = getMiniBoxes(contours.get(i));
      if (sside < this.minSize || sside > this.maxSize) continue;
      const clipBox = unclip(points, this.unclipRatio);
      const boxMap = cv.matFromArray(clipBox.length / 2, 1, cv.CV_32SC2, clipBox);
      const resultObj = getMiniBoxes(boxMap);
      if (resultObj.sside < this.minSize + 2) continue;
      const box = resultObj.points.map(p => [p[0] * rx, p[1] * ry]);
      const box1 = orderPointsClockwise(box).map(item => [
        Math.max(0, Math.min(Math.round(item[0]), sourceImage.width)),
        Math.max(0, Math.min(Math.round(item[1]), sourceImage.height))
      ]);
      const rect_width = Math.floor(linalgNorm(box1[0], box1[1]));
      const rect_height = Math.floor(linalgNorm(box1[0], box1[3]));
      if (rect_width > 3 && rect_height > 3) {
        edgeRect.push({ box: box1, image: getRotateCropImage(sourceImage, box1) });
      }
    }
    src.delete();
    contours.delete();
    hierarchy.delete();
    return edgeRect;
  }
}

// =============================================================================
// RECOGNITION MODEL
// =============================================================================

class Recognition extends ModelBase {
  #dictionary;
  static async create({ models, onnxOptions = {}, language = 'en', confidenceThreshold = 0.5, imageHeight = 48, removeDuplicateChars = true } = {}) {
    const langConfig = OCR_CONFIG.RECOGNITION.LANGUAGES[language];
    invariant(langConfig, `Unsupported language: ${language}`);
    const recognitionPath = models?.recognitionPath || langConfig.MODEL;
    const dictionaryPath = models?.dictionaryPath || langConfig.DICT;
    const finalOnnxOptions = { ...OCR_CONFIG.RECOGNITION.ONNX_OPTIONS, ...onnxOptions };
    const model = await InferenceSession.create(recognitionPath, finalOnnxOptions);
    const dictionary = [...(await FileUtils.read(dictionaryPath)).split('\n'), ' '];
    return new Recognition({ model, options: {}, confidenceThreshold, imageHeight, removeDuplicateChars }, dictionary);
  }
  constructor(options, dictionary) {
    super(options);
    this.#dictionary = dictionary;
    Object.assign(this, {
      confidenceThreshold: options.confidenceThreshold,
      imageHeight: options.imageHeight,
      removeDuplicateChars: options.removeDuplicateChars
    });
  }
  async run(lineImages, { onnxOptions = {} } = {}) {
    const modelDatas = await Promise.all(lineImages.map(li => li.image.resize({ height: this.imageHeight }).then(r => this.imageToInput(r))));
    const allLines = [];
    for (const modelData of modelDatas) {
      const output = await this.runModel({ modelData, onnxOptions });
      allLines.unshift(...this.decodeText(output));
    }
    return allLines.map((line, i) => ({ ...line, box: lineImages[allLines.length - i - 1].box })).filter(x => x.mean >= this.confidenceThreshold);
  }
  decodeText(output) {
    const line = [];
    const predLen = output.dims[2];
    for (let l = output.data.length - predLen * output.dims[1], ml = 0; l >= 0; l -= predLen * output.dims[1], ml++) {
      const predsIdx = [], predsProb = [];
      for (let i = l; i < l + predLen * output.dims[1]; i += predLen) {
        const tmpArr = output.data.slice(i, i + predLen);
        const tmpMax = Math.max(...tmpArr);
        predsProb.push(tmpMax);
        predsIdx.push(tmpArr.indexOf(tmpMax));
      }
      line[ml] = this.decode(predsIdx, predsProb);
    }
    return line;
  }
  decode(textIndex, textProb) {
    const charList = [], confList = [];
    for (let idx = 0; idx < textIndex.length; idx++) {
      if (OCR_CONFIG.RECOGNITION.IGNORED_TOKENS.includes(textIndex[idx])) continue;
      if (this.removeDuplicateChars && idx > 0 && textIndex[idx - 1] === textIndex[idx]) continue;
      const char = this.#dictionary[textIndex[idx] - 1];
      if (char) {
        charList.push(char);
        confList.push(textProb[idx]);
      }
    }
    const text = charList.join('').replace(/\r/g, '').replace(/\s+/g, ' ').trim();
    const mean = confList.length ? confList.reduce((a, b) => a + b) / confList.length : 0;
    return { text, mean };
  }
}

// =============================================================================
// OCR CLASS
// =============================================================================

class Ocr {
  #detection;
  #recognition;
  static async create({ threshold = 0.1, minSize = 3, maxSize = 2000, unclipRatio = 1.5, confidenceThreshold = 0.5, language = 'en', ...options } = {}) {
    const detection = await Detection.create({ ...options, threshold, minSize, maxSize, unclipRatio });
    const recognition = await Recognition.create({ ...options, language, confidenceThreshold });
    return new Ocr({ detection, recognition, confidenceThreshold });
  }
  constructor({ detection, recognition, confidenceThreshold }) {
    this.#detection = detection;
    this.#recognition = recognition;
    this.confidenceThreshold = confidenceThreshold;
  }
  async detect(imagePath, options = {}) {
    const lineImages = await this.#detection.run(imagePath, options);
    const texts = await this.#recognition.run(lineImages, options);
    return { texts, detectedElements: texts.length };
  }

  extractFrameFromBox(box) {
    if (!box?.length) return { left: 0, top: 0, width: 0, height: 0 };
    const xs = box.map(p => p[0]);
    const ys = box.map(p => p[1]);
    return {
      left: Math.round(Math.min(...xs)),
      top: Math.round(Math.min(...ys)),
      width: Math.round(Math.max(...xs) - Math.min(...xs)),
      height: Math.round(Math.max(...ys) - Math.min(...ys))
    };
  }

  _UnionFind(n) {
    const parent = new Array(n).fill(0).map((_, i) => i);
    const rank = new Array(n).fill(0);
    return {
      find(x) { if (parent[x] !== x) parent[x] = this.find(parent[x]); return parent[x]; },
      union(a, b) {
        let ra = this.find(a), rb = this.find(b);
        if (ra === rb) return;
        if (rank[ra] < rank[rb]) parent[ra] = rb;
        else if (rank[rb] < rank[ra]) parent[rb] = ra;
        else { parent[rb] = ra; rank[ra]++; }
      },
      parent, rank
    };
  }

  _onSameLineStrict(frameA, frameB, medianH) {
    const topA = frameA.top, bottomA = frameA.top + frameA.height;
    const topB = frameB.top, bottomB = frameB.top + frameB.height;
    const overlapTop = Math.max(topA, topB), overlapBottom = Math.min(bottomA, bottomB);
    const overlap = Math.max(0, overlapBottom - overlapTop);
    const minH = Math.min(frameA.height, frameB.height) || 1;
    const overlapRatio = overlap / minH;
    const centerA = frameA.top + frameA.height / 2;
    const centerB = frameB.top + frameB.height / 2;
    const vOffset = Math.abs(centerA - centerB);
    return overlapRatio >= Math.max(0.35, OCR_CONFIG.GROUPING.MIN_OVERLAP_RATIO) ||
      vOffset < Math.max(8, medianH * OCR_CONFIG.GROUPING.MAX_VERTICAL_OFFSET_RATIO);
  }

  _shouldGroupImpl(box1, box2, avgHeight, config) {
    const medianH = avgHeight || Math.max(box1.height, box2.height);
    const center1 = { x: box1.left + box1.width / 2, y: box1.top + box1.height / 2 };
    const center2 = { x: box2.left + box2.width / 2, y: box2.top + box2.height / 2 };
    const horizontalDist = Math.max(0, Math.abs(center2.x - center1.x) - (box1.width + box2.width) / 2);
    const verticalDist = Math.abs(center2.y - center1.y);
    const avgCharWidth = Math.max(3, medianH * 0.25);
    const sameLine = this._onSameLineStrict(box1, box2, medianH);

    if (sameLine) {
      const maxHorizontalGap = Math.max(avgCharWidth, medianH * (config.HORIZONTAL_THRESHOLD_RATIO * 0.35));
      const isRightOf = box2.left > box1.left - (medianH * 0.15);
      return isRightOf && horizontalDist <= maxHorizontalGap;
    } else {
      const maxVerticalGap = medianH * config.VERTICAL_THRESHOLD_RATIO;
      const overlapHoriz = Math.min(box1.left + box1.width, box2.left + box2.width) - Math.max(box1.left, box2.left);
      const horizOverlapRatio = Math.max(0, overlapHoriz) / Math.max(1, Math.min(box1.width, box2.width));
      const centersAligned = Math.abs(center1.x - center2.x) < medianH * 0.8;
      const hasHorizontalOverlap = horizOverlapRatio > 0.15 || centersAligned;
      return (box2.top > box1.top) && (verticalDist <= maxVerticalGap) && hasHorizontalOverlap;
    }
  }

  groupTextElements(elements) {
    if (!elements || elements.length === 0) return [];
    const medianH = Math.max(1, median(elements.map(e => e.frame.height || 0)));
    const sorted = [...elements].map((el, idx) => ({ el, idx })).sort((a, b) => {
      const topDiff = a.el.frame.top - b.el.frame.top;
      if (Math.abs(topDiff) < medianH * 0.6) return a.el.frame.left - b.el.frame.left;
      return topDiff;
    });

    const n = sorted.length;
    const uf = this._UnionFind(n);
    const WINDOW = Math.min(n, 60);

    for (let i = 0; i < n; i++) {
      const aFrame = sorted[i].el.frame;
      for (let j = i + 1; j < Math.min(n, i + WINDOW); j++) {
        const bFrame = sorted[j].el.frame;
        if (Math.abs(bFrame.top - aFrame.top) > medianH * Math.max(6, OCR_CONFIG.GROUPING.VERTICAL_THRESHOLD_RATIO * 3)) break;
        if (this._shouldGroupImpl(aFrame, bFrame, medianH, OCR_CONFIG.GROUPING)) uf.union(i, j);
      }
    }

    const clusters = new Map();
    for (let i = 0; i < n; i++) {
      const root = uf.find(i);
      if (!clusters.has(root)) clusters.set(root, []);
      clusters.get(root).push(sorted[i]);
    }

    const groups = [];
    for (const cluster of clusters.values()) {
      cluster.sort((a, b) => {
        const v = a.el.frame.top - b.el.frame.top;
        if (Math.abs(v) < medianH * 0.6) return a.el.frame.left - b.el.frame.left;
        return v;
      });
      groups.push(cluster.map(item => item.el));
    }

    groups.sort((g1, g2) => {
      const top1 = Math.min(...g1.map(e => e.frame.top)), top2 = Math.min(...g2.map(e => e.frame.top));
      if (Math.abs(top1 - top2) < medianH * 0.6) {
        const left1 = Math.min(...g1.map(e => e.frame.left)), left2 = Math.min(...g2.map(e => e.frame.left));
        return left1 - left2;
      }
      return top1 - top2;
    });

    // ... continuation of groupTextElements method

    for (let pid = 0; pid < groups.length; pid++) {
      for (const el of groups[pid]) {
        el.paragraph = pid;
      }
    }

    return groups;
  }

  createParagraph(group) {
    if (!group || group.length === 0) return null;
    const medianH = Math.max(1, median(group.map(el => el.frame.height || 0)));
    group.sort((a, b) => {
      const v = a.frame.top - b.frame.top;
      if (Math.abs(v) < medianH * 0.6) return a.frame.left - b.frame.left;
      return v;
    });
    const texts = group.map(el => (el.text || '').trim()).filter(Boolean);
    const text = texts.join(' ').replace(/\s+/g, ' ').trim();
    const avgConfidence = group.reduce((s, el) => s + (el.confidence || 0), 0) / group.length;
    const allLeft = group.map(e => e.frame.left);
    const allTop = group.map(e => e.frame.top);
    const allRight = group.map(e => e.frame.left + e.frame.width);
    const allBottom = group.map(e => e.frame.top + e.frame.height);
    const left = Math.min(...allLeft);
    const top = Math.min(...allTop);
    const right = Math.max(...allRight);
    const bottom = Math.max(...allBottom);
    const boundingBox = { left: Math.round(left), top: Math.round(top), width: Math.round(Math.max(0, right - left)), height: Math.round(Math.max(0, bottom - top)) };
    return {
      text,
      confidence: avgConfidence,
      boundingBox,
      elements: group.map(el => ({ text: el.text, confidence: el.confidence, frame: el.frame, paragraph: el.paragraph }))
    };
  }
}

export default Ocr;