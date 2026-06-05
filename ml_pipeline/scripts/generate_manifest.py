import os, json, hashlib

def hash_file(path):
    h = hashlib.sha256()
    with open(path, 'rb') as f:
        for chunk in iter(lambda: f.read(8192), b''):
            h.update(chunk)
    return h.hexdigest()

def main():
    base = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'tflite_models'))
    manifest = {}
    for fname in os.listdir(base):
        if fname.lower().endswith('.tflite'):
            manifest[fname] = hash_file(os.path.join(base, fname))
    with open(os.path.join(base, 'manifest.json'), 'w') as out:
        json.dump(manifest, out, indent=2)
    print('Manifest written with', len(manifest), 'entries')

if __name__ == '__main__':
    main()
