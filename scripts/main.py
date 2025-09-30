import time
import gc
import psutil
import math
import numpy as np
from PIL import Image, ImageEnhance
import io
import json
import sys
import os
from pathlib import Path

# Register support for additional formats like AVIF and HEIF
try:
    from pillow_heif import register_heif_opener, register_avif_opener
    register_heif_opener()
    register_avif_opener()
    print("[INFO] pillow_heif registered for AVIF/HEIF support", file=sys.stderr)
except ImportError:
    print("[WARNING] pillow_heif not installed, AVIF and HEIF support may be limited", file=sys.stderr)

# Global OCR instance
_reader = None
_current_language = "en"

def log_memory_usage(stage: str = ""):
    if stage:
        print(f"[MEMORY {stage}]", file=sys.stderr)
    try:
        current_mem = psutil.Process().memory_info().rss / 1024 / 1024
        print(f"[MEMORY] Current process: {current_mem:.2f} MB", file=sys.stderr)
    except:
        print(f"[MEMORY] Could not get memory info", file=sys.stderr)

def get_reader(languages="en"):
    global _reader, _current_language
    if _reader is None or _current_language != languages:
        log_memory_usage("Creating Reader")
        try:
            from rapidocr_onnxruntime import RapidOCR
        except ImportError as e:
            print(f"[ERROR] Failed to import RapidOCR: {e}", file=sys.stderr)
            raise

        try:
            print(f"[INFO] Initializing RapidOCR for language: {languages}", file=sys.stderr)
            
            # Memory-efficient OCR initialization
            ocr = RapidOCR(
                det_db_thresh=0.3,
                det_db_box_thresh=0.4,
                det_db_unclip_ratio=1.6,
                use_dilation=False,
                rec_image_height=32,
            )
            
            _reader = {
                "ocr": ocr,
                "language": languages
            }
            _current_language = languages
            
            print(f"[SUCCESS] RapidOCR initialized for {languages}", file=sys.stderr)
            
        except Exception as e:
            print(f"[ERROR] Failed to initialize RapidOCR: {e}", file=sys.stderr)
            raise

        log_memory_usage("Reader Created")
    return _reader

def optimize_image_for_ocr(pil_image):
    """Optimize image for OCR while keeping memory low"""
    try:
        if pil_image.mode != 'RGB':
            pil_image = pil_image.convert('RGB')
        
        width, height = pil_image.size
        print(f"[INFO] Original: {width}x{height}", file=sys.stderr)
        
        # Memory-efficient resizing
        max_dimension = 1200
        if width > max_dimension or height > max_dimension:
            ratio = min(max_dimension / width, max_dimension / height)
            new_width = int(width * ratio)
            new_height = int(height * ratio)
            pil_image = pil_image.resize((new_width, new_height), Image.Resampling.LANCZOS)
            print(f"[INFO] Resized to: {new_width}x{new_height}", file=sys.stderr)
        
        # Basic enhancement for all languages
        enhancer = ImageEnhance.Contrast(pil_image)
        pil_image = enhancer.enhance(1.3)
        
        enhancer = ImageEnhance.Sharpness(pil_image)
        pil_image = enhancer.enhance(1.4)
        
        print(f"[INFO] Image optimization completed", file=sys.stderr)
        return pil_image
        
    except Exception as e:
        print(f"[WARNING] Image optimization failed: {str(e)}", file=sys.stderr)
        return pil_image

def process_image_bytes(image_path):
    """Convert image file to numpy array with memory optimization"""
    try:
        image_path = str(Path(image_path))
        if not os.path.exists(image_path):
            raise ValueError(f"Image file does not exist: {image_path}")
        
        print(f"[INFO] Loading image: {image_path}", file=sys.stderr)
        
        with open(image_path, "rb") as f:
            image_bytes = f.read()
        
        pil_image = Image.open(io.BytesIO(image_bytes))
        optimized_image = optimize_image_for_ocr(pil_image)
        
        numpy_image = np.array(optimized_image)
        del optimized_image, pil_image
        gc.collect()
        
        bgr_image = numpy_image[:, :, ::-1]
        
        print(f"[INFO] Image processed: {numpy_image.shape[1]}x{numpy_image.shape[0]}", file=sys.stderr)
        return bgr_image
        
    except Exception as e:
        raise ValueError(f"Failed to process image: {str(e)}")

