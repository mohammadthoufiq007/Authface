import Foundation
import TensorFlowLite
import UIKit

class FaceAuthEngine {
    private var detectionModel: Interpreter?
    private var livenessModel: Interpreter?
    private var recognitionModel: Interpreter?
    
    // Config Sizes
    private let detInputSize = 500
    private let livenessInputSize = 80
    private let recogInputSize = 112
    private let embeddingSize = 128
    
    init() {
        // Load the TFLite models from the main bundle
        do {
            if let detPath = Bundle.main.path(forResource: "det_500m", ofType: "tflite") {
                detectionModel = try Interpreter(modelPath: detPath)
                try detectionModel?.allocateTensors()
            }
            if let livePath = Bundle.main.path(forResource: "liveness", ofType: "tflite") {
                livenessModel = try Interpreter(modelPath: livePath)
                try livenessModel?.allocateTensors()
            }
            if let recogPath = Bundle.main.path(forResource: "mobilefacenet", ofType: "tflite") {
                recognitionModel = try Interpreter(modelPath: recogPath)
                try recognitionModel?.allocateTensors()
            }
        } catch let error {
            print("Failed to load TFLite models: \(error.localizedDescription)")
        }
    }
    
    func processFrame(image: UIImage) -> [Float]? {
        // 1. Detect Face
        guard let faceBox = detectFace(image: image) else { return nil }
        
        // 2. Crop
        guard let faceImage = cropImage(image: image, rect: faceBox) else { return nil }
        
        // 3. Check Liveness
        if !checkLiveness(faceImage: faceImage) {
            return nil // Reject
        }
        
        // 4. Extract Embedding
        return extractEmbedding(faceImage: faceImage)
    }
    
    private func detectFace(image: UIImage) -> CGRect? {
        guard let model = detectionModel else { return nil }
        
        let inputData = convertImageToData(image: image, size: detInputSize)
        do {
            try model.copy(inputData, toInputAt: 0)
            try model.invoke()
            let outputTensor = try model.output(at: 0)
            // Simplified box parsing logic
            return CGRect(x: 0, y: 0, width: image.size.width, height: image.size.height)
        } catch {
            return nil
        }
    }
    
    private func checkLiveness(faceImage: UIImage) -> Bool {
        guard let model = livenessModel else { return false }
        
        let inputData = convertImageToData(image: faceImage, size: livenessInputSize)
        do {
            try model.copy(inputData, toInputAt: 0)
            try model.invoke()
            let outputTensor = try model.output(at: 0)
            let results = outputTensor.data.toArray(type: Float32.self)
            
            let spoofScore = results[0]
            let liveScore = results[1]
            
            return liveScore > spoofScore
        } catch {
            return false
        }
    }
    
    private func extractEmbedding(faceImage: UIImage) -> [Float]? {
        guard let model = recognitionModel else { return nil }
        
        let inputData = convertImageToData(image: faceImage, size: recogInputSize)
        do {
            try model.copy(inputData, toInputAt: 0)
            try model.invoke()
            let outputTensor = try model.output(at: 0)
            return outputTensor.data.toArray(type: Float32.self)
        } catch {
            return nil
        }
    }
    
    private func convertImageToData(image: UIImage, size: Int) -> Data {
        // Basic RGB conversion mock
        let count = size * size * 3
        var floatArray = [Float](repeating: 0.0, count: count)
        // Insert pixel decoding here
        return Data(buffer: UnsafeBufferPointer(start: &floatArray, count: count))
    }
    
    private func cropImage(image: UIImage, rect: CGRect) -> UIImage? {
        return image
    }
}

extension Data {
    func toArray<T>(type: T.Type) -> [T] where T: AdditiveArithmetic {
        var array = [T](repeating: T.zero, count: self.count/MemoryLayout<T>.stride)
        _ = array.withUnsafeMutableBytes { self.copyBytes(to: $0) }
        return array
    }
}
