import { AutoModel, AutoProcessor, env, RawImage } from '@xenova/transformers';

// Since we will download the model from the Hugging Face Hub, we can skip the local model check
env.allowLocalModels = false;

// Proxy the WASM backend to prevent the UI from freezing
env.backends.onnx.wasm.proxy = true;

const model = await AutoModel.from_pretrained('briaai/RMBG-1.4', {
  config: { model_type: 'custom' },
});

const processor = await AutoProcessor.from_pretrained('briaai/RMBG-1.4', {
  config: {
      do_normalize: true,
      do_pad: false,
      do_rescale: true,
      do_resize: true,
      image_mean: [0.5, 0.5, 0.5],
      feature_extractor_type: "ImageFeatureExtractor",
      image_std: [1, 1, 1],
      resample: 2,
      rescale_factor: 0.00392156862745098,
      size: { width: 1024, height: 1024 },
  }
});

export const predict = async (url: string) =>  {
  // Read image
  const image = await RawImage.fromURL(url);

  // Preprocess image
  const { pixel_values } = await processor(image);

  // Predict alpha matte
  const { output } = await model({ input: pixel_values });

  const pixelData = image.rgba();
  // Resize mask back to original size
  const mask = await RawImage.fromTensor(output[0].mul(255).to('uint8')).resize(image.width, image.height);
  // Convert alpha channel to 4th channel
  for (let i = 0; i < mask.data.length; ++i) {
    pixelData.data[4 * i + 3] = mask.data[i];
  }
  return (pixelData.toSharp());
}