def calculate_bbox_properties(bbox):
    """Calculate center, width, height from bbox coordinates"""
    xs = [point[0] for point in bbox]
    ys = [point[1] for point in bbox]
    
    left = min(xs)
    right = max(xs)
    top = min(ys)
    bottom = max(ys)
    
    center_x = (left + right) / 2
    center_y = (top + bottom) / 2
    width = right - left
    height = bottom - top
    
    return {
        'center_x': center_x,
        'center_y': center_y,
        'left': left,
        'right': right,
        'top': top,
        'bottom': bottom,
        'width': width,
        'height': height
    }

def calculate_distance(bbox1_props, bbox2_props):
    """Calculate distance between two bboxes"""
    dx = bbox1_props['center_x'] - bbox2_props['center_x']
    dy = bbox1_props['center_y'] - bbox2_props['center_y']
    return math.sqrt(dx*dx + dy*dy)

def is_horizontally_aligned(bbox1_props, bbox2_props, tolerance_factor=0.3):
    """Check if two bboxes are roughly horizontally aligned"""
    overlap_top = max(bbox1_props['top'], bbox2_props['top'])
    overlap_bottom = min(bbox1_props['bottom'], bbox2_props['bottom'])
    overlap_height = max(0, overlap_bottom - overlap_top)
    
    min_height = min(bbox1_props['height'], bbox2_props['height'])
    return overlap_height > (min_height * tolerance_factor)

def is_vertically_aligned(bbox1_props, bbox2_props, tolerance_factor=0.3):
    """Check if two bboxes are roughly vertically aligned"""
    overlap_left = max(bbox1_props['left'], bbox2_props['left'])
    overlap_right = min(bbox1_props['right'], bbox2_props['right'])
    overlap_width = max(0, overlap_right - overlap_left)
    
    min_width = min(bbox1_props['width'], bbox2_props['width'])
    return overlap_width > (min_width * tolerance_factor)

def should_merge_bubbles(bbox1_props, bbox2_props, max_distance_factor=2.0):
    """Determine if two text bubbles should be merged"""
    avg_width = (bbox1_props['width'] + bbox2_props['width']) / 2
    avg_height = (bbox1_props['height'] + bbox2_props['height']) / 2
    avg_size = (avg_width + avg_height) / 2
    
    distance = calculate_distance(bbox1_props, bbox2_props)
    relative_distance = distance / avg_size if avg_size > 0 else float('inf')
    
    if relative_distance > max_distance_factor:
        return False
    
    h_aligned = is_horizontally_aligned(bbox1_props, bbox2_props)
    v_aligned = is_vertically_aligned(bbox1_props, bbox2_props)
    
    if relative_distance < 1.5 and (h_aligned or v_aligned):
        return True
    
    if relative_distance < 0.8:
        return True
    
    return False

def manga_reading_order_sort(results):
    """Sort results in manga reading order (right-to-left, top-to-bottom)"""
    def sort_key(item):
        bbox, text, score = item
        props = calculate_bbox_properties(bbox)
        return (props['center_y'], -props['center_x'])
    
    return sorted(results, key=sort_key)

def calculate_collective_bbox(paragraph_items):
    """Calculate collective bbox for paragraph"""
    if not paragraph_items:
        return None
    
    all_xs = []
    all_ys = []
    
    for item in paragraph_items:
        bbox = item['bbox']
        for point in bbox:
            all_xs.append(point[0])
            all_ys.append(point[1])
    
    min_x = min(all_xs)
    max_x = max(all_xs)
    min_y = min(all_ys)
    max_y = max(all_ys)
    
    return [
        [min_x, min_y],
        [max_x, min_y],
        [max_x, max_y],
        [min_x, max_y]
    ]

def group_paragraphs(results, max_distance_factor=2.0):
    """Advanced paragraph grouping for manga with EXACT same logic as JavaScript"""
    if not results:
        return []
    
    sorted_results = manga_reading_order_sort(results)
    
    items_with_props = []
    for bbox, text, score in sorted_results:
        props = calculate_bbox_properties(bbox)
        items_with_props.append({
            'bbox': bbox,
            'text': text,
            'score': score,
            'props': props,
            'used': False
        })
    
    paragraphs = []
    
    for i, current_item in enumerate(items_with_props):
        if current_item['used']:
            continue
            
        paragraph_items = [current_item]
        current_item['used'] = True
        
        search_expanded = True
        while search_expanded:
            search_expanded = False
            
            for j, candidate_item in enumerate(items_with_props):
                if candidate_item['used']:
                    continue
                
                should_merge = False
                for para_item in paragraph_items:
                    if should_merge_bubbles(
                        para_item['props'], 
                        candidate_item['props'], 
                        max_distance_factor
                    ):
                        should_merge = True
                        break
                
                if should_merge:
                    paragraph_items.append(candidate_item)
                    candidate_item['used'] = True
                    search_expanded = True
        
        # order inside paragraph - EXACT SAME AS JAVASCRIPT
        paragraph_items.sort(key=lambda x: (
            x['props']['center_y'], 
            -x['props']['center_x']  # Negative for right-to-left
        ))
        
        paragraph_text = ' '.join([item['text'] for item in paragraph_items])
        collective_bbox = calculate_collective_bbox(paragraph_items)
        avg_score = sum([item['score'] for item in paragraph_items]) / len(paragraph_items)
        
        individual_items = []
        for item in paragraph_items:
            individual_items.append({
                'bbox': item['bbox'],
                'text': item['text'],
                'score': item['score']
            })
        
        paragraph_data = {
            'text': paragraph_text,
            'bbox': collective_bbox,
            'score': avg_score,
            'item_count': len(paragraph_items),
            'individual_items': individual_items
        }
        
        paragraphs.append(paragraph_data)
    
    # EXACT SAME FINAL SORTING LOGIC AS JAVASCRIPT
    from functools import cmp_to_key
    
    def paragraph_comparator(a, b):
        a_props = calculate_bbox_properties(a['bbox'])
        b_props = calculate_bbox_properties(b['bbox'])
        
        # First, compare by vertical position (top coordinate)
        vertical_diff = a_props['top'] - b_props['top']
        if abs(vertical_diff) > a_props['height'] * 0.5:
            return -1 if vertical_diff < 0 else 1
        
        # If vertically aligned (within half the height), compare by horizontal position
        horizontal_diff = a_props['left'] - b_props['left']
        return -1 if horizontal_diff < 0 else 1
    
    paragraphs.sort(key=cmp_to_key(paragraph_comparator))
    
    return paragraphs

def init_reader(languages="en"):
    global _reader, _current_language
    start_time = time.time()
    try:
        log_memory_usage("Before Init")
        reader = get_reader(languages)
        end_time = time.time()
        print(f"[TIME] RapidOCR Initialization: {end_time - start_time:.3f}s", file=sys.stderr)
        log_memory_usage("After Init")
        return json.dumps({
            "status": "success",
            "message": f"RapidOCR initialized for {languages}",
            "langs": languages,
            "memory_usage": f"~{psutil.Process().memory_info().rss / 1024 / 1024:.0f}MB"
        })
    except Exception as e:
        log_memory_usage("Init Failed")
        return json.dumps({"status": "error", "message": f"Failed to initialize RapidOCR: {str(e)}"})

def read_text(image_path, languages="en"):
    global _reader
    if _reader is None:
        get_reader(languages)
    
    image_path = str(Path(image_path))
    if not os.path.exists(image_path):
        return json.dumps({"status": "error", "message": f"Image not found: {image_path}"})
    
    try:
        log_memory_usage("Before Processing")
        start_time = time.time()
        gc.collect()
        
        reader = get_reader(languages)
        ocr = reader["ocr"]

        print(f"[INFO] Processing image with language: {languages}", file=sys.stderr)
        print(f"[INFO] Image path: {image_path}", file=sys.stderr)
        
        numpy_image = process_image_bytes(image_path)
        
        print(f"[INFO] Running OCR...", file=sys.stderr)
        results, elapse = ocr(numpy_image)
        
        # Handle elapse if it's a list or tuple (e.g., breakdown of times)
        if isinstance(elapse, (list, tuple)):
            elapse = sum(elapse)
        
        del numpy_image
        gc.collect()
        
        print(f"[INFO] OCR completed in {elapse:.3f}s", file=sys.stderr)

        if not results:
            return json.dumps({
                "status": "success",
                "data": [],
                "paragraphs": [],
                "message": "No text detected in image"
            })

        fixed_results = []
        total_confidence = 0
        
        for box, text, score in results:
            cleaned_text = text.strip()
            if cleaned_text and score >= 0.1:
                fixed_results.append({
                    "bbox": box,
                    "text": cleaned_text,
                    "confidence": float(score)
                })
                total_confidence += float(score)

        grouped_paragraphs = group_paragraphs(
            [(res["bbox"], res["text"], res["confidence"]) for res in fixed_results]
        )

        total_time = time.time() - start_time
        avg_confidence = total_confidence / len(fixed_results) if fixed_results else 0
        high_confidence = sum(1 for res in fixed_results if res["confidence"] > 0.7)

        print(f"[SUCCESS] Found {len(fixed_results)} text elements in {total_time:.2f}s", file=sys.stderr)
        print(f"[ACCURACY] Avg confidence: {avg_confidence:.3f}", file=sys.stderr)

        gc.collect()
        log_memory_usage("After Processing")

        return json.dumps({
            "status": "success",
            "data": fixed_results,
            "paragraphs": grouped_paragraphs,
            "stats": {
                "total_lines": len(fixed_results),
                "total_paragraphs": len(grouped_paragraphs),
                "processing_time": f"{total_time:.3f}s",
                "image_size": os.path.getsize(image_path),
                "average_confidence": f"{avg_confidence:.3f}",
                "high_confidence_ratio": f"{high_confidence}/{len(fixed_results)}",
                "language": languages
            },
            "memory_usage": f"~{psutil.Process().memory_info().rss / 1024 / 1024:.0f}MB"
        })

    except Exception as e:
        log_memory_usage("Processing Failed")
        return json.dumps({"status": "error", "message": f"Error processing image: {str(e)}"})
    finally:
        gc.collect()

def close_reader():
    global _reader
    log_memory_usage("Before Close")
    if _reader is not None:
        del _reader
        _reader = None
    gc.collect()
    log_memory_usage("After Close")
    return json.dumps({"status": "success", "message": "OCR cleaned up"})

def process_command(command, args):
    try:
        if command == "init":
            return init_reader(args)
        elif command == "read_text":
            # Handle both path and language
            parts = args.split(maxsplit=1)
            image_path = parts[0].strip('"')
            language = parts[1].strip('"') if len(parts) > 1 else "en"
            return read_text(image_path, language)
        elif command == "close":
            return close_reader()
        else:
            return json.dumps({"status": "error", "message": "Invalid command"})
    except Exception as e:
        return json.dumps({"status": "error", "message": f"Command processing error: {str(e)}"})

if __name__ == "__main__":
    import io
    import logging
    
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8")
    
    logging.getLogger("rapidocr_onnxruntime").setLevel(logging.ERROR)

    print("[INFO] Multi-language OCR Server ready (Memory Optimized)", file=sys.stderr)
    print("[INFO] Supported commands: init <lang>, read_text <path> <lang>, close", file=sys.stderr)
    
    while True:
        try:
            line = sys.stdin.readline()
            if not line:
                break
            line = line.strip()
            if not line:
                continue
                
            parts = line.split(maxsplit=1)
            command = parts[0]
            args = parts[1] if len(parts) > 1 else ""
            
            print(f"[DEBUG] Processing: {command} {args}", file=sys.stderr)
            result = process_command(command, args)
            
            sys.stdout.write(result + "\n")
            sys.stdout.flush()
            
            if command == "close":
                break
                
        except Exception as e:
            error_result = json.dumps({"status": "error", "message": str(e)})
            sys.stdout.write(error_result + "\n")
            sys.stdout.flush